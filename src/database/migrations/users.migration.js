const schema = require('../../module/users/schema')

class UsersMigration {
  async up (db) {
    try {
      await db.createCollection('users', {
        validator: {
          $jsonSchema: schema
        }
      })

      await db.collection('users').createIndex({ username: -1 }, { unique: true })
      await db.collection('users').createIndex({ email: -1 }, { unique: true })
    } catch (error) {
      throw new Error(error)
    }
  }

  async down (db) {
    try {
      await db.collection('users').drop()
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new UsersMigration()
