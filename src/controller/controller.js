import asyncHandler from "express-async-handler";
import User from "../models/model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Get all users with pagination
 * @route GET /api/users
 * @access Private
 */
const getUser = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await userService.getUsers({ page, limit });
    res.status(200).json(result);
});

/**
 * Get user by ID
 * @route GET /api/users/:id
 * @access Private
 */
const getUserById = asyncHandler(async (req, res) => { 
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(404)
        throw new Error("User not found")
    }
    res.status(200).json(user)
})

/**
 * Create a new user
 * @route POST /api/register
 * @access Public
 */
const createUser = asyncHandler(async (req, res) => { 
    const {name, email, password}  = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error("Name, email, and password are required")
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    res.status(201).json(user) 
})

const loginUser = asyncHandler(async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        res.status(400)
        throw new Error("Email and password are required")
    }
    
    const user = await User.findOne({email})
    if(!user){
        res.status(401)
        throw new Error("user not found!")
    }
    
    const checkPassword = await bcrypt.compare(password,user.password)
    if(!checkPassword){
        res.status(401)
        throw new Error("password is incorrect!")
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"10m"})
    res.status(200).json({token})
})

const updateUser = asyncHandler(async (req, res) => { 
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(404)
        throw new Error("User not found")
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    req.body.password = hashedPassword
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedUser)
})

const deleteUser = asyncHandler(async (req, res) => { 
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(404)
        throw new Error("User not found")
    }
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: `User with id ${req.params.id} deleted successfully` })
})            

export { getUser, getUserById, createUser,loginUser, updateUser, deleteUser }