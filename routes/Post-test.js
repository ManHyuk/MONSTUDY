var express = require('express');
var mysql = require('mysql');
var router = express.Router();


var connection = mysql.createConnection({

    host : '',
    user : '',
    password : '',
    database : ''

});


//게시글 이름검색

router.get('/postsearch/:search', function(request, response, next) {

 if(!request.params.search){  // 파라미터 체크
        console.log("Parameter:", request.params);

        response.json({
            "status": false,
            "message": "Invalid parameter"
        });
     }
else{
        var data = '%'+request.params.search+'%' ;
        var sql = 'select * from Post where Post_title Like ?';

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




//post 리스트 전부 업로드
router.get('/upload', function(request, response, next) {
    var sql = 'SELECT p.Post_id, p.Post_title, date_format(now(),p.Post_datetime) Post_datetime, pc.Post_cate_name, pl.Post_location_city, m.Member_userId, m.Member_nickname, ' +
        '(SELECT COUNT(reply_id) FROM Reply WHERE Post_id = p.Post_id) Reply_count ' +
        'FROM Post p LEFT JOIN Post_category pc ON p.Post_category_id = pc.Post_category_id ' +
        'LEFT JOIN Post_location pl ON p.Post_location_id = pl.Post_location_id ' +
        'LEFT JOIN Member m ON p.Member_userId = m.Member_userId ' +
        'ORDER BY Post_datetime DESC ';

    connection.query(sql, [], function(error, cursor) {
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
});

//사용자가 게시글 작성시 자동으로 데이터를 받아와 찍는 쿼리
router.get('/:post', function(request, response, next) {
    if(!request.params.post){  // 파라미터 체크
        console.log("Parameter:", request.params);

        response.json({
            "status": false,
            "message": "Invalid parameter"
        });
    }else{
        var sql = 'SELECT p.Post_title, p.Post_contents, m.Member_picture, m.Member_nickname, pc.Post_cate_name, pl.Post_location_city, date_format(now(),p.Post_datetime) Post_datetime, p.Post_id ' +
            'FROM Post p LEFT JOIN Post_location pl ' +
            'ON p.Post_location_id = pl.Post_location_id ' +
            'LEFT JOIN Member m ON p.Member_userId = m.Member_userId ' +
            'LEFT JOIN Post_category pc ON p.Post_category_id = pc.Post_category_id ' +
            'WHERE p.Post_id = ?';  // Post_id 조건 추가

        connection.query(sql, [request.params.post], function (error, cursor) {
            if (error!=undefined){
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
        });  // connections
    }
});

//사용자가 게시글작성했을때 INSERT 되는 쿼리
router.post('/', function(request, response, next) {
        if(!request.body.Post_title || !request.body.Post_contents ||
            !request.body.Post_location_id || !request.body.Post_category_id){  // 파라미터 검사
            console.log("Parameter:", request.body);

            response.json({
                "status": false,
                "message": "Invalid parameter"
            });
        }else{
            var sql = 'INSERT INTO Post(Post_title, Post_contents, Member_userId, Post_location_id, Post_category_id) VALUES(?,?,?,?,?)';

            connection.query(sql, [request.body.Post_title, request.body.Post_contents, request.body.User_id, request.body.Post_location_id, request.body.Post_category_id],  //Member_userId는 세션 정보에서 가져옴
                function (error, cursor) {
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

//게시글 업로드한뒤 게시글_제목,내용,지역,스터디유형 수정 쿼리
router.put('/', function(request, response, next) {  //  router.post를 router.put으로 변경하고 ur도 /change/:Post_id를 /로 변경(post_id는 body로 받음)
    if(!request.session.user_id){
        response.json({
            "status": false,
            "message": "Not login"
        });
    }else{
        if(!request.body.Post_title || !request.body.Post_contents || !request.body.Post_id ||
            !request.body.Post_location_id || !request.body.Post_category_id){  // 파라미터 검사
            console.log("Parameter:", request.body);

            response.json({
                "status": false,
                "message": "Invalid parameter"
            });
        }else{
            //수정권한 사람id값 검사쿼리
            var select_sql = 'SELECT Member_userId FROM Post WHERE Post_id = ?';

            connection.query(select_sql, [request.body.Post_id], function (error, cursor) {
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
                        var update_sql = 'UPDATE Post set Post_title=?, Post_contents=?, Post_location_id=?, Post_category_id=? WHERE Post_id=?';

                        connection.query(update_sql, [request.body.Post_title, request.body.Post_contents, request.body.Post_location_id, request.body.Post_category_id, request.body.Post_id],
                            function (error, cursor){
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

//게시글 삭제
router.delete('/', function(request, response, next) {
    if(!request.session.user_id){
        response.json({
            "status": false,
            "message": "Not login"
        });
    }else{
        if(!request.body.Post_id){  // 파라미터 검사
            console.log("Parameter:", request.body);

            response.json({
                "status": false,
                "message": "Invalid parameter"
            });
        }else{
            //삭제권한 사람id값 검사쿼리
            var select_sql = 'SELECT Member_userId FROM Post WHERE Post_id = ?';

            connection.query(select_sql, [request.body.Post_id], function (error, cursor) {
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
                        var delete_sql = 'DELETE FROM Post WHERE Post_id = ?';

                        connection.query(delete_sql, [request.body.Post_id], function(error, cursor){
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
