const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
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
    const newListing = new Listing(req.body.listing);
    newListing.Owner = req.user._id;
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
     res.render("listings/edit.ejs", {listing});
 };

 module.exports.updateListing = async (req, res) => {
     let {id} = req.params;
     await Listing.findByIdAndUpdate(id ,{...req.body.listing});
     req.flash("success", "listing updated");
     res.redirect(`/listings/${id}`);
 };

 module.exports.destroyListing = async (req, res)=> {
     let {id} = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     req.flash("success", "Listing Deleted");
     res.redirect("/listings");
 };