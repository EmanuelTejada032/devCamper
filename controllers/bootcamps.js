const Bootcamp = require('../models/Bootcamp')


// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps = async (req, res, next) => {
    try{
        const bootcamps = await Bootcamp.find()
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            bootcamps
        });

    } catch(err) {
        next(err)
    }
    
}

// @desc    Get specific bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp){
            return res.status(404).json({
                success: false,
                message: 'Bootcamp not found'
            })
        }

        res.status(200).json({
            success: true, 
            bootcamp
        })
    } catch(err){
       next(err)
    }
}

// @desc     Create a new bootcamp
// @route    POST /api/v1/bootcamps
// @access   private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)

        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: 'Error'
        });
    }
       
}

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!bootcamp){
            return res.status(400).json({success:false, message: 'Error on request'})
        }

        res.status(200).json({ success: true, bootcamp})
    }catch (err){
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
    
}

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await  Bootcamp.findByIdAndRemove(req.params.id)
        if(!bootcamp){
            return res.status(404).json({
                success: false,
                message: 'Bootcamp not found'
            })
        }

        res.status(200).json({success: true, message: 'bootcamp deleted'})
    }catch(err){
        res.status(400).json({
            success: false,
            message: 'Error'
        });
    }

}