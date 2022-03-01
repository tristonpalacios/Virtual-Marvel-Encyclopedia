const express = require('express')//import express
const ejsLayouts = require('express-ejs-layouts')//import ejs layous
require('dotenv').config()//allow access to env vars
const db = require('./models')
const cookieParser = require('cookie-parser')
const cryptoJs = require('crypto-js')
const axios = require('axios')
const { createHash } = require('crypto')

const app = express()//create instance of express
//check for env port if not, use 3000
const port = process.env.PORT || 3000

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

// axios.get(`http://gateway.marvel.com/v1/public/characters?nameStartsWith=Spider&limit=1&offset=0&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`, options)
//   .then(response => {data = (response.data.data.results)
//     for(let i = 0; i < data.length; i++){
//         console.log(data[i].comics)
//     }
// })

const test= `http://gateway.marvel.com/v1/public/characters/1009417/comics?&limit=1&offset=0&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`
console.log(test)
// axios.get(`http://gateway.marvel.com/v1/public/characters/1009417/comics?&limit=1&offset=0&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`, options)
//   .then(response => {data = (response.data.data.results)
//     for(let i = 0; i < data.length; i++){
//                 console.log(data[i].images[0].path)
//             }
// })

axios.get(`http://gateway.marvel.com/v1/public/characters/1009610?&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`, options)
      .then(response => {data = (response)
        console.log(data.data.data.results[0].name)

      })

// .then(response => {data = (response.data.data.results)
//     for(let i = 0; i < data.length; i++){
//         console.log(data[i].comics)
//     }

  
  // .catch(console.log)

// router.get('/marvel', async (req,res)=>{
//     try {
        
//         const response = await axios.get(`https://gateway.marvel.com:443/v1/public/characters?name=Spider-Man&apikey=b9a601cf3f97ca652244480a5bb1f914
//         `)
//         res.render('users/results.ejs', {movies: response.code})
//       } catch (error) {
//         console.log(error)
//       }
// })