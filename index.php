<?php
define("IN_XSS_PLATFORM",true);
//sometimes we only need "referfer".
/*
if(count($_GET)==0&&count($_POST)==0&&count($_COOKIE)==0)
	exit();
*/
require_once("functions.php");
require_once("dio.php");

$info = array();

$user_IP = isset($_SERVER['REMOTE_ADDR'])?$_SERVER['REMOTE_ADDR']:"unknown";
$user_port = isset($_SERVER['REMOTE_PORT'])?$_SERVER['REMOTE_PORT']:"unknown";
$protocol = isset($_SERVER['SERVER_PROTOCOL'])?$_SERVER['SERVER_PROTOCOL']:"unknown";
$request_method = isset($_SERVER['REQUEST_METHOD'])?$_SERVER['REQUEST_METHOD']:"unknown";
$request_URI = isset($_SERVER['REQUEST_URI'])?$_SERVER['REQUEST_URI']:"unknown";
$request_time = isset($_SERVER['REQUEST_TIME'])?$_SERVER['REQUEST_TIME']:time();

$headers_data =getallheaders();

$get_data=$_GET;
$decoded_get_data=tryBase64Decode($_GET);
$post_data=$_POST;
$decoded_post_data=tryBase64Decode($_POST);
$cookie_data=$_COOKIE;
$decoded_cookie_data=tryBase64Decode($_COOKIE);

$info['user_IP'] = stripStr($user_IP);
$info['user_port'] = stripStr($user_port);
$info['protocol'] = stripStr($protocol);
$info['request_method'] = stripStr($request_method);
$info['request_URI'] = stripStr($request_URI);
$info['request_time'] = stripStr($request_time);
$info['headers_data'] = stripArr($headers_data);

$info['get_data'] = stripArr($get_data);
if($decoded_get_data)
	$info['decoded_get_data'] = stripArr($decoded_get_data);

$info['post_data'] = stripArr($post_data);
if($decoded_post_data)
	$info['decoded_post_data'] = stripArr($decoded_post_data);

$info['cookie_data'] = stripArr($cookie_data);
if($decoded_cookie_data)
	$info['decoded_cookie_data'] = stripArr($decoded_cookie_data);

$info['keepsession']=isKeepSession($info)?true:false;

saveInfo(json_encode($info),$request_time);
?>