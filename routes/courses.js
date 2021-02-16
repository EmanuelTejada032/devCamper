const express = require('express');
const router = express.Router({ mergeParams: true });
const {
      getCourses,
      getCourse,
      addCourse,
      updateCourse,
      deleteCourse
} = require('../controllers/courses');

//Bringing model and middleware for advanced query
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize, isBootcampOwner,isCourseOwner} = require('../middleware/auth');


router.route('/')
      .get(advancedResults(Course, {
            path: 'bootcamp',
            select: 'name description'
      }), getCourses)
      .post(protect,authorize('publisher', 'admin'),isBootcampOwner, addCourse)

router.route('/:id')
      .get(getCourse)
      .put(protect,authorize('publisher', 'admin'),isCourseOwner, updateCourse)
      .delete(protect,authorize('publisher', 'admin'),isCourseOwner, deleteCourse)

module.exports = router;