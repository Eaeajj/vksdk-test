import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
} from "crypto";

const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text, key) {
  const [encryptKey, signKey] = prepareKeys(key);

  let iv = randomBytes(IV_LENGTH);
  let cipher = createCipheriv("aes-256-cbc", encryptKey, iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  encrypted = Buffer.concat([iv, encrypted]);
  let signature = hmac(encrypted, signKey);

  return Buffer.concat([signature, encrypted]).toString("base64");
}

function decrypt(text, key) {
  const [encryptKey, signKey] = prepareKeys(key);
  text = Buffer.from(text, "base64");

  let signature = text.slice(0, 32);
  let ciphertext = text.slice(32);

  if (Buffer.compare(hmac(ciphertext, signKey), signature)) {
    throw new Error("Signature does not match");
  }

  let iv = ciphertext.slice(0, IV_LENGTH);
  let encryptedText = ciphertext.slice(IV_LENGTH);
  let decipher = createDecipheriv("aes-256-cbc", encryptKey, iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf-8");
}

function prepareKeys(key) {
  const hash = createHash("sha512");
  hash.update(key);
  const hashed = hash.digest();

  return [hashed.slice(0, 32), hashed.slice(32)];
}

function hmac(data, key) {
  return createHmac("sha256", key).update(data).digest();
}

export default { decrypt, encrypt };
