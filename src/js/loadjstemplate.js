//myjs的插入模板功能需要知道jsTemplate的内容，故设为全局变量
var jsTemplate_source;
var jsTemplate_dataAdapter;

$(document).ready(function() {
    var base_height = $("#nav-section").height() - $("#dash-logo").outerHeight(true);
    ////////////////
    //分割栏初始化//
    ////////////////
    $("#jsTemplate_splitter").jqxSplitter({
        width: '100%',
        height: base_height > 0 ? base_height : 0,
        panels: [{
            size: '400px'
        }]
    });

    ////////////////
    //js列表初始化//
    ////////////////
    var jsTemplate_last_select_index = -1;
    var jsTemplate_is_select_rollback = false;
    var jsTemplate_last_select_name = "";

    //数据源与datafields
    jsTemplate_source = {
        datatype: "json",
        datafields: [{
            name: "js_uri"
        }, {
            name: "js_name"
        }, {
            name: "js_description"
        }, {
            name: "js_name_abbr"
        }, {
            name: "js_description_abbr"
        } ],

        id: "js_name",
        url: urlbase + "?js_template_cmd=list"
    };

    jsTemplate_dataAdapter = new $.jqx.dataAdapter(jsTemplate_source, {
        loadComplete: function() {
            if (jsTemplate_last_select_name !== "") {
                $("#jsTemplate_listbox").jqxListBox('selectItem', jsTemplate_last_select_name);
                jsTemplate_last_select_name = "";
            }
        }
    });

    $('#jsTemplate_listbox').jqxListBox({
        selectedIndex: -1,
        source: jsTemplate_dataAdapter,
        displayMember: "js_name",
        valueMember: "js_name",
        itemHeight: 60,
        width: '100%',
        height: base_height - 29 > 0 ? base_height - 29 : 0,
        renderer: function(index, label, value) {
            //注：js_name_abbr与js_description_abbr经过了stripStr
            var datarecord = jsTemplate_dataAdapter.records[index];

            var imgurl = 'static/images/js_icon.png';
            var img = '<img height="50" width="50" src="' + imgurl + '"/>';
            var table = '<table class="listbox_item_table"><tr><td class="listbox_item_img" rowspan="2">' + img + '</td><td class="listbox_item_name">' + datarecord.js_name_abbr + '.js</td></tr><tr><td class="listbox_item_description">' + datarecord.js_description_abbr + '</td></tr></table>';

            return table;
        }
    });

    $('#jsTemplate_listbox').on('select', function(event) {
        jsTemplate_update_form(event.args.index);
    });

    //////////////////
    //js列表相关函数//
    //////////////////

    //清空编辑表单
    function jsTemplate_clear_form() {
        $('#jsTemplate_name').val("");
        $('#jsTemplate_description').val("");

        jsTemplate_editor.setValue("", -1);
        $('#jsTemplate_form').data('changed', false);

    }

    //根据列表选中的index，加载编辑表单
    function jsTemplate_update_form(current_select_index) {
        if (jsTemplate_is_select_rollback) {
            jsTemplate_is_select_rollback = false;
            return;
        }

        if ($('#jsTemplate_form').data('changed')) {

            if (confirm("------------------------------------\n提示：未保存的内容将会丢失！\n------------------------------------\n\n确认离开吗？")) {
                $('#jsTemplate_form').data('changed', false);
                jsTemplate_last_select_index = current_select_index;
            } else {
                jsTemplate_is_select_rollback = true;
                $('#jsTemplate_listbox').jqxListBox('selectIndex', jsTemplate_last_select_index);
                return;
            }

        } else {
            jsTemplate_last_select_index = current_select_index;
        }

        //index为-1，代表list没有选中项，现在是新增一个js
        if (current_select_index === -1) {
            $('#jsTemplate_ok').text('新增');
            jsTemplate_clear_form();
        }
        //index为大于0代表现在是修改一个js
        else {
            $('#jsTemplate_ok').text('修改');
            var datarecord = jsTemplate_dataAdapter.records[current_select_index];
            $('#jsTemplate_name').val(datarecord.js_name);
            $('#jsTemplate_description').val(datarecord.js_description);

            jsTemplate_update_content(datarecord.js_name);
        }
    }

    //根据列表选中的index，将对应js的内容加载到编辑器中
    function jsTemplate_update_content(filename) {
        $('#jsTemplate_form').data('changed', false);
        jsTemplate_editor.setReadOnly(true);

        $.ajax({
            url: urlbase + "?js_template_cmd=get&name=" + filename,
            dataType: "json",
            timeout: interval,
            success: function(data) {
                jsTemplate_editor.setValue(data, -1);
                $('#jsTemplate_form').data('changed', false);
                jsTemplate_editor.setReadOnly(false);
            },
            complete: function(XMLHttpRequest, status) {
                if (status == 'timeout') {
                    alert("载入超时！");
                } else if (status == "parsererror") {
                    window.location.href = "login.php";
                }
            }
        });
    }

    //重新载入js列表
    function reload_jsTemplate_listbox() {
        $('#jsTemplate_form').data('changed', false);
        jsTemplate_dataAdapter.dataBind();
    }

    //////////////////////
    //js列表工具栏初始化//
    //////////////////////
    $("#jsTemplate_add_button").jqxButton({
        width: 65,
        height: 20
    });
    $("#jsTemplate_del_button").jqxButton({
        width: 65,
        height: 20
    });
    $("#jsTemplate_clear_button").jqxButton({
        width: 65,
        height: 20
    });

    $("#jsTemplate_add_button").click(function(event) {
        $('#jsTemplate_listbox').jqxListBox('selectIndex', -1);
    });

    $("#jsTemplate_del_button").click(function(event) {
        var index = $("#jsTemplate_listbox").jqxListBox('getSelectedIndex');
        if (index >= 0) {
            if (confirm("您确认执行删除操作么？")) {
                var datarecord = jsTemplate_dataAdapter.records[index];
                $.ajax({
                    url: urlbase + "?js_template_cmd=del&name=" + datarecord.js_name,
                    dataType: "json",
                    timeout: interval,
                    success: function(result) {
                        if (result) {
                            $('#jsTemplate_listbox').jqxListBox('selectIndex', -1);
                            reload_jsTemplate_listbox();
                        } else {
                            $('#failedWindow').jqxWindow('open');
                            $("#failedWindow").addClass('animated');
                        }

                    },
                    complete: function(XMLHttpRequest, status) {
                        if (status == 'timeout') {
                            $('#failedWindow').jqxWindow('open');
                            $("#failedWindow").addClass('animated');
                        } else if (status == "parsererror") {
                            window.location.href = "login.php";
                        }
                    }
                });
            }
        }
    });

    $("#jsTemplate_clear_button").click(function(event) {
        if (confirm("您确认清空所有JS模板么？")) {
            $.ajax({
                url: urlbase + "?js_template_cmd=clear",
                dataType: "json",
                timeout: interval,
                success: function(result) {
                    if (result) {
                        $('#jsTemplate_listbox').jqxListBox('selectIndex', -1);
                        reload_jsTemplate_listbox();
                    } else {
                        $('#failedWindow').jqxWindow('open');
                        $("#failedWindow").addClass('animated');
                    }

                },
                complete: function(XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        $('#failedWindow').jqxWindow('open');
                        $("#failedWindow").addClass('animated');
                    } else if (status == "parsererror") {
                        window.location.href = "login.php";
                    }
                }
            });
        }
    });

    //////////////////////
    //编辑面板表单初始化//
    //////////////////////
    $("#jsTemplate_form").change(function() {
        $('#jsTemplate_form').data('changed', true);
    });

    //////////////////////////
    //编辑面板输入控件初始化//
    //////////////////////////
    $("#jsTemplate_name").jqxInput({
        width: '80%',
        height: '20px',
        placeHolder: '请输入js模板名...'
    });
    $('#jsTemplate_description').jqxTextArea({
        width: '100%',
        height: 50,
        placeHolder: '请输入js模板描述...'
    });

    ////////////////
    //编辑器初始化//
    ////////////////
    $('#jsTemplate_content').height(base_height - 207 > 0 ? base_height - 207 : 0);

    var jsTemplate_editor = ace.edit("jsTemplate_content");
    jsTemplate_editor.setTheme("ace/theme/chrome");
    jsTemplate_editor.session.setMode("ace/mode/javascript");
    jsTemplate_editor.session.setUseWrapMode(true);

    jsTemplate_editor.renderer.setScrollMargin(10, 10);
    jsTemplate_editor.setOptions({
        // "scrollPastEnd": 0.8,
        autoScrollEditorIntoView: true
    });
    jsTemplate_editor.on("change", function() {
        $('#jsTemplate_form').data('changed', true);

    });
    jsTemplate_editor.$blockScrolling = Infinity;
    jsTemplate_editor.setFontSize(16);

    //////////////////////
    //编辑器工具栏初始化//
    //////////////////////
    $("#jsTemplate_content_toolBar").jqxToolBar({
        width: "100%",
        height: 35,
        minimizeWidth: 100,
        tools: 'button | button | button',
        initTools: function(type, index, tool, menuToolIninitialization) {
            if (type == "button") {
                tool.attr("type", "button");
            }
            switch (index) {
                case 0:
                    tool.val("格式化");
                    tool.click(function() {
                        var source = jsTemplate_editor.getValue();
                        if (source !== "") {
                            var output = js_beautify(source);
                            jsTemplate_editor.setValue(output, -1);
                        }

                    });

                    break;
                case 1:
                    tool.val("压缩");
                    tool.click(function() {
                        var source = jsTemplate_editor.getValue();
                        if (source !== "") {
                            var output = jsmin(source, 3);
                            jsTemplate_editor.setValue(output.trim(), -1);
                        }
                    });

                    break;
                case 2:
                    tool.val("复制js地址");
                    var client = new ZeroClipboard(tool);

                    client.on("copy", function(event) {
                        var index = $("#jsTemplate_listbox").jqxListBox('getSelectedIndex');
                        if (index >= 0) {
                            var clipboard = event.clipboardData;
                            var datarecord = jsTemplate_dataAdapter.records[index];
                            var pos = window.location.href.lastIndexOf("/");
                            var url = window.location.href.substr(0, pos + 1) + datarecord.js_uri;
                            clipboard.setData("text/plain", url);
                            //alert("JS地址已复制至剪切板\n" + url);
                        } else {
                            alert("请先保存！");
                        }
                    });

                    break;

            }
        }
    });


    //////////////////////////
    //编辑表单提交按键初始化//
    //////////////////////////
    $("#jsTemplate_ok").jqxButton({
        width: 65,
        height: 25
    });

    $("#jsTemplate_cancel").jqxButton({
        width: 65,
        height: 25
    });

    $("#jsTemplate_ok").click(function(event) {
        var name = $('#jsTemplate_name').val();
        var desc = $('#jsTemplate_description').val();

        var content = jsTemplate_editor.getValue();
        var index = $("#jsTemplate_listbox").jqxListBox('getSelectedIndex');

        //当前状态为新增一个js
        if (index === -1) {
            var data = {
                'name': name,
                'desc': desc,
                'content': content
            };
            $.ajax({
                type: 'POST',
                data: data,
                url: urlbase + "?js_template_cmd=add",
                dataType: "json",
                timeout: interval,
                success: function(result) {
                    if (result) {
                        jsTemplate_last_select_name = name;
                        reload_jsTemplate_listbox();
                    } else {
                        //操作失败！
                        $('#failedWindow').jqxWindow('open');
                        $("#failedWindow").addClass('animated');
                    }
                },
                complete: function(XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        //操作失败！
                        $('#failedWindow').jqxWindow('open');
                        $("#failedWindow").addClass('animated');
                    } else if (status == "parsererror") {
                        window.location.href = "login.php";
                    }
                }
            });
        }
        //当前状态为修改一个js
        else {
            var datarecord = jsTemplate_dataAdapter.records[index];
            var data = {
                'old_name': datarecord.js_name,
                'name': name,
                'desc': desc,
                'content': content
            };
            $.ajax({
                type: 'POST',
                data: data,
                url: urlbase + "?js_template_cmd=modify",
                dataType: "json",
                timeout: interval,
                success: function(result) {
                    if (result) {
                        jsTemplate_last_select_name = name;
                        reload_jsTemplate_listbox();
                    } else {
                        //操作失败！
                        $('#failedWindow').jqxWindow('open');
                        $("#failedWindow").addClass('animated');
                    }
                },
                complete: function(XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        //操作失败！
                        $('#failedWindow').jqxWindow('open');
                        $("#failedWindow").addClass('animated');
                    } else if (status == "parsererror") {
                        window.location.href = "login.php";
                    }
                }
            });
        }
    });

    $("#jsTemplate_cancel").click(function(event) {
        $('#jsTemplate_form').data('changed', false);
        var index = $("#jsTemplate_listbox").jqxListBox('getSelectedIndex');

        jsTemplate_update_form(index);

    });

    //////////////
    //大小自适应//
    //////////////
    $(window).resize(function() {
        var base_height = $("#nav-section").height() - $("#dash-logo").outerHeight(true);
        $("#jsTemplate_splitter").jqxSplitter({
            height: base_height > 0 ? base_height : 0
        });

        $('#jsTemplate_listbox').jqxListBox({
            height: base_height - 29 > 0 ? base_height - 29 : 0
        });

        $('#jsTemplate_content').height(base_height - 207 > 0 ? base_height - 207 : 0);
    });

});