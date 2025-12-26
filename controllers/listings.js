const Listing = require("../models/listing.js");
const opencage = require('opencage-api-client');
const apiKey = process.env.OPENCAGE_API_KEY;

module.exports.index = async (req, res) => {
    let {search} = req.query;
    let allListings;
    if(search) {
        const regex = new RegExp(search, 'i');
        allListings = await Listing.find({ $or: [{title: regex},
                            {description: regex}, {category: regex}, 
                            {country: regex}, {location: regex}]});
    }else {
        allListings = await Listing.find({});
    }
    res.render("listings/index.ejs", {allListings});
};

module.exports.catIndex = async (req, res) => {
    const {category} = req.params;
    const catListings = await Listing.find({category});
    res.render("listings/catIndex.ejs", {catListings});
};

module.exports.newform = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("Owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    };
    
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async(req, res) =>{
    // 1. Get the address from the form
    const address = req.body.listing.location;

    let url = req.file.path;
        let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.Owner = req.user._id;
    newListing.image = { url, filename };

    // 2. Request coordinates from OpenCage
    const data = await opencage.geocode({ q: address, key: apiKey});
    
    
    if (data && data.results && data.results.length > 0) {
        const place = data.results[0];
        newListing.geometry = {
            type: "Point",
            coordinates: [place.geometry.lng, place.geometry.lat]
        }
    }else {
        newListing.geometry = {
            type: "Point",
            coordinates: [0, 0]
        }
    }
    
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

 module.exports.editform = async (req, res) => {
     let {id} = req.params;
     const listing = await Listing.findById(id);
     if(!listing) {
         req.flash("error", "Listing you requested for does not exist!");
         return res.redirect("/listings");
     };
     let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_150/");
     res.render("listings/edit.ejs", {listing, originalImageUrl});
 };

 module.exports.updateListing = async (req, res) => {
     let {id} = req.params;
     let listing = await Listing.findById(id);

    const address = req.body.listing.location;

    const data = await opencage.geocode({ q: address, key: apiKey});
    
    
    if (data && data.results && data.results.length > 0) {
        const place = data.results[0];
        listing.geometry = {
            type: "Point",
            coordinates: [place.geometry.lng, place.geometry.lat]
        }
    }else {
        listing.geometry = {
            type: "Point",
            coordinates: [0, 0]
        }
    }

    await listing.save();

     if(typeof req.file !== "undefined"){
         let url = req.file.path;
         let filename = req.file.filename;
         listing.image = {url, filename};
         await listing.save();
     }
     req.flash("success", "listing updated");
     res.redirect(`/listings/${id}`);
 };

 module.exports.destroyListing = async (req, res)=> {
     let {id} = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     req.flash("success", "Listing Deleted");
     res.redirect("/listings");
 };