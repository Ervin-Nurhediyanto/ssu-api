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
    salaryEstimation: {
      bsonType: 'number',
      description: 'must be a number'
    },
    salary: {
      type: 'number',
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
