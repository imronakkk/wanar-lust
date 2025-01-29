const Listing=require('../models/listing');
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeoCoding({accessToken: mapToken});

module.exports.renderNewForm=async(req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.createNewListing=async(req,res,next)=>{
let result=await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
      })
        .send();
        console.log(result.body.features[0].geometry);
       
    // console.log(req.user);
    if(req.file){
        // console.log(req.file);
        // console.log(req.file.path);
        req.body.image=req.file.path;
    }
    // console.log(req.file);
   //  console.log(req.body);
    const newlisting=Listing({...req.body,owner:req.user});
    // console.log(newlisting);
    newlisting.image.filename=req.file.filename;
    newlisting.image.url=req.file.path;
    newlisting.geometry=result.body.features[0].geometry;
    await newlisting.save();
    req.flash('success','new listing created');
    res.redirect("/listings");
};

module.exports.showAllListings=async (req,res)=>{
    let allListings=await Listing.find();
    // console.log(allListings);
    res.render("listings/index.ejs",{allListings});
};

module.exports.showListing=async (req,res)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id)
    .populate({
        path:'reviews',
    populate:{
        path:'author'
    }})
    .populate('owner');
    // console.log(listing);
    if(!listing){
        req.flash('error','listing does not exist');
        res.redirect('/listings');
    }else{

        res.render("listings/show.ejs",{listing});
    }
    // console.log(listing);
};

module.exports.renderEditForm=async (req,res,next)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash('error','listing does not exist');
        res.redirect('/listings');
    }else{
        let previewUrl=listing.image.url;
        previewUrl=previewUrl.replace('/upload','/upload/w_250');
        console.log(previewUrl);
        res.render("listings/edit.ejs",{listing,previewUrl});
    }
};

module.exports.updateListing=async (req,res,next)=>{
    // Listing.updateOne({_id:`${req.params.id}`},req.body)
 
         let id=req.params.id;
        // console.log({...req.body});
       let listing= await Listing.findByIdAndUpdate(id,{$set:req.body});
        if(req.file){
            // console.log(listing,"..",req.file);
            
            listing.image.url=req.file.path;
            listing.image.filename=req.file.filename;
            await listing.save();
        }
        req.flash('success','updated successfully');
       
        res.redirect(`/listings/${id}`);
  
};

module.exports.destroyListing=(req,res)=>{
    Listing.findByIdAndDelete(req.params.id)
    .then(()=>{
        console.log("destroyed");
    })
    .catch((err)=>{
        console.log(err);
    })
    req.flash('success','deleted listing successfully');
    res.redirect("/listings");
};