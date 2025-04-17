const { number } = require('joi');
const mongoose=require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
  
Schema=mongoose.Schema
let userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobilenumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type: String,
        enum: ["male", "female", "others"], 
        required: true 
    },
    age: {
        type: Number,
        required: true,
        min: [16, "Age must be 16 or older"]
    },
    profilepictureurl:{
        type:String,
        required:false
    },
    bio:{
        type:String,
        required:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})
userSchema.plugin(AutoIncrement, { inc_field: 'userid', start_seq: 1 });
module.exports = mongoose.model('user', userSchema);
