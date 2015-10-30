<?php
if(!defined('IN_XSS_PLATFORM')) {
	exit('Access Denied');
}
//默认密码bluelotus
define('PASS', '2a05218c7aa0a6dbd370985d984627b8');
//记录，封禁ip列表存放位置
define('DATA_PATH', 'data');
//开启对记录，封禁ip列表的AES加密
define('ENABLE_ENCRYPT', true);
//加密密码
define('ENCRYPT_PASS', "bluelotus");
//是否启用KEEP_SESSION功能，需要外部定时访问keepsession.php
define('KEEP_SESSION', true);
//ip数据库地址
define('IPDATA_PATH', "qqwry.dat");
?>