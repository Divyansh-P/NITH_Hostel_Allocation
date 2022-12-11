const mongoose=require('mongoose')
const uniqueValidator=require('mongoose-unique-validator')

const roomSchema= new mongoose.Schema({
   number:{
    type:Number,
    required:true
   },
   direction:{
    type:String,
    required:true
   },
   in_out:{
    type:String,
    required:true
   },
   _floor:{
    type:Number,
    required:true
   },
   owners:[{
type:mongoose.Types.ObjectId,
ref:'User'
   }]
})
roomSchema.plugin(uniqueValidator)
module.exports=mongoose.model('Room',roomSchema);