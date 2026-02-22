import { SLIDE_TYPES } from '../../core/engine/slides-config.js';
import './styles/main.css'; // Központi stílusok (Gombok, Reset)
import './styles/Registration.css';
import './styles/Welcome.css';
import './styles/Character.css';
import videoConfig from './video-config.json';

// Logikai konstansok (Stílusok a CSS-ben vannak!)
const TYPING_SPEED = 2; // ms/karakter (User módosítása)

/**
 * Video config merge helper
 * @param {Object} slideConfig - Slide content object
 * @param {string} slideKey - Slide key (e.g., 'slide_01')
 */
const applyVideoConfig = (slideConfig, slideKey) => {
    const videoSettings = videoConfig.slides?.[slideKey];
    if (videoSettings) {
        if (videoSettings.videoDelay !== undefined) {
            slideConfig.videoDelay = videoSettings.videoDelay;
        }
        if (videoSettings.videoLoop !== undefined) {
            slideConfig.videoLoop = videoSettings.videoLoop;
        }
    }
};

export const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    // Helper függvény a typingSpeed és metadata átadására
    const addSlide = (type, title, description, content = {}, metadata = {}, id = null) => {
        // Alapértelmezett logikai beállítások (nem stílusok!)
        const enrichedContent = {
            ...content,
            typingSpeed: TYPING_SPEED // Mindenkinek átadjuk a sebességet
        };

        slides.push({
            id: id || idCounter++, // Használjuk a megadott ID-t vagy generálunk egyet
            type,
            title,
            description,
            content: enrichedContent,
            metadata, // Debug system számára (section, step)
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
    const bgImage = 'assets/images/grade3/onboarding_bg.jpg';

    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek, bátor Kódmester!', 'Te lettél az egyik <b>Kiválasztott</b>, aki egy izgalmas és kalandokkal teli utazáson vesz részt.\nAz lesz a feladatod, hogy felfedezd a varázslatos <b>Kód Királyságot</b> és megállíts egy veszélyes, romboló vírust, amelyet egy egykori <b>Kódbölcs</b> készített. A megállításhoz és a királyság rendjének visszaállításához különböző digitális <b>Varázskulcsokat</b> kell megszerezned.\nA többi kiválasztottal együtt indulsz útnak, de remélhetőleg <b>Te</b> leszel az, aki sikerrel fejezi be a küldetését.', {
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        audioSrc: 'assets/audio/grade3/welcome.mp3'
    }, { section: 'onboarding', step: 0 }, 'welcome');

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
    }, { section: 'onboarding', step: 1 }, 'registration');

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
    }, { section: 'onboarding', step: 2 }, 'character');

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

        const slideConfig = {
            imageUrl: `assets/images/grade3/slides/slide_${slideNum}.jpg`,
            narration: narrationText,
            audioSrc: `assets/audio/grade3/slide_${slideNum}.mp3`
        };

        // Videó háttér - mindig beállítva, ha nincs fájl, a StorySlide kezeli
        slideConfig.videoUrl = `assets/video/grade3/slide_${slideNum}.mp4`;

        // Apply video config from JSON (Debug Panel settings)
        applyVideoConfig(slideConfig, `slide_${slideNum}`);

        addSlide(SLIDE_TYPES.STORY, title, 'Kövessétek az utasításokat...', slideConfig, { section: 'intro', step: i - 1 }, `intro_${i}`);
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
                storyContent = `A Labirintuskert közelében furcsa érzés támad benned. A szemeid előtt jelenik meg a kert  hatalmassága. Egy varázslatos helyet látsz magad előtt, digitális szimbólumok rajzolják az eget, kódok sorozata látható a növények szárain, amelyek már-már oszlopként magasodnak.`;
            } else if (originalNum === 7) {
                storyContent = `A kert bejáratánál egy hatalmas kapu fogad, amely mintha maga is része lenne a labirintus élő, pulzáló rendszerének, folyamatosan változtatja alakját és színét. Ahogy áthaladsz a kert óriási kapuján, a labirintus kanyargós ösvényei életre kelnek körülötted. Út közben különböző kereszteződésekkel találkozol, ahol Neked kell eldönteni, hogy merre menj tovább. Minden döntésed és megfejtésed közelebb visz a kulcshoz, amely a kert közepén rejtőzik.`;
            } else if (originalNum === 8) {
                storyContent = `Sikeresen megfejtetted a Labirintuskert helyes útvonalát. A kert közepén találod magad, ahol a világ hirtelen megváltozik körülötted. A központi térben, egy lebegő, kristálytiszta platformon található a varázskulcs. Aranyló fénye betölti a teret, és halkan morajló dallammal jelzi, hogy készen áll arra, hogy kezedbe vedd. Ahogy megérinted, a csarnok ismét átalakul, és feltárul előtted  egy káprázatos mágikus kapu, amely a következő helyszínre teleportál.`;
            }

            // === 2. ÁLLOMÁS: ADAT-TENGER (Eredeti: 9-12) ===
            else if (originalNum === 9) {
                storyContent = `Miután átkeltél a mágikus kapun, elérkezel a félelmetes Adat-tengerhez. Ez a digitális világ végtelen óceánként terül el. Információkat hordozó gömbök emelkednek ki a vízből, majd lassan újra alámerülnek. A tenger közepén valami különleges vár Téged - egy sziget, a varázskulcs helyszíne.`;
            } else if (originalNum === 10) { storyContent = `Kiválasztottként az egyik gömböt magadhoz szólítod, majd belelépsz. A gömb óvatosan megmozdul és elemelkedik a felszín közeléből. A gömböt a felemelkedése közben egy másik távoli gömb felé irányítod, hogy átléphess abba és tovább folytathasd bennük az utad. Az átszállásokat addig folytatod, míg el nem éred a szigetet.`; }
            else if (originalNum === 11) { storyContent = `A lebegő gömbökkel eljutottál a sziget szívébe. Egy hatalmas, digitális fa emelkedik az ég felé, amely a sziget erejét képezi. A fa koronája olyan, mint egy színes kaleidoszkóp. A gyökerei között pedig a kulcs rejtőzik. Ehhez újabb feladatot kell megoldanod.`; }
            else if (originalNum === 12) { storyContent = `Sikeresen megfejtetted a szimbólumok feladatait! A földalatti terem közepén kristálygyökerek emelkednek ki a földből. A gyökerek tetejéből kékes színű ragyogás tör a felszín felé, közepében megjelenik a varázs kulcs. Alakjával felidézi a korábbi próbát, amellyel közelebb jutottál hozzá. Miután megszerezted a kulcsot, a földalatti terem átalakul. A fa tövéből egy varázskapu emelkedik lassan és arany ívvé formálódik. Digitális fényekből álló ívével a következő állomásra vezet át.`; }

            // === 3. ÁLLOMÁS: TUDÁS TORONY (Eredeti: 13-16) ===
            else if (originalNum === 13) {
                storyContent = `Ahogy átérsz a varázs kapun, előtted magasodik egy hatalmas, égig érő torony, amely olyan, mintha maga a digitális világ történetének őrzője lenne. Ez a Tudás Torony, a Kód Királyság legfontosabb építménye, ahol minden idők bölcsessége, titkai és történetei rejtőznek.`;
            } else if (originalNum === 14) { storyContent = `A torony kapujában Hexalogos vár Rád, a kódbölcsek legidősebbike és legbölcsebb tagja. Magas, tekintélyt parancsoló alakját egy holografikus köpeny öleli körül. A hangja mély és nyugodt: „Aki be akar lépni a torony szívébe, annak bizonyítania kell, hogy ismeri a királyság múltját, és érti a technológia nyelvét.” Egy finom kézmozdulatával a torony kapuja lassan megnyílik előtted, feltárva a belső tér lenyűgöző látványát.`; }
            else if (originalNum === 15) { storyContent = `FELADAT: Ahogy áthaladsz a kapun, színes holografikus könyvtár tárul eléd, amely a Kód Királyság történetének minden részletét megőrzi. A kulcs, amit keresel, azonban nem itt van: a torony legfelső szintjén található, ahová csak az juthat el, aki egy próbát kiáll. A próba során Hexalogos tíz kérdést tesz fel a technológia alapjaival kapcsolatban.`; }
            else if (originalNum === 16) { storyContent = `Miután sikeresen megoldottad a próbát, Hexalogos elégedetten bólint, és egy finom kézmozdulat kíséretében megidézi a torony legfelső szintjének ajtaját. A szint közepén egy ragyogó fénnyel övezett aranyláda emelkedik ki a padlóból. A láda fedele egy halk, zenei hang kíséretében lassan kinyílik, feltárva a várt kulcsot. Ahogy a kulcs a kezedbe kerül, a torony belsejében átalakulás történik. Egy fénylő kapu formálódik előtted azért, hogy átvezessen a következő helyre.`; }

            // === 4. ÁLLOMÁS: PIXEL PALOTA (Eredeti: 17-20) ===
            else if (originalNum === 17) {
                storyContent = `Megérkezel a Pixel palotához, amely lenyűgöző látványával szinte magába szippantja a tekinteted. A palota szinte lélegzik: a mozaikok folyamatosan átrendeződnek, mintha maguk is próbálnák helyreállítani a rendet, amit az Árnyprogram eltorzított. A digitális kódokból álló falakon a káosz jól észrevehető: sok kép elmosódott, és számos darab teljesen elmozdult a helyéről.`;
            } else if (originalNum === 18) { storyContent = `A palota közepén áll Pixela, a hely őrzője, aki a digitális világ kreativitásának esszenciáját képviseli. Elegáns alakja holografikus színekben ragyog, ruházata mozaikokból áll, mintha a palota élete is hozzá kötődne.`; }
            else if (originalNum === 19) { storyContent = `A Pixel Palota egyik legfontosabb térképe, amely a következő kulcs pontos helyét mutatta, teljesen megsemmisült. A térkép korábban a palota egyik legnagyobb büszkesége volt, de az Árnyprogram támadása során az összhangja megsemmisült, és csak töredékek maradtak hátra.`; }
            else if (originalNum === 20) { storyContent = `Ahogy elkészítetted az új térképet, a környezet ismét megváltozik. A padló lassan kristályos fénybe borul, a terem közepén megjelenik egy különleges fényörvény, amely mintha a mennyezet mozaikjából süllyedne alá. Az örvény közepén, finoman lebegve, kibontakozik a varázskulcs. Amint megérinted a kulcsot, a terem átalakuláson megy keresztül. Lágy, holografikus fények mutatják az utat a következő állomásra, ahol újabb próbatételek és titkok várnak rád.`; }

            // === 5. ÁLLOMÁS: HANGERDŐ (Eredeti: 21-24) ===
            else if (originalNum === 21) {
                storyContent = `Áthaladva a varázslatos kapun megérkezel a Hangerdőbe. Azonnal érzed, hogy különleges helyen folytatod az utadat. Az erdő közepén egy hatalmas Fa áll, magával ragadó látványával uralja a tájat. Az ágai minden irányba kinyúlnak, suttogó hangokat bocsátanak ki, amelyek mintha a fák közötti titkos beszélgetések lennének.`;
            } else if (originalNum === 22) { storyContent = `A Hangerdő őrzője, Sonora, egy különleges lény, aki teljes egészében hangokból áll - alakja hol körvonalazódik, hol feloldódik a dallamokban, mintha maga is a Hangerdő része lenne. Sonora a hangok különleges nyelvén szól hozzád, amely egyszerre érthető és varázslatos: „A hangok a kulcsok, hallgasd meg őket, és fejtsd meg a titkaikat, hogy hozzáférj a varázskulcshoz.`; }
            else if (originalNum === 23) { storyContent = `Amint belépsz a Hangerdő mélyére, finom zümmögés tölti be a levegőt, mintha az egész erdő ébredezne a jelenlétedre. A fák finom rezgésekkel adják tudtodra, hogy készen állnak egy különleges üzenetet átadni. Ez az üzenet több szinten rejt információkat: ritmusa, tónusa és a háttérben húzódó finom szimbólumok mind elengedhetetlenek a teljes dekódoláshoz.`; }
            else if (originalNum === 24) { storyContent = `Miután megfejtetted a hangüzenetet, az erdő megváltozik. Ahogy közelebb lépsz a hatalmas fa gyökereihez, érzed, hogy a levegő megtelik különös energiával. A fa törzsén szövevényes mintázatot alkotó, ragyogó fénycsíkok jelennek meg. A mintázat közepén lassan kibontakozik az újabb varázskulcs. Amint a kulcs a kezedbe kerül, az erdő környezete ismét megváltozik. A hatalmas fa gyökerei lassan visszahúzódnak, utat engedve a törzsében kialakuló ragyogó kapunak, amely a Hangerdőből való kijárathoz és egyben a következő helyszínre való érkezéshez vezet.`; }

            let narrationText = `${storyContent}<br><br><span style="font-size:0.8em; opacity:0.7;">(Debug: Eredeti Dia #${originalNum} | Hely #${slot + 1} | Order: ${stationIndices.map(n => n + 1).join('-')})</span>`;

            const slideId = `st${originalStationIdx + 1}_s${step + 1}`;
            addSlide(SLIDE_TYPES.STORY, title, 'Teljesítsétek a kihívást...', {
                imageUrl: `assets/images/grade3/slides/slide_${fileNumStr}.jpg`,
                narration: narrationText,
                audioSrc: `assets/audio/grade3/slide_${fileNumStr}.mp3`
            }, { section: `station_${originalStationIdx + 1}`, step }, slideId);
        }
    }

    // === 3. FINÁLÉ (FIX 25-28) ===
    for (let i = 25; i <= 28; i++) {
        const slideNum = String(i).padStart(2, '0');
        let title = "Finálé: ";
        if (i === 25) title += "Miután megszerezted az öt kulcsot a Kód Királyság különböző állomásain, elérkezel a végső helyszínre, egy ősi, misztikus kapuhoz. Az őrző, Chronosz, az idő és tudás megtestesítője, méltóságteljesen áll a kapu előtt. Alakja lenyűgöző: holografikus kódszálak alkotják, mintha az idő, maga szőné őt. Ahogy közelebb lépsz, Chronos holografikus kivetülése élő testbe költözik. Hangja mély és együtthangzó, minden szava mintha egy ősi zenei akkord lenne: „A kulcsok önmagukban nem elegendők. Csak azok nyithatják meg a Nagy Zárat, akik képesek egyesíteni a tudásukat és használni az összes megszerzett információt.";
        else if (i === 26) title += "Ahhoz, hogy kinyisd a Nagy Zárat, nem csupán fizikailag kell összeillesztened a kulcsokat, hanem meg kell értened, hogy minden állomásról szerzett információ hogyan kapcsolódik össze. A kulcsok pulzáló fényében felismered a Kód Királyság történetét, minden egyes állomás tanulságait és a megszerzett tudás szimbólumait.";
        else if (i === 27) title += "Amint helyesen megoldottad a rejtvényt, az öt varázskulcs, amelyeket annyi kihívás során gyűjtöttél össze, a zár belsejébe hatolnak. A Zár életre kel, és nagy méltósággal kinyílik. Mögötte feltárul a Kód Királyság szíve: egy hatalmas, kristályból álló tér. A kristály mérete lenyűgöző, szinte az egész teret betölti, belsejéből tiszta, erőteljes fény árad. Amint a kristály fénye az Árnyprogramot megérinti, az elkezd széthullani. A sötét kódszálak, amelyek egykor fenyegették a Királyságot, most lassan feloldódnak a kristály által kibocsátott ragyogásban. Az Árnyprogram hatalmas ereje végleg eltűnik, és a kristály tiszta fénye helyreállítja a Királyság minden sérült részét. Érzed, hogy a Királyság mostantól biztonságban van, készen arra, hogy újra virágozzon.";
        else title += "Gratulálunk!";

        let narrationText = `<b>${title}</b><br><br>Itt olvasható majd a kaland története.<br>Jelenleg ez egy helyőrző szöveg a ${i}. diánál.`;

        addSlide(SLIDE_TYPES.STORY, title, 'A végső megmérettetés...', {
            imageUrl: `assets/images/grade3/slides/slide_${slideNum}.jpg`,
            narration: narrationText,
            audioSrc: `assets/audio/grade3/slide_${slideNum}.mp3`
        }, { section: 'final', step: i - 25 }, `final_${i - 24}`);
    }

    // === 2. FELADATOK (Később) ===

    return slides;
};
