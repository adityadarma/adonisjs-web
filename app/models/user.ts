import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Transaction from './transaction.js'
import { Cryptable } from '@adityadarma/adonis-database-cryptable'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, Cryptable, AuthFinder) {
  $cryptable: string[] = ['name', 'email']

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare emailVerifiedAt: DateTime

  @column()
  declare password: string

  @column()
  declare validDateUntil: DateTime

  @column()
  declare isActive: boolean

  @column()
  declare lastLogin: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

}
