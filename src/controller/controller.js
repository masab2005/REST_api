import asyncHandler from "express-async-handler";
import User from "../models/model.js";
import bcrypt from "bcrypt";

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

export { getUser, getUserById, createUser, updateUser, deleteUser }