const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
app.use(express.urlencoded({extended: true}));
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema} = require("./schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, error);
    } else {
        next();
    }
}

main().then((res) => {
    console.log("connection successful");
}) 
.catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
};

//home page
app.get("/listings", wrapAsync(async (req, res) => {
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
}));

//new listing
app.get("/listings/add", (req, res) =>{
    res.render("listings/new.ejs");
});

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

//create route
app.post("/listing", validateListing, wrapAsync( async(req, res) =>{
    const newListing = new Listing(req.bosy.listing);
    
    await newListing.save();
    res.redirect("/listings");
 })
);

//update route
app.put("/listing/:id", validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id ,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res)=> {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all("/*splat", (req, res, next) => {
    next(new expressError(404, "page not found!"));
});

app.use((err, req, res, next) =>{
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(8080, () => {
    console.log("server is listening at port 8080");
});