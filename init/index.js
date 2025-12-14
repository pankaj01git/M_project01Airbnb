const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

main()
.then((res) => {
    console.log("connection successful");
}) 
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

const initDB = async () => {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, Owner: "691f1603da0e81890dce0fc1"}));
    await listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();