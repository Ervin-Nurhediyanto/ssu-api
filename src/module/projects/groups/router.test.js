const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
const databaseConnection = require('../../../database/connection')
let server

chai.use(chaiHttp)

describe('Endpoint Factor Group', function () {
  let token
  let project
  before(async function () {
    delete require.cache[require.resolve('../../../../server')]
    server = require('../../../../server')
    await databaseConnection.connect()
    databaseConnection.getDatabase().dropDatabase()

    // insert project
    project = await databaseConnection.getDatabase().collection('projects').insertOne({
      name: 'project002',
      jobValue: []
    })
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
  describe('POST /v1/factor-groups', function () {
    it('it should insert group value', function (done) {
      chai
        .request(server)
        .post('/v1/factor-groups')
        .set({ Authorization: `Bearer ${token}` })
        .send({
          idProject: project.ops[0]._id,
          group: 'group001'
        })
        .end((err, res) => {
          if (err) {
            done()
          } else {
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
  describe('GET /v1/factor-groups', function () {
    it('it should list group value', function (done) {
      chai
        .request(server)
        .get('/v1/factor-groups')
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
  describe('GET /v1/factor-groups/:id', function () {
    it('it should detail group value', function (done) {
      chai
        .request(server)
        .get('/v1/factor-groups/' + project.ops[0]._id)
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
  describe('PUT /v1/factor-groups', function () {
    it('it should update group value', function (done) {
      chai
        .request(server)
        .put('/v1/factor-groups/' + project.ops[0]._id)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          group: 'group002',
          oldGroup: 'group001'
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
  describe('DELETE /v1/factor-groups', function () {
    it('it should insert group value', function (done) {
      chai
        .request(server)
        .delete('/v1/factor-groups/' + project.ops[0]._id)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          group: 'group002'
        })
        .end((err, res) => {
          if (err) {
            done()
          } else {
            // expect response status
            expect(res).to.have.status(200)
            // expect response data
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.property('message')
            expect(res.body.message).equal('deleted successfully')
            done()
          }
        })
    })
  })
})
