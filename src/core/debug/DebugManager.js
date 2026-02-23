/**
 * Debug Manager - Skip logika és state management
 * 
 * Ez a modul felelős a debug funkcionalitásért:
 * - Skip config management (LocalStorage)
 * - Slide skip ellenőrzés
 * - Dummy data alkalmazás
 * - Section mapping a shuffle-olt állomásokhoz
 */

import { buildSectionMap, findSectionBySlideIndex } from './DebugConfig.js';
import { DUMMY_PROFILE, ONBOARDING_SIMULATION_TIME } from './DebugDummyData.js';

class DebugManager {
    constructor(options = {}) {
        this.slideManager = options.slideManager;
        this.stateManager = options.stateManager;
        this.timeManager = options.timeManager;
        this.logger = options.logger;

        this.currentGrade = null;
        this.slides = [];
        this.sections = [];
        this.skipConfig = this.loadSkipConfig();
        this.isEnabled = this.skipConfig.enabled || false;
        this.tasksConfig = Object.assign(
            { globalTimeLimit: 900, mazeDifficulty: 16, memoryDifficulty: 16, puzzleDifficulty: 16 },
            this.skipConfig.tasksConfig || {}
        );

        // Éles szerveren: ha localStorage üres, betöltés build-config.json-ből
        // Ez az állítás aszinkron, az inicializálás része
        this._buildConfigLoaded = this._loadBuildConfigIfNeeded();
    }

    /**
     * Éles szerveren: ha localStorage-ban nincs konfig, betölti a build-config.json-ből.
     * Fejlesztői módban: localStorage van élnyomásban.
     */
    async _loadBuildConfigIfNeeded() {
        const stored = localStorage.getItem('dkv-debug-config');
        if (stored) return; // localStorage prioritás

        try {
            const response = await fetch('./build-config.json', { signal: AbortSignal.timeout(2000) });
            if (!response.ok) return;
            const config = await response.json();
            if (!config || config.enabled === undefined) return;

            // Éles szerveren: átvesszük a lefordított konfigot
            this.skipConfig = config;
            this.isEnabled = config.enabled || false;
            this.tasksConfig = Object.assign(
                { globalTimeLimit: 900, mazeDifficulty: 16, memoryDifficulty: 16, puzzleDifficulty: 16 },
                config.tasksConfig || {}
            );

            if (this.logger) {
                this.logger.info('[DEBUG] Config loaded from build-config.json', config);
            }
        } catch {
            // Ha nem érhető el a fájl, nincs hiba - alapértelmezettekkel megy tovább
        }
    }

    /**
     * Inicializálás grade-hez
     * 
     * @param {number} grade - Évfolyam (3-6)
     * @param {Array} slides - SlideManager.slides
     */
    initForGrade(grade, slides) {
        this.currentGrade = grade;
        this.slides = slides;
        this.sections = buildSectionMap(slides, grade);

        if (this.logger) {
            this.logger.info('[DEBUG] Initialized for grade', {
                grade,
                sections: this.sections.length,
                slides: slides.length
            });
        }
    }

    /**
     * Skip config betöltése localStorage-ból
     * 
     * @returns {Object} Config objektum
     */
    loadSkipConfig() {
        try {
            const stored = localStorage.getItem('dkv-debug-config');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (this.logger) {
                    this.logger.info('[DEBUG] Config loaded from storage', parsed);
                }
                return parsed;
            }
        } catch (e) {
            console.warn('[DEBUG] Failed to load config', e);
        }

        // Default config
        return {
            enabled: false,
            skipSections: [],
            skipSlides: [],
            useDummyData: false,
            muteMusic: true, // Default: true (némítva)
            tasksConfig: { globalTimeLimit: 900, mazeDifficulty: 16, memoryDifficulty: 16, puzzleDifficulty: 16 }
        };
    }

    /**
     * Skip config mentése
     * 
     * @param {Object} config - Config objektum
     */
    saveConfig(config) {
        this.skipConfig = config;
        this.isEnabled = config.enabled;

        try {
            localStorage.setItem('dkv-debug-config', JSON.stringify(config));
            if (this.logger) {
                this.logger.info('[DEBUG] Config saved', config);
            }
        } catch (e) {
            console.error('[DEBUG] Failed to save config', e);
        }
    }

    /**
     * Config reload (Hot reload)
     * 
     * Panel bezárása után azonnal érvényesül a változás
     */
    reloadConfig() {
        this.skipConfig = this.loadSkipConfig();
        this.isEnabled = this.skipConfig.enabled;

        if (this.logger) {
            this.logger.info('[DEBUG] Config reloaded (hot reload)', this.skipConfig);
        }
    }

    /**
     * Ellenőrzi, hogy skip-elni kell-e egy slide-ot
     * 
     * @param {number} slideIndex - Slide index (0-based)
     * @returns {boolean} true ha skip-elendő
     */
    shouldSkipSlide(slideIndex) {
        if (!this.isEnabled || !this.skipConfig.enabled) return false;

        const slide = this.slides[slideIndex];
        if (!slide) return false;

        // 1. Individual slide skip (magasabb prioritás) - ID-alapú ha van ID, különben Index
        let isSkipped = false;
        if (slide.id) {
            // Ha van ID, akkor CSAK az ID-t nézzük (shuffle-safe)
            isSkipped = this.skipConfig.skipSlides.includes(slide.id);
        } else {
            // Fallback az indexre ha nincs ID (legacy vagy speciális diák)
            isSkipped = this.skipConfig.skipSlides.includes(slideIndex);
        }

        if (isSkipped) {
            if (this.logger) {
                this.logger.debug('[DEBUG] Individual skip', { slideIndex, id: slide.id, title: slide.title });
            }
            return true;
        }

        // 2. Section skip (metadata alapján)
        const section = findSectionBySlideIndex(this.sections, slideIndex);
        if (section && this.skipConfig.skipSections.includes(section.id)) {
            if (this.logger) {
                this.logger.debug('[DEBUG] Section skip', {
                    slideIndex,
                    section: section.id,
                    title: slide.title
                });
            }
            return true;
        }

        return false;
    }

    /**
     * Section keresése slide index alapján
     * 
     * @param {number} slideIndex - Slide index
     * @returns {Object|null} Section vagy null
     */
    findSectionBySlideIndex(slideIndex) {
        return findSectionBySlideIndex(this.sections, slideIndex);
    }

    /**
     * Section skip ellenőrzése
     * 
     * @param {string} sectionId - Section ID
     * @returns {boolean} true ha skip-elve
     */
    isSectionSkipped(sectionId) {
        return this.skipConfig.skipSections.includes(sectionId);
    }

    /**
     * Háttérzene némítás ellenőrzése
     * 
     * @returns {boolean} true ha a háttérzene némítva van
     */
    shouldMuteMusic() {
        return this.skipConfig.muteMusic === true;
    }

    /**
     * Dummy adatok alkalmazása (Onboarding skip esetén)
     * 
     * Automatikusan:
     * - Betölti a dummy profilt
     * - Beállítja az avatart
     * - Hozzáadja a pontszámot (4)
     * - Elindítja a timer-t 38mp offsettel
     * 
     * AUTO-ENABLE: Onboarding skip MINDIG alkalmazza a dummy data-t
     */
    applyDummyData() {
        // State update
        this.stateManager.updateState({
            userProfile: DUMMY_PROFILE.userProfile,
            avatar: DUMMY_PROFILE.avatar,
            score: DUMMY_PROFILE.score,
            isDebugSession: true // Flag a debug session-höz
        });

        // Timer indítás + 38mp offset
        if (this.timeManager && !this.timeManager.globalTimer.isRunning) {
            this.timeManager.startCompetition();

            // HACK: Offset hozzáadása (38 sec visszadátálás) - HELYES property!
            this.timeManager.globalTimer.startTime -= ONBOARDING_SIMULATION_TIME;

            if (this.logger) {
                this.logger.info('[DEBUG] Timer started with 38s offset');
            }
        }

        if (this.logger) {
            this.logger.info('[DEBUG] Dummy data applied', {
                profile: DUMMY_PROFILE.userProfile,
                avatar: DUMMY_PROFILE.avatar,
                score: DUMMY_PROFILE.score,
                timeOffset: ONBOARDING_SIMULATION_TIME
            });
        }
    }

    /**
     * Debug mód kikapcsolása (biztonsági fallback)
     * 
     * Infinite loop vagy hiba esetén ezt hívjuk meg
     */
    disable() {
        this.isEnabled = false;
        this.skipConfig.enabled = false;
        this.saveConfig(this.skipConfig);

        console.warn('[DEBUG] Debug mode DISABLED (safety fallback)');

        if (this.logger) {
            this.logger.warn('[DEBUG] Debug mode force-disabled');
        }
    }

    /**
     * Statisztikák lekérése
     * 
     * @returns {Object} Stats objektum
     */
    getStats() {
        // Section skip-ekből származó slide-ok
        const skippedSectionSlides = this.skipConfig.skipSections
            .flatMap(secId => {
                const sec = this.sections.find(s => s.id === secId);
                return sec ? sec.slideIndices : [];
            });

        // Unique slide-ok (section + individual combined)
        const totalSkippedSet = new Set([
            ...skippedSectionSlides,
            ...this.skipConfig.skipSlides
        ]);

        return {
            enabled: this.isEnabled,
            skippedSections: this.skipConfig.skipSections.length,
            skippedSectionSlides: skippedSectionSlides.length,
            skippedIndividualSlides: this.skipConfig.skipSlides.length,
            totalSkipped: totalSkippedSet.size,
            totalSlides: this.slides.length
        };
    }

    /**
     * Debug Session flag ellenőrzése
     * 
     * @returns {boolean} true ha debug session aktív
     */
    isDebugSession() {
        return this.stateManager.getStateValue('isDebugSession') === true;
    }

    /**
     * Debug Session reset (új játék indításkor)
     */
    resetDebugSession() {
        this.stateManager.updateState({
            isDebugSession: false
        });

        if (this.logger) {
            this.logger.info('[DEBUG] Debug session flag reset');
        }
    }
}

export default DebugManager;
