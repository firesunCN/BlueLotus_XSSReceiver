//全局变量
var urlbase = "./api.php"; //api.php基地址
var messageList = null; //记录缓存，用于判断是否有新的记录
var setIntervalID = null; //定时器ID，用于网络自适应，调节timeout
var interval = 2000; //向服务器获取记录的时间间隔，同时也是ajax timeout时间

$(document).ready(function() {
    var self = this;
    var base_height = $("#nav-section").height() - $("#dash-logo").outerHeight(true);
    //////////////////////
    //所有提示窗体初始化//
    //////////////////////

    //删除记录确认窗口
    $('#deleteConfirmWindow').jqxWindow({
        height: 100,
        width: 270,
        resizable: false,
        isModal: true,
        modalOpacity: 0.3,
        okButton: $('#deleteConfirm_ok'),
        cancelButton: $('#deleteConfirm_cancel'),
        autoOpen: false
    });
    $('#deleteConfirm_ok').jqxButton({
        width: '65px'
    });
    $('#deleteConfirm_cancel').jqxButton({
        width: '65px'
    });

    $('#deleteConfirmWindow').on('close',
        function(event) {
            if (event.args.dialogResult.OK) {
                var selectedrowindex = $("#panelGrid").jqxGrid('getselectedrowindex');
                var id = $("#panelGrid").jqxGrid('getrowid', selectedrowindex);

                $.ajax({
                    url: urlbase + "?cmd=del&id=" + id,
                    dataType: "json",
                    timeout: interval,
                    success: function(data) {
                        if (data == true) $("#panelGrid").jqxGrid('deleterow', id);
                        else {
                            $('#failedWindow').jqxWindow('open');
                        }
                    },
                    complete: function(XMLHttpRequest, status) {
                        if (status == 'timeout') {
                            $('#failedWindow').jqxWindow('open');
                        } else if (status == "parsererror")
                            window.location.href = "login.php";
                    }
                });

            }
        });

    //清空记录确认窗口
    $('#clearConfirmWindow').jqxWindow({
        height: 100,
        width: 270,
        resizable: false,
        isModal: true,
        modalOpacity: 0.3,
        okButton: $('#clearConfirm_ok'),
        cancelButton: $('#clearConfirm_cancel'),
        autoOpen: false
    });

    $('#clearConfirm_ok').jqxButton({
        width: '65px'
    });
    $('#clearConfirm_cancel').jqxButton({
        width: '65px'
    });

    $('#clearConfirmWindow').on('close',
        function(event) {
            if (event.args.dialogResult.OK) {

                $.ajax({
                    url: urlbase + "?cmd=clear",
                    dataType: "json",
                    timeout: interval,
                    success: function(data) {
                        if (data == true) $('#panelGrid').jqxGrid('clear');
                        else {
                            $('#failedWindow').jqxWindow('open');
                        }

                    },
                    complete: function(XMLHttpRequest, status) {
                        if (status == 'timeout') {
                            $('#failedWindow').jqxWindow('open');
                        } else if (status == "parsererror")
                            window.location.href = "login.php";
                    }
                });

            }
        });

	//注销确认窗口
    $('#logoutConfirmWindow').jqxWindow({
        height: 100,
        width: 270,
        resizable: false,
		isModal: true,
        modalOpacity: 0.3,
        okButton: $('#logoutConfirm_ok'),
        cancelButton: $('#logoutConfirm_cancel'),
        autoOpen: false
    });

    $('#logoutConfirm_ok').jqxButton({
        width: '65px'
    });
	
    $('#logoutConfirm_cancel').jqxButton({
        width: '65px'
    });

    $('#logoutConfirmWindow').on('close', function(event) {
		if (event.args.dialogResult.OK) {
			window.location.href = "logout.php";
		}
    });
	$("#logout").click(function(e) {
        $('#logoutConfirmWindow').jqxWindow('open');
        e.preventDefault();
    });
	
    $('#failedWindow').jqxWindow({
        height: 100,
        width: 270,
        resizable: false,
        isModal: true,
        modalOpacity: 0.3,
        okButton: $('#failed_ok'),
        autoOpen: false
    });

    $('#failed_ok').jqxButton({
        width: '65px'
    });

    //查询窗口
    $("#searchWindow").jqxWindow({
        resizable: false,
        autoOpen: false,
        isModal: true,
        modalOpacity: 0.3,
        width: 210,
        height: 180
    });

    $("#findButton").jqxButton({
        width: 70
    });
    $("#clearButton").jqxButton({
        width: 70
    });

    $("#dropdownlist").jqxDropDownList({
        autoDropDownHeight: true,
        selectedIndex: 0,
        width: 200,
        height: 23,
        source: ['时间', 'IP', '来源', '客户端', '请求', '携带数据', '保持连接']
    });

    $("#findButton").click(function() {
        $("#panelGrid").jqxGrid('clearfilters');
        var searchColumnIndex = $("#dropdownlist").jqxDropDownList('selectedIndex');
        var datafield = "";
        switch (searchColumnIndex) {
            case 0:
                datafield = "request_date_and_time_string";
                break;
            case 1:
                datafield = "user_IP";
                break;
            case 2:
                datafield = "location";
                break;
            case 3:
                datafield = "client";
                break;
            case 4:
                datafield = "request_method";
                break;
            case 5:
                datafield = "data_type";
                break;
            case 6:
                datafield = "keepsession";
                break;
        }

        var searchText = $("#search_input_field").val();
        var filtergroup = new $.jqx.filter();
        var filter_or_operator = 1;
        var filtervalue = searchText;
        var filtercondition = 'contains';
        var filter = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);
        filtergroup.addfilter(filter_or_operator, filter);
        $("#panelGrid").jqxGrid('addfilter', datafield, filtergroup);

        $("#panelGrid").jqxGrid('applyfilters');
    });

    $("#clearButton").click(function() {
        $("#panelGrid").jqxGrid('clearfilters');
    });


    //////////////
    //大小自适应//
    //////////////
    $(window).resize(function() {
        var base_height = $("#nav-section").height() - $("#dash-logo").outerHeight(true);
        $('#panelGrid').jqxGrid({
            height: base_height > 0 ? base_height : 0
        });

        //$('#panelGrid').jqxGrid('autoresizecolumn', 'request_date_and_time_string'); 
        //$('#panelGrid').jqxGrid('autoresizecolumn', 'data_type'); 
        //$('#panelGrid').jqxGrid('autoresizecolumn', 'user_IP');
    });


    /////////////////////
    //xss显示面板初始化//
    /////////////////////

    //数据源与datafields
    var grid_source = {
        datatype: "json",
        datafields: [{
            name: 'user_IP'
        }, {
            name: 'location'
        }, {
            name: 'data_type'
        }, {
            name: 'keepsession'
        }, {
            name: 'user_port'
        }, {
            name: 'protocol'
        }, {
            name: 'request_method'
        }, {
            name: 'request_URI'
        }, {
            name: 'request_time'
        }, {
            name: 'headers_data'
        }, {
            name: 'get_data'
        }, {
            name: 'post_data'
        }, {
            name: 'cookie_data'
        }, {
            name: 'decoded_get_data'
        }, {
            name: 'decoded_post_data'
        }, {
            name: 'decoded_cookie_data'
        }, {
            name: 'request_date_string'
        }, {
            name: 'request_time_string'
        }, {
            name: 'request_date_and_time_string'
        }, {
            name: 'client'
        } ],
        id: 'request_time',
        url: urlbase + "?cmd=list",
        root: 'data'
    };

    //从接口获得数据后的处理，格式化时间与根据useragent判断客户端
    var grid_dataAdapter = new $.jqx.dataAdapter(grid_source, {
        downloadComplete: function(data, status, xhr) {
            if (status == "success") {
                var i = data.length;
                while (i--) {
                    var date = new Date(data[i].request_time * 1000);
                    data[i].request_date_string = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
                    data[i].request_time_string = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                    data[i].request_date_and_time_string = data[i].request_date_string + " " + data[i].request_time_string;
                    data[i].keepsession = (data[i].keepsession === true) ? "是" : "否";
                    data[i].client = data[i].headers_data["User-Agent"] ? get_client_info(data[i].headers_data["User-Agent"]) : "未知";

                    var data_type = {};
                    var get_keys = Object.keys(data[i].get_data);
                    var post_keys = Object.keys(data[i].post_data);
                    var cookie_keys = Object.keys(data[i].cookie_data);
                    if (get_keys.length > 0) data_type.GET = get_keys;
                    if (post_keys.length > 0) data_type.POST = post_keys;
                    if (cookie_keys.length > 0) data_type.COOKIE = cookie_keys;

                    data[i].data_type = JSON.stringify(data_type);

                }
                return data;
            }
        }
    });

    //每行detail信息初始化
    var initrowdetails = function(index, parentElement, gridElement, datarecord) {
        var tabsdiv = null;
        var information = null;
        var get_grid = null;
        var post_grid = null;
        var cookie_grid = null;
        var headers_grid = null;
        tabsdiv = $($(parentElement).children()[0]);
        if (tabsdiv !== null) {
            information = tabsdiv.find('.information');
            get_grid = tabsdiv.find('.get_grid');
            post_grid = tabsdiv.find('.post_grid');
            cookie_grid = tabsdiv.find('.cookie_grid');
            headers_grid = tabsdiv.find('.headers_grid');

            //GET表
            var get_data = [];
            for (var key in datarecord.get_data) {
                var get_data_item = [];
                get_data_item.push(key);
                get_data_item.push(datarecord.get_data[key]);
                var decoded_value = "";
                if (datarecord.decoded_get_data) decoded_value = datarecord.decoded_get_data[key];
                get_data_item.push(decoded_value);
                get_data.push(get_data_item);
            }

            var get_source = {

                localdata: get_data,
                datafields: [{
                    name: 'key',
                    type: 'string',
                    map: '0'
                }, {
                    name: 'value',
                    type: 'string',
                    map: '1'
                }, {
                    name: 'decoded_value',
                    type: 'string',
                    map: '2'
                } ],
                datatype: "array"
            };
            var get_source_dataAdapter = new $.jqx.dataAdapter(get_source);
            get_grid.jqxGrid({
                autorowheight: true,
                columnsautoresize: true,
                pageable: true,
                pagermode: "simple",
                scrollmode: 'deferred',
                localization: getLocalization('zh'),
                enablebrowserselection: true,
                columnsresize: true,
                height: 176,
                width: '100%',
                source: get_source_dataAdapter,
                ready: function() {
                    if (get_source.localdata.length && get_source.localdata.length > 0) get_grid.jqxGrid('autoresizecolumn', 'key');
                },
                columns: datarecord.decoded_get_data ? [{
                        text: '键',
                        datafield: 'key'
                    }, {
                        text: '值',
                        datafield: 'value'
                    }, {
                        text: '解码',
                        datafield: 'decoded_value'
                    }

                ] : [{
                    text: '键',
                    datafield: 'key'
                }, {
                    text: '值',
                    datafield: 'value'
                } ]
            });

            //POST表
            var post_data = [];
            for (key in datarecord.post_data) {
                var post_data_item = [];
                post_data_item.push(key);
                post_data_item.push(datarecord.post_data[key]);

                var decoded_value = "";
                if (datarecord.decoded_post_data)
                    decoded_value = datarecord.decoded_post_data[key];
                post_data_item.push(decoded_value);

                post_data.push(post_data_item);
            }
            var post_source = {

                localdata: post_data,
                datafields: [{
                        name: 'key',
                        type: 'string',
                        map: '0'
                    }, {
                        name: 'value',
                        type: 'string',
                        map: '1'
                    }, {
                        name: 'decoded_value',
                        type: 'string',
                        map: '2'
                    }

                ],
                datatype: "array"
            };

            var post_source_dataAdapter = new $.jqx.dataAdapter(post_source);
            post_grid.jqxGrid({
                ready: function() {
                    if (post_source.localdata.length && post_source.localdata.length > 0) post_grid.jqxGrid('autoresizecolumn', 'key');
                },
                autorowheight: true,
                pageable: true,
                columnsautoresize: true,
                pagermode: "simple",
                scrollmode: 'deferred',
                localization: getLocalization('zh'),
                enablebrowserselection: true,
                columnsresize: true,
                height: 176,
                width: '100%',
                source: post_source_dataAdapter,
                columns: datarecord.decoded_post_data ? [{
                        text: '键',
                        datafield: 'key'
                    }, {
                        text: '值',
                        datafield: 'value'
                    }, {
                        text: '解码',
                        datafield: 'decoded_value'
                    }

                ] : [{
                    text: '键',
                    datafield: 'key'
                }, {
                    text: '值',
                    datafield: 'value'
                } ]
            });

            //COOKIE表
            var cookie_data = [];
            for (key in datarecord.cookie_data) {
                var cookie_data_item = [];
                cookie_data_item.push(key);
                cookie_data_item.push(datarecord.cookie_data[key]);

                var decoded_value = "";
                if (datarecord.decoded_cookie_data) decoded_value = datarecord.decoded_cookie_data[key];

                cookie_data_item.push(decoded_value);
                cookie_data.push(cookie_data_item);
            }
            var cookie_source = {
                localdata: cookie_data,
                datafields: [{
                    name: 'key',
                    type: 'string',
                    map: '0'
                }, {
                    name: 'value',
                    type: 'string',
                    map: '1'
                }, {
                    name: 'decoded_value',
                    type: 'string',
                    map: '2'
                } ],
                datatype: "array"
            };
            var cookie_source_dataAdapter = new $.jqx.dataAdapter(cookie_source);
            cookie_grid.jqxGrid({
                ready: function() {
                    if (cookie_source.localdata.length && cookie_source.localdata.length > 0) cookie_grid.jqxGrid('autoresizecolumn', 'key');
                },
                columnsautoresize: true,
                autorowheight: true,
                pageable: true,
                pagermode: "simple",
                scrollmode: 'deferred',
                localization: getLocalization('zh'),
                enablebrowserselection: true,
                columnsresize: true,
                height: 176,
                width: '100%',
                source: cookie_source_dataAdapter,
                columns: datarecord.decoded_cookie_data ? [{
                    text: '键',
                    datafield: 'key'
                }, {
                    text: '值',
                    datafield: 'value'
                }, {
                    text: '解码',
                    datafield: 'decoded_value'
                } ] : [{
                    text: '键',
                    datafield: 'key'
                }, {
                    text: '值',
                    datafield: 'value'
                } ]
            });

            //HTTP Headers表
            var headers_data = [];
            for (key in datarecord.headers_data) {
                var headers_data_item = [];
                headers_data_item.push(key);
                headers_data_item.push(datarecord.headers_data[key]);
                headers_data.push(headers_data_item);
            }
            var headers_source = {
                localdata: headers_data,
                datafields: [{
                        name: 'key',
                        type: 'string',
                        map: '0'
                    }, {
                        name: 'value',
                        type: 'string',
                        map: '1'
                    }

                ],
                datatype: "array"
            };
            var headers_source_dataAdapter = new $.jqx.dataAdapter(headers_source);
            headers_grid.jqxGrid({
                ready: function() {
                    if (headers_source.localdata.length && headers_source.localdata.length > 0) headers_grid.jqxGrid('autoresizecolumn', 'key');
                },
                columnsautoresize: true,
                autorowheight: true,
                pageable: true,
                pagermode: "simple",
                scrollmode: 'deferred',
                localization: getLocalization('zh'),
                enablebrowserselection: true,
                columnsresize: true,
                width: '100%',
                height: 176,
                source: headers_source_dataAdapter,

                columns: [{
                    text: '键',
                    datafield: 'key'
                }, {
                    text: '值',
                    datafield: 'value'
                } ]
            });

            //其他信息
            var container = $('<div style="margin: 25px;"></div>');
            container.appendTo($(information));
            var leftcolumn = $('<div style="float: left; width: 45%;"></div>');
            var rightcolumn = $('<div style="float: left; width: 40%;"></div>');

            container.append(leftcolumn);
            container.append(rightcolumn);

            var data_item = "<div style='margin: 10px;'><b>日期：</b> " + datarecord.request_date_string + "</div>";
            var ip_item = "<div style='margin: 10px;'><b>IP：</b> " + datarecord.user_IP + "</div>";
            var method_item = "<div style='margin: 10px;'><b>协议：</b> " + datarecord.request_method + "</div>";
            var location_item = "<div style='margin: 10px;'><b>位置：</b> " + datarecord.location + "</div>";
            $(leftcolumn).append(data_item);
            $(leftcolumn).append(ip_item);
            $(leftcolumn).append(method_item);
            $(leftcolumn).append(location_item);

            var time_item = "<div style='margin: 10px;'><b>时间：</b> " + datarecord.request_time_string + "</div>";
            var port_item = "<div style='margin: 10px;'><b>端口：</b> " + datarecord.user_port + "</div>";
            var uri_item = "<div style='margin: 10px;'><b>访问地址：</b> " + datarecord.request_URI + "</div>";
            var client_item = "<div style='margin: 10px;'><b>客户端：</b> " + datarecord.client + "</div>";

            $(rightcolumn).append(time_item);
            $(rightcolumn).append(port_item);
            $(rightcolumn).append(uri_item);
            $(rightcolumn).append(client_item);

            //tab大小调整
            $(tabsdiv).jqxTabs({
                width: '95%',
                height: '100%'
            });
        }
    };

    //主面板初始化
    $("#panelGrid").jqxGrid({

        pageable: true,
        //如果需要autoresizecolumn，可以在这开启
        ready: function() {
            //$('#panelGrid').jqxGrid('autoresizecolumn', 'request_date_and_time_string'); 
            //$('#panelGrid').jqxGrid('autoresizecolumn', 'data_type'); 
            //$('#panelGrid').jqxGrid('autoresizecolumn', 'user_IP');

            //////////////////////////
            //定时判断是否有新的记录//
            //////////////////////////
            checkNewMessages();
            setIntervalID = setInterval(checkNewMessages, interval);
        },
        //最底下的状态栏初始化
        pagerrenderer: function() {
            var container = $("<div style='overflow: hidden; position: relative; '></div>");
            var deleteButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='static/images/delete.png'/><span style='margin-left: 4px; position: relative; top: 3px;'>删除</span></div>");
            var clearButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='static/images/clear.png'/><span style='margin-left: 4px; position: relative; top: 3px;'>清空</span></div>");
            var searchButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='static/images/search.png'/><span style='margin-left: 4px; position: relative; top: 3px;'>查询</span></div>");
            container.append(deleteButton);
            container.append(clearButton);
            container.append(searchButton);

            deleteButton.jqxButton({
                width: 65,
                height: 20
            });
            clearButton.jqxButton({
                width: 65,
                height: 20
            });
            searchButton.jqxButton({
                width: 65,
                height: 20
            });

            // delete selected row.
            deleteButton.click(function(event) {
                var selectedrowindex = $("#panelGrid").jqxGrid('getselectedrowindex');

                if (selectedrowindex >= 0) {
                    $('#deleteConfirmWindow').jqxWindow('open');
                }

            });

            clearButton.click(function(event) {
                $('#clearConfirmWindow').jqxWindow('open');
            });

            // search for a record.
            searchButton.click(function(event) {
                $("#searchWindow").jqxWindow('open');
            });

            var pageElementsContainer = $("<div style='overflow: hidden;float: right;position: relative;margin: 5.5px; '></div>");
            var datainfo = $("#panelGrid").jqxGrid('getdatainformation');
            var paginginfo = datainfo.paginginformation;
            var leftButton = $("<div style='padding: 0px; float: left;'><div style='margin-left: 9px; width: 16px; height: 16px;'></div></div>");
            leftButton.find('div').addClass('jqx-icon-arrow-left');
            leftButton.width(36);
            leftButton.jqxButton({
                theme: 'energyblue'
            });
            var rightButton = $("<div style='padding: 0px; margin: 0px 3px; float: left;'><div style='margin-left: 9px; width: 16px; height: 16px;'></div></div>");
            rightButton.find('div').addClass('jqx-icon-arrow-right');
            rightButton.width(36);
            rightButton.jqxButton({
                theme: 'energyblue'
            });

            var label = $("<div style='font-size: 14px; margin: 1px 1px; font-weight: bold; float: left;'></div>");
            label.text("1-" + paginginfo.pagesize + ' of ' + datainfo.rowscount);
            leftButton.appendTo(pageElementsContainer);
            rightButton.appendTo(pageElementsContainer);
            label.appendTo(pageElementsContainer);
            pageElementsContainer.appendTo(container);
            self.label = label;

            rightButton.click(function() {
                $("#panelGrid").jqxGrid('gotonextpage');
            });
            leftButton.click(function() {
                $("#panelGrid").jqxGrid('gotoprevpage');
            });
            return container;
        },
        scrollmode: 'logical',
        sortable: true,
        pagesize: 25,
        localization: getLocalization('zh'),
        width: '100%',
        height: base_height - 2 > 0 ? base_height - 2 : 0,
        source: grid_dataAdapter,
        enablebrowserselection: true,
        columnsresize: true,
        rowdetails: true,
        rowdetailstemplate: {
            rowdetails: $("#xss-detail-template").html(),
            rowdetailsheight: 222
        },
        initrowdetails: initrowdetails,

        columns: [{
            text: '时间',
            datafield: 'request_date_and_time_string',
            width: 165
        }, {
            text: 'IP',
            datafield: 'user_IP'
        }, {
            text: '来源',
            datafield: 'location'
        }, {
            text: '客户端',
            datafield: 'client'
        }, {
            text: '请求',
            datafield: 'request_method',
            width: 55
        }, {
            text: '携带数据',
            datafield: 'data_type'
        }, {
            text: '保持连接',
            datafield: 'keepsession',
            width: 60,
            cellsalign: 'center'
        }]
    });

    $("#panelGrid").on('pagechanged',
        function() {
            var datainfo = $("#panelGrid").jqxGrid('getdatainformation');
            var paginginfo = datainfo.paginginformation;
            self.label.text(1 + paginginfo.pagenum * paginginfo.pagesize + "-" + Math.min(datainfo.rowscount, (paginginfo.pagenum + 1) * paginginfo.pagesize) + ' of ' + datainfo.rowscount);
        });
});

//获取新列表
function checkNewMessages() {
    $.ajax({
        url: urlbase + "?cmd=id_list",
        dataType: "json",
        timeout: interval,
        success: function(data) {
            if (messageList) {
                var sum = 0;
                var lastedID = null;

                for (var id in data) {
                    if (messageList.indexOf(data[id]) < 0) {
                        sum++;
                        lastedID = data[id];
                    }
                }
                if (sum > 0)
                    showNotification(sum, lastedID, interval);

            }
            messageList = data;
        },
        complete: function(XMLHttpRequest, status) {
            if (status == 'timeout') {
                interval *= 2;
                if (setIntervalID) {
                    clearInterval(setIntervalID);
                    if (interval < 30000) setIntervalID = setInterval(checkNewMessages, interval);
                }
            } else if (status == "parsererror")
                window.location.href = "login.php";
        }
    });
}

//根据useragent判断操作系统，浏览器版本
function get_client_info(agent) {
    var browser = "未知浏览器";
    var browser_version = "";
    if (agent.indexOf("Firefox/") > 0) {
        var bv = agent.match(/Firefox\/([^;)]+)+/i);
        browser = "Firefox";
        browser_version = bv[1]; //获取火狐浏览器的版本号
    } else if (agent.indexOf("Maxthon") > 0) {
        var bv = agent.match(/Maxthon\/([\d\.]+)/);
        browser = "傲游";
        browser_version = bv[1];
    } else if (agent.indexOf("MSIE") > 0) {
        var bv = agent.match(/MSIE\s+([^;)]+)+/i);
        browser = "IE";
        browser_version = bv[1]; //获取IE的版本号
    } else if (agent.indexOf("OPR") > 0) {
        var bv = agent.match(/OPR\/([\d\.]+)/);
        browser = "Opera";
        browser_version = bv[1];
    } else if (agent.indexOf("Edge") > 0) {
        //win10 Edge浏览器 添加了chrome内核标记 在判断Chrome之前匹配
        var bv = agent.match(/Edge\/([\d\.]+)/);
        browser = "Edge";
        browser_version = bv[1];
    } else if (agent.indexOf("Chrome") > 0) {
        var bv = agent.match(/Chrome\/([\d\.]+)/);

        browser = "Chrome";
        browser_version = bv[1]; //获取google chrome的版本号
    } else if (agent.indexOf('rv:') > 0 && agent.indexOf('Gecko') > 0) {
        var bv = agent.match(/rv:([\d\.]+)/);
        browser = "IE";
        browser_version = bv[1];
    }
    browser_version = browser_version.match(/^[0-9\.]+$/) ? browser_version : "未知";

    var os = '未知操作系统';
    if (agent.match(/win/i) && (agent.indexOf("95") > 0)) os = 'Windows 95';
    else if (agent.match(/win 9x/i) && (agent.indexOf("4.90") > 0)) os = 'Windows ME';
    else if (agent.match(/win/i) && agent.match(/98/i)) os = 'Windows 98';
    else if (agent.match(/win/i) && agent.match(/nt 6.0/i)) os = 'Windows Vista';
    else if (agent.match(/win/i) && agent.match(/nt 6.1/i)) os = 'Windows 7';
    else if (agent.match(/win/i) && agent.match(/nt 6.2/i)) os = 'Windows 8';
    else if (agent.match(/win/i) && agent.match(/nt 10.0/i)) os = 'Windows 10';
    else if (agent.match(/win/i) && agent.match(/nt 5.1/i)) os = 'Windows XP';
    else if (agent.match(/win/i) && agent.match(/nt 5/i)) os = 'Windows 2000';
    else if (agent.match(/win/i) && agent.match(/nt/i)) os = 'Windows NT';
    else if (agent.match(/win/i) && agent.match(/32/i)) os = 'Windows 32';
    else if (agent.match(/linux/i)) os = 'Linux';
    else if (agent.match(/unix/i)) os = 'Unix';
    else if (agent.match(/sun/i) && agent.match(/os/i)) os = 'SunOS';
    else if (agent.match(/ibm/i) && agent.match(/os/i)) os = 'IBM OS/2';
    else if (agent.match(/Mac/i) && agent.match(/PC/i)) os = 'Macintosh';
    else if (agent.match(/PowerPC/i)) os = 'PowerPC';
    else if (agent.match(/AIX/i)) os = 'AIX';
    else if (agent.match(/HPUX/i)) os = 'HPUX';
    else if (agent.match(/NetBSD/i)) os = 'NetBSD';
    else if (agent.match(/BSD/i)) os = 'BSD';
    else if (agent.match(/OSF1/i)) os = 'OSF1';
    else if (agent.match(/IRIX/i)) os = 'IRIX';
    else if (agent.match(/FreeBSD/i)) os = 'FreeBSD';
    else if (agent.match(/teleport/i)) os = 'teleport';
    else if (agent.match(/flashget/i)) os = 'flashget';
    else if (agent.match(/webzip/i)) os = 'webzip';
    else if (agent.match(/offline/i)) os = 'offline';

    return os + ' ' + browser + '(' + browser_version + ')';
}