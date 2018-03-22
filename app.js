var express = require("express"),
    indexRouter = require("./routes/index"),
    saveRouter = require("./routes/save"),
    loadMoreRouter = require("./routes/loadMore"),
    bodyParse = require("body-parser"),
    app = express();


app.use("/static", express.static(__dirname + "/public"));
app.use(bodyParse.urlencoded({extended:true}));
app.use("/enjoy", indexRouter);
app.use("/save", saveRouter);
app.use("/loadMore", loadMoreRouter);


app.listen(80);