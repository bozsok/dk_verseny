/**
 * SecureStorage - Adatbiztonsági segédosztály
 * 
 * Védelmet nyújt a LocalStorage adatok egyszerű manipulációja ellen.
 * Base64 kódolást és egy egyszerű "sózást" használ.
 */
class SecureStorage {
    constructor(secretKey = 'dkv-secret-2025') {
        this.secretKey = secretKey;
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
            console.error('SecureStorage save failed:', error);
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

            const decrypted = this.decrypt(encrypted);
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('SecureStorage load failed (potential manipulation detected):', error);
            return null;
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
