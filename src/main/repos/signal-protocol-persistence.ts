import { appData } from '../main'
import DoubleRatchet from '../security/double-ratchet'
import X3DH from '../security/x3dh'

export async function getX3DH(): Promise<X3DH> {
    const instance = await appData.getSensitive('x3dh')
    if (!instance) {
        throw Error('No X3DH instance was persisted locally.')
    }
    return instance as X3DH
}

export async function setX3DH(x3dh: X3DH) {
    await appData.setSensitive('x3dh', x3dh)
}

export async function getDoubleRatchetByUser(userId: string) {
    const instance = await appData.getSensitive(`double-ratchet-${userId}`)
    if (!instance) {
        throw Error(`No double ratchet found was persisted for user ${userId}`)
    }
    return instance as DoubleRatchet
}

export async function setDoubleRatchetForUser(userId: string, ratchet: DoubleRatchet) {
    await appData.setSensitive(`double-ratchet-${userId}`, ratchet)
}
