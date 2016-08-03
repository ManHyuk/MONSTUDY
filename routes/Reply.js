var express = require('express');
var mysql = require('mysql');
var router = express.Router();


var connection = mysql.createConnection({

    host : '',
    user : '',
    password : '',
    database : ''

});

//게시글_댓글 insert
router.post('/', function(request, response, next) {
        if (!request.body.Post_id || !request.body.Reply_contents) {  // 파라미터 검사
            console.log("Parameter:", request.body);

            response.json({
                "status": false,
                "message": "Invalid parameter"
            });
        } else {
            var sql = 'INSERT into Reply(Post_id, Reply_contents, Member_userId) value(?, ?, ?)';

            connection.query(sql, [request.body.Post_id, request.body.Reply_contents, request.body.User_id], function (error, cursor) {
                if (error!=undefined)
                {
                    response.json({
                        "status": false,
                        "message": "Database Error"
                    });
                }
                else
                {
                    response.json({
                        "status": true,
                        "message": "success"
                    });
                }
            });
        }
});

//Reply 리스트 전부 업로드
router.get('/:post_id', function(request, response, next) {
    if (!request.params.post_id) {  // 파라미터 검사
        console.log("Parameter:", request.params);

        response.json({
            "status": false,
            "message": "Invalid parameter"
        });
    } else {
        var sql = "SELECT r.reply_id, r.reply_contents, date_format(now(), r.reply_datetime) reply_datetime, m.Member_nickname " +
            "FROM Reply r LEFT JOIN Member m ON r.Member_userId = m.Member_userId " +
            "WHERE Post_id = ?";

        connection.query(sql, [request.params.post_id], function (error, cursor) {
            if (error!=undefined)
            {
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
                    "data": cursor
                });
            }
        });
    }
});


//댓글 삭제
router.delete('/', function(request, response, next) {
    if(!request.session.user_id){
        response.json({
            "status": false,
            "message": "Not login"
        });
    }else{
        if(!request.body.Reply_id){  // 파라미터 검사
            console.log("Parameter:", request.body);

            response.json({
                "status": false,
                "message": "Invalid parameter"
            });
        }else{
            //삭제권한 사람id값 검사쿼리
            var select_sql = 'SELECT Member_userId FROM Reply WHERE Reply_id = ?';

            connection.query(select_sql, [request.body.Reply_id], function (error, cursor) {
                if (error!=undefined)
                {
                    response.json({
                        "status": false,
                        "message": "Database Error"
                    });
                }
                else
                {
                    if(request.session.user_id == cursor[0].Member_userId) // 유저확인
                    {
                        var delete_sql = 'DELETE FROM Reply WHERE Reply_id = ?';

                        connection.query(delete_sql, [request.body.Reply_id], function(error, cursor){
                            if (error!=undefined)
                            {
                                response.json({
                                    "status": false,
                                    "message": "Database Error"
                                });
                            }
                            else
                            {
                                response.json({
                                    "status": true,
                                    "message": "success"
                                });
                            }
                        });
                    }
                    else // 유저가 일치하지 않을때
                    {
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

module.exports = router;
