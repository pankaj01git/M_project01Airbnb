const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("get for users");
});

router.post("/", (req, res) => {
    res.send("Post for users");
});

module.exports = router;