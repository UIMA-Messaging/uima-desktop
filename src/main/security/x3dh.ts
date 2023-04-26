import { createECDH, createHash } from 'crypto'
import { ECDH } from 'crypto'
import { KeyPair, X3DHKeyPairs, KeyBundle, PostKeyBundle } from '../../common/types/SigalProtocol'
import { kdf } from './encryption'
import { ExchangeKeys } from '../../common/types/SigalProtocol'

export default class X3DH {
	private ecdh: ECDH
	private identityKeys: KeyPair
	private signedPreKeys: KeyPair
	private oneTimePreKeys: KeyPair[]
	private signature: string

	constructor(keys: X3DHKeyPairs) {
		this.ecdh = createECDH('prime256v1')
		this.identityKeys = keys.identityKeys
		this.signedPreKeys = keys.signedPreKeys
		this.oneTimePreKeys = keys.oneTimePreKeys
		this.signature = keys.signature
	}

	public static init(numOneTimePreKeys = 200) {
		return new X3DH({
			identityKeys: X3DH.generateKeyPairs(),
			signedPreKeys: X3DH.generateKeyPairs(),
			oneTimePreKeys: new Array(numOneTimePreKeys).fill(null).map(X3DH.generateKeyPairs),
			signature: '',
		})
	}

	public static fromState(keys: X3DHKeyPairs) {
		return new X3DH(keys)
	}

	public getState(): X3DHKeyPairs {
		return JSON.parse(JSON.stringify(this)) as X3DHKeyPairs
	}

	public static generateKeyPairs(): KeyPair {
		const ecdh = createECDH('prime256v1')
		ecdh.generateKeys()
		return {
			privateKey: ecdh.getPrivateKey('hex'),
			publicKey: ecdh.getPublicKey('hex'),
		}
	}

	private diffieHellman(localPrivate: string, remotePublic: string) {
		this.ecdh.setPrivateKey(localPrivate, 'hex')
		return this.ecdh.computeSecret(remotePublic, 'hex')
	}

	public exchange(keyBundle: KeyBundle): { sharedSecret: string; postKeyBundle: PostKeyBundle } {
		const ephemeralKeys = X3DH.generateKeyPairs()
		// DH1 = DH(IK, SPK)
		const DH1 = this.diffieHellman(this.identityKeys.privateKey, keyBundle.signedPreKey)
		// DH2 = DH(EK, IK)
		const DH2 = this.diffieHellman(ephemeralKeys.privateKey, keyBundle.identityKey)
		// DH3 = DH(EK, SPK)
		const DH3 = this.diffieHellman(ephemeralKeys.privateKey, keyBundle.signedPreKey)
		// DH4 = DH(EK, OPK)
		const DH4 = this.diffieHellman(ephemeralKeys.privateKey, keyBundle.oneTimePreKey)
		// Combine computed secrets of exchanges
		const combinedKeys = Buffer.concat([DH1, DH2, DH3, DH4])
		// Compute the secret of the shared secrets
		const sharedSecret = kdf(combinedKeys)
		return {
			sharedSecret,
			postKeyBundle: {
				oneTimePreKey: keyBundle.oneTimePreKey,
				identityKey: this.identityKeys.publicKey,
				ephemeralKey: ephemeralKeys.publicKey,
			},
		}
	}

	public postExchange(postKeyBundle: PostKeyBundle): { sharedSecret: string } {
		// DH1 = DH(SPK, IK)
		const DH1 = this.diffieHellman(this.signedPreKeys.privateKey, postKeyBundle.identityKey)
		// DH2 = DH(IK, EK)
		const DH2 = this.diffieHellman(this.identityKeys.privateKey, postKeyBundle.ephemeralKey)
		// DH3 = DH(SPK, EK)
		const DH3 = this.diffieHellman(this.signedPreKeys.privateKey, postKeyBundle.ephemeralKey)
		// DH4 = DH(OPK, EK)
		const privateOneTimePreKey = this.getOPKFromPublic(postKeyBundle.oneTimePreKey)
		const DH4 = this.diffieHellman(privateOneTimePreKey, postKeyBundle.ephemeralKey)
		// Combine computed secrets of exchanges
		const combinedKeys = Buffer.concat([DH1, DH2, DH3, DH4])
		// Compute the secret of the shared secrets
		const sharedSecret = createHash('sha256').update(combinedKeys).digest('hex')
		return { sharedSecret }
	}

	private getOPKFromPublic(publicKey: string): string {
		const i = this.oneTimePreKeys.findIndex((key) => key.publicKey === publicKey)
		return i !== -1 ? this.oneTimePreKeys.splice(i, 1)[0].publicKey : null
	}

	public getExchangeKeys(): ExchangeKeys {
		return {
			identityKey: this.identityKeys.publicKey,
			signedPreKey: this.signedPreKeys.publicKey,
			oneTimePreKeys: this.oneTimePreKeys.map((key) => key.publicKey),
			signature: this.signature,
		}
	}
}
