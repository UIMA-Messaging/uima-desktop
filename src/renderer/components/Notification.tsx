import '../styles/Notification'

export default ({ text, type }: { text: string; type?: string }) => {
	return <div className={`notification-wrapper type-${type} notification-animation`}>{text}</div>
}
