import jwt from "jsonwebtoken";

const JWT_SECRET = "soul";

export const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET); 
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};
