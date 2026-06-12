import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";

// 1. Define configuration schema for the plugin
const configSchema = Type.Object({
  unit: Type.Optional(
    Type.Union([Type.Literal("metric"), Type.Literal("imperial")], {
      description: "Default temperature unit system (metric or imperial)",
      default: "metric",
    })
  ),
});

// 2. Export the plugin using defineToolPlugin
export default defineToolPlugin({
  id: "openclaw-plugin-aqua",
  name: "OpenClaw Plugin Aqua",
  description: "An OpenClaw plugin for water-related conversions and status checks.",
  configSchema,
  tools: (tool) => [
    tool({
      name: "aqua_ping",
      description: "Perform a system check of the Aqua plugin configuration.",
      parameters: Type.Object({}),
      execute: (_params, config) => {
        return {
          status: "healthy",
          timestamp: new Date().toISOString(),
          configuredUnit: config.unit || "metric",
        };
      },
    }),
    tool({
      name: "aqua_temperature_convert",
      description: "Convert a water temperature between Celsius and Fahrenheit.",
      parameters: Type.Object({
        temperature: Type.Number({ description: "The temperature value to convert" }),
        from: Type.Union([Type.Literal("C"), Type.Literal("F")], {
          description: "Source unit ('C' for Celsius, 'F' for Fahrenheit)",
        }),
      }),
      execute: (params) => {
        const { temperature, from } = params;
        if (from === "C") {
          const converted = (temperature * 9) / 5 + 32;
          return {
            original: `${temperature}°C`,
            converted: `${converted.toFixed(1)}°F`,
          };
        } else {
          const converted = ((temperature - 32) * 5) / 9;
          return {
            original: `${temperature}°F`,
            converted: `${converted.toFixed(1)}°C`,
          };
        }
      },
    }),
  ],
});
export { configSchema };
