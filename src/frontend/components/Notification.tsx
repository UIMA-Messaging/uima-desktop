import '../styles/Notification'

export default function Notification({ text, type }: { text: string; type?: string }) {
  return <div className={`notification-wrapper type-${type}`}>{text}</div>
}
