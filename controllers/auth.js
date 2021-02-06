const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');



// @desc    Register a user
// @route   post /api/v1/auth
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