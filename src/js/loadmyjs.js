$(document).ready(function() {
    var base_height = $("#nav-section").height() - $("#dash-logo").outerHeight(true);
    ////////////////
    //分割栏初始化//
    ////////////////
    $("#myJS_splitter").jqxSplitter({
        width: '100%',
        height: base_height > 0 ? base_height : 0,
        panels: [{
            size: '400px'
        }]
    });

    ////////////////
    //js列表初始化//
    ////////////////
    var myJS_last_select_index = -1;
    var myJS_is_select_rollback = false;
    var myJS_last_select_name = "";

    //数据源与datafields
    var myJS_source = {
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
        url: urlbase + "?my_js_cmd=list"
    };

    var myJS_dataAdapter = new $.jqx.dataAdapter(myJS_source, {
        loadComplete: function() {
            if (myJS_last_select_name !== "") {
                $("#myJS_listbox").jqxListBox('selectItem', myJS_last_select_name);
                myJS_last_select_name = "";
            }
        }
    });

    $('#myJS_listbox').jqxListBox({
        selectedIndex: -1,
        source: myJS_dataAdapter,
        displayMember: "js_name",
        valueMember: "js_name",
        itemHeight: 60,
        width: '100%',
        height: base_height - 29 > 0 ? base_height - 29 : 0,
        renderer: function(index, label, value) {
            //注：js_name_abbr与js_description_abbr经过了stripStr
            var datarecord = myJS_dataAdapter.records[index];
            var imgurl = 'static/images/js_icon.png';
            var img = '<img height="50" width="50" src="' + imgurl + '"/>';
            var table = '<table class="listbox_item_table"><tr><td class="listbox_item_img" rowspan="2">' + img + '</td><td class="listbox_item_name">' + datarecord.js_name_abbr + '.js</td></tr><tr><td class="listbox_item_description">' + datarecord.js_description_abbr + '</td></tr></table>';

            return table;
        }
    });

    $('#myJS_listbox').on('select', function(event) {
        myJS_update_form(event.args.index);
    });

    //////////////////
    //js列表相关函数//
    //////////////////

    //清空编辑表单
    function myJS_clear_form() {
        $('#myJS_name').val("");
        $('#myJS_description').val("");

        myJS_editor.setValue("", -1);
        $('#myJS_form').data('changed', false);

    }

    //根据列表选中的index，加载编辑表单
    function myJS_update_form(current_select_index) {
        if (myJS_is_select_rollback) {
            myJS_is_select_rollback = false;
            return;
        }

        if ($('#myJS_form').data('changed')) {

            if (confirm("------------------------------------\n提示：未保存的内容将会丢失！\n------------------------------------\n\n确认离开吗？")) {
                $('#myJS_form').data('changed', false);
                myJS_last_select_index = current_select_index;
            } else {
                myJS_is_select_rollback = true;
                $('#myJS_listbox').jqxListBox('selectIndex', myJS_last_select_index);
                return;
            }

        } else {
            myJS_last_select_index = current_select_index;
        }

        //index为-1，代表list没有选中项，现在是新增一个js
        if (current_select_index === -1) {
            $('#myJS_ok').text('新增');
            myJS_clear_form();
        }
        //index为大于0代表现在是修改一个js
        else {
            $('#myJS_ok').text('修改');
            var datarecord = myJS_dataAdapter.records[current_select_index];
            $('#myJS_name').val(datarecord.js_name);
            $('#myJS_description').val(datarecord.js_description);

            myJS_update_content(datarecord.js_name);
        }
    }

    //根据列表选中的index，将对应js的内容加载到编辑器中
    function myJS_update_content(filename) {
        $('#myJS_form').data('changed', false);
        myJS_editor.setReadOnly(true);

        $.ajax({
            url: urlbase + "?my_js_cmd=get&name=" + filename,
            dataType: "json",
            timeout: interval,
            success: function(data) {
                myJS_editor.setValue(data, -1);
                $('#myJS_form').data('changed', false);
                myJS_editor.setReadOnly(false);
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
    function reload_myJS_listbox() {
        $('#myJS_form').data('changed', false);
        myJS_dataAdapter.dataBind();
    }

    //////////////////////
    //js列表工具栏初始化//
    //////////////////////
    $("#myJS_add_button").jqxButton({
        width: 65,
        height: 20
    });
    $("#myJS_del_button").jqxButton({
        width: 65,
        height: 20
    });
    $("#myJS_clear_button").jqxButton({
        width: 65,
        height: 20
    });

    $("#myJS_add_button").click(function(event) {
        $('#myJS_listbox').jqxListBox('selectIndex', -1);
    });

    $("#myJS_del_button").click(function(event) {
        var index = $("#myJS_listbox").jqxListBox('getSelectedIndex');
        if (index >= 0) {
            if (confirm("您确认执行删除操作么？")) {
                var datarecord = myJS_dataAdapter.records[index];
                $.ajax({
                    url: urlbase + "?my_js_cmd=del&name=" + datarecord.js_name,
                    dataType: "json",
                    timeout: interval,
                    success: function(result) {
                        if (result) {
                            $('#myJS_listbox').jqxListBox('selectIndex', -1);
                            reload_myJS_listbox();
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

    $("#myJS_clear_button").click(function(event) {
        if (confirm("您确认清空所有JS模板么？")) {
            $.ajax({
                url: urlbase + "?my_js_cmd=clear",
                dataType: "json",
                timeout: interval,
                success: function(result) {
                    if (result) {
                        $('#myJS_listbox').jqxListBox('selectIndex', -1);
                        reload_myJS_listbox();
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
    $("#myJS_form").change(function() {
        $('#myJS_form').data('changed', true);
    });

    //////////////////////////
    //编辑面板输入控件初始化//
    //////////////////////////
    $("#myJS_name").jqxInput({
        width: '80%',
        height: '20px',
        placeHolder: '请输入js模板名...'
    });

    $('#myJS_description').jqxTextArea({
        width: '100%',
        height: 50,
        placeHolder: '请输入js模板描述...'
    });

    ////////////////
    //编辑器初始化//
    ////////////////
    $('#myJS_content').height(base_height - 207 > 0 ? base_height - 207 : 0);

    var myJS_editor = ace.edit("myJS_content");
    myJS_editor.setTheme("ace/theme/chrome");
    myJS_editor.session.setMode("ace/mode/javascript");
    myJS_editor.session.setUseWrapMode(true);

    myJS_editor.renderer.setScrollMargin(10, 10);
    myJS_editor.setOptions({
        // "scrollPastEnd": 0.8,
        autoScrollEditorIntoView: true
    });
    myJS_editor.on("change", function() {
        $('#myJS_form').data('changed', true);

    });
    myJS_editor.$blockScrolling = Infinity;
    myJS_editor.setFontSize(16);

    //////////////////////
    //编辑器工具栏初始化//
    //////////////////////

    $("#myJS_content_toolBar").jqxToolBar({
        width: "100%",
        height: 35,
        minimizeWidth: 100,
        tools: 'button | button | combobox button | button | button',
        initTools: function(type, index, tool, menuToolIninitialization) {
            if (type == "button") {
                tool.attr("type", "button");
            }
            switch (index) {
                case 0:
                    tool.val("格式化");
                    tool.click(function() {
                        var source = myJS_editor.getValue();
                        if (source !== "") {
                            var output = js_beautify(source);
                            myJS_editor.setValue(output, -1);
                        }

                    });

                    break;
                case 1:
                    tool.val("压缩");
                    tool.click(function() {
                        var source = myJS_editor.getValue();
                        if (source !== "") {
                            var output = jsmin(source, 3);
                            myJS_editor.setValue(output.trim(), -1);
                        }
                    });
                    break;

                case 2:
                    tool.attr("id", "insert_jsTemplate_button");
                    break;
                case 3:
                    tool.val("插入模板");

                    tool.click(function() {
                        var index = $("#insert_jsTemplate_button").jqxComboBox('getSelectedIndex');
                        if (index >= 0) {
                            var datarecord = jsTemplate_dataAdapter.records[index];
                            $.ajax({
                                url: urlbase + "?js_template_cmd=get&name=" + datarecord.js_name,
                                dataType: "json",
                                timeout: interval,
                                success: function(data) {
                                    myJS_editor.insert(data);
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

                    });
                    break;
                case 4:
                    tool.val("生成payload");
                    tool.click(function() {
                        var index = $("#myJS_listbox").jqxListBox('getSelectedIndex');
                        if (index >= 0) {
                            var datarecord = myJS_dataAdapter.records[index];
                            var pos = window.location.href.lastIndexOf("/");
                            var url = window.location.href.substr(0, pos + 1) + datarecord.js_uri;

                            $("#Ww_B_0_textarea").val('<script src="' + url + '"></script>');
                            $('#xssorWindow').jqxWindow('open');
                            $('#xssorWindow').addClass('animated');
                        } else {
                            alert("请先保存！");
                        }

                    });

                    break;
                case 5:
                    tool.val("复制js地址");
                    var client = new ZeroClipboard(tool);

                    client.on("copy", function(event) {
                        var index = $("#myJS_listbox").jqxListBox('getSelectedIndex');
                        if (index >= 0) {
                            var clipboard = event.clipboardData;
                            var datarecord = myJS_dataAdapter.records[index];
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



    $("#insert_jsTemplate_button").jqxComboBox({
        source: jsTemplate_dataAdapter,
        selectedIndex: 0,
        displayMember: "js_name",
        valueMember: "js_name",
        width: 200,
        autoDropDownHeight: false,
        placeHolder: "选择js模板",

        renderer: function(index, label, value) {

            var datarecord = jsTemplate_dataAdapter.records[index];
            var imgurl = 'static/images/js_icon.png';
            var img = '<img height="50" width="50" src="' + imgurl + '"/>';
            var table = '<table class="listbox_item_table"><tr><td class="listbox_item_img" rowspan="2">' + img + '</td><td class="listbox_item_name">' + datarecord.js_name_abbr + '.js</td></tr><tr><td class="listbox_item_description">' + datarecord.js_description_abbr + '</td></tr></table>';
            return table;
        }
    });
    //////////////////////////
    //编辑表单提交按键初始化//
    //////////////////////////
    $("#myJS_ok").jqxButton({
        width: 65,
        height: 25
    });

    $("#myJS_cancel").jqxButton({
        width: 65,
        height: 25
    });

    $("#myJS_ok").click(function(event) {
        var name = $('#myJS_name').val();
        var desc = $('#myJS_description').val();

        var content = myJS_editor.getValue();
        var index = $("#myJS_listbox").jqxListBox('getSelectedIndex');

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
                url: urlbase + "?my_js_cmd=add",
                dataType: "json",
                timeout: interval,
                success: function(result) {
                    if (result) {
                        myJS_last_select_name = name;
                        reload_myJS_listbox();
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
            var datarecord = myJS_dataAdapter.records[index];
            var data = {
                'old_name': datarecord.js_name,
                'name': name,
                'desc': desc,
                'content': content
            };
            $.ajax({
                type: 'POST',
                data: data,
                url: urlbase + "?my_js_cmd=modify",
                dataType: "json",
                timeout: interval,
                success: function(result) {
                    if (result) {
                        myJS_last_select_name = name;
                        reload_myJS_listbox();
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

    $("#myJS_cancel").click(function(event) {
        $('#myJS_form').data('changed', false);
        var index = $("#myJS_listbox").jqxListBox('getSelectedIndex');

        myJS_update_form(index);

    });

    /////////
    //xssor//
    /////////
    $('#xssorWindow').jqxWindow({
        height: 290,
        width: 610,
        resizable: false,
        isModal: true,
        modalOpacity: 0.3,
        autoOpen: false,
        title: "XSS'OR js编码工具"
    });

    $("#Ww_B_0_textarea").jqxTextArea({
        height: 220,
        width: 270
    });

    $("#rwb_b2").jqxButton();
    $("#rwb_b2_j").jqxButton();
    $("#rwb_b1").jqxButton();
    $("#rwb_b1_j").jqxButton();
    $("#rwb_b3").jqxButton();
    $("#rwb_b3j").jqxButton();
    $("#rwb_b4").jqxButton();
    $("#rwb_b4j").jqxButton();
    $("#rwb_b5").jqxButton();
    $("#rwb_b5j").jqxButton();
    $("#rwb_b6").jqxButton();
    $("#rwb_b6j").jqxButton();
    $("#rwb_b7").jqxButton();
    $("#rwb_b7j").jqxButton();
    $("#rwb_b8").jqxButton();

    //////////////
    //大小自适应//
    //////////////
    $(window).resize(function() {
        var base_height = $("#nav-section").height() - $("#dash-logo").outerHeight(true);
        $("#myJS_splitter").jqxSplitter({
            height: base_height > 0 ? base_height : 0
        });

        $('#myJS_listbox').jqxListBox({
            height: base_height - 29 > 0 ? base_height - 29 : 0
        });

        $('#myJS_content').height(base_height - 207 > 0 ? base_height - 207 : 0);
    });

});