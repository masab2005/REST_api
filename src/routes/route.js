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
import { registerValidation, loginValidation, updateValidation, paginationValidation, sanitizeKeys } from "../middlewares/validator.js";

// Public routes
route.use(sanitizeKeys); //prevent sql injection
route.post('/register',  registerValidation, createUser)
     .post('/login',  loginValidation, loginUser)
     .post('/refresh-token', refreshToken)
     .post('/logout', logout);

// Protected routes
route.get('/getUsers', cacheability(300), authMiddleware, paginationValidation, getUser)
     .get('/getUserById/:id', cacheability(300), authMiddleware, getUserById)
     .put('/updateUser/:id', authMiddleware, updateValidation, updateUser) 
     .delete('/deleteUser/:id', authMiddleware, deleteUser);

export default route;