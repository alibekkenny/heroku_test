const express = require("express");
const path = require("path");
const router = express.Router();
const axios = require('axios');

router
    .route("/")
    .get(async(req, res) => {
        var quotes = [{
            author: "Maimonides",
            quote: "Give a man a fish and you feed him for a day; teach a man to fish and you feed him for a lifetime."
        }, {
            author: "Albert Einstein",
            quote: "Education is what remains after one has forgotten what one has learned in school."
        }];
        var urlPath = req.protocol + '://' + req.get('host') + "/quotes";
        for (i = 0; i < 3; i++) {
            await axios.get(urlPath).then(res => {
                quotes.push(res.data);
                console.log(quotes)
            }).catch(error => console.error(error));
        }
        res.render("features", {
            quotes: quotes
        })
    });
module.exports = router;