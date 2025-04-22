const express = require("express")
const Group = require("../models/groupModel.js")
const groupRouter = express.Router();

//Create a new group 
groupRouter.post("/", async()=>{
  try{
    const {name, description} = req.body;
    const group = await Group.create({
      name,
      description,
      // admin: req.user._id,
      //members:[req.user._id]
    })

    const populatedGroup = await Group.findById(group._id).populate("admin", "username email").populate('members', 'username email')

    res.status(201).json({populatedGroup})
  }catch(error){
    res.staus(400).json({
      message: error.message
    })
  }
})

module.exports = groupRouter;