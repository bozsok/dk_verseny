/**
 * Grade 4 Configuration
 * A Titkos Kódvadászok
 */

import { SLIDE_TYPES } from '../../core/engine/slides-config.js';

export const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    // === KÖZÖS STÍLUSOK (SHARED STYLES) - GRADE 4 ALAP ===
    // Jelenleg megegyezik a Grade 3-mal, de itt külön módosítható lesz!

    // 1. Gombok
    const SHARED_BUTTON_STYLE = {
        background: '#00636e', // Grade 4 specifikus színre cserélhető
        border: '2px solid #00eaff',
        fontFamily: 'Impact, sans-serif',
        color: '#ffffff',
        fontSize: '1.5rem',
        padding: '8px 28px',
        letterSpacing: '1px',
        fontWeight: 'normal',
        textTransform: 'uppercase'
    };

    // 2. Főcímek (Pl. Welcome Screen)
    const SHARED_TITLE_STYLE = {
        color: '#ffffff',
        fontFamily: 'Impact, sans-serif',
        textShadow: 'none',
        fontWeight: 'normal',
        letterSpacing: '1px',
        textAlign: 'left',
        marginBottom: '100px'
    };

    // 3. Szövegtörzs / Instrukciók
    const SHARED_TEXT_STYLE = {
        color: '#ffffff',
        fontFamily: '"Source Code Pro", monospace',
        fontSize: '1.4rem',
        lineHeight: '1.7',
        fontWeight: '200',
        textAlign: 'left'
    };

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
    // Figyelem: A Grade 4 mappából töltjük a képet!
    const bgImage = 'assets/images/grade4/onboarding_bg.jpg';

    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek, Kódvadász!', 'A küldetésed most veszi kezdetét.\nA <b>Hálózat</b> mélyén rejtőző titkokat kell feltárnod, hogy megvédd a digitális világot. Minden tudásodra szükség lesz, hogy feltörd a kódokat és elhárítsd a fenyegetést.\nKészülj fel, mert az <b>Idő</b> ketyeg, és a kihívások egyre nehezebbek lesznek.', {
        buttonText: 'Indítás',
        backgroundUrl: bgImage,
        style: {
            title: {
                ...SHARED_TITLE_STYLE,
                fontSize: '2.5rem',
                maxWidth: '940px',
                margin: '0 auto 100px auto'
            },
            description: {
                ...SHARED_TEXT_STYLE,
                gap: '25px'
            },
            button: SHARED_BUTTON_STYLE
        }
    });

    addSlide(SLIDE_TYPES.REGISTRATION, 'Regisztráció', '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['4.a', '4.b', '4.c'] // GRADE 4 Osztályok
        },
        style: {
            title: {
                ...SHARED_TEXT_STYLE,
                fontSize: '2rem',
                marginBottom: '40px',
                textAlign: 'center',
                fontWeight: '400'
            },
            button: SHARED_BUTTON_STYLE
        }
    });

    addSlide(SLIDE_TYPES.CHARACTER, 'Válassz karaktert!', 'Kattints a kártyára a nagyításhoz!', {
        options: ['boy', 'girl'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        style: {
            title: {
                ...SHARED_TEXT_STYLE,
                fontSize: '1.5rem',
                marginBottom: '15px',
                textAlign: 'center',
                fontWeight: '400'
            },
            description: {
                ...SHARED_TEXT_STYLE,
                color: '#cbd5e1',
                fontSize: '1.1rem',
                marginBottom: '30px',
                textAlign: 'center'
            },
            button: SHARED_BUTTON_STYLE
        }
    });

    // === 1. BEVEZETÉS (Intro) ===
    addSlide(SLIDE_TYPES.VIDEO, 'A Vihar Közeleg 1/4', 'Bevezetés a Hálózatba...', { videoUrl: 'assets/videos/grade4/intro_1.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Vihar Közeleg 2/4', 'A Glitch', { videoUrl: 'assets/videos/grade4/intro_2.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Vihar Közeleg 3/4', 'A Védelmi Rendszer', { videoUrl: 'assets/videos/grade4/intro_3.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Vihar Közeleg 4/4', 'Belépés', { videoUrl: 'assets/videos/grade4/intro_4.mp4' });

    // === 2. FELADATOK (Tasks) ===
    addSlide(SLIDE_TYPES.TASK, 'Az Első Tűzfal', 'Törd fel a jelszót!', {
        taskType: 'scramble',
        difficulty: 'medium' // Grade 4 nehezebb
    });

    return slides;
};
