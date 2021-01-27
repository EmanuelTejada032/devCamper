const errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        success: false,
        err: err.message
    })
}


module.exports = errorHandler;