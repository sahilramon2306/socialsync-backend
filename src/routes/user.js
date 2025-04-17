const userController = require("../controller/user");
const auth = require("../middleware/auth.js")

//set Rotes for User routers
const setRouter=(app)=>{
    app.post(`/registration`,userController.registration);
    app.post(`/login`,userController.login);
    app.post('/get-User-Profile',auth.isAuthenticate,userController.getUserProfile)
    app.post('/get-all-UserProfile-with-samename',auth.isAuthenticate,userController.getallUserProfilewithsamename)
    app.post('/update-password',auth.isAuthenticate,userController.updatePassword)
    app.post('/delete-UserAccount',auth.isAuthenticate,userController.deleteUserAccount)
}

module.exports={
    setRouter:setRouter
}