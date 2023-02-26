require("dotenv").config();
const {
  SyncListPermissionPage,
} = require("twilio/lib/rest/preview/sync/service/syncList/syncListPermission");
const multer = require("../middleware/multter");
const category = require("../models/category");
const product = require("../models/product");
const signup = require("../models/singnup");
const { ObjectId } = require("mongodb");
const coupon=require('../models/coupon');
const order = require("../models/order");

const login = (req, res) => {
  if (req.session.login) {
    res.render("adminHome");
  } else {
    res.render("adminLogin", { message: req.flash("message") });
  }
};
const postLogin = (req, res) => {
  try {
    console.log("here is login");
    const { password, username } = req.body;
    console.log(password, username);
    const adminname = process.env.ADMINNAME;
    const adminpassword = process.env.ADMINPASSWORD;
    if (username == adminname && password == adminpassword) {
      req.session.login = true;
      console.log("here is login");
      res.render("adminhome");
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
    console.log("add product here");

    const findCategory = await category.find();

    res.render("adminproduct ", { findCategory,message:req.flash('message') });
  } catch (error) {
    res.render("404");
  }
};

const getCategory = async (req, res) => {
  try {
    const findCategory = await category.find({});

    res.render("addcategory", { findCategory, message: req.flash("message"),status:req.flash('status') });
    // req.session.dub=false
    // req.session.Category = false;

    console.log("here iscategory2222", req.session.dub);
  } catch (error) {
    res.render("404");
  }
};
const addCategory = async (req, res) => {
  const { description, name } = req.body;
  console.log(description, name);
  const creatcategory = await category
    .create({
      name: name,
      description: description,
    })
    .then(() => {
      req.session.Category = true;
       req.flash('status','aa')
      res.redirect("/admin/category");
    })
    .catch(() => {
      req.session.dub = true;

      console.log("here is category true", req.session.dub);
      req.flash("message", "Already exist");
      res.redirect("/admin/category");
    });
};
const dleteCategory = async (req, res) => {
  console.log("here is delete");
  const { id } = req.query;
  console.log(id, "here is id");
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
  console.log(req.body, "image upload here");
  const { Description, Price, size, Stock, categories, name, color } = req.body;
  console.log(Description, Price, size, Stock, categories, name, color);

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
      req.flash('message','product')
      console.log("here is upload success");
      res.redirect("/admin/product");
    })
    .catch(() => {
      console.log("here is upload unsuccess");
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
  console.log("naseeb is gdret");
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
  console.log("here is  delete");
  const { id } = req.query;
  console.log(id);
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
const deleteProduct = async (req, res) => {
  console.log("here is  product delete");
  const { id } = req.query;
  console.log(id, "id is here for delete product");
  await product.deleteOne({ _id: id });
  res.json({ message: true });
};
const getEditProduct = async (req, res) => {
  console.log("here is edite product");
  try {
    const { id } = req.query;
    console.log(id, "this id for edite");
    const findProduct = await product.findOne({ _id: id });
    const findCategory = await category.find({});
    console.log(findProduct, "this is get edite product");
    res.render("editeProduct", { findProduct, findCategory });
  } catch (error) {
    res.render("404");
  }
};
const editeProduct = async (req, res) => {
  const { id } = req.query;
  trimmed_id = id.trim();
  console.log(id, "update id is here");
  const files = req.files;
  let images = files.map((val) => val.filename);
  console.log(images, "this output images");
  const { Description, Price, size, Stock,  name, color } = req.body;

  console.log(
    Description,
    Price,
    size,
    Stock,
    name,
    color,
    "this is for data"
  );
  const {catid}= req.query
  console.log(catid,'this cat id');
  
  const editePro = await product.updateOne(
   
    { _id: ObjectId(trimmed_id) },
    {
      $set: {
        name: name,
        category:catid,
        quantity: Stock,
        size: size,
        price: Price,
        description: Description,
        image: images,
        color: color,
      },
    }
  );
  console.log(editePro, "this edite product");
  res.json({ message: true });
};
const getCoupon=(req,res)=>{
 res.render('coupon',{message:req.flash('message')})
}
const crateCoupon=async(req,res)=>{
  const {mincart,usegelimit,expdate,amount,available,code}=req.body
  console.log(req.body,'this is coupen check');
  const crecoupon=await coupon.create({
    code:code,
    available:available,
    amount:amount,
    expiredAfter:expdate,
    usageLimit:usegelimit,
    mincartAmout:mincart,
  }).then(()=>{
    
    req.flash('message','a')
    res.redirect('/admin/coupon')
  }).catch((e)=>{
   
    res.redirect('/admin/coupon')
  })

}
const orderHistory=async(req,res)=>{
  console.log('reach order history in admin');
  const orderdetails=await order.find({}).populate('items.product').sort({date:-1})
  console.log(orderdetails,'this order history');
  res.render('adminorderhistory',{orderdetails})
}
const orderDetails=async(req,res)=>{
  const {oderid}=req.query
  console.log(oderid,'this order id');
  const userorder = await order.findOne({ _id: oderid }).populate(
    "items.product"
  );
  console.log(userorder,'this order roduct');
  const OrderedAddress = userorder.address;
  console.log(OrderedAddress);
  res.render('adminorderdetails',{OrderedAddress,userorder})
}
const status=async(req,res)=>{
  console.log('reach status page');
 const {status}=req.body
 const {orderid}=req.query
 console.log(orderid);
 if(status=='Cancelled'){
  const {orderid}=req.query
 const orderUpdate = await order.findByIdAndUpdate(orderid, {
  orderstatus:status,
});
 const products=orderUpdate.items
 products.forEach(async (element) => {
  let update = await product.findByIdAndUpdate(element.product, {
    $inc: { quantity: element.quantity },
  });
  console.log(update,'this is update');
});
res.json({cancel:true})
 }else if(status=='delivered'){
  const {orderid}=req.query
 const orderUpdate = await order.findByIdAndUpdate(orderid, {
  orderstatus: status,
});
 }else if(status=='pending'){
  const {orderid}=req.query
  const orderUpdate = await order.findByIdAndUpdate(orderid, {
   orderstatus: status,
 });
 }
}

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
  deleteProduct,
  getEditProduct,
  editeProduct,
  getCoupon,
  crateCoupon,
  orderHistory,
  orderDetails,
  status
  
};
