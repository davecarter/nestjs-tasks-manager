import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './user.repository'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return await this.userRepository.signUp(authCredentialsDto)
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const validation = await this.userRepository.validateUserPassword(
      authCredentialsDto
    )
    if (!validation) throw new UnauthorizedException('Invalid credentials')
  }
}
