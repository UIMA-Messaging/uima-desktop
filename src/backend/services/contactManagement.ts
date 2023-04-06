import { User } from '../../common/types'
import { contact } from '../clients/contactClient'

export default class ContactManagament {
  public onBehalf: User

  public setOnBehalf(user: User) {
    this.onBehalf = user
  }

  public async inviteForDM(username: string) {
    const user = await contact(username)
  }
}
