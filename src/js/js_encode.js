//代码地址https://github.com/evilcos/xssor
//本人仅作一些小改动移植到xss平台上
//code by yuxi4n
$("#rwb_b2").click(function() {
    knownxss.encode.en(16);
});

$("#rwb_b2_j").click(function() {
    knownxss.encode.de(16);
});

$("#rwb_b1").click(function() {
    knownxss.encode.en(10);
});
$("#rwb_b1_j").click(function() {
    knownxss.encode.de(10);
});
$("#rwb_b3").click(function() {
    knownxss.encode._escape();
});
$("#rwb_b3j").click(function() {
    knownxss.encode._unescape();
});
$("#rwb_b4").click(function() {
    knownxss.encode._encodeURI();
});
$("#rwb_b4j").click(function() {
    knownxss.encode._decodeURI();
});
$("#rwb_b5").click(function() {
    knownxss.encode.html2js(1);
});
$("#rwb_b5j").click(function() {
    knownxss.encode.html2js(2);
});
$("#rwb_b6").click(function() {
    knownxss.encode.htmlencode(1);
});
$("#rwb_b6j").click(function() {
    knownxss.encode.htmlencode(2);
});
$("#rwb_b7").click(function() {
    knownxss.encode.base64Code(1);
});
$("#rwb_b7j").click(function() {
    knownxss.encode.base64Code(2);
});
$("#rwb_b8").click(function() {
    knownxss.encode.replaceC();
});

function _g(x) {
    return document.getElementById(x);
}

var knownxss = {
    Author: 'yuxi4n',
    time: '2008-12-01'
};
knownxss.encode = {};
knownxss.encode._escape = function() {
    _g('Ww_B_0_textarea').value = escape(_g('Ww_B_0_textarea').value);
};
knownxss.encode._unescape = function() {
    _g('Ww_B_0_textarea').value = unescape(_g('Ww_B_0_textarea').value);
};
knownxss.encode._encodeURI = function() {
    _g('Ww_B_0_textarea').value = encodeURI(_g('Ww_B_0_textarea').value);
};
knownxss.encode._decodeURI = function() {
    _g('Ww_B_0_textarea').value = decodeURI(_g('Ww_B_0_textarea').value);
};
knownxss.encode.en = function(x) {
    var _a = new Array();
    var txt = _g('Ww_B_0_textarea').value;
    if (x == 10) {
        for (var i = 0; i < txt.length; i++) {
            var _a;
            var s = txt.charCodeAt(i).toString(16);
            if (_g('rwb_b1_c2').checked) _a += "&#" + new Array(7 - String(s).length).join("0") + txt.charCodeAt(i);
            else if (_g('rwb_b1_c3').checked) _a += "&#" + txt.charCodeAt(i) + ";";
            else if (_g('rwb_b1_c4').checked) {
                if (i < txt.length - 1) _a += txt.charCodeAt(i) + ",";
                else {
                    _a += txt.charCodeAt(i) + ",";
                    _a = "cos:expression(eval(String.fromCharCode(105,102,40,33,119,105,110,100,111,119,46,120,41,123," + _a + "59,119,105,110,100,111,119,46,120,61,49,59,125)))";
                }
            } else _a += txt.charCodeAt(i) + ",";
        }
        if (_a.substr(-1, 1) == ',') _a = _a.substr(0, _a.length - 1);
        _g('Ww_B_0_textarea').value = _a;
    }
    if (x == 16) {
        for (i = 0; i < txt.length; i++) {
            s = txt.charCodeAt(i).toString(16);
            if (_g('rwb_b2_c2').checked) _a += "&#x" + new Array(5 - String(s).length).join("0") + s + ";";
            else _a += "\\u" + new Array(5 - String(s).length).join("0") + s;
        }
        _g('Ww_B_0_textarea').value = _a;
    }
};
knownxss.encode.de = function(x) {
    var _a = new Array();
    var txt = _g('Ww_B_0_textarea').value;
    if (x == 10) {
        if (_g('rwb_b1_c2').checked) {
            var s = txt.split("&");
            for (i = 1; i < s.length; i++) {
                s[i] = s[i].replace('#', '');
                _a += String.fromCharCode(s[i]);
            }
        } else if (_g('rwb_b1_c3').checked) {
            s = txt.split(";");
            for (i = 0; i < s.length - 1; i++) {
                s[i] = s[i].replace('&#', '');
                _a += String.fromCharCode(s[i]);
            }
        } else if (_g('rwb_b1_c4').checked) {
            txt = txt.substring(txt.indexOf("105,102,40,33,119,105,110,100,111,119,46,120,41,123,") + 52, txt.indexOf("59,119,105,110,100,111,119,46,120,61,49,59,125"));
            s = txt.split(",");
            for (i = 0; i < s.length; i++)
                _a += String.fromCharCode(s[i]);
        } else {
            s = txt.split(",");
            for (i = 0; i < s.length; i++)
                _a += String.fromCharCode(s[i]);
        }
        _g('Ww_B_0_textarea').value = _a;
    }
    if (x == 16) {
        if (_g('rwb_b2_c2').checked) {
            var _a = new Array();
            s = txt.split(";");
            for (i = 0; i < s.length - 1; i++) {
                s[i] = s[i].replace('&#x', '');
                _a += String.fromCharCode(parseInt(s[i], 16));
            }
        } else {
            var _a = new Array();
            s = txt.split("\\");
            for (var i = 1; i < s.length; i++) {
                s[i] = s[i].replace('u', '');
                _a += String.fromCharCode(parseInt(s[i], 16));
            }
        }
        _g('Ww_B_0_textarea').value = _a;
    }
};
knownxss.encode.copy_ok = function() {
    _g('Ww_B_0_textarea').style.background = '#DDDDDD';
    setTimeout("_g('Ww_B_0_textarea').style.background='#FFFFFF'", 700);
};
knownxss.encode.html2js = function(i) {
    var txt = _g('Ww_B_0_textarea').value;
    if (i == 1)
        _g('Ww_B_0_textarea').value = "document.writeln(\"" + txt.replace(/\\/g, "\\\\").replace(/\//g, "\\/").replace(/\'/g, "\\\'").replace(/\"/g, "\\\"").split('\r\n').join("\");\ndocument.writeln(\"") + "\");";
    if (i == 2)
        _g('Ww_B_0_textarea').value = txt.replace(/document.writeln\("/g, "").replace(/"\);/g, "").replace(/\\\"/g, "\"").replace(/\\\'/g, "\'").replace(/\\\//g, "\/").replace(/\\\\/g, "\\");
};
knownxss.encode.htmlencode = function(i) {
    var txt = _g('Ww_B_0_textarea').value;
    if (i == 1)
        _g('Ww_B_0_textarea').value = txt.replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (i == 2)
        _g('Ww_B_0_textarea').value = txt.replace(/&amp;/g, '&').replace(/&quot;/g, '\"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
};
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
    58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
    37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

knownxss.encode.base64encode = function(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
};
knownxss.encode.base64decode = function(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);

        if (c1 == -1)
            break;
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);

        if (c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        do {
            c3 = str.charCodeAt(i++) & 0xff;

            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
};
knownxss.encode.utf16to8 = function(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
};
knownxss.encode.utf8to16 = function(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                out += str.charAt(i - 1);
                break;
            case 12:
            case 13:
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
};
knownxss.encode.base64Code = function(i) {
    var txt = _g('Ww_B_0_textarea').value;
    if (i == 1)
        _g('Ww_B_0_textarea').value = knownxss.encode.base64encode(knownxss.encode.utf16to8(txt));
    if (i == 2)
        _g('Ww_B_0_textarea').value = knownxss.encode.utf8to16(knownxss.encode.base64decode(txt));
};
knownxss.encode.replaceC = function() {
    var txt = _g('Ww_B_0_textarea').value;
    var _t = new Array();
    var oldV = _g('oldC').value;
    var newV = _g('newC').value;
    var s = txt.split(oldV);
    if (s.length > 1) {
        if (s[0] == '') {
            for (var i = 1; i < s.length; i++)
                _t += newV + s[i];
        } else if (s[s.length - 1] == '') {
            for (var i = 0; i < s.length - 1; i++)
                _t += s[i] + newV;
        } else {
            for (var i = 0; i < s.length; i++)
                if (i == s.length - 1) _t += s[i];
                else
                    _t += s[i] + newV;
        }
        _g('Ww_B_0_textarea').value = _t;
    }
};