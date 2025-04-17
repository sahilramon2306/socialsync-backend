const messageModel = require('../model/message.js');
const userModel = require('../model/user.js');
const friendshipModel = require('../model/friendship.js');


//Send a message:-
const sendAmessage =  async (req, res) => {
    const {receiverid, messagetext} = req.body
    console.log(req.body);

    const followerID = req?.user?.id;
    console.log(req.user);

    const existingUser = await userModel.findOne({userid : receiverid})
    if(!existingUser){
        return res.status(200).json({
            success: false, 
            message: "Can't send message. User not exists."
        });
    }

    const existingFriend = await friendshipModel.findOne({followerid : followerID, followedid : receiverid})
    if(!existingFriend){
        return res.status(200).json({
            success: false, 
            message: "Can't send message. Both are not friends."
        });
    }
    
    let newmessage = new messageModel({
        senderid : followerID,
        receiverid : receiverid,
        messagetext : messagetext
    });
    const d = await newmessage.save();

    res.status(200).send({
        success: true, 
        message: `Message successfully sended, from User: ${followerID} to user: ${receiverid}`
    })
}

//---------------------------------------------------------------------------------------------------------


//Get user’s messages:-
const getusersMessages = async (req, res) => {
    const followerID = req?.user?.id;
    console.log(req.user);

    const existingMessage = await messageModel.find({senderid : followerID})
    if(!existingMessage.length){
        return res.status(200).json({
            success: false, 
            message: "User message not exists."
        });
    }

    res.status(200).send({
        success: true, 
        message: "Message fetched successfully" , existingMessage
    })
}

//-----------------------------------------------------------------------------------------------------------








module.exports = {
    sendAmessage : sendAmessage,
    getusersMessages : getusersMessages
}