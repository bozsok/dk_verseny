/**
 * Slide Configuration - Digitális Kultúra Verseny
 * 
 * Ez a fájl definiálja a verseny 30 lépését (Slide-ját).
 * Struktúra:
 * - Bevezetés (Intro): 4 steps
 * - Állomások (Stations 1-5): 5 x 4 steps
 * - Végjáték (Finale): 4 steps
 * - Levezetés (Outro): 2 steps
 * 
 * Total: 30 steps
 */

export const SLIDE_TYPES = {
    WELCOME: 'welcome',
    REGISTRATION: 'registration',
    CHARACTER: 'character',
    VIDEO: 'video',
    TASK: 'task',
    REWARD: 'reward',
    INFO: 'info',
    STORY: 'story' // Új típus képes diákhoz
};

export const createSlidesConfig = (grade) => {
    const slides = [];
    let idCounter = 1;

    // Grade 3 esetén képeket (Story) használunk videók helyett
    const isGrade3 = grade === 'grade3';
    let slideImageCounter = 1;

    // Helper a gyors slide generáláshoz
    const addSlide = (type, title, description, content = {}) => {
        slides.push({
            id: idCounter++,
            type,
            title,
            description,
            content, // videoUrl, imageUrl, taskId, etc.
            isLocked: true, // Alapból minden zárolva, kivéve az első (amit a manager nyit)
            completed: false
        });
    };

    // Helper a Történet/Videó diákhoz (automatikus típusválasztás)
    const addStorySlide = (title, description, fallbackVideoPath) => {
        if (isGrade3) {
            // Grade 3: Képes dia (slide_XX.jpg)
            const slideName = `slide_${slideImageCounter.toString().padStart(2, '0')}.jpg`;
            addSlide(SLIDE_TYPES.STORY, title, description, {
                imageUrl: `assets/images/grade3/slides/${slideName}`
            });
            slideImageCounter++;
        } else {
            // Egyéb osztályok: Videó (jelenlegi fallback)
            addSlide(SLIDE_TYPES.VIDEO, title, description, {
                videoUrl: fallbackVideoPath
            });
        }
    };

    // === 0. REGISZTRÁCIÓ (Onboarding) - 3 dia ===
    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek!', 'Kezdődjön a kaland', { buttonText: 'Kaland Indítása' });
    addSlide(SLIDE_TYPES.REGISTRATION, 'Regisztráció', 'Add meg az adataidat', { fields: ['name', 'nickname', 'classId'] });
    addSlide(SLIDE_TYPES.CHARACTER, 'Karakter', 'Válassz avatárt', { options: ['boy', 'girl'] });

    // === 1. BEVEZETÉS (Intro) - 4 dia ===
    addStorySlide('Bevezetés 1/4', 'A történet kezdete', 'assets/videos/intro_1.mp4');
    addStorySlide('Bevezetés 2/4', 'A konfliktus', 'assets/videos/intro_2.mp4');
    addStorySlide('Bevezetés 3/4', 'A küldetés', 'assets/videos/intro_3.mp4');
    addStorySlide('Bevezetés 4/4', 'Indulás', 'assets/videos/intro_4.mp4');

    // === 2. ÁLLOMÁSOK (Stations 1-5) - 5 x 4 dia ===
    for (let i = 1; i <= 5; i++) {
        // 1-2. Dia: Kontextus (Story/Video)
        addStorySlide(`${i}. Állomás - Érkezés`, 'A helyszín felfedezése', `assets/videos/station_${i}_1.mp4`);
        addStorySlide(`${i}. Állomás - A Probléma`, 'Mi a feladat?', `assets/videos/station_${i}_2.mp4`);

        // 3. Dia: FELADAT
        addSlide(SLIDE_TYPES.TASK, `${i}. Állomás - Kihívás`, 'Oldd meg a feladatot!', {
            taskId: `task_station_${i}`,
            taskType: 'logic', // vagy 'coding', 'puzzle'
            points: 100
        });

        // 4. Dia: Nyeremény (Story/Video)
        addStorySlide(`${i}. Állomás - Siker!`, 'Jutalom a megoldásért', `assets/videos/station_${i}_reward.mp4`);
    }

    // === 3. VÉGJÁTÉK (Finale) - 4 dia ===
    addStorySlide('Végjáték - A Végső Harc', 'Konfrontáció', 'assets/videos/finale_1.mp4');
    addStorySlide('Végjáték - A Fordulat', 'Váratlan esemény', 'assets/videos/finale_2.mp4');
    addSlide(SLIDE_TYPES.TASK, 'Végjáték - Végső Próba', 'Mentsd meg a világot!', { taskId: 'task_finale', points: 300 });
    addStorySlide('Végjáték - Győzelem', 'A küldetés teljesítve', 'assets/videos/finale_reward.mp4');

    // === 4. LEVEZETÉS (Outro) - 2 dia ===
    addStorySlide('Epilógus', 'A béke helyreállt', 'assets/videos/outro_1.mp4');
    addSlide(SLIDE_TYPES.INFO, 'Vége', 'Gratulálunk a verseny teljesítéséhez!', { showStats: true });

    return slides;
};
