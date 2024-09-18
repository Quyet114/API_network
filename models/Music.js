const mongoose = require('mongoose')
const musicSchema = new mongoose.Schema({
  creator:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    require:true
  },
  url:{
    type:String,
  },
  name:{
    type:String
  },
  type:{
    type:Number,
    default:0
  },
  time:{
    type:Number
  },
  used:{
    type:Number,
    default:0
  },
},{timestamps:true})

const Music =mongoose.model('Music', musicSchema);
module.exports = {Music}