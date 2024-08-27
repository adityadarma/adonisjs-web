/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')

router.get('/google/redirect', ({ ally }) => {
  return ally.use('google').redirect()
})

router.get('/:provider/redirect', ({ ally, params }) => {
  const driverInstance = ally.use(params.provider)
  console.log(driverInstance)
}).where('provider', /google/)
