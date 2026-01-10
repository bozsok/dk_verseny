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

    // === ONBOARDING (Fix, mindig 0-2) ===
    sections.push({
        id: 'onboarding',
        name: 'Onboarding',
        description: '3 slides (Welcome, Registration, Character)',
        slideIndices: [0, 1, 2],
        requiresDummyData: true // Dummy data szükséges skip esetén
    });

    // === INTRO (Fix, mindig 3-6) ===
    sections.push({
        id: 'intro',
        name: 'Intro',
        description: '4 slides (Story Introduction)',
        slideIndices: [3, 4, 5, 6],
        requiresDummyData: false
    });

    // === ÁLLOMÁSOK (Dinamikus - MEGJELENÍTETT sorrend!) ===
    // Először megállapítjuk a MEGJELENÍTETT sorrendet a slides metadata alapján
    const displayOrder = [];
    slides.forEach((slide, idx) => {
        if (slide.metadata?.section?.startsWith('station_')) {
            const stationNum = parseInt(slide.metadata.section.split('_')[1]);
            // Csak egyszer adjuk hozzá minden állomást
            if (!displayOrder.includes(stationNum)) {
                displayOrder.push(stationNum);
            }
        }
    });

    console.log('[DEBUG CONFIG] Station display order:', displayOrder.map(n => `station_${n}`).join(', '));

    // Most végigmegyünk a MEGJELENÍTETT sorrendben
    displayOrder.forEach((originalStationNum, displayIdx) => {
        const stationSlides = slides
            .map((s, idx) => ({ slide: s, index: idx }))
            .filter(({ slide }) => slide.metadata?.section === `station_${originalStationNum}`)
            .map(({ index }) => index);

        sections.push({
            id: `station_${originalStationNum}`, // ID marad az eredeti (metadata compatibility)
            name: `${displayIdx + 1}. Állomás`, // DE a név a megjelenített sorszám!
            description: `4 slides (Eredeti: ${originalStationNum}. állomás)`,
            slideIndices: stationSlides,
            requiresDummyData: false
        });
    });

    // === FINAL (Grade-dependent, fix indexek) ===
    // Grade 3: 25-28 (4 slides)
    // Grade 4-6: TODO (később hozzáadandó)
    const finalIndices = getFinalSlideIndices(grade);

    sections.push({
        id: 'final',
        name: 'Final',
        description: '4 slides (Finale)',
        slideIndices: finalIndices,
        requiresDummyData: false
    });

    return sections;
};

/**
 * Grade-dependent final slide indexek
 * 
 * @param {number} grade - Évfolyam (3-6)
 * @returns {Array<number>} Final slide indexek
 */
function getFinalSlideIndices(grade) {
    const finalIndexMap = {
        3: [25, 26, 27, 28],  // Grade 3: 28 slides total
        4: [25, 26, 27, 28],  // Grade 4: TODO - verify
        5: [25, 26, 27, 28],  // Grade 5: TODO - verify
        6: [25, 26, 27, 28]   // Grade 6: TODO - verify
    };

    return finalIndexMap[grade] || [];
}

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
