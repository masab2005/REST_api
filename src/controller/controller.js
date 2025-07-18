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
    // Parse pagination parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Validate pagination parameters
    if (page < 1) {
        res.status(400);
        throw new Error("Page must be at least 1");
    }
    
    if (limit < 1 || limit > 100) {
        res.status(400);
        throw new Error("Limit must be between 1 and 100");
    }
    
    // Calculate skip value
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const [results, totalCount] = await Promise.all([
        User.find().skip(skip).limit(limit),
        User.countDocuments()
    ]);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    
    // Return paginated results with metadata
    res.status(200).json({
        results,
        pagination: {
            totalCount,
            totalPages,
            currentPage: page,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    });
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

/**
 * Login user and generate tokens
 * @route POST /api/login
 * @access Public
 */
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

    // Generate access token
    const accessToken = generateAccessToken(user._id);
    
    // Generate refresh token
    const refreshToken = jwt.sign(
        {id: user._id},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: "7d"}
    );

    // Save refresh token to database
    await User.findByIdAndUpdate(user._id, { refreshToken });
    
    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
        accessToken
    });
})

/**
 * Refresh access token
 * @route POST /api/refresh-token
 * @access Public (with refresh token)
 */
const refreshToken = asyncHandler(async (req, res) => {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
        res.status(401);
        throw new Error("Refresh token is required");
    }
    
    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Check if user exists and token matches
        const user = await User.findById(decoded.id);
        
        if (!user || user.refreshToken !== refreshToken) {
            res.status(403);
            throw new Error("Invalid refresh token");
        }
        
        // Generate new access token
        const accessToken = generateAccessToken(user._id);
        
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(403);
        throw new Error("Invalid or expired refresh token");
    }
});

/**
 * Logout user
 * @route POST /api/logout
 * @access Public
 */
const logout = asyncHandler(async (req, res) => {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
        // Find user with this refresh token and clear it
        await User.findOneAndUpdate(
            { refreshToken },
            { refreshToken: null }
        );
    }
    
    // Clear the cookie
    res.clearCookie('refreshToken');
    
    res.status(200).json({ message: "Logged out successfully" });
});

/**
 * Generate access token
 * @private
 */
const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );
};

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
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    
    res.status(200).json({ message: `User with id ${req.params.id} deleted successfully` })
})            

export { getUser, getUserById, createUser, loginUser, updateUser, deleteUser, refreshToken, logout }