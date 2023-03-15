const crypto = require("crypto");

const bobKeyPair = crypto.createECDH("secp256k1");
const aliceKeyPair = crypto.createECDH("secp256k1");

bobKeyPair.generateKeys();
aliceKeyPair.generateKeys();

const alicePublicKeyHex = aliceKeyPair.getPublicKey().toString("hex");
const bobPublicKeyHex = bobKeyPair.getPublicKey().toString("hex");
const alicePrivateKeyHex = aliceKeyPair.getPrivateKey().toString("hex");
const bobPrivateKeyHex = bobKeyPair.getPrivateKey().toString("hex");

console.log("============================================================");
console.log();
console.log("alicePublicKeyHex", alicePublicKeyHex);
console.log();
console.log("bobPublicKeyHex", bobPublicKeyHex);
console.log();
console.log("alicePrivateKeyHex", alicePrivateKeyHex);
console.log();
console.log("bobPrivateKeyHex", bobPrivateKeyHex);
console.log();
console.log("============================================================");

const alicePublicKey = crypto.createSecretKey(
  Buffer.from(alicePublicKeyHex, "hex")
);

const bobPrivateKey = crypto.createSecretKey(
  Buffer.from(bobPrivateKeyHex, "hex")
);

const bobKeyAgree = crypto.diffieHellman({
  publicKey: alicePublicKey,
  privateKey: bobPrivateKey
});

console.log(bobKeyAgree.toString("base64"));
