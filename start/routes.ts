/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import datatables from '@adityadarma/adonis-datatables/datatables'
import Transaction from '#models/transaction'
import LucidDataTable from '@adityadarma/adonis-datatables/lucid_datatable'
import User from '#models/user'

router.on('/').render('pages/home')

router.get('/google/redirect', ({ ally }) => {
  return ally.use('google').redirect()
})

router.get('/:provider/redirect', ({ ally, params }) => {
  const driverInstance = ally.use(params.provider)
  console.log(driverInstance)
}).where('provider', /google/)

router.get('/transaction', async({view}) => {
  return view.render('transaction')
})

router.get('/transaction/datatables', async () => {
  return await datatables.of<LucidDataTable>(Transaction.query().preload('user'))
    .addIndexColumn()
    .editColumn('amount', (row: Transaction) => {
      return row.amountFormat
    })
    .toJson()
})

router.get('/user', async({view}) => {
  return view.render('user')
})

router.get('/user/datatables', async () => {
  return await datatables.of<LucidDataTable>(User.query().preload('transaction'))
    .addIndexColumn()
    .editColumn('transaction.code', (row: User) => {
      return 'www'
    })
    .toJson()
})
