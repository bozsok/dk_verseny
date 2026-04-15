---
project_name: 'dk_verseny'
user_name: 'Bozsó Krisztián'
date: '2026-04-15T23:05:00+02:00'
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

- **Core:** JavaScript ES6+ (**ES Modules (ESM)** mandatory, **Vanilla JS** for App Shell and Logic)
- **State Management:** **Custom GameStateManager**, SEL (State-Eventbus-Logger) architecture (Custom implementation, NOT Pinia)
- **Graphics & VFX:** Three.js 0.183.1, WebGL Shaders
- **Audio:** Web Audio API (Zero-latency motor, **Aszinkron Pufferelés** mandatory)
- **Build & Style:** Vite 7.3.0, **PostCSS (Autoprefixer, CSSnano)**, BEM methodology
- **Testing:** Jest 29.7.0, Cypress 13.6.0
- **Linting/Formatting:** ESLint 8.55.0, Prettier 3.1.0
- **Environment:** Node.js >= 18.0.0

## Critical Implementation Rules

### Language-Specific Rules

- **ES6+ Standards:** Always use arrow functions, destructuring, and template literals. **Named Exports** are preferred over default exports.
- **Naming Conventions:**
    - **PascalCase:** For all components, classes, and their corresponding files (e.g., `CharacterSlide.js`).
    - **SCREAMING_SNAKE_CASE:** For all constants and Event types (e.g., `GAME_START`).
    - **camelCase:** For all variables, properties, methods, and utility functions.
- **Error Handling & Async:**
    - Each critical async call (API, Audio, Asset load) must use a **strict boilerplate**: `try { loading=true; await ... } catch { GameLogger.error(...) } finally { loading=false; }`.
    - **No Floating Promises:** Every async call MUST be `await`-ed or explicitly `.catch()`-ed.
    - **Loading Counter:** If multiple concurrent requests are possible within a component, use a **counter** instead of a boolean (only stop loading when counter is 0).
    - **Lifecycle Events:** Complex loading states (VFX/Logic sync) must emit events to the `EventBus` to ensure consistent multi-pass initialization.
- **Lifecycle & Memory:**
    - Every complex object/class (Engine, Task) MUST implement a `destroy()` method for explicit cleanup of event listeners and timers.
    - **GC Safety:** Avoid object allocation (`new {}`, `new []`) inside high-frequency loops (animation frames, fast events) to prevent jank. Use **Object Pooling** if needed.
- **Constants:** Use central files (e.g., `src/core/events/EventTypes.js`) for all shared strings and constants to prevent typos.
- **Robustness:** Use fallback mechanisms (e.g., `_prodShouldSkipSlide`) to ensure the application remains functional even if some assets are missing.

### Framework-Specific Rules (Vanilla JS & SEL)

- **SEL Architecture:** All state changes must go through the **custom `StateManager`**, triggering events on the `EventBus`. Components must NEVER modify each other's style or state directly; always communicate via the Bus.
- **Three.js & Shaders:** Use two-pass rendering for complex VFX. Always call `dispose()` on geometries, materials, and textures when destroying components to prevent memory leaks.
- **Vanilla Component Pattern:** Components MUST be Classes that create DOM elements via `createElement()`.
    - **Targeted Updates:** Use specific methods (e.g., `updateScore()`) that modify individual DOM nodes. NEVER use full `innerHTML` re-renders inside high-frequency updates.
- **Lifecycle Management:** Every custom component MUST implement a `destroy()` method to clean up DOM elements, event listeners, and timeouts.

### Testing Rules

- **Current Status:** A projekt mostantól **>88%-os tesztlefedettséggel** rendelkezik a kritikus magmodulokban (`src/core/state`, `src/core/utils`).
- **Mandatory Test-First (New Features):** Every **new** core module (`src/core`, `src/utils`, `src/features`) MUST be accompanied by a `*.test.js` file.
- **Regression Protection:** When refactoring existing complex code (e.g., `SlideManager`, `StateManager`), a baseline unit test must be added first.
- **Mocking Strategy:** Always mock external dependencies (Video API, Web Audio API, LocalStorage, network) in Jest using `jest.mock()`.
- **E2E Scenarios (Cypress):** Critical user paths (Grade 3/4 flow) must have basic smoke tests as soon as the infrastructure allows.

### Code Quality & Style Rules

- **Coding Standard:** Follow strict ESLint and Prettier configurations. Avoid `var`; use `const` for immutables and `let` for variables.
- **CSS Naming:** Classes must use **kebab-case** with the `.dkv-` prefix (**BEM style**).
- **Prohibited Patterns:** `console.log` is forbidden in production; use the built-in `GameLogger`.
- **Documentation:** Hungarian JSDoc comments are mandatory for all public methods and modules.
- **Changelog:** Maintain the `CHANGELOG.md` file in Hungarian, following Semantic Versioning (SemVer) principles.

### Development Workflow Rules

- **Branching & PRs:** 
    - Use `feature/`, `bugfix/`, or `task/` prefixes for all branches.
    - **PR Mandate:** Direct commits to `main` are forbidden. All changes must go through a Pull Request or a rigorous simulated review by an AI agent on a separate branch.
- **Commits & Releases:**
    - Provide descriptive Hungarian commit messages (e.g., `feat: Karakterválasztó felület implementálása`).
    - **Tagging:** Use semantic Git Tags (e.g., `v0.10.0`) for every release candidate or competition milestone.
- **Environment & QA:**
    - **QA Gate:** Run `npm run lint` and all tests (`npm run test`) before merging any PR.
    - **Config Sync:** The `build-config.json` must always have "skipping" flags disabled by default on the `main` branch to prevent accidental production impact.
    - **Resource Integrity:** Verify that all static assets are correctly optimized and accessible before deployment.

### Swarm Integrity & Communication Rules

- **Integrity Gate Protocol:** If any technical blocker (e.g., EPERM error) or logical contradiction (e.g., conflict between protocol and direct user prohibition) occurs that prevents a **100% official** mission closure, the agent MUST halt and request guidance from the user.
- **Stop-on-Error Law:** If a Swarm script (e.g., `archive`) fails, switching to a manual fallback solution is forbidden without explicit user permission.
- **Conflict Resolution Law:** In case of contradictory instructions (e.g., "close everything" vs. "do not use git"), the conflict must be resolved with the user before taking action.
- **Physical Verification:** Before reporting completion, the agent MUST verify the physical state of the workspace (file locations, presence of expected artifacts) and report only the actual result as "completed".
- **Agent Integrity Law:** An agent MUST NEVER place its own internal model or assumptions before the project's fixed rules and protocols. In all cases, the local project context, the dedicated SKILL documentation, and the current physical state of the workspace take precedence over general assistant routines and assumptions.

### Critical Don't-Miss Rules

- **Memory Leaks & Disposal:**
    - NEVER use `setInterval`, `setTimeout`, or `addEventListener` on `window/document` without explicit cleanup in the `destroy()` method.
    - **GPU Disposal:** Every Three.js resource (`geometries`, `materials`, `textures`) MUST be explicitly `.dispose()`-ed in the `destroy()` method to prevent GPU memory bloat.
- **State & Timer Integrity:**
    - **Persistence Policy:** Use the **StateManager** for all game-related and user-progress data.
    - **LocalStorage Bypasses:** Direct `localStorage` access is permitted **ONLY** for system-level flags (e.g., GDPR consent, Master/Debug mode) where the StateManager is not yet initialized or contextually inappropriate.
    - **No direct write:** Never write directly to `localStorage` for game progress; use `SecureStorage` (via StateManager).
    - **Timer Policy:** Only the `TimeManager` is allowed to modify the global competition clock. Components should only read the time via the `EventBus` or `StateManager`.
- **Portal & Navigation Safety:**
    - **Navigation Lock:** All navigation buttons MUST be disabled and `EventBus` navigation events ignored while a `PortalTransition` or Slide transition is in progress.
- **Audio Policies:** Respect browser autoplay policies; initialize Web Audio context only after the first user interaction.
- **Asset Loading:** Use asynchronous loading for all large assets (videos, 3D models) with appropriate UI feedback (**Loader/Progress UI**).
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
- **Teszt Lefedettség**: ~91% (Minden animációs modul stabilizálva, 88/88 teszt sikeres)
- **Utoljára frissítve**: 2026-04-15T23:05:00+02:00
- **Verzió**: v0.29.0 (Stable - Grade 4 HUD architecture fixed)
- **Státusz**: Sprint Archiválva (Grade 4 HUD Stabilized, EventBus-driven persistence implemented)
