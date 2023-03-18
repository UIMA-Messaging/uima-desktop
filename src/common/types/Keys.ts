export interface Key {
  value: string
  creationDate: Date
  expirationDate: Date
}

export interface KeyBundle {
  identityKey: Key
  signedPreKey: Key
  oneTimePreKeys: Key[]
}

export interface KeyPair {
  publicKey: Key
  privateKey: Key
}
