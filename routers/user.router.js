const express = require('express')
const router = express.Router();

const service = require('../services')
const isAuth = require('../middleware/isauth')
const isAdmin = require('../middleware/isadmin')
const User = require('../controllers/user.controller')
const { upload } = require('../services/upload-img')


router.route('/').get(User.all)
router.route('/:id').get(User.viewOne)
router.route('/update/:id').put( User.edit)
router.route('/:id').delete( User.destroy)
router.route('/register').post(User.register)
router.route('/login').post(User.login)
router.route('/emailpassreset').post(User.sendEmailPassReset)
router.route('/passwordreset/:token').post(User.passReset)
router.route('/updategeneraldata/:idUser').put(upload.any([{ name: 'logo', maxCount: 1 }, { name: 'coverImg', maxCount: 1 }, { name: 'promotionalImg', maxCount: 1 }]), User.updateGeneralData)
router.route('/generaldata/:nameBusiness').get(User.generalData)



module.exports = router;