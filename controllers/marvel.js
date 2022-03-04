const express = require("express"); //import express
const ejsLayouts = require("express-ejs-layouts"); //import ejs layous
require("dotenv").config(); //allow access to env vars
const cookieParser = require("cookie-parser");
const axios = require("axios");
const { createHash } = require("crypto");
const users_heroes = require("./models/users_heroes");
const hero = require("./models/hero");
const comment = require("./models/comment");

const db = require('../models')
const router = express.Router()
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')

const options = {
  headers: {
    Accept: "application/json",
  },
};

const pubKey = process.env.Public_API_KEY;
const privKey = process.env.Private_API_KEY;
const ts = new Date();
const reqHash = createHash("md5")
  .update(ts + privKey + pubKey)
  .digest("hex");
// console.log(reqHash)

const app = express(); //create instance of express
//check for env port if not, use 3000
const port = process.env.PORT || 3000;

//middlewar
app.set("view engine", "ejs"); //set the view view engine to ejs
app.use(cookieParser()); // gives access to req.cookies
app.use(express.urlencoded({ extended: false })); //makes req.body work
app.use(ejsLayouts); //tell express to use ejs layouts

//CUSTOM LOGIN MIDDLEWARE
app.use(async (req, res, next) => {
  if (req.cookies.userId) {
    //decrypting the incoming user id from the cookiess
    const decryptedId = cryptoJs.AES.decrypt(
      req.cookies.userId,
      process.env.SECRET
    );
    ///converting the the decrypted id into a readable sting
    const decryptedIdString = decryptedId.toString(cryptoJs.enc.Utf8);
    //querying the db for the user with that id
    const user = await db.user.findByPk(decryptedIdString);

    //assigning the found user to res.locals.user in the routes, and the user in the ejs
    res.locals.user = user;
  } else res.locals.user = null;
  next(); // moves on to the next middleware
});

//CONTROLLER
app.use("/users", require("./controllers/users.js"));