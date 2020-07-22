const express = require('express')
const router = express.Router();
const Orden = require('../controllers/conekta.controller')

router.route('/charge').post(Orden.create)
router.route('/plan').post(Orden.plan)

module.exports = router;