const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../utils/geocoder')

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps = asyncHandler( async (req, res, next) => {
    
        const bootcamps = await Bootcamp.find()
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            bootcamps
        });

   
    
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
    
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404))
        }

        res.status(200).json({ success: true, bootcamp})
    
    
})

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = asyncHandler( async (req, res, next) => {
    
        const bootcamp = await  Bootcamp.findByIdAndRemove(req.params.id)
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404))
        }

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