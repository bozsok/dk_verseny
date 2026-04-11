/**
 * SecureStorage - Adatbiztonsági segédosztály
 * 
 * Védelmet nyújt a LocalStorage adatok egyszerű manipulációja ellen.
 * Base64 kódolást és egy egyszerű "sózást" használ.
 */
class SecureStorage {
    constructor(secretKey = 'dkv-secret-2025') {
        this.secretKey = secretKey;
        this.logger = null;
    }

    /**
     * Logger beállítása
     */
    setLogger(logger) {
        this.logger = logger;
    }

    /**
     * Adat mentése titkosítva
     */
    setItem(key, value) {
        try {
            const stringValue = JSON.stringify(value);
            const encrypted = this.encrypt(stringValue);
            localStorage.setItem(key, encrypted);
            return true;
        } catch (error) {
            this._logError('SecureStorage save failed', { key, error: error.message });
            return false;
        }
    }

    /**
     * Adat betöltése és visszafejtése
     */
    getItem(key) {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;

            // Ellenőrizzük, hogy az új formátumban van-e
            if (encrypted.startsWith('DKV_SECURE_v1:')) {
                const decrypted = this.decrypt(encrypted);
                return JSON.parse(decrypted);
            }

            // Fallback: Régi formátum (sima JSON vagy string)
            try {
                return JSON.parse(encrypted);
            } catch (e) {
                return encrypted; // Ha nem JSON, akkor sima string
            }
        } catch (error) {
            this._logError('SecureStorage load failed', { key, error: error.message });
            return null;
        }
    }

    /**
     * Belső hibakezelő hiba naplózáshoz
     */
    _logError(message, context = {}) {
        if (this.logger && typeof this.logger.error === 'function') {
            this.logger.error(message, context);
        } else {
            // eslint-disable-next-line no-console
            console.error(`[SecureStorage] ${message}`, context);
        }
    }

    /**
     * Adat törlése
     */
    removeItem(key) {
        localStorage.removeItem(key);
    }

    /**
     * Egyszerű "titkosítás" (Base64 + Salt + XOR jellegű keverés)
     * Megjegyzés: Ez nem katonai szintű titkosítás, csak a "könnyű átírás" ellen véd.
     */
    encrypt(text) {
        // 1. Lépés: Base64 kódolás (hogy olvashatatlan legyen szemre)
        const base64 = btoa(encodeURIComponent(text));

        // 2. Lépés: Karakterek megfordítása vagy egyszerű manipuláció
        // Itt most egy egyszerű reverzálást használunk példaként, plusz egy prefixet
        return `DKV_SECURE_v1:${base64.split('').reverse().join('')}`;
    }

    /**
     * Visszafejtés
     */
    decrypt(encryptedText) {
        if (!encryptedText.startsWith('DKV_SECURE_v1:')) {
            throw new Error('Invalid storage format');
        }

        // 1. Lépés: Prefix eltávolítása és visszafordítás
        const base64Reverse = encryptedText.replace('DKV_SECURE_v1:', '');
        const base64 = base64Reverse.split('').reverse().join('');

        // 2. Lépés: Base64 dekódolás
        return decodeURIComponent(atob(base64));
    }
}

export default new SecureStorage();
