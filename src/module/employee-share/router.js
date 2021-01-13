const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const verifyAccess = require('../../middleware/auth.middleware')

router.get('/', controller.get)

router.get('/:id', controller.find)

router.post('/', verifyAccess, controller.insert)

router.put('/:id', controller.update)

router.delete('/:id', verifyAccess, controller.delete)

module.exports = router
