const jwt = require("jsonwebtoken");

const generateToken = async(user)=>{
    const token = jwt.sign(
        { id: user._id, email: user.email, }, 
        process.env.JWT_SECRET, 
        { expiresIn: "30m" } // Token expires in 30 minutes
    );
    return token;
}

module.exports = {
    generateToken:generateToken
}