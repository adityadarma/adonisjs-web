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
import LucidDataTable from '@adityadarma/adonis-datatables/engines/lucid_datatable'
import User from '#models/user'
import logger from '@adonisjs/core/services/logger'

router.on('/').render('pages/home')
router.get('/logger', async () => {
  logger.use('slack').info('Testttt')
  return 200
})

router.get('/encrypt', async () => {
  // const user = await User.create({
  //   name: 'aditya',
  //   email: 'fdfdfgdg',
  //   password: 'yerytru'
  // })
  const user = await User.query().orderByEncrypted('name').first()
  console.log(user)
  return 200
})

router.get('/google/redirect', ({ ally }) => {
  return ally.use('google').redirect()
})

router.get('/:provider/redirect', ({ ally, params }) => {
  const driverInstance = ally.use(params.provider)
  console.log(driverInstance)
}).where('provider', /google/)

router.get('/lucid', async({view}) => {
  return view.render('lucid')
})

router.get('/lucid/datatables', async (ctx: HttpContext) => {
  const transactions = Transaction.query().preload('user')
  return await datatables.of<LucidDataTable>(transactions)
    .setContext(ctx)
    .addIndexColumn()
    .addColumn('user_name', (row: Transaction) => {
      return row.user.name
    })
    .addColumn('intro', (row: Transaction) => {
      return ctx.view.renderSync('text', {code: row.code})
    })
    .rawColumns(['intro'])
    .results()
})

router.get('/object', async({view}) => {
  return view.render('object')
})

router.get('/object/datatables', async (ctx: HttpContext) => {
    const transactions = await Transaction.query().preload('user')
    return await Datatables.object(transactions)
      .setContext(ctx)
      .addIndexColumn()
      .addColumn('count_transactions', 0)
      .addColumn('intro', (row: Transaction) => {
        return ctx.view.renderSync('text', {code: row.code})
      })
      .rawColumns(['intro'])
      .results()
})

router.get('/datatabse', async({view}) => {
  return view.render('datatabse')
})

router.get('/datatabse/datatables', async (ctx: HttpContext) => {
  const users = db.from('users').select('*', db.raw("CONCAT(users.name,' ',users.email) as fullname"))
  return await datatables.of<DatabaseDataTable>(users)
    .setContext(ctx)
    .addIndexColumn()
    // .setRowId((user) => {
    //   return user.id
    // })
    .setRowId('{{id}}')
    // .setRowClass((user) => {
    //   return user.id % 2 == 0 ? 'alert-success' : 'alert-warning';
    // })
    .setRowClass('{{ id % 2 == 0 ? "alert-success" : "alert-warning" }}')
    // .setRowData({
    //   'data-id': (user) => {
    //       return 'row-' + user.id;
    //   },
    //   'data-name': (user) => {
    //       return 'row-' + user.name;
    //   },
    // })
    .setRowData({
      'data-id': 'row-{{id}}',
      'data-name': 'row-{{name}}',
    })
    .addColumn('count_transactions', (row: Record<string, any>) => {
      return row.name
    })
    .editColumn('name', (row: Record<string, any>) => {
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
    .results()
})
