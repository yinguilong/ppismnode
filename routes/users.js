"use strict";
/// <reference path='../typings/tsd.d.ts' />
///<reference path='entitys/UserEntity.ts' />
///<reference path='constracts/RequestEntity.ts' />
///<reference path='common/setcookie.ts' />
///<reference path='common/parseUser.ts' />
var express = require('express');
var userEntity = require("./entitys/UserEntity");
var requestEntity = require("./constracts/RequestEntity");
var setcookie = require("./common/setcookie");
var parseUser = require("./common/parseUser");
var rp = require("request-promise");
var request = require("request");
var router = express.Router();
var DOMAIN = "http://localhost:27771";
//var request=request();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('users/users.html');
    // 
});
router.get('/index', function (req, res, next) {
    var strCookie = req.cookies.ppismloginaccount;
    var strUid = req.cookies.ppismid;
    res.send(strUid);
});
router.get("/register", function (req, res, next) {
    res.render("users/register.html");
});
router.post("/register", function (req, res, next) {
    var userDtos = [];
    var userDto = new userEntity.UserDto(req.body.LoginAccount, req.body.Password);
    userDto.UserName = req.body.UserName;
    userDtos.push(userDto);
    request(DOMAIN + "/user/register", {
        json: true,
        method: "POST",
        form: {
            Name: "register",
            Count: userDtos.length,
            Items: userDtos
        }
    }, function (error, response, data) {
        // var ret = JSON.parse(data);
        if (response != undefined && response.statusCode == 200 && data.result == true) {
            var ppismCookie = new setcookie.cookiehelper(data.items[0], res);
            ppismCookie.set();
            res.render("notice", { fromUrl: "/users/register", toUrl: "/users/myspace", toUrlTitle: "我的主页", message: "注册成功了" });
        }
        else {
            res.render("error", { fromUrl: "/users/register", toUrl: "/users/register", toUrlTitle: "返回重新注册", message: "注册失败了" });
        }
    });
});
router.get("/login", function (req, res, next) {
    res.render("users/login");
});
router.post("/login", function (req, res, next) {
    var userDtos = [];
    var userDto = new userEntity.UserDto(req.body.LoginAccount, req.body.Password);
    userDtos.push(userDto);
    var reqEntity = new requestEntity.RequestEntity("login", userDtos.length, userDtos);
    request(DOMAIN + "/user/validateuser", {
        json: true,
        method: "POST",
        form: reqEntity
    }, function (error, response, data) {
        if (response != undefined && response.statusCode == 200 && data.result == true) {
            var ppismCookie = new setcookie.cookiehelper(data.items[0], res);
            ppismCookie.set();
            res.render("notice", { fromUrl: "/users/register", toUrl: "/users/myspace", toUrlTitle: "我的主页", message: "登录成功" });
        }
        else {
            res.render("error", { fromUrl: "/users/register", toUrl: "/users/register", toUrlTitle: "返回重新注册", message: "登录失败" });
        }
    });
});
router.get("/myspace", function (req, res, next) {
    var user = new parseUser.parseUser(req).parse();
    var myboxItems = [];
    var boxItemQuery = {
        UserId: user.Id
    };
    myboxItems.push(boxItemQuery);
    var reqEntity = new requestEntity.RequestEntity("myspace", myboxItems.length, myboxItems);
    var items; //rander视图时的ppboxitems数据;
    var toMyBoxOption = {
        uri: DOMAIN + "/shangpin/mybox",
        json: true,
        method: "POST",
        form: reqEntity
    };
    rp(toMyBoxOption)
        .then(function (data) {
        if (data.result == true) {
            items = data.items;
            res.render("users/myspace", { items: items, userDto: user });
        }
    })
        .catch(function (error) {
        res.render("error", { fromUrl: "/users/myspace", toUrl: "/users/login", toUrlTitle: "重新登录", message: "登录失败" });
        return;
    });
});
router.get("/addppism", function (req, res, next) {
    var user = new parseUser.parseUser(req).parse();
    var userDtos = [];
    userDtos.push(user);
    var reqEntity = new requestEntity.RequestEntity("myspace", userDtos.length, userDtos);
    var userDtoR; //rander视图时的用户数据
    var items; //rander视图时的ppboxitems数据;
    //请求用户信息
    var toMyOption = {
        uri: DOMAIN + "/user/my",
        json: true,
        method: "POST",
        form: reqEntity
    };
    rp(toMyOption)
        .then(function (data) {
        if (data.result == true) {
            userDtoR = data.items[0];
            res.render("users/addppism", { userDto: userDtoR });
        }
    })
        .catch(function (error) {
        res.render("error", { fromUrl: "/users/myspace", toUrl: "/users/login", toUrlTitle: "重新登录", message: "登录失败" });
        return;
    });
});
router.post("/addppism", function (req, res, next) {
    var user = new parseUser.parseUser(req).parse();
    var ListenUrl = req.body.ListenUrl;
    var ItemName = req.body.ItemName;
    var Description = req.body.Description;
    var items = [];
    var item = {
        ListenUrl: ListenUrl,
        ItemName: ItemName,
        UserId: user.Id,
        Description: Description,
        ItemType: req.body.ItemType
    };
    items.push(item);
    var reqEntity = new requestEntity.RequestEntity("addppism", items.length, items);
    //请求用户信息
    var option = {
        uri: DOMAIN + "/shangpin/add",
        json: true,
        method: "POST",
        form: reqEntity
    };
    rp(option)
        .then(function (data) {
        if (data.result == true) {
            res.render("users/addppism", { items: data.items, userDto: user, note: "成功" });
        }
    })
        .catch(function (error) {
        res.render("users/addppism", { userDto: user, note: "失败" });
        return;
    });
});
router.get("/ppisms", function (req, res, next) {
    var user = new parseUser.parseUser(req).parse();
    var pageSize = 6;
    var myboxItems = [];
    var pageIndex = req.query.pageindex || 1;
    var trend = req.query.trend || 0;
    var boxItemQuery = {
        UserId: user.Id,
        PageIndex: pageIndex,
        PageSize: pageSize,
        Trend: trend
    };
    myboxItems.push(boxItemQuery);
    var reqEntity = new requestEntity.RequestEntity("ppisms", myboxItems.length, myboxItems);
    var option = {
        uri: DOMAIN + "/shangpin/mybox",
        json: true,
        method: "POST",
        form: reqEntity
    };
    var ppismItems = [];
    rp(option)
        .then(function (data) {
        if (data.result == true) {
            ppismItems = data.items;
            if (ppismItems != undefined && ppismItems.length > 0) {
                var firstItem = ppismItems[0];
                var queryItems = [];
                var chartQueryEntity = {
                    PPismItemId: firstItem.pPismItemId
                };
                queryItems.push(chartQueryEntity);
                var reqPriceEntity = new requestEntity.RequestEntity("priceItems", queryItems.length, queryItems);
                var optionPrice = {
                    uri: DOMAIN + "/shangpin/prices",
                    json: true,
                    method: "POST",
                    body: reqPriceEntity
                };
                rp(optionPrice)
                    .then(function (data) {
                    if (data.result == true)
                        res.render("users/ppisms", { ppismItems: ppismItems, priceItems: data.items, userDto: user });
                })
                    .catch(function (error) {
                    res.render("error", { fromUrl: "/users/myspace", toUrl: "/users/login", toUrlTitle: "重新登录", message: "登录失败" });
                });
            }
        }
    })
        .catch(function (error) {
        res.render("error", { fromUrl: "/users/myspace", toUrl: "/users/login", toUrlTitle: "重新登录", message: "登录失败" });
    });
});
router.get('/about', function (req, res, next) {
    var user = new parseUser.parseUser(req).parse();
    res.render('users/about', { userDto: user });
});
router.get("/advice", function (req, res, next) {
    var user = new parseUser.parseUser(req).parse();
    res.render('users/advice', { userDto: user });
});
router.post('/advice', function (req, res, next) {
    var user = new parseUser.parseUser(req).parse();
    var note = req.body.note;
});
router.get("/loginout", function (req, res, next) {
    var ppismCookie = new setcookie.cookiehelper(null, res);
    ppismCookie.clear();
    res.render("users/login");
});
module.exports = router;
//# sourceMappingURL=users.js.map