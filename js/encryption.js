import CryptoJS from 'crypto-js';

class Encryption {
    constructor() {
        this.key = localStorage.getItem('encryptionKey') || this.generateKey();
    }

    generateKey() {
        const key = CryptoJS.lib.WordArray.random(256/8).toString();
        localStorage.setItem('encryptionKey', key);
        return key;
    }

    encrypt(data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), this.key).toString();
    }

    decrypt(encryptedData) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, this.key);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }
}