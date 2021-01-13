module.exports = {
  bsonType: 'object',
  required: ['username', 'email', 'password'],
  properties: {
    username: {
      bsonType: 'string',
      minLength: 3,
      maxLength: 30,
      description: 'must be a string and is required'
    },
    email: {
      bsonType: 'string',
      description: 'must be a string and is required'
    },
    emailVerificationCode: {
      bsonType: 'string',
      description: 'must be a string'
    },
    emailVerified: {
      type: 'boolean',
      description: 'must be a boolean'
    },
    password: {
      bsonType: 'string',
      minLength: 8,
      maxLength: 255,
      description: 'must be a string and is required'
    },
    fname: {
      bsonType: 'string',
      description: 'must be a string'
    },
    lname: {
      bsonType: 'string',
      description: 'must be a string'
    },
    address: {
      bsonType: 'string',
      description: 'must be a string'
    },
    phone: {
      bsonType: 'string',
      description: 'must be a string'
    },
    phoneVerificationCode: {
      bsonType: 'string',
      description: 'must be a string'
    },
    phoneVerified: {
      type: 'boolean',
      description: 'must be a boolean'
    },
    status: {
      bsonType: 'string',
      enum: ['active', 'suspended'],
      description: 'must be a string between active or suspended'
    }
  }
}
