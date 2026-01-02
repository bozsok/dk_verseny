import { SLIDE_TYPES } from '../../core/engine/slides-config.js';
import './styles/main.css'; // Központi stílusok (Gombok, Reset)
import './styles/Registration.css';
import './styles/Welcome.css';
import './styles/Character.css';

// Logikai konstansok (Stílusok a CSS-ben vannak!)
const TYPING_SPEED = 2; // ms/karakter (User módosítása)

export const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    // Helper függvény a typingSpeed átadására
    const addSlide = (type, title, description, content = {}) => {
        // Alapértelmezett logikai beállítások (nem stílusok!)
        const enrichedContent = {
            ...content,
            typingSpeed: TYPING_SPEED // Mindenkinek átadjuk a sebességet
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

    // === 0. ONBOARDING ===
    // Háttér: Eredeti Grade 3 háttérkép
    const bgImage = 'assets/images/grade3/onboarding_bg.png';

    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek, bátor Kódmester!', 'Te lettél az egyik <b>Kiválasztott</b>, aki egy izgalmas és kalandokkal teli utazáson vesz részt.\nAz lesz a feladatod, hogy felfedezd a varázslatos <b>Kód Királyságot</b> és megállíts egy veszélyes, romboló vírust, amelyet egy egykori <b>Kódbölcs</b> készített. A megállításhoz és a királyság rendjének visszaállításához különböző digitális <b>Varázskulcsokat</b> kell megszerezned.\nA többi kiválasztottal együtt indulsz útnak, de remélhetőleg <b>Te</b> leszel az, aki sikerrel fejezi be a küldetését.', {
        buttonText: 'Tovább',
        backgroundUrl: bgImage
    });

    addSlide(SLIDE_TYPES.REGISTRATION, 'Első feladatként írd be a teljes nevedet az alábbi beviteli mezőbe! A teljes nevedre van szükség, ezért nem elég az, hogy Marci vagy Szofi.\nEzt követően add meg a becenevedet maximum 10 betűből, majd utána az osztályodat!', '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['3.a', '3.b', '3.c']
        },
        scoring: {
            name: 1,
            nick: 1,
            classId: 1
        }
    });

    addSlide(SLIDE_TYPES.CHARACTER, 'Következő feladatként válassz egy karaktert az alábbiak közül!\nA karakterek kattintással nagyíthatók!', '', {
        characters: {
            boy: [
                { id: 'b1', card: 'assets/images/grade3/karakter/boy_1.jpg', zoom: 'assets/images/grade3/karakter/large/boy_1_n.jpg', icon: 'assets/images/grade3/karakter/small/boy_1_k.jpg' },
                { id: 'b2', card: 'assets/images/grade3/karakter/boy_2.jpg', zoom: 'assets/images/grade3/karakter/large/boy_2_n.jpg', icon: 'assets/images/grade3/karakter/small/boy_2_k.jpg' },
                { id: 'b3', card: 'assets/images/grade3/karakter/boy_3.jpg', zoom: 'assets/images/grade3/karakter/large/boy_3_n.jpg', icon: 'assets/images/grade3/karakter/small/boy_3_k.jpg' },
                { id: 'b4', card: 'assets/images/grade3/karakter/boy_4.jpg', zoom: 'assets/images/grade3/karakter/large/boy_4_n.jpg', icon: 'assets/images/grade3/karakter/small/boy_4_k.jpg' }
            ],
            girl: [
                { id: 'g1', card: 'assets/images/grade3/karakter/girl_1.jpg', zoom: 'assets/images/grade3/karakter/large/girl_1_n.jpg', icon: 'assets/images/grade3/karakter/small/girl_1_k.jpg' },
                { id: 'g2', card: 'assets/images/grade3/karakter/girl_2.jpg', zoom: 'assets/images/grade3/karakter/large/girl_2_n.jpg', icon: 'assets/images/grade3/karakter/small/girl_2_k.jpg' },
                { id: 'g3', card: 'assets/images/grade3/karakter/girl_3.jpg', zoom: 'assets/images/grade3/karakter/large/girl_3_n.jpg', icon: 'assets/images/grade3/karakter/small/girl_3_k.jpg' },
                { id: 'g4', card: 'assets/images/grade3/karakter/girl_4.jpg', zoom: 'assets/images/grade3/karakter/large/girl_4_n.jpg', icon: 'assets/images/grade3/karakter/small/girl_4_k.jpg' }
            ]
        },
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        scoring: {
            selection: 1
        }
    });

    // 4. JÁTÉKFELÜLET DEMO (Task Slide)
    addSlide(SLIDE_TYPES.TASK, 'Játékfelület Prototípus (Varázserdő)', 'Grade 3 Interface Test', {
        taskId: 'demo_03',
        taskType: 'puzzle',
        points: 100
    });
    addSlide(SLIDE_TYPES.VIDEO, 'A Királyság Veszélyben 1/4', 'A sötét felhők gyülekeznek...', { videoUrl: 'assets/videos/grade3/intro_1.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Királyság Veszélyben 2/4', 'A titkos üzenet', { videoUrl: 'assets/videos/grade3/intro_2.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Királyság Veszélyben 3/4', 'A Bölcsek Tanácsa', { videoUrl: 'assets/videos/grade3/intro_3.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Királyság Veszélyben 4/4', 'Az utazás kezdete', { videoUrl: 'assets/videos/grade3/intro_4.mp4' });

    // === 2. FELADATOK (Tasks) ===
    addSlide(SLIDE_TYPES.TASK, 'Az Ősi Kapu', 'Nyisd ki a kaput a megfelelő kóddal!', {
        taskType: 'scramble',
        difficulty: 'easy'
        // További konfiguráció majd itt...
    });

    return slides;
};
