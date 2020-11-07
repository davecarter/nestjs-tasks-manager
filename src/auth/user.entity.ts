import { hash } from 'bcrypt'
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Unique
} from 'typeorm'

@Entity()
@Unique(['username']) // Makes username unique at database validation level
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  salt: string

  async validatePassword(password: string): Promise<boolean> {
    const inputPassword = await hash(password, this.salt)
    return inputPassword === this.password
  }
}
