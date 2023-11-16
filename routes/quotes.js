const express = require("express");
const https = require('https')
const path = require("path");
const router = express.Router();



router
    .route("/")
    .get((req, res) => {
        https.get("https://api.quotable.io/random", (response) => {
            response.on("data", (data) => {
                // console.log(data.data);
                const wData = JSON.parse(data);
                res.send(wData)
            });
        })
    });
module.exports = router;