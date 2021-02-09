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

    sendTokenResponse(user, 200, res);
    
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
        
        
        sendTokenResponse(user, 200, res);
    
});


//Set cookie with the token
const sendTokenResponse = function(user, statusCode, res){
     //Create a Token
     const token = user.getSignedJwtToken();
     const options = {
         expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 1000 * 60 * 60 * 24 ),
         httpOnly: true
     }

     if(process.env.NODE_ENV === 'production'){
        options.secure = true;
     }


     res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })


}

