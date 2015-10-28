<?php
define("IN_XSS_PLATFORM",true);
require("auth.php");
?>
<!DOCTYPE html>
<html>

<head>
<meta charset="utf-8" />
    
	<title>控制面板</title>
	<link rel="stylesheet" href="static/css/bootstrap.min.css" type="text/css" />
    <link rel="stylesheet" href="static/css/Site.css" type="text/css" />
	<link rel="stylesheet" href="static/css/notification.css" type="text/css" />
	<link rel="stylesheet" href="static/css/jqx.base.css" type="text/css" />
	<link rel="stylesheet" href="static/css/jqx.office.css" type="text/css" />
	<link rel="stylesheet" href="static/css/animate.css" type="text/css" />
	
	<script type="text/javascript" src="static/js/jquery.min.js"></script>
    <script type="text/javascript" src="static/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="static/js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="static/js/notification.js"></script>
	<script type="text/javascript" src="static/js/localization.js"></script>
    <script type="text/javascript" src="static/js/jqxcore.js"></script>
    <script type="text/javascript" src="static/js/jqxdata.js"></script> 
    <script type="text/javascript" src="static/js/jqxbuttons.js"></script>
    <script type="text/javascript" src="static/js/jqxscrollbar.js"></script>
    <script type="text/javascript" src="static/js/jqxmenu.js"></script>
    <script type="text/javascript" src="static/js/jqxgrid.js"></script>
    <script type="text/javascript" src="static/js/jqxgrid.selection.js"></script>
	<script type="text/javascript" src="static/js/jqxgrid.edit.js"></script>
	<script type="text/javascript" src="static/js/jqxgrid.sort.js"></script>
    <script type="text/javascript" src="static/js/jqxtabs.js"></script>
    <script type="text/javascript" src="static/js/getTheme.js"></script>
	<script type="text/javascript" src="static/js/jqxgrid.columnsresize.js"></script>
	<script type="text/javascript" src="static/js/jqxwindow.js"></script>
	<script type="text/javascript" src="static/js/jqxdropdownlist.js"></script>
	<script type="text/javascript" src="static/js/jqxgrid.pager.js"></script>
	<script type="text/javascript" src="static/js/jqxlistbox.js"></script>
	<script type="text/javascript" src="static/js/loadgrid.js"></script>
	<script type="text/javascript" src="static/js/jqxgrid.filter.js"></script>
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
                            <a href="#panel" data-toggle="tab">
                                <span class="icon icon-chart-column"></span>接收面板</a>
                        </li>
                        <li>
                            <a href="#js" data-toggle="tab">
                                <span class="icon icon-star-empty"></span>我的JS</a>
                        </li>
                        <li>
                            <a href="#template" data-toggle="tab">
                                <span class="icon icon-faves"></span>公共模板</a>
                        </li>
                        <li>
                            <a href="#aboutus" data-toggle="tab">
                                <span class="icon icon-info"></span>关于</a>
                        </li>
                    </ul>
                    <span id="rights">Copyright © 2015-2016 Powered by Firesun</span>
                </div>
            </div>
			
			<div class="tab-content">
			  
				<div id="panel" class="tab-pane active main-section col-xs-12 column">
					<div class="main-section-header row">
						<h2 class="eam-efficiency col-xs-3">XSS接收面板</h2>
						<div style="clear:both;"></div>
					</div>
					<div id="panelGrid"></div>
					
				</div>
				<div id="js" class="tab-pane main-section col-xs-12 column">
					<div class="main-section-header row">
						<h2 class="eam-efficiency col-xs-3">我的js</h2>
						<div style="clear:both;"></div>
					</div>
					<div id="myJS"></div>
				</div>
				<div id="template" class="tab-pane main-section col-xs-12 column">
					<div class="main-section-header row">
						<h2 class="eam-efficiency col-xs-3">js模板</h2>
						<div style="clear:both;"></div>
					</div>
					<div id="jsTemplate"></div>
				</div>
				
				<div id="aboutus" class="tab-pane main-section col-xs-12 column">
					<div class="main-section-header row">
						<h2 class="eam-efficiency col-xs-3">关于</h2>
						<div style="clear:both;"></div>
					</div>
					<div id="about_detail"></div>
				</div>
			</div>
        </div>
    </div>
	
	
	<div id="notifications-bottom-right"></div>

	<div style="display: none;">
		
		
		<div id="searchWindow" class="windows">
				<div>
					查找记录</div>
				<div style="overflow: hidden;">
					<div>
						关键字:</div>
					<div style='margin-top:5px;'>
						<input id='inputField' type="text" class="jqx-input" style="width: 200px; height: 23px;" />
					</div>
					<div style="margin-top: 7px; clear: both;">
						列名:</div>
					<div style='margin-top:5px;'>
						<div id='dropdownlist'>
						</div>
					</div>
					<div>
						<input type="button" style='margin-top: 15px; margin-left: 50px; float: left;' value="查找" id="findButton" />
						<input type="button" style='margin-left: 5px; margin-top: 15px; float: left;' value="清除" id="clearButton" />
					</div>
				</div>
		</div>
		
		<div id="deleteConfirmWindow"  class="windows">
                <div>
                    <img width="14" height="14" src="static/images/help.png" alt="" />
                    确认</div>
                <div>
                    <div style="margin: 5px;">
                        您确认执行删除操作么？
                    </div>
                    <div>
                    <div style="float: right; margin-top: 15px;">
                        <input type="button" id="deleteConfirm_ok" value="确认" style="margin-right: 10px" />
                        <input type="button" id="deleteConfirm_cancel" value="取消" />
                    </div>
                    </div>
                </div>
		</div>
		<div id="clearConfirmWindow"  class="windows">
                <div>
                    <img width="14" height="14" src="static/images/help.png" alt="" />
                    确认</div>
                <div>
                    <div style="margin: 5px;">
                        您确认清空所有记录么？
                    </div>
                    <div>
                    <div style="float: right; margin-top: 15px;">
                        <input type="button" id="clearConfirm_ok" value="确认" style="margin-right: 10px" />
                        <input type="button" id="clearConfirm_cancel" value="取消" />
                    </div>
                    </div>
                </div>
		</div>
		
		<div id="failedWindow"  class="windows">
                <div>
                    <img width="14" height="14" src="static/images/close.png" alt="" />
                    失败</div>
                <div>
                    <div style="margin: 5px;">
                        操作失败！
                    </div>
                    <div>
                    <div style="float: right; margin-top: 15px;">
                        <input type="button" id="failed_ok" value="确认" />
                    </div>
                    </div>
                </div>
		</div>
	</div >
	
	
	
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


</body>
</html>
