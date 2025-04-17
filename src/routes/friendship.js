const friendshipController = require("../controller/friendship.js");
const auth = require("../middleware/auth.js")

//set Rotes for Post routers
const setRouter=(app)=>{
    app.post(`/follow-A-user`,auth.isAuthenticate,friendshipController.followAuser);
    app.post(`/get-User-Followers`,auth.isAuthenticate,friendshipController.getUserFollowers);
    app.get(`/get-Users-A-user-Follows`,auth.isAuthenticate,friendshipController.getUsersAuserFollows);
    app.post(`/unfollow-A-user`,auth.isAuthenticate,friendshipController.unfollowAuser);
}

module.exports={
    setRouter:setRouter
}