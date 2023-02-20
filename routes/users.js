var express = require("express");
const multer = require("../middleware/multter");
var router = express.Router();
const { axiosSession } = require("../middleware/axiosSessionUser");
const { session } = require("../middleware/userChecking");
const {
  home,
  getsignup,
  getShop,
  postSignup,
  getLogin,
  postLogin,
  getPhone,
  getOtp,
  postNumber,
  verifyOtp,
  productDetails,
  addToCart,
  getCart,
  changeQty,
  removeCart,
  wishListget,
  addTOWishList,
  wishListFind,
  removeFromWish,
  checkout,
  addAddress,
  deleteAddress,
  editeAddress,
  showddress,
  aaplyCoupon


} = require("../controller/user");
/* GET users listing. */

router.get("/", home);
router.get("/signup", getsignup);
router.get("/shop", getShop);
router.post("/signup", postSignup);
router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/phone", getPhone);
router.get("/otp", getOtp);
router.post("/otp", postNumber);
router.post("/verifyotp", verifyOtp);
router.get("/productDetails", productDetails);
router.get("/cart", axiosSession, addToCart);
router.get("/cartList", session, getCart);
router.patch('/incriment',axiosSession,changeQty)
router.delete('/cart',removeCart)
router.get('/wishList',session,wishListget)
router.delete('/wishPro',removeFromWish)
router.post('/wishList',axiosSession,addTOWishList)
router.get("/wish",session,wishListFind );
router.get("/checkout",session,checkout );
router.post("/address",session,addAddress );
router.delete('/address',deleteAddress)
router.patch('/address',editeAddress)
router.get("/address",showddress );
router.post("/coupon",session,aaplyCoupon);


module.exports = router;
