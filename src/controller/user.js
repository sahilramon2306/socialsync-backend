const userModel = require('../model/user.js');
const passwordLib = require("../libs/passwordLib.js")
const tokenLib = require('../libs/tokenLib.js')
require("dotenv").config(); // Ensure dotenv is loaded

// User registration
const registration = async (req, res) => {
   try{
    const { name, email, mobilenumber, password, gender, age, profilepictureurl, bio} = req.body;
   console.log(req.body);
   const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(200).json({ success: false, message: "This email is already registered, try a new email." });
    }
    const hashedPassword = await passwordLib.getHashed(password);

    let newUser = new userModel({
       name: name,
       email: email,
       mobilenumber :mobilenumber,
       password: hashedPassword, // Store hashed password
       gender: gender,
       age: age,
       profilepictureurl: profilepictureurl,
       bio: bio
    });
    await newUser.save();
    res.status(200).send({success: true, message:`User-${name}, registered successfully.`});
   }catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ 
        success: false, 
        message: "An error occurred during registration. Please try again later." 
    });
} 
}

//-------------------------------------------------------------------------------------------------

// Login
const login = async (req, res) => {
  try {
      const { email, mobilenumber, password } = req.body;
      if (!email && !mobilenumber) {
          return res.status(400).json({success: false, message: "Please provide either email or mobile number.", data: {}});
      }
      const existingUser = await userModel.findOne({$or: [{ email }, {mobilenumber}]});  // Find user by email or mobile number});

      if (!existingUser) {
          return res.status(200).json({success: false, message: "Email or mobile number is not registered", data: {}});
      }
      const isMatch = await passwordLib.passwordVerify(password, existingUser.password);
      if (!isMatch) {
          return res.status(200).json({
              success: false,
              message: "Incorrect password"
          });
      }
      const token = await tokenLib.generateToken(existingUser);

      res.status(200).json({
          success: true,
          message: "Login successful!",
          data: { token }
      });

  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
          success: false,
          message: "An error occurred during login. Please try again later.",
          data: {}
      });
  }
};
//-----------------------------------------------------------------------------------------------------


//Get user profile
const getUserProfile = async (req, res) =>{
    const { email, mobilenumber} = req.body;
    if (!email && !mobilenumber) {
      return res.status(400).json({success: false, message: "Please provide either email or mobile number."});
    }
    const existingUser = await userModel.findOne({$or: [{ email }, {mobilenumber}]}); 
    if (!existingUser) {
      return res.status(200).json({success: false, message: "User not exists."});
    }
    res.status(200).json({
      success: true,
      message: "User data fetch success.",
      existingUser
  });
}


//-----------------------------------------------------------------------------------------------------


//Get all user profile with same name.
const getallUserProfilewithsamename = async (req, res) =>{
  const {name} = req.body;
  console.log(req.body);
  const existingUser = await userModel.find({name : name})
  
  if (!existingUser.length) {
    return res.status(400).json({success: false, message: "User not exists."});
  }
  
  res.status(200).json({
    success: true,
    message: "Users data fetch success.",
    existingUser
})
}


//-----------------------------------------------------------------------------------------------------
//Password Update
const updatePassword = async(req,res) => {
  const {email, mobilenumber, password} = req.body;
  console.log(req.body);
  if (!email && !mobilenumber) {
    return res.status(400).json({success: false, message: "Please provide either email or mobile number."});
  }
  const existingUser = await userModel.findOne({$or: [{ email }, {mobilenumber}]}); 
  if (!existingUser) {
      return res.status(400).json({ success: false, message: "Email or mobile number is not registered." });
  }
  if(!password){
    return res.status(400).send({success: false, message: "Provide proper data."});
  }
  const hashedPassword = await passwordLib.getHashed(password);
  const updatepassword = await userModel.findOneAndUpdate(
    { $or: [{ email }, { mobilenumber }] },
    { $set: { password: hashedPassword } },
    { new: true }
  );

  if (!updatepassword) {
    return res.status(404).send({success: false, message: `Password not updated`});
  }
  res.status(200).send({ success: true, message: "Password updated successfully", updatepassword });

}

//-----------------------------------------------------------------------------------------------------

//Delete user account
const deleteUserAccount =  async(req,res) =>{
  const {email, mobilenumber, password} = req.body;
  console.log(req.body);
  if (!email && !mobilenumber) {
    return res.status(400).json({success: false, message: "Please provide either email or mobile number."});
  }
  const existingUser = await userModel.findOne({$or: [{ email }, {mobilenumber}]}); 
  if (!existingUser) {
    return res.status(400).json({ success: false, message: "User not exists." });
  }
  const isMatch = await passwordLib.passwordVerify(password, existingUser.password);
      if (!isMatch) {
          return res.status(200).json({success: false, message: "Incorrect password, you can't delete this account."});
      }
   
  const deletedUser = await userModel.findOneAndDelete({ $or: [{ email }, { mobilenumber }] });
  if (!deletedUser) {
    return res.status(404).json({ success: false, message: "User account not deleted." });
  }
  res.status(200).json({ success: true, message: "User account deleted successfully." });
}

//---------------------------------------------------------------------------------------------------------------



module.exports = {
  registration: registration,
  login: login,
  getUserProfile: getUserProfile,
  getallUserProfilewithsamename: getallUserProfilewithsamename,
  updatePassword : updatePassword,
  deleteUserAccount: deleteUserAccount
};
