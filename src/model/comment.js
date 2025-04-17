const mongoose=require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
  
Schema=mongoose.Schema
let commentSchema=new Schema({
    postid:{
        type:String,
        require:true
    },
    userid:{
        type:String,
        require:true
    },
    commenttext:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

commentSchema.plugin(AutoIncrement, { inc_field: 'commentid', start_seq: 10 });
module.exports = mongoose.model('comment', commentSchema);



