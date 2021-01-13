module.exports = {
  bsonType: 'object',
  properties: {
    name: {
      bsonType: 'string',
      description: 'must be a string and is required'
    },
    location: {
      bsonType: 'string',
      description: 'must be a string and is required'
    },
    total: {
      bsonType: 'number',
      description: 'must be a number'
    },
    salary: {
      bsonType: 'number',
      description: 'must be a number'
    },
    idProject: {
      bsonType: 'string',
      description: 'must be a string and is required'
    },
    idLocation: {
      bsonType: 'string',
      description: 'must be a string'
    },
    createdBy: {
      bsonType: 'string',
      description: 'must be a string and is required'
    },
    createdAt: {
      bsonType: 'date',
      description: 'must be a date'
    }
  }
}
