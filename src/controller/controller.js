import asyncHandler from "express-async-handler";
import User from "../models/model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getUser = asyncHandler(async (req, res) => {
    const users = await User.find()
    res.status(200).json(users)
})

const getUserById = asyncHandler(async (req, res) => { 
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(404)
        throw new Error("User not found")
    }
    res.status(200).json(user)
})

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
    console.log("Login attempt with email:", email);
    if(!email || !password){
        res.status(400)
        throw new Error("Email and password are required")
    }
    const user = await User.findOne({email})
    if(!user){
        console.log("user not found!")
        res.status(401)
        throw new Error("user not found!")
    }
    const checkPassword = await bcrypt.compare(password,user.password)
    if(!checkPassword){
        res.status(401)
        throw new Error("password is incorrect!")
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"30s"})
    res.status(200).json({token})
})

const updateUser = asyncHandler(async (req, res) => { 
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(404)
        throw new Error("User not found")
    }
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