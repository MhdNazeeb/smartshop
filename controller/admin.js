require("dotenv").config();
const { SyncListPermissionPage } = require("twilio/lib/rest/preview/sync/service/syncList/syncListPermission");
const multer = require("../middleware/multter");
const category = require("../models/category");
const product = require('../models/product')
const signup=require('../models/singnup')

const login = (req, res) => {
  if(req.session.login){
  res.render("adminHome");
  }else{
    res.render('adminLogin')
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
    }
  } catch (error) {
    res.render("404");
  }
};
const getProduct = async (req, res) => {
  try {
    console.log("add product here");
    
    const findCategory = await category.find();

    res.render("adminproduct ", { findCategory });
  } catch (error) {
    res.render("404");
  }
};

const getCategory = async (req, res) => {
  try {
    const findCategory = await category.find({});

    res.render("addcategory", { findCategory ,proadderr:req.flash('proadderr')});

    req.session.Category = false;
    console.log("here iscategory2222", req.session.Category);
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
      res.redirect("/admin/category");
    })
    .catch(() => {
      req.flash("proadderr","you can't add dublicate")
      
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
  console.log(req.body ,"image upload here");
  const { Description, Price, size, Stock, categories, name,color} = req.body;
  console.log(Description, Price, size, Stock, categories, name,color);

  const files = req.files;
  let image =files.map((val)=>val.filename)

 const upproduct= await product
    .create({
      name: name,
      category: categories,
      quantity: Stock,
      size: size,
      price: Price,
      description: Description,
      image:image ,
      color:color
    })
    .then(() => {
      console.log('here is upload sucess');
      res.redirect("/admin/product");
    })
    .catch(() => {
      console.log('here is upload unsucess');
      res.redirect("/admin/product");
    });
};
const getUserList=async(req,res)=>{
 try {
  const findUser=await signup.find({})
  res.render('userList',{findUser})
 } catch (error) {
  res.render("404");
 } 
}
const userBlock=async(req,res)=>{
  console.log("naseeb is gdret")
  const {id,unbid}=req.query
  if(id){
  const bock=await signup.updateOne({_id:id},{$set:{status:false}})
  res.redirect('/admin/userList')
  }else if(unbid){
    const bock=await signup.updateOne({_id:unbid},{$set:{status:true}})
    res.redirect('/admin/userList')
  }
}
const deleteUser = async(req,res)=>{
  console.log('here is  delete');
  const {id}=req.query
  console.log(id);
  await signup.deleteOne({_id:id})
  res.json({message:true})
}
const getProductList=async(req,res)=>{
  try {
    const findProduct=await product.find({})
    res.render('adminProductList',{findProduct})
    
  } catch (error) {
    res.render("404");
  }

}
const deleteProduct = async(req,res)=>{
  console.log('here is  product delete');
  const {id}=req.query
  console.log(id , 'id is here for delete product');
  await product.deleteOne({_id:id})
  res.json({message:true})
}
const getEditProduct =async (req,res)=>{
  console.log('here is edite product');
  try {
    const {id}=req.query
    console.log(id,'this id for edite');
    const findProduct = await product.findOne({_id:id})
    const findCategory = await category.find({})
    console.log(findProduct,'this is get edite product');
    res.render('editeProduct',{findProduct,findCategory})
  } catch (error) {
    res.render("404");
  }
  
}
const editeProduct=async(req,res)=>{
  const {id}=req.query
 console.log(id,'update id is here');
  const files = req.files;
  console.log(files);
  let images =files.map((val)=>val.filename)
  const { Description, Price, size, Stock, categories, name,color} = req.query;
  
const editePro=await product.updateOne({_id:id},{$set:{
  name: name,
  category: categories,
  quantity: Stock,
  size: size,
  price: Price,
  description: Description,
  image:images,
  color:color
}})
console.log(editePro,'this edite product')
res.json({message:true})
  
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
  editeProduct
  

};
