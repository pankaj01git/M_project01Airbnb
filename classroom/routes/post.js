const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("ger for post");
});

router.post("/", (req, res) => {
    res.send("get for post");
});

module.exports = router;