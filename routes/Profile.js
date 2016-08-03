var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var ciper = require('./Ciper');

/* GET users listing. */

var connection = mysql.createConnection({

    host : '',
    user : '',
    password : '',
    database : ''

});

connection.connect(function(err) {
    if(err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

//router.get('/:user_id', function(request, response, next) {
//    console.log("aaaa");
//    connection.query('select * from User where user_id = ?', [request.params.user_id], function (error, cursor) {
//
//        if(cursor[0]==undefined) {
//            console.log(response);
//            response.sendStatus(404);
//        }
//        else
//        {
//            console.log(cursor[0]);
//            response.json(cursor[0]);
//        }
//    });
//});

// 마이페이지 조회 , 내가쓴 게시물
router.get('/:user_id', function(request, response, next) {
    if(!request.params.user_id){  // 파라미터 체크
        console.log("error1");
        response.json({
            "status": false,
            "message": "Invalid parameter"
        });
    }else{
        console.log("process1");
        var info_sql = 'SELECT * ' +
            'FROM Member ' +
            'WHERE Member_userId = ?';

        connection.query(info_sql, [request.session.user_id], function (error, info_cursor) {
            if(error!=undefined) {
                response.json({
                    "status": false,
                    "message": "Database Error"
                });
            }
            else if(info_cursor[0]==undefined)
            {
                response.json({
                    "status": false,
                    "message": "No user"
                });
            }
            else
            {
                console.log("success");
                console.log(info_cursor[0]);
                response.json(info_cursor[0]);
                /*
                var post_sql = 'SELECT p.Post_id, p.Post_title, p.Post_contents, p.Post_datetime, m.Member_nickname, pc.Post_cate_name, pl.Post_location_city ' +
                    'FROM Post p LEFT JOIN Member m ON p.Member_userId = m.Member_userId ' +
                    'LEFT JOIN Post_category pc ON p.Post_category_id = pc.Post_category_id ' +
                    'LEFT JOIN Post_location pl ON p.Post_location_id = pl.Post_location_id ' +
                    'WHERE p.Member_userId = ?';

                connection.query(post_sql, [request.params.user_id], function (error, post_cursor){
                    if(error!=undefined) {
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
                            "data": {
                                "user_info": info_cursor,
                                "user_post": post_cursor
                            }
                        });
                    }
                });
                */
            }
        });
    }
});

/*
// 회원가입
router.post('/', function(request, response, next) {
    if(!request.body.id || !request.body.password || !request.body.email ||
        !request.body.nickname || !request.body.picture || !request.body.divid){  // 파라미터 체크

        response.json({
            "status": false,
            "message": "Invalid parameter"
        });
    }else{
        var sql = 'INSERT INTO Member(Member_userId, Member_pw, Member_email, Member_nickname, Member_picture, Member_divid) ' +
            'VALUES (?, ?, ?, ?, ?,?)';

        connection.query(sql, [request.body.id, ciper.do_ciper(request.body.password), request.body.email, request.body.nickname, request.body.picture, request.body.divid], function (error, cursor) {
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

//id ddble check
router.get('/doubleid/:id', function(request, response, next){
    if(!request.params.id){
        console.log("Parameter:", request.params);
        response.json({
            "status":false,
            "message": "Invalid parameter"
        });
    }else{
        var sql = 'SELECT Member_userId FROM Member WHERE Member_userId = ? ';
        connection.query(sql, [request.params.id], function(error, cursor){
            if(error!=undefined){
                response.json({
                    "status":false,
                    "message": "Database Error"
                });
            }else{
                if(cursor.length == 0){
                    response.json({
                        "status" : true,
                        "message" : "사용 가능합니다."
                    });
                }else{
                    response.json({
                        "status" : false,
                        "message" : "사용할 수 없습니다."
                    });
                }
            }
        });
    };
});
router.get('/doublenick/:nickname', function(request, response, next){
    if(!request.params.nickname){
        console.log("Parameter:", request.params);
        response.json({
            "status":false,
            "message": "Invalid parameter"
        });
    }else{
        var sql = 'SELECT Member_nickname FROM Member WHERE Member_nickname = ? ';
        connection.query(sql, [request.params.nickname], function(error,cursor){
            if(error!=undefined){
                response.json({
                    "status":false,
                    "message": "Database Error"
                });
            }else{
                if(cursor.length ==0 ){
                    response.json({
                        "status": true,
                        "message": "사용 가능합니다."
                    })
                }else{
                    response.json({
                        "status": false,
                        "message" : "사용할 수 없습니다."
                    });
                }
            }
        });
    }
});
*/

module.exports = router;
