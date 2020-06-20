const express = require('express')
const router = express.Router();

const service = require('../services')
const isAdmin = require('../middleware/isadmin')
const Product = require('../controllers/product.controller')


router.route('/').get(Product.all)
router.route('/:id').get(Product.viewOne)
router.route('/update/:id').put(Product.edit)
router.route('/:id').delete(Product.destroy)
router.route('/register').post(Product.register)



module.exports = router;