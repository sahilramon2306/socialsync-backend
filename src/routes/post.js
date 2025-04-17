const postController = require("../controller/post.js");
const auth = require("../middleware/auth.js")

//set Rotes for Post routers
const setRouter=(app)=>{
    app.post(`/create-Post`,auth.isAuthenticate,postController.createPost);
    app.post(`/get-Specific-Post`,auth.isAuthenticate,postController.getSpecificPost);
    app.post(`/get-All-Posts-Of-a-User`,auth.isAuthenticate,postController.getAllPostsOfaUser);
    app.post(`/delete-A-post`,auth.isAuthenticate,postController.deleteApost);
}

module.exports={
    setRouter:setRouter
}