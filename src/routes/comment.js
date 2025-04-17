const commentController = require("../controller/comment.js");
const auth = require("../middleware/auth.js")

//set Rotes for Post routers
const setRouter=(app)=>{
    app.post(`/add-Comment`,auth.isAuthenticate,commentController.addComment);
    app.post(`/get-All-Comments-On-A-Post`,auth.isAuthenticate,commentController.getAllCommentsOnAPost);
    app.post(`/delete-A-Comment`,auth.isAuthenticate,commentController.deleteAcomment);
}

module.exports={
    setRouter:setRouter
}