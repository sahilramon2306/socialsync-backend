const likeController = require("../controller/like.js");
const auth = require("../middleware/auth.js")

//set Rotes for Post routers
const setRouter=(app)=>{
    app.post(`/like-A-post`,auth.isAuthenticate,likeController.likeApost);
    app.post(`/get-All-Likes-On-A-post`,auth.isAuthenticate,likeController.getAllLikesOnApost);
    app.post(`/unlike-A-post`,auth.isAuthenticate,likeController.unlikeApost);
}

module.exports={
    setRouter:setRouter
}