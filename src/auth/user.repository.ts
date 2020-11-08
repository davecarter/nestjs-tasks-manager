import { Repository, EntityRepository } from 'typeorm'
import { User } from './user.entity'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import { genSalt, hash } from 'bcrypt'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto

    const user = new User()
    user.salt = await genSalt()
    user.username = username
    user.password = await this.hashPassword(password, user.salt)

    try {
      await user.save()
    } catch (error) {
      // duplicated username error code
      if (error.code === '23505') {
        throw new ConflictException('User name already exists')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<string> {
    const { username, password } = authCredentialsDto
    const user = await this.findOne({ username })

    if (user && (await user.validatePassword(password))) {
      return user.username
    } else {
      return null
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return hash(password, salt)
  }
}
