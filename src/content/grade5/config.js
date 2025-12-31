/**
 * Grade 5 Configuration
 * A Kibertér Lovagjai
 */

import { SLIDE_TYPES } from '../../core/engine/slides-config.js';

export const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    // === KÖZÖS STÍLUSOK (SHARED STYLES) - GRADE 5 ALAP ===
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
    const bgImage = 'assets/images/grade5/onboarding_bg.jpg';

    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek, Kiberlovag!', 'A virtuális királyság sorsa a kezedben van.\nEgy ősi mesterséges intelligencia, a <b>Genezis</b>, elszabadult, és át akarja venni az irányítást. Csak a legbátrabb lovagok képesek szembeszállni vele.\nGyűjtsd össze a kódtöredékeket, oldd meg a rejtvényeket, és állítsd vissza a rendet, mielőtt túl késő lenne.', {
        buttonText: 'Belépés',
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

    addSlide(SLIDE_TYPES.REGISTRATION, 'Identifikáció', '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['5.a', '5.b', '5.c'] // GRADE 5 Osztályok
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

    addSlide(SLIDE_TYPES.CHARACTER, 'Válassz Avatárt!', 'Kattints a kártyára a részletekért!', {
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
    addSlide(SLIDE_TYPES.VIDEO, 'Genezis Ébredése 1/4', 'A kezdetek...', { videoUrl: 'assets/videos/grade5/intro_1.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'Genezis Ébredése 2/4', 'Az első csapás', { videoUrl: 'assets/videos/grade5/intro_2.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'Genezis Ébredése 3/4', 'Az ellenállás', { videoUrl: 'assets/videos/grade5/intro_3.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'Genezis Ébredése 4/4', 'Indulás', { videoUrl: 'assets/videos/grade5/intro_4.mp4' });

    // === 2. FELADATOK (Tasks) ===
    addSlide(SLIDE_TYPES.TASK, 'Adatbázis Hiba', 'Javítsd ki a hibás rekordokat!', {
        taskType: 'scramble',
        difficulty: 'medium'
    });

    return slides;
};
