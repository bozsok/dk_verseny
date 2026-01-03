
import { SLIDE_TYPES } from '../../core/engine/slides-config.js';
import './styles/main.css';
import './styles/Welcome.css';
import './styles/Registration.css';
import './styles/Character.css';

// === GLOBÁLIS KONFIGURÁCIÓ (Grade 4) ===
// Itt definiáljuk a 4. osztályos "Várkastély / Lovagi" (példa) arculat alapjait

const GRADE_PATH = 'grade4';

// Közös stílus definíciók (CSS változók vagy osztálynevek)
const SHARED_BUTTON_STYLE = 'dkv-grade-4-button';
// Ez a class a grade4/styles/main.css-ben lesz definiálva!

export const createConfig = () => {
    // === 0. ONBOARDING ===
    // Háttér: Placeholder
    const bgImage = 'assets/images/grade4/onboarding_bg_placeholder.jpg';

    const slides = [
        // 1. ÜDVÖZLŐ DIÁK (Welcome)
        {
            id: 'welcome_01',
            type: SLIDE_TYPES.WELCOME,
            isLocked: false,
            completed: false,
            title: 'Üdvözöllek, 4. osztályos Kódlovag!',
            description: `Te már tapasztalt utazó vagy a <b>Kód Királyságban</b>.<br><br>
            A feladatod most komolyabb: meg kell védened a várat a digitális ostromtól.<br>
            A vírusok most erősebbek, de a tudásod is gyarapodott.`,
            content: {
                backgroundUrl: bgImage, // Vagy saját
                typingSpeed: 0, // KIKAPCSOLVA (Azonnali megjelenés)
                buttonText: 'Kalandra fel!',
                // Stílusok -> CSS (Welcome.css)
            }
        },

        // 2. REGISZTRÁCIÓ (Registration)
        {
            id: 'registration_01',
            type: SLIDE_TYPES.REGISTRATION,
            isLocked: true,
            completed: false,
            title: 'A Lovagi Tornához\nAdd meg az adataidat!',
            description: '', // Regisztráció Slide CSS intézi
            content: {
                backgroundUrl: bgImage,
                typingSpeed: 0, // KIKAPCSOLVA
                buttonText: 'Tovább',
                validation: {
                    allowedClasses: ['4.a', '4.b', '4.c'] // Konfigurálható osztályok
                },
                scoring: { name: 1, nick: 1, classId: 1 }
            }
        },

        // 3. KARAKTERVÁLASZTÁS (Character)
        {
            id: 'character_select',
            type: SLIDE_TYPES.CHARACTER,
            isLocked: true,
            completed: false,
            title: 'Válaszd ki a hősödet!',
            description: 'Ki vezesse a seregeet?', // CSS
            content: {
                backgroundUrl: bgImage,
                typingSpeed: 0, // KIKAPCSOLVA
                scoring: { selection: 1 },
                // Karakterek (Képek elérési útvonala)
                // PLACEHOLDER: Grade 3 ikonok használata a HUD működéséhez
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
            }
        },

        // 4. JÁTÉKFELÜLET DEMO (Task Slide)
        {
            id: 'game_interface_demo',
            type: SLIDE_TYPES.TASK, // Ez most a Demo módot indítja
            isLocked: true,
            completed: false,
            title: 'Játékfelület Prototípus',
            description: 'Ez a felület mutatja be az új egységes keretrendszert.',
            content: {
                taskId: 'demo_01',
                taskType: 'puzzle',
                points: 100
            }
        }
    ];

    return slides;
};
