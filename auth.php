<?php
if (!defined('IN_XSS_PLATFORM')) {
    exit('Access Denied');
}

require_once('functions.php');

//设置httponly
ini_set('session.cookie_httponly', 1);
session_start();

//判断登陆情况，ip和useragent是否改变，改变则强制退出
if ( !(isset($_SESSION['isLogin']) && $_SESSION['isLogin'] === true && isset($_SESSION['user_agent']) && $_SESSION['user_agent'] != "" && $_SESSION['user_agent'] === $_SERVER['HTTP_USER_AGENT']) ) {
    $_SESSION['isLogin']    = false;
    $_SESSION['user_IP']    = "";
    $_SESSION['user_agent'] = "";
    session_unset();
    session_destroy();
    header('Location: login.php');
    exit();
}

if ( ADMIN_IP_CHECK_ENABLE && !(isset($_SESSION['user_IP']) && $_SESSION['user_IP'] != '' && $_SESSION['user_IP'] === getRealIP()) ) {
    $_SESSION['isLogin']    = false;
    $_SESSION['user_IP']    = '';
    $_SESSION['user_agent'] = '';
    session_unset();
    session_destroy();
    header('Location: login.php');
    exit();
}

//开启CSP
require_once('waf.php');
