import express from "express";
const route =  express.Router();
import { getUser, getUserById, createUser, updateUser, deleteUser } from "../controller/controller.js";

// Route for getting all users and creating a new user
route.get('/', getUser)
     .post('/', createUser);

// Route for operations on a specific user by ID
route.get('/:id', getUserById)
     .put('/:id', updateUser)
     .delete('/:id', deleteUser);

export default route;