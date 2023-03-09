require("dotenv").config();
const {
  SyncListPermissionPage,
} = require("twilio/lib/rest/preview/sync/service/syncList/syncListPermission");
const multer = require("../middleware/multter");
const category = require("../models/category");
const product = require("../models/product");
const signup = require("../models/singnup");
const { ObjectId } = require("mongodb");
const coupon = require("../models/coupon");
const order = require("../models/order");
const banner = require("../models/banner");

const login = async (req, res) => {
  if (req.session.login) {
    const findOrder = await order
      .find({})
      .populate("userId")
      .limit(5)
      .sort({ date: -1 });
    console.log(findOrder, "this limit products");
    const totalusers = await signup.find({});
    const usercount = totalusers.length;
    const totalorder = await order.find({});
    const ordercount = totalorder.length;
    const profit = await order.aggregate([
      { $match: { orderstatus: { $eq: "delivered" } } },
      {
        $group: {
          _id: null,
          totalprice: { $sum: "$total" },
        },
      },
    ]);

    console.log(profit, "this profit");

    const totalprice = profit[0].totalprice;
    console.log(totalprice, "this total");
    const revenue = (totalprice * 15) / 100;
    console.log(revenue, "this is revenue");

    res.render("adminHome", { findOrder, usercount, ordercount, revenue });
  } else {
    res.render("adminLogin", { message: req.flash("message") });
  }
};
const postLogin = (req, res) => {
  try {
    const { password, username } = req.body;

    const adminname = process.env.ADMINNAME;
    const adminpassword = process.env.ADMINPASSWORD;
    if (username == adminname && password == adminpassword) {
      req.session.login = true;

      res.redirect("/admin");
    } else {
      req.flash("message", "e");
      res.redirect("/admin");
    }
  } catch (error) {
    res.render("404");
  }
};
const getProduct = async (req, res) => {
  try {
    const findCategory = await category.find();

    res.render("adminproduct ", {
      findCategory,
      message: req.flash("message"),
    });
  } catch (error) {
    res.render("404");
  }
};

const getCategory = async (req, res) => {
  try {
    const findCategory = await category.find({});

    res.render("addcategory", {
      findCategory,
      message: req.flash("message"),
      status: req.flash("status"),
    });
  } catch (error) {
    res.render("404");
  }
};
const addCategory = async (req, res) => {
  const { description, name } = req.body;

  const regex = new RegExp(`^${name}`, "i");
  const find = await category.findOne({ name: { $regex: regex } });
  if (find) {
    req.flash("message", "allredy");
    res.redirect("/admin/category");
  } else {
    const creatcategory = await category
      .create({
        name: name,
        description: description,
      })
      .then(() => {
        req.session.Category = true;
        req.flash("status", "aa");
        res.redirect("/admin/category");
      })
      .catch(() => {
        req.session.dub = true;

        res.redirect("/admin/category");
      });
  }
};
const dleteCategory = async (req, res) => {
  const { id } = req.query;

  await category
    .deleteOne({ _id: id })
    .then(() => {
      res.json({ message: true });
    })
    .catch(() => {
      res.json({ message: false });
    });
};
const addProduct = async (req, res) => {
  const { Description, Price, size, Stock, categories, name, color } = req.body;

  const files = req.files;
  let image = files.map((val) => val.filename);

  const upproduct = await product
    .create({
      name: name,
      category: categories,
      quantity: Stock,
      size: size,
      price: Price,
      description: Description,
      image: image,
      color: color,
    })
    .then(() => {
      req.flash("message", "product");

      res.redirect("/admin/product");
    })
    .catch(() => {
      res.redirect("/admin/product");
    });
};
const getUserList = async (req, res) => {
  try {
    const findUser = await signup.find({});
    res.render("userList", { findUser });
  } catch (error) {
    res.render("404");
  }
};
const userBlock = async (req, res) => {
  const { id, unbid } = req.query;
  if (id) {
    const bock = await signup.updateOne(
      { _id: id },
      { $set: { status: false } }
    );
    res.redirect("/admin/userList");
  } else if (unbid) {
    const bock = await signup.updateOne(
      { _id: unbid },
      { $set: { status: true } }
    );
    res.redirect("/admin/userList");
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.query;

  await signup.deleteOne({ _id: id });
  res.json({ message: true });
};
const getProductList = async (req, res) => {
  try {
    const findProduct = await product.find({});
    res.render("adminProductList", { findProduct });
  } catch (error) {
    res.render("404");
  }
};
const softDeleteProduct = async (req, res) => {
  const { id } = req.query;
  const { status } = req.body;
  if (status == "block") {
    await product.updateOne({ _id: id }, { $set: { status: true } });
    res.json({ block: true });
  } else {
    await product.updateOne({ _id: id }, { $set: { status: false } });
    res.json({ unblock: true });
  }
};
const getEditProduct = async (req, res) => {
  try {
    const { id } = req.query;

    const findProduct = await product.findOne({ _id: id }).populate('category');
    
    const findCategory = await category.find({});

    res.render("editeProduct", { findProduct, findCategory });
  } catch (error) {
    res.render("404");
  }
};
const editeProduct = async (req, res) => {
  const { id } = req.query;

  console.log(req.body,'this category id');

  trimmed_id = id.trim();
  let { Description, Price, size, Stock, name, color, position,categories } = req.body;
  
  position = JSON.parse(req.body.position);
  const files = req.files;
  let images = files.map((val) => val.filename);
  console.log(position, "this postions");
  let find = await product.findOne({ _id: trimmed_id });
  console.log(find);
  let { image } = find;
  let i = 0;
  position.forEach((val) => {
    image[val] = images[i];
    i++;
  });
 
  console.log(image, "this image for every ne want");
  const editePro = await product.updateOne(
    { _id: ObjectId(trimmed_id) },
    {
      $set: {
        name: name,
        category: categories,
        quantity: Stock,
        size: size,
        price: Price,
        description: Description,
        image: image,
        color: color,
      },
    }
  );

  res.json({ message: true });
};
const getCoupon = (req, res) => {
  res.render("coupon", {
    message: req.flash("message"),
    same: req.flash("same"),
  });
};
const crateCoupon = async (req, res) => {
  const { mincart, usegelimit, expdate, amount, available, code } = req.body;
  const samecoupon = new RegExp(`^${code}`, "i");
  const sameCoupon = await coupon.findOne({ code: { $regex: samecoupon } });
  if (sameCoupon) {
    req.flash("same", "dupecoupon");
    res.redirect("/admin/coupon");
  } else {
    const crecoupon = await coupon
      .create({
        code: code,
        available: available,
        amount: amount,
        expiredAfter: expdate,
        usageLimit: usegelimit,
        mincartAmout: mincart,
      })
      .then(() => {
        req.flash("message", "a");
        res.redirect("/admin/coupon");
      })
      .catch((e) => {
        res.redirect("/admin/coupon");
      });
  }
};
const orderHistory = async (req, res) => {
  const orderdetails = await order
    .find({})
    .populate("items.product")
    .sort({ date: -1 });

  res.render("adminorderhistory", { orderdetails });
};
const orderDetails = async (req, res) => {
  const { oderid } = req.query;

  const userorder = await order
    .findOne({ _id: oderid })
    .populate("items.product");

  const OrderedAddress = userorder.address;

  res.render("adminorderdetails", { OrderedAddress, userorder });
};
const status = async (req, res) => {
  const { status } = req.body;
  const { orderid } = req.query;

  if (status == "Cancelled") {
    const { orderid } = req.query;
    const orderUpdate = await order.findByIdAndUpdate(orderid, {
      orderstatus: status,
    });
    const products = orderUpdate.items;
    products.forEach(async (element) => {
      let update = await product.findByIdAndUpdate(element.product, {
        $inc: { quantity: element.quantity },
      });
    });
    res.json({ cancel: true });
  } else if (status == "delivered") {
    const { orderid } = req.query;
    const orderUpdate = await order.findByIdAndUpdate(orderid, {
      orderstatus: status,
    });
    res.json({ delivered: true });
  } else if (status == "pending") {
    const { orderid } = req.query;
    const orderUpdate = await order.findByIdAndUpdate(orderid, {
      orderstatus: status,
    });
    res.json({ pending: true });
  } else if (status == "returned") {
    const { orderid } = req.query;
    const orderUpdate = await order.findByIdAndUpdate(orderid, {
      orderstatus: status,
    });
    res.json({ return: true });
  }
};
const dailyReport = async (req, res) => {
  const dailyreport = await order.aggregate([
    {
      $match: {
        orderstatus: { $eq: "delivered" },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          daily: { $dayOfMonth: "$createdAt" },
        },
        totalprice: { $sum: "$subtotal" },
        items: { $sum: { $size: "$items" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  res.render("dailyreport", { dailyreport });
};
const monthlyReport = async (req, res) => {
  const monthlyReport = await order.aggregate([
    {
      $match: {
        orderstatus: { $eq: "delivered" },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalprice: { $sum: "$subtotal" },
        items: { $sum: { $size: "$items" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  function getMonthName(monthNumber) {
    const date = new Date();

    date.setMonth(monthNumber - 1);
    return date.toLocaleDateString("en-US", { month: "long" });
  }
  let month = [];
  for (let i = 0; i < monthlyReport.length; i++) {
    month.push(getMonthName(monthlyReport[i]._id.month));
  }

  res.render("monthlyreport", { month, monthlyReport });
};
const yearlyReport = async (req, res) => {
  const yearlyreport = await order.aggregate([
    { $match: { orderstatus: { $eq: "delivered" } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" } },
        totalprice: { $sum: "$subtotal" },
        items: { $sum: { $size: "$items" } },
        count: { $sum: 1 },
      },
    },
  ]);

  res.render("yearlyreport", { yearlyreport });
};
const graph = async (req, res) => {
  const soldProduct = await order.aggregate([
    { $match: { orderstatus: { $eq: "delivered" } } },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        total: { $sum: "$subtotal" },
      },

    },
    {$sort:{_id: -1}}
  ]);
  console.log(soldProduct, "this gggggggggggggg");
  let dailysale = [];
  let dailyprofit = [];
  let datetime = [];
  for (let i = 0; i < soldProduct.length; i++) {
    dailysale.push(soldProduct[i].total);
    dailyprofit.push((soldProduct[i].total * 15) / 100);
    datetime.push(soldProduct[i]._id.date);
  }
  console.log(dailysale, dailyprofit, datetime,'4eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
  res.json({ dailysale, dailyprofit, datetime });
};
const pieChart = async (req, res) => {
  const orderDeliverd = await order.find({ orderstatus: "delivered" }).count();
  const OrderCanceled = await order.find({ orderstatus: "Cancelled" }).count();
  const OrderPending = await order.find({ orderstatus: "pending" }).count();
  const OrderReturned = await order.find({ orderstatus: "returned" }).count();
  let count = [];
  count.push(orderDeliverd);
  count.push(OrderCanceled);
  count.push(OrderPending);
  count.push(OrderReturned);

  console.log(count);
  res.json({ count });
};
const dashboard = async (req, res) => {
  res.redirect("/admin/");
};
const GetBanner = (req, res) => {
  res.render("banner", { message: req.flash("message") });
};
const CreateBanner = async (req, res) => {
  let { subtitle, title } = req.body;

  const files = req.files;

  position.forEach((e) => {});
  const Banner = await banner.create({
    title: title,
    subtitle: subtitle,
    image: Image,
  });
  req.flash("message", "dd");
  res.redirect("/admin/banner");
};
const LisetBanner = async (req, res) => {
  const Findbanner = await banner.find({});
  res.render("listbanner", { Findbanner });
};
const EditBanner = async (req, res) => {
  const files = req.files;
  let { bannerid } = req.query;
  let { subtitle, title, position } = req.body;
  position = JSON.parse(req.body.position);
  let find = await banner.findOne({ _id: bannerid });
  let { image } = find;
  let images = files.map((val) => val.filename);
  let i = 0;
  position.forEach((val) => {
    image[val] = images[i];
    i++;
  });

  await banner.updateOne(
    { _id: bannerid },
    {
      $set: {
        title: title,
        subtitle: subtitle,
        image: image,
      },
    }
  );

  res.json({ updated: true });
};
const GetEditBanner = async (req, res) => {
  let { bannerid } = req.query;

  const findMatchedBanner = await banner.findOne({ _id: bannerid });
  res.render("editbanner", { findMatchedBanner });
};
module.exports = {
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
  getProductList,
  softDeleteProduct,
  getEditProduct,
  editeProduct,
  getCoupon,
  crateCoupon,
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
  EditBanner,
  GetEditBanner,
};
