const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
const databaseConnection = require('../../database/connection')
let server

chai.use(chaiHttp)

describe('Endpoint Projects', function () {
  let token
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
            token = res.body.data.access_token
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
  describe('POST /v1/projects', function () {
    it('it should insert project', function (done) {
      chai
        .request(server)
        .post('/v1/projects')
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: 'Project009'
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
  describe('GET /v1/projects', function () {
    it('it should list project', function (done) {
      chai
        .request(server)
        .get('/v1/projects')
        .set({ Authorization: `Bearer ${token}` })
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
  describe('GET /v1/projects/:id', function () {
    it('it should detail project', function (done) {
      chai
        .request(server)
        .get('/v1/projects/' + id)
        .set({ Authorization: `Bearer ${token}` })
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
  describe('PUT /v1/projects', function () {
    it('it should update project', function (done) {
      chai
        .request(server)
        .put('/v1/projects/' + id)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: 'Project001'
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
  describe('DELETE /v1/projects', function () {
    it('it should insert project', function (done) {
      chai
        .request(server)
        .delete('/v1/projects/' + id)
        .set({ Authorization: `Bearer ${token}` })
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
