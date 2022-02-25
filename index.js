const express = require('express')//import express
const ejsLayouts = require('express-ejs-layouts')//import ejs layous
require('dotenv').config()//allow access to env vars

const app = express()//create instance of express
//check for env port if not, use 3000
const port = process.env.PORT || 3000


app.set('view engine', 'ejs')//set the view view engine to ejs

app.use(express.urlencoded({ extended: false }))
app.use(ejsLayouts)//tell express to use ejs layouts

// middleware


// GET / - display all articles and their authors
app.get('/', (req, res) => {
  res.render(`home.ejs`)
  
})

//
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})