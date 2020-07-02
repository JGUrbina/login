const express = require('express')
const router = express.Router();

const service = require('../services')
const isAdmin = require('../middleware/isadmin')
const Product = require('../controllers/product.controller')
const {upload} = require('../services/upload-img')


router.route('/').get(Product.all)  
router.route('/all/:idUser').get(Product.viewPerUser)
router.route('/one/:id').get(Product.viewOne)
router.route('/update/:id').put(Product.edit)
router.route('/:idProduct/:idUser').delete(Product.destroy)
router.route('/register/:idUser').post(upload, Product.register)
router.route('/imgedit/:idProduct').post(upload, Product.editImg)



module.exports = router;