const mongoose=require('mongoose')


const messageSchema=new mongoose.Schema({
    message:{type:String},
    senderId:{type:mongoose.Schema.Types.ObjectId, ref:'users'},
    receiverId:{type:mongoose.Schema.Types.ObjectId, ref:'users'},
    createdAt: { type: Date, default: Date.now }
},{timestamps:true})

module.exports=mongoose.model('messages',messageSchema)