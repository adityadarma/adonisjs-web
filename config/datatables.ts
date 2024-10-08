import { defineConfig } from '@adityadarma/adonis-datatables'
import LucidDataTable from '@adityadarma/adonis-datatables/engines/lucid_datatable'
import DatabaseDataTable from '@adityadarma/adonis-datatables/engines/database_datatable'
import ObjectDataTable from '@adityadarma/adonis-datatables/engines/object_datatable'

const datatablesConfig = defineConfig({
  debug: true,
  search: {
    smart: true,
    multi_term: true,
    case_insensitive: true,
    use_wildcards: false,
    starts_with: false,
  },
  index_column: 'DT_RowIndex',
  engines: {
    lucid: LucidDataTable,
    database: DatabaseDataTable,
    object: ObjectDataTable,
  },
  columns: {
    excess: ['rn', 'row_num'],
    escape: '*',
    raw: ['action'],
    blacklist: ['password', 'remember_token'],
    whitelist: '*',
  },
  json: {
    header: [],
  },
})
export default datatablesConfig
