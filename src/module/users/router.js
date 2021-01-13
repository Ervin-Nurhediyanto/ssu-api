const express = require('express')
const router = express.Router()
const controller = require('./controllers')

router.get('/', controller.get)

router.get('/:id', controller.find)

router.post('/', controller.insert)

router.put('/:id', controller.update)

router.delete('/:id', controller.delete)

module.exports = router
