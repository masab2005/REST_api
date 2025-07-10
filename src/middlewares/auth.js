import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config()

const authMiddleware = asyncHandler(async (req,res,next)=>{
    
    console.log(req.headers.authorization)
    const token = req.headers.authorization.split(" ")[1]
    console.log(token)
    if(!token){
        res.status(401)
        throw new Error("Token is unauthorized or expired")
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
})

export default authMiddleware