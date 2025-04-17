const postModel = require('../model/post.js');
const userModel = require('../model/user.js');

//Create post
const createPost = async (req, res) =>{
    const { content,caption, mediaurl} = req.body;
    //console.log(req.body);
    
    console.log(req.user);
    const userId = req?.user?.id;
    const existingUserid = await userModel.findOne({ _id :userId});
    if (!existingUserid) {
        return res.status(200).json({ success: false, message: `This user id : ${userId}, is not exist in db, so you can't create blog.`});
    }

    let newpost = new postModel({
        userid : userId,
        content : content,
        caption : caption,
        mediaurl : mediaurl
    });

    const d=await newpost.save();
    res.status(200).send({success: true, message: "Post uploaded succesfull."})

}
//-------------------------------------------------------------------------------------------------------

//Get a specific post
const getSpecificPost = async (req, res) => {
    const {postid} = req.body
    console.log(req.body);
    const postdata = await postModel.findOne({postid : postid});
    if (!postdata) {
        return res.status(200).json({ success: false, message: `This post id : ${postId} is not exists in db.`});
    }
    res.status(200).send({success: true, message: "Post fetch successfully.", postdata});
    

}
//-------------------------------------------------------------------------------------------------------

//Get all posts of a user
const getAllPostsOfaUser = async (req, res) => {
    const { userid, page = 1, limit = 10 } = req.body;
    const skip = (page - 1) * limit;
    const [posts, totalPosts] = await Promise.all([
        postModel.find({ userid }).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
        postModel.countDocuments({ userid })
    ]);

    res.status(200).json({
        success: true,
        message: "Posts fetched successfully",
        totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        posts
    });
} 
//------------------------------------------------------------------------------------------------------

//Delete a post
const deleteApost = async (req, res) => {
    const {postid} = req.body
    console.log(req.body);
    const postdeleted = await postModel.findOneAndDelete({postid : postid});
    if(!postdeleted){
        return res.status(200).json({ success: false, message: `This post id : ${postId} is not exists in db.`});
    }
    res.status(200).send({success: true, message: "Post deleted successfully."});

}


//-------------------------------------------------------------------------------------------------------
module.exports = {
    createPost : createPost,
    getSpecificPost : getSpecificPost,
    getAllPostsOfaUser : getAllPostsOfaUser,
    deleteApost : deleteApost
}