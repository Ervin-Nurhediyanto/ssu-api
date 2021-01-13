const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
const databaseConnection = require('../../database/connection')
let server

chai.use(chaiHttp)

describe('Endpoint Employee Value', function () {
  let token
  let project
  let location
  let employee
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
      jobValue: 350,
      unitValue: (3100000 / 350)
    })

    // insert employee
    employee = await databaseConnection.getDatabase().collection('employees').insertOne({
      name: 'emloyee001',
      location: location.ops[0].location,
      totalScore: 0,
      salary: 0,
      idProject: project.ops[0]._id,
      idLocation: location.ops[0]._id
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
  describe('POST /v1/employee-values', function () {
    it('it should insert employee value', function (done) {
      chai
        .request(server)
        .post('/v1/employee-values')
        .set({ Authorization: `Bearer ${token}` })
        .send({
          idEmployee: employee.ops[0]._id
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
            expect(res.body.created.nameEmployee).equal('emloyee001')
            done()
          }
        })
    })
  })
  describe('GET /v1/employee-values', function () {
    it('it should list employee value', function (done) {
      chai
        .request(server)
        .get('/v1/employee-values')
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
  describe('GET /v1/employee-values/:id', function () {
    it('it should detail employee value', function (done) {
      chai
        .request(server)
        .get('/v1/employee-values/' + id)
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
  describe('PUT /v1/employee-values/:id', function () {
    it('it should update employee value', function (done) {
      chai
        .request(server)
        .put('/v1/employee-values/' + id)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          nameCreator: 'demoCreator',
          group: 'group001',
          name: 'criteria004',
          scoreFactor: 8,
          periode: '5/12/2020 - 5/1/2021'
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
  describe('DELETE /v1/employee-values/:id', function () {
    it('it should delete employee value', function (done) {
      chai
        .request(server)
        .delete('/v1/employee-values/' + id)
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
  describe('ERROR POST /v1/employee-values', function () {
    it('it should insert error employee value', function (done) {
      chai
        .request(server)
        .post('/v1/employee-values')
        .set({ Authorization: `Bearer ${token}` })
        .send({
          idEmployee: '5fe80fc08fe5ab0e34832bff' // id invalid
        })
        .end((err, res) => {
          if (err) {
            done()
          } else {
            // expect response status
            expect(res).to.have.status(500)
            // expect response data
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.property('error')
            done()
          }
        })
    })
  })
})
