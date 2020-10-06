


// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg: 'get all bootcamps'});
}

// @desc    Get specific bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Show specific Bootcamp with id: ${req.params.id}`});
}

// @desc     Create a new bootcamp
// @route    POST /api/v1/bootcamps
// @access   private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Create a bootcamp'});
}

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Update specific Bootcamp with id: ${req.params.id}`});
}

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Delete specific Bootcamp with id: ${req.params.id}`});
    
}