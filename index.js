const express = require("express"); //import express
const ejsLayouts = require("express-ejs-layouts"); //import ejs layous
require("dotenv").config(); //allow access to env vars
const db = require("./models");
const cookieParser = require("cookie-parser");
const cryptoJs = require("crypto-js");
const axios = require("axios");
const { createHash } = require("crypto");
const users_heroes = require("./models/users_heroes");
const hero = require("./models/hero");
const comment = require("./models/comment");
const methodOverride = require('method-override');


const options = {
  headers: {
    Accept: "application/json",
  },
};

const pubKey = process.env.PUBLIC_API_KEY;
const privKey = process.env.PRIVATE_API_KEY;
const ts = new Date().getTime();
const reqHash = createHash("md5")
  .update(ts + privKey + pubKey)
  .digest("hex");
// console.log(reqHash)


const app = express(); //create instance of express
//check for env port if not, use 3000
const port = process.env.PORT || 3000;
app.use('/public',express.static('public'))
//middleware
app.set("view engine", "ejs"); //set the view view engine to ejs
app.use(cookieParser()); // gives access to req.cookies
app.use(express.urlencoded({ extended: false })); //makes req.body work
app.use(ejsLayouts); //tell express to use ejs layouts
app.use(methodOverride('_method'));
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

app.get("/", (req, res) => {
  try {
    res.redirect(`/search`)
  } catch (error) {
    console.log(error);
  }
})


app.get("/search", async (req, res) => {
  try {
    await axios
      .get(
        `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${req.query.marvelSearch}&offset=0&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`,
        options
      )
      .then((response) => {
        data = response.data.data.results;
        res.render(`home.ejs`, { results: data });
        // console.log(data)
        // console.log(req.query.marvelSearch)
      });
  } catch (error) {
    console.log(error);
  }
});
app.get("/favorites", async (req, res) => {
  try {
    const foundUser = await db.user.findOne({
      where: { id: res.locals.user.id },
    });
    const data = await foundUser.getHeros();
    const commentData = await foundUser.getComments();
    // console.log(data)
    //  let dataTwo=JSON.stringify(Data, null, 2);
    //  let favData=JSON.parse(dataTwo)
    //  const heroDbData = await db.hero.findAll({include: db.user});
    //  let heroDataTwo=JSON.stringify(heroDbData, null, 2);
    //  let heroData=JSON.parse(heroDataTwo)
    //  console.log(heroData)
    res.render(`favorites.ejs`, { results: data });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const foundComment = await db.comment.findOne({
      where: { id: req.body.comId},
    });
    await foundComment.destroy();
    res.redirect(`/details/${req.body.detailId}`);
  } catch (err) {
    console.log(err);
  }
});

app.get("/search", async (req, res) => {
  try {
    const foundUser = await db.user.findOne({
      where: { id: res.locals.user.id },
    })
    const data = await foundUser.getHeros();
    axios
      .get(
        `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${req.query.marvelSearch}&offset=0&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`,
        options
      )
      .then((response) => {
        data = response.data.data.results;
        res.render(`home.ejs`, { results: data });
        // console.log(data)
        console.log(req.query.marvelSearch);
      });
  } catch (error) {
    console.log(error);
  }
});



app.get("/details/:id", async (req, res) => {

  const foundHero = await db.hero.findOne({
    where: { marvelId: req.params.id },
  });
  let comData = await foundHero.getComments();
  charId = req.params.id;
  await axios
    .get(
      `http://gateway.marvel.com/v1/public/characters/${charId}?&limit=1&offset=0&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`,
      options
    )
    .then((response) => {
      dataFirst = response;

      // console.log(dataFirst.data.data.results[0])
    });
  axios
    .get(
      `http://gateway.marvel.com/v1/public/characters/${charId}/comics?&offset=3&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`,
      options
    )
    .then((response) => {
      data = response;
      // console.log(data.data.data.results[0].images)
      let comicData = data.data.data.results;

      // console.log(comicData)
      let comicPics = [];
      for (let i = 0; i < comicData.length; i++) {
        comicPicsUrls = comicData[i].images[0];
        // console.log(comicPicsUrls)
        const comicPicArray = new Array(comicPicsUrls);
        // console.log(comicPicArray[0])
        comicPics.push(comicPicArray[0]);
      }
      

      // console.log(comicPics[2])
      // console.log(photoArray)
      res.render("detail.ejs", {
        results: dataFirst.data.data.results[0],
        comicPhotos: comicPics,
        comicData: comicData,
        commentData: comData,
        favData:data,
        
        
      });
    })
    

    .catch(console.log);
});
//
app.post("/", async (req, res) => {
  // TODO: Get form data and add a new record to DB
  db.hero
    .findOrCreate({
      where: {
        marvelId: req.body.marvelKey,
        name: req.body.name,
        photo: req.body.photo,
        more_url: req.body.url,
      },
    })
    .then(([hero, Created]) => {
      // console.log(`the new fave is:`, newFave);
      res.redirect(`${req.body.url}`);
    })
    .catch((err) => {
      console.log("error", err);
    });
});

app.post("/", async (req, res) => {
  // TODO: Get form data and add a new record to DB
  db.hero
    .findOrCreate({
      where: {
        marvelId: req.body.marvelKey,
        name: req.body.name,
        photo: req.body.photo,
        more_url: req.body.url,
      },
    })
    .then(([hero, Created]) => {
      // console.log(`the new fave is:`, newFave);
      res.redirect(`${req.body.url}`);
    })
    .catch((err) => {
      console.log("error", err);
    });
});

// Edit users name
app.put("/:id", async (req, res) => {
  try {
    await db.user.update(
      {
        userName: req.body.name
      },
      {
        where: {
          id: req.params.id
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
});


app.post("/fave", async (req, res) => {
  // TODO: Get form data and add a new record to DB
  db.hero
    .findOrCreate({
      where: {
        marvelId: req.body.marvelKey,
        name: req.body.name,
        photo: req.body.photo,
        more_url: req.body.url,
      },
    })
    .then(([hero, Created]) => {
      res.locals.user.addHero(hero);
      // console.log(`the new fave is:`, newFave);
      res.redirect(`/favorites`);
    })
    .catch((err) => {
      console.log("error", err);
    });
});

app.post("/comment", async (req, res) => {
  try {
    const createComment = await db.comment.create({
      userId: res.locals.user.id,
      heroId: req.body.heroId,
      body: req.body.commentData,
      userName: res.locals.user.userName,
    });
    res.redirect("/favorites");
  } catch (err) {
    console.log(err);
  }
});

app.post("/genComment", async (req, res) => {
  try {
    db.hero
      .findOrCreate({
        where: {
          name: req.body.name,
          photo: req.body.photo,
          more_url: req.body.url,
        },
      })
      .then(async ([hero, Created]) => {
        const createComment = await db.comment.create({
          userId: res.locals.user.id,
          heroId: hero.id,
          body: req.body.genComment,
          userName: res.locals.user.userName,
        });
        res.redirect(`${req.body.url}`);
      });
  } catch (err) {
    console.log(err);
  }
});

//CONTROLLER
app.use("/users", require("./controllers/users.js"));


//
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
