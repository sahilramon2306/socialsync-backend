const friendshipModel = require('../model/friendship.js');
const userModel = require('../model/user.js');

//Follow a user:-
const followAuser = async (req, res) => {
    const {followedid} = req.body
    console.log(req.body);
    console.log(req.user);
    const followerID = req?.user?.id;

    const existingUser = await userModel.findOne({userid : followedid})
    if(!existingUser){
        return res.status(200).json({ 
            success: false,
            message: "Followed account not exist."});
    }

    const checkSameUser = await userModel.findOne({_id :  followerID , userid : followedid})
    if(checkSameUser){
        return res.status(200).json({ 
            success: false,
            message: "You can't followed your own account."});
    }

    const alreadyFollowed = await friendshipModel.findOne({followerid :  followerID,  followedid : followedid})
    if(alreadyFollowed){
        return res.status(200).send({
            success: false, 
            message: `User : ${followerID} is already following User : ${followedid}`})
    }

    let newfriendship = new friendshipModel({
        followerid : followerID,
        followedid : followedid
    }); 
    const d=await newfriendship.save();
    res.status(200).send({
        success: true, 
        message: `User : ${followerID} is now following User : ${followedid}`})
}

//---------------------------------------------------------------------------------------------------------------

//Get user’s followers:-
const getUserFollowers = async (req, res) => {
    const { followedid } = req.body;
    console.log(req.body);

    // Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const followersName = await friendshipModel
        .find({ followedid: followedid })
        .skip(skip)
        .limit(limit);

    if (!followedid) {
        return res.status(200).json({ success: false, message: `User : ${followedid} have no follower.` });
    }

    res.status(200).send({
        success: true,
        message: `All followers fetch successfully.`,
        followersName
    });
}


//----------------------------------------------------------------------------------------------------------------

//Get users a user follows:- (get the list of users whom the given userId is following.)
const getUsersAuserFollows = async (req, res) => {
    const followerID = req?.user?.id;
    console.log(req.user);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const existingFollowingUser = await friendshipModel
        .find({ followerid: followerID })
        .skip(skip)
        .limit(limit);

    if (!existingFollowingUser || existingFollowingUser.length === 0) {
        return res.status(200).json({
            success: false,
            message: `User : ${followerID} didn't follow anyone.`,
        });
    }

    res.status(200).send({
        success: true,
        message: `User : ${followerID} all followers fetched successfully.`,
        existingFollowingUser,
    });
}

//---------------------------------------------------------------------------------------------------------------


//Unfollow a user:-
const unfollowAuser = async (req, res) => {
    const {unfollowedid} = req.body;
    console.log(req.body);
    
    const followerID = req?.user?.id;
    console.log(req.user);

    const existingSameUser = await userModel.findOne({_id : followerID , userid : unfollowedid})
    if(existingSameUser){
        return res.status(200).json({
            success: false, 
            message: "You can't unfollow your own id."});
    }

    const existingFollowingUser = await friendshipModel.findOneAndDelete({ followerid: followerID , followedid : unfollowedid})
    if(!existingFollowingUser){
        return res.status(200).json({
            success: false, 
            message: `User : ${followerID} didn't followed User : ${unfollowedid}`});
    }
    res.status(200).json({
        success: false, 
        message: `User : ${followerID} is now unfollowing User : ${unfollowedid}`});

}

//-----------------------------------------------------------------------------------------------------------------------------------






module.exports = {
    followAuser : followAuser,
    getUserFollowers : getUserFollowers,
    getUsersAuserFollows : getUsersAuserFollows,
    unfollowAuser : unfollowAuser
}