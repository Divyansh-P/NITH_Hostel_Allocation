const mongoose=require('mongoose')
const uniqueValidator=require('mongoose-unique-validator')

const userSchema= new mongoose.Schema({
    name:{
type:String,
required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    rollnumber:{
        type:Number,
        required:true,
        minLength:6
    },
    room: { type: mongoose.Types.ObjectId, ref: 'Room' }
})
userSchema.plugin(uniqueValidator)
module.exports=mongoose.model('User',userSchema);