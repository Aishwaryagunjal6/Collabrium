const mongoose = require("mongoose")

const gruopSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true
  },
  description:{
    type: String,
    required: true,
  },
  members:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  admin:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
})


const Group =mongoose.model('Group', gruopSchema)
module.exports = Group