module.exports = {
  bsonType: 'object',
  properties: {
    idEmployee: {
      type: 'string',
      description: 'must be a string and is required'
    },
    idLocation: {
      type: 'string',
      description: 'must be a string and is required'
    },
    nameEmployee: {
      bsonType: 'string',
      description: 'must be a string and is required'
    },
    periodeFrom: {
      bsonType: 'date',
      description: 'must be a date and is required'
    },
    periodeTo: {
      bsonType: 'date',
      description: 'must be a date and is required'
    },
    total: {
      bsonType: 'number',
      description: 'must be a number'
    },
    salary: {
      type: 'number',
      description: 'must be a number'
    },
    nameCreator: {
      type: 'string',
      description: 'must be a string and is required'
    },
    factors: {
      type: 'object',
      description: 'must be a object'
    },
    status: {
      type: 'string',
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
