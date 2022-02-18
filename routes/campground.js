const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const Campground = require("../modules/campground");

const { isLoggedIn, isAuthor,validateCampground } = require('../middleware');
const { populate } = require('../modules/campground');

const campgrounds= require('../controllers/campgrounds')
const multer = require('multer');

const { storage } = require('../cloudinary');


const upload = multer({ storage })


// showing all campgrounds in route

router.get('/', catchAsync(campgrounds.index));


//                  making CRUD functionality for campground

// creating new campground

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'),validateCampground, catchAsync(campgrounds.createCampground));
    

// showing one campground in route

router.get("/:id", catchAsync(campgrounds.showCampground));

// editing a campground

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground));

// deleting a campground
router.delete('/:id',isLoggedIn, isAuthor , catchAsync(campgrounds.deleteCampground)); 

//                          ending CRUD functionality for campground




module.exports = router;