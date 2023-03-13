const express = require("express");
const multer = require("../middleware/multter");
const router = express.Router();
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
  verifyPayment,
  addAddress,
  deleteAddress,
  editeAddress,
  showddress,
  aaplyCoupon,
  placeOrder,
  creatOder,
  getProfile,
  getOrderHistory,
  orderDetails,
  orderCancel,
  updateProfile,
  search,
  userLogout,
  forgotPassword,
  updatePassword,
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
router.patch("/incriment", axiosSession, changeQty);
router.delete("/cart", removeCart);
router.get("/wishList", session, wishListget);
router.delete("/wishPro", removeFromWish);
router.post("/wishList", axiosSession, addTOWishList);
router.get("/wish", session, wishListFind);
router.get("/checkout", session, checkout);
router.post("/address", session, addAddress);
router.delete("/address", deleteAddress);
router.patch("/address", editeAddress);
router.get("/address", showddress);
router.post("/coupon", session, aaplyCoupon);
router.get("/order", placeOrder);
router.post("/order", session, creatOder);
router.get("/profile", session, getProfile);
router.post("/verifyPayment", axiosSession, verifyPayment);
router.get("/orderHistory", session, getOrderHistory);
router.get("/orderdetails", session, orderDetails);
router.put("/cancelorder", session, orderCancel);
router.put("/profile", session, updateProfile);
router.post("/search", search);
router.get("/logout", session, userLogout);
router.get("/forgot", forgotPassword);
router.put("/forgotpassword", updatePassword);

module.exports = router;
