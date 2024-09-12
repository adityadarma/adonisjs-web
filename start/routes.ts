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

router.on('/').render('pages/home')

router.get('/google/redirect', ({ ally }) => {
  return ally.use('google').redirect()
})

router.get('/:provider/redirect', ({ ally, params }) => {
  const driverInstance = ally.use(params.provider)
  console.log(driverInstance)
}).where('provider', /google/)

router.get('/demo', async({view}) => {
  return view.render('datatable')
})

router.get('/datatables', async () => {
  return await datatables.of<LucidDataTable>(Transaction.query().join('user', 'user.id', 'transaction.user_id'))
    .addIndexColumn()
    .editColumn('amount', (row: Transaction) => {
      return row.amountFormat
    })
    .make(true)
})
