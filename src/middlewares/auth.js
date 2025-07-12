import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config()

const authMiddleware = asyncHandler(async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        res.status(401)
        throw new Error("Access token is missing. Please provide a valid Bearer token")
    }
    
    const accessToken = req.headers.authorization.split(" ")[1]
    
    if (!accessToken) {
        res.status(401)
        throw new Error("Access token is required")
    }
    
    try {
        // Verify access token
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401)
        if (error.name === 'TokenExpiredError') {
            throw new Error("Access token has expired. Please refresh your token")
        }
        throw new Error("Invalid access token")
    }
})

export default authMiddleware