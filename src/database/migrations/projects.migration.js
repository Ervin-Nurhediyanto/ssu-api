const schema = require('../../module/projects/schema')

class ProjectsMigration {
  async up (db) {
    try {
      await db.createCollection('projects', {
        validator: {
          $jsonSchema: schema
        }
      })

      await db.collection('projects').createIndex({ name: -1 }, { unique: true })
    } catch (error) {
      throw new Error(error)
    }
  }

  async down (db) {
    try {
      await db.collection('projects').drop()
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new ProjectsMigration()
