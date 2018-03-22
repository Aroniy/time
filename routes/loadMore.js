var express = require("express"),
    router = express.Router(),
    db = require("../db");

router.post("/", function(req, res){
    db.getMore(req, res);
})

module.exports = router;