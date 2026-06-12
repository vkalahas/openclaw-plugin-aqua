---
name: aqua
description: Generate App Store icons, app icons, and screenshots for iOS apps.
metadata:
  { "openclaw": { "emoji": "📱", "requires": { "config": ["plugins.entries.openclaw-plugin-aqua.enabled"] } } }
---

# iOS App Store Asset Generation (Aqua)

Use this skill when the user asks for app icons, screenshots, App Store icons, App Store screenshots, or related assets for their iOS application.

## Tool Routing Guidelines

When the user asks for iOS or App Store assets, use the following rules to select the correct tool:

- **App Icons**:
  - By default, use `aqua_create_icon_set` to generate an App Store icon set ZIP archive containing various icon sizes.
  - Use `aqua_create_icon` ONLY when the user explicitly asks for a single PNG file.
- **Screenshots**:
  - By default, use `aqua_create_screenshot_set` to generate a polished set of App Store screenshots from multiple raw captures.
  - Use `aqua_create_screenshot` ONLY when the user asks to modify or create a single screenshot.

## Input Requirements

- **Raw Capture Image Size**: For both `aqua_create_screenshot` and `aqua_create_screenshot_set`, any input raw iPhone captures must be exactly 1206x2622 px PNG files.
- **Prompt Details**: App icon prompts must be visual descriptions (max 500 characters, no URLs/links allowed).
