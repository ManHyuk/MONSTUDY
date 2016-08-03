var express=require('express');
var mysql = require('mysql');
var router = express.Router();


var connection = mysql.createConnection({

    host : '',
    user : '',
    password : '',
    database : ''

});

router.get('/:si/:gu/:scate/:cap/:order', function(request, response, next){
    if(!request.params.si || !request.params.gu || !request.params.scate ||!request.params.cap){
        console.log("Parameter:", request.params);
        response.json({
            "status" : false,
            "message" : "Invalid parameter"
        });
    }else{

        var where_sql =  'WHERE Space_category IN(?) ';
        var scate_arr = [1, 2, 3, 4, 5, 6]; //default
        var sql_parameter = [scate_arr];

        // 카테고리
        if(request.params.scate != '*'){
            scate_arr = (request.params.scate).split(',');
            sql_parameter[0] = scate_arr;
        }
        // 주소
        if(request.params.si != '*'){
            if(request.params.gu != '*'){
            where_sql = where_sql +'AND (Space_location_si =? and Space_location_gu =?) ';
            sql_parameter.push(request.params.si);
            sql_parameter.push(request.params.gu);
            }
            else{
            where_sql = where_sql + 'AND (Space_location_si =? ) ';
            sql_parameter.push(request.params.si);
            }
        }
        // 인원
        if(request.params.cap != '*'){
            where_sql = where_sql + 'AND (? BETWEEN SD_minCap and SD_maxCap) ';
            sql_parameter.push(request.params.cap);
        }

        // 정렬
        var order_sql = ''
        if(request.params.order == 1){
            order_sql = 'ORDER BY review_rating_avg DESC';
        }
        if(request.params.order == 2){
            order_sql = 'ORDER BY min_price ASC';
        }
        if(request.params.order ==3){
            where_sql = where_sql + 'AND s.Space_247 = 1 ';
            order_sql = 'ORDER BY review_rating_avg';
        }
        if(request.params.order ==4){
            where_sql - where_sql + 'AND s.Space_247 = 1 ';
            order_sql = 'ORDER BY min_price ASC, s.Space_247 DESC';
        }

        var sql = 'SELECT s.Space_id, s.Space_name, s.Space_pic, LEAST(MIN(IFNULL(sd.SD_price_weekday, sd.SD_price_weekend)), MIN(IFNULL(sd.SD_price_weekend, sd.SD_price_weekday))) min_price, s.Space_openhour, s.Space_closehour, '+
        '(SELECT ROUND(AVG(Review_rating), 1) FROM Review WHERE Space_id = s.Space_id) review_rating_avg ' +
        'FROM Space s '+
        'LEFT JOIN Space_detail sd ON s.Space_id = sd.Space_id ' +
        'LEFT JOIN Space_location sl ON s.Space_location_id = sl.Space_location_id '+
        where_sql +
        'GROUP BY s.Space_id ' +
        order_sql;
        connection.query(sql, sql_parameter, function(error,cursor){
            if(error!=undefined){
                response.json({
                    "status" : false,
                    "message" : "Database Error"
                });
            }else{
                response.json({
                    "status" : true,
                    "message" : "success",
                    "data" : cursor
                });
            }
    });
}
});










module.exports = router;
