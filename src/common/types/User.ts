import { KeyBundle } from './Keys'

export interface User {
  id: string
  displayName: string
  username: string
  image: string
  joinedAt: Date
  editedAt?: Date
}

export interface BasicUser {
  displayName: string
  image: string
  keyBundle?: KeyBundle
}
