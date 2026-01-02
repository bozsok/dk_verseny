
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
                }
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
                // Karakterek (Képek elérési útvonala)
                // TODO: Grade 4 specifikus képek!
                characters: {
                    boy: [
                        { id: 'b1', card: 'assets/images/grade3/characters/boy1_card.png', zoom: 'assets/images/grade3/characters/boy1_zoom.png' },
                        { id: 'b2', card: 'assets/images/grade3/characters/boy2_card.png', zoom: 'assets/images/grade3/characters/boy2_zoom.png' },
                        { id: 'b3', card: 'assets/images/grade3/characters/boy3_card.png', zoom: 'assets/images/grade3/characters/boy3_zoom.png' },
                        { id: 'b4', card: 'assets/images/grade3/characters/boy4_card.png', zoom: 'assets/images/grade3/characters/boy4_zoom.png' }
                    ],
                    girl: [
                        { id: 'g1', card: 'assets/images/grade3/characters/girl1_card.png', zoom: 'assets/images/grade3/characters/girl1_zoom.png' },
                        { id: 'g2', card: 'assets/images/grade3/characters/girl2_card.png', zoom: 'assets/images/grade3/characters/girl2_zoom.png' },
                        { id: 'g3', card: 'assets/images/grade3/characters/girl3_card.png', zoom: 'assets/images/grade3/characters/girl3_zoom.png' },
                        { id: 'g4', card: 'assets/images/grade3/characters/girl4_card.png', zoom: 'assets/images/grade3/characters/girl4_zoom.png' }
                    ]
                }
            }
        },

        // ... TOVÁBBI TARTALOM (VIDEÓK, FELADATOK) KÉSŐBB ...
    ];

    return slides;
};
