const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next) => {
    let error = {...err}
    error.message = err.message
    
    // console.log(err);

    //Moongose Bad objectID 
    if(err.name === 'CastError'){
        const message = `Bootcamp not found with id: ${err.value}`
        error = new ErrorResponse(message, 404)
    }

    //Moongose Duplicated Key
    if(err.code === 11000){
        const message = `Please avoid duplicated key:  ${err.keyValue.name}`
        error = new ErrorResponse(message, 400)
    }

    //Mongoose validation errors
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map( el => el.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        err: error.message || 'Server Error'
    })
}


module.exports = errorHandler;