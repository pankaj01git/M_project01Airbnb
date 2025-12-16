if(process.env.NODE_ENV !="production") {
    require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');
const upload = multer("uploads/");


router.route("/")
.get(wrapAsync(listingController.index))
//.post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));
.post(upload.single('listing[image]'), (req, res) => {
    res.send(req.file);
});

//new route
router.get("/add", isLoggedIn, listingController.newform);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isOwner, isLoggedIn, validateListing, wrapAsync(listingController.updateListing))
.delete(isOwner, isLoggedIn, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isOwner, isLoggedIn, wrapAsync(listingController.editform));

module.exports = router;