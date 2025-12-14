const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//new route
router.get("/add", isLoggedIn, listingController.newform);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isOwner, isLoggedIn, validateListing, wrapAsync(listingController.updateListing))
.delete(isOwner, isLoggedIn, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isOwner, isLoggedIn, wrapAsync(listingController.editform));

module.exports = router;