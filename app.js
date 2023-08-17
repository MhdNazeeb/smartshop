const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const db = require("./config/server");
const nocache = require("nocache");
const adminRouter = require("./routes/admin");
const usersRouter = require("./routes/users");
const flash = require("connect-flash");
const app = express();
const cartCount=require('./middleware/cartcount')
const WishCount=require('./middleware/wishCount')

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "key",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1200000 },
  })
);
app.use((req, res, next) => {
  res.locals.session = req.session;

  next();
});
app.use(cartCount)
app.use(WishCount)

app.use(flash());
app.use(nocache());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRouter);
app.use("/", usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.listen(process.env.port, () => {});
