/**
 * Grade 6 Configuration
 * A Fragmentumok Tükre
 */

import { SLIDE_TYPES } from '../../core/engine/slides-config.js';

export const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    // === KÖZÖS STÍLUSOK (SHARED STYLES) - GRADE 6 ALAP ===
    const SHARED_BUTTON_STYLE = {
        background: '#00636e',
        border: '2px solid #00eaff',
        fontFamily: 'Impact, sans-serif',
        color: '#ffffff',
        fontSize: '1.5rem',
        padding: '8px 28px',
        letterSpacing: '1px',
        fontWeight: 'normal',
        textTransform: 'uppercase'
    };

    const SHARED_TITLE_STYLE = {
        color: '#ffffff',
        fontFamily: 'Impact, sans-serif',
        textShadow: 'none',
        fontWeight: 'normal',
        letterSpacing: '1px',
        textAlign: 'left',
        marginBottom: '100px'
    };

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
    const bgImage = 'assets/images/grade6/onboarding_bg.jpg';

    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek a Rendszerben!', 'A valóság szövete kezd felfesleni.\nEgy ismeretlen eredetű <b>anomália</b> torzítja a teret és az időt. Te vagy az utolsó reményünk, hogy helyreállítsd a Fragmentumok Tükrét.\nLépj be a szimulációba, és találd meg a hiányzó darabokat, mielőtt a rendszer végleg összeomlik.', {
        buttonText: 'Csatlakozás',
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

    addSlide(SLIDE_TYPES.REGISTRATION, 'Felhasználó Azonosítás', '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['6.a', '6.b', '6.c'] // GRADE 6 Osztályok
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

    addSlide(SLIDE_TYPES.CHARACTER, 'Válassz Profilt!', 'Kattints a kártyára az adatokért!', {
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
    addSlide(SLIDE_TYPES.VIDEO, 'A Tükör Törése 1/4', 'A baleset...', { videoUrl: 'assets/videos/grade6/intro_1.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Tükör Törése 2/4', 'A szilánkok', { videoUrl: 'assets/videos/grade6/intro_2.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Tükör Törése 3/4', 'A torzulás', { videoUrl: 'assets/videos/grade6/intro_3.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Tükör Törése 4/4', 'A kapu', { videoUrl: 'assets/videos/grade6/intro_4.mp4' });

    // === 2. FELADATOK (Tasks) ===
    addSlide(SLIDE_TYPES.TASK, 'Logikai Kapuk', 'Állítsd helyre az áramkört!', {
        taskType: 'scramble',
        difficulty: 'hard' // Grade 6 nehéz
    });

    return slides;
};
