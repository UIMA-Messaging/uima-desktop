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

	public async establishedPostExchange(userId: string, postKeyBundle: PostKeyBundle): Promise<{ fingerprint: string[] }> {
		if (!this.x3dh) {
			throw Error('Cannot perform post exchange when no X3DH is set.')
		}
		const { sharedSecret } = this.x3dh.postExchange(postKeyBundle)
		await setDoubleRatchet(userId, DoubleRatchet.init(sharedSecret, false))
		return {
			fingerprint: secretToReadable(sharedSecret),
		}
	}

	public async encrypt(recepientId: string, senderId: string, message: any): Promise<NetworkMessage> {
		if (!this.x3dh) {
			throw Error('Cannot encrypt when no X3DH is set.')
		}
		const doubleRatchet = await getDoubleRatchet(recepientId)
		const encrypted = doubleRatchet.send(message)
		await setDoubleRatchet(recepientId, doubleRatchet)
		return {
			sender: senderId,
			receiver: recepientId,
			content: encrypted,
		}
	}

	public async decrypt(message: NetworkMessage): Promise<{ message: any; ciphertext: string }> {
		if (!this.x3dh) {
			throw Error('Cannot decrypt when no X3DH is set.')
		}
		const doubleRatchet = await getDoubleRatchet(message.sender)
		const decrypted = doubleRatchet.receive(message.content) as Message
		await setDoubleRatchet(message.sender, doubleRatchet)
		return {
			message: decrypted,
			ciphertext: message.content.ciphertext,
		}
	}
}
