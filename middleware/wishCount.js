const wish = require("../models/wishlist");
const wishCount = async (req, res, next) => {
  if (req.session.loginuser) {
    let { userlogin } = req.session;
    let wishcout = await wish.findOne({ user: userlogin });
    let length = wishcout.items.length;
    res.locals.Wishcount = length
    let{Wishcount}=res.locals
   
    next();
  } else {
    res.locals.Wishcount = 0;
    let{Wishcount}=res.locals
    next();
  }
};

module.exports = wishCount;

