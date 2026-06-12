# Git Guidelines for Coding Agents

This document defines the git commit guidelines for collaborative agentic workflows in this repository.

## 1. Conventional Commits
All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This helps automate release versioning and changelogs.

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Examples
- `feat(tool): add water temperature conversion tool`
- `docs(readme): update build and validation instructions`
- `chore: configure tsconfig for ESM output`

---

## 2. Atomic Commits
Keep commits **atomic**. An atomic commit is a single, logical unit of change.

### Guidelines
- **Single Responsibility**: Each commit should do exactly one thing (e.g., fix a bug, add a feature, refactor a function).
- **Working State**: The codebase must build and pass tests at every single commit. Never commit broken code.
- **Ease of Code Review**: Small, focused commits are significantly easier to review, revert, or cherry-pick.

---

## 3. Tool Selection Guidelines for Agents
When interacting with a user to perform icon or screenshot tasks:
- **Icons**: If the user asks for an icon, use `aqua_create_icon_set` unless the user explicitly asks for a single PNG (in which case, use `aqua_create_icon`).
- **Screenshots**: If the user asks for screenshots, use `aqua_create_screenshot_set`.
- **Single Screenshot**: If the user asks to modify or create a single screenshot, use `aqua_create_screenshot`.

