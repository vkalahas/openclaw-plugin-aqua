# OpenClaw Plugin Aqua

An OpenClaw plugin for App Store icon and screenshot generation using the Aqua Developer API.

### Why use this plugin?
* **Instant App Store Asset Generation**: Create production-ready App Store screenshots and app icons in seconds right from your AI chat.
* **Polished Presets**: No need to manually align mockups or wrap images. The plugin handles typography pairing, device mockup placement, and custom backgrounds automatically.
* **Smart Intent Routing**: Includes a native OpenClaw skill that dynamically guides the agent to use the correct tool (e.g. generating an icon set vs a single PNG, or modifying a single screenshot vs building a screenshot set) based on your prompt.
* **Precision Copy Validation**: Built-in verification helps format titles and subtitles to avoid rendering errors or platform rejection.

## Installation & Quick Start

Get up and running with three simple steps:

### 1. Register the Plugin
Add the plugin directory to your `openclaw.json` configuration file (usually in `~/.openclaw/openclaw.json`):

```json
{
  "plugins": {
    "entries": {
      "openclaw-plugin-aqua": {
        "enabled": true,
        "localPath": "/absolute/path/to/openclaw-plugin-aqua"
      }
    }
  }
}
```

### 2. Configure your API Key
Add your Aqua API key to the `.env` file in your OpenClaw workspace:

```env
AQUA_API_KEY="your_aqua_api_key_here"
```

### 3. Build the Plugin
Run the build script in the plugin directory to compile the source code:
```bash
npm install && npm run build
```

Once installed, you can simply ask your OpenClaw agent to create icons or screenshots for your iOS application, and it will run the tools automatically!

## Features & Tools

This plugin exposes the following tools to the OpenClaw AI agent:

### 1. `aqua_create_icon`
* **Description:** Generates a single high-quality master App Store icon PNG file from a text prompt.
* **Parameters:**
  * `prompt` (String): Visual description of the app icon (max 500 characters, no URLs).
  * `outputPath` (String): Local path to save the generated PNG file (e.g. `./icon.png`).
* **Returns:** A success message, the resolved local file path, and the generated file size in bytes.

### 2. `aqua_create_icon_set`
* **Description:** Generates a full App Store icon set ZIP bundle containing various icon sizes from a text prompt.
* **Parameters:**
  * `prompt` (String): Visual description of the app icon set (max 500 characters, no URLs).
  * `outputPath` (String): Local path to save the generated ZIP archive (e.g. `./icon_set.zip`).
* **Returns:** A success message, the resolved local archive path, and the ZIP file size in bytes.

### 3. `aqua_create_screenshot`
* **Description:** Polishes a raw iPhone capture (1206x2622 px PNG) into a finished App Store listing screenshot with header copy, extracting it directly from the API response ZIP.
* **Parameters:**
  * `appDisplayName` (String): App name displayed in the screenshot header.
  * `fontPairing` (Optional String): Typography preset (e.g. `editorial`, `modern`, `clean`, `dev`, etc.).
  * `slot` (Optional Number): Screenshot slot index (1 to 5, defaults to 1).
  * `position` (Optional String): Device mockup and text alignment preset.
  * `title` (Optional String): Header title. Omit/leave empty for auto-generated AI copy.
  * `subtitle` (Optional String): Header subtitle. Omit/leave empty for auto-generated AI copy.
  * `backgroundColor` (Optional String): Background style (`auto`, hex code, gradient, or Unsplash URL).
  * `capturePath` (String): Path to the raw iPhone PNG capture file.
  * `outputPath` (String): Local path to save the polished output PNG screenshot (e.g. `./screenshot.png`).
* **Returns:** A success message, the resolved local output path, and the generated PNG size in bytes.

### 4. `aqua_create_screenshot_set`
* **Description:** Generates multiple polished App Store listing screenshots from multiple raw captures and outputs a ZIP archive.
* **Parameters:**
  * `appDisplayName` (String): App name displayed in screenshot headers.
  * `fontPairing` (Optional String): Typography preset.
  * `screenshots` (Array of configs): List of screenshot items (specifying `slot`, `position`, `title`, `subtitle`, `backgroundColor`, and `capturePath` per item).
  * `outputPath` (String): Local path to save the generated ZIP archive (e.g. `./screenshots.zip`).
* **Returns:** A success message, the resolved ZIP archive path, and the ZIP file size in bytes.

## Configuration Schema

The plugin accepts the following configuration fields in `openclaw.plugin.json` / gateway config:

* `apiKey` (Optional String): Aqua developer API key. If omitted, the `AQUA_API_KEY` environment variable is used.
* `baseUrl` (Optional String, default: `"https://api.aqua-app.com"`): Optional custom base URL for the Aqua API.

---

## Development & Build Workflow

### Prerequisites
* **Node.js:** v22.16.0 or newer
* **npm:** v10.0.0 or newer

### 1. Install Dependencies
Install the required TypeBox runtime dependency and developer toolchain:
```bash
npm install
```

### 2. Build TypeScript
Compile the TypeScript source code (`src/index.ts`) into ESM-compatible JavaScript output (`dist/index.js`):
```bash
npm run build
```

### 3. Validate Plugin Compatibility
Verify package manifest compatibility, entry points, and contracts offline using the `@openclaw/plugin-inspector` dev tool:
```bash
npm run plugin:check
```

To run a detailed inspection and generate report artifacts:
```bash
npm run plugin:inspect
```

Validation reports will be written under the `reports/` directory:
* `reports/plugin-inspector-report.md` — Full summary report
* `reports/plugin-inspector-issues.md` — Actionable issue list
* `reports/plugin-inspector-report.json` — Raw JSON report

---

## Folder Structure

```
.
├── dist/                     # Compiled JS outputs (generated by tsc)
├── src/
│   └── index.ts              # Plugin entry point (using defineToolPlugin)
├── types/
│   └── openclaw.d.ts         # Local SDK type declarations for development
├── openclaw.plugin.json      # Control-plane plugin manifest file
├── package.json              # Node package & OpenClaw configuration metadata
└── tsconfig.json             # TypeScript compiler settings
```
