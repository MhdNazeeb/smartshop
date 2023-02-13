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
  removeCart
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

module.exports = router;
