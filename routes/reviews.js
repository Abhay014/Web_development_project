const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas.js');


const Campground = require("../modules/campground");
const Review = require("../modules/review");

const {validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const reviews = require('../controllers/reviews')


//                          starting CRUD functionality for Reviews
// adding the review
router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview));

// deleting the review
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;