/**
 * Grade 5 Configuration
 * A töréspont rejtélye
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
    const bgImage = 'assets/images/grade5/onboarding_bg.jpg';

    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek!', 'A töréspont rejtélye', {
        buttonText: 'Tovább',
        backgroundUrl: bgImage
    });

    addSlide(SLIDE_TYPES.REGISTRATION, 'Regisztráció', '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['5.a', '5.b', '5.c']
        }
    });

    addSlide(SLIDE_TYPES.CHARACTER, 'Következő feladatként válassz egy karaktert az alábbiak közül!', 'A karakterek kattintással nagyíthatók!', {
        options: ['boy', 'girl'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage
    });

    // === 1. BEVEZETÉS (Intro) ===
    addSlide(SLIDE_TYPES.VIDEO, 'A Rejtély 1/4', 'A vihar kezdete...', { videoUrl: 'assets/videos/grade5/intro_1.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Rejtély 2/4', 'Az elveszett jel', { videoUrl: 'assets/videos/grade5/intro_2.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Rejtély 3/4', 'A dekódolás', { videoUrl: 'assets/videos/grade5/intro_3.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Rejtély 4/4', 'Az utazás indul', { videoUrl: 'assets/videos/grade5/intro_4.mp4' });

    // === 2. FELADATOK (Tasks) ===
    addSlide(SLIDE_TYPES.TASK, 'Algoritmusok', 'Tervezd meg az útvonalat', {
        taskType: 'algorithm_path',
        difficulty: 'medium'
    });

    return slides;
};
