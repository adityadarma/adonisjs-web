import vine from '@vinejs/vine'

export const test = vine
.compile(
  vine.object({
    name: vine.string(),
    email: vine.string().unique(async (db, value, field) => {
      console.log(db, value, field)
      const user = await db
        .from('users')
        .whereEncrypted('email', value)
        .first()
      return !user
    }),
    password: vine.string()
  })
)
