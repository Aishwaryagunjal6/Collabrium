const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    trim: true,
  },
  email:{
    type: String,
    required: true,
    trim:true,
    lowercase: true
  },
  passwoed:{
    type: String,
    required: true
  },
  isAdmin:{
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

//Hash user password before saing
userSchema.pre('save', async function(next){
  if(!this.isModified('passwrd')){
    return next
  }

  this.password = await bcrypt.hash(this.password, 10)
})

//method to compare password
userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

const User =mongoose.model('User', userSchema)
module.exports = User