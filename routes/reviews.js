const express = require("express");
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

const router = express.Router({ mergeParams: true });

//Bringing model and middleware for advanced query
const Review = require("../models/Review");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize, isReviewOwner } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user"), addReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("user", "admin"), isReviewOwner, updateReview)
  .delete(protect, authorize("user", "admin"), isReviewOwner, deleteReview);

module.exports = router;