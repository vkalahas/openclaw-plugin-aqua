import fs from "node:fs/promises";
import path from "node:path";
import { Type } from "typebox";
import JSZip from "jszip";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";
import { Aqua } from "./client.js";
import type { ScreenshotCopy } from "./client.js";

// 1. Define configuration schema for the plugin
const configSchema = Type.Object({
  apiKey: Type.Optional(
    Type.String({
      description: "Aqua developer API key. If not provided, the AQUA_API_KEY environment variable will be used."
    })
  ),
  baseUrl: Type.Optional(
    Type.String({
      description: "Optional custom base URL for the Aqua API. Defaults to https://api.aqua-app.com.",
      default: "https://api.aqua-app.com"
    })
  )
});

// Helper to construct Aqua client using configured API key or environment variable
function getClient(config: { apiKey?: string; baseUrl?: string }) {
  const apiKey = config.apiKey || process.env.AQUA_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Aqua API key is required. Please set the AQUA_API_KEY environment variable or configure the 'apiKey' plugin setting."
    );
  }
  return new Aqua({
    apiKey,
    baseUrl: config.baseUrl || "https://api.aqua-app.com"
  });
}

// 2. Define and export the plugin using defineToolPlugin
export default defineToolPlugin({
  id: "openclaw-plugin-aqua",
  name: "OpenClaw Plugin Aqua",
  description: "An OpenClaw plugin for App Store icon and screenshot generation using the Aqua Developer API.",
  configSchema,
  tools: (tool) => [
    // 1. Tool to generate a single master icon PNG
    tool({
      name: "aqua_create_icon",
      description: "Generates a single high-quality master App Store icon PNG file from a text prompt. Use this tool ONLY when the user explicitly asks for a single PNG file. If the user just asks for an icon or icon set in general, use aqua_create_icon_set instead.",
      parameters: Type.Object({
        prompt: Type.String({
          description: "Visual description of the app icon (max 500 characters, e.g. 'minimal blue finance app icon with a subtle chart'). No URLs/links allowed.",
          maxLength: 500
        }),
        outputPath: Type.String({
          description: "Local path to save the generated PNG file (e.g. './icon.png')"
        })
      }),
      execute: async (params, config) => {
        const client = getClient(config);
        const blob = await client.generateIconPng({ prompt: params.prompt });
        
        // Write the PNG blob to the target outputPath
        const buffer = Buffer.from(await blob.arrayBuffer());
        const resolvedPath = path.resolve(params.outputPath);
        await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
        await fs.writeFile(resolvedPath, buffer);

        return {
          message: "App Store icon generated successfully.",
          path: resolvedPath,
          sizeBytes: buffer.length
        };
      }
    }),

    // 2. Tool to generate an App Store icon set (.icon ZIP bundle)
    tool({
      name: "aqua_create_icon_set",
      description: "Generates an App Store icon set ZIP bundle containing various icon sizes from a text prompt. Use this tool by default whenever the user asks for an app icon, unless the user explicitly requests a single PNG icon.",
      parameters: Type.Object({
        prompt: Type.String({
          description: "Visual description of the app icon set (max 500 characters). No URLs/links allowed.",
          maxLength: 500
        }),
        outputPath: Type.String({
          description: "Local path to save the generated ZIP archive (e.g. './icon_set.zip')"
        })
      }),
      execute: async (params, config) => {
        const client = getClient(config);
        const blob = await client.generateIconSet({ prompt: params.prompt });
        
        // Write the ZIP blob to the target outputPath
        const buffer = Buffer.from(await blob.arrayBuffer());
        const resolvedPath = path.resolve(params.outputPath);
        await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
        await fs.writeFile(resolvedPath, buffer);

        return {
          message: "App Store icon set generated successfully.",
          path: resolvedPath,
          sizeBytes: buffer.length
        };
      }
    }),

    // 3. Tool to generate a single polished App Store screenshot from a raw capture
    tool({
      name: "aqua_create_screenshot",
      description: "Polishes a raw portrait iPhone capture into a finished App Store listing screenshot with header copy. Use this tool when the user asks to modify or create a single screenshot. If the user asks to generate screenshots in general, use aqua_create_screenshot_set instead.",
      parameters: Type.Object({
        appDisplayName: Type.String({
          description: "The name of the app to display in the screenshot header (max 120 characters).",
          maxLength: 120
        }),
        fontPairing: Type.Optional(
          Type.Union([
            Type.Literal("editorial"),
            Type.Literal("modern"),
            Type.Literal("clean"),
            Type.Literal("bold"),
            Type.Literal("warm"),
            Type.Literal("luxury"),
            Type.Literal("sport"),
            Type.Literal("dev")
          ], { description: "Typography combination style. Defaults to 'editorial'." })
        ),
        slot: Type.Optional(
          Type.Number({
            description: "Screenshot slot number (1-5, defaults to 1).",
            minimum: 1,
            maximum: 5,
            default: 1
          })
        ),
        position: Type.Optional(
          Type.Union([
            Type.Literal("iphone_full_with_text_top"),
            Type.Literal("iphone_bottom_with_text_top"),
            Type.Literal("iphone_top_with_text_bottom")
          ], { description: "Placement of the mockup device and copy alignment. Defaults to 'iphone_full_with_text_top'." })
        ),
        title: Type.Optional(
          Type.String({
            description: "Custom title copy for the screenshot. Omit or leave empty for auto-generated AI copy."
          })
        ),
        subtitle: Type.Optional(
          Type.String({
            description: "Custom subtitle copy for the screenshot. Omit or leave empty for auto-generated AI copy."
          })
        ),
        backgroundColor: Type.Optional(
          Type.String({
            description: "Background styling: 'auto' (AI selected), a hex code (e.g. '#1a1a2e'), a CSS gradient, or an Unsplash image URL.",
            default: "auto"
          })
        ),
        capturePath: Type.String({
          description: "Local path to the raw iPhone capture PNG file (size must be 1206x2622 px)."
        }),
        outputPath: Type.String({
          description: "Local path to save the polished output PNG screenshot (e.g. './screenshot.png')."
        })
      }),
      execute: async (params, config) => {
        const client = getClient(config);

        // Read raw capture file
        const resolvedCapturePath = path.resolve(params.capturePath);
        const captureBuffer = await fs.readFile(resolvedCapturePath);
        const captureBlob = new Blob([captureBuffer], { type: "image/png" });

        // Resolve copy parameters
        const hasCopy = params.title?.trim() || params.subtitle?.trim();
        const copyOption: ScreenshotCopy = hasCopy
          ? { title: params.title?.trim() || "", subtitle: params.subtitle?.trim() || "" }
          : "auto";

        const slot = params.slot ?? 1;

        // Make screenshots API call (returns a ZIP containing finished screenshots)
        const zipBlob = await client.generateScreenshots({
          appDisplayName: params.appDisplayName,
          fontPairing: params.fontPairing,
          screenshots: [
            {
              slot,
              position: params.position ?? "iphone_full_with_text_top",
              copy: copyOption,
              backgroundColor: params.backgroundColor || "auto",
              capture: captureBlob
            }
          ]
        });

        // Parse returned ZIP archive and extract the single PNG screenshot
        const zipData = await zipBlob.arrayBuffer();
        const zip = await JSZip.loadAsync(zipData);
        
        const targetFilename = `screenshot-${slot}.png`;
        let fileEntry = zip.file(targetFilename);

        // Fallback search if slot filenames vary
        if (!fileEntry) {
          const files = Object.keys(zip.files);
          const pngFile = files.find(f => f.toLowerCase().endsWith(".png"));
          if (pngFile) {
            fileEntry = zip.file(pngFile);
          }
        }

        if (!fileEntry) {
          throw new Error("Failed to locate the generated screenshot inside the API ZIP response.");
        }

        const pngBuffer = await fileEntry.async("nodebuffer");
        const resolvedOutputPath = path.resolve(params.outputPath);
        await fs.mkdir(path.dirname(resolvedOutputPath), { recursive: true });
        await fs.writeFile(resolvedOutputPath, pngBuffer);

        return {
          message: "App Store screenshot generated successfully.",
          path: resolvedOutputPath,
          sizeBytes: pngBuffer.length
        };
      }
    }),

    // 4. Tool to generate a set of polished screenshots from multiple captures
    tool({
      name: "aqua_create_screenshot_set",
      description: "Generates multiple polished App Store listing screenshots from raw captures and outputs a ZIP archive. Use this tool when the user asks for screenshots.",
      parameters: Type.Object({
        appDisplayName: Type.String({
          description: "The name of the app to display in the screenshot headers (max 120 characters).",
          maxLength: 120
        }),
        fontPairing: Type.Optional(
          Type.Union([
            Type.Literal("editorial"),
            Type.Literal("modern"),
            Type.Literal("clean"),
            Type.Literal("bold"),
            Type.Literal("warm"),
            Type.Literal("luxury"),
            Type.Literal("sport"),
            Type.Literal("dev")
          ], { description: "Typography combination style. Defaults to 'editorial'." })
        ),
        screenshots: Type.Array(
          Type.Object({
            slot: Type.Number({
              description: "Screenshot slot number (1 to 5).",
              minimum: 1,
              maximum: 5
            }),
            position: Type.Optional(
              Type.Union([
                Type.Literal("iphone_full_with_text_top"),
                Type.Literal("iphone_bottom_with_text_top"),
                Type.Literal("iphone_top_with_text_bottom")
              ], { description: "Placement of the mockup device and copy alignment. Defaults to 'iphone_full_with_text_top'." })
            ),
            title: Type.Optional(
              Type.String({
                description: "Custom title copy for this screenshot. Omit or leave empty for auto-generated AI copy."
              })
            ),
            subtitle: Type.Optional(
              Type.String({
                description: "Custom subtitle copy for this screenshot. Omit or leave empty for auto-generated AI copy."
              })
            ),
            backgroundColor: Type.Optional(
              Type.String({
                description: "Background styling: 'auto' (AI selected), a hex code, a CSS gradient, or an Unsplash image URL.",
                default: "auto"
              })
            ),
            capturePath: Type.String({
              description: "Local path to the raw iPhone capture PNG file for this slot (1206x2622 px)."
            })
          }),
          { description: "List of screenshot configurations (1 to 5 screenshots, slots must be unique)." }
        ),
        outputPath: Type.String({
          description: "Local path to save the generated ZIP archive containing all polished screenshots (e.g. './screenshots.zip')."
        })
      }),
      execute: async (params, config) => {
        const client = getClient(config);

        const screenshotInputs = [];
        for (const shot of params.screenshots) {
          const resolvedCapturePath = path.resolve(shot.capturePath);
          const captureBuffer = await fs.readFile(resolvedCapturePath);
          const captureBlob = new Blob([captureBuffer], { type: "image/png" });

          const hasCopy = shot.title?.trim() || shot.subtitle?.trim();
          const copyOption: ScreenshotCopy = hasCopy
            ? { title: shot.title?.trim() || "", subtitle: shot.subtitle?.trim() || "" }
            : "auto";

          screenshotInputs.push({
            slot: shot.slot,
            position: shot.position ?? "iphone_full_with_text_top",
            copy: copyOption,
            backgroundColor: shot.backgroundColor || "auto",
            capture: captureBlob
          });
        }

        const zipBlob = await client.generateScreenshots({
          appDisplayName: params.appDisplayName,
          fontPairing: params.fontPairing,
          screenshots: screenshotInputs
        });

        const buffer = Buffer.from(await zipBlob.arrayBuffer());
        const resolvedOutputPath = path.resolve(params.outputPath);
        await fs.mkdir(path.dirname(resolvedOutputPath), { recursive: true });
        await fs.writeFile(resolvedOutputPath, buffer);

        return {
          message: "App Store screenshot set generated successfully.",
          path: resolvedOutputPath,
          sizeBytes: buffer.length
        };
      }
    })
  ]
});
export { configSchema };
