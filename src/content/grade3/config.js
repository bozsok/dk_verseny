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

    addSlide(SLIDE_TYPES.WELCOME, 'Kód Királyság', 'Üdvözöllek a birodalomban!', {
        buttonText: 'Tovább',
        backgroundUrl: bgImage
    });
    addSlide(SLIDE_TYPES.REGISTRATION, 'Iratkozz fel', 'A királyi gárda várja az adataidat', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['3.a', '3.b', '3.c']
        }
    });
    addSlide(SLIDE_TYPES.CHARACTER, 'Válassz Hőst', 'Ki induljon a küldetésre?', {
        options: ['boy', 'girl'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage
    });

    // === 1. BEVEZETÉS (Intro) ===
    addSlide(SLIDE_TYPES.VIDEO, 'A Királyság Veszélyben 1/4', 'A sötét felhők gyülekeznek...', { videoUrl: 'assets/videos/grade3/intro_1.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Királyság Veszélyben 2/4', 'A titkos üzenet', { videoUrl: 'assets/videos/grade3/intro_2.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Királyság Veszélyben 3/4', 'A Bölcsek Tanácsa', { videoUrl: 'assets/videos/grade3/intro_3.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Királyság Veszélyben 4/4', 'Indulás', { videoUrl: 'assets/videos/grade3/intro_4.mp4' });

    // === 2. ÁLLOMÁSOK (1-5) ===
    for (let i = 1; i <= 5; i++) {
        addSlide(SLIDE_TYPES.VIDEO, `${i}. Állomás - Érkezés`, 'Új kihívás vár', { videoUrl: `assets/videos/grade3/station_${i}_1.mp4` });
        addSlide(SLIDE_TYPES.VIDEO, `${i}. Állomás - A Feladat`, 'Figyelj és tanulj', { videoUrl: `assets/videos/grade3/station_${i}_2.mp4` });

        // Feladat JSON betöltése (később)
        addSlide(SLIDE_TYPES.TASK, `${i}. Próbatétel`, 'Mutasd meg mit tudsz!', {
            taskId: `g3_task_${i}`,
            taskType: 'logic',
            points: 100
        });

        addSlide(SLIDE_TYPES.REWARD, `${i}. Állomás teljesítve`, 'Jutalom', { videoUrl: `assets/videos/grade3/station_${i}_reward.mp4` });
    }

    // === 3. VÉGJÁTÉK ===
    addSlide(SLIDE_TYPES.VIDEO, 'A Végső Csata 1', 'Szemtől szemben a sötétséggel', { videoUrl: 'assets/videos/grade3/finale_1.mp4' });
    addSlide(SLIDE_TYPES.VIDEO, 'A Végső Csata 2', 'A fordulat', { videoUrl: 'assets/videos/grade3/finale_2.mp4' });
    addSlide(SLIDE_TYPES.TASK, 'Záróvizsga', 'Mentsd meg a királyságot!', { taskId: 'g3_finale', points: 300 });
    addSlide(SLIDE_TYPES.REWARD, 'Győzelem', 'A király hálája', { videoUrl: 'assets/videos/grade3/finale_reward.mp4' });

    // === 4. LEVEZETÉS ===
    addSlide(SLIDE_TYPES.VIDEO, 'Epilógus', 'Békeidők', { videoUrl: 'assets/videos/grade3/outro_1.mp4' });
    addSlide(SLIDE_TYPES.INFO, 'Vége', 'Szép munka volt, Hős!', { showStats: true });

    return slides;
};
