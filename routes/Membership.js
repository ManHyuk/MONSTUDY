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
/*
// id 중복체크
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

//nickname check
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

// 아이디 중복체크

router.get('/:user_id', function(request, response, next) {

        connection.query('select * from Member where Member_userId = ?', [request.params.user_id], function (error, cursor) {
        if(cursor[0]==undefined) {
                response.json("Unduplicated");
        }
        else {
                response.json("Duplicated");
        }
    });
});

//nickname 중복체크

router.get('/name/:name', function(request, response, next) {

          connection.query('select * from Member where Member_nickname = ?', [request.params.name], function (error, cursor) {

          if(cursor[0]==undefined) {
                  response.json("NameUnduplicated");
          }
          else {
                  response.json("NameDuplicated");
          }
      });
  });
/*
//회원가입
router.post('/', function(request, response, next) {
    if(!request.body.id || !request.body.password || !request.body.email || //parameter check
        !request.body.nickname || !request.body.img || !request.body.divid){
                response.json({
                    "status": false,
                    "message": "Invalid parameter"
                });
    }else{
        var sql = 'INSERT INTO Member (Member_userId, Member_pw, Member_nickname, Member_email, Member_picture, Member_divid) values (?, ?, ?, ?, ?,?) ';
    connection.query(sql, [request.body.id, ciper.do_ciper(request.body.password), request.body.nickname, request.body.email, request.body.img, request.body.divid], function(error, cursor){
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
        })
    }
});
*/

router.post('/', function(request, response, next) {

    connection.query('insert into Member (Member_userId, Member_pw, Member_nickname, Member_email, Member_picture) values (?, ?, ?, ?, ?);',
        [request.body.user_id, ciper.do_ciper(request.body.passwd), request.body.name, request.body.email, request.body.img],
        function (error, cursor) {
            console.log(cursor);
            if (error!=undefined)
    {
        console.log("User insert fail");
        console.log(JSON.stringify(error));
        response.sendStatus(503);
    }
            else
    {
        response.json(cursor[0]);
    }
        });
});

module.exports = router;
