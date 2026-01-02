
import { SLIDE_TYPES } from '../../core/engine/slides-config.js';
import './styles/main.css';
import './styles/Welcome.css';
import './styles/Registration.css';
import './styles/Character.css';

// === GLOBÁLIS KONFIGURÁCIÓ (Grade 5) ===
// Téma: "Cyberpunk / Jövő" (Példa)

const GRADE_PATH = 'grade5';
const SHARED_BUTTON_STYLE = 'dkv-grade-5-button';

export const createConfig = () => {
    const bgImage = 'assets/images/grade3/onboarding_bg.png'; // Fallback

    const slides = [
        {
            id: 'welcome_01',
            type: SLIDE_TYPES.WELCOME,
            isLocked: false,
            completed: false,
            title: 'Rendszer Indítása... Grade 5',
            description: `A hálózat veszélyben van. A Kódvírusok 5. szintű titkosítást használnak.<br>
            Csak te tudod feltörni a védelmüket.`,
            content: {
                backgroundUrl: bgImage,
                typingSpeed: 0,
                buttonText: 'Csatlakozás'
            }
        },
        {
            id: 'registration_01',
            type: SLIDE_TYPES.REGISTRATION,
            isLocked: true,
            completed: false,
            title: 'Ügynök Regisztráció',
            description: '',
            content: {
                backgroundUrl: bgImage,
                typingSpeed: 0,
                buttonText: 'Adatok Küldése',
                validation: { allowedClasses: ['5.a', '5.b', '5.c'] }
            }
        },
        {
            id: 'character_select',
            type: SLIDE_TYPES.CHARACTER,
            isLocked: true,
            completed: false,
            title: 'Válassz Avatárt',
            description: 'Melyik digitális lenyomatot használod?',
            content: {
                backgroundUrl: bgImage,
                typingSpeed: 0,
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
        {
            id: 'game_interface_demo',
            type: SLIDE_TYPES.TASK,
            isLocked: true,
            completed: false,
            title: 'Játékfelület Prototípus (Mátrix)',
            description: 'Grade 5 Interface Test',
            content: {
                taskId: 'demo_05',
                taskType: 'puzzle',
                points: 100
            }
        }
    ];
    return slides;
};
