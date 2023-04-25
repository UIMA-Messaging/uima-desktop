import { Message } from '../../common/types'
import { KeyBundle, NetworkMessage, PostKeyBundle } from '../../common/types/SigalProtocol'
import { getDoubleRatchet, setDoubleRatchet } from '../repos/encryption-persistence'
import DoubleRatchet from '../security/double-ratchet'
import X3DH from '../security/x3dh'

export default class Encryption {
	private x3dh: X3DH

	public setX3DH(x3dh: X3DH) {
		this.x3dh = x3dh
	}

	public invalidate() {
		delete this.x3dh
	}

	public async establishExchange(keyBundle: KeyBundle): Promise<PostKeyBundle> {
		if (this.x3dh) {
			throw Error('Cannot perform exchange when no X3DH is set.')
		}
		const { sharedSecret, postKeyBundle } = this.x3dh.exchange(keyBundle)
		await setDoubleRatchet(keyBundle.userId, DoubleRatchet.init(sharedSecret, true))
		return postKeyBundle
	}

	public async establishedPostExchange(postKeyBundle: PostKeyBundle) {
		if (this.x3dh) {
			throw Error('Cannot perform post exchange when no X3DH is set.')
		}
		const { sharedSecret } = this.x3dh.postExchange(postKeyBundle)
		await setDoubleRatchet(postKeyBundle.userId, DoubleRatchet.init(sharedSecret, false))
	}

	public async encrypt(message: Message): Promise<NetworkMessage> {
		if (this.x3dh) {
			throw Error('Cannot encrypt when no X3DH is set.')
		}
		const doubleRatchet = await getDoubleRatchet(message.receiver)
		const encrypted = doubleRatchet.send(message)
		return {
			sender: message.sender,
			receiver: message.receiver,
			content: encrypted,
		}
	}

	public async decrypt(message: NetworkMessage): Promise<{ message: Message; ciphertext: string }> {
		if (this.x3dh) {
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