import express from "express";
const route =  express.Router();
import { getUser, getUserById, createUser, loginUser, updateUser, deleteUser } from "../controller/controller.js";
import authMiddleware from "../middlewares/auth.js";
import {loginLimiter} from "../middlewares/rateLimits.js";
import cacheability from "../middlewares/cacheability.js";
import { registerValidation, loginValidation, updateValidation } from "../middlewares/validator.js";
// Route for getting all users and creating a new user
route.get('/',cacheability(300),authMiddleware,getUser)
     .post('/register',loginLimiter,registerValidation, createUser)
     .post('/login',loginLimiter,loginValidation,loginUser);

// Route for operations on a specific user by ID
route.get('/:id', cacheability(300),authMiddleware,getUserById)
     .put('/:id',authMiddleware, updateValidation,updateUser) 
     .delete('/:id',authMiddleware, deleteUser);

export default route;