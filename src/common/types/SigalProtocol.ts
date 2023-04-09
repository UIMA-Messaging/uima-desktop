export interface KeyPair {
  publicKey: string
  privateKey: string
}

export interface EncryptedMessage {
  header: MessageHeader
  ciphertext: string
}

export interface DecryptedMessage {
  ciphertext: string
  plaintext: string
}

export interface MessageHeader {
  counter: number
  date: Date
}

export interface X3DHKeys {
  identityKeys: KeyPair
  signedPreKeys: KeyPair
  oneTimePreKeys: KeyPair[]
  outstandingExchanges: OutstandingExchangeRecord[]
}

export interface KeyBundle {
  id: string
  publicSignedPreKey: string
  publicIdentityKey: string
  publicOneTimePreKey: string
}

export interface PostKeyBundle {
  id: string
  publicIdentityKey: string
  publicEphemeralKey: string
}

export interface ExchangeResult {
  sharedSecret: string
  postKeyBundle: PostKeyBundle
}

export interface OutstandingExchangeRecord {
  id: string
  creationDate: Date
  privateOneTimePreKey: string
}
