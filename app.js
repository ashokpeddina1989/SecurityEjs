require('dotenv').config()
const express = require('express');
const bodyparser = require('body-parser');
 const ejs = require('ejs');
 const mongoose = require('mongoose');
  const encrypt = require('mongoose-encryption');

 const app = express();
 app.set("view engine",'ejs');

 app.use(bodyparser.urlencoded({extended:true}));

 app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

//console.log(process.env.secret);
userSchema.plugin(encrypt, { secret: process.env.secret,encryptedFields: ['password']  });

const User = new mongoose.model("user",userSchema);
app.get("/",function(req,res){
  res.render("home");
})


app.get("/login",function(req,res){
  res.render("login");
})

app.post("/login",(req,res)=>{
  User.findOne({email:req.body.username},function(err,data){
    if(err){
      console.log("Data found in db");
    }else {
      if(data.password === req.body.password){
        res.render("secrets");
      }else{
        res.send("Password did not match");
      }
    }
  })
})


app.get("/register",function(req,res){
  res.render("register");
})

app.post("/register",function(req,res){
const user_save = new User({
   email: req.body.username,
  password: req.body.password
  })

  user_save.save(function(err){
    if(err){
      console.log("error in saving");
    }else{
      res.render("secrets")
    }
  })

})


 app.listen(3000,function(req,res){
   console.log("server started at port 3000");
 })
