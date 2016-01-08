var Authrize = (function () {
    function Authrize() {
    }
    Authrize.prototype.Login = function (req, res, next) {
        var loginAccount = req.cookies.ppismloginaccount;
        var uid = req.cookies.ppismid;
        if (loginAccount == undefined || uid == undefined) {
            res.render("error", { fromUrl: "/users/myspace", toUrl: "/users/login", toUrlTitle: "登录", message: "用户信息找不到了！" });
            return;
        }
    };
    return Authrize;
})();
exports.Authrize = Authrize;
//# sourceMappingURL=authrize.js.map