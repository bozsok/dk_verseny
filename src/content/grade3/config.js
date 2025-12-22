/**
 * Grade 3 Configuration
 * Kód Királyság titka
 */

import { SLIDE_TYPES } from '../../core/engine/slides-config.js'; // Központi típusok importálása

export const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    const addSlide = (type, title, description, content = {}) => {
        slides.push({
            id: idCounter++,
            type,
            title,
            description,
            content,
            isLocked: true,
            completed: false
        });
    };

    // === 0. REGISZTRÁCIÓ (Onboarding) ===
    const bgImage = 'assets/images/grade3/onboarding_bg.jpg';

    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek, bátor Kódmester!', 'Te lettél az egyik Kiválasztott, aki egy izgalmas és kalandokkal teli utazáson vesz részt.\nAz lesz a feladatod, hogy felfedezd a varázslatos Kód Királyságot és megállíts egy veszélyes, romboló vírust, amelyet egy egykori Kódbölcs készített. A megállításhoz és a királyság rendjének visszaállításához különböző digitális Varázskulcsokat kell megszerezned.\nA többi kiválasztottal együtt indulsz útnak, de remélhetőleg Te leszel az, aki sikerrel fejezi be a küldetését.', {
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        // EGYEDI STÍLUSOK (Grade 3 Specifikus)
        style: {
            title: {
                color: '#ffffff',
                textTransform: 'uppercase',
                fontFamily: 'Impact, sans-serif',
                fontSize: '2.5rem',
                textShadow: 'none',
                marginBottom: '100px', // Te kérted
                letterSpacing: '1px',
                fontWeight: 'normal'
            },
            description: {
                color: '#ffffff',
                fontFamily: '"Source Code Pro", monospace',
                fontSize: '1.4rem', // Nagyobb betű
                lineHeight: '1.7',
                fontWeight: '100', // Vékony
                textAlign: 'left', // Most már működik!
                gap: '25px',
            },
            button: {
                background: '#00636e',
                border: '2px solid #00eaff',
                fontFamily: 'Impact, sans-serif',
                color: '#ffffff',
                fontSize: '1.5rem',
                padding: '8px 28px',
                letterSpacing: '1px',
                fontWeight: 'normal'
            }
        }
    });

    addSlide(SLIDE_TYPES.REGISTRATION, 'Regisztráció', '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['3.a', '3.b', '3.c']
        }
    });

    addSlide(SLIDE_TYPES.CHARACTER, 'Következő feladatként válassz egy karaktert az alábbiak közül!', 'A karakterek kattintással nagyíthatók!', {
        options: ['boy', 'girl'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage
    });

    // === 1. BEVEZETÉS (Intro) ===
    addSlide(SLIDE_TYPES.VIDEO, 'A Királyság Veszélyben 1/4', 'A sötét felhők gyülekeznek...', { videoUrl: 'assets/videos/grade3/intro_1.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Királyság Veszélyben 2/4', 'A titkos üzenet', { videoUrl: 'assets/videos/grade3/intro_2.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Királyság Veszélyben 3/4', 'A Bölcsek Tanácsa', { videoUrl: 'assets/videos/grade3/intro_3.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Királyság Veszélyben 4/4', 'Az utazás kezdete', { videoUrl: 'assets/videos/grade3/intro_4.mp4' });

    // === 2. FELADATOK (Tasks) ===
    addSlide(SLIDE_TYPES.TASK, 'Az Ősi Kapu', 'Nyisd ki a kaput a megfelelő kóddal!', {
        taskType: 'scramble',
        difficulty: 'easy'
    });

    return slides;
};
