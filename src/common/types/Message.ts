export interface Message {
  id: string
  sender: string
  receiver: string
  content: string
  timestamp: Date
}

export interface BasicMessage {
  receiver: string
  content: string
}
