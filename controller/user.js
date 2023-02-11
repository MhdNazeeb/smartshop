const signup = require("../models/singnup");
const bcrypt = require("bcrypt");
const serviceid = "VAcf1cfaed8e25165ce09c1e15646d478a";
const { login } = require("./admin");
const product = require("../models/product");
const category = require("../models/category");
const cart = require("../models/cart");
const {ObjectId}=require("mongodb")

const accountSid = process.env.account_id;
const authToken = process.env.authToken;
const client = require("twilio")(accountSid, authToken);
const home = async (req, res) => {
  const findProduct = await product.find({});
  const findCategory = await category.find({});
  res.render("home", { findProduct, findCategory });
};
const getsignup = (req, res) => {
  res.render("signup");
};
const getLogin = (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    res.render("user404");
  }
};
const getShop = async (req, res) => {
  try {
    let findProduct;
    let findCategory;

    const { id } = req.query;
    if (id) {
      findProduct = await product.find({ category: id });
      console.log(findProduct, "this is findCatProduct");
      findCategory = await category.find({});
    } else {
      findProduct = await product.find({}).sort({ price: -1 });
      findCategory = await category.find({});
    }
    res.render("shop", { findProduct, findCategory });
  } catch (error) {
    res.render("user404");
  }
};
const postSignup = async (req, res) => {
  console.log("sdfghjkl");
  try {
    const { firstname, password, password1, email } = req.body;
    if (password && password1) {
      const hashedpassword = await bcrypt.hash(password, 10);
      const hashedconfirmpassword = await bcrypt.hash(password1, 10);

      await signup
        .create({
          name: firstname,
          email: email,
          password: hashedpassword,
          confirm_password: hashedconfirmpassword,
        })
        .then(() => {
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err.message, "signup");
          console.log("this is not sucess");
          res.redirect("/signup");
        });
    }
  } catch (error) {
    res.render("user404");
  }
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const find = await signup.findOne({ email: email });

    if (find && find.status == true) {
      bcrypt.compare(password, find.password, async (err, data) => {
        if (err) {
          console.log(err);
        } else if (data) {
          const id = await signup.findOne({ email: email }, { _id: 1 });
          req.session.userlogin = id._id;
          req.session.loginuser = true;
          res.redirect("/");
        } else {
          console.log("here is login error");
          res.redirect("/login");
        }
      });
    } else {
      console.log("here is login not found");
      res.redirect("/login");
    }
  } catch (error) {
    res.render("user404");
  }
};
const getPhone = (req, res) => {
  try {
    console.log("here is phone");
    res.render("phone");
  } catch (error) {
    res.render("user404");
  }
};
const getOtp = (req, res) => {
  try {
    res.render("otp");
  } catch (error) {
    res.render("user404");
  }
};
const postNumber = async (req, res) => {
  console.log("hhhhhhhhhhhh");
  try {
    const { newusermobile } = req.body;
    console.log(newusermobile);
    req.session.newusermobile = newusermobile;

    await client.verify.v2
      .services(serviceid)
      .verifications.create({
        to: `+91${newusermobile}`,
        channel: "sms",
      })
      .then((verification) => {
        res.redirect("/otp");
      });
  } catch (error) {
    console.log(error.message);

    res.render("user404");
  }
};
const verifyOtp = async (req, res) => {
  console.log("this verifypage");
  const { newusermobile } = req.session;
  console.log(newusermobile);

  try {
    const { enteredotp } = req.body;
    console.log(enteredotp, "this enter otp");
    await client.verify.v2
      .services(serviceid)
      .verificationChecks.create({
        to: `+91${newusermobile}`,
        code: enteredotp,
      })
      .then((verification_check) => {
        console.log("verifid");
        if (verification_check.status == "approved") {
          res.redirect("/signup");
        } else {
          res.redirect("/otp");
        }
      });
  } catch (error) {
    console.log(error, "otp");
    res.render("user404");
  }
};
const productDetails = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id);
    const productDetailsFind = await product.findOne({ _id: id });
    console.log(productDetailsFind, "this find product in product  details");
    const findProduct = await product.find({});
    res.render("userProductDetails", { productDetailsFind, findProduct });
  } catch (error) {
    res.render("user404");
  }
};
const addToCart = async (req, res) => {
  try {
    const { proid, quantity } = req.query;
    const { userlogin } = req.session;
    console.log(proid, "this is product id");
    trimmed_id = proid.trim()
    console.log(trimmed_id,'after trim');
    console.log(userlogin, "this user log");
    console.log(quantity, "this  is  stock ");
    const findProduct = await product.findOne({ _id: trimmed_id });
    console.log(findProduct, "this find product");
    let price = findProduct.price;
    let stock = findProduct.quantity;
    console.log(price, "this is price");
    console.log(typeof(trimmed_id))
    const cartFind = await cart.findOne({ user: userlogin });
    if (!cartFind) {
      if (stock > 1) {
        await cart.create({
          user: userlogin,
          items: [
            {
              product:ObjectId(trimmed_id),
              quantity: quantity,
              total: quantity * price,
              cartquantity: quantity,
            },
          ],
          grandTotal: quantity * price,
          finalTotal: 0,
        });
        res.json({ message: true });
      } else {
        console.log("stock is zero");
        res.json({ messag1: true });
      }
    }
    const findproduct = await cart.findOne({
      user: userlogin,
      "items.product": trimmed_id,
    });
    console.log(findproduct, "this is checking");
    if (findproduct) {
      console.log("checking complite");
      const updateptodut = await cart.updateOne(
        { user: userlogin, "items.product":trimmed_id },
        {
          $inc: {
            "items.$.total": price,
            "items.$.quantity": quantity,
          },
        }
      ).then(()=>{
        res.json({messag1:true})
      }).catch((err)=>{
        console.log(err.message,'this error');
      })

      
    }

    console.log("cart found");
    await cart.updateOne(
      { user: userlogin },
      {
        $push: {
          items: {
            product: proid,
            quantity: quantity,
            totel: quantity * price,
          },
        },
      }
    );
    res.json({ message2: true });
    const upCart=await cart.updateOne({user:userlogin,'items.product':proid})
  } catch (error){
    
  }
}
module.exports = {
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
};
