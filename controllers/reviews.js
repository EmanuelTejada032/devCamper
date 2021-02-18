const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Review = require('../models/Review')


//@desc      Get all reviews for a bootcamp
//@route     GET /api/v1/reviews/ 
//@route     GET /api/v1/bootcamps/:bootcampId/reviews
//@access    Public
exports.getReviews = asyncHandler(async(req, res, next) => {

    if(req.params.bootcampId){
        const reviews = await Review.find({bootcamp: req.params.bootcampId});

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        res.status(200).json(res.advancedResults)
    }
});


//@desc      Get all reviews for a bootcamp
//@route     GET /api/v1/reviews/ 
//@route     GET /api/v1/bootcamps/:bootcampId/reviews
//@access    Public

exports.getReview = asyncHandler(async(req, res, next) => { 
        const review = await Review.findById(req.params.id);

        if(!review){
            return next(new ErrorResponse(`Review ${req.params.id} not found`, 404))
        }

        return res.status(200).json({
            success: true,
            data: review
        });
});