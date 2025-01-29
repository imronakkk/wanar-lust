const express=require('express');
const router=express.Router({mergeParams:true});
const Review=require("../models/review.js");
const wrapAsync=require('../utils/wrapAsync/wrapAsync.js');
const Listing=require("../models/listing.js");
const { reviewValidation, isOwnedReview } = require('../middleware.js');
const {islogged}=require('../middleware.js');
const reviewController=require('../controllers/review.js');



// --------------------review post ------------------
router.post("/",islogged,reviewValidation,wrapAsync(reviewController.createReview));


// ---------------------------delete review-----------------
router.delete("/:reviewId",islogged,isOwnedReview,wrapAsync(reviewController.destroyReview));


module.exports=router;