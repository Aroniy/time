/**
 * Created by zhangly on 2018/3/12.
 */
var mongoose = require("mongoose"),
    DB_URL = "mongodb://127.0.0.1:27017/shiguang",
    Schem = mongoose.Schema,
    app = require("express")();

mongoose.connect(DB_URL);
mongoose.connection.on("connected", function(){
    console.log("mongoose已成功连接到：" + DB_URL);
})

var ItemSchem = new Schem({
    desc:{type:String},
    photoName:{type:String},
    date:{type:Date}
});

var Item = mongoose.model("Item", ItemSchem);

var save = function(req, res){
    var itemDetail = new Item({
        desc:req.body.desc,
        photoName:req.file.filename,
        date:new Date()
    })

    itemDetail.save(function(err){
        let now = new Date();
        if(err){
            res.send("0");
        }else {
            res.send(JSON.stringify({
                desc: req.body.desc,
                photoName: req.file.filename,
                date: now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()
            }))
        }
    })
}

var getMore = function(req, res){
    var loadCurrent = parseInt(req.body.skip);
    var sendArr = [];
    console.log(loadCurrent);
    Item.count({}, function(err, doc){
        console.log(doc);
        if(err){
            res.send("发生错误");
        }else{
            if(doc>loadCurrent){
                console.log("够用");
                var cursor = Item.find({},null, {skip:loadCurrent, limit:1}, function(err, doc){
                    if(err){
                        console.log(err)
                    }else{
                        doc.forEach(function(cr){
                            let curOjb = {
                                desc: cr.desc,
                                date: cr.date.getFullYear() + "-" + (cr.date.getMonth()+1) + "-" + cr.date.getDate(),
                                photoName: cr.photoName
                            };
                            curOjb = JSON.stringify(curOjb);
                            sendArr.push(curOjb);
                        })
                        res.send(sendArr);
                    }
                });
            }else{
                console.log("不够了");
                let statusCode = {
                    code:0
                };
                statusCode = JSON.stringify(statusCode);
                sendArr.push(statusCode)
                res.send(sendArr);
            }
        }
    });

};



module.exports = {
    save:save,
    getMore:getMore
}






