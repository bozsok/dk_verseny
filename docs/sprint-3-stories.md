# Sprint 3: Onboarding & Architecture (Core Mechanics)

**Goal:** Establish the core game loop foundation: Grade selection -> Dynamic Config Loading -> Onboarding (Registration/Avatar) -> Intro Video -> Task Engine.

---

## 0. Infrastructure & Onboarding (PRIORITY)

### Story 0.1: Grade 3 Config + Onboarding (DONE)
- **As a** Developer
- **I want** to set up the basic config and onboarding slides for Grade 3
- **So that** 3rd graders can enter the game properly.

**Acceptance Criteria:**
- [x] Create `src/content/grade3/config.js`
- [x] Define `WelcomeSlide`, `RegistrationSlide`, `CharacterSlide` logic in config.
- [x] `RegistrationSlide` inputs: Name, Nickname, ClassID (simple validation).
- [x] `CharacterSlide` allows choosing Boy/Girl avatar.

### Story 0.2: Content Structure (DONE)
- **As a** Developer
- **I want** to establish a folder structure for all grades (`src/content/gradeX`)
- **So that** I can easily add content for Grade 4, 5, 6 later.

**Acceptance Criteria:**
- [x] Folders `grade3`, `grade4`, `grade5`, `grade6` exist in `src/content`.
- [x] `SlideManager` dynamically imports the correct config based on selected grade.

### Story 0.3: Profile State (DONE)
- **As a** System
- **I want** to save the user's name, nickname, and avatar to the `StateManager`
- **So that** we can use it later in the game (e.g. displaying name, scoreboard).

**Acceptance Criteria:**
- [x] Registration data is saved to `state.userProfile`.
- [x] Character selection is saved to `state.userProfile.avatar`.

### Story 0.4: Replicate Grade 4-6 (DONE)
- **As a** Developer
- **I want** to replicate the Grade 3 config structure for Grades 4, 5, and 6
- **So that** all grades have a functional onboarding flow with correct validation specific to their grade.

**Acceptance Criteria:**
- [x] `config.js` created for Grade 4, 5, 6.
- [x] Validation rules (allowedClasses) configured for each grade.
- [x] Titles and descriptions match the Hub definition.

---

## 1. Intro Video Integration

### Story 1.1: Video Player Component (TODO)
- **As a** Player
- **I want** to watch an intro video after creating my character
- **So that** I understand the story context.

**Acceptance Criteria:**
- [ ] Create `src/ui/components/VideoSlide.js`.
- [ ] It should handle `<video>` playback.
- [ ] "Skip" button (optional, or after X seconds).
- [ ] Auto-advance to next slide when video ends.

### Story 1.2: Video Content Config (TODO)
- **As a** Content Creator
- **I want** to define video URLs in the `config.js`
- **So that** each grade can have different story intros.

**Acceptance Criteria:**
- [ ] Add `SLIDE_TYPES.VIDEO` entries to `grade3/config.js` (placeholders).
- [ ] Ensure `VideoSlide` receives the URL from config.

---

## 2. Task Engine Groundwork

### Story 2.1: Simple Task Engine (TODO)
- **As a** Developer
- **I want** a generic `TaskSlide` component
- **So that** I can render different types of mini-games/questions.

**Acceptance Criteria:**
- [ ] Create `src/ui/components/TaskSlide.js`.
- [ ] It should read `taskType` from config.
- [ ] Implement at least one dummy task type (e.g. "info" or simple "multiple choice").

---

## Notes
- **Styling:** Use Tailwind CSS or `design-system.css`.
- **Fonts:** Ha új betűtípust vezetsz be egy Grade configban, ne felejtsd el importálni az `index.html`-ben!
- **Validation:** Registration needs strict validation (Hungarian names, class ID format).
- **State:** Use `StateManager` (Singleton) for data persistence.
