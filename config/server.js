const mongoose= require('mongoose')
require("dotenv/config");
const url = process.env.database;

mongoose.set("strictQuery", false);
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log("error occured", error);
  });