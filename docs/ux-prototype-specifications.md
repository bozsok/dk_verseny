# UX Tervezés: Prototípus Specifikációk
## Digitális Kultúra Verseny - Oktatási Játék Platform

---

## 🎯 PROTOTÍPUS STRATÉGIA

### Prototípus Fejlesztési Fázisok
- **Fázis 1**: Alacsony hűségű papír prototípus (1 hét)
- **Fázis 2**: Interaktív wireframe prototípus (2 hét)
- **Fázis 3**: Magas hűségű vizuális prototípus (3 hét)
- **Fázis 4**: Működő alfa prototípus (4-6 hét)

### Fejlesztési Eszközök
- **Figma**: Design rendszer és high-fidelity prototípus
- **InVision**: Clickable prototípus és stakeholder prezentáció
- **Principle**: Animáció és interakció prototípus
- **HTML/CSS/JS**: Működő alfa verzió

---

## 📐 PROTOTÍPUS SPECIFIKÁCIÓK

### Figma Prototípus Beállítások

#### Frame Méretek és Layout
```javascript
// Figma frame specifications
const prototypeFrames = {
  // Desktop frames
  desktop: {
    width: 1440,
    height: 1024,
    margin: 40,
    grid: "12-column, 24px gutter"
  },
  
  // Tablet frames
  tablet: {
    width: 1024,
    height: 768,
    margin: 32,
    grid: "8-column, 20px gutter"
  },
  
  // Mobile frames
  mobile: {
    width: 375,
    height: 812,
    margin: 16,
    grid: "4-column, 16px gutter"
  }
};

// Device-specific artboards
const artboardLayout = {
  hub: {
    desktop: "1440x1024",
    tablet: "1024x768", 
    mobile: "375x812"
  },
  registration: {
    desktop: "1440x900",
    tablet: "1024x700",
    mobile: "375x700"
  },
  gameplay: {
    desktop: "1440x900",
    tablet: "1024x800",
    mobile: "375x750"
  }
};
```

#### Component Library Setup
```javascript
// Figma component structure
const componentLibrary = {
  // Base components
  buttons: {
    "btn-primary": "Primary action button",
    "btn-secondary": "Secondary action button", 
    "btn-icon": "Icon-only button",
    "btn-large": "Large CTA button"
  },
  
  // Form components
  forms: {
    "input-text": "Text input field",
    "input-password": "Password input",
    "radio-group": "Radio button group",
    "checkbox": "Checkbox component",
    "select": "Dropdown select"
  },
  
  // Layout components
  layout: {
    "container": "Content container",
    "grid-2": "2-column grid",
    "grid-3": "3-column grid", 
    "grid-4": "4-column grid"
  },
  
  // Game-specific components
  game: {
    "grade-card": "Year level selection card",
    "character-card": "Character selection",
    "video-player": "Video player interface",
    "puzzle-interface": "Puzzle interaction area",
    "progress-bar": "Progress tracking"
  }
};
```

### Interakciós Prototípus Definíciók

#### Navigációs Átmenetek
```javascript
// Navigation interaction specifications
const navigationTransitions = {
  // Page transitions
  pageTransition: {
    duration: 300,
    easing: "ease-in-out",
    type: "slide-left"
  },
  
  // Button hover states
  buttonHover: {
    scale: 1.02,
    shadow: "0 4px 12px rgba(0,0,0,0.15)",
    duration: 200
  },
  
  // Card interactions
  cardHover: {
    translateY: -4,
    shadow: "0 8px 25px rgba(0,0,0,0.15)",
    duration: 300
  },
  
  // Loading states
  loading: {
    type: "spinner",
    size: 24,
    color: "#3b82f6"
  }
};

// Smart animate specifications
const smartAnimate = {
  // Element consistency rules
  elementMatching: {
    // Same name + same component type = automatic animation
    // Different names = manual transition definition
    autoMatch: true,
    tolerance: 20 // pixels
  },
  
  // Animation presets
  presets: {
    slideInFromRight: {
      x: { from: 100, to: 0 },
      opacity: { from: 0, to: 1 },
      duration: 400
    },
    fadeIn: {
      opacity: { from: 0, to: 1 },
      duration: 300
    },
    scaleIn: {
      scale: { from: 0.8, to: 1 },
      opacity: { from: 0, to: 1 },
      duration: 350
    }
  }
};
```

#### Game-Specific Interactions

##### Video Player Prototípus
```javascript
const videoPlayerPrototype = {
  // Auto-play simulation
  autoPlay: {
    delay: 2000,
    indicator: "Play button pulsing"
  },
  
  // Progress simulation
  progressSimulation: {
    duration: 5000, // 5 seconds for demo
    autoAdvance: true
  },
  
  // Control interactions
  controls: {
    playPause: "Toggle on click",
    volume: "Slider interaction",
    fullscreen: "Toggle on click",
    progress: "Scrub interaction"
  },
  
  // Completion behavior
  completion: {
    trigger: "progress completion",
    action: "show continue button",
    delay: 1000
  }
};
```

##### Puzzle Interface Prototípus
```javascript
const puzzlePrototype = {
  // Multiple choice interaction
  multipleChoice: {
    hover: "Scale 1.02, shadow increase",
    click: "Select state with checkmark",
    feedback: "Instant green/red feedback"
  },
  
  // Drag and drop simulation
  dragDrop: {
    draggable: "Element becomes draggable",
    dropZone: "Visual feedback on hover",
    completion: "Snap to position + success animation"
  },
  
  // Text input simulation
  textInput: {
    focus: "Highlight border",
    typing: "Character-by-character reveal",
    validation: "Real-time character limit"
  },
  
  // Success/failure feedback
  feedback: {
    success: {
      color: "#22c55e",
      icon: "✓ Checkmark",
      animation: "Scale + fade in",
      duration: 500
    },
    failure: {
      color: "#ef4444", 
      icon: "✗ X mark",
      animation: "Shake + red border",
      duration: 600
    }
  }
};
```

---

## 🎨 VIZUÁLIS PROTOTÍPUS KÖVETELMÉNYEK

### Design Token Implementation
```css
/* Figma Design Tokens */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-success: #22c55e;
  --color-warning: #f97316;
  --color-error: #ef4444;
  --color-gray-50: #f9fafb;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
  
  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
}
```

### Asset Specifications

#### Ikon Könyvtár
```javascript
const iconLibrary = {
  // Game-specific icons
  game: {
    "wizard": "🧙‍♂️",
    "elf": "🧝‍♀️", 
    "fairy": "🧚‍♂️",
    "genie": "🧞‍♂️",
    "vampire": "🧛‍♂️",
    "dragon": "🐉",
    "robot": "🤖",
    "unicorn": "🦄",
    "butterfly": "🦋",
    "star": "🌟"
  },
  
  // UI icons
  ui: {
    "play": "▶️",
    "pause": "⏸️",
    "stop": "⏹️",
    "volume": "🔊",
    "fullscreen": "⛶",
    "back": "←",
    "forward": "→",
    "home": "🏠",
    "profile": "👤",
    "settings": "⚙️"
  },
  
  // Status icons
  status: {
    "completed": "✅",
    "in-progress": "🔓",
    "locked": "🔒",
    "warning": "⚠️",
    "error": "❌",
    "success": "✓"
  },
  
  // Technical specs
  specifications: {
    size: "24x24px",
    format: "SVG for web, PNG for fallback",
    strokeWidth: "2px",
    style: "Outline style with rounded corners"
  }
};
```

#### Karakter Grafikák
```javascript
const characterAssets = {
  specifications: {
    size: "120x120px",
    format: "SVG for scalability, PNG for fallback",
    style: "Flat design, friendly cartoon style",
    colors: "Vibrant, child-friendly palette",
    accessibility: "High contrast, clear shapes"
  },
  
  animationRequirements: {
    idle: "Subtle breathing animation",
    hover: "Scale 1.1, slight glow",
    selected: "Border highlight, checkmark",
    loading: "Spin animation"
  },
  
  variants: {
    "wizard": {
      primary: "#8b5cf6",
      secondary: "#3b82f6", 
      accessory: "#f59e0b"
    },
    // ... additional character color schemes
  }
};
```

#### Video Placeholders
```javascript
const videoPlaceholder = {
  specifications: {
    aspectRatio: "16:9",
    resolutions: {
      desktop: "1920x1080",
      tablet: "1280x720",
      mobile: "854x480"
    },
    format: "MP4 (H.264)",
    duration: "30-90 seconds for demos",
    placeholder: "Thumbnail with play button overlay"
  },
  
  demoContent: {
    "intro-video": {
      title: "Üdvözlés a Kód Királyságban",
      thumbnail: "castle-hero.jpg",
      duration: "30s"
    },
    "station-video": {
      title: "Tudás Torony bemutató",
      thumbnail: "tower-preview.jpg", 
      duration: "45s"
    }
    // ... additional demo videos
  }
};
```

---

## 📱 INTERAKTÍV PROTOTÍPUS ESETEK

### Use Case 1: Első Használat (Onboarding)
```javascript
const onboardingFlow = {
  steps: [
    {
      screen: "hub",
      action: "Click grade card",
      transition: "Slide left to registration",
      duration: 300
    },
    {
      screen: "registration", 
      action: "Fill form fields",
      validation: "Real-time field validation",
      nextTrigger: "All fields valid"
    },
    {
      screen: "character-selection",
      action: "Click character avatar",
      feedback: "Selection border highlight",
      nextTrigger: "Character selected"
    },
    {
      screen: "first-video",
      action: "Auto-play simulation",
      progress: "5-second demo progress",
      nextTrigger: "Video 'completed'"
    },
    {
      screen: "first-puzzle",
      action: "Click answer option",
      feedback: "Success/failure animation",
      completion: "Show points + continue button"
    }
  ],
  
  // Error handling
  errorScenarios: {
    "invalid-form": "Show validation messages",
    "slow-loading": "Show loading spinner",
    "connection-error": "Retry option"
  }
};
```

### Use Case 2: Játékmenet (Gameplay Loop)
```javascript
const gameplayLoop = {
  sequence: [
    {
      component: "video-player",
      interactions: ["play", "pause", "progress-scrub"],
      completion: "Auto-advance to puzzle"
    },
    {
      component: "puzzle-interface",
      types: ["multiple-choice", "drag-drop", "text-input"],
      feedback: "Immediate visual response",
      scoring: "Points animation"
    },
    {
      component: "progress-tracking",
      update: "Progress bar increment",
      save: "Auto-save to localStorage"
    }
  ],
  
  // State management
  stateManagement: {
    currentGrade: "Track selected year level",
    currentStation: "Track progress through story",
    score: "Accumulate points",
    character: "Selected avatar persistence"
  }
};
```

### Use Case 3: Tanár Dashboard
```javascript
const teacherDashboard = {
  authentication: {
    trigger: "Admin login button",
    validation: "Credentials check",
    redirect: "Dashboard on success"
  },
  
  dataVisualization: {
    "student-list": {
      sort: "Click column headers",
      filter: "Dropdown filters",
      search: "Real-time search"
    },
    "performance-charts": {
      type: "Interactive bar/line charts",
      drillDown: "Click for details",
      export: "CSV/PDF download"
    },
    "progress-tracking": {
      timeline: "Date range selector",
      granularity: "Day/week/month views",
      highlights: "Milestone indicators"
    }
  }
};
```

---

## 🔧 TECHNICAL PROTOTYPE SPECIFICATIONS

### HTML/CSS/JS Alfha Prototípus

#### Project Structure
```bash
digitális-kultúra-verseny-prototype/
├── index.html                 # Hub entry point
├── css/
│   ├── styles.css            # Main stylesheet
│   ├── components/           # Component styles
│   │   ├── buttons.css
│   │   ├── forms.css
│   │   ├── cards.css
│   │   └── game.css
│   └── utilities/           # Utility classes
│       ├── spacing.css
│       ├── colors.css
│       └── responsive.css
├── js/
│   ├── app.js               # Main application
│   ├── components/          # Component logic
│   │   ├── video-player.js
│   │   ├── puzzle-engine.js
│   │   ├── progress-tracker.js
│   │   └── navigation.js
│   ├── data/                # Mock data
│   │   ├── grades.js
│   │   ├── puzzles.js
│   │   └── characters.js
│   └── utils/               # Utility functions
│       ├── storage.js
│       ├── animations.js
│       └── validation.js
├── assets/
│   ├── images/             # Static images
│   ├── icons/              # SVG icons
│   ├── videos/             # Demo videos
│   └── fonts/              # Web fonts
└── pages/                   # Additional pages
    ├── registration.html
    ├── character-selection.html
    ├── gameplay.html
    └── dashboard.html
```

#### Core JavaScript Architecture
```javascript
// app.js - Main application bootstrap
class DigitálisKultúraApp {
  constructor() {
    this.currentUser = null;
    this.currentGrade = null;
    this.gameState = new GameStateManager();
    this.eventBus = new EventBus();
    this.storage = new LocalStorageManager();
  }
  
  init() {
    this.setupEventListeners();
    this.loadUserPreferences();
    this.checkExistingSession();
    this.routeToLandingPage();
  }
  
  // Navigation routing
  routeToLandingPage() {
    if (!this.currentUser) {
      this.showHub();
    } else {
      this.showDashboard();
    }
  }
}

// Game state management
class GameStateManager {
  constructor() {
    this.state = {
      currentGrade: null,
      currentStation: 0,
      character: null,
      score: 0,
      completedStations: [],
      progress: {}
    };
  }
  
  saveProgress() {
    this.storage.set('gameProgress', this.state);
  }
  
  loadProgress() {
    const saved = this.storage.get('gameProgress');
    if (saved) {
      this.state = { ...this.state, ...saved };
    }
  }
  
  updateScore(points) {
    this.state.score += points;
    this.eventBus.emit('scoreUpdated', this.state.score);
  }
}

// Video player component
class VideoPlayer {
  constructor(container, videoSrc) {
    this.container = container;
    this.video = this.createVideoElement(videoSrc);
    this.controls = this.createControls();
    this.setupEventListeners();
  }
  
  createVideoElement(src) {
    const video = document.createElement('video');
    video.src = src;
    video.controls = false;
    video.preload = 'metadata';
    return video;
  }
  
  setupEventListeners() {
    this.video.addEventListener('ended', () => {
      this.onVideoComplete();
    });
    
    this.video.addEventListener('timeupdate', () => {
      this.updateProgress();
    });
  }
  
  onVideoComplete() {
    this.eventBus.emit('videoCompleted', {
      grade: this.currentGrade,
      station: this.currentStation
    });
  }
}

// Puzzle engine
class PuzzleEngine {
  constructor(puzzleData) {
    this.puzzle = puzzleData;
    this.attempts = 0;
    this.isCompleted = false;
  }
  
  checkAnswer(userAnswer) {
    this.attempts++;
    const isCorrect = this.puzzle.correctAnswer === userAnswer;
    
    if (isCorrect && !this.isCompleted) {
      this.isCompleted = true;
      this.onPuzzleSolved();
    } else {
      this.onPuzzleAttempt(isCorrect);
    }
    
    return isCorrect;
  }
  
  onPuzzleSolved() {
    const points = this.calculatePoints();
    this.eventBus.emit('puzzleSolved', {
      puzzleId: this.puzzle.id,
      points: points,
      attempts: this.attempts
    });
  }
}
```

#### Responsive CSS Framework
```css
/* Responsive utility classes */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Grid system */
.grid {
  display: grid;
  gap: 1rem;
}

.grid-cols-1 { grid-template-columns: 1fr; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsive breakpoints */
@media (max-width: 767px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 0 0.75rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .container {
    padding: 0 1.5rem;
  }
}

/* Component responsive behavior */
.grade-card {
  /* Mobile: full width */
  width: 100%;
  margin-bottom: 1rem;
  
  /* Tablet: 2-column layout */
  @media (min-width: 768px) {
    width: calc(50% - 0.5rem);
  }
  
  /* Desktop: 4-column layout */
  @media (min-width: 1024px) {
    width: calc(25% - 0.75rem);
  }
}

/* Touch-friendly interactions */
@media (hover: none) {
  .btn:hover {
    transform: none; /* Disable hover effects on touch */
  }
  
  .btn:active {
    transform: scale(0.98);
  }
}
```

---

## 📋 PROTOTÍPUS VALIDÁCIÓ LISTA

### Functional Requirements Checklist

#### Core Navigation
- [ ] HUB page loads correctly on all devices
- [ ] Grade selection cards are interactive
- [ ] Registration flow completes successfully
- [ ] Character selection works properly
- [ ] Navigation breadcrumbs function correctly

#### Game Mechanics
- [ ] Video player controls work (play/pause/progress)
- [ ] Puzzle interactions respond correctly
- [ ] Progress tracking updates in real-time
- [ ] Score calculation and display functions
- [ ] Auto-save functionality works

#### Responsive Design
- [ ] Layout adapts correctly on mobile/tablet/desktop
- [ ] Touch interactions work on touch devices
- [ ] Text remains readable at all screen sizes
- [ ] Images scale appropriately
- [ ] Performance remains good on all devices

#### Accessibility
- [ ] Keyboard navigation works throughout
- [ ] Screen reader compatibility verified
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators are visible
- [ ] Alternative text provided for images

### Performance Benchmarks

#### Load Time Targets
```javascript
const performanceTargets = {
  "Initial Page Load": {
    target: "< 2 seconds",
    measurement: "Time to First Contentful Paint"
  },
  
  "Video Loading": {
    target: "< 3 seconds",
    measurement: "Time to video playable"
  },
  
  "Puzzle Interaction": {
    target: "< 100ms",
    measurement: "Response time to user input"
  },
  
  "Progress Update": {
    target: "< 50ms", 
    measurement: "Score/progress update latency"
  }
};
```

#### Browser Compatibility
```javascript
const browserSupport = {
  "Chrome": "90+",
  "Firefox": "88+",
  "Safari": "14+",
  "Edge": "90+",
  
  "Mobile Chrome": "90+",
  "Mobile Safari": "14+",
  "Samsung Internet": "14+"
};
```

---

## 🚀 IMPLEMENTÁCIÓS ÜTEMTERV

### Sprint 1: Alapvető Struktúra (1 hét)
**Célok:**
- Figma komponens könyvtár létrehozása
- Alapvető wireframe prototípus
- Navigációs struktúra implementálása

**Deliverables:**
- Komponens library Figma-ban
- Clickable wireframe prototípus
- HTML/CSS alapstruktúra

### Sprint 2: Interaktív Elemek (2 hét)
**Célok:**
- Video player interfész prototípus
- Rejtvény komponensek interaktív verziója
- Progress tracking implementálása

**Deliverables:**
- Működő video player mockup
- 3 rejtvény típus prototípus
- Progress bar és scoring rendszer

### Sprint 3: Vizuális Tervezés (2 hét)
**Célok:**
- High-fidelity vizuális design
- Animáció és micro-interactions
- Reszponzív layout finomítása

**Deliverables:**
- Teljes vizuális prototípus
- Animációs specifikációk
- Responsive design validation

### Sprint 4: Alfa Verzió (3 hét)
**Célok:**
- Működő HTML/CSS/JS prototípus
- Teljes játékmenet implementálása
- Tesztelési előkészítés

**Deliverables:**
- Alpha build működő weboldal
- Teljes user journey implementálva
- Testing és feedback collection setup

---

## 📊 PROTOTÍPUS MÉRÉSI METRIKÁK

### Prototípus Effectiveness Metrics
```javascript
const prototypeMetrics = {
  // User interaction metrics
  interaction: {
    "clickThroughRate": "Percentage of users completing key flows",
    "timeToComplete": "Average time to complete main tasks",
    "errorRate": "Frequency of user errors",
    "helpRequests": "How often users need assistance"
  },
  
  // Usability metrics  
  usability: {
    "taskSuccess": "Percentage of successfully completed tasks",
    "userSatisfaction": "1-10 rating of prototype experience",
    "learnability": "Time to become proficient with interface",
    "efficiency": "Tasks completed per unit time"
  },
  
  // Technical performance
  performance: {
    "loadTimes": "Page and asset loading speeds",
    "responsiveness": "Interface response to user input",
    "compatibility": "Cross-browser/device functionality",
    "accessibility": "Compliance with accessibility standards"
  }
};
```

### Success Criteria
```javascript
const successCriteria = {
  "User Adoption": {
    "target": "90%+ task completion rate",
    "measurement": "Automated analytics + user observation"
  },
  
  "User Satisfaction": {
    "target": "8+/10 average rating",
    "measurement": "Post-test questionnaires"
  },
  
  "Technical Performance": {
    "target": "< 2s load time, < 100ms interactions",
    "measurement": "Performance monitoring tools"
  },
  
  "Accessibility": {
    "target": "WCAG 2.1 AA compliance",
    "measurement": "Automated accessibility testing"
  }
};
```

---

*Ez a prototípus specifikáció dokumentum részletes útmutatót nyújt a Digitális Kultúra Verseny platform prototípusainak fejlesztéséhez, biztosítva a magas minőségű felhasználói élmény és hatékony stakeholder kommunikáció megvalósítását a fejlesztési folyamat során.*