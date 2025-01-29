const mongoose=require("mongoose");
const Review=require("./review.js");
const User=require('./user.js');


//listing schema
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        // type:String,
        // default:"https://images.unsplash.com/photo-1515463138280-67d1dcbf317f?auto=format&fit=crop&q=80&w=2069&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set:(v)=> v===""?"https://images.unsplash.com/photo-1515463138280-67d1dcbf317f?auto=format&fit=crop&q=80&w=2069&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
        filename:String,
        url:String
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing.reviews){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

const Listing=mongoose.model("Listing",listingSchema);


module.exports=Listing;