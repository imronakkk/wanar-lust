const Listing=require('./models/listing');
const Review=require('./models/review');
const ExpressError=require('./utils/ExpresError/ExpressError.js');
const {listingSchema}=require('./validation_schema/Schema.js');
const {reviewSchema}=require('./validation_schema/Schema.js');

module.exports.islogged=(req,res,next)=>{
    console.log('isLogged middleware');
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","user must be logged in");
        res.redirect('/logIn');
    }else{
           next();
    }
    
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    console.log("saveRedirectUrl mdw");
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    // console.log(res.locals.redirectUrl);
    next();
}

module.exports.isOwned=async (req,res,next)=>{
    console.log('isOwned mdw');
    let{id}=req.params;
    let listing= await Listing.findById(id);
    // console.log(req.user);
    // console.log(listing);
    if(req.user._id.equals(listing.owner)){
        next();
    }else{
        req.flash('error','you are not authorize to do the operation');
        // res.redirect(`${req.originalUrl}`);
        res.redirect(`/listings/${id}`);
    }
}
module.exports.isOwnedReview=async(req,res,next)=>{
    console.log('isOwnedReview mdw');
    let uId=req.user._id;
    let{id}=req.params;
    let review=await Review.findById(req.params.reviewId);
    if(uId.equals(review.author)){
        next();
    }else{
        req.flash('error',"this not your review");
        res.redirect(`/listings/${id}`)
    }
}

module.exports.listingValidation=(req,res,next)=>{
    console.log("listingValidation mdw");
    // req.body.image='';
    const {error}=listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg=error.details.map((e)=>e.message).join(',');
        throw new ExpressError(315,errMsg);
    }
    next()

}

module.exports.reviewValidation=(req,res,next)=>{
    console.log("reviewValidation mdw");
    const {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((e)=>e.message).join(",");
        throw new ExpressError(315,errMsg);
    }
    next();
}


module.exports.userReviewFinder=async(req,res,next)=>{
    console.log("userReviewFinder mdw");
    let list=await Listing.findById(req.params.id).populate('reviews');
    if(list && req.isAuthenticated()){
            let allReview=list.reviews;
            // console.log(allReview);
            // console.log(req.user._id);
            let userReview=allReview.find((e)=>{
                return e.author.equals(req.user._id);
            })
            if(userReview){
                // console.log(userReview);
                res.locals.reviewFind=userReview;
            }else{
                res.locals.reviewFind=null;

            }
    }
    next();
}