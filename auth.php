<?php
if(!defined('IN_XSS_PLATFORM')) {
	exit('Access Denied');
}
header("Content-Security-Policy: default-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'; frame-src 'none' ");
header("X-Content-Security-Policy: default-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'; frame-src 'none' ");
header("X-WebKit-CSP: default-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'; frame-src 'none' ");


?>