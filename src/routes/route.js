import express from "express";
const route =  express.Router();
import { getUser, getUserById, createUser, loginUser, updateUser, deleteUser } from "../controller/controller.js";
import authMiddleware from "../middlewares/auth.js";
import {loginLimiter} from "../middlewares/rateLimits.js";
// Route for getting all users and creating a new user
route.get('/',authMiddleware,getUser)
     .post('/', createUser)
     .post('/login',loginLimiter,loginUser);

// Route for operations on a specific user by ID
route.get('/:id', getUserById)
     .put('/:id', updateUser)
     .delete('/:id', deleteUser);

export default route;