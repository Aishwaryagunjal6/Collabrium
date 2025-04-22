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
  }catch(error){

  }
})