const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync/wrapAsync.js');
const {islogged, isOwned, listingValidation, userReviewFinder}=require('../middleware.js');
const listingController=require('../controllers/listing.js');
const multer=require('multer');
const {storage}=require('../cloudinaryConfig.js');
const upload = multer({ storage });
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeoCoding({accessToken: mapToken});


//new route
router
.route('/new')
.get(islogged,wrapAsync(listingController.renderNewForm))
.post(islogged,upload.single('image'),listingValidation,wrapAsync(listingController.createNewListing));


//all listings
router.get("/",wrapAsync(listingController.showAllListings));
//listings show route
router.get("/:id",userReviewFinder,wrapAsync(listingController.showListing));

//edit route
router.route('/:id/edit')
.get(islogged,isOwned,wrapAsync(listingController.renderEditForm))
.put(islogged,isOwned,upload.single('image'),listingValidation, wrapAsync(listingController.updateListing));

//delete listing
router.delete("/:id/destroy",islogged,isOwned,listingController.destroyListing);


module.exports=router;