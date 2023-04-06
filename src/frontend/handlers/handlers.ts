import { Channel } from '../../common/types'

export async function isFirstRun(): Promise<boolean> {
  return await window.electron.isFirstTimeRunning()
}

export async function getAuthState(): Promise<'notRegistered' | 'loggedOut' | 'loggedIn'> {
  return await window.electron.authenticationStatus()
}

export function isAuthenticated(setState?: (state: string) => void): 'notRegistered' | 'loggedOut' | 'loggedIn' {
  let authState
  window.electron.onAuthenticationStatus((_, state) => {
    authState = state
    setState(state)
  })
  return authState
}

export async function getOnlineState(): Promise<boolean> {
  return await window.electron.isOnline()
}

export function isOnline(setState?: (state: boolean) => void): boolean {
  let isOnline
  window.electron.onOnline((_, result) => {
    isOnline = result
    setState(result)
  })
  return isOnline
}

export async function getChannels(): Promise<Channel[]> {
  return await window.electron.getChannels()
}
