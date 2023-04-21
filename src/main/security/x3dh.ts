import { createECDH, createHash } from 'crypto'
import { v4 as uuid } from 'uuid'
import { ECDH } from 'crypto'
import { KeyPair, X3DHKeyPairs, KeyBundle, PostKeyBundle, OutstandingExchangeRecord } from '../../common/types/SigalProtocol'
import { kdf } from './encryption'


export default class X3DH {
	private ecdh: ECDH
	private identityKeys: KeyPair
	private signedPreKeys: KeyPair
	private oneTimePreKeys: KeyPair[]
	private outstandingExchanges: OutstandingExchangeRecord[]

	constructor(keys: X3DHKeyPairs) {
		this.ecdh = createECDH('secp256k1')
		this.identityKeys = keys.identityKeys
		this.signedPreKeys = keys.signedPreKeys
		this.oneTimePreKeys = keys.oneTimePreKeys
		this.outstandingExchanges = keys.outstandingExchanges
	}

	public static init(numOneTimePreKeys = 200) {
		return new X3DH({
			identityKeys: X3DH.generateKeyPairs(),
			signedPreKeys: X3DH.generateKeyPairs(),
			oneTimePreKeys: new Array(numOneTimePreKeys).fill(null).map(X3DH.generateKeyPairs),
			outstandingExchanges: [],
		})
	}

	public static fromState(keys: X3DHKeyPairs) {
		return new X3DH(keys)
	}

	public getState(): X3DHKeyPairs {
		return JSON.parse(JSON.stringify(this)) as X3DHKeyPairs
	}

	public static generateKeyPairs(): KeyPair {
		const ecdh = createECDH('secp256k1')
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
		const DH1 = this.diffieHellman(this.identityKeys.privateKey, keyBundle.publicSignedPreKey)
		// DH2 = DH(EK, IK)
		const DH2 = this.diffieHellman(ephemeralKeys.privateKey, keyBundle.publicIdentityKey)
		// DH3 = DH(EK, SPK)
		const DH3 = this.diffieHellman(ephemeralKeys.privateKey, keyBundle.publicSignedPreKey)
		// DH4 = DH(EK, OPK)
		const DH4 = this.diffieHellman(ephemeralKeys.privateKey, keyBundle.publicOneTimePreKey)
		// Combine computed secrets of exchanges
		const combinedKeys = Buffer.concat([DH1, DH2, DH3, DH4])
		// Compute the secret of the shared secrets
		const sharedSecret = kdf(combinedKeys)
		return {
			sharedSecret,
			postKeyBundle: {
				userId: keyBundle.userId,
				publicIdentityKey: this.identityKeys.publicKey,
				publicEphemeralKey: ephemeralKeys.publicKey,
			},
		}
	}

	public postExchange(postKeyBundle: PostKeyBundle): { sharedSecret: string } {
		// DH1 = DH(SPK, IK)
		const DH1 = this.diffieHellman(this.signedPreKeys.privateKey, postKeyBundle.publicIdentityKey)
		// DH2 = DH(IK, EK)
		const DH2 = this.diffieHellman(this.identityKeys.privateKey, postKeyBundle.publicEphemeralKey)
		// DH3 = DH(SPK, EK)
		const DH3 = this.diffieHellman(this.signedPreKeys.privateKey, postKeyBundle.publicEphemeralKey)
		// DH4 = DH(OPK, EK)
		const bundle = this.getFromOutstandingExchanges(postKeyBundle.userId)
		const DH4 = this.diffieHellman(bundle.privateOneTimePreKey, postKeyBundle.publicEphemeralKey)
		// Combine computed secrets of exchanges
		const combinedKeys = Buffer.concat([DH1, DH2, DH3, DH4])
		// Compute the secret of the shared secrets
		const sharedSecret = createHash('sha256').update(combinedKeys).digest('hex')
		return { sharedSecret }
	}

	private getFromOutstandingExchanges(id: string): OutstandingExchangeRecord {
		const i = this.outstandingExchanges.findIndex((exchange) => exchange.userId === id)
		return i !== -1 ? this.outstandingExchanges.splice(i, 1)[0] : null
	}

	// Called when user wants to establish share secret with remote party
	public generateKeyBundle(): KeyBundle {
		const oneTimePreKey = this.oneTimePreKeys.shift()
		const bundleRecord: OutstandingExchangeRecord = {
			userId: uuid(),
			creationDate: new Date(),
			privateOneTimePreKey: oneTimePreKey.privateKey,
		}
		this.outstandingExchanges.push(bundleRecord)
		return {
			userId: bundleRecord.userId,
			publicSignedPreKey: this.signedPreKeys.publicKey,
			publicIdentityKey: this.identityKeys.publicKey,
			publicOneTimePreKey: oneTimePreKey.publicKey,
		}
	}
}
