import { randomBytes, createCipheriv, createDecipheriv, createHash, createHmac } from 'crypto';

const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text, key) {
  key = prepareKey(key);

  let iv = randomBytes(IV_LENGTH);
  let cipher = createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  encrypted = Buffer.concat([iv, encrypted]);
  let signature = hmac(encrypted, key);

  return Buffer.concat([signature, encrypted]).toString('base64');
}

function decrypt(text, key) {
  key = prepareKey(key);
  text = Buffer.from(text, 'base64');

  let signature = text.slice(0, 32);
  let ciphertext = text.slice(32);

  if (Buffer.compare(hmac(ciphertext, key), signature)) {
    throw new Error('Signature does not match');
  }

  let iv = ciphertext.slice(0, IV_LENGTH);
  let encryptedText = ciphertext.slice(IV_LENGTH);
  let decipher = createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf-8');
}

function prepareKey(key) {
  const hash = createHash('sha256');
  hash.update(key);
  return hash.digest();
}

function hmac(data, key) {
  return createHmac('sha256', key)
    .update(data)
    .digest();
}

export default { decrypt, encrypt };
