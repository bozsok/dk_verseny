import { SLIDE_TYPES } from '../../core/engine/slides-config.js';
import './styles/main.css';
import './styles/Registration.css';
import './styles/Welcome.css';
import './styles/Character.css';

const TYPING_SPEED = 2;

export const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    const addSlide = (type, title, description, content = {}) => {
        const enrichedContent = {
            ...content,
            typingSpeed: TYPING_SPEED
        };
        slides.push({
            id: idCounter++,
            type,
            title,
            description,
            content: enrichedContent,
            isLocked: true,
            completed: false
        });
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const bgImage = 'assets/images/grade4/onboarding_bg.png';

    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek, bátor Lovag!', 'Te lettél az egyik <b>Kiválasztott</b>, aki egy izgalmas és kalandokkal teli utazáson vesz részt.\nAz lesz a feladatod, hogy felfedezd a varázslatos <b>Lovagrendet</b> és megállíts egy veszélyes fenyegetést. A rend helyreállításához különböző <b>Ereklyéket</b> kell összegyűjtened.\nA többi kiválasztottal együtt indulsz útnak, de remélhetőleg <b>Te</b> leszel az, aki sikerrel fejezi be a küldetését.', {
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        audioSrc: 'assets/audio/grade4/welcome.mp3'
    });

    addSlide(SLIDE_TYPES.REGISTRATION, 'Első feladatként írd be a teljes nevedet az alábbi beviteli mezőbe! A teljes nevedre van szükség.\nEzt követően add meg a becenevedet maximum 10 betűből, majd utána az osztályodat!', '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['4.a', '4.b', '4.c']
        },
        scoring: {
            name: 1,
            nick: 1,
            classId: 1
        },
        audioSrc: 'assets/audio/grade4/registration.mp3'
    });

    addSlide(SLIDE_TYPES.CHARACTER, 'Következő feladatként válassz egy karaktert az alábbiak közül!\nA karakterek kattintással nagyíthatók!', '', {
        characters: {
            boy: [
                { id: 'b1', card: 'assets/images/grade4/karakter/boy_1.jpg', zoom: 'assets/images/grade4/karakter/large/boy_1_n.jpg', icon: 'assets/images/grade4/karakter/small/boy_1_k.jpg' },
                { id: 'b2', card: 'assets/images/grade4/karakter/boy_2.jpg', zoom: 'assets/images/grade4/karakter/large/boy_2_n.jpg', icon: 'assets/images/grade4/karakter/small/boy_2_k.jpg' },
                { id: 'b3', card: 'assets/images/grade4/karakter/boy_3.jpg', zoom: 'assets/images/grade4/karakter/large/boy_3_n.jpg', icon: 'assets/images/grade4/karakter/small/boy_3_k.jpg' },
                { id: 'b4', card: 'assets/images/grade4/karakter/boy_4.jpg', zoom: 'assets/images/grade4/karakter/large/boy_4_n.jpg', icon: 'assets/images/grade4/karakter/small/boy_4_k.jpg' }
            ],
            girl: [
                { id: 'g1', card: 'assets/images/grade4/karakter/girl_1.jpg', zoom: 'assets/images/grade4/karakter/large/girl_1_n.jpg', icon: 'assets/images/grade4/karakter/small/girl_1_k.jpg' },
                { id: 'g2', card: 'assets/images/grade4/karakter/girl_2.jpg', zoom: 'assets/images/grade4/karakter/large/girl_2_n.jpg', icon: 'assets/images/grade4/karakter/small/girl_2_k.jpg' },
                { id: 'g3', card: 'assets/images/grade4/karakter/girl_3.jpg', zoom: 'assets/images/grade4/karakter/large/girl_3_n.jpg', icon: 'assets/images/grade4/karakter/small/girl_3_k.jpg' },
                { id: 'g4', card: 'assets/images/grade4/karakter/girl_4.jpg', zoom: 'assets/images/grade4/karakter/large/girl_4_n.jpg', icon: 'assets/images/grade4/karakter/small/girl_4_k.jpg' }
            ]
        },
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        scoring: {
            selection: 1
        },
        audioSrc: 'assets/audio/grade4/character.mp3'
    });

    // === 1. BEVEZETÉS (FIX 1-4) ===
    for (let i = 1; i <= 4; i++) {
        const slideNum = String(i).padStart(2, '0');
        const title = `Bevezetés ${i}. (Lovagrend)`;

        // Placeholder szövegek (A User majd kicseréli)
        const narrationText = `<b>${title}</b><br><br>Itt olvasható majd a kaland története.<br>Jelenleg ez egy helyőrző szöveg a Grade 4 (${i}.) diánál.`;

        addSlide(SLIDE_TYPES.STORY, title, 'Kövessétek az utasításokat...', {
            imageUrl: `assets/images/grade4/slides/slide_${slideNum}.jpg`,
            narration: narrationText,
            audioSrc: `assets/audio/grade4/slide_${slideNum}.mp3`
        });
    }

    // === 2. ÁLLOMÁSOK (KEVERT 5-24) ===
    const stationIndices = [0, 1, 2, 3, 4];
    shuffleArray(stationIndices);

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

            let storyContent = `<b>${title}</b><br><br>Helyőrző szöveg az eredeti Grade 4 #${originalNum}. diához.`;
            let narrationText = `${storyContent}<br><br><span style="font-size:0.8em; opacity:0.7;">(Debug: Eredeti Dia #${originalNum} | Hely #${slot + 1})</span>`;

            addSlide(SLIDE_TYPES.STORY, title, 'Teljesítsétek a kihívást...', {
                imageUrl: `assets/images/grade4/slides/slide_${fileNumStr}.jpg`,
                narration: narrationText,
                audioSrc: `assets/audio/grade4/slide_${fileNumStr}.mp3`
            });
        }
    }

    // === 3. FINÁLÉ (FIX 25-28) ===
    for (let i = 25; i <= 28; i++) {
        const slideNum = String(i).padStart(2, '0');
        const title = "Finálé (Lovagrend)";
        const narrationText = `<b>${title}</b><br><br>Helyőrző szöveg az Grade 4 fináléjához (${i}. dia).`;

        addSlide(SLIDE_TYPES.STORY, title, 'A végső megmérettetés...', {
            imageUrl: `assets/images/grade4/slides/slide_${slideNum}.jpg`,
            narration: narrationText,
            audioSrc: `assets/audio/grade4/slide_${slideNum}.mp3`
        });
    }

    return slides;
};
