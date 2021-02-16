const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');



//Protect function 
exports.protect = asyncHandler(async(req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.token){
    //     token = req.cookies.token;
    // }

    //Make sure token exist
    if(!token){
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try{
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        next()
    }catch(err){
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

});

//Allow access to routes to an specific roles
exports.authorize = (...roles) => {
    return (req, res ,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route `, 403))
        }
        next();
    }
}

//Verify BootcampOwner
exports.isBootcampOwner = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404))
    }
    // console.log(bootcamp)
    if (!bootcamp.user.equals(req.user._id) && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to access this route`, 400));
    }
    next();
});

exports.isCourseOwner = asyncHandler(async(req, res, next) => {
    const course = await Course.findById(req.params.id);
    if(!course){
        return next(new ErrorResponse(`Course not found with id: ${req.params.id}`, 404))
    }
    // console.log(bootcamp)
    if (!course.user.equals(req.user._id) && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user._id} is not authorized to modify this course ${req.params.id}`, 400));
    }
    next();
});



