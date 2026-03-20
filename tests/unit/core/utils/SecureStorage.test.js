import SecureStorage from '@/core/utils/SecureStorage.js';

describe('SecureStorage', () => {
  const testKey = 'test-key';
  const testData = { foo: 'bar', baz: 123 };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    SecureStorage.setLogger(null);
  });

  it('environment check: global.localStorage should be window.localStorage', () => {
    expect(global.localStorage).toBe(window.localStorage);
  });

  describe('setItem', () => {
    it('should store encrypted data in localStorage', () => {
      SecureStorage.setItem(testKey, testData);
      
      const stored = window.localStorage.getItem(testKey);
      expect(stored).toContain('DKV_SECURE_v1:');
    });

    it('should return false and log error on failure', () => {
      const logger = { error: jest.fn() };
      SecureStorage.setLogger(logger);
      
      // Mock localStorage.setItem to throw
      const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Quota exceeded');
      });
      
      const result = SecureStorage.setItem(testKey, testData);
      expect(result).toBe(false);
      expect(logger.error).toHaveBeenCalled();
      
      spy.mockRestore();
    });
  });

  describe('getItem', () => {
    it('should retrieve and decrypt data correctly', () => {
      SecureStorage.setItem(testKey, testData);
      const retrieved = SecureStorage.getItem(testKey);
      expect(retrieved).toEqual(testData);
    });

    it('should handle legacy unencrypted JSON data', () => {
      const rawJson = JSON.stringify(testData);
      window.localStorage.setItem(testKey, rawJson);
      const retrieved = SecureStorage.getItem(testKey);
      expect(retrieved).toEqual(testData);
    });

    it('should return null and log error on corrupted encrypted data', () => {
      const logger = { error: jest.fn() };
      SecureStorage.setLogger(logger);
      
      // Data with prefix but invalid base64/encryption
      window.localStorage.setItem(testKey, 'DKV_SECURE_v1:!!!invalid!!!');
      
      const retrieved = SecureStorage.getItem(testKey);
      expect(retrieved).toBeNull();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('removeItem', () => {
    it('should remove the item from localStorage', () => {
      SecureStorage.setItem(testKey, testData);
      SecureStorage.removeItem(testKey);
      expect(SecureStorage.getItem(testKey)).toBeNull();
    });
  });

  describe('Encryption/Decryption', () => {
    it('should throw error in decrypt if prefix is missing', () => {
      expect(() => {
        SecureStorage.decrypt('no-prefix-data');
      }).toThrow('Invalid storage format');
    });

    it('should correctly roundtrip encrypt and decrypt', () => {
      const original = 'secret-message';
      const encrypted = SecureStorage.encrypt(original);
      const decrypted = SecureStorage.decrypt(encrypted);
      expect(decrypted).toBe(original);
    });
  });
});
