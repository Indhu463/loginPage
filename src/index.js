// const { escapeRegExpChars } = require('ejs/lib/utils');
const express = require('express');
const pasth = require('path');
const bcrypt = require('bcrypt');
//import module from config.js
const collection = require('./config');

const app = express();

//midleware
app.use(express.json());

// express URL encoded method
app.use(express.urlencoded({extended: false}));

// use EJS as view engine
app.set('view engine','ejs');

//static file
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.render('login');
});

app.get('/signup',(req,res)=>{
    res.render('signup');
});

//Register User
//when you are playing with mongodb first make function async
app.post('/signup', async(req,res)=>{  
    console.log('received signup request with body:', req.body);           
    const data = {
        name: req.body.username,
        password: req.body.password
    };
    //check if the user already exists in the database
    const existingUser = await collection.findOne({name: data.name});
    if(existingUser){
        res.send("user already exists. please choose a different username.");
    }
    else{
        //hash the password using bycrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        
        data.password = hashedPassword; //replace the hash password with original password


        //code to send data to database
        const savedUser = await collection.insertMany(data);
        console.log('saved', savedUser);
        
    }
})

app.use('/login', async(req,res)=>{
   try {
    const data = {
        name: req.body.username,
        password: req.body.password
    };
        const check = await collection.findOne({name: data.name});
        if(!check){
            res.send('user not found');
        }
        // console.log('user input:', req.body.password)
        // console.log('db input:', check.password)
        //compare the hash password from the database with the plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        

        if(isPasswordMatch){
            res.render('home');
            console.log("successfully logined")
        }
        else{
            res.send('wrong password');
        }
   } catch (error) {
    console.log("login error:", error)
    res.send("wrong details");
   }
    
})



const port = 5000;
app.listen(port,()=>{
    console.log(`server running on port number ${port}`);
});