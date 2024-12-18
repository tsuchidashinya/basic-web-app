import { LIMIT_DEFAULT } from '@/const/common'
import fetchAll from '@/utils/fetchAll'
import { IUserRepository } from '../IUserRepository'
import Password from '../value/password'
import UserName from '../value/userName'

class UserService {
  repository: IUserRepository
  constructor(repository: IUserRepository) {
    this.repository = repository
  }
  async existFromAuthAttribute(userName: UserName, password: string) {
    const sameNameUsers = await fetchAll(async (offset: number) => {
      const response = await this.repository.fetchUsers(offset, LIMIT_DEFAULT, {
        userName: userName,
      })
      return {
        total: response.total,
        offset: response.offset,
        list: response.list,
      }
    })
    return sameNameUsers.find((fetchedUser) => {
      const comparedPassword = new Password(password, fetchedUser.password.salt)
      return fetchedUser.password.value === comparedPassword.encrypt()
    })
  }
  async exist(userId: string) {
    const user = this.repository.fetchUser(userId)
    if (user === undefined) {
      return false
    }
    return true
  }
}

export default UserService
