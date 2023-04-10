import '../styles/PopupForm'
import '../styles/AddContact'
import { useEffect, useRef, useState } from 'react'
import Plus from '../assets/Plus'
import Close from '../assets/Close'
import { useForm } from 'react-hook-form'
import { User } from '../../common/types'
import Notification from './Notification'

export default () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm()
  const input = useRef(null)
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string>()
  const [user, setUser] = useState<User>()

  useEffect(() => {
    if (show) {
      setUser(null)
    } else {
      setError(null)
    }
  }, [show])

  useEffect(() => {
    if (user) {
      setShow(false)
      setError(null)
    }
  }, [user])

  function onClick({ username }: { username: string }) {
    window.electron.contactUser(username).then((result) => {
      if (typeof result === 'string') {
        setError(result)
      } else {
        setUser(result)
      }
    })
  }

  return (
    <>
      <div className="profile add-friend" onClick={() => setShow(true)}>
        <Plus />
      </div>
      {show && (
        <>
          <div className="popup-wrapper">
            <div className="popup-close" onClick={() => setShow(false)}>
              <Close />
            </div>
            <form onSubmit={handleSubmit(onClick)}>
              <h2>Add a friend to your contacts list</h2>
              <p>Make sure to include the number next to the display name separeted by a '#'.</p>
              {error && <p className="registration-error">{error}</p>}
              {errors.username?.type === 'required' && <p className="validation-error">Empty field!</p>}
              {errors.username?.type === 'pattern' && <p className="validation-error">Invalid format</p>}
              <input className="popup-input" placeholder="username#0001" {...register('username', { required: true, pattern: /\w+#\d+/ })} />
              <input className="popup-button" ref={input} type="submit" value="Add contact" />
              <p className="popup-disclaimer">You won't be able to send any messages until the recipient has accepted invite.</p>
            </form>
          </div>
          <div className="popup-cover" onClick={() => setShow(false)} />
        </>
      )}
      {user && <Notification text={'Invite sent to ' + user.displayName} />}
    </>
  )
}
