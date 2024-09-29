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
// import LucidDataTable from '@adityadarma/adonis-datatables/engines/lucid_datatable'
import DatabaseDataTable from '@adityadarma/adonis-datatables/engines/database_datatable'
// import ObjectDatatable from '@adityadarma/adonis-datatables/engines/object_datatable'
// import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
// import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { HttpContext } from '@adonisjs/core/http'
// import collect from 'collect.js'
import Datatables from '../packages/adonis-datatables/build/src/datatables.js'
import { DatabaseQueryBuilder } from '@adonisjs/lucid/database'

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

router.get('/transaction/datatables', async (ctx: HttpContext) => {
  // const transactions = Transaction.query().preload('user')
  // return await datatables.of<LucidDataTable>(transactions)
  //   .setContext(ctx)
  //   .addIndexColumn()
  //   .addColumn('amount', (row: Transaction) => {
  //     return row.amountFormat
  //   })
  //   .toJson()

    const transactions = await Transaction.query().preload('user')
    return await Datatables.object(transactions)
      .setContext(ctx)
      .addIndexColumn()
      .addColumn('count_transactions', 0)
      .addColumn('intro', (row: Transaction) => {
        return ctx.view.renderSync('text', {code: row.code})
      })
      .rawColumns(['intro'])
      .toJson()
})

router.get('/user', async({view}) => {
  return view.render('user')
})

router.get('/user/datatables', async (ctx: HttpContext) => {
  const users = db.from('users').select('*', db.raw("CONCAT(users.name,' ',users.email) as fullname"))
  return await datatables.of<DatabaseDataTable>(users)
    .setContext(ctx)
    .addIndexColumn()
    .addColumn('count_transactions', (row: Record<string, any>) => {
      return row.name
    })
    .orderColumn('name', 'name $1')
    .orderColumn('fullname', (query: DatabaseQueryBuilder, direction: string) => {
      query.orderBy('name', direction)
    })
    .filterColumn('fullname', (query: DatabaseQueryBuilder, keyword: string) => {
      query.orWhereRaw("CONCAT(users.name,' ',users.email)  like ?", [`%${keyword}%`])
    })
    // .filter((query: ModelQueryBuilder) => {
    //   query.where('name', 'like', "%adit%");
    // })
    .toJson()
})
