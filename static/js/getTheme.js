function getTheme() {
    var theme = "office";
    var url = "../css/jqx."+theme+".css";

    if (document.createStyleSheet != undefined) {
        var hasStyle = false;
        $.each(document.styleSheets, function (index, value) {
            if (value.href != undefined && value.href.indexOf(theme) != -1) {
                hasStyle = true;
                return false;
            }
        });
        if (!hasStyle) {
            document.createStyleSheet(url);
        }
    }
    else {
        var hasStyle = false;
        if (document.styleSheets) {
            $.each(document.styleSheets, function (index, value) {
                if (value.href != undefined && value.href.indexOf(theme) != -1) {
                    hasStyle = true;
                    return false;
                }
            });
        }
        if (!hasStyle) {
            var link = $('<link rel="stylesheet" href="' + url + '" media="screen" />');
            link[0].onload = function () {
                if ($.jqx && $.jqx.ready) {
                    $.jqx.ready();
                };
            }
            $(document).find('head').append(link);
        }
    }
    $.jqx = $.jqx || {};
    $.jqx.theme = theme;
    return theme;
};
var theme = '';
try
{
    if (jQuery) {
        theme = getTheme();
    }
    else {
        $(document).ready(function () {
            theme = getThemegetThemegetThemegetThemegetThemegetTheme();
        });
    }
}
catch (error) {
    var er = error;
}