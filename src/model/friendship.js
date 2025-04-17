const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
  
Schema=mongoose.Schema
let friendshipSchema = new Schema({
    followerid:{
        type:String,
        require:true
    },
    followedid:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

friendshipSchema.plugin(AutoIncrement, { inc_field: 'friednshipid', start_seq: 1001 });
module.exports = mongoose.model('friendship', friendshipSchema);



