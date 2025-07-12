import express from "express";
const route = express.Router();
import { 
    getUser, 
    getUserById, 
    createUser, 
    loginUser, 
    updateUser, 
    deleteUser,
    refreshToken,
    logout
} from "../controller/controller.js";
import authMiddleware from "../middlewares/auth.js";
import {loginLimiter} from "../middlewares/rateLimits.js";
import cacheability from "../middlewares/cacheability.js";
import { registerValidation, loginValidation, updateValidation } from "../middlewares/validator.js";

// Public routes
route.post('/register', loginLimiter, registerValidation, createUser)
     .post('/login', loginLimiter, loginValidation, loginUser)
     .post('/refresh-token', refreshToken)
     .post('/logout', logout);

// Protected routes
route.get('/getUsers', cacheability(300), authMiddleware, getUser)
     .get('/getUserById/:id', cacheability(300), authMiddleware, getUserById)
     .put('/updateUser/:id', authMiddleware, updateValidation, updateUser) 
     .delete('/deleteUser/:id', authMiddleware, deleteUser);

export default route;