var express = require("express"),
    path = require("path"),
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    console.log("请求首页");
    res.sendFile(path.resolve(__dirname + "./../public/index.html"));
});

module.exports = router;
