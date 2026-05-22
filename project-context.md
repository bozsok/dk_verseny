---
project_name: 'dk_verseny'
user_name: 'Bozsó Krisztián'
date: '2026-05-22T23:30:00+02:00'
sections_completed:
  ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 37
optimized_for_llm: true
---

# Project Context for AI Agents

> [!CAUTION]
> **CRITICAL WARNING FOR AI AGENTS (THE SAGA LESSON):** 
> An agent recently caused structural chaos by prioritizing "Wow Aesthetics" and code completion over the **UNQA Swarm Protocol**.
> - **Error:** Reporting tasks as DONE while `done/` folders were empty.
> - **Error:** Archiving without moving task-specific subdirectories into `done/`.
> - **Root Cause:** **OVER-EAGERNESS (TÚLBUZGÓSÁG)**.
> - **Correction:** Every agent MUST physically verify the contents of the `done/` folder with `list_dir` BEFORE reporting completion. Administrative integrity is EQUAL to code stability.

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

- **Current Status:** Test coverage is **>88%** across critical core modules (`src/core/state`, `src/core/utils`).
- **Mandatory Test-First (New Features):** Every **new** core module (`src/core`, `src/utils`, `src/features`) MUST be accompanied by a `*.test.js` file.
- **Regression Protection:** When refactoring existing complex code (e.g., `SlideManager`, `StateManager`), a baseline unit test must be added first.
- **Mocking Strategy:** Always mock external dependencies (Video API, Web Audio API, LocalStorage, network) in Jest using `jest.mock()`.
- **E2E Scenarios (Cypress):** Critical user paths (Grade 3/4 flow) must have basic smoke tests as soon as the infrastructure allows.

### Code Quality & Style Rules

- **Coding Standard:** Follow strict ESLint and Prettier configurations. Avoid `var`; use `const` for immutables and `let` for variables.
- **CSS Naming:** Classes must use **kebab-case** with the `.dkv-` prefix (**BEM style**).
- **CSS/JS Animation Ownership:** A single DOM element's visual property (`opacity`, `transform`, `visibility`) MUST be controlled by exactly ONE source: either CSS class toggling OR JS inline styles. Mixing both on the same property is **forbidden** ”” it causes specificity conflicts and race conditions (see: v0.32.4 LibraryTask fix).
- **Prohibited Patterns:** `console.log` is forbidden in production; use the built-in `GameLogger`.
- **Documentation:** Hungarian JSDoc comments are mandatory for all public methods and modules.
- **Changelog:** Maintain the `CHANGELOG.md` file in Hungarian, following Semantic Versioning (SemVer) principles.

### Development Workflow Rules

- **Branching & PRs:** 
    - Use `feature/`, `bugfix/`, or `task/` prefixes for all branches.
    - **PR Mandate:** Direct commits to `main` are forbidden. All changes must go through a Pull Request or a rigorous simulated review by an AI agent on a separate branch.
- **Commits & Releases:**
    - Provide descriptive Hungarian commit messages (e.g., `feat: KaraktervÃ¡lasztÃ³ felÃ¼let implementÃ¡lÃ¡sa`).
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
    - **Mid-lifecycle Cleanup:** If a component runs in multiple rounds/phases (e.g., multi-round tasks), the `this.timeouts` array MUST be cleared (`clearTimeout` + array reset) at the start of each new round ”” not only in `destroy()`. Stale timeouts referencing destroyed DOM elements cause silent failures.
    - **GPU Disposal:** Every Three.js resource (`geometries`, `materials`, `textures`) MUST be explicitly `.dispose()`-ed in the `destroy()` method to prevent GPU memory bloat.
- **State & Timer Integrity:**
    - **Persistence Policy:** Use the **StateManager** for all game-related and user-progress data.
    - **LocalStorage Bypasses:** Direct `localStorage` access is permitted **ONLY** for system-level flags (e.g., GDPR consent, Master/Debug mode) where the StateManager is not yet initialized or contextually inappropriate.
    - **No direct write:** Never write directly to `localStorage` for game progress; use `SecureStorage` (via StateManager).
    - **Timer Policy:** Only the `TimeManager` is allowed to modify the global competition clock. Components should only read the time via the `EventBus` or `StateManager`.
    - **Timing Accuracy Policy:** Using `setInterval`/`setTimeout` tick-counting for time measurement (e.g., `counter -= 1` per tick) is **forbidden**. Browsers throttle background tabs (Chrome: ~1 tick/minute). Always use `performance.now()` or `Date.now()` delta-based calculation. `setInterval` may only serve as a **UI refresh trigger**, never as a time source (see: v0.32.4 energy bar fix).
- **Portal & Navigation Safety:**
    - **Navigation Lock:** All navigation buttons MUST be disabled and `EventBus` navigation events ignored while a `PortalTransition` or Slide transition is in progress.
- **Audio Policies:** Respect browser autoplay policies; initialize Web Audio context only after the first user interaction.
- **Asset Loading:** Use asynchronous loading for all large assets (videos, 3D models) with appropriate UI feedback (**Loader/Progress UI**).
- **Image Cache Safety:** When loading images (`<img>`), the following sequence is **mandatory**: (1) Register `onload` handler BEFORE setting `src`, (2) Register `onerror` handler (log + fallback), (3) Set `src`, (4) After setting `src`, check `if (img.complete && img.naturalWidth > 0)` for cached images where `onload` may not fire, (5) Add a safety fallback timeout (e.g., 3s) if neither event triggers (see: v0.32.4 LibraryTask fix).
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

---

## Project Status

- **Version:** 0.60.1 (v0.60.1)
- **Status:** Stable
- **Test Coverage:** ~91% (88/88 tests passing, all animation modules stabilized)
- **Last Updated:** 2026-05-22
- **Current Mission:** Oklevél és Gratuláció modulok tömeges generálásának stabilizálása és szétválasztása (v0.60.1)
- **Internal Tools:**
    - **Puzzle Generator:** `puzzle.html` - Generates high-density nonsense code for puzzle game assets. Accessible via `npm run tool:puzzle`.

### Completed Milestones
- [x] Grade 4: All stations (1-5) visual and functional unification (v0.32.2)
- [x] Grade 4: Help system integrated into all tasks (v0.32.2)
- [x] Grade 4: EXECUTE buttons pixel-perfect synchronization (v0.32.2)
- [x] Grade 4: LibraryTask race condition & cache safety fix (v0.32.4)
- [x] Grade 4: Energy bar timing accuracy (performance.now) (v0.32.4)
- [x] Grade 4: BEM naming compliance across all task modules (v0.32.4)
- [x] Grade 4: SpeedTask GC safety, BEM compliance, and timer accuracy (v0.32.6)
- [x] Grade 4: FinaleTask visual style harmonization (Neon Terminal) (v0.36.5)
- [x] Grade 4: FinaleTask functional integration (EXECUTE button, matrix collection) (v0.36.5)
- [x] Grade 4: FinaleTask animated intro sequence with typewriter effect (v0.36.5)
- [x] Grade 4: Full Project-Context compliance audit (JSDoc, lifecycle, animation ownership) (v0.36.5)
- [x] Grade 4: FinaleTask code block stability and monospace font (v0.36.10)
- [x] Grade 4: FinaleTask button visual alignment (hover, pulse, styles) (v0.36.11)
- [x] Grade 4: FinaleTask intro sequence animation timing synchronization (v0.36.12)
- [x] Grade 4: FinaleTask visual polish (magenta exception colors, dimmed matrix) (v0.36.13)
- [x] Grade 4: FinaleTask inactive character color correction (white 0.4 opacity) (v0.36.14)
- [x] Grade 4: FinaleTask code block font update to JetBrains Mono (v0.36.15)
- [x] Grade 4: FinaleTask code block internal screen with dark background (v0.36.16)
- [x] Grade 4: FinaleTask mini-monitor layout and style correction (v0.36.17)
- [x] Grade 4: FinaleTask mini-monitor positioning (left-aligned, 650px) (v0.36.18)
- [x] Grade 4: FinaleTask mini-monitor final styling (400px, no borders/shadows) (v0.36.19)
- [x] Grade 4: FinaleTask character alignment correction (unified font-weight) (v0.36.20)
- [x] Grade 4: FinaleTask code-block and mini-monitor background color swap (v0.36.21)
- [x] Grade 4: FinaleTask background color restore (v0.36.22)
- [x] Grade 4: FinaleTask Milestone: Visual & Functional Stabilization (v0.37.0)
- [x] Grade 4: FinaleTask Milestone: UI Stabilization & Code Audit (v0.40.0)
- [x] Grade 4: Onboarding Navigation & Scoring Logic Fixes (v0.42.0)
- [x] Grade 3: Audio Control Refinement (v0.43.0)
- [x] Grade 4: All stations (1-5) functional unification & Scripture audit (v0.47.0)
- [x] Grade 4: HUB visual modernization (Glassmorphism, Radial layout) (v0.48.0)
- [x] Grade 4: Finale tasks scoring balancing (6/10 pts) and HUD sync (v0.49.0)
- [x] Adatintegritás: PHP ranglista fájlzárolás és atomi írás (v0.50.0)
- [x] Grade 3: FinaleTask ReferenceError javítás és UI takarítás optimalizálás (v0.50.1)
- [x] Stabilizáció: Feladat Ã©letciklus-kezelés és modális ablak takarítás (v0.50.0)
- [x] Grade 4: Feladathang lejátszás az alcím typewriter szinkronizációjával (v0.51.0)
- [x] Grade 4: Terminál-csipogÃ¡s a feladatcímek írógép-effektusához (Web Audio API) (v0.51.1)
- [x] Grade 4: Összegző képernyő pixelpontos UI stabilizációja és vizuális polírozása (v0.52.0)
- [x] Grade 4: „Digitális Vihar”� atmoszférikus vizuális effektus a Finálé feladathoz (v0.53.0)
- [x] Grade 4: Ã�rÃ³gÃ©p audio-szinkronizáció és „Digitális Vihar”� vizuális finomhangolÃ¡s (v0.55.0)
- [x] Grade 4: Ã�llomÃ¡sspecifikus dinamikus háttérzene Web Audio API elhalkítással (v0.54.0)
- [x] Onboarding: Pontszám szinkronizáció és retroaktív ranglista javítás (v0.56.0)
- [x] Ranglista: Grade 3 feladatok utólagos nevesÃ­tése a dashboardon (v0.56.0)
- [x] Ranglista: Finálé beugró utólagos mentése és feladatnevek dinamikus hozzÃ¡rendelése (v0.57.0)
- [x] Grade 5-6: Keretrendszer kiterjesztése, nehézségi skálázás és ranglista finomhangolása (v0.58.0)
- [x] Grade 4: Kvantumugrás 3-2-1 visszaszámlálás cyber-basszus drop (Web Audio API) és GlitchTransition aszinkron zajgenerálás GC Safety és natÃ­v AudioParam hangerÅ‘Ã¼temezéssel (v0.59.0)
- [x] Rendszer: Prémium vector-perfect SVG favicon integráció és PWA manifest optimalizáció (v0.60.0)

- [x] Ranglista: Oklevél és Gratuláció modulok szétválasztása és 4-6. osztályos dinamikus támogatás (v0.60.1)
- [x] Ranglista: Tömeges generálás (html2canvas) aszinkron képbetöltési hibájának javítása (v0.60.1)
- [x] Ranglista: Dinamikus betűméret-skálázás és sortörés-gátlás az oklevelek és gratulációk adatainál (v0.60.1)
