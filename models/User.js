const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profilePic:{type:String},
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  about:{type:String,default:'hey there'},
  lastseen:{type:Boolean,default:true},
  mark_as_read:{type:Boolean,default:true},
  friends:[{type:mongoose.Schema.Types.ObjectId,ref:'users'}]
},{timestamps:true});

module.exports=mongoose.model('users',userSchema)