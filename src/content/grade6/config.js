/**
 * Grade 6 Configuration
 * A fragmentumok tükre
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
    const bgImage = 'assets/images/grade6/onboarding_bg.jpg';

    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek!', 'A fragmentumok tükre', {
        buttonText: 'Tovább',
        backgroundUrl: bgImage
    });

    addSlide(SLIDE_TYPES.REGISTRATION, 'Iratkozz fel', 'A tükörvilág várja az adataidat', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['6.a', '6.b', '6.c']
        }
    });

    addSlide(SLIDE_TYPES.CHARACTER, 'Válassz Hőst', 'Ki legyen a karaktered?', {
        options: ['boy', 'girl'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage
    });

    // === 1. BEVEZETÉS (Intro) ===
    addSlide(SLIDE_TYPES.VIDEO, 'A Tükör 1/4', 'A törött darabok', { videoUrl: 'assets/videos/grade6/intro_1.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Tükör 2/4', 'A hamis visszhang', { videoUrl: 'assets/videos/grade6/intro_2.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Tükör 3/4', 'Az igazság fénye', { videoUrl: 'assets/videos/grade6/intro_3.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Tükör 4/4', 'Összeáll a kép', { videoUrl: 'assets/videos/grade6/intro_4.mp4' });

    // === 2. FELADATOK (Tasks) ===
    addSlide(SLIDE_TYPES.TASK, 'Kódfejtés', 'Találd meg a hibát a kódban', {
        taskType: 'debugging',
        difficulty: 'hard'
    });

    return slides;
};
