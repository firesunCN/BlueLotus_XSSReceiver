<?php
if(!defined('IN_XSS_PLATFORM')) {
	exit('Access Denied');
}
ini_set("session.cookie_httponly", 1); 
session_start();

if(!(isset($_SESSION['isLogin']) && $_SESSION['isLogin']===true && isset($_SESSION['user_IP']) &&$_SESSION['user_IP']!="" &&$_SESSION['user_IP']=== $_SERVER['REMOTE_ADDR'] &&isset($_SESSION['user_agent']) &&$_SESSION['user_agent']!="" &&$_SESSION['user_agent']=== $_SERVER['HTTP_USER_AGENT'] ))
{
	$_SESSION['isLogin']=false;
	$_SESSION['user_IP']="";
	$_SESSION['user_agent']="";
	session_unset();
	session_destroy();
	header("Location: login.php");
	exit();
}

header("Content-Security-Policy: default-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'; frame-src 'none'");
header("X-Content-Security-Policy: default-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'; frame-src 'none'");
header("X-WebKit-CSP: default-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'; frame-src 'none'");


?>