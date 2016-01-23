<?php
if(!defined('IN_XSS_PLATFORM')) {
	exit('Access Denied');
}
//后台登录密码：默认密码bluelotus
define('PASS', '2a05218c7aa0a6dbd370985d984627b8');
//xss记录、封禁ip列表存放目录
define('DATA_PATH', 'data');
//js模板存放目录
define('JS_TEMPLATE_PATH', 'template');
//我的js存放目录
define('MY_JS_PATH', 'myjs');
//是否加密“xss记录，封禁ip列表，js描述”
define('ENABLE_ENCRYPT', true);
//加密密码
define('ENCRYPT_PASS', "bluelotus");
//加密方法（AES或RC4）
define('ENCRYPT_TYPE', "RC4");
//是否启用KEEP_SESSION功能，需要外部定时访问keepsession.php
define('KEEP_SESSION', true);
//ip归属地数据库地址
define('IPDATA_PATH', "qqwry.dat");
?>