const cart = require("../models/cart");
const cartCount = async (req, res, next) => {
  if (req.session.loginuser) {
    let { userlogin } = req.session;
    let cartcout = await cart.findOne({ user: userlogin });
    let length = cartcout.items.length;
    res.locals.count = length
    let{count}=res.locals
    console.log("this cart", count, "this cart count");
    next();
  } else {
    res.locals.count = 0;
    let{count}=res.locals
    next();
  }
};

module.exports = cartCount;

