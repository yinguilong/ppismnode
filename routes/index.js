/// <reference path='../typings/tsd.d.ts' />
"use strict";
var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.cookies.ppismid != undefined)
        return res.redirect("/users/myspace");
    res.render('index.html');
});
module.exports = router;
//# sourceMappingURL=index.js.map