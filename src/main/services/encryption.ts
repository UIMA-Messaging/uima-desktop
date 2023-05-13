import { Message } from '../../common/types'
import { KeyBundle, NetworkMessage, PostKeyBundle } from '../../common/types/SigalProtocol'
import { getDoubleRatchet, setDoubleRatchet } from '../repos/encryption-persistence'
import DoubleRatchet from '../security/double-ratchet'
import { secretToReadable } from '../security/utils'
import X3DH from '../security/x3dh'

export default class Encryption {
	private x3dh: X3DH

	public setX3DH(x3dh: X3DH) {
		this.x3dh = x3dh
	}

	public invalidate() {
		delete this.x3dh
	}

	public async establishExchange(userId: string, keyBundle: KeyBundle): Promise<{ fingerprint: string[]; postKeyBundle: PostKeyBundle }> {
		if (!this.x3dh) {
			throw Error('Cannot perform exchange when no X3DH is set.')
		}
		const { sharedSecret, postKeyBundle } = this.x3dh.exchange(keyBundle)
		await setDoubleRatchet(userId, DoubleRatchet.init(sharedSecret, true))
		return {
			fingerprint: secretToReadable(sharedSecret),
			postKeyBundle: postKeyBundle,
		}
	}

	public async establishedPostExchange(userId: string, postKeyBundle: PostKeyBundle) {
		if (!this.x3dh) {
			throw Error('Cannot perform post exchange when no X3DH is set.')
		}
		const { sharedSecret } = this.x3dh.postExchange(postKeyBundle)
		await setDoubleRatchet(userId, DoubleRatchet.init(sharedSecret, false))
	}

	public async encrypt(recepientId: string, message: any): Promise<NetworkMessage> {
		console.log('encrypting message', message)
		if (!this.x3dh) {
			throw Error('Cannot encrypt when no X3DH is set.')
		}
		const doubleRatchet = await getDoubleRatchet(recepientId)
		const encrypted = doubleRatchet.send(message)
		return {
			sender: message.author.user.id,
			receiver: recepientId,
			content: encrypted,
		}
	}

	public async decrypt(message: NetworkMessage): Promise<{ message: any; ciphertext: string }> {
		if (!this.x3dh) {
			throw Error('Cannot decrypt when no X3DH is set.')
		}
		const doubleRatchet = await getDoubleRatchet(message.receiver)
		const decrypted = doubleRatchet.receive(message.content)
		return {
			message: JSON.parse(decrypted) as Message,
			ciphertext: message.content.ciphertext,
		}
	}
}
