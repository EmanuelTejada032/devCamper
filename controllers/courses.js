const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');



exports.getCourses = asyncHandler(async(req, res, next) =>{
    let query;

    if(req.params.bootcampId){
        query = Course.find({bootcamp: req.params.bootcampId})
    } else {
        query = Course.find()
    }
    
    const courses = await query.populate({
        path: 'bootcamp',
        select: 'name description'
    });
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })

})