
const express = require('express')//import express
const ejsLayouts = require('express-ejs-layouts')//import ejs layous
require('dotenv').config()//allow access to env vars
const db = require('./models')
const cookieParser = require('cookie-parser')
const cryptoJs = require('crypto-js')
const axios = require('axios')
const { createHash } = require('crypto')

const options = {
    headers: {
      'Accept': 'application/json'
    }
  }

const pubKey = process.env.Public_API_KEY
const privKey = process.env.Private_API_KEY
const ts = new Date()
const reqHash = createHash('md5').update(ts + privKey + pubKey).digest('hex')
console.log(reqHash)

const app = express()//create instance of express
//check for env port if not, use 3000
const port = process.env.PORT || 3000

//middlewar
app.set('view engine', 'ejs')//set the view view engine to ejs
app.use(cookieParser()) // gives access to req.cookies
app.use(express.urlencoded({ extended: false })) //makes req.body work
app.use(ejsLayouts)//tell express to use ejs layouts

//CUSTOM LOGIN MIDDLEWARE
app.use(async(req,res,next)=>{
    if(req.cookies.userId){
         //decrypting the incoming user id from the cookiess
    const decryptedId = cryptoJs.AES.decrypt(req.cookies.userId,process.env.SECRET)
    ///converting the the decrypted id into a readable sting
    const decryptedIdString = decryptedId.toString(cryptoJs.enc.Utf8)
    //querying the db for the user with that id
    const user = await db.user.findByPk(decryptedIdString)
    //assigning the found user to res.locals.user in the routes, and the user in the ejs
    res.locals.user=user
       
    }else res.locals.user =null
    next() // moves on to the next middleware
})


//CONTROLLER
app.use('/users', require('./controllers/users.js'))

app.get('/search', (req, res) => {
    try {
        axios.get(`http://gateway.marvel.com/v1/public/characters?nameStartsWith=${req.query.marvelSearch}&offset=0&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`, options)
  .then(response => {data = (response.data.data.results)
    res.render(`home.ejs`,{results:data})
    console.log(data)
        console.log(req.query.marvelSearch)
    })  
        
    } catch (error) {
        console.log(error)
    }
    
})

app.get('/details/:id', (req, res) => {
    console.log(req.params.id)
    charId=req.params.id
    axios.get(`http://gateway.marvel.com/v1/public/characters/${charId}?&limit=1&offset=0&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`, options)
      .then(response => {dataFirst = (response)
        // console.log(dataFirst.data.data.results[0])
      })
      axios.get(`http://gateway.marvel.com/v1/public/characters/${charId}/comics?&offset=4&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`, options)
      .then(response => {data = (response)
        // console.log(data.data.data.results[0].images)
        let comicData = data.data.data.results
        
        // console.log(comicData)
        let comicPics = []
        let comicNames=[]
        let comicCreators = []
        for(let i=0;i<comicData.length;i++ ){
            comicPicsUrls = comicData[i].images[0]
            // console.log(comicPicsUrls)
            const comicPicArray = new Array(comicPicsUrls)
            // console.log(comicPicArray[0])
            comicPics.push(comicPicArray[0])
        }
        for(let i=0;i<comicData.length;i++ ){
            comicPicsUrls = comicData[i].images[0]
            // console.log(comicPicsUrls)
            const comicPicArray = new Array(comicPicsUrls)
            // console.log(comicPicArray[0])
            comicNames.push(comicPicArray[0])
        }
        for(let i=0;i<comicData.length;i++ ){
            comicPicsUrls = comicData[i].images[0]
            // console.log(comicPicsUrls)
            const comicPicArray = new Array(comicPicsUrls)
            // console.log(comicPicArray[0])
            comicCreators.push(comicPicArray[0])
        }
        // console.log(comicPics[2])
        // console.log(photoArray)
        res.render('detail.ejs', { results:dataFirst.data.data.results[0],comicPhotos:comicPics}) 
      })

      .catch(console.log)
  })

//CONTROLLER
app.use('/users', require('./controllers/users.js'))

//
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})