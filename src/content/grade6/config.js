
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

    // === STORY SLIDES (Unified 1-28 Loop) ===
    for (let i = 1; i <= 28; i++) {
        const slideNum = String(i).padStart(2, '0');
        let title = `Misszió ${i}. szakasz`;

        if (i <= 4) {
            title = `Bevezetés ${i}. (Kontextus)`;
        } else if (i <= 24) {
            const relative = i - 5;
            const stationNum = Math.floor(relative / 4) + 1;
            const stepInStation = relative % 4; // 0,1,2,3
            title = `${stationNum}. Állomás: `;
            if (stepInStation === 0 || stepInStation === 1) title += "Kontextus";
            else if (stepInStation === 2) title += "Feladat";
            else title += "Siker, Öröm";
        } else {
            title = "Finálé: ";
            if (i === 25) title += "Kontextus";
            else if (i === 26) title += "Feladat";
            else if (i === 27) title += "Siker, Öröm";
            else title += "Összefoglaló";
        }

        addSlide(SLIDE_TYPES.STORY, title, 'Kövessétek a protokollt...', {
            imageUrl: `assets/images/grade6/slides/slide_${slideNum}.jpg`
        });
    }

    return slides;
};
