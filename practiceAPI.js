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

const pubKey = process.env.PUBLIC_API_KEY
const privKey = process.env.PRIVATE_API_KEY
const ts = new Date()
const reqHash = createHash('md5').update(ts + privKey + pubKey).digest('hex')
console.log(reqHash)

// axios.get(`http://gateway.marvel.com/v1/public/characters?nameStartsWith=Spider&limit=1&offset=0&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`, options)
//   .then(response => {data = (response.data.data.results)
//     for(let i = 0; i < data.length; i++){
//         console.log(data[i].comics)
//     }
// })

// const test= `http://gateway.marvel.com/v1/public/characters/1009417/comics?&limit=10&offset=0&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`
// console.log(test)
// axios.get(`http://gateway.marvel.com/v1/public/characters/1009417/comics?&limit=1&offset=0&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`, options)
//   .then(response => {data = (response.data.data.results)
//     for(let i = 0; i < data.length; i++){
//                 console.log(data[i].images[0].path)
//             }
// })

// axios.get(`http://gateway.marvel.com/v1/public/characters/1009610?&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`, options)
//       .then(response => {data = (response)
//         console.log(data.data.data.results[0].name)

//       })

axios.get(`http://gateway.marvel.com/v1/public/characters/1009368/comics?&offset=4&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`, options)
      .then(response => {data = (response)
        // console.log(data.data.data.results[0].images)
        let comicData = data.data.data.results
        console.log(comicData[0])
    
        // let comicPics = []
        // for(let i=0;i<comicData.length;i++ ){
        //     console.log(comicData[i].creators.items[0].name)
        //     console.log(comicData[i].series.name)
        // }
        // console.log(comicPics[3])
    //     for(let i=0;i<picData.length;i++){
    //         console.log(picData[i].path)
    //     }

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


// axios.get(`http://gateway.marvel.com/v1/public/characters/${charId}/comics?&offset=4&ts=${ts}&apikey=${pubKey}&hash=${reqHash}`, options)
//       .then(response => {data = (response)
//         // console.log(data.data.data.results[0].images)
//         let comicData = data.data.data.results
//         // console.log(comicData)
//         let comicPics = []
//         for(let i=0;i<comicData.length;i++ ){
//             comicPicsUrls = comicData[i].images[0]
//             // console.log(comicPicsUrls)
//             const comicPicArray = new Array(comicPicsUrls)
//             // console.log(comicPicArray[0])
//             comicPics.push(comicPicArray[0])
//         }
//         // console.log(comicPics[2])
//         // console.log(photoArray)
//         res.render('detail.ejs', { results:dataFirst.data.data.results[0],comicPhotos:comicPics}) 
//       })

//       .catch(console.log)
//   })



// <% if(commentData){ %>
//   <h1>Comments:
//     <% commentData.forEach(elem => { %>
//       <div>
        
//         <p><%=elem.userName%> said: <%= elem.body%>.  </p>
        
       
  
        
        
//       </div>
//       <% }) %>
//   </h1>
//   <% }else{ %>
//   <p>Be the first to leave a comment!</p>
  
//   <% } %>


// <h1></h1>


// <div>
//           <% if(elem.images[0]){ %>
//             <img src="<%=`${elem.images[0].path}/portrait_incredible.jpg`%> ">
//             <% }%>
//           <p>Title:<%= elem.title%> </p>
//           <% if(elem.creators.items[0]){ %>
//           <p>Author:<%= elem.creators.items[0].name%> </p>
//           <% }%>
//           <p>Price: $<%= elem.prices[0].price%> </p>
