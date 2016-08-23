var fs = require('fs');
var uuid = require('node-uuid');
var moment  = require('moment');

exports.uploadImage = function(req, res) {
    var imgData = req.body.imgData;
  
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    var pre=moment().format('YYYY-MM-DD');
    var fileName='./data/uploadimages/'+pre+'-'+uuid.v4()+".png";
    console.log(fileName);

    fs.writeFile(fileName, dataBuffer, function(err) {
        if(err){
          res.send(err);
        }else{
          res.send("保存成功！");
        }
    });
}
