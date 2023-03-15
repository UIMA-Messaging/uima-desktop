const { AsymmetricRatchet } = require("2key-ratchet");
const crypto = require("crypto");

const ecdh = crypto.createECDH("secp256k1");

const senderPrivateKey = ecdh.generateKeys();
const senderPublicKey = ecdh.getPublicKey();

const receiverPrivateKey = ecdh.generateKeys();
const receiverPublicKey = ecdh.getPublicKey();

const sendingRatchet = new AsymmetricRatchet();
const receivingRatchet = new AsymmetricRatchet();

sendingRatchet.initialize(receiverPublicKey);
receivingRatchet.initialize(senderPublicKey);

const sendingSharedSecret =
  sendingRatchet.generateSharedSecret(receivingPublicKey);
const receivingSharedSecret =
  receivingRatchet.generateSharedSecret(sendingPublicKey);

const plaintext = "Hello, world!";
const ciphertext = sendingRatchet.encrypt(plaintext, sendingSharedSecret);
const decryptedText = receivingRatchet.decrypt(
  ciphertext,
  receivingSharedSecret
);

sendingRatchet.ratchet();
receivingRatchet.ratchet();
