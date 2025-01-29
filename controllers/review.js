const Listing=require('../models/listing')
const Review=require('../models/review')

module.exports.createReview=async (req,res)=>{
 
    let list=await Listing.findById(req.params.id).populate('reviews');
    let allreviews=list.reviews;
    // console.log(allreviews);
    let r=allreviews.find((e)=>{
        return e.author.equals(req.user._id);
    })
    // console.log(req.user._id);
    // console.log(r);
    if(r){
        let review=await Review.findById(r._id);
        review.comment=req.body.review.comment;
        review.rating=req.body.review.rating;
        review.createdAt=Date.now();
        await review.save();
        req.flash("success","review updated ");
    }else{
        
    // let list=await Listing.findById(req.params.id);
    

    let review=new Review(req.body.review);
    review.author=req.user._id;
    list.reviews.push(review);
    
    // console.log(req.body);
    // console.log(review);
    await review.save();
    await list.save();
    req.flash('success','review created successfully');
    }
// console.log("done");
res.redirect(`/listings/${req.params.id}`);


};

module.exports.destroyReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash('success','review deleted successfully');
    res.redirect(`/listings/${id}`);

}