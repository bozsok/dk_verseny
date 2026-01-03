
import { SLIDE_TYPES } from '../../core/engine/slides-config.js';
import './styles/main.css';
import './styles/Welcome.css';
import './styles/Registration.css';
import './styles/Character.css';

// === GLOBÁLIS KONFIGURÁCIÓ (Grade 6) ===
// Téma: "Világűr / Sci-fi"

const GRADE_PATH = 'grade6';
const SHARED_BUTTON_STYLE = 'dkv-grade-6-button';

export const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    // Helper függvény
    const addSlide = (type, title, description, content = {}) => {
        slides.push({
            id: `g6_slide_${idCounter++}`,
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
    const bgImage = 'assets/images/grade6/onboarding_bg_placeholder.jpg'; // Feltételezett placeholder

    // 1. Welcome
    addSlide(SLIDE_TYPES.WELCOME, 'Parancsnoki Híd - Grade 6', 'Az űrállomás energiaellátása kritikus. <br>A javítórobotok vezérlőkódja megsérült.<br>Parancsnok, várjuk az utasításait!', {
        buttonText: 'Kilövés Engedélyezése',
        backgroundUrl: bgImage
    });

    // 2. Registration
    addSlide(SLIDE_TYPES.REGISTRATION, 'Parancsnoki Profil', '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Profil Mentése',
        backgroundUrl: bgImage,
        validation: { allowedClasses: ['6.a', '6.b', '6.c'] },
        scoring: { name: 1, nick: 1, classId: 1 }
    });

    // 3. Character
    addSlide(SLIDE_TYPES.CHARACTER, 'Válassz Tiszti Egyenruhát', 'Hogyan jelenjen meg a hologramod?', {
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
        let narrationText = `<b>${title}</b><br><br>Parancsnok, figyelem! Ez a bevezető szakasz.<br>(Helyőrző szöveg a ${i}. diánál)`;

        addSlide(SLIDE_TYPES.STORY, title, 'Kövessétek a protokollt...', {
            imageUrl: `assets/images/grade6/slides/slide_${slideNum}.jpg`,
            narration: narrationText
        });
    }

    // === 2. ÁLLOMÁSOK (KEVERT 5-24) ===
    const stationIndices = [0, 1, 2, 3, 4];
    shuffleArray(stationIndices);
    console.log("[DKV Grade 6] Station Order:", stationIndices);

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

            // === 1. ÁLLOMÁS: KRISTÁLY BOLYGÓ (5-8) ===
            if (originalNum === 5) { storyContent = `[Kristály Bolygó - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 6) { storyContent = `[Kristály Bolygó - Dia 2] ...`; }
            else if (originalNum === 7) { storyContent = `[Kristály Bolygó - Dia 3] (Feladat)...`; }
            else if (originalNum === 8) { storyContent = `[Kristály Bolygó - Dia 4] (Siker)...`; }

            // === 2. ÁLLOMÁS: ASZTEROIDA MEZŐ (9-12) ===
            else if (originalNum === 9) { storyContent = `[Aszteroida Mező - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 10) { storyContent = `[Aszteroida Mező - Dia 2] ...`; }
            else if (originalNum === 11) { storyContent = `[Aszteroida Mező - Dia 3] (Feladat)...`; }
            else if (originalNum === 12) { storyContent = `[Aszteroida Mező - Dia 4] (Siker)...`; }

            // === 3. ÁLLOMÁS: ELHAGYOTT ŰRÁLLOMÁS (13-16) ===
            else if (originalNum === 13) { storyContent = `[Elhagyott Űrállomás - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 14) { storyContent = `[Elhagyott Űrállomás - Dia 2] ...`; }
            else if (originalNum === 15) { storyContent = `[Elhagyott Űrállomás - Dia 3] (Feladat)...`; }
            else if (originalNum === 16) { storyContent = `[Elhagyott Űrállomás - Dia 4] (Siker)...`; }

            // === 4. ÁLLOMÁS: FEKETE LYUK ESEMÉNYHORIZONT (17-20) ===
            else if (originalNum === 17) { storyContent = `[Fekete Lyuk Eseményhorizont - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 18) { storyContent = `[Fekete Lyuk Eseményhorizont - Dia 2] ...`; }
            else if (originalNum === 19) { storyContent = `[Fekete Lyuk Eseményhorizont - Dia 3] (Feladat)...`; }
            else if (originalNum === 20) { storyContent = `[Fekete Lyuk Eseményhorizont - Dia 4] (Siker)...`; }

            // === 5. ÁLLOMÁS: IDEGEN ANYAHAJÓ (21-24) ===
            else if (originalNum === 21) { storyContent = `[Idegen Anyahajó - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 22) { storyContent = `[Idegen Anyahajó - Dia 2] ...`; }
            else if (originalNum === 23) { storyContent = `[Idegen Anyahajó - Dia 3] (Feladat)...`; }
            else if (originalNum === 24) { storyContent = `[Idegen Anyahajó - Dia 4] (Siker)...`; }


            let narrationText = `${storyContent}<br><br><span style="font-size:0.8em; opacity:0.7;">(Debug: Eredeti Dia #${originalNum} | Hely #${slot + 1} | Order: ${stationIndices.map(n => n + 1).join('-')})</span>`;

            addSlide(SLIDE_TYPES.STORY, title, 'Kövessétek a protokollt...', {
                imageUrl: `assets/images/grade6/slides/slide_${fileNumStr}.jpg`,
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

        let narrationText = `<b>${title}</b><br><br>Parancsnok, a küldetés teljesítve.<br>(Dia #${i})`;

        addSlide(SLIDE_TYPES.STORY, title, 'Végső visszaszámlálás...', {
            imageUrl: `assets/images/grade6/slides/slide_${slideNum}.jpg`,
            narration: narrationText
        });
    }

    return slides;
};
