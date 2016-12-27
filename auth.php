<?php
if (!defined('IN_XSS_PLATFORM')) {
    exit('Access Denied');
}

//设置httponly
ini_set("session.cookie_httponly", 1);
session_start();

//判断登陆情况，ip和useragent是否改变，改变则强制退出
if (!(isset($_SESSION['isLogin']) && $_SESSION['isLogin'] === true && isset($_SESSION['user_agent']) && $_SESSION['user_agent'] != "" && $_SESSION['user_agent'] === $_SERVER['HTTP_USER_AGENT'])) {
    $_SESSION['isLogin']    = false;
    $_SESSION['user_IP']    = "";
    $_SESSION['user_agent'] = "";
    session_unset();
    session_destroy();
    header("Location: login.php");
    exit();
}

//开启CSP
header("Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src 'none'");
header("X-Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src 'none'");
header("X-WebKit-CSP: default-src 'self'; style-src 'self' 'unsafe-inline';img-src 'self' data:; frame-src 'none'");
