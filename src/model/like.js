const mongoose=require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
  
Schema=mongoose.Schema
let likeSchema=new Schema({
    postid:{
        type:String,
        require:true
    },
    userid:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

likeSchema.plugin(AutoIncrement, { inc_field: 'likeid', start_seq: 100 });
module.exports = mongoose.model('like', likeSchema);



