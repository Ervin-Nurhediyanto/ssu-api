module.exports = {
  bsonType: 'object',
  properties: {
    location: {
      bsonType: 'string',
      description: 'must be a string and is required'
    },
    minimumWage: {
      bsonType: 'number',
      description: 'must be a number and is required'
    },
    jobValue: {
      bsonType: 'number',
      description: 'must be a number'
    },
    unitValue: {
      type: 'number',
      description: 'must be a number'
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
