---
project_name: 'dk_verseny'
user_name: 'Bozsó Krisztián'
date: '2026-03-13T23:20:00+01:00'
sections_completed:
  ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 32
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Core:** JavaScript ES6+ (Vanilla JS for engine, Vue 3.3.0 for app shell)
- **State Management:** Pinia 2.1.0, SEL (State-Eventbus-Logger) architecture
- **Graphics & VFX:** Three.js 0.183.1, WebGL Shaders
- **Audio:** Web Audio API (Zero-latency)
- **Build Tool:** Vite 7.3.0
- **Testing:** Jest 29.7.0, Cypress 13.6.0
- **Styling:** CSS3, BEM methodology, `design-system.css`
- **Linting/Formatting:** ESLint 8.55.0, Prettier 3.1.0
- **Environment:** Node.js >= 18.0.0

## Critical Implementation Rules

### Language-Specific Rules

- **ES6+ Standards:** Always use arrow functions, destructuring, and template literals for better readability.
- **Module Architecture:** Strictly follow `import/export` patterns for all modules and components.
- **Shared Constants:** Use central files (e.g., `src/core/events/EventTypes.js`) for shared constants to prevent typos and ensure consistency.
- **Error Handling:** Implement `try...catch` blocks for all asynchronous operations (API, video, audio loading) with mandatory `GameLogger` integration.
- **Robustness:** Use fallback mechanisms (e.g., `_prodShouldSkipSlide`) to ensure the application remains functional even if some assets are missing.

### Framework-Specific Rules

- **SEL Architecture:** All state changes must go through the `StateManager`, triggering events on the `EventBus`. Components must never modify each other's state directly.
- **Three.js & Shaders:** Use two-pass rendering for complex VFX. Always call `dispose()` on geometries, materials, and textures when destroying components to prevent memory leaks.
- **Lifecycle Management:** Every custom component (Task Engine) must implement a `destroy()` method to clean up DOM elements, event listeners, and timeouts.

### Testing Rules

- **Test Organization:** Unit tests must be placed in `__tests__` directories relative to the source file. Use `*.test.js` or `*.spec.js` naming conventions.
- **Mocking Strategy:** Always mock external dependencies (Video API, LocalStorage, network requests) in unit tests using `jest.mock()` to ensure deterministic results.
- **Coverage Goals:** Maintain 80%+ coverage for core business logic, including state management, event handling, and scoring algorithms.
- **E2E Scenarios:** Use Cypress for critical user journey validation (e.g., complete registration, station navigation, task completion).

### Code Quality & Style Rules

- **Coding Standard:** Follow strict ESLint and Prettier configurations. Avoid `var`; use `const` for immutables and `let` for variables.
- **Naming Conventions:** Use `PascalCase` for components/classes and `camelCase` for variables/utilities. CSS classes must use `kebab-case` with the `.dkv-` prefix (BEM style).
- **Prohibited Patterns:** `console.log` is forbidden in production; use the built-in `GameLogger`.
- **Documentation:** Hungarian JSDoc comments are mandatory for all public methods and modules.
- **Changelog:** Maintain the `CHANGELOG.md` file in Hungarian, following Semantic Versioning (SemVer) principles.

### Development Workflow Rules

- **Branching:** Use `feature/`, `bugfix/`, or `task/` prefixes for all branches (e.g., `feature/onboarding-ui`).
- **Commits:** Provide descriptive Hungarian commit messages (e.g., `feat: Karakterválasztó felület implementálása`).
- **QA Gate:** Run `npm run lint` and all tests (`npm run test`) before submitting a Pull Request.
- **Resource Integrity:** Verify that all static assets (videos, audio) are correctly optimized and accessible before any production deployment.

### Critical Don't-Miss Rules

- **Memory Leaks:** NEVER use `setInterval` or `addEventListener` without explicit cleanup in the `destroy()` method.
- **State Persistence:** NEVER write directly to `localStorage`. All persistence must be handled via the `StateManager`.
- **Audio Policies:** Respect browser autoplay policies; initialize Web Audio context only after the first user interaction.
- **Asset Loading:** Use asynchronous loading for all large assets (videos, 3D models) with appropriate UI feedback (loaders/spinners).
- **Security:** Use `SecureStorage` for all sensitive user data.
- **Performance:** Optimize rendering loop; avoid constant 60 FPS updates for static scenes.

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code.
- Follow ALL rules exactly as documented.
- When in doubt, prefer the more restrictive option.
- Update this file if new patterns emerge.

**For Humans:**
- Keep this file lean and focused on agent needs.
- Update when technology stack changes.
- Review quarterly for outdated rules.

Last Updated: 2026-03-13T23:20:00+01:00
