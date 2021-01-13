module.exports = {
  bsonType: 'object',
  properties: {
    name: {
      bsonType: 'string',
      description: 'must be a string and is required'
    },
    created_by: {
      bsonType: 'string',
      description: 'must be a string and is required'
    },
    created_at: {
      bsonType: 'date',
      description: 'must be a date'
    }
  }
}
