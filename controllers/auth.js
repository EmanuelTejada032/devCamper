const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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


// @desc    Get current User 
// @route   Get /api/v1/auth/me
// @access  Private

exports.getMe = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
});


// @desc    Log out a  user
// @route   Get /api/v1/auth/logout
// @access  Private

exports.logout = asyncHandler(async(req, res, next) => {
    //Setting token to none
    res.clearCookie("token")

    res.status(200).json({
        success: true,
        message: 'User logged out'
    })
});

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };
  
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({
      success: true,
      data: user,
    });
  });

// @desc    Update Password 
// @route   Put /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async(req, res, next) => {


    const user = await User.findById(req.user.id).select('+password');

    if(!(await user.comparePassword(req.body.currentPassword))){
        return next(new ErrorResponse('Password is incorrect', 401))
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// @desc    Forgot Password
// @route   Post /api/v1/auth/forgotpassword
// @access  Public

exports.forgotPassword = asyncHandler(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email});

    if(!user){
        return next(new ErrorResponse('There is not user with that email', 400));
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();
    
    await user.save({validateBeforeSave: false});

    // Create reset url
  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset 
  of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
     
});


// @desc    Reset password
// @route   PUT /api/v1/auth/forgotpassword/:resettoken
// @access  Public

exports.resetPassword = asyncHandler(async(req, res, next) => {
    //Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt : Date.now()}
    });

    if(!user){
        return next(new ErrorResponse('Invalid token', 400));
    }

    //set new password and get rid of resettoken on user and expire field
    user.password = req.body.password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

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