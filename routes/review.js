var express = require('express');
var mysql = require('mysql');
var router = express.Router();


var connection = mysql.createConnection({

    host : '',
    user : '',
    password : '',
    database : ''

});


// 후기등록
router.post('/', function(request, response, next){
/*
  if(!request.session.user_id){
        console.log("session", request.session);
        response.json({
            "status": false,
            "message": "Not login"
        });
    } */
//   else {
/*    if(!request.body.Review_contents || !request.body.Review_rating || !request.body.Member_userId || !request.body.Space_id) // request.body.Member_userId => request.session.user_id 변경?
{
    console.log("Parameter". request.body);

    response.json({
        "status": false,
        "message": "Invalid parameter"
    });*/
//}
//else
//{
    var qString = 'INSERT into Review(Review_contents, Review_rating, Member_userId, Space_id) value(?,?,?,?);'
        connection.query(qString, [request.body.Review_contents, request.body.Review_rating, request.body.User_id, request.body.Space_id], // Member_userId 는 세션정보에서 가져옴
                function(error, cursor)
                {
                    if (error!=undefined)
                    {
                        response.json({
                        "status": false,
                        "message": "Databases Error"
                       });
                    }
                    else
                    {
                        response.json({
                            "status": true,
                            "message": "success"
                        });
                    }
                })
});


// 후기삭제
router.delete('/', function(request, response, next){
    if(!request.session.user_id){
        response.json({
            "status": false,
            "message": "Not login"
        });
    }else{
        if(!request.body.Review_id){ // 파라미터 검사
            consloe.log("Parameter:", request.body);
            response.json({
                "status": false,
                "message": "Invalid parameter"
            });
        }else{
            //삭제권한 id값 검사쿼리
            var select_sql = 'SELECT Member_userId FROM Review WHERE Review_id =?';
            connection.query(select_sql, [request.body.Review_id], function(error, cursor){
                if(error!=undefined){
                    response.json({
                        "status": false,
                        "message": "Dababase Error"
                    });
                }
                else{
                    if(request.session.user_id == cursor[0].Member_userId) //user check
                    {
                        var delete_sql = 'DELETE FROM Review WHERE Review_id = ?';
                        connection.query(delete_sql, [request.body.Review_id], function(error, cursor){
                            if(error!=undefined){
                                response.json({
                                    "status": false,
                                    "message": "Database Error"
                                });
                            }
                            else{
                                response.json({
                                    "status": true,
                                    "message" : "succes"
                                });
                            }
                        });
                    }else{
                        response.json({
                            "status": false,
                            "message": "failed access"
                        });
                    }
                }
            });
        }
    }
});

// 얘는 어디다 쓰는거죠?
// DB 에러
//router.get('/upload', function(request, response, next) {
//    console.log('review upload');
//    var sql = 'SELECT m.Member_nickname, r.Review_datetime, rc.Review_contents, rr.Review_rating FROM Raeview r ' +
//    'LEFT JOIN Review_contents rc ON r.Review_contents = rc.Review_contents ' +
//   'LEFT JOIN Member m ON r.Member_nickname = m.Member_nickname ' +
//    'LEFT JOIN Review_rating rr ON r.Review_rating = rr.Review_rating';
//    connection.query(sql, [], function (error, cursor) {
//        if(error!=undefined){
//            response.json({
//                "status" : false,
//               "message" : "Database Error"
//          });
//        }else{
//            response.json({
//                "status": true,
//                "message": "success",
//                "data" : cursor
//            })
//        }
//});
// });

module.exports = router;
