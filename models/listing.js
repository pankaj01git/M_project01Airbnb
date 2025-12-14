const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
        },
    description: String,
    image: {
        type: String,
        default: "https://tse4.mm.bing.net/th/id/OIP.BLuF1XG7msaXxtGlG2fAuAHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
        set: (v) => v === "" ? "https://tse4.mm.bing.net/th/id/OIP.BLuF1XG7msaXxtGlG2fAuAHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3" : v,
    },
    price: Number,
    country: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    Owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;