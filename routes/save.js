var express = require("express"),
    router = express.Router();
    multers = require("../multerUtil"),
    db = require("../db");


router.post("/", multers.single("photo"), function(req, res){
    console.log(req.file);
    db.save(req, res);
})

module.exports = router;