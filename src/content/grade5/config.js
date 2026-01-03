
import { SLIDE_TYPES } from '../../core/engine/slides-config.js';
import './styles/main.css';
import './styles/Welcome.css';
import './styles/Registration.css';
import './styles/Character.css';

// === GLOBÁLIS KONFIGURÁCIÓ (Grade 5) ===
// Téma: "Cyberpunk / Jövő"

const GRADE_PATH = 'grade5';
const SHARED_BUTTON_STYLE = 'dkv-grade-5-button';

export const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    // Helper függvény
    const addSlide = (type, title, description, content = {}) => {
        slides.push({
            id: `g5_slide_${idCounter++}`,
            type,
            title,
            description,
            content: {
                ...content,
                typingSpeed: 0
            },
            isLocked: true,
            completed: false
        });
    };

    // Shuffle helper (Fisher-Yates)
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // === ONBOARDING ===
    const bgImage = 'assets/images/grade5/onboarding_bg_placeholder.jpg'; // Feltételezett placeholder

    // 1. Welcome
    addSlide(SLIDE_TYPES.WELCOME, 'Rendszer Indítása... Grade 5', 'A hálózat veszélyben van. A Kódvírusok 5. szintű titkosítást használnak.<br>Csak te tudod feltörni a védelmüket.', {
        buttonText: 'Csatlakozás',
        backgroundUrl: bgImage
    });

    // 2. Registration
    addSlide(SLIDE_TYPES.REGISTRATION, 'Ügynök Regisztráció', '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Adatok Küldése',
        backgroundUrl: bgImage,
        validation: { allowedClasses: ['5.a', '5.b', '5.c'] },
        scoring: { name: 1, nick: 1, classId: 1 }
    });

    // 3. Character
    addSlide(SLIDE_TYPES.CHARACTER, 'Válassz Avatárt', 'Melyik digitális lenyomatot használod?', {
        backgroundUrl: bgImage,
        scoring: { selection: 1 },
        characters: {
            boy: [
                { id: 'b1', icon: 'assets/images/grade3/karakter/small/boy_1_k.jpg', card: 'assets/images/grade3/characters/boy1_card.png', zoom: 'assets/images/grade3/characters/boy1_zoom.png' },
                { id: 'b2', icon: 'assets/images/grade3/karakter/small/boy_2_k.jpg', card: 'assets/images/grade3/characters/boy2_card.png', zoom: 'assets/images/grade3/characters/boy2_zoom.png' },
                { id: 'b3', icon: 'assets/images/grade3/karakter/small/boy_3_k.jpg', card: 'assets/images/grade3/characters/boy3_card.png', zoom: 'assets/images/grade3/characters/boy3_zoom.png' },
                { id: 'b4', icon: 'assets/images/grade3/karakter/small/boy_4_k.jpg', card: 'assets/images/grade3/characters/boy4_card.png', zoom: 'assets/images/grade3/characters/boy4_zoom.png' }
            ],
            girl: [
                { id: 'g1', icon: 'assets/images/grade3/karakter/small/girl_1_k.jpg', card: 'assets/images/grade3/characters/girl1_card.png', zoom: 'assets/images/grade3/characters/girl1_zoom.png' },
                { id: 'g2', icon: 'assets/images/grade3/karakter/small/girl_2_k.jpg', card: 'assets/images/grade3/characters/girl2_card.png', zoom: 'assets/images/grade3/characters/girl2_zoom.png' },
                { id: 'g3', icon: 'assets/images/grade3/karakter/small/girl_3_k.jpg', card: 'assets/images/grade3/characters/girl3_card.png', zoom: 'assets/images/grade3/characters/girl3_zoom.png' },
                { id: 'g4', icon: 'assets/images/grade3/karakter/small/girl_4_k.jpg', card: 'assets/images/grade3/characters/girl4_card.png', zoom: 'assets/images/grade3/characters/girl4_zoom.png' }
            ]
        }
    });

    // === 1. BEVEZETÉS (FIX 1-4) ===
    for (let i = 1; i <= 4; i++) {
        const slideNum = String(i).padStart(2, '0');
        const title = `Bevezetés ${i}. (Kontextus)`;
        let narrationText = `<b>${title}</b><br><br>Ügynök, figyelem! Ez a bevezető szakasz.<br>(Helyőrző szöveg a ${i}. diánál)`;

        addSlide(SLIDE_TYPES.STORY, title, 'Kövessétek a protokollt...', {
            imageUrl: `assets/images/grade5/slides/slide_${slideNum}.jpg`,
            narration: narrationText
        });
    }

    // === 2. ÁLLOMÁSOK (KEVERT 5-24) ===
    const stationIndices = [0, 1, 2, 3, 4];
    shuffleArray(stationIndices);
    console.log("[DKV Grade 5] Station Order:", stationIndices);

    for (let slot = 0; slot < 5; slot++) {
        const originalStationIdx = stationIndices[slot];
        const startSlideNum = 5 + (originalStationIdx * 4);

        for (let step = 0; step < 4; step++) {
            const originalNum = startSlideNum + step;
            const fileNumStr = String(originalNum).padStart(2, '0');

            const displayedStationNum = slot + 1;
            let title = `${displayedStationNum}. Állomás: `;
            if (step === 0 || step === 1) title += "Kontextus";
            else if (step === 2) title += "Feladat";
            else title += "Siker, Öröm";

            let storyContent = `<b>${title}</b><br><br>Helyőrző szöveg az eredeti ${originalNum}. diához.`;

            // === 1. ÁLLOMÁS: NEON NEGYED (5-8) ===
            if (originalNum === 5) { storyContent = `[Neon Negyed - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 6) { storyContent = `[Neon Negyed - Dia 2] ...`; }
            else if (originalNum === 7) { storyContent = `[Neon Negyed - Dia 3] (Feladat)...`; }
            else if (originalNum === 8) { storyContent = `[Neon Negyed - Dia 4] (Siker)...`; }

            // === 2. ÁLLOMÁS: SZERVER FELHŐKARCOLÓ (9-12) ===
            else if (originalNum === 9) { storyContent = `[Szerver Felhőkarcoló - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 10) { storyContent = `[Szerver Felhőkarcoló - Dia 2] ...`; }
            else if (originalNum === 11) { storyContent = `[Szerver Felhőkarcoló - Dia 3] (Feladat)...`; }
            else if (originalNum === 12) { storyContent = `[Szerver Felhőkarcoló - Dia 4] (Siker)...`; }

            // === 3. ÁLLOMÁS: ADAT-AUTÓPÁLYA (13-16) ===
            else if (originalNum === 13) { storyContent = `[Adat-Autópálya - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 14) { storyContent = `[Adat-Autópálya - Dia 2] ...`; }
            else if (originalNum === 15) { storyContent = `[Adat-Autópálya - Dia 3] (Feladat)...`; }
            else if (originalNum === 16) { storyContent = `[Adat-Autópálya - Dia 4] (Siker)...`; }

            // === 4. ÁLLOMÁS: HACKER MENEDÉK (17-20) ===
            else if (originalNum === 17) { storyContent = `[Hacker Menedék - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 18) { storyContent = `[Hacker Menedék - Dia 2] ...`; }
            else if (originalNum === 19) { storyContent = `[Hacker Menedék - Dia 3] (Feladat)...`; }
            else if (originalNum === 20) { storyContent = `[Hacker Menedék - Dia 4] (Siker)...`; }

            // === 5. ÁLLOMÁS: KVANTUM LABOR (21-24) ===
            else if (originalNum === 21) { storyContent = `[Kvantum Labor - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 22) { storyContent = `[Kvantum Labor - Dia 2] ...`; }
            else if (originalNum === 23) { storyContent = `[Kvantum Labor - Dia 3] (Feladat)...`; }
            else if (originalNum === 24) { storyContent = `[Kvantum Labor - Dia 4] (Siker)...`; }

            let narrationText = `${storyContent}<br><br><span style="font-size:0.8em; opacity:0.7;">(Debug: Eredeti Dia #${originalNum} | Hely #${slot + 1} | Order: ${stationIndices.map(n => n + 1).join('-')})</span>`;

            addSlide(SLIDE_TYPES.STORY, title, 'Kövessétek a protokollt...', {
                imageUrl: `assets/images/grade5/slides/slide_${fileNumStr}.jpg`,
                narration: narrationText
            });
        }
    }

    // === 3. FINÁLÉ (FIX 25-28) ===
    for (let i = 25; i <= 28; i++) {
        const slideNum = String(i).padStart(2, '0');
        let title = "Finálé: ";
        if (i === 25) title += "Kontextus";
        else if (i === 26) title += "Feladat";
        else if (i === 27) title += "Siker, Öröm";
        else title += "Összefoglaló";

        let narrationText = `<b>${title}</b><br><br>Ügynök, a rendszer feltörve.<br>(Dia #${i})`;

        addSlide(SLIDE_TYPES.STORY, title, 'Végső kódfejtés...', {
            imageUrl: `assets/images/grade5/slides/slide_${slideNum}.jpg`,
            narration: narrationText
        });
    }

    return slides;
};
