var express = require('express');
var mysql = require('mysql');
var router = express.Router();


var connection = mysql.createConnection({

    host : '',
    user : '',
    password : '',
    database : ''

});

//Space 자세히보기
router.get('/:space_id', function(request, response, next) {
    if(!request.params.space_id){  // 파라미터 체크
        console.log("Parameter:", request.params);

        response.json({
            "status": false,
            "message": "Invalid parameter"
        });
    }else{
        var info_sql = 'SELECT s.Space_tag, ROUND(AVG(r.Review_rating), 1) Space_rating_avg, s.Space_id, s.Space_name, s.Space_pic, ' +
            's.Space_notice, s.Space_webAddress, s.Space_address, s.Space_cellNum, s.Space_payMethod, s.Space_category, ' +
            's.Space_latitude, s.Space_longitude, sl.Space_location_si, sl.Space_location_gu, ' +
            's.Space_notice ' +
            'FROM Space s ' +
            'LEFT JOIN Space_location sl ON s.Space_location_id = sl.Space_location_id ' +
            'LEFT JOIN Review r ON s.Space_id = r.Space_id ' +
            'WHERE s.Space_id = ?';

        // 스페이스 기본 정보
        connection.query(info_sql, [request.params.space_id], function (error, info_cursor) {
            if (error!=undefined){
                response.json({
                    "status": false,
                    "message": "Database Error"
                });
            }
            else if(info_cursor[0]==undefined)
            {
                response.json({
                    "status": false,
                    "message": "No Space"
                });
            }
            else
            {
                // 방정보
                var sd_sql = 'SELECT SD_id, SD_roomName, SD_pic, SD_maxCap, SD_minTime, SD_price_weekday, SD_price_weekend ' +
                    'FROM Space_detail ' +
                    'WHERE Space_id = ?';
                connection.query(sd_sql, [request.params.space_id], function (error, SD_cursor) {
                    if (error != undefined) {
                        response.json({
                            "status": false,
                            "message": "Database Error"
                        });
                    }
                    else
                    {
                        // 리뷰
                        var review_sql = 'SELECT r.Review_id, m.Member_userId, m.Member_nickname, r.Review_contents, r.Review_rating, r.Review_datetime, sd.SD_id, sd.SD_roomName ' +
                            'FROM Review r LEFT JOIN Member m ON r.Member_userId = m.Member_userId ' +
                            'LEFT JOIN Space_detail sd ON r.SD_id = sd.SD_id ' +
                            'WHERE r.Space_id = ?';

                        connection.query(review_sql, [request.params.space_id], function (error, review_cursor) {
                            if (error != undefined) {
                                response.json({
                                    "status": false,
                                    "message": "Database Error"
                                });
                            }else{
                                response.json({
                                    "status": true,
                                    "message": "success",
                                    "data": {
                                        "space_info": info_cursor,
                                        "sd_info": SD_cursor,
                                        "review_list": review_cursor
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });  // connections
    }
});

module.exports = router;
