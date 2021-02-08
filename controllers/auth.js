const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    register a user
// @route   post /api/v1/auth/register
// @access  public
exports.register = asyncHandler(async(req, res ,next) =>{
    const { name, email, password, role } = req.body
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    //Create a Token
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        msg: "User created successfuly",
        user,
        token
    })
    
});

// @desc    Login a user
// @route   post /api/v1/auth/Login
// @access  public
exports.login = asyncHandler(async(req, res ,next) =>{
    const {  email, password } = req.body
    
    //check there is email and password
    if(!email || !password){
        return next(new ErrorResponse('Please add email and password', 400));
    }

    //find user by email
    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    //Check if password match with user
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }
        
        
        //Create a Token
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            msg: `Welcome ${user.name}`,
            token
        })
    
});

