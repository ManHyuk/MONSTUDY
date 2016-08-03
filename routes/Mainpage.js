var express = require('express')
var mysql = require('mysql')
var router = express.Router();

var connection = mysql.createConnection({

    host : '',
    user : '',
    password : '',
    database : ''

});
//메인페이지 조회
router.get('/', function(request, response, next){

    var sql = 'SELECT s.Space_id, MIN(sd.SD_price_weekend) Min_price, sl.Space_location_si, sl.Space_location_gu, s.Space_name, s.Space_pic, (SELECT ROUND(AVG(Review_rating), 1) FROM Review WHERE Space_id = s.Space_id) Review_rating_avg ' +
    'FROM Space s ' +
    'LEFT JOIN Space_location sl ON s.Space_location_id = sl.Space_location_id ' +
    'LEFT JOIN Space_detail sd ON s.Space_id = sd.Space_id ' +
    'GROUP BY s.Space_name ' +
    'ORDER BY Review_rating_avg DESC'


    connection.query(sql, [], function(error, cursor){
        if(error!=undefined){
            response.json({
                "status": false,
                "message": "Database Error"
            });
        }else{
            response.json({
                "status": true,
                "message": "success",
                "data": cursor
            });
        }
    });
});


module.exports = router;
