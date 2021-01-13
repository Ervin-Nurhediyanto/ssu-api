const users = require('./migrations/users.migration')
const employees = require('./migrations/employees.migration')
const locations = require('./migrations/locations.migration')
const projects = require('./migrations/projects.migration')

class DatabaseMigration {
  async up (db) {
    try {
      await db.createCollection('migration')
      await users.up(db)
      await employees.up(db)
      await locations.up(db)
      await projects.up(db)
    } catch (error) {
      throw new Error(error)
    }
  }

  async down (db) {
    try {
      await projects.down(db)
      await locations.down(db)
      await employees.down(db)
      await users.down(db)
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new DatabaseMigration()
