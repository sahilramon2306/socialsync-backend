const likeModel = require('../model/like.js');
const postModel = require('../model/post.js');


//Like a post:-
const likeApost = async (req, res) => {
    const {postid} = req.body
    console.log(req.body);
    console.log(req.user);
    const userId = req?.user?.id;
    
    const existingUserPost = await postModel.findOne({postid : postid})
    if(!existingUserPost){
        return res.status(200).json({ success: false, message: "No posts is there."});
    }

    const alreadyLiked = await likeModel.findOne({ userid: userId, postid: postid });
    if (alreadyLiked) {
        return res.status(200).json({ success: false, message: "You have already liked this post." });
    }

    let newlike = new likeModel({
        userid : userId,
        postid : postid
    });
    const d=await newlike.save();
    res.status(200).send({success: true, message: "Post like successfull."})
}

//----------------------------------------------------------------------------------------------------------------


//Get all likes on a post:-
const getAllLikesOnApost = async (req, res) => {
        const { postid, page = 1, limit = 10 } = req.body; 
        console.log(req.body);

        const existingPost = await postModel.findOne({ postid: postid });
        if (!existingPost) {
            return res.status(200).json({ success: false, message: "Post does not exist." });
        }

        const totalLikes = await likeModel.countDocuments({ postid });

        const getAllLikes = await likeModel
            .find({ postid })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        if (getAllLikes.length === 0) {
            return res.status(200).json({ success: false, message: "No likes on this post." });
        }

        res.status(200).json({
            success: true,
            message: "Likes fetched successfully.",
            data: getAllLikes,
            pagination: {
                totalLikes,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalLikes / limit)
            }
        });
}; 

//------------------------------------------------------------------------------------------------------------------


//Unlike a post:-
const unlikeApost = async (req, res) => {
        const { postid } = req.body;
        const userId = req?.user?.id;

        console.log(req.body);
        console.log(req.user);

        const existingPost = await postModel.findOne({ postid : postid});
        if (!existingPost) {
            return res.status(200).json({ success: false, message: "Post not exist." });
        }

        const postUnlike = await likeModel.findOneAndDelete({ postid : postid, userid: userId });
        if (!postUnlike) {
            return res.status(200).json({ success: false, message: "You haven't liked this post." });
        }

        return res.status(200).json({ success: true, message: "Unliked the post successfully." });
    } 





module.exports = {
    likeApost : likeApost,
    getAllLikesOnApost : getAllLikesOnApost,
    unlikeApost : unlikeApost
}