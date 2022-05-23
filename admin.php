<?php
define('IN_XSS_PLATFORM', true);
require_once('auth.php');
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />

    <title>控制面板</title>
    <link rel="stylesheet" href="static/css/bootstrap.min.css" type="text/css" />
    <link rel="stylesheet" href="static/css/main.min.css" type="text/css" />
    <link rel="stylesheet" href="static/css/notification.min.css" type="text/css" />    
    <link rel="stylesheet" href="static/css/jqx.base.css" type="text/css" />
    <link rel="stylesheet" href="static/css/jqx.office.css" type="text/css" />
    <link rel="stylesheet" href="static/css/animate.min.css" type="text/css" />
    <link rel="shortcut icon" href="favicon.ico" type="image/vnd.microsoft.icon" />
    <link rel="icon" href="favicon.ico" type="image/vnd.microsoft.icon" />
</head>

<body>

    <div class="container-fluid">
        <div class="row row-offcanvas row-offcanvas-left">
            <div id="nav-section" class="col-xs-12 column">
                <div class="navbar-default">
                    <button id="toggle-button" type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                </div>
                <h1 id="dash-logo" class="center-block">Blue-Lotus</h1>
                <div class="collapse navbar-collapse" id="sidebar-nav" role="navigation">
                    <ul id="Tab" class="nav">
                        <li class="active">
                            <a id="xss_panel_tab" href="#panel" data-toggle="tab">
                                <span class="icon icon-panel"></span>接收面板</a>
                        </li>
                        <li>
                            <a id="my_js_tab" href="#js" data-toggle="tab">
                                <span class="icon icon-my-js"></span>我的JS</a>
                        </li>
                        <li>
                            <a id="js_template_tab" href="#template" data-toggle="tab">
                                <span class="icon icon-template"></span>公共模板</a>
                        </li>
                        <li>
                            <a id="about_us_tab" href="#aboutus" data-toggle="tab">
                                <span class="icon icon-info"></span>关于</a>
                        </li>

                        <li id="logout">
                            <a href="#logout">
                                <span class="icon icon-logout"></span>注销</a>
                        </li>


                    </ul>
                    <span id="rights">Copyright © 2015-2016<br>Powered by <a href="http://www.firesun.me" target="_blank">Firesun</a></span>
                </div>
            </div>

            <div class="tab-content">

                <div id="panel" class="tab-pane active main-section col-xs-12 column">
                    <div class="main-section-header row">
                        <h2 class="eam-efficiency col-xs-3">XSS接收面板</h2>
                        <div class="clear"></div>
                    </div>
                    <div id="panelGrid"></div>

                </div>
                <div id="js" class="tab-pane main-section col-xs-12 column">
                    <div class="main-section-header row">
                        <h2 class="eam-efficiency col-xs-3">我的js</h2>
                        <div class="clear"></div>
                    </div>
                    <div id="myJS">
                        <div id="myJS_splitter">
                            <div class="overflow-hidden" >

                                <div class="listbox" id="myJS_listbox">
                                </div>

                                <div id="myJS_listbox_toolbar" class="overflow-hidden listbox_toolbar">
                                    <div id="myJS_add_button"><img class="listbox_toolbar_button_icon" src='static/images/add.png' /><span class="listbox_toolbar_button_span">添加</span></div>
                                    <div id="myJS_del_button"><img class="listbox_toolbar_button_icon" src='static/images/delete.png' /><span class="listbox_toolbar_button_span">删除</span></div>
                                    <div id="myJS_clear_button"><img class="listbox_toolbar_button_icon" src='static/images/clear.png' /><span class="listbox_toolbar_button_span">清空</span></div>
                                </div>

                            </div>
                            <div class="overflow-hidden" id="myJS_ContentPanel">
                                <div class="js_content_panel">
                                    <form id="myJS_form">
                                        <div class="js_content_div">
                                            <span>文件名:</span>
                                            <input id="myJS_name" />.js
                                        </div>
                                        <div class="js_content_div">
                                            <div>js文件说明：</div>
                                            <textarea id="myJS_description" ></textarea>
                                        </div>

                                        <div class="editor">
                                            <div id="myJS_content_toolBar" ></div>
                                            <div id="myJS_content" ></div>
                                        </div>

                                        <div class="js_content_button_div">
                                            <button id="myJS_ok" type="button">新增</button>
                                            <button id="myJS_cancel" type="button">重置</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="template" class="tab-pane main-section col-xs-12 column">
                    <div class="main-section-header row">
                        <h2 class="eam-efficiency col-xs-3">js模板</h2>
                        <div class="clear"></div>
                    </div>
                    <div id="jsTemplate">
                        <div id="jsTemplate_splitter">
                            <div class="overflow-hidden" >

                                <div class="listbox" id="jsTemplate_listbox">
                                </div>

                                <div id="jsTemplate_listbox_toolbar" class="overflow-hidden listbox_toolbar">
                                    <div id="jsTemplate_add_button"><img class="listbox_toolbar_button_icon" src='static/images/add.png' /><span class="listbox_toolbar_button_span">添加</span></div>
                                    <div id="jsTemplate_del_button"><img class="listbox_toolbar_button_icon" src='static/images/delete.png' /><span class="listbox_toolbar_button_span">删除</span></div>
                                    <div id="jsTemplate_clear_button"><img class="listbox_toolbar_button_icon" src='static/images/clear.png' /><span class="listbox_toolbar_button_span">清空</span></div>
                                </div>

                            </div>
                            <div class="overflow-hidden" id="jsTemplate_ContentPanel">
                                <div class="js_content_panel">
                                    <form id="jsTemplate_form">
                                        <div class="js_content_div">
                                            <span>文件名:</span>
                                            <input id="jsTemplate_name" />.js
                                        </div>
                                        <div class="js_content_div">
                                            <div>模板说明：</div>
                                            <textarea id="jsTemplate_description"></textarea>
                                        </div>

                                        <div class="editor">
                                            <div id="jsTemplate_content_toolBar" ></div>
                                            <div id="jsTemplate_content" ></div>
                                        </div>

                                        <div class="js_content_button_div">
                                            <button id="jsTemplate_ok" type="button">新增</button>
                                            <button id="jsTemplate_cancel" type="button">重置</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="aboutus" class="tab-pane main-section col-xs-12 column">
                    <div class="main-section-header row">
                        <h2 class="eam-efficiency col-xs-3">关于</h2>
                        <div class="clear" ></div>
                    </div>
                    <div id="about_detail" >
                        <section id="about_us_banner" style="background-position: 50% 0px;">
                            <div id="firesun" class="content">
                                <header class="header">
                                    <h2>火日攻天@firesun</h2>
                                    <p>蓝莲花战队负责端茶送水的<br>邮箱：<a href="mailto:firesun.cn@gmail.com">firesun.cn@gmail.com</a><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;主页：<a href="http://www.firesun.me/" target="_blank_">http://www.firesun.me/</a></p>
                                </header>
                                <span class="image"><img class="img" src="static/images/avatar.png"></span>
                            </div>
                            <div ></div >
                            <div class="content">
                                <header class="header">
                                    <h2>蓝莲花战队</h2>
                                    <p>源自清华大学的网安技术竞赛与研究团队<br>中国CTF竞赛成绩最突出的国际知名战队<br>
                                    主页：<a href="http://www.blue-lotus.net/" target="_blank_">http://www.blue-lotus.net/</a></p>
                                </header>
                                <span class="logoimage"><img class="logoimg" src="static/images/bluelotus.png"></span>
                            </div>
                            
                        </section>
                        
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div id="notifications-bottom-right"></div>

    <div id="tip-windows" class="display-none">

        <div id="xssorWindow" class="windows">
            <div id="Ww_B_0" class="Ww_B">
                <div id="Ww_B_0_Left">
                    <textarea id="Ww_B_0_textarea"></textarea>
                </div>
                <div id="Ww_B_0_Right">
                    <input type="button" id="rwb_b2" value="→16en" />
                    <input type="button" id="rwb_b2_j" value="De" />
                    
                    <input type="radio" name="rwb_b2_c" id="rwb_b2_c1" checked="checked" />\u<input type="radio" name="rwb_b2_c" id="rwb_b2_c2" />&amp;#x;<br />
                    
                    <input type="button" id="rwb_b1" value="→10en" />  <input type="button" id="rwb_b1_j" value="De" />
                    
                    <input type="radio" name="rwb_b1_c" id="rwb_b1_c1" checked="checked" />,<input type="radio" name="rwb_b1_c" id="rwb_b1_c4" />c<input type="radio" name="rwb_b1_c" id="rwb_b1_c2" />&amp;#<input type="radio" name="rwb_b1_c" id="rwb_b1_c3" />&amp;#;
                    <br />
                    
                    <input type="button" id="rwb_b3" value="escape" /> <span style="font-size:18px">&harr;</span> 
                    <input type="button" id="rwb_b3j" value="unescape"  />
                    <br />
                    
                    <input type="button" id="rwb_b4" value="encodeURI" /> 
                    <span style="font-size:18px">&harr;</span> 
                    <input type="button" id="rwb_b4j" value="decodeURI" />
                    <br />
                    
                    <input type="button" id="rwb_b5" value="Html2JS" /> 
                    <span style="font-size:18px">&harr;</span> 
                    <input type="button" id="rwb_b5j" value="JS2Html" />
                    <br />
                    
                    <input type="button" id="rwb_b6" value="HtmlEncode" /> 
                    <span style="font-size:18px">&harr;</span> 
                    <input type="button" id="rwb_b6j" value="HtmlDecode" />
                    <br />
                    
                    <input type="button" id="rwb_b7" value="base64En" /> 
                    <span style="font-size:18px">&harr;</span> 
                    <input type="button" id="rwb_b7j" value="base64De" />
                    
                    <br /><br />
                    
                    <input type="button" id="rwb_b8" value="replace" />
                    <input type="text" name="oldC" id="oldC" size="5" /> 
                    <span style="font-size:18px">&rarr;</span> 
                    <input type="text" name="newC" id="newC" size="5" />
                    
                    <br /><br />
                    
                </div>
            </div>
        </div>
    
        <div id="searchWindow" class="windows">
            <div>
                查找记录</div>
            <div class="overflow-hidden">
                <div>
                    关键字:</div>
                <div class="search_input_field">
                    <input id='search_input_field' type="text" class="jqx-input" />
                </div>
                <div class="search_div">
                    列名:</div>
                <div class="dropdownlist">
                    <div id='dropdownlist'>
                    </div>
                </div>
                <div>
                    <input type="button" value="查找" id="findButton" />
                    <input type="button" value="清除" id="clearButton" />
                </div>
            </div>
        </div>

        <div id="deleteConfirmWindow" class="windows">
            <div>
                <img width="14" height="14" src="static/images/help.png" alt="" /> 确认
            </div>
            <div>
                <div class="windows-tip-div">
                    您确认执行删除操作吗？
                </div>
                <div>
                    <div class="windows-button-div">
                        <input type="button" id="deleteConfirm_ok" value="确认" class="windows-button" />
                        <input type="button" id="deleteConfirm_cancel" value="取消" />
                    </div>
                </div>
            </div>
        </div>

        <div id="logoutConfirmWindow" class="windows">
                <div>
                    <img width="14" height="14" src="static/images/help.png" alt="" />
                    确认</div>
                <div>
                    <div class="windows-tip-div">
                        您确认注销吗？
                    </div>
                    <div>
                    <div class="windows-button-div">
                        <input type="button" id="logoutConfirm_ok" value="确认" class="windows-button" />
                        <input type="button" id="logoutConfirm_cancel" value="取消" />
                    </div>
                    </div>
                </div>
        </div>
        
        <div id="clearConfirmWindow" class="windows">
            <div>
                <img width="14" height="14" src="static/images/help.png" alt="" /> 确认
            </div>
            <div>
                <div class="windows-tip-div">
                    您确认清空所有记录吗？
                </div>
                <div>
                    <div class="windows-button-div">
                        <input type="button" id="clearConfirm_ok" value="确认" class="windows-button" />
                        <input type="button" id="clearConfirm_cancel" value="取消" />
                    </div>
                </div>
            </div>
        </div>

        <div id="failedWindow" class="windows">
            <div>
                <img width="14" height="14" src="static/images/close.png" alt="" /> 失败
            </div>
            <div>
                <div class="windows-tip-div">
                    操作失败！
                </div>
                <div>
                    <div class="windows-button-div">
                        <input type="button" id="failed_ok" value="确认" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- xss记录detail面板，注：写成script的加载速度比div快-->
    <script id="xss-detail-template" type="text/template">
        <div style='margin: 10px;'>
            <ul style='margin-left: 30px;'>
                <li>GET</li>
                <li>POST</li>
                <li>Cookie</li>
                <li>HTTP请求信息</li>
                <li>其他信息</li>
            </ul>

            <div class='get_grid'></div>
            <div class='post_grid'></div>
            <div class='cookie_grid'></div>
            <div class='headers_grid'></div>
            <div class='information'></div>
        </div>
    </script>

    <script type="text/javascript" src="static/js/jquery.min.js"></script>
    <script type="text/javascript" src="static/js/jquery-ui.min.js"></script>
    <script type="text/javascript" src="static/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="static/js/beautify.min.js"></script>
    <script type="text/javascript" src="static/js/ZeroClipboard.min.js"></script>
    <script type="text/javascript" src="static/js/ace.js"></script>
    <script type="text/javascript" src="static/js/jsmin.min.js"></script>
    <script type="text/javascript" src="static/js/js_encode.min.js"></script>
    <script type="text/javascript" src="static/js/jqwidgets.min.js"></script>
    <script type="text/javascript" src="static/js/getTheme.min.js"></script>
    <script type="text/javascript" src="static/js/localization.min.js"></script>
    <script type="text/javascript" src="static/js/loadxsspanel.min.js"></script>
    <script type="text/javascript" src="static/js/loadjstemplate.min.js"></script>
    <script type="text/javascript" src="static/js/loadmyjs.min.js"></script>
    <script type="text/javascript" src="static/js/notification.min.js"></script>
    
</body>

</html>