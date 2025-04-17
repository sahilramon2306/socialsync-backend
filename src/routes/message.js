const messageController = require("../controller/message.js");
const auth = require("../middleware/auth.js")

//set Rotes for Post routers
const setRouter=(app)=>{
    app.post(`/send-A-message`,auth.isAuthenticate,messageController.sendAmessage);
    app.get(`/get-users-Messages`,auth.isAuthenticate,messageController.getusersMessages);
}

module.exports={
    setRouter:setRouter
}