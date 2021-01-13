const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const passport = require('passport')
require('../../util/passport')
const datalize = require('datalize')
const field = datalize.field

router.post('/login', passport.authenticate('local', { session: false }), controller.login)

router.post('/register', datalize([
  field('email').required().email(),
  field('username').required(),
  field('password').required()
]), controller.register)

// test jwt
router.get('/secret', passport.authenticate('jwt', { session: false }), controller.secret)

module.exports = router
