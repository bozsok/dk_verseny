/**
 * Debug Configuration - Section struktúra builder
 * 
 * Ez a modul felelős azért, hogy dinamikusan felépítse a debug panel
 * section struktúráját a SlideManager slides alapján.
 * 
 * Mivel az állomások shuffle-olva vannak, a metadata alapján
 * történik a section-slide mapping.
 */

/**
 * Debug Section struktúra builder
 * 
 * @param {Array} slides - SlideManager.slides tömbje
 * @param {number} grade - Aktuális évfolyam (3-6)
 * @returns {Array} Section configuration objektumok
 */
export const buildSectionMap = (slides, grade = 3) => {
    const sections = [];

    // Helper függvény szekciók kinyeréséhez metadata alapján
    const getSlidesBySection = (sectionId) => {
        return slides
            .map((s, idx) => ({ slide: s, index: idx }))
            .filter(({ slide }) => slide.metadata?.section === sectionId)
            .map(({ index }) => index);
    };

    // 1. ONBOARDING
    const onboardingSlides = getSlidesBySection('onboarding');
    if (onboardingSlides.length > 0) {
        sections.push({
            id: 'onboarding',
            name: 'Onboarding',
            description: 'Welcome, Registration, Character',
            slideIndices: onboardingSlides,
            requiresDummyData: true
        });
    }

    // 2. INTRO
    const introSlides = getSlidesBySection('intro');
    if (introSlides.length > 0) {
        sections.push({
            id: 'intro',
            name: 'Intro',
            description: 'Story Introduction',
            slideIndices: introSlides,
            requiresDummyData: false
        });
    }

    // 3. ÁLLOMÁSOK (1-5)
    const stationNames = {
        1: 'Labirintuskert',
        2: 'Adat-tenger',
        3: 'Tudás Torony',
        4: 'Pixel Palota',
        5: 'Hangerdő'
    };

    for (let stationNum = 1; stationNum <= 5; stationNum++) {
        const stationSlides = getSlidesBySection(`station_${stationNum}`);

        if (stationSlides.length > 0) {
            sections.push({
                id: `station_${stationNum}`,
                name: `${stationNum}. Állomás (${stationNames[stationNum] || 'Ismeretlen'})`,
                description: `Eredeti: ${stationNum}. állomás`,
                slideIndices: stationSlides,
                requiresDummyData: false
            });
        }
    }

    // 4. FINAL
    const finalSlides = getSlidesBySection('final');
    if (finalSlides.length > 0) {
        sections.push({
            id: 'final',
            name: 'Final',
            description: 'Finale slides',
            slideIndices: finalSlides,
            requiresDummyData: false
        });
    }

    return sections;
};

/**
 * Section keresése slide index alapján
 * 
 * @param {Array} sections - Section objektumok
 * @param {number} slideIndex - Slide index (0-based)
 * @returns {Object|null} Section objektum vagy null
 */
export const findSectionBySlideIndex = (sections, slideIndex) => {
    return sections.find(s => s.slideIndices.includes(slideIndex)) || null;
};

/**
 * Default export
 */
export default {
    buildSectionMap,
    findSectionBySlideIndex
};
