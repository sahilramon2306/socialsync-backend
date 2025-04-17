const commentModel = require('../model/comment.js');
const postModel = require('../model/post.js');

//Add a comment
const addComment = async (req, res) => {
    const {postid, commenttext} = req.body
    console.log(req.body);
        
    console.log(req.user);
    const userId = req?.user?.id;
    const existingUserPost = await postModel.findOne({postid : postid})
    if(!existingUserPost){
        return res.status(200).json({ success: false, message: "No posts is there."});
    }

    let newcomment = new commentModel({
        userid : userId,
        postid : postid,
        commenttext : commenttext
    });
    const d=await newcomment.save();
    res.status(200).send({success: true, message: "Comment succesfully posted."})
}
//---------------------------------------------------------------------------------------------------


//Get all comments on a post
const getAllCommentsOnAPost = async (req, res) => {
        const { postid, page = 1, limit = 10 } = req.body;

        console.log(req.body);

        const skip = (page - 1) * limit;

        const getallcomments = await commentModel
            .find({ postid })
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 }); 

        const totalComments = await commentModel.countDocuments({ postid });

        if (!totalComments) {
            return res.status(200).json({ success: false, message: "No posts is there."});
        }

        res.status(200).json({
            success: true,
            message: "Comments fetched successfully.",
            data: getallcomments,
            pagination: {
                totalComments,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalComments / limit)
            }
        });
    }     

//-----------------------------------------------------------------------------------------------------------  


//Delete a comment:-
const deleteAcomment = async (req, res) => {
    const {commentid} = req.body
    console.log(req.body);
    console.log(req.user);
    const userId = req?.user?.id;
    const existingUserComment = await commentModel.findOne({userid : userId})
    if(!existingUserComment){
        return res.status(200).json({ success: false, message: "You don't have any comment."});
    }

    const commentDelete = await commentModel.findOneAndDelete({commentid : commentid})
    if(!commentDelete){
        return res.status(200).json({ success: false, message: "Comment not exists."});
    }
    res.status(200).send({success: true, message: "Comment deleted succesfully."})
}
    






//----------------------------------------------------------------------------------------------------
module.exports = {
    addComment : addComment,
    getAllCommentsOnAPost : getAllCommentsOnAPost,
    deleteAcomment : deleteAcomment
}