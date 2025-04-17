const mongoose=require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
  
Schema=mongoose.Schema
let postSchema=new Schema({
    userid:{
        type:String,
        require:true
    },
    content:{
        type:String,
    },
    caption:{
        type:String
    },
    mediaurl:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

postSchema.plugin(AutoIncrement, { inc_field: 'postid', start_seq: 1 });
module.exports = mongoose.model('post', postSchema);

