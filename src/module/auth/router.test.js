const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
const databaseConnection = require('../../database/connection')
let server

chai.use(chaiHttp)
describe('Endpoint Auth', function () {
  before(async function () {
    delete require.cache[require.resolve('../../../server')]
    server = require('../../../server')
    await databaseConnection.connect()
    databaseConnection.getDatabase().dropDatabase()
  })
  after(async function () {
    await databaseConnection.close()
    server.close()
  })
  describe('GET /v1/auth/register', function () {
    it('it should register user', function (done) {
      chai
        .request(server)
        .post('/v1/auth/register')
        .send({
          username: 'johndoe',
          email: 'johndoe@gmail.com',
          password: 'secret'
        })
        .end((err, res) => {
          if (err) {
            done()
          } else {
            // expect response status
            expect(res).to.have.status(201)
            // expect response data
            done()
          }
        })
    })
  })
  describe('GET /v1/auth/login', function () {
    it('it should authenticate user', function (done) {
      chai
        .request(server)
        .post('/v1/auth/login')
        .send({
          username: 'johndoe',
          password: 'secret'
        })
        .end((err, res) => {
          if (err) {
            done()
          } else {
            // expect response status
            expect(res).to.have.status(200)
            // expect response data
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.property('data')
            done()
          }
        })
    })
  })
  describe('GET /v1/auth/secret', function () {
    it('it should authorized user token', function (done) {
      chai
        .request(server)
        .get('/v1/auth/secret')
        .send({
          token: 'wrong-secret-token'
        })
        .end((err, res) => {
          if (err) {
            done()
          } else {
            // expect response status
            expect(res).to.have.status(401)
            // expect(res.body.data.message).to.equal('Unauthorized')
            done()
          }
        })
    })
  })
  describe('Error GET /v1/auth/login', function () {
    it('it should Unauthenticated user', function (done) {
      chai
        .request(server)
        .post('/v1/auth/login')
        .send({
          username: 'johndoe',
          // invalid password
          password: 'secret123'
        })
        .end((err, res) => {
          if (err) {
            done()
          } else {
            // expect response status
            expect(res).to.have.status(401)
            // expect response data
            expect(res.body).to.be.a('object')
            done()
          }
        })
    })
  })
})
