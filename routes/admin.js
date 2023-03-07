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
  softDeleteProduct,
  getProductList,
  getEditProduct,
  editeProduct,
  crateCoupon,
  getCoupon,
  orderHistory,
  orderDetails,
  status,
  dailyReport,
  monthlyReport,
  yearlyReport,
  graph,
  pieChart,
  dashboard,
  GetBanner,
  CreateBanner,
  LisetBanner,
  GetEditBanner,
  EditBanner
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
router.patch("/product", session, softDeleteProduct);
router.get("/Products", session, getEditProduct);
router.put("/product", session, multter.array("files", 5), editeProduct);
router.get("/coupon", session, getCoupon);
router.post("/coupon", session, crateCoupon);
router.get("/order", session, orderHistory);
router.get("/orderdetails", session, orderDetails);
router.put('/status',session,status)
router.get('/dailyreport',session,dailyReport)
router.get('/monthlyreport',session,monthlyReport)
router.get('/yearlyreport',session,yearlyReport)
router.get('/graph',session,graph)
router.get('/piechart',session,pieChart)
router.get('/dashboard',session,dashboard)
router.get('/banner',session,GetBanner)
router.get('/listbanner',session,LisetBanner)
router.put('/banner',session,multter.array("files",1),EditBanner)
router.get('/banneres',session,GetEditBanner)
router.post('/banner',session,multter.array("files",1),CreateBanner)

module.exports = router;
