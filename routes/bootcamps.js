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
const { protect, authorize } = require('../middleware/auth');

//Include other resource routers
const courseRouter = require('./courses');

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)


router.route('/radius/:zipcode/:distance').get(getBootcampWithinRadius)

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect,authorize('publisher', 'admin'),createBootcamp);

router.route('/:id/photos').put(protect, authorize('publisher', 'admin'),bootcampPhotoUpload)

router.route('/:id').get(getBootcamp).put(protect, authorize('publisher', 'admin'), updateBootcamp).delete(protect,authorize('publisher', 'admin'),deleteBootcamp);




module.exports = router;