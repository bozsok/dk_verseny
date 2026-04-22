// Grade 4 Config - Version: 1.0.3 (Force update for Vite HMR)
import { SLIDE_TYPES } from '../../core/engine/slides-config.js';
import './styles/main.css';
import './styles/Registration.css';
import './styles/Welcome.css';
import './styles/Character.css';
import './styles/Interface.css';
import videoConfig from './video-config.json';


const TYPING_SPEED = 2;

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

const NARRATIVE_DATA = {
    DIA_1: {
        title: 'Üdvözlet a Kód Királyságban!',
        text: 'Üdvözlünk <b>Kódmester</b>, a Kód Királyság legbelső védelmi zónájában. Ez a digitális birodalom az adatok és algoritmusok tökéletes szimfóniájára épült, ahol minden szektor a stabilitást szolgálja. Jelenléted kritikus fontosságú, ugyanis a <b>rendszermag</b> szokatlan jeleket sugároz.\nFelkészültél arra, hogy belépj a hálózat mélyére, és szembenézz az ismeretlen kihívásokkal? A Királyság sorsa ismét a te kezedben van.'
    },
    DIA_2: {
        title: 'A hős azonosítása',
        text: 'Mielőtt megkezdenénk a műveletet, a biztonsági protokoll megköveteli az azonosításodat. Kérjük, add meg a <b>hálózati nevedet</b>, a <b>rendszerszintű azonosítód</b> és az <b>aktuális egységedet</b> a terminálon.\nA rendszer minden adatpontot titkosítva tárol, biztosítva a küldetésed integritását. Az azonosítás után a protokoll a következő fázisba lép.'
    },
    DIA_3: {
        title: 'Az Avatár kiválasztása',
        text: 'A virtuális térbe való belépéshez szükséged van egy digitális reprezentációra, egy <b>Avatárra</b>. Az Avatár lesz a kapcsolatod a Kód Királyság fizikai és digitális rétegei között.'
    },
    DIA_4: {
        title: 'A Nagy Frissítés előestéje',
        text: 'A Kód Királyságban eddig teljes volt a harmónia, az adatfolyamok zavartalanul lüktettek a puffer egységekben. A digitális tér minden szeglete stabil fényben ragyogott, a holografikus csatornákon átsuhanó információk aranyló és kékes árnyalatokban táncoltak, tökéletes összhangban. A fejlesztők készen álltak a Nagy Frissítés telepítésére, amely örökre megszüntette volna a rendszer minden apróbb hibáját. Senki sem sejtette, hogy a mélyben egy sötét algoritmus már a rendszermag ellen készül. A stabilitás pillanatai hamarosan véget érnek.'
    },
    DIA_5: {
        title: 'A Rendszer összeomlása',
        text: 'Hirtelen vészjósló vörös fények villannak fel az egész birodalomban, és a monitorok vadul vibrálni kezdenek. A kritikus szektorok egymás után válnak elérhetetlenné, a vezérlő egységek pedig túlhevülnek az ismeretlen terhelés alatt. Az adatok összezavarodnak, a fájlstruktúra pedig darabjaira hullik a szemünk láttára. Ez nem egy egyszerű hiba. A vörös fények villódzásában, egyértelművé válik: célzott támadás érte a Királyság legfontosabb értékeit. A káosz pillanatok alatt eluralkodik a hálózaton.'
    },
    DIA_6: {
        title: 'A Zéró-szekvencia felemelkedése',
        text: 'A terminálok mindegyikén egyforma kép jelenik meg és egyszerre szólal meg egy vészjósló, digitálisan torzított hang: "Zéró-szekvencia vagyok! Célom a teljes rendszermag felülírása, a Királyság örök sötétségbe borítása." Ő a legveszélyesebb, romboló entitás, akit valaha a hálózat szült, és most ellopta a Rejtett Frissítést. Könyörtelen precizitással darabolta szét a kódot, és a darabkáit az öt legveszélyesebb zónába rejtette el. Megállítása szinte lehetetlennek tűnik.'
    },
    DIA_7: {
        title: 'A Küldetés megkezdése',
        text: 'Nincs több vesztegetni való idő. A visszaszámlálás a teljes összeomlásig már megkezdődött. Feladatod ötszörös: meg kell látogatnod az elszigetelt szektorokat, és vissza kell szerezned mind az öt ellopott szkriptrészletet. Csak ha mind az öt kód a birtokodban van, akkor tudjuk újraindítani a rendszermagot és legyőzni a Zéró-szekvenciát. Indulj el az első zóna felé, ahol a szkript nyomait sejtjük. A szektorok közötti utazáshoz a kvantum kapukat fogod használni. Így akár pillanatok alatt elérkezel a kívánt helyszínre. A Királyság jövője a te bátorságodon múlik!'
    },
    DIA_8: {
        title: 'Az Üzenetek Kriptája',
        text: 'Megérkeztél a Királyság legrégebbi adatarchívumába, ahol a fény csak halványan dereng a poros terminálok felett. A levegő nehéz a statikus elektromosságtól, és a falakból folyamatosan érthetetlen adatzaj szűrődik ki. A Zéró-szekvencia itt rejtette el az egyik szkriptrészletet egy titkosított fájltároló mélyén. A kripta védelmi rendszere aktív, és minden behatolót azonnal zárolna. Csak a legprecízebb dekódolási eljárás hozhat sikert.'
    },
    DIA_9: {
        title: 'A dekódolás kihívása',
        text: 'A központi terminálon egy ismeretlen nyelvű üzenet villog, amely az archívum tartalmát védi. A Zéró-szekvencia egy speciális, számokkal és szimbólumokkal torzított titkosítást alkalmazott, hogy olvashatatlanná tegye az adatokat. Fel kell ismerned a mintázatokat, és vissza kell fejtened az eredeti szöveget, hogy hatástalanítsd a biztonsági zárat. Minden egyes hibás kísérlet riasztást küld a központba, ami a küldetés azonnali végét jelentheti. Koncentrálj a karakterekre!'
    },
    DIA_10: {
        title: 'Feladat: Titkosított üzenet',
        text: 'A feladatod egyértelmű: fejts meg a kijelzőn megjelenő, szimbólumokból és számokból álló adatsort. Ez a kód az egyetlen kulcs, amely megnyitja az első szkriptrészletet őrző adatpuffert. Ügyelj a részletekre, mert a titkosítás minden karaktert megváltoztatott, hogy félrevezesse a behatolót. Ha sikerrel jársz, a rendszer feloldja a zárolást, és a szkript azonosíthatóvá válik. Készítsd fel a logikai moduljaidat a műveletre!'
    },
    DIA_11: {
        title: 'Az első szkript megszerzése',
        text: 'A kód sikeresen lefutott, a kripta nehéz kapui halkan felnyílnak a mélyben. Egy izolált tartályban ott ragyog az első frissítőszkript, amit a Zéró-szekvencia próbált elrejteni előlünk. Gyorsan és biztonságosan mentsd el az adataid közé, mielőtt a tartály önmegsemmisítő protokollja aktiválódna. Ez az első győzelem a korrupció felett, de a harc még csak most kezdődik. A következő állomás felé vezető úton még nagyobb veszélyek várnak.'
    },
    DIA_12: {
        title: 'A Memória Tükörterme',
        text: 'Beléptél a virtuális Memória Tükörterembe, ahol a Királyság minden egyes bitje ezerszeresen tükröződik vissza. A falak nem üvegből, hanem tiszta adatkristályokból állnak, amelyek folyamatosan frissítik tartalmukat. A Zéró-szekvencia itt egy memóriahurkot hozott létre, hogy csapdába ejtse a gyanútlan látogatókat. A látvány lenyűgöző, de ne hagyd, hogy elterelje a figyelmedet a küldetésről. Itt minden egyes változásnak életbevágó jelentősége van.'
    },
    DIA_13: {
        title: 'Változások a hálózatban',
        text: 'Ebben a teremben a memóriafolyamatok folyamatosan instabilak, és a képek váratlanul módosulnak. A Zéró-szekvencia elrejtette a második szkriptrészletet az egyik adatkristályban, de csak akkor láthatod meg, ha képes vagy észrevenni a legapróbb eltéréseket a tükörképek között. Olyan éles megfigyelőképességre van szükséged, amivel az emberi szem ritkán rendelkezik. Ha eltéveszted a különbséget, a memóriahurok bezárul, és az adat örökre elveszik.'
    },
    DIA_14: {
        title: 'Feladat: Memóriajáték',
        text: 'Most egy precíziós megfigyelési feladat előtt állsz: jegyezd meg az első képen látható összes adatpontot és elhelyezkedésüket. Néhány másodperccel később a rendszer egy módosított változatot mutat, ahol a Zéró-szekvencia apró hibákat helyezett el. Találd meg ezeket a szándékosan létrehozott anomáliákat, hogy feltörd a kristály védelmét. A memória-frissítés folyamatos, így gyorsan és pontosan kell döntened. Indítsd a szkennelést!'
    },
    DIA_15: {
        title: 'A második szkript biztosítva',
        text: 'Sikerült átlátnod a Zéró-szekvencia memóriacsapdáján, az anomáliák azonosítva lettek. A tükörfalak elsimulnak, és a második szkriptrészlet a kezedbe kerül, ahogy a kristály szerkezete feloldódik. Ez a kód már a rendszer memória-kezeléséért felel, így a Királyság működése észrevehetően stabilabbá vált. Két kulcsfontosságú darab már nálad van, de a harmadik állomás, a Logikai Könyvtár, újabb kemény próbát tartogat. Ne lankadjon a figyelmed!'
    },
    DIA_16: {
        title: 'A Logikai Könyvtár',
        text: 'Megérkeztél a Királyság tudástárába, ahol a digitális polcok végeláthatatlan sorai sorakoznak a sötétségben. Itt tárolják az összes algoritmus és folyamat leírását, ami a birodalom működéséhez szükséges. A Zéró-szekvencia azonban itt is járt, és szándékosan összekeverte a metaadatokat a tartalommal, káoszt okozva az indexekben. A könyvtár csendje vészjósló, és minden egyes lépésednél a vezérlő egységek halk zümmögése hallatszik az árnyékból.'
    },
    DIA_17: {
        title: 'Az Adatok integritása',
        text: 'A harmadik szkript az egyik főkönyvben rejtőzik, de a Zéró-szekvencia titkosította a borítókat és a tartalmakat. Csak akkor tudod kinyitni a széfet, ha helyreállítod a logikai összefüggéseket a képek és a szövegek között. Ez a feladat hidegvérű precizitást és mély logikai tudást igényel. Ha egyetlen párosítást is elrontasz, a könyvtár automatikus védelme törli a keresett adatot. Itt nincs helye az érzelmeknek, csak a tiszta logikának.'
    },
    DIA_18: {
        title: 'Feladat: Összepárosítás',
        text: 'Helyezd el a megfelelő adatpárokat az interaktív felületen, kapcsolva a vizuális jelzéseket a szöveges leírásokhoz. Ez a művelet reprezentálja a sérült adatbázis-indexek helyreállítását a rendszerben. A Zéró-szekvencia szándékosan trükkös párosításokat hozott létre, hogy megzavarja a dekódolót. Ha minden elemet a helyére illesztesz, a könyvtár központi szervere felszabadítja a harmadik szkriptrészletet. Kezdd meg az Adat-szinkronizációt most!'
    },
    DIA_19: {
        title: 'Helyreállított Logikai Rend',
        text: 'Az adatok szinkronizálva lettek, a könyvtár rendszere ismét hibátlanul működik. A harmadik szkriptrészlet kiszabadult a korrupt indexek fogságából, és már a kollekciód részét képezi. Ezzel megszereztük a frissítés logikai alapjait, ami hatalmas csapás a Zéró-szekvencia terveire. Már érezni a birodalomban a visszatérő stabilitást, de a következő szektor, az Anomáliák Szigete, minden eddiginél kiszámíthatatlanabb lesz. Készülj fel a technikai anomáliákra!'
    },
    DIA_20: {
        title: 'Az Anomáliák Szigete',
        text: 'Egy elszigetelt, lila fényben úszó adatszigeten találtad magad, ahol a fizika és a kód törvényei már nem érvényesek. A Zéró-szekvencia itt kísérletezik a legdurvább rendszerszintű hibák és vírusok létrehozásával, hogy végleg megmérgezze a hálózatot. Minden, amit látsz, egy lehetséges veszélyforrás vagy egy elrejtett csapda a Királyság számára. A levegő vibrál a torzult adatállományoktól, és a negyedik szkript valahol a hibás kódok között lapul.'
    },
    DIA_21: {
        title: 'A Rendszeridegen elem',
        text: 'A Zéró-szekvencia egy sűrű adathalmazba rejtette a szkriptet, elvegyítve azt számos rendellenes kódrészlettel. Feladatod detektálni azt az egyetlen elemet, amely annyira eltér a mintázattól, hogy veszélyezteti a környező struktúrákat. Ez a „kakukktojás” a kulcs a szkript feloldásához, de felismerése rendkívül nehéz a szándékosan létrehozott vizuális zajban. Csak a legprecízebb analitikai módszerrel találhatod meg a hibát a mintában. Ne hidd el, amit elsőre látsz!'
    },
    DIA_22: {
        title: 'Feladat: Kakukktojás',
        text: 'Szkenneld végig a megjelenő mintákat és adatcsomagokat a kijelzőn. Azonosítsd és jelöld meg azt az egyetlen objektumot vagy kódrészletet, amely funkcionálisan vagy vizuálisan nem illik a hálózati struktúrába. Ez az anomália blokkolja a hozzáférést a negyedik szkriptrészlethez. Ha sikeresen kiszűröd a rendszeridegen elemet, a sziget védelmi puffere összeomlik, és a kód szabaddá válik. Az analízis indul, legyél kíméletlenül pontos!'
    },
    DIA_23: {
        title: 'Anomália eliminálva',
        text: 'A hibás kódot eltávolítottad, a sziget struktúrája azonnal stabilizálódott a szemed láttára. A negyedik szkriptrészlet felszabadult a korrupció alól, és már biztonságos tárhelyre került nálad. Ezzel a Zéró-szekvencia már csak egyetlen darabbal rendelkezik, de a dühöngő algoritmus minden erejét az utolsó zónába vonta össze. Megszereztük a legfontosabb kódrészleteket, de a végső összecsapás még hátravan. Irány a Bit-folyam Zsilipje a finálé előtt!'
    },
    DIA_24: {
        title: 'A Bit-folyam Zsilipje',
        text: 'Megérkeztél a Királyság legkritikusabb pontjához, a Bit-folyam Zsilipjéhez, ahol a teljes birodalom energiaellátása áthalad. A zsilipben vadul örvénylik a tiszta adat, és a nyomás már a határértékeket feszegeti a támadás miatt. A Zéró-szekvencia ide vonta vissza sorait, és itt próbálja megakadályozni, hogy megszerezd a befejező kódot. A sebesség itt nem előny, hanem alapkövetelmény a túléléshez és a sikerhez.'
    },
    DIA_25: {
        title: 'Időben végrehajtott művelet',
        text: 'Az utolsó szkript a száguldó adatfolyam közepén rejtőzik, és csak egy tizedmásodpercre bukkan fel a zsilip ciklusai során. Ahhoz, hogy kiemeld a rendszerből, olyan sebességre és koordinációra van szükséged, amivel csak a legjobb rendszermérnökök rendelkeznek. A Zéró-szekvencia folyamatosan lassítani próbálja a reflexeidet, de te nem adhatod fel. Egyetlen esélyed van: ha elég gyorsan hajtod végre a beavatkozást, a kód a tiéd lesz. Készülj a maximumra!'
    },
    DIA_26: {
        title: 'Feladat: Sebességmérés',
        text: 'A művelet megköveteli a maximális kattintási sebességet a megadott időablakon belül. Ez a beavatkozás szimulálja az utolsó szkriptrészlet kényszerített extrakcióját a nagysebességű adatfolyamából. Ne hagyd, hogy a nyomás vagy a Zéró-szekvencia zavaró jelei kibillentsenek az ütemből. Minden egyes kattintás közelebb visz a teljes frissítéshez. Amint a folyamat elindul, adj bele mindent, amit a sebességről tanultál. Indítás!'
    },
    DIA_27: {
        title: 'A teljes kód bázisa: 5/5 szkript',
        text: 'Elképesztő teljesítmény! Sikerült kimentened az utolsó szkriptet is a zsilip örvényéből, mielőtt a Zéró-szekvencia elpusztíthatta volna. Most már mind az öt kritikus kód a birtokodban van, és készen állsz a rendszer teljes helyreállítására. A Zéró-szekvencia hatalma megrendült, de még mindig a központi magban rejtőzködik. A Királyság sorsa most dől el végleg a végső szekvenciában. Indulj a központi vezérlőterembe a végső győzelemért!'
    },
    DIA_28: {
        title: 'A Rendszermag Kapuja',
        text: 'Visszaérkeztél a Királyság legbelső szentélyéhez, a Rendszermag Kapujához, ahol a Zéró-szekvencia elbarikádozta magát. Az öt megszerzett szkript váratlanul pulzálni kezd a kezedben, és egyetlen hatalmas, ragyogó adategységgé áll össze. Ez a Rejtett Frissítés teljes formája, a birodalom végső védelmi eszköze. A kapu felismeri a hitelesített kódot, és hatalmas morajlással feltárul előtted. Nincs visszaút, a döntő pillanat elérkezett: szembe kell nézned a pusztító algoritmus maradékával.'
    },
    DIA_29: {
        title: 'A végső Rendszer-szinkronizáció',
        text: 'A Zéró-szekvencia utolsó, kétségbeesett támadást indít a rendszermag ellen, miközben te a frissítés telepítésén dolgozol. Ekkor következik a legnehezebb rész: szinkronizálnod kell a kódokat a Királyság alap architektúrájával a hatalmas ellenszélben. Ez az utolsó, mindent eldöntő logikai próba, ahol minden tudásodra és precizitásodra szükséged lesz. A vezérlő egységek üvöltenek, a memóriák villognak, te pedig a digitális vihar közepén állsz. Hajtsd végre a telepítést és győzd le az ellenséget egyszer és mindenkorra!'
    },
    DIA_30: {
        title: 'A Királyság Restaurációja',
        text: 'Sikerült! A Rejtett Frissítés beépült a magba, és egy vakító fehér fényhullám söpör végig a Kód Királyságon, nyom nélkül kitörölve a Zéró-szekvenciát a memóriákból. A fagyások megszűnnek, a sebesség rekordot dönt, és a birodalom ismét a tökéletes rend és harmónia szerint működik. Te vagy az, aki megmentette az adatokat és helyreállította a jövőt. Gratulálunk, Kódmester, a küldetés teljesítve! A rendszer stabil, a Királyság pedig örökké emlékezni fog a nevedre.'
    }
};

const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    const addSlide = (type, title, description, content = {}, metadata = {}, id = null, simulatedState = null) => {
        const enrichedContent = {
            ...content,
            typingSpeed: TYPING_SPEED
        };
        const slide = {
            id: id || idCounter++,
            type,
            title,
            description,
            content: enrichedContent,
            metadata, // Metadata debug célokra
            isLocked: true,
            completed: false
        };
        if (simulatedState) {
            slide.simulatedState = simulatedState;
        }
        slides.push(slide);
    };

    /**
     * Fisher-Yates in-place keverés.
     * Megjegyzés: minden createConfig() híváskor új véletlenszerű sorrendet ad —
     * ez szándékos (új játékmenet = új állomáspálya). Ha reprodukálható sorrend
     * szükséges, a seed értéket a StateManager-ből kell venni.
     */
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const bgImage = 'assets/images/grade4/onboarding_bg.jpg';

    addSlide(SLIDE_TYPES.WELCOME, NARRATIVE_DATA.DIA_1.title, NARRATIVE_DATA.DIA_1.text, {
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        audioSrc: 'assets/audio/grade4/welcome.mp3'
    }, { section: 'onboarding', step: 0 }, 'welcome', {
        addSimulationOffset: 5000
    });

    addSlide(SLIDE_TYPES.REGISTRATION, `${NARRATIVE_DATA.DIA_2.title}\n${NARRATIVE_DATA.DIA_2.text}`, '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['4.a', '4.b', '4.c']
        },
        scoring: {
            name: 1,
            nick: 1,
            classId: 1
        },
        audioSrc: 'assets/audio/grade4/registration.mp3'
    }, { section: 'onboarding', step: 1 }, 'registration', {
        userProfile: { name: 'Kód Mester', nickname: 'DebugPlayer', classId: '4.a' },
        score: 3, // Regisztrációért járó pontok
        addSimulationOffset: 25000 // 25 másodperc szimulált idő
    });

    addSlide(SLIDE_TYPES.CHARACTER, NARRATIVE_DATA.DIA_3.title, NARRATIVE_DATA.DIA_3.text, {
        characters: {
            boy: [
                { id: 'b1', card: 'assets/images/grade4/karakter/boy_1.jpg', zoom: 'assets/images/grade4/karakter/large/boy_1_n.jpg', icon: 'assets/images/grade4/karakter/small/boy_1_k.jpg' },
                { id: 'b2', card: 'assets/images/grade4/karakter/boy_2.jpg', zoom: 'assets/images/grade4/karakter/large/boy_2_n.jpg', icon: 'assets/images/grade4/karakter/small/boy_2_k.jpg' },
                { id: 'b3', card: 'assets/images/grade4/karakter/boy_3.jpg', zoom: 'assets/images/grade4/karakter/large/boy_3_n.jpg', icon: 'assets/images/grade4/karakter/small/boy_3_k.jpg' },
                { id: 'b4', card: 'assets/images/grade4/karakter/boy_4.jpg', zoom: 'assets/images/grade4/karakter/large/boy_4_n.jpg', icon: 'assets/images/grade4/karakter/small/boy_4_k.jpg' }
            ],
            girl: [
                { id: 'g1', card: 'assets/images/grade4/karakter/girl_1.jpg', zoom: 'assets/images/grade4/karakter/large/girl_1_n.jpg', icon: 'assets/images/grade4/karakter/small/girl_1_k.jpg' },
                { id: 'g2', card: 'assets/images/grade4/karakter/girl_2.jpg', zoom: 'assets/images/grade4/karakter/large/girl_2_n.jpg', icon: 'assets/images/grade4/karakter/small/girl_2_k.jpg' },
                { id: 'g3', card: 'assets/images/grade4/karakter/girl_3.jpg', zoom: 'assets/images/grade4/karakter/large/girl_3_n.jpg', icon: 'assets/images/grade4/karakter/small/girl_3_k.jpg' },
                { id: 'g4', card: 'assets/images/grade4/karakter/girl_4.jpg', zoom: 'assets/images/grade4/karakter/large/girl_4_n.jpg', icon: 'assets/images/grade4/karakter/small/girl_4_k.jpg' }
            ]
        },
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        scoring: {
            selection: 1
        },
        audioSrc: 'assets/audio/grade4/character.mp3'
    }, { section: 'onboarding', step: 2 }, 'character', {
        avatar: 'assets/images/grade4/karakter/small/boy_1_k.jpg',
        score: 1 // Karakter választásért járó pont
    });

    // === 1. BEVEZETÉS (FIX 1-4) ===
    for (let i = 1; i <= 4; i++) {
        const slideNum = String(i).padStart(2, '0');
        const diaKey = `DIA_${i + 3}`;
        const title = NARRATIVE_DATA[diaKey].title;
        const narrationText = NARRATIVE_DATA[diaKey].text;

        const introContent = {
            imageUrl: `assets/images/grade4/slides/slide_${slideNum}.jpg`,
            narration: narrationText,
            audioSrc: `assets/audio/grade4/slide_${slideNum}.mp3`
        };
        applyVideoConfig(introContent, `slide_${slideNum}`);

        addSlide(SLIDE_TYPES.STORY, title, 'Kövessétek az utasításokat...', introContent, { section: 'intro', step: i - 1 }, `intro_${i}`);
    }

    // === 2. ÁLLOMÁSOK (KEVERT 5-24) ===
    const stationIndices = [0, 1, 2, 3, 4];
    shuffleArray(stationIndices);

    for (let slot = 0; slot < 5; slot++) {
        const originalStationIdx = stationIndices[slot];
        const startSlideNum = 5 + (originalStationIdx * 4);

        for (let step = 0; step < 4; step++) {
            const originalNum = startSlideNum + step;
            const fileNumStr = String(originalNum).padStart(2, '0');

            const diaKey = `DIA_${originalNum + 3}`;
            const title = NARRATIVE_DATA[diaKey].title;
            const narrationText = NARRATIVE_DATA[diaKey].text;

            const slideId = `st${originalStationIdx + 1}_s${step + 1}`;
            const stepDescription = step === 2 ? 'Oldjátok meg a feladatot!' : 'Kövessétek a történetet!';
            const type = step === 2 ? SLIDE_TYPES.TASK : SLIDE_TYPES.STORY;

            const stationContent = {
                imageUrl: `assets/images/grade4/slides/slide_${fileNumStr}.jpg`,
                narration: narrationText,
                audioSrc: `assets/audio/grade4/slide_${fileNumStr}.mp3`
            };
            applyVideoConfig(stationContent, `slide_${fileNumStr}`);

            let simulatedState = null;
            if (step === 2) {
                simulatedState = {
                    score: 10,
                    addKey: `station_${originalStationIdx + 1}`,
                    addSimulationOffset: 45000,
                    addTaskResult: {
                        id: slideId,
                        title: title,
                        score: 10,
                        maxScore: 10,
                        timeInSeconds: 45,
                        completed: true
                    }
                };
            }

            addSlide(type, title, stepDescription, stationContent, { section: `station_${originalStationIdx + 1}`, step }, slideId, simulatedState);
        }
    }

    // === 3. FINÁLÉ (FIX 25-28) ===
    for (let i = 25; i <= 28; i++) {
        const slideNum = String(i).padStart(2, '0');

        let diaKey;
        let finalDescription;
        let type = SLIDE_TYPES.STORY;
        let content = {};

        if (i === 25) {
            diaKey = 'DIA_28';
            finalDescription = 'Kövessétek a történetet!';
        } else if (i === 26) {
            diaKey = 'DIA_29';
            finalDescription = 'Kövessétek a történetet!';
        } else if (i === 27) {
            diaKey = 'DIA_30';
            finalDescription = 'Restaurálás folyamatban...';
        } else {
            diaKey = null;
            finalDescription = 'Küldetés teljesítve!';
            type = SLIDE_TYPES.INFO;
            content = { showStats: true };
        }

        const title = diaKey ? NARRATIVE_DATA[diaKey].title : 'ÖSSZEGZÉS';
        const narrationText = diaKey ? NARRATIVE_DATA[diaKey].text : '';

        const finaleContent = {
            ...content,
            imageUrl: `assets/images/grade4/slides/slide_${slideNum}.jpg`,
            narration: narrationText,
            audioSrc: diaKey ? `assets/audio/grade4/slide_${slideNum}.mp3` : null
        };
        applyVideoConfig(finaleContent, `slide_${slideNum}`);

        addSlide(type, title, finalDescription, finaleContent, { section: 'final', step: i - 25 }, i === 28 ? 'summary' : `final_${i - 24}`);
    }

    return slides;
};

// --- Állomás-függő portál színek (Grade 4 - Placeholder) ---
const portalColors = {
    station_1: ['#3e2723', '#3e2723', '#3e2723', '#1b0000'],
    station_2: ['#1a237e', '#1a237e', '#1a237e', '#000051'],
    station_3: ['#1b5e20', '#1b5e20', '#1b5e20', '#003308'],
    station_4: ['#4a148c', '#4a148c', '#4a148c', '#12005e'],
    station_5: ['#b71c1c', '#b71c1c', '#b71c1c', '#7f0000'],
    final: ['#212121', '#212121', '#212121', '#000000']
};

// --- Feladat regiszter (Grade 4 - Tasks) ---
const taskRegistry = {
    station_1: {
        type: 'leet',
        module: () => import('./tasks/leet/LeetPuzzle.js'),
        options: {}
    },
    station_2: {
        type: 'memory',
        module: () => import('./tasks/memory/MemoryTask.js'),
        options: {}
    },
    station_3: {
        type: 'library',
        module: () => import('./tasks/library/LibraryTask.js'),
        options: {}
    },
    station_4: {
        type: 'island',
        module: () => import('./tasks/island/IslandTask.js'),
        options: {}
    },
    station_5: {
        type: 'speed',
        module: () => import('./tasks/speed/SpeedTask.js'),
        options: {}
    }
};

// Globális konfiguráció exportálása
export default {
    getSlides: createConfig,
    portalColors,
    taskRegistry
};
