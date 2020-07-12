const express = require('express')
const router = express.Router();

const service = require('../services')
const isAdmin = require('../middleware/isadmin')
const Product = require('../controllers/product.controller')
const {upload} = require('../services/upload-img')


router.route('/').get(Product.all)  
router.route('/all/:nameBusiness').get(Product.viewPerUser)
router.route('/one/:id').get(Product.viewOne)
router.route('/update/:id').put(upload.single('images'), Product.edit)
router.route('/:idProduct/:idUser').delete(Product.destroy)
router.route('/register/:idUser').post(upload.single('images'), Product.register)
router.route('/imgedit/:idProduct').post(upload.single('images'), Product.editImg)
router.route('/status/:idProduct').put(upload.single('images'), Product.changeStatus)



module.exports = router;