/**
 * LibraryData.js - Logikai Könyvtár feladat (Station 3) adatai
 * A metaadatok.txt alapján generálva.
 */

export const METADATA_CATEGORIES = {
    TECHNICAL: 'Technikai',
    FUNCTIONAL: 'Funkcionális',
    LOGICAL: 'Logikai'
};

export const LIBRARY_DATA = [
    {
        id: 'server',
        name: 'Központi Szerver',
        image: 'assets/images/grade4/library/server.jpg',
        metadata: {
            technical: 'A birodalom szívét jelentő Z8000 modellszámú egység, amely a legmagasabb szintű számítási kapacitással rendelkezik a szektorban.',
            functional: 'Ez az egység felel az összes beérkező adatfolyam feldolgozásáért, biztosítva a Királyság algoritmusainak folyamatos lüktetését.',
            logical: 'A rendszermag diagnosztikája szerint az egység állapota jelenleg túlterhelt, a Zéró-szekvencia támadása miatt a vezérlő egységek izzanak a vörös fényben.'
        }
    },
    {
        id: 'firewall',
        name: 'Tűzfal',
        image: 'assets/images/grade4/library/firewall.jpg',
        metadata: {
            technical: 'A védelmi vonalak mentén futó HTTPS protokoll, amely titkosított csatornát biztosít a belső zónák és a külvilág között.',
            functional: 'Elsődleges feladata az ismeretlen forrásból érkező fenyegetések blokkolása, megállítva a kártékony algoritmusok beszivárgását a rendszerbe.',
            logical: 'A védelmi rácsok lezárultak, a biztonsági szintet maximumra állítottuk, hogy megvédjük a Rejtett Frissítés maradékát.'
        }
    },
    {
        id: 'wifi',
        name: 'WiFi Jel',
        image: 'assets/images/grade4/library/wifi.jpg',
        metadata: {
            technical: 'A levegőben vibráló adatátvitel 5 GHz-es frekvencián sugároz, bár a zavart szektorokban ez 2.4 GHz-re esett vissza.',
            functional: 'Ez a láthatatlan híd teszi lehetővé a vezeték nélküli csatlakozást a hálózathoz, összekötve a távoli egységeket a központtal.',
            logical: 'A kapcsolat bizonytalanná vált, a jelerősség mindössze néhány csík, ahogy a Zéró-szekvencia köde elnyeli a hullámokat.'
        }
    },
    {
        id: 'broken_file',
        name: 'Sérült Fájl',
        image: 'assets/images/grade4/library/broken_file.jpg',
        metadata: {
            technical: 'Az állomány azonosíthatatlan, a formátuma ismeretlenné vált a bináris szintű roncsolódás következtében.',
            functional: 'Minden kísérlet a fájl megnyitására sikertelen, a rendszer csak hibaüzeneteket küld a puffer egységekbe.',
            logical: 'A helyreállítási kísérlet megakadt, a diagnosztika szerint súlyos CRC-ellenőrzési hiba lépett fel az adatstruktúrában.'
        }
    },
    {
        id: 'cloud',
        name: 'Felhő Tároló',
        image: 'assets/images/grade4/library/cloud.jpg',
        metadata: {
            technical: 'A virtuális tér felett lebegő adattár teljes kapacitása 1 TB, ahol a birodalom legfontosabb emlékeit őrizzük.',
            functional: 'Az adatkristályok folyamatos online szinkronizálást végeznek, hogy minden változás azonnal tükröződjön a Királyságban.',
            logical: 'A távoli elérés akadozik, a szinkronizálás folyamatban van, de a sötét algoritmus lassítja az adatátvitelt.'
        }
    },
    {
        id: 'pendrive',
        name: 'Pendrive',
        image: 'assets/images/grade4/library/pendrive.jpg',
        metadata: {
            technical: 'Egy apró, de robusztus hordozható egység, amely a legújabb USB-C porton keresztül csatlakozik a terminálokhoz.',
            functional: 'Kritikus szerepet tölt be a hordozható adattárolásban, amikor a vezetékes hálózatok már nem megbízhatóak.',
            logical: 'Az adattranszfer befejeződött, a biztonságos eltávolítás engedélyezve, a hordozható egység lecsatlakoztatható.'
        }
    },
    {
        id: 'router',
        name: 'Router',
        image: 'assets/images/grade4/library/router.jpg',
        metadata: {
            technical: 'Az adatutak kereszteződésében álló eszköz, címe a hálózaton: 192.168.1.1.',
            functional: 'Feladata a száguldó adatcsomagok irányítása, hogy minden szkriptrészlet a megfelelő célállomásra érkezzen.',
            logical: 'A hálózati térképen jelenleg 5 kapcsolódott eszköz látszik, amelyek kétségbeesetten próbálnak kommunikálni a központtal.'
        }
    },
    {
        id: 'akku',
        name: 'Akkumulátor',
        image: 'assets/images/grade4/library/akku.jpg',
        metadata: {
            technical: 'A hordozható terminálok belső energiaforrása, stabil 3.7 V feszültségen táplálja a logikai áramköröket.',
            functional: 'A rendszer folyamatos energiaellátásáért felel, biztosítva a túlélést az elszigetelt szektorokban.',
            logical: 'A feszültség vészjóslóan esik, a hátralévő idő 12 perc, mielőtt a kijelződ sötétbe borulna.'
        }
    },
    {
        id: 'bin',
        name: 'Lomtár',
        image: 'assets/images/grade4/library/bin.jpg',
        metadata: {
            technical: 'A törölt adatok gyűjtőhelye, amely jelenleg 1.2 GB méretű roncsolt kódrészletet tartalmaz.',
            functional: 'Itt kezdeményezhető a feleslegessé vált indexek végleges törlése, felszabadítva a helyet a frissítéseknek.',
            logical: 'Az archívum nem üres, a tartalom 10 elem, melyek között a Zéró-szekvencia nyomai is ott lapulhatnak.'
        }
    },
    {
        id: 'database',
        name: 'Adatbázis',
        image: 'assets/images/grade4/library/database.jpg',
        metadata: {
            technical: 'A Könyvtár digitális polcain tárolt tudástár, amely összesen 10.000 bejegyzést tartalmaz a birodalomról.',
            functional: 'Lehetővé teszi az összetett adatok lekérdezését, hogy megtaláljuk a keresett algoritmusok leírását.',
            logical: 'A keresési folyamat megszakadt, mivel az adatbázis-index sérült, manuális beavatkozásra van szükség.'
        }
    },
    {
        id: 'webcam',
        name: 'Webkamera',
        image: 'assets/images/grade4/library/webcam.jpg',
        metadata: {
            technical: 'A vizuális megfigyelő egység, amely 1080p felbontásban pásztázza a virtuális folyosókat.',
            functional: 'Elsődlegesen a valós idejű videó streamelésére használjuk, hogy lássuk a pusztítás mértékét.',
            logical: 'A lencse mellett vörös fény villog, a biztonsági adatvédelem aktív, meggátolva a jogosulatlan betekintést.'
        }
    },
    {
        id: 'microphone',
        name: 'Mikrofon',
        image: 'assets/images/grade4/library/microphone.jpg',
        metadata: {
            technical: 'A hangérzékelő modul, amely klasszikus mikrofon csatlakozóval kapcsolódik a kommunikációs porthoz.',
            functional: 'Az analóg hanghullámok rögzítéséért felel, digitális jellé alakítva a segélykéréseket.',
            logical: 'A rendszerben csend honol, az egység állapota némítva, nehogy a Zéró-szekvencia észlelje a jelenlétedet.'
        }
    },
    {
        id: 'lock',
        name: 'Lakat',
        image: 'assets/images/grade4/library/lock.jpg',
        metadata: {
            technical: 'A legszigorúbb AES-256 titkosítás, amely szinte feltörhetetlen gátat emel az adatok köré.',
            functional: 'A kritikus rendszermodulokhoz való hozzáférés szabályozására szolgál, csak a Kódmesterek számára.',
            logical: 'A védelem aktiválódott, a rendszer 3 hiba után zárolva lett, várakozva a feloldó kódra.'
        }
    },
    {
        id: 'update',
        name: 'Frissítés',
        image: 'assets/images/grade4/library/update.jpg',
        metadata: {
            technical: 'A rendszer legújabb, 2.1.0-ás verziójú szoftvercsomagja, amely a stabilitást hivatott visszaállítani.',
            functional: 'A sérült rendszer javítását célozza meg, befoltozva a Zéró-szekvencia ütötte réseket.',
            logical: 'A telepítés csaknem kész, de a véglegesítéshez a rendszer újraindítása szükséges.'
        }
    },
    {
        id: 'cursor',
        name: 'Kurzor',
        image: 'assets/images/grade4/library/cursor.jpg',
        metadata: {
            technical: 'A precíziós mutatóeszköz, amely 1200 DPI érzékenységgel követi minden mozdulatodat a virtuális térben.',
            functional: 'Segítségével történik a kívánt objektum kiválasztása és az adatpárok szinkronizálása.',
            logical: 'A követő rendszer szerint a jelenlegi pozíció: X=450, Y=200, pont az egyik sérült index felett.'
        }
    }
];
