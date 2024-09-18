import { defineConfig } from '@adityadarma/adonis-datatables'
import LucidDataTable from '@adityadarma/adonis-datatables/lucid_datatable'
import DatabaseDataTable from '@adityadarma/adonis-datatables/database_datatable'

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
    // object: ObjectDataTable,
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


/**
 * Inferring types for the list of storage you have configured
 * in your application.
 */
declare module '@adityadarma/adonis-datatables/types' {
  export interface DatatablesLists extends InferDatatablesProviders<typeof datatablesConfig> {}
}
