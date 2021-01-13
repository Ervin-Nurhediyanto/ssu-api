const MongoClient = require('mongodb').MongoClient
const migrate = require('./migrate')
const database = require('../config/database')
class DatabaseConnection {
  constructor () {
    let uri = ''
    if (process.env.NODE_ENV === 'production') {
      uri = `mongodb+srv://${database.username}:${database.password}@${database.host}/${database.name}?retryWrites=true&w=majority`
      this.client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    } else if (process.env.NODE_ENV === 'development') {
      uri = 'mongodb://localhost:27017'
      this.client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    } else if (process.env.NODE_ENV === 'test') {
      uri = 'mongodb://localhost:27017'
      this.client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    }
  }

  async connect () {
    try {
      const uri = 'mongodb://localhost:27017'
      this.client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })

      console.log('connecting to database cluster')
      const isConnected = await this.client.isConnected()
      if (!isConnected) {
        await this.client.connect()

        if (process.env.NODE_ENV === 'test') {
          database.name += '-test'
        }

        console.log('connecting to database ' + database.name)
        this.db = this.client.db(database.name)

        const migrationCount = await this.db.listCollections().toArray()
        if (migrationCount <= 1) {
          await migrate.up(this.db)
        }
        console.log('database connection established')
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async close () {
    await this.client.close()
  }

  async refresh () {
    try {
      await migrate.down(this.db)
      await migrate.up(this.db)
    } catch (error) {
      throw new Error(error)
    }
  }

  getDatabase () {
    return this.db
  }
}

module.exports = new DatabaseConnection()
