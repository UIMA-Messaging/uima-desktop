import { appData } from '..'
import DoubleRatchet from '../security/double-ratchet'
import X3DH from '../security/x3dh'

export async function getX3DH(): Promise<X3DH> {
	const instance = await appData.get<X3DH>('encryption.x3dh')
	if (!instance) {
		throw Error('No X3DH instance was persisted locally.')
	}
	return instance
}

export async function setX3DH(x3dh: X3DH) {
	await appData.set('encryption.x3dh', x3dh, true)
}

export async function getDoubleRatchet(userId: string) {
	const instance = await appData.get<DoubleRatchet>(`encryption.dr.${userId}`)
	if (!instance) {
		throw Error(`No double ratchet found was persisted for user ${userId}`)
	}
	return instance
}

export async function setDoubleRatchet(userId: string, ratchet: DoubleRatchet) {
	await appData.set(`encryption.dr.${userId}`, ratchet, true)
}
