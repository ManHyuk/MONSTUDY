var express = require('express');
var mysql = require('mysql');
var uuid = require('node-uuid');
var ciper = require('./Ciper');

var router = express.Router();

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


//세션 체크
router.get('/', function(request, response, next) {

        console.log(request.session);
        if (request.session.key == undefined) {
                request.session.destroy();
                response.sendStatus(401);
        }
        else {
                var result = {};
                result.user_id = request.session.user_id;
                result.passwd = request.session.passwd;
                result.name = request.session.name;
                response.json(result);
        }
});


//로그인
router.post('/sign/in', function(request, response, next) {

    var user = new Object();
    var s_info = new Object();
    var p_info = new Object();

    var sql_user = 'select * from Member where Member_userId = ? and Member_pw = ?;';
    var idpw = [request.body.user_id,ciper.do_ciper(request.body.passwd)];
    var user_id = [request.body.user_id];

    connection.query(sql_user, idpw, function(error, cursor) {
        if(error != undefined) {
            response.sendStatus(503);
        }
        else {
            if(cursor[0]==undefined){
                response.sendStatus(401);
            }
            else {
                var info = cursor[0];

                user = info;

                request.session.key = uuid.v4();
                request.session.user_id = info.Member_userId;
                request.session.passwd = info.Member_pw;
                request.session.name = info.Member_nickname;

                response.json(user);
                console.log(user);
            }
        }
    });
});

//로그아웃
router.get('/sign/out', function(request, response, next) {

    var result = {};

    if (request.session.key != undefined) {

        request.session.destroy();

        result.expired = true;
        response.json(result);
    }
    else {

        response.sendStatus(403);
    }
});


/********************
 * Server Login Test
 ********************/

var connection2 = mysql.createConnection({
        host : '',
        user : '',
        password : '',
        database : ''
});

//로그인
router.post('/mon/sign/in', function(request, response, next) {
        if (!request.body.id || !request.body.password) {  // 파라미터 검사
                console.log("Parameter:", request.body);

                response.json({
                        "status": false,
                        "message": "Invalid parameter"
                });
        } else {
                var user = new Object();
                var s_info = new Object();
                var p_info = new Object();

                var sql_user = 'select * from Member where Member_userId = ? and Member_pw = ?;';
                var idpw = [request.body.id, ciper.do_ciper(request.body.password)];
                var user_id = [request.body.id];

                connection2.query(sql_user, idpw, function(error, cursor) {
                        if(error != undefined) {
                                response.json({
                                        "status": false,
                                        "message": "Database Error"
                                });
                        }
                        else {
                                if(cursor[0]==undefined){
                                        response.json({
                                                "status": false,
                                                "message": "Login Fail"
                                        });
                                }
                                else
                                {
                                        var info = cursor[0];

                                        user = info;
                                        request.session.key = uuid.v4();
                                        request.session.user_id = info.Member_userId;
                                        request.session.passwd = info.Member_pw;
                                        request.session.nickname = info.Member_nickname;

                                        response.json({
                                                "status": true,
                                                "message": "sccuess",
                                                "data": user
                                        });
                                }
                        }
                });
        }
});

module.exports = router;
