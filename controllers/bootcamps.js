const path = require('path')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../utils/geocoder');


// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps = asyncHandler( async (req, res, next) => {
        res.status(200).json(res.advancedResults);    
});

// @desc    Get specific bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  public
exports.getBootcamp = asyncHandler( async (req, res, next) => {
    
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404))
        }

        res.status(200).json({
            success: true, 
            bootcamp
        })
    
});

// @desc     Create a new bootcamp
// @route    POST /api/v1/bootcamps
// @access   private
exports.createBootcamp = asyncHandler( async (req, res, next) => {

    //Add user to the req.body
    req.body.user = req.user.id;

    //Verify is there is already a Bootcamp published 
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id});

    if(publishedBootcamp && req.user.role !== 'admin'){
        return next(new ErrorResponse(`There is al ready a bootcamp created by user ${req.user.id}`, 400));
    }
    
        const bootcamp = await Bootcamp.create(req.body)

        res.status(201).json({
            success: true,
            data: bootcamp
        });
    
       
})

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  private
exports.updateBootcamp = asyncHandler( async (req, res, next) => {

        let bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404))
        }

         bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, bootcamp})
    
    
})

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = asyncHandler( async (req, res, next) => {
    
        const bootcamp = await  Bootcamp.findById(req.params.id)
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404))
        }

        bootcamp.remove();

        res.status(200).json({success: true, message: 'bootcamp deleted'})
   
})

// @desc    Get bootcamps within radius
// @route   DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @access  private
exports.getBootcampWithinRadius = asyncHandler( async (req, res, next) => {
    
    const {zipcode, distance} = req.params;

    //get latitude and longitud from the geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;


    //calc radius using Radians
    //divide distance by earth radius
    // Earth radius is 3963 miles / 6378 km

    const radius = distance / 3963;

    //Find the bootcamps within the radius 
    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: { $centerSphere: [ [ lng , lat ], radius ]}}
    })

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })

})

// @desc    Upload photo for a bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  private
exports.bootcampPhotoUpload = asyncHandler( async (req, res, next) => {
    
    const bootcamp = await  Bootcamp.findById(req.params.id)
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404))
    }

    if(!req.files){
        return next(new ErrorResponse(`Please add a photo to the bootcamp`, 400))
    }

    const file = req.files.file 

    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`The file should be an image `, 400))
    }

    if(file.size > process.env.MAX_SIZE_UPLOAD){
        return next(new ErrorResponse(`Please upload a file less than ${process.env.MAX_SIZE_UPLOAD}`, 400))
    }

    //create custom file name to avoid conflicts 
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.log(err)
            return next(new ErrorResponse(`Problem with uploaded file`, 500))
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name})
        res.status(200).json({
            success: true,
            photo: file.name
        })
    })

})