const jwtService = require('../utils/jwt');


exports.isAuthorized = async (req, res, next) => {
    const authHeader = req.headers['authorization']; 

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwtService.verifyAccessToken(token);
        console.log(decoded.institute_role);
        if (decoded.institute_role == 'manager') {
            return next(); 
        } else {
            return res.status(403).json({ 
                message: "Access denied: You are not a manager" 
            });
        }

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" ,error:error.message||error});
    }
};