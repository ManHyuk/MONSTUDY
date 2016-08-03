var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/:img', function(req, res, next){
    if(!req.params.img){
        res.json({
            "status":false,
            "message":"invalid parameter"
        });
    }
     else{
         var image = fs.readFileSync('./public/images/measure/' + req.params.img);
         res.writeHead(200, {'Content-Type': 'image/jpg'});
         res.end(image, 'binary');
     }
 });

module.exports = router;
