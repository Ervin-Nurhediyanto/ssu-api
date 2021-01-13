const schema = require('../../module/locations/schema')

class LocationsMigration {
  async up (db) {
    try {
      await db.createCollection('locations', {
        validator: {
          $jsonSchema: schema
        }
      })

      await db.collection('locations').createIndex({ location: -1 }, { unique: true })
    } catch (error) {
      throw new Error(error)
    }
  }

  async down (db) {
    try {
      await db.collection('locations').drop()
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new LocationsMigration()
