const express = require('express')
const db = require('../models')
const router = express.Router()
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
require('dotenv').config()
const axios = require('axios')



router.get('/profile', (req,res)=>{
    res.render('users/profile.ejs')
})
router.get('/new', (req,res)=>{
res.render('users/new.ejs')
})





router.post('/', async (req,res)=>{
   const[newUser,created] = await db.user.findOrCreate({
        where:{
            email: req.body.email,
            userName: req.body.userName,
        }
    })
    if(!created){
        console.log('User already exist')
        //render the login page
    }else{
        //hash the user entered password through bcrypt
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        newUser.password = hashedPassword
        await newUser.save()
        console.log(newUser.password)

        //encrypt the user id via AES
        const encryptedUserId = cryptojs.AES.encrypt(newUser.id.toString(),process.env.SECRET)
        const encryptedUserIdString = encryptedUserId.toString()
        console.log(encryptedUserIdString)
        //store the encryptedif in the cookie of the res obj
        //cookie has to be a string
        //key value pairs
        res.cookie('userId',encryptedUserIdString)
        //redirect back to the home page
        res.redirect('users/login')
    }
    
})

router.get('/login', (req,res)=>{
    res.render('users/login.ejs', {error:null})
})

router.post('/login', async (req,res)=>{
   const user = await db.user.findOne({where: {email: req.body.email}})
   if(!user){
       console.log('user not found!')
       res.render('users/login.ejs', {error: 'Invalid email/password'})
   }else if(!bcrypt.compareSync(req.body.password, user.password)){
       console.log('Incorrect Password')
       res.render('users/login.ejs', {error: 'Invalid email/password'})
   }else{
        console.log('Logging in the user')
        const encryptedUserId = cryptojs.AES.encrypt(user.id.toString(),process.env.SECRET)
        const encryptedUserIdString = encryptedUserId.toString()
        res.cookie('userId',encryptedUserIdString)
        res.redirect('/search')

   }
})

router.get('/logout', (req,res)=>{
    console.log('Logging out')
    res.clearCookie('userId')
    res.redirect('/search')
})





//export all these routes to the entry point file
module.exports = router