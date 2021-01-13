const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const verifyAccess = require('../../middleware/auth.middleware')

router.get('/', verifyAccess, controller.get)

router.get('/:id', verifyAccess, controller.find)

router.post('/', verifyAccess, controller.insert)

router.put('/:id', verifyAccess, controller.update)

router.delete('/:id', verifyAccess, controller.delete)

module.exports = router
