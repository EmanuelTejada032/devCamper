const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler')

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