const express = require("express")
const userRouter = express.Router();
const User = require("../models/userModel.js")
const jwt = require("jsonwebtoken")

//Register Route
userRouter.post("/register", async (req, res)=>{
  try{
    const { username, email, password } = req.body()
    //check if user already exists
    const userExists = await User.findOne({email})
    if(userExists){
      return res.status(400).json({
        message: "User Already exists"
      })
    }

    //create new user
    const user = await User.create({
      username, email, password
    })

    if(user){
      res.status(201).json({
        _id : user._id,
        username: user.username,
        email: user.email,
      })
    }
  }catch(error){
    res.status(400).json({
      message: error.message
    })
  }
})