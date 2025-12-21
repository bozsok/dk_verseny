# UX Tervezés: Vizuális Design Rendszer és Stílus Útmutató
## Digitális Kultúra Verseny - Oktatási Játék Platform

---

## 🎨 DESIGN RENDSZER ÁTTEKINTÉS

### Alapvető Design Filozófia
- **Diák-központúság**: Minden vizuális elem a 8-12 éves diákokat szolgálja
- **Egyszerűség**: Tiszta, érthetős vizuális hierarchia
- **Játékosság**: Színes, élénk, motiváló design elemek
- **Hozzáférhetőség**: Mindenki számára elérhető vizuális nyelv
- **Konzisztencia**: Egységes megjelenés a teljes platformon

---

## 🌈 SZÍNPALETTA

### Primer Színek

#### Kék Széria (Fő akciószín)
```css
/* Elsődleges kék - Cselekvés, megbízhatóság */
--primary-blue-50: #eff6ff;
--primary-blue-100: #dbeafe;
--primary-blue-200: #bfdbfe;
--primary-blue-300: #93c5fd;
--primary-blue-400: #60a5fa;
--primary-blue-500: #3b82f6;  /* ALAPSZÍN */
--primary-blue-600: #2563eb;  /* HOVER/ACTIVE */
--primary-blue-700: #1d4ed8;
--primary-blue-800: #1e40af;
--primary-blue-900: #1e3a8a;

/* Használat: CTA gombok, aktív állapotok, fontos elemek */
.btn-primary {
  background-color: var(--primary-blue-500);
}
.btn-primary:hover {
  background-color: var(--primary-blue-600);
}
```

#### Zöld Széria (Siker, pozitív visszajelzés)
```css
/* Elsődleges zöld - Siker, pozitív */
--success-green-50: #f0fdf4;
--success-green-100: #dcfce7;
--success-green-200: #bbf7d0;
--success-green-300: #86efac;
--success-green-400: #4ade80;
--success-green-500: #22c55e;  /* ALAPSZÍN */
--success-green-600: #16a34a;  /* HOVER/ACTIVE */
--success-green-700: #15803d;
--success-green-800: #166534;
--success-green-900: #14532d;

/* Használat: Siker üzenetek, helyes válaszok, pontszámok */
.success-badge {
  background-color: var(--success-green-500);
}
```

### Szekunder Színek

#### Narancs Széria (Figyelemfelhívás)
```css
/* Narancs - Figyelem, aktivitás */
--warning-orange-50: #fff7ed;
--warning-orange-100: #ffedd5;
--warning-orange-200: #fed7aa;
--warning-orange-300: #fdba74;
--warning-orange-400: #fb923c;
--warning-orange-500: #f97316;  /* ALAPSZÍN */
--warning-orange-600: #ea580c;  /* HOVER/ACTIVE */
--warning-orange-700: #c2410c;
--warning-orange-800: #9a3412;
--warning-orange-900: #7c2d12;

/* Használat: Figyelmeztetések, folyamatban lévő állapotok */
.warning-banner {
  background-color: var(--warning-orange-500);
}
```

#### Piros Széria (Hiba, veszély)
```css
/* Piros - Hiba, veszély */
--error-red-50: #fef2f2;
--error-red-100: #fee2e2;
--error-red-200: #fecaca;
--error-red-300: #fca5a5;
--error-red-400: #f87171;
--error-red-500: #ef4444;  /* ALAPSZÍN */
--error-red-600: #dc2626;  /* HOVER/ACTIVE */
--error-red-700: #b91c1c;
--error-red-800: #991b1b;
--error-red-900: #7f1d1d;

/* Használat: Hibaüzenetek, hibás válaszok */
.error-message {
  background-color: var(--error-red-500);
}
```

### Neutrális Színek

#### Szürke Skála
```css
/* Neutrális színek */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;   /* ALAPSZÍN - Másodlagos szöveg */
--gray-600: #4b5563;   /* Hover állapot */
--gray-700: #374151;   /* Elsődleges szöveg */
--gray-800: #1f2937;   /* Sötét szöveg */
--gray-900: #111827;   /* Legsötétebb szöveg */

/* Fehér és fekete */
--white: #ffffff;
--black: #000000;
```

### Speciális Tematikus Színek

#### Kaland Színek (Történet elemekhez)
```css
/* Fantasy/Kaland témához */
--fantasy-purple: #8b5cf6;    /* Mágikus elemek */
--fantasy-gold: #f59e0b;      /* Kincsek, jutalmak */
--fantasy-silver: #94a3b8;    /* Fém elemek */
--fantasy-emerald: #10b981;   /* Természeti elemek */
--fantasy-amber: #f59e0b;     /* Tűz elemek */
```

---

## 📝 TIPOGRÁFIA

### Betűtípus Hierarchia

#### Elsődleges Betűtípus: Inter
```css
/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Betűtípus család */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-family-secondary: 'Inter', sans-serif; /* Fallback */
```

#### Méret Rendszer
```css
/* Tipográfiai skála */
--text-xs: 0.75rem;    /* 12px - Kisebb feliratok */
--text-sm: 0.875rem;   /* 14px - Másodlagos szöveg */
--text-base: 1rem;     /* 16px - Alapvető szöveg */
--text-lg: 1.125rem;   /* 18px - Nagyobb szöveg */
--text-xl: 1.25rem;    /* 20px - Kis címek */
--text-2xl: 1.5rem;    /* 24px - Közepes címek */
--text-3xl: 1.875rem;  /* 30px - Nagy címek */
--text-4xl: 2.25rem;   /* 36px - Főcímek */
--text-5xl: 3rem;      /* 48px - Hero címek */

/* Sormagasság */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

#### Súly Változatok
```css
/* Betűsúlyok */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Tipográfiai Stílusok

#### Címek
```css
/* Főcímek */
.heading-1 {
  font-family: var(--font-family-primary);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--gray-900);
}

.heading-2 {
  font-family: var(--font-family-primary);
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--gray-800);
}

.heading-3 {
  font-family: var(--font-family-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--gray-800);
}

/* Alcímek */
.subheading {
  font-family: var(--font-family-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  color: var(--gray-700);
}
```

#### Szöveg Stílusok
```css
/* Alapvető szöveg */
.body-text {
  font-family: var(--font-family-primary);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--gray-700);
}

/* Másodlagos szöveg */
.secondary-text {
  font-family: var(--font-family-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--gray-500);
}

/* Kisebb szöveg */
.caption-text {
  font-family: var(--font-family-primary);
  font-size: var(--text-xs);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--gray-400);
}
```

---

## 🔘 GOMB RENDSZER

### Primer Gombok
```css
.btn {
  /* Alapvető tulajdonságok */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-family: var(--font-family-primary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-height: 44px; /* Touch-friendly */
  min-width: 44px;
}

/* Elsődleges gomb */
.btn-primary {
  background-color: var(--primary-blue-500);
  color: var(--white);
}

.btn-primary:hover {
  background-color: var(--primary-blue-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-primary:active {
  background-color: var(--primary-blue-700);
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

/* Másodlagos gomb */
.btn-secondary {
  background-color: var(--white);
  color: var(--primary-blue-500);
  border: 2px solid var(--primary-blue-500);
}

.btn-secondary:hover {
  background-color: var(--primary-blue-50);
  border-color: var(--primary-blue-600);
  color: var(--primary-blue-600);
}

/* Siker gomb */
.btn-success {
  background-color: var(--success-green-500);
  color: var(--white);
}

.btn-success:hover {
  background-color: var(--success-green-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
}
```

### Gomb Méretek
```css
/* Kis gombok */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: var(--text-sm);
  min-height: 36px;
}

/* Nagy gombok */
.btn-lg {
  padding: 1rem 2rem;
  font-size: var(--text-lg);
  min-height: 56px;
}

/* Teljes szélességű gombok */
.btn-full {
  width: 100%;
  justify-content: center;
}
```

### Ikon Gombok
```css
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 0.5rem;
  background-color: var(--gray-100);
  color: var(--gray-600);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-icon:hover {
  background-color: var(--gray-200);
  color: var(--gray-800);
}

.btn-icon-lg {
  width: 56px;
  height: 56px;
}
```

---

## 🏷️ KARTER RENDSZER

### Évfolyam Kártyák
```css
.grade-card {
  background-color: var(--white);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.grade-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-blue-500), var(--fantasy-purple));
}

.grade-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* Kártya állapotok */
.grade-card--completed::before {
  background: var(--success-green-500);
}

.grade-card--in-progress::before {
  background: var(--warning-orange-500);
}

.grade-card--locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.grade-card--locked:hover {
  transform: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Karakter Kártyák
```css
.character-card {
  background-color: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.character-card:hover {
  border-color: var(--primary-blue-300);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.character-card--selected {
  border-color: var(--primary-blue-500);
  background-color: var(--primary-blue-50);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.character-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.character-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--gray-700);
}
```

---

## 📦 ŰRLAP ELEMEK

### Input Mezők
```css
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--gray-200);
  border-radius: 0.5rem;
  font-family: var(--font-family-primary);
  font-size: var(--text-base);
  background-color: var(--white);
  transition: all 0.2s ease-in-out;
  min-height: 44px;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-blue-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: var(--gray-400);
}

/* Hiba állapot */
.form-input--error {
  border-color: var(--error-red-500);
}

.form-input--error:focus {
  border-color: var(--error-red-500);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Siker állapot */
.form-input--success {
  border-color: var(--success-green-500);
}

.form-input--success:focus {
  border-color: var(--success-green-500);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}
```

### Label-ek
```css
.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--gray-700);
  margin-bottom: 0.5rem;
}

.form-label--required::after {
  content: ' *';
  color: var(--error-red-500);
}
```

### Checkbox-ok és Radio Gombok
```css
/* Checkbox */
.checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--gray-300);
  border-radius: 0.25rem;
  background-color: var(--white);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
}

.checkbox:checked {
  background-color: var(--primary-blue-500);
  border-color: var(--primary-blue-500);
}

.checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--white);
  font-size: 12px;
  font-weight: var(--font-bold);
}

/* Radio gombok */
.radio {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--gray-300);
  border-radius: 50%;
  background-color: var(--white);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
}

.radio:checked {
  border-color: var(--primary-blue-500);
}

.radio:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--primary-blue-500);
}
```

---

## 📊 PROGRESS ÉS STATUS ELEMEK

### Progress Bar
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-blue-500), var(--fantasy-purple));
  border-radius: 4px;
  transition: width 0.5s ease-in-out;
  position: relative;
}

.progress-bar__fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Progress kör */
.progress-circle {
  position: relative;
  width: 60px;
  height: 60px;
}

.progress-circle__background {
  fill: none;
  stroke: var(--gray-200);
  stroke-width: 4;
}

.progress-circle__progress {
  fill: none;
  stroke: var(--primary-blue-500);
  stroke-width: 4;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dasharray 0.5s ease-in-out;
}
```

### Badge-ek
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge--success {
  background-color: var(--success-green-100);
  color: var(--success-green-800);
}

.badge--warning {
  background-color: var(--warning-orange-100);
  color: var(--warning-orange-800);
}

.badge--error {
  background-color: var(--error-red-100);
  color: var(--error-red-800);
}

.badge--info {
  background-color: var(--primary-blue-100);
  color: var(--primary-blue-800);
}
```

---

## 🎯 REJTVÉNY SPECIFIKUS ELEMEK

### Válasz Gombok
```css
.answer-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 60px;
  padding: 1rem 1.5rem;
  background-color: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: 0.75rem;
  font-family: var(--font-family-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
}

.answer-button:hover {
  border-color: var(--primary-blue-300);
  background-color: var(--primary-blue-50);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.answer-button--selected {
  border-color: var(--primary-blue-500);
  background-color: var(--primary-blue-100);
  color: var(--primary-blue-700);
}

.answer-button--correct {
  border-color: var(--success-green-500);
  background-color: var(--success-green-100);
  color: var(--success-green-700);
}

.answer-button--incorrect {
  border-color: var(--error-red-500);
  background-color: var(--error-red-100);
  color: var(--error-red-700);
}
```

### Video Player Styling
```css
.video-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.video-player {
  width: 100%;
  height: auto;
  display: block;
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.video-progress {
  flex: 1;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
}

.video-progress__fill {
  height: 100%;
  background-color: var(--white);
  border-radius: 2px;
  transition: width 0.1s ease-in-out;
}
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoint Rendszer
```css
/* Mobile First Approach */
:root {
  --breakpoint-sm: 640px;   /* Tablet portrait */
  --breakpoint-md: 768px;   /* Tablet landscape */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Large desktop */
}

/* Container max-widths */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; padding: 0 2rem; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

### Grid Rendszer
```css
.grid {
  display: grid;
  gap: 1rem;
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

@media (max-width: 767px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

---

## 🎨 THEME RENDSZER

### Sötét Mód Támogatás
```css
/* Light theme (default) */
:root {
  --bg-primary: var(--white);
  --bg-secondary: var(--gray-50);
  --bg-tertiary: var(--gray-100);
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-700);
  --text-tertiary: var(--gray-500);
  --border-color: var(--gray-200);
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: var(--gray-900);
    --bg-secondary: var(--gray-800);
    --bg-tertiary: var(--gray-700);
    --text-primary: var(--white);
    --text-secondary: var(--gray-300);
    --text-tertiary: var(--gray-400);
    --border-color: var(--gray-600);
  }
}
```

### Evfolyam Témák
```css
/* 3. osztály téma */
.theme-grade-3 {
  --theme-primary: #10b981; /* Emerald */
  --theme-secondary: #f59e0b; /* Amber */
  --theme-accent: #8b5cf6; /* Purple */
}

/* 4. osztály téma */
.theme-grade-4 {
  --theme-primary: #3b82f6; /* Blue */
  --theme-secondary: #06b6d4; /* Cyan */
  --theme-accent: #8b5cf6; /* Purple */
}

/* 5. osztály téma */
.theme-grade-5 {
  --theme-primary: #f59e0b; /* Amber */
  --theme-secondary: #ef4444; /* Red */
  --theme-accent: #10b981; /* Emerald */
}

/* 6. osztály téma */
.theme-grade-6 {
  --theme-primary: #8b5cf6; /* Purple */
  --theme-secondary: #ec4899; /* Pink */
  --theme-accent: #06b6d4; /* Cyan */
}
```

---

## ♿ HOZZÁFÉRHETŐSÉG

### Kontraszt Szabványok
```css
/* High contrast colors for accessibility */
:root {
  --contrast-bg: #ffffff;
  --contrast-text: #000000;
  --contrast-border: #000000;
  --contrast-focus: #005fcc;
}

/* Focus styles for keyboard navigation */
.focus-visible {
  outline: 2px solid var(--contrast-focus);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --primary-blue-500: #0052cc;
    --success-green-500: #007a33;
    --error-red-500: #cc0000;
    --gray-700: #000000;
  }
}
```

### Animáció Csökkentés
```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 🚀 IMPLEMENTÁCIÓ IRÁNYELVEK

### CSS Szervezeti Struktur
```
styles/
├── base/
│   ├── reset.css
│   ├── typography.css
│   └── variables.css
├── components/
│   ├── buttons.css
│   ├── forms.css
│   ├── cards.css
│   └── progress.css
├── layouts/
│   ├── grid.css
│   └── container.css
├── utilities/
│   ├── spacing.css
│   ├── colors.css
│   └── responsive.css
└── main.css
```

### Naming Convention
- **BEM Methodology**: `block__element--modifier`
- **CSS Custom Properties**: `--component-property`
- **Component Prefix**: `.c-` prefix komponenseknek

### Performance Optimalizálás
```css
/* Efficient selectors */
.grade-card { }           /* ✅ Good */
div.card { }              /* ❌ Avoid */

/* Use transform for animations */
.card:hover {
  transform: translateY(-4px); /* ✅ GPU accelerated */
  top: -4px;                  /* ❌ Triggers layout */
}

/* Optimize specificity */
.btn-primary { }
.btn { }
```

---

*Ez a vizuális design rendszer és stílus útmutató biztosítja a Digitális Kultúra Verseny platform konzisztens és hozzáférhető megjelenését, amely optimalizált a 8-12 éves diákok számára és megfelel a modern web design szabványoknak.*