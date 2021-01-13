const schema = require('../../module/employees/schema')

class EmployeesMigration {
  async up (db) {
    try {
      await db.createCollection('employees', {
        validator: {
          $jsonSchema: schema
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  async down (db) {
    try {
      await db.collection('employees').drop()
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new EmployeesMigration()
