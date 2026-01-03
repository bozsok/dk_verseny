import { SLIDE_TYPES } from '../../core/engine/slides-config.js';
import './styles/main.css'; // Központi stílusok (Gombok, Reset)
import './styles/Registration.css';
import './styles/Welcome.css';
import './styles/Character.css';

// Logikai konstansok (Stílusok a CSS-ben vannak!)
const TYPING_SPEED = 2; // ms/karakter (User módosítása)

export const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    // Helper függvény a typingSpeed átadására
    const addSlide = (type, title, description, content = {}) => {
        // Alapértelmezett logikai beállítások (nem stílusok!)
        const enrichedContent = {
            ...content,
            typingSpeed: TYPING_SPEED // Mindenkinek átadjuk a sebességet
        };

        slides.push({
            id: idCounter++,
            type,
            title,
            description,
            content: enrichedContent,
            isLocked: true,
            completed: false
        });
    };

    // Shuffle helper (Fisher-Yates)
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // === 0. ONBOARDING ===
    // Háttér: Eredeti Grade 3 háttérkép
    const bgImage = 'assets/images/grade3/onboarding_bg.png';

    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek, bátor Kódmester!', 'Te lettél az egyik <b>Kiválasztott</b>, aki egy izgalmas és kalandokkal teli utazáson vesz részt.\nAz lesz a feladatod, hogy felfedezd a varázslatos <b>Kód Királyságot</b> és megállíts egy veszélyes, romboló vírust, amelyet egy egykori <b>Kódbölcs</b> készített. A megállításhoz és a királyság rendjének visszaállításához különböző digitális <b>Varázskulcsokat</b> kell megszerezned.\nA többi kiválasztottal együtt indulsz útnak, de remélhetőleg <b>Te</b> leszel az, aki sikerrel fejezi be a küldetését.', {
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        audioSrc: 'assets/audio/grade3/welcome.mp3'
    });

    addSlide(SLIDE_TYPES.REGISTRATION, 'Első feladatként írd be a teljes nevedet az alábbi beviteli mezőbe! A teljes nevedre van szükség, ezért nem elég az, hogy Marci vagy Szofi.\nEzt követően add meg a becenevedet maximum 10 betűből, majd utána az osztályodat!', '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['3.a', '3.b', '3.c']
        },
        scoring: {
            name: 1,
            nick: 1,
            classId: 1
        },
        audioSrc: 'assets/audio/grade3/registration.mp3'
    });

    addSlide(SLIDE_TYPES.CHARACTER, 'Következő feladatként válassz egy karaktert az alábbiak közül!\nA karakterek kattintással nagyíthatók!', '', {
        characters: {
            boy: [
                { id: 'b1', card: 'assets/images/grade3/karakter/boy_1.jpg', zoom: 'assets/images/grade3/karakter/large/boy_1_n.jpg', icon: 'assets/images/grade3/karakter/small/boy_1_k.jpg' },
                { id: 'b2', card: 'assets/images/grade3/karakter/boy_2.jpg', zoom: 'assets/images/grade3/karakter/large/boy_2_n.jpg', icon: 'assets/images/grade3/karakter/small/boy_2_k.jpg' },
                { id: 'b3', card: 'assets/images/grade3/karakter/boy_3.jpg', zoom: 'assets/images/grade3/karakter/large/boy_3_n.jpg', icon: 'assets/images/grade3/karakter/small/boy_3_k.jpg' },
                { id: 'b4', card: 'assets/images/grade3/karakter/boy_4.jpg', zoom: 'assets/images/grade3/karakter/large/boy_4_n.jpg', icon: 'assets/images/grade3/karakter/small/boy_4_k.jpg' }
            ],
            girl: [
                { id: 'g1', card: 'assets/images/grade3/karakter/girl_1.jpg', zoom: 'assets/images/grade3/karakter/large/girl_1_n.jpg', icon: 'assets/images/grade3/karakter/small/girl_1_k.jpg' },
                { id: 'g2', card: 'assets/images/grade3/karakter/girl_2.jpg', zoom: 'assets/images/grade3/karakter/large/girl_2_n.jpg', icon: 'assets/images/grade3/karakter/small/girl_2_k.jpg' },
                { id: 'g3', card: 'assets/images/grade3/karakter/girl_3.jpg', zoom: 'assets/images/grade3/karakter/large/girl_3_n.jpg', icon: 'assets/images/grade3/karakter/small/girl_3_k.jpg' },
                { id: 'g4', card: 'assets/images/grade3/karakter/girl_4.jpg', zoom: 'assets/images/grade3/karakter/large/girl_4_n.jpg', icon: 'assets/images/grade3/karakter/small/girl_4_k.jpg' }
            ]
        },
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        scoring: {
            selection: 1
        },
        audioSrc: 'assets/audio/grade3/character.mp3'
    });

    // === 1. BEVEZETÉS (FIX 1-4) ===
    for (let i = 1; i <= 4; i++) {
        const slideNum = String(i).padStart(2, '0');
        const title = `Bevezetés ${i}. (Kontextus)`;

        let narrationText = `<b>${title}</b><br><br>Itt olvasható majd a kaland története.<br>Jelenleg ez egy helyőrző szöveg a ${i}. diánál.`;

        // Egyedi szövegek
        if (i === 1) {
            narrationText = `Valaha réges-régen, de mégis a jövőben, létezett egy varázslatos világ, amelyet <b>Kód Királyságnak</b> hívtak. Ebben a királyságban minden dolog - az épületek, a tájak, még az emberek is - digitális kódokból álltak össze. Minden lakó egyedi kódrendszerrel rendelkezett, amely tükrözte személyiségét, történetét és álmait.<br>A király, <b>Hexadecimus</b>, aki minden kódnál fényesebben szikrázott és a tanácsosai, a Kódbölcsek, a királyság leghíresebb programozói felügyelték, hogy minden zökkenőmentesen működjön.`;
        } else if (i === 2) {
            narrationText = `Az ősi legendák szerint a Kód Királyság ereje a <b>Varázskulcsokban</b> rejlett - öt különálló kulcsban, amelyek képesek voltak megőrizni a kódok harmóniáját és biztosítani az összetartozást. A kulcsokat a királyság öt különböző sarkában rejtették el. Úgy tartották, hogy amikor a királyság valódi veszélybe kerül, a kulcsok a <b>Kiválasztottak</b> előtt fognak feltárulni. A segítségükkel fogják helyreállítani a világot.`;
        } else if (i === 3) {
            narrationText = `Egy nap azonban sötét árnyék borult a királyságra: egy titokzatos vírustámadás, amelyet a gonosz <b>Árnyprogram</b> indított. Az Árnyprogram egykor maga is a Kódbölcsek tagja volt az ismert tehetsége és kimagasló képességei miatt, ám az ambíciója fokozatosan árnyékká változtatta. Irigysége a király és a többi tanácsos iránt, végül elszakította őt a királyság harmóniájától. Száműzetése során új, sötét kódokat hozott létre, amelyek célja nem a teremtés, hanem a pusztítás volt.`;
        } else if (i === 4) {
            narrationText = `Ahogy a káosz elhatalmasodott a királyságban, Hexadecimus királynak egyetlen lehetősége maradt, megbízta a fiatal  <b>Kiválasztottak</b>, hogy járják be az egyre pusztuló királyságot és gyűjtsék össze az öt <b>Varázskulcsot</b>. Ezek a kulcsok jelentik az egyetlen megoldást a vírus megfékezésére és a királyságban lévő rend helyreállítására. Hexadecimus egy mágikus kaput idézett meg előtted, amelyen keresztül elindulsz, hogy teljesítsd a megbízásodat.`;
        }

        addSlide(SLIDE_TYPES.STORY, title, 'Kövessétek az utasításokat...', {
            imageUrl: `assets/images/grade3/slides/slide_${slideNum}.jpg`,
            narration: narrationText,
            audioSrc: `assets/audio/grade3/slide_${slideNum}.mp3`
        });
    }

    // === 2. ÁLLOMÁSOK (KEVERT 5-24) ===
    const stationIndices = [0, 1, 2, 3, 4];
    shuffleArray(stationIndices);
    console.log("[DKV] Station Order:", stationIndices);

    for (let slot = 0; slot < 5; slot++) {
        const originalStationIdx = stationIndices[slot];
        const startSlideNum = 5 + (originalStationIdx * 4);

        for (let step = 0; step < 4; step++) {
            const originalNum = startSlideNum + step;
            const fileNumStr = String(originalNum).padStart(2, '0');

            const displayedStationNum = slot + 1;
            let title = `${displayedStationNum}. Állomás: `;
            if (step === 0 || step === 1) title += "Kontextus";
            else if (step === 2) title += "Feladat";
            else title += "Siker, Öröm";

            let storyContent = `<b>${title}</b><br><br>Helyőrző szöveg az eredeti ${originalNum}. diához.`;

            // === 1. ÁLLOMÁS: LABIRINTUSKERT (Eredeti: 5-8) ===
            if (originalNum === 5) {
                storyContent = `A Labirintuskert hatalmas dimenzióival uralja a Kód Királyság tájképét. Kódrétegek millióiból felépülve a kert annyira kiterjedt, hogy a látóhatárt is betölti, az ég és a föld között lebegő digitális ködbe burkolózva.<br>A legendák szerint a kert közepén található a Kód Királyság egyik kulcsa, amely évezredek óta őrzi titkait.`;
            } else if (originalNum === 6) {
                storyContent = `[Labirintuskert - Dia 2] Ide írd a folytatást...`;
            } else if (originalNum === 7) {
                storyContent = `[Labirintuskert - Dia 3] Ide írd a feladat leírását...`;
            } else if (originalNum === 8) {
                storyContent = `[Labirintuskert - Dia 4] Ide írd a sikeres megoldás szövegét...`;
            }

            // === 2. ÁLLOMÁS: ADAT-TENGER (Eredeti: 9-12) ===
            else if (originalNum === 9) {
                storyContent = `[Adat-tenger - Dia 1] Ide írd a bevezetőt...`;
            } else if (originalNum === 10) { storyContent = `[Adat-tenger - Dia 2] ...`; }
            else if (originalNum === 11) { storyContent = `[Adat-tenger - Dia 3] (Feladat)...`; }
            else if (originalNum === 12) { storyContent = `[Adat-tenger - Dia 4] (Siker)...`; }

            // === 3. ÁLLOMÁS: TUDÁS TORONY (Eredeti: 13-16) ===
            else if (originalNum === 13) {
                storyContent = `[Tudás torony - Dia 1] Ide írd a bevezetőt...`;
            } else if (originalNum === 14) { storyContent = `[Tudás torony - Dia 2] ...`; }
            else if (originalNum === 15) { storyContent = `[Tudás torony - Dia 3] (Feladat)...`; }
            else if (originalNum === 16) { storyContent = `[Tudás torony - Dia 4] (Siker)...`; }

            // === 4. ÁLLOMÁS: PIXEL PALOTA (Eredeti: 17-20) ===
            else if (originalNum === 17) {
                storyContent = `[Pixel Palota - Dia 1] Ide írd a bevezetőt...`;
            } else if (originalNum === 18) { storyContent = `[Pixel Palota - Dia 2] ...`; }
            else if (originalNum === 19) { storyContent = `[Pixel Palota - Dia 3] (Feladat)...`; }
            else if (originalNum === 20) { storyContent = `[Pixel Palota - Dia 4] (Siker)...`; }

            // === 5. ÁLLOMÁS: HANGERDŐ (Eredeti: 21-24) ===
            else if (originalNum === 21) {
                storyContent = `[Hangerdő - Dia 1] Ide írd a bevezetőt...`;
            } else if (originalNum === 22) { storyContent = `[Hangerdő - Dia 2] ...`; }
            else if (originalNum === 23) { storyContent = `[Hangerdő - Dia 3] (Feladat)...`; }
            else if (originalNum === 24) { storyContent = `[Hangerdő - Dia 4] (Siker)...`; }

            let narrationText = `${storyContent}<br><br><span style="font-size:0.8em; opacity:0.7;">(Debug: Eredeti Dia #${originalNum} | Hely #${slot + 1} | Order: ${stationIndices.map(n => n + 1).join('-')})</span>`;

            addSlide(SLIDE_TYPES.STORY, title, 'Teljesítsétek a kihívást...', {
                imageUrl: `assets/images/grade3/slides/slide_${fileNumStr}.jpg`,
                narration: narrationText,
                audioSrc: `assets/audio/grade3/slide_${fileNumStr}.mp3`
            });
        }
    }

    // === 3. FINÁLÉ (FIX 25-28) ===
    for (let i = 25; i <= 28; i++) {
        const slideNum = String(i).padStart(2, '0');
        let title = "Finálé: ";
        if (i === 25) title += "Kontextus";
        else if (i === 26) title += "Feladat";
        else if (i === 27) title += "Siker, Öröm";
        else title += "Összefoglaló";

        let narrationText = `<b>${title}</b><br><br>Itt olvasható majd a kaland története.<br>Jelenleg ez egy helyőrző szöveg a ${i}. diánál.`;

        addSlide(SLIDE_TYPES.STORY, title, 'A végső megmérettetés...', {
            imageUrl: `assets/images/grade3/slides/slide_${slideNum}.jpg`,
            narration: narrationText,
            audioSrc: `assets/audio/grade3/slide_${slideNum}.mp3`
        });
    }

    // === 2. FELADATOK (Később) ===

    return slides;
};
