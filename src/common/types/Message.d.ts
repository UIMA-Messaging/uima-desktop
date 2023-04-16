export interface Message {
	id?: string
	channelId: string
	sender?: string
	receiver?: string
	content?: string
	timestamp?: Date
}
