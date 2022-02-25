const express = require('express')
const ejsLayouts = require('express-ejs-layouts')


const app = express()
const port = process.env.PORT || 3000


app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(ejsLayouts)

// middleware that allows us to access the 'moment' library in every EJS view


// GET / - display all articles and their authors
app.get('/', (req, res) => {
  res.send(`Hello Chads`)
  
})


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})