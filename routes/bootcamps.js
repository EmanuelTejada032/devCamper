const express = require('express');
const { 
    getBootcamps,
    createBootcamp,
    getBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampWithinRadius
} = require('../controllers/bootcamps');

const router = express.Router();


router.route('/radius/:zipcode/:distance').get(getBootcampWithinRadius)

router.route('/').get(getBootcamps).post(createBootcamp);

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;