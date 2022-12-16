const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/products.controller')
const HomeController = require('../controllers/home.controller')
const AuthController = require('../controllers/auth.controller')

const validation = require('../middleware/validation-middleware');

router.post('/file', HomeController.fileUpload);
router.get('/file/:filename', HomeController.fileRetrive)

router.post('/user/register',validation.register, AuthController.register)
router.post('/user/login',validation.loginUser,AuthController.login)
router.get('/user',validation.checkAuthentication,AuthController.auth_user)
router.patch('/user/:id',validation.updateProfile,AuthController.updateProfile)

router.get('/product',validation.checkAuthentication,ProductController.index)
router.get('/product/:id',validation.checkAuthentication,ProductController.getOne)
router.post('/product/addImage/:id',validation.checkAuthentication,ProductController.addProductImage)
router.delete('/product/removeImage/:id',validation.checkAuthentication,ProductController.removeProductImage)
router.post('/product',validation.checkAuthentication,ProductController.store)
router.patch('/product/:id',validation.checkAuthentication,ProductController.update)
router.delete('/product/:id',validation.checkAuthentication,ProductController.remove)

module.exports = router
