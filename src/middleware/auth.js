const jwt = require("jsonwebtoken");

const isAuthenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("toked decoded", decoded);
        
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};

module.exports = {
    isAuthenticate:isAuthenticate
}
