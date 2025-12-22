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
    INFO: 'info'
};

export const createSlidesConfig = (grade) => {
    // TODO: Évfolyam-specifikus videó URL-ek és feladatok betöltése
    // Most placeholder adatokat használunk a struktúra demonstrálására

    const slides = [];
    let idCounter = 1;

    // Helper a gyors slide generáláshoz
    const addSlide = (type, title, description, content = {}) => {
        slides.push({
            id: idCounter++,
            type,
            title,
            description,
            content, // videoUrl, taskId, etc.
            isLocked: true, // Alapból minden zárolva, kivéve az első
            completed: false
        });
    };

    // === 0. REGISZTRÁCIÓ (Onboarding) - 3 dia ===
    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek!', 'Kezdődjön a kaland', { buttonText: 'Kaland Indítása' });
    addSlide(SLIDE_TYPES.REGISTRATION, 'Regisztráció', 'Add meg az adataidat', { fields: ['name', 'nickname', 'classId'] });
    addSlide(SLIDE_TYPES.CHARACTER, 'Karakter', 'Válassz avatárt', { options: ['boy', 'girl'] });

    // === 1. BEVEZETÉS (Intro) - 4 dia ===
    addSlide(SLIDE_TYPES.VIDEO, 'Bevezetés 1/4', 'A történet kezdete', { videoUrl: 'assets/videos/intro_1.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'Bevezetés 2/4', 'A konfliktus', { videoUrl: 'assets/videos/intro_2.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'Bevezetés 3/4', 'A küldetés', { videoUrl: 'assets/videos/intro_3.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'Bevezetés 4/4', 'Indulás', { videoUrl: 'assets/videos/intro_4.mp4' });

    // === 2. ÁLLOMÁSOK (Stations 1-5) - 5 x 4 dia ===
    for (let i = 1; i <= 5; i++) {
        // 1-2. Dia: Kontextus
        addSlide(SLIDE_TYPES.VIDEO, `${i}. Állomás - Érkezés`, 'A helyszín felfedezése', { videoUrl: `assets/videos/station_${i}_1.mp4` });
        addSlide(SLIDE_TYPES.VIDEO, `${i}. Állomás - A Probléma`, 'Mi a feladat?', { videoUrl: `assets/videos/station_${i}_2.mp4` });

        // 3. Dia: FELADAT
        addSlide(SLIDE_TYPES.TASK, `${i}. Állomás - Kihívás`, 'Oldd meg a feladatot!', {
            taskId: `task_station_${i}`,
            taskType: 'logic', // vagy 'coding', 'puzzle'
            points: 100
        });

        // 4. Dia: Nyeremény
        addSlide(SLIDE_TYPES.REWARD, `${i}. Állomás - Siker!`, 'Jutalom a megoldásért', { videoUrl: `assets/videos/station_${i}_reward.mp4` });
    }

    // === 3. VÉGJÁTÉK (Finale) - 4 dia ===
    addSlide(SLIDE_TYPES.VIDEO, 'Végjáték - A Végső Harc', 'Konfrontáció', { videoUrl: 'assets/videos/finale_1.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'Végjáték - A Fordulat', 'Váratlan esemény', { videoUrl: 'assets/videos/finale_2.mp4' });
    addSlide(SLIDE_TYPES.TASK, 'Végjáték - Végső Próba', 'Mentsd meg a világot!', { taskId: 'task_finale', points: 300 });
    addSlide(SLIDE_TYPES.REWARD, 'Végjáték - Győzelem', 'A küldetés teljesítve', { videoUrl: 'assets/videos/finale_reward.mp4' });

    // === 4. LEVEZETÉS (Outro) - 2 dia ===
    addSlide(SLIDE_TYPES.VIDEO, 'Epilógus', 'A béke helyreállt', { videoUrl: 'assets/videos/outro_1.mp4' });
    addSlide(SLIDE_TYPES.INFO, 'Vége', 'Gratulálunk a verseny teljesítéséhez!', { showStats: true });

    return slides;
};
