var express = require('express');
const multer=require('../middleware/multter')
var router = express.Router();
const {session}=require('../middleware/userChecking')
const {home,getsignup,getShop,postSignup,getLogin,postLogin,getPhone,getOtp,postNumber,verifyOtp,productDetails,addToCart}=require('../controller/user')
/* GET users listing. */

router.get('/',home) 
router.get('/signup',getsignup)
router.get('/shop',getShop)  
router.post('/signup',postSignup)
router.get('/login',getLogin)
router.post('/login',postLogin)
router.get('/phone',getPhone)
router.get('/otp',getOtp)
router.post('/otp',postNumber)
router.post('/verifyotp',verifyOtp)
router.get('/productDetails',productDetails)
router.post('/cart',session,addToCart)



module.exports = router;
