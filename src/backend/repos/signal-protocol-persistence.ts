import { appData } from '../main'
import DoubleRatchet from '../security/double-ratchet'
import X3DH from '../security/x3dh'

export async function getX3DH(): Promise<X3DH> {
  const results = await appData.getFromLocal('x3dh')
  if (!results.length) {
    throw Error('No X3DH instance was persisted locally.')
  }
  return JSON.parse(results[0].json)
}

export async function setX3DH(x3dh: X3DH) {
  await appData.persistLocally('x3dh', x3dh)
}

export async function getDoubleRatchetByUser(userId: string) {
  const results = await appData.getFromLocal(`double-ratchet-${userId}`)
  if (!results.length) {
    throw Error(`No double ratchet found was persisted for user ${userId}`)
  }
  return JSON.parse(results[0].json)
}

export async function setDoubleRatchetForUser(userId: string, ratchet: DoubleRatchet) {
  await appData.persistLocally(`double-ratchet-${userId}`, ratchet)
}
