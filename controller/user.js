const signup = require("../models/singnup");
const bcrypt = require("bcrypt");
const serviceid = "VAcf1cfaed8e25165ce09c1e15646d478a";
const { login } = require("./admin");
const product = require("../models/product");
const category = require("../models/category");
const cart = require("../models/cart");
const { ObjectId } = require("mongodb");
const { findOne } = require("../models/singnup");
const wishList = require("../models/wishlist");
const address = require("../models/address");
const accountSid = process.env.account_id;
const authToken = process.env.authToken;
const client = require("twilio")(accountSid, authToken);
const coupon = require("../models/coupon");
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
    res.render("login", { message: req.flash("message") });
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
    const { newusermobile } = req.session;
    if (password && password1) {
      const hashedpassword = await bcrypt.hash(password, 10);
      const hashedconfirmpassword = await bcrypt.hash(password1, 10);

      await signup
        .create({
          name: firstname,
          email: email,
          password: hashedpassword,
          confirm_password: hashedconfirmpassword,
          phone: newusermobile,
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
          req.flash("message", "A");
          res.redirect("/login");
          console.log(err);
        } else if (data) {
          const id = await signup.findOne({ email: email }, { _id: 1 });
          req.session.userlogin = id._id;
          req.session.loginuser = true;
          res.redirect("/");
        } else {
          req.flash("message", "aA");
          console.log("here is login error");
          res.redirect("/login");
        }
      });
    } else {
      req.flash("message", "A");
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
    res.render("phone",{message:req.flash('message')});
  } catch (error) {
    res.render("user404");
  }
};
const getOtp = (req, res) => {
  try {
    res.render("otp", { message: req.flash("message") });

  } catch (error) {
    res.render("user404");
  }
};
const postNumber = async (req, res) => {
  console.log("hhhhhhhhhhhh");
  const { userlogin } = req.session;
  try {
    const { newusermobile } = req.body;
    console.log('here is find user');
    const findUser = await signup.findOne({ phone: newusermobile });
    if (!findUser) {
      console.log(findUser, "this is findUser");
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
    }else{
      console.log('here is all ready exisits');
      req.flash('message','m')
      res.redirect('/phone')
    }
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
          req.flash("message", "a");
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
    trimmed_id = proid.trim();
    console.log(trimmed_id, "after trim");
    console.log(userlogin, "this user log");
    console.log(quantity, "this  is  stock ");
    const findProduct = await product.findOne({ _id: trimmed_id });
    console.log(findProduct, "this find product");
    let price = findProduct.price;
    let stock = findProduct.quantity;
    console.log(price, "this is price");
    console.log(typeof trimmed_id);
    const cartFind = await cart.findOne({ user: userlogin });
    if (stock > 1) {
      if (!cartFind) {
        const cartCreate = await cart.create({
          user: userlogin,
          items: [
            {
              product: ObjectId(trimmed_id),
              quantity: quantity,
              total: quantity * price,
            },
          ],
          grandTotal: quantity * price,
          cartquantity: 1,
        });
        res.json({ cartCreated: true });
      }
      const findproduct = await cart.findOne({
        user: userlogin,
        "items.product": trimmed_id,
      });
      console.log(findproduct, "this is checking");
      if (findproduct) {
        console.log("checking complite");
        const updateptodut = await cart
          .updateOne(
            { user: userlogin, "items.product": trimmed_id },
            {
              $inc: {
                "items.$.total": price,
                "items.$.quantity": quantity,
                grandTotal: quantity * price,
              },
            }
          )
          .then(() => {
            res.json({ incriment: true });
          })
          .catch((err) => {
            console.log(err.message, "this error");
          });
      } else {
        console.log("cart found");
        await cart.updateOne(
          { user: userlogin },
          {
            $push: {
              items: {
                product: proid,
                quantity: quantity,
                total: quantity * price,
              },
            },
            $inc: { cartquantity: 1, grandTotal: quantity * price },
          }
        );
        res.json({ push: true });
      }
    } else {
      res.json({ outofstock: true });
    }
  } catch (error) {
    res.render("user404");
  }
};
const getCart = async (req, res) => {
  console.log("reach here");
  const { userlogin } = req.session;
  const findCart = await cart.findOne({ user: userlogin });
  if (userlogin && findCart) {
    console.log(userlogin, "this populate user");
    const findProduct = await cart
      .findOne({ user: userlogin })
      .populate("items.product");
    console.log(findProduct, "this cart product");
    res.render("usercartlist", { findProduct });
  } else {
    console.log("empty cart ");
    res.render("emptycart");
  }
};
const changeQty = async (req, res) => {
  const { proid, count } = req.query;
  const { userlogin } = req.session;
  const productFind = await product.findOne({ _id: proid });
  const price = productFind.price;
  if (count == 1) {
    const cartFind = await cart.findOneAndUpdate(
      {
        user: userlogin,
        "items.product": proid,
      },
      {
        $inc: {
          "items.$.total": price,
          "items.$.quantity": 1,
          grandTotal: price,
        },
      }
    );

    console.log(cartFind, "this incriment");
    const index = cartFind.items.findIndex((obj) => obj.product == proid);
    console.log(index, "this is index");
    let newcart = await cart.findOne({ user: userlogin });
    console.log(newcart, "this user");
    let total = newcart.items[index].total;
    console.log(total, "total price");
    let grandTotal = newcart.grandTotal;
    console.log(total, "this is totals");

    res.json({ total, grandTotal });
  } else {
    const findCartde = await cart.findOneAndUpdate(
      { user: userlogin, "items.product": proid },
      {
        $inc: {
          "items.$.total": -price,
          "items.$.quantity": -1,
          grandTotal: -price,
        },
      }
    );

    const index = findCartde.items.findIndex((obj) => obj.product == proid);
    const userCart = await cart.findOne({ user: userlogin });
    const total = userCart.items[index].total;
    const grandTotal = userCart.grandTotal;
    console.log(grandTotal, "this grand total");
    console.log(total, grandTotal, "this is minus true");
    res.json({ total, grandTotal });
  }
};
const removeCart = async (req, res) => {
  console.log("delete reach");
  const { proid } = req.query;
  const { userlogin } = req.session;
  const products = await product.findOne({ _id: proid });
  const cartFind = await cart.findOne({ user: userlogin });
  const index = cartFind.items.findIndex((val) => val.product == proid);
  const grandTotalremove = cartFind.items[index].total;
  console.log(grandTotalremove, "this is grand total");

  console.log(index, "this is for remove from cart");
  console.log(proid, "this product id");
  console.log("product delete here");
  const deleteProduct = await cart.updateOne(
    { user: userlogin, "items.product": proid },

    {
      $pull: { items: { product: proid } },
      $inc: { grandTotal: -grandTotalremove },
    }
  );
  const findCartdb = await cart.findOne({ user: userlogin });
  console.log(findCartdb, "this new cart");
  const newGrand = findCartdb.grandTotal;
  res.json({ newGrand });
};
const wishListget = async (req, res) => {
  res.render("wishlist");
};
const addTOWishList = async (req, res) => {
  console.log("addwishlist here");
  const { proid } = req.query;
  console.log(proid, "this product  id");
  const { userlogin } = req.session;
  console.log(userlogin, "this is user login");
  const findWishlist = await wishList.findOne({ user: userlogin });
  if (!findWishlist) {
    const WishCreate = await wishList.create({
      user: userlogin,
      items: [
        {
          product: proid,
        },
      ],
    });
    res.json({ created: true });
  } else {
    const findProduct = await wishList.findOne({
      user: userlogin,
      "items.product": proid,
    });
    console.log(findProduct, "this findProblem");
    if (findProduct) {
      res.json({ findPro: true });
    } else {
      const updateProduct = await wishList.updateOne(
        { user: userlogin },
        { $push: { items: { product: proid } } }
      );
      console.log(updateProduct, "this is updateProduct");
      res.json({ push: true });
    }
  }
};
const wishListFind = async (req, res) => {
  const { userlogin } = req.session;
  console.log(userlogin);
  console.log("this is wish list");
  const findwish = await wishList
    .find({ user: userlogin })
    .populate("items.product");
  console.log(findwish, "this find wish list");
  res.render("wishlist", { findwish });
};
const removeFromWish = async (req, res) => {
  console.log("here rech");
  const { userlogin } = req.session;
  console.log("this is not log");
  console.log(userlogin, "this user log rom wish list");
  const { proid } = req.query;
  console.log(proid, "this  is  proid");
  const remove = await wishList.updateOne(
    { "items.product": proid, user: userlogin },
    { $pull: { items: { product: proid } } }
  );
  console.log(remove, "this  is  remove");
  res.json({ status: true });
};
const checkout = async (req, res) => {
  const { userlogin } = req.session;

  console.log("this is check out page");
  let findAddress = await address.findOne({ user: userlogin });
  const subamount = await cart.findOne({ user: userlogin });
  console.log(subamount, "this is subamount");

  console.log(findAddress, "this find address");

  res.render("checkout", { findAddress, subamount });
};
const addAddress = async (req, res) => {
  console.log("this address page");
  const { userlogin } = req.session;
  const { Name, address1, phone, address2, email } = req.body;
  console.log(Name, address1, phone, address2, email, "this file");
  const findAddress = await address.findOne({ user: userlogin });
  if (!findAddress) {
    const createAdress = await address.create({
      user: userlogin,
      address: [
        {
          Name: Name,
          address1: address1,
          phone: phone,
          address2: address2,
          email: email,
        },
      ],
    });
    res.redirect("/checkout");
  } else {
    const Upadates = await address.updateOne(
      { user: userlogin },
      { $push: { address: [req.body] } }
    );
    res.redirect("/checkout");
  }
};
const deleteAddress = async (req, res) => {
  const { addid } = req.query;
  const { userlogin } = req.session;
  console.log(addid, "this id for deleting address");
  const deleteAddress = await address.updateOne(
    { user: userlogin },
    { $pull: { address: { _id: addid } } }
  );
  res.json({ delete: true });
};
const editeAddress = async (req, res) => {
  console.log("hhhhhhhhhhhhhhhhhhhhhhh");
  const { userlogin } = req.session;
  const { addid } = req.query;
  const { Name, address1, address2, email, phone } = req.body;
  console.log(
    Name,
    address1,
    address2,
    email,
    phone,
    "this from adddress page"
  );
  const editeAddress1 = await address
    .updateOne(
      { user: userlogin, "address._id": addid },
      {
        $set: {
          "address.$.Name": Name,
          "address.$.address1": address1,
          "address.$.phone": phone,
          "address.$.address2": address2,
          "address.$.email": email,
        },
      }
    )
    .then(() => {
      res.json({ addressUp: true });
    });

  console.log(editeAddress1, "tyyy");
};
const showddress = async (req, res) => {
  const { proid } = req.query;
  const showAddress = await address.findOne(
    { "address._id": proid },
    { "address.$": 1 }
  );
  console.log(showAddress, "this adresss");
  res.json(showAddress);
};
const aaplyCoupon = async (req, res) => {
  const { eccoupan } = req.body;
  const { userlogin } = req.session;
  console.log(eccoupan, "this coupon code");
  const findCoupon = await coupon.findOne({ code: eccoupan });
  const minamount = findCoupon.mincartAmout;
  const discount = findCoupon.mincartAmout;

  console.log(minamount, "this cart amount");
  console.log(findCoupon, "this frereound coupon");
  const cartFind = await cart.findOne({ user: userlogin });
  const cartTotal = cartFind.grandTotal;

  if (findCoupon) {
    if (minamount >= cartTotal) {
      
    } else {
      console.log("you should be purchers atleast 700$");
    }
  } else {
    console.log("coupon wrong");
  }
};

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
  aaplyCoupon,
};
