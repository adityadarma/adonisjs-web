import { defineConfig } from '@adityadarma/adonis-database-cryptable/define_config'
import env from '#start/env'

const cryptableConfig = defineConfig({
  key: env.get('APP_KEY'),
  default: 'postgres',
  drivers: [
    'mysql',
    'postgres',
  ]
})
export default cryptableConfig
