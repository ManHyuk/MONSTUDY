var crypto = require('crypto');

/*************
 * Password Ciper
 *************/
exports.do_ciper = function(inputpass){
   var salt = "aksgurWkdWkdWkd!@#1234";
   var iterations = 1000;
   var keylen = 24;

   var derivedKey = crypto.pbkdf2Sync(inputpass, salt, iterations, keylen);
   var pw = Buffer(derivedKey, 'binary').toString('hex');

   return pw;
};
