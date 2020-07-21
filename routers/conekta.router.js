const express = require('express')
const router = express.Router();
const Orden = require('../controllers/conekta.controller')

router.route('/charge').post(Orden.create)

module.exports = router;