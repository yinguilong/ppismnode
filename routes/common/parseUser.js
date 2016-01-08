var parseUser = (function () {
    function parseUser(req) {
        this.req = req;
    }
    parseUser.prototype.parse = function () {
        if (this.req == undefined)
            return;
        var userDto = {};
        if (this.req.cookies.ppismloginaccount != undefined && this.req.cookies.ppismloginaccount != "") {
            userDto.LoginAccount = this.req.cookies.ppismloginaccount;
        }
        if (this.req.cookies.ppismid != undefined && this.req.cookies.ppismid != "") {
            userDto.Id = this.req.cookies.ppismid;
        }
        if (this.req.cookies.ppismusername != undefined && this.req.cookies.ppismusername != "") {
            userDto.UserName = this.req.cookies.ppismusername;
        }
        if (this.req.cookies.ppismheaderimg != undefined && this.req.cookies.ppismheaderimg != "") {
            userDto.UserName = this.req.cookies.ppismheaderimg;
        }
        return userDto;
    };
    return parseUser;
})();
exports.parseUser = parseUser;
//# sourceMappingURL=parseUser.js.map