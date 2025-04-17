const mongoose=require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
  
Schema=mongoose.Schema
let messageSchema = new Schema({
    senderid: {
        type: String,
        require:true
    },
    receiverid: {
        type: Number,
        require:true
    },
    messagetext: {
        type: String,
        require:true
    },
    isread: {
        type: Boolean,
        defaultValue: false, // 0 = Unread, 1 = Read
    },
    sentAt:{
        type:Date,
        default:Date.now
    }
})

messageSchema.plugin(AutoIncrement, { inc_field: 'messageid', start_seq: 300 });
module.exports = mongoose.model('message', messageSchema);



