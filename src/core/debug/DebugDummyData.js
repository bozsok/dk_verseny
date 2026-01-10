/**
 * Debug Dummy Data - Teszt adatok Onboarding skip-hez
 * 
 * Ez a fájl tartalmazza az előre kitöltött adatokat,
 * amelyeket a rendszer automatikusan használ, ha az Onboarding
 * section skip-elve van.
 */

/**
 * Dummy felhasználói profil
 * 
 * Pontszám részletezés:
 * - Registration: name (+1), nickname (+1), classId (+1) = 3 pont
 * - Character selection: avatar (+1) = 1 pont
 * - Total: 4 pont
 */
export const DUMMY_PROFILE = {
  userProfile: {
    name: "Debug Teszt",
    nickname: "DebugUser",
    classId: "3.a"
  },
  avatar: "b1", // Első fiú karakter (boy_1)
  score: 4      // Registration (3) + Character (1)
};

/**
 * Onboarding kitöltésének szimulált ideje (milliszekundumban)
 * 
 * Becslés:
 * - Welcome slide: ~10mp (olvasás + kattintás)
 * - Registration: ~20mp (3 mező kitöltése, validáció)
 * - Character selection: ~8mp (választás, preview)
 * - Total: ~38 másodperc
 * 
 * Ez az érték offsetként kerül hozzáadásra a Timer-hez,
 * hogy reálisan szimulálja az Onboarding időt.
 */
export const ONBOARDING_SIMULATION_TIME = 38000; // 38 sec (ms)

/**
 * Default export az egyszerűbb import-ért
 */
export default {
  DUMMY_PROFILE,
  ONBOARDING_SIMULATION_TIME
};
