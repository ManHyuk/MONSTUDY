var express = require('express');
var mysql = require('mysql');
var router = express.Router();


var connection = mysql.createConnection({

    host : '',
    user : '',
    password : '',
    database : ''

});

//Space_location 테이블 전체 업로드
router.get('/', function(request, response, next){
    var sql = 'select * from Space_location';
    connection.query(sql, function (error, cursor) {
        if (error!=undefined){
            response.json({
                "status": false,
                "message": "Database Error"
            });
        }
        else{
            response.json({
                "status": true,
                "message": "success",
                "data" : cursor
            });
        }
        }); // connections
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
            order_sql = 'ORDER BY Review_rating_avg DESC';
        }
        if(request.params.order == 2){
            order_sql = 'ORDER BY Min_price ASC';
        }
        if(request.params.order ==3){
            where_sql = where_sql + 'AND s.Space_247 = 1 ';
            order_sql = 'ORDER BY Review_rating_avg DESC, s.Space_247 DESC ';
        }
        if(request.params.order ==4){
            where_sql - where_sql + 'AND s.Space_247 = 1 ';
            order_sql = 'ORDER BY s.Space_247 DESC, Min_price ASC ';
        }
       var sql = 'SELECT s.Space_id, s.Space_name, s.Space_pic, LEAST(MIN(IFNULL(sd.SD_price_weekday, sd.SD_price_weekend)), MIN(IFNULL(sd.SD_price_weekend, sd.SD_price_weekday))) Min_price, s.Space_openhour, s.Space_closehour, '+
        '(SELECT ROUND(AVG(Review_rating), 1) FROM Review WHERE Space_id = s.Space_id) Review_rating_avg ' +
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









/********************************************************************************************
// 이름검색
router.get('/namesearch/:search', function(request, response, next) {

 if(!request.params.search){  // 파라미터 체크
        console.log("Parameter:", request.params);

        response.json({
            "status": false,
            "message": "Invalid parameter"
        });
     }
else{
        var data = '%'+request.params.search+'%' ;
        var sql = 'select * from Space where space_name Like ?';

    connection.query(sql, [data], function (error, cursor) {

        if (error!=undefined){
                response.json({
                    "status": false,
                    "message": "Database Error"
                });
            }
        else
            {
                response.json({
                    "status": true,
                    "message": "success",
                    "data" : cursor
                });
            }
         });  // connections
    }
});

//지역검색
router.get('/locatsearch/:si/:gu', function(request, response, next) {

 if(!request.params.si || !request.params.gu){  // 파라미터 체크
        console.log("Parameter:", request.params);

        response.json({
            "status": false,
            "message": "Invalid parameter"
        });
     }
else{

var sql = 'SELECT s.Space_id, s.Space_name, s.Space_pic, LEAST(MIN(IFNULL(sd.SD_price_weekday, sd.SD_price_weekend)), MIN(IFNULL(sd.SD_price_weekend, sd.SD_price_weekday))) min_price, s.Space_openhour, s.Space_closehour, '+
'(SELECT ROUND(AVG(Review_rating), 1) FROM Review WHERE Space_id = s.Space_id) review_rating_avg '+
'FROM Space s '+
'LEFT JOIN Space_detail sd ON s.Space_id = sd.Space_id '+
'LEFT JOIN Space_location sl ON s.Space_location_id = sl.Space_location_id '+
'WHERE Space_location_si= ? and Space_location_gu= ? '+
'GROUP BY s.Space_id';


    connection.query(sql, [request.params.s_location_si, request.params.s_location_gu], function (error, cursor) {

        if (error!=undefined){
                response.json({
                    "status": false,
                    "message": "Database Error"
                });
            }
        else
            {

               response.json({
                    "status": true,
                    "message": "success",
                    "data" : cursor
                });

            }
         });  // connections
    }
});


//업종검색
router.get('/catesearch/:catesearch', function(request,response,next){
    if(!request.params.catesearch){ //params check
        console.log("Parameter:", request.params)
        response.json({
            "status": false,
            "message": "Invalid parameter"
        });
    }else{
        // TODO query edit
        // 뭔가이상해... 최저가가 맞는지 확인하기
        var sql = 'SELECT s.Space_id, s.Space_name, s.Space_pic, sd.SD_price_weekend, s.Space_openhour, s.Space_closehour, ' +
        '(SELECT ROUND(AVG(Review_rating), 1) FROM Review WHERE Space_id = s.Space_id) review_rating_avg ' +
        'FROM Space s ' +
        'LEFT JOIN Space_detail sd ON s.Space_id = sd.Space_id ' +
        'WHERE Space_category = ? ' +
        'GROUP BY s.Space_id';

        connection.query(sql, [request.params.catesearch], function (error,cursor){
            if(error!=undefined){
                response.json({
                    "status": false,
                    "message": "Database Error"
                });
            }else{
                response.json({
                    "status":true,
                    "message": "success",
                    "data" : cursor
                });
            }
        });
    }
});
//인원검색
router.get('/capsearch/:capsearch', function(request, response, next){
    if(!request.params.capsearch){
        console.log("Parameter:", request.params);

        response.json({
            "status": false,
            "message" : "Invalid parameter"
        })
    }else{
        var sql = 'SELECT DISTINCT s.Space_id, s.Space_name, s.Space_pic ,(SELECT ROUND(AVG(Review_rating), 1) FROM Review WHERE Space_id = s.Space_id) review_rating_avg, s.Space_openhour, s.Space_closehour ' +
        'FROM Space s, Space_detail sd '+
        'WHERE s.Space_id = sd.Space_id AND ? BETWEEN SD_minCap and SD_maxCap ';


        connection.query(sql, [request.params.capsearch], function(error, cursor){
            if(error!=undefined){
                reponse.json({
                    "status": false,
                    "message": "Database Error"
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
***********************************************************************************************/

module.exports = router;
