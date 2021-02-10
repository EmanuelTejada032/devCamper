const express = require('express');
const { 
    getBootcamps,
    createBootcamp,
    getBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampWithinRadius,
    bootcampPhotoUpload
  
} = require('../controllers/bootcamps');

//Bringing model and middleware for advanced query
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults')


const router = express.Router();

//Bring the protect middleware with JWT
const { protect } = require('../middleware/auth');

//Include other resource routers
const courseRouter = require('./courses');

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)


router.route('/radius/:zipcode/:distance').get(getBootcampWithinRadius)

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect,createBootcamp);

router.route('/:id/photos').put(protect,bootcampPhotoUpload)

router.route('/:id').get(getBootcamp).put(protect,updateBootcamp).delete(protect,deleteBootcamp);




module.exports = router;