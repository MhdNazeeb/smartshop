const express = require("express");
const multter = require("../middleware/multter");
const router = express.Router();
const { session } = require("../middleware/adminChecking");
const {
  login,
  postLogin,
  getProduct,
  getCategory,
  addCategory,
  dleteCategory,
  addProduct,
  getUserList,
  userBlock,
  deleteUser,
  deleteProduct,
  getProductList,
  getEditProduct,
  editeProduct,
  crateCoupon,
  getCoupon,
  orderHistory,
  orderDetails,
  status
} = require("../controller/admin");

/* GET home page. */
router.get("/", login);
router.post("/login", postLogin);
router.get("/product", session, getProduct);
router.get("/category", session, getCategory);
router.post("/category", session, addCategory);
router.delete("/category", session, dleteCategory);
router.post("/product", session, multter.array("files", 5), addProduct);
router.get("/userList", session, getUserList);
router.get("/block", session, userBlock);
router.delete("/user", session, deleteUser);
router.get("/productList", session, getProductList);
router.delete("/product", session, deleteProduct);
router.get("/Products", session, getEditProduct);
router.put("/product", session, multter.array("files", 5), editeProduct);
router.get("/coupon", session, getCoupon);
router.post("/coupon", session, crateCoupon);
router.get("/order", session, orderHistory);
router.get("/orderdetails", session, orderDetails);
router.put('/status',status)

module.exports = router;
