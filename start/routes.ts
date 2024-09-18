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
import DatabaseDataTable from '@adityadarma/adonis-datatables/database_datatable'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { ModelQueryBuilder } from '@adonisjs/lucid/orm'

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

router.get('/user/datatables', async ({}) => {
  return await datatables.of<LucidDataTable>(User.query().preload('transactions').select('*', db.raw("CONCAT(users.name,' ',users.email) as fullname")))
    .addIndexColumn()
    .addColumn('count_transactions', (row: User) => {
      return row.transactions.length
    })
    // .orderColumn('name', 'name $1')
    .orderColumn('fullname', (query: ModelQueryBuilder, direction: string) => {
      query.orderBy('name', direction)
    })
    .filterColumn('fullname', (query: ModelQueryBuilder, keyword: string) => {
      query.orWhereRaw("CONCAT(users.name,' ',users.email)  like ?", [`%${keyword}%`])
    })
    // .filter((query: ModelQueryBuilder) => {
    //   query.where('name', 'like', "%adit%");
    // })
    .addColumn('intro', 'Hi {{name}}!')
    .toJson()

  return await datatables.of<DatabaseDataTable>(db.from('users'))
    .addIndexColumn()
    .addColumn('count_transactions', (row: Record<string, any>) => {
      console.log(row)
      return row.name
    })
    .toJson()
})
