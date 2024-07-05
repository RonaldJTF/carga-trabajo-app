import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptojsService {
  keySize: number;
  iterationCount: number;

  private key = CryptoJS.enc.Utf8.parse('1234567890123456'); // Debe ser de 16 bytes
  private iv = CryptoJS.enc.Utf8.parse('1234567890123456'); // Debe ser de 16 bytes

  constructor() {
    this.keySize = 128 / 32;
    this.iterationCount = 1000;
  }

  private generateKey(salt: any, passPhrase: any) {
    const key = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
      keySize: this.keySize,
      iterations: this.iterationCount,
    });
    return key;
  }

  private encrypt(salt: any, iv: any, passPhrase: any, plainText: any) {
    const key = this.generateKey(salt, passPhrase);
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  private decrypt(salt: any, iv: any, passPhrase: any, cipherText: any) {
    const key = this.generateKey(salt, passPhrase);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(cipherText),
    });
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  encryptString(inputString: string) {
    const key = CryptoJS.lib.WordArray.random(256 / 8).toString(
      CryptoJS.enc.Hex
    );
    const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(
      CryptoJS.enc.Hex
    );
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(
      CryptoJS.enc.Hex
    );

    const ciphertext = this.encrypt(salt, iv, key, inputString);

    return btoa(`${key}|${iv}|${salt}|${ciphertext}`);
  }

  decryptString(encryptedString: string) {
    const decryptedString = atob(encryptedString);
    const parts = decryptedString.split("|");

    if (parts.length !== 4) {
      throw new Error("The encrypted string is not in the correct format.");
    }

    const key = parts[0];
    const iv = parts[1];
    const salt = parts[2];
    const cipherText = parts[3];

    return this.decrypt(salt, iv, key, cipherText);
  }

  //////////////////////////////////////

  encryptParam(value: string): string {
    const encrypted = CryptoJS.AES.encrypt(value, this.key, {
      iv: CryptoJS.enc.Utf8.parse(),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  decryptParam(encrypted: string): string {
    const decrypted = CryptoJS.AES.decrypt(encrypted, this.key, {
      iv: CryptoJS.enc.Utf8.parse(),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
