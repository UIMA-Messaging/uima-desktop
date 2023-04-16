import { DoubleRatchetState, X3DHKeyPairs } from '../../common/types/SigalProtocol'
import { appData } from '..'
import DoubleRatchet from '../security/double-ratchet'
import X3DH from '../security/x3dh'

export async function getX3DH(): Promise<X3DH> {
	const keys = await appData.get<X3DHKeyPairs>('encryption.x3dh')
	if (!keys) {
		throw Error('No X3DH instance was persisted locally.')
	}
	return X3DH.fromState(keys)
}

export async function setX3DH(x3dh: X3DH) {
	await appData.set('encryption.x3dh', x3dh, true)
}

export async function getDoubleRatchet(userId: string) {
	const state = await appData.get<DoubleRatchetState>(`encryption.dr.${userId}`)
	if (!state) {
		throw Error(`No double ratchet found was persisted for user ${userId}`)
	}
	return DoubleRatchet.fromState(state)
}

export async function setDoubleRatchet(userId: string, ratchet: DoubleRatchet) {
	await appData.set(`encryption.dr.${userId}`, ratchet, true)
}
