const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
const databaseConnection = require('../../database/connection')
let server

chai.use(chaiHttp)

describe('Endpoint Employees', function () {
  let token
  let project
  let location
  let id
  before(async function () {
    delete require.cache[require.resolve('../../../server')]
    server = require('../../../server')
    await databaseConnection.connect()
    databaseConnection.getDatabase().dropDatabase()

    // insert project
    project = await databaseConnection.getDatabase().collection('projects').insertOne({
      name: 'project002',
      jobValue: [
        {
          group: 'group001',
          factors: [
            {
              name: 'criteria004',
              level: [
                {
                  level: 3,
                  description: 'S1',
                  score: 7.56
                }
              ]
            }
          ]
        }
      ]
    })

    // insert location
    location = await databaseConnection.getDatabase().collection('locations').insertOne({
      location: 'SURABAYA',
      minimumWage: 3100000,
      jobValue: 350
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
  describe('POST /v1/employees', function () {
    it('it should insert employee', function (done) {
      chai
        .request(server)
        .post('/v1/employees')
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: 'emloyee001',
          idProject: project.ops[0]._id,
          idLocation: location.ops[0]._id
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
            expect(res.body.created.location).equal('SURABAYA')
            done()
          }
        })
    })
  })
  describe('GET /v1/employees', function () {
    it('it should list employee', function (done) {
      chai
        .request(server)
        .get('/v1/employees')
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
  describe('GET /v1/employees/:id', function () {
    it('it should detail employee', function (done) {
      chai
        .request(server)
        .get('/v1/employees/' + id)
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
  describe('PUT /v1/employees', function () {
    it('it should update employee', function (done) {
      chai
        .request(server)
        .put('/v1/employees/' + id)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: 'emloyee009',
          idProject: '5fe80fc08fe5ab0e34832bff',
          idLocation: location.ops[0]._id
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
            expect(res.body.updated.name).equal('emloyee009')
            done()
          }
        })
    })
  })
  describe('DELETE /v1/employees', function () {
    it('it should insert employee', function (done) {
      chai
        .request(server)
        .delete('/v1/employees/' + id)
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
  describe('ERROR POST /v1/employees', function () {
    it('it should error insert employee', function (done) {
      chai
        .request(server)
        .post('/v1/employees')
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: '', // name is null
          idProject: project.ops[0]._id,
          idLocation: location.ops[0]._id
        })
        .end((err, res) => {
          if (err) {
            done()
          } else {
            // expect response status
            expect(res).to.have.status(403)
            // expect response data
            expect(res.body).to.have.property('message')
            expect(res.body.message).equal('Cannot be empty')
            done()
          }
        })
    })
  })
  describe('Error GET /v1/employees/:id', function () {
    it('it should error detail employee', function (done) {
      chai
        .request(server)
        // invalid id
        .get('/v1/employees/' + '5fed0e5ec2f9513868ed1616')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          if (err) {
            done()
          } else {
            // expect response status
            expect(res).to.have.status(404)
            // expect response data
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.property('message')
            expect(res.body.message).equal('Not Found')
            done()
          }
        })
    })
  })
})
