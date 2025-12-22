/**
 * Grade 4 Configuration
 * A rejtett frissítés kódja
 */

import { SLIDE_TYPES } from '../../core/engine/slides-config.js';

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
    // Megj: Használjuk a grade-specifikus hátteret, ha létezik, vagy fallback
    const bgImage = 'assets/images/grade4/onboarding_bg.jpg';

    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek!', 'A rejtett frissítés kódja', {
        buttonText: 'Tovább',
        backgroundUrl: bgImage
    });

    addSlide(SLIDE_TYPES.REGISTRATION, 'Iratkozz fel', 'A rendszer várja az adataidat', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['4.a', '4.b', '4.c', '4.d']
        }
    });

    addSlide(SLIDE_TYPES.CHARACTER, 'Válassz Hőst', 'Ki legyen a karaktered?', {
        options: ['boy', 'girl'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage
    });

    // === 1. BEVEZETÉS (Intro) ===
    addSlide(SLIDE_TYPES.VIDEO, 'A Rendszer Titka 1/4', 'Valami furcsa történik...', { videoUrl: 'assets/videos/grade4/intro_1.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Rendszer Titka 2/4', 'A hibaüzenet', { videoUrl: 'assets/videos/grade4/intro_2.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Rendszer Titka 3/4', 'A kapcsolat felvétele', { videoUrl: 'assets/videos/grade4/intro_3.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Rendszer Titka 4/4', 'Indul a debuggolás!', { videoUrl: 'assets/videos/grade4/intro_4.mp4' });

    // === 2. FELADATOK (Tasks) ===
    // Itt a Grade 4 specifikus feladatok jönnének...
    // Demo feladatok a struktúra kedvéért:
    addSlide(SLIDE_TYPES.TASK, 'Logikai Kapuk', 'Ismerd meg az AND kaput', {
        taskType: 'logic_gate',
        difficulty: 'easy'
    });

    return slides;
};
