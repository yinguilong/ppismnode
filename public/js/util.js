
//获取cookie
function getCookie(c_name) {
    var cookie = document.cookie;
    if (cookie.length > 0) {
        var c_start = cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            var c_end = cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = cookie.length
            return unescape(cookie.substring(c_start, c_end))
        }
    }
    return ""
}
//设置cookie
function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()+";path=/")
}
//删除cookies 
function delCookie(name) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
} 
//获取当前文本框的光标位置
function GetCursorPosition(obj) {
    var cursurPosition = -1;
    if (obj.selectionStart) {//非IE浏览器
        cursurPosition = obj.selectionStart;
    } else {//IE
        if (!document.selection) {
        }
        else {
            var range = document.selection.createRange();
            //range.moveStart("character", -oTxt1.value.length);
            cursurPosition = range.text.length;
        }
    }
    return cursurPosition;
}
//获取被选中的文本
function GetSelectedText() {
    var selText = "";
    if (window.getSelection) {  // all browsers, except IE before version 9
        var sel = document.activeElement;
        if (sel &&
            (sel.tagName.toLowerCase() == "textarea" ||
                (sel.tagName.toLowerCase() == "input" &&
                    sel.getAttribute("type").toLowerCase() == "text"))) {
            var text = sel.value;
            selText = text.substring(
                sel.selectionStart,
                sel.selectionEnd
                );
        }
        else {
            var selRange = window.getSelection();
            selText = selRange.toString();
        }
    } else {
        if (document.getSelection) {  // all browsers, except IE before version 9
            range = document.getSelection();
            selText = range.toString();
        } else if (document.selection.createRange) { // IE below version 9
            var range = document.selection.createRange();
            selText = range.text;
        }
    }
    return selText;
}
function isArray(arr) {
    return $.isArray(arr);
}
String.prototype.format = function () {
    var val = this.toString();
    for (var a = 0, i = 0; a < arguments.length; a++) {
        if (arguments[a] instanceof Array) {
            for (var j = 0; j < arguments[a].length; j++) {
                val = val.replace(new RegExp("\\{" + i++ + "\\}", "g"), arguments[a][j]);
            }
        } else {
            val = val.replace(new RegExp("\\{" + i++ + "\\}", "g"), arguments[a]);
        }
    }
    return val;
}
String.prototype.parseDate = function () {
    var reg = /^(\d{1,4})\-(\d{1,2})\-(\d{1,2})(\s(\d{1,2})(:(\d{1,2})(:(\d{1,2}))?)?)?$/gi;
    var result = reg.exec(this);
    if (!result) result = reg.exec(this);
    if (result) {
        return new Date(
            result[1] ? parseInt(result[1], 10) : 0,
            result[2] ? parseInt(result[2], 10) - 1 : 0,
            result[3] ? parseInt(result[3], 10) : 0,
            result[5] ? parseInt(result[5], 10) : 0,
            result[7] ? parseInt(result[7], 10) : 0,
            result[9] ? parseInt(result[9], 10) : 0);
    } else {
        reg = /^(\d{1,4})\-(\d{1,2})\-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{7})$/gi;
        result = reg.exec(this);
        if (result) {
            return new Date(result[1], result[2] ? parseInt(result[2], 10) - 1 : 0, result[3], result[4], result[5], result[6]);
        }
    }
}

Date.prototype.toString = function (f) {
    function tempfunc(opo, pos) {
        var val = ''; opo = String(opo);
        for (var a = 1; a < arguments.length; a++) {
            var chr = opo.charAt(arguments[a] - 1); val += chr;
        } return val;
    }
    if (!f) f = 'yyyy-MM-dd HH:mm:ss';
    var h12 = this.getHours() > 12 ? (this.getHours() - 12) : this.getHours()
    var tmp = {
        'yyyy': this.getFullYear(),
        'yy': tempfunc(this.getYear(), 3, 4),
        'MM': (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1),
        'M': this.getMonth() + 1,
        'dd': (this.getDate() < 10 ? '0' : '') + this.getDate(),
        'd': this.getDate(),
        'hh': (h12 < 10 ? '0' : '') + h12,
        'h': h12,
        'HH': (this.getHours() < 10 ? '0' : '') + this.getHours(),
        'H': this.getHours(),
        'mm': (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(),
        'm': this.getMinutes(),
        'ss': (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(),
        's': this.getSeconds()
    };
    for (var p in tmp) f = f.replace(new RegExp('\\b' + p + '\\b', 'g'), tmp[p]);
    return f;
}

Array.prototype.indexOf = function (a) {
    for (var i = 0, j; j = this[i]; i++) {
        if (a == j) { return i; }
    }
    return -1;
}
Array.prototype.lastIndexOf = function (a) {
    for (var i = this.length, j; j = this[i]; i--)
        if (a == j) return i;
    return -1;
}
Array.prototype.GetRange = function (index, count) {
    var tmp = [];
    for (var i = index; i < count; i++) {
        tmp[i] = this[i];
    }
    return tmp;
}
Array.prototype.remove = function (index, count) {
    count = count || 1;
    return this.slice(0, index).concat(this.slice(index + count, this.length))
}
Array.prototype.distinct = function () {
    var res = [], hash = {};
    for (var i = 0, elem; (elem = this[i]) != null; i++) {
        if (!hash[elem]) {
            res.push(elem);
            hash[elem] = true;
        }
    }
    return res;
}
Number.prototype.round = function (r) {
    r = typeof (r) == 'undefined' ? 1 : r;
    var rv = String(this);
    var io = rv.indexOf('.');
    var ri = io == -1 ? '' : rv.substr(io + 1, r);
    var le = io == -1 ? (rv + '.') : rv.substr(0, io + 1 + r);
    for (var a = ri.length; a < r; a++) le += '0';
    return le;
}

function radioValue(name) {
    var rs = document.getElementsByName(name);
    for (var i = 0; i < rs.length; i++) {
        if (rs[i].checked) return rs[i].value;
    }
    return "";
}
var week = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
function getWeekString(day) {
    switch (day) {
        case 0: return week[6];
        case 1: return week[0];
        case 2: return week[1];
        case 3: return week[2];
        case 4: return week[3];
        case 5: return week[4];
        case 6: return week[5];
    }
    return '';
}
