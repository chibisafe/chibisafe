const config = require('../config.js')
const db = require('knex')(config.database)

const migration = {}
migration.start = async () => {
  await db.schema.table('albums', table => {
    table.dateTime('editedAt')
    table.dateTime('zipGeneratedAt')
  }).catch(() => {})
  await db.schema.table('users', table => {
    table.integer('enabled')
  }).catch(() => {})
  console.log('Migration finished! Now start lolisafe normally')
  process.exit(0)
}

migration.start()
