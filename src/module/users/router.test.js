const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
const databaseConnection = require('../../database/connection')
let server

chai.use(chaiHttp)

describe('Endpoint User', function () {
  let id
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
  describe('POST /v1/users', function () {
    it('it should insert user', function (done) {
      chai
        .request(server)
        .post('/v1/users')
        .send({
          name: 'demo',
          username: 'demoUser',
          email: 'demoUser@gmail.com',
          password: 'password'
        })
        .end((err, res) => {
          if (err) {
            done()
          } else {
            id = res.body.created._id
            // expect response status
            expect(res).to.have.status(201)
            // expect response data
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.property('created')
            done()
          }
        })
    })
  })
  describe('GET /v1/users', function () {
    it('it should list user', function (done) {
      chai
        .request(server)
        .get('/v1/users')
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
  describe('GET /v1/users/:id', function () {
    it('it should detail user', function (done) {
      chai
        .request(server)
        .get('/v1/users/' + id)
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
  describe('PUT /v1/users', function () {
    it('it should update user', function (done) {
      chai
        .request(server)
        .put('/v1/users/' + id)
        .send({
          name: 'demodemo',
          username: 'demomola',
          password: 'ganti',
          email: 'demola@gmail.com'
        })
        .end((err, res) => {
          if (err) {
            done()
          } else {
            // expect response status
            expect(res).to.have.status(200)
            // expect response data
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.property('updated')
            done()
          }
        })
    })
  })
  describe('DELETE /v1/users', function () {
    it('it should insert user', function (done) {
      chai
        .request(server)
        .delete('/v1/users/' + id)
        .end((err, res) => {
          if (err) {
            done()
          } else {
            // expect response status
            expect(res).to.have.status(200)
            // expect response data
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.property('deleted')
            done()
          }
        })
    })
  })
})
