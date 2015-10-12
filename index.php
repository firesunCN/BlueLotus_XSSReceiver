<?php

$user_IP = ($_SERVER["HTTP_VIA"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"];
$user_IP = ($user_IP) ? $user_IP : $_SERVER["REMOTE_ADDR"];

if($_GET["get"])
{

	$txt = $_GET["get"];
	debug($user_IP); 
	debug($txt); 
}
else
{
	debug($user_IP); 
	
}

function debug( $s ) 
{
	$logfile = dirname( __FILE__ ) . '/xss.log';
	!file_exists( $logfile ) && @touch( $logfile );
	$str = file_get_contents( $logfile );
	$str = date( 'Y-m-d H:i:s' ) . "\r\n" . var_export( $s, true ) . "\r\n\r\n" . $str;
	@file_put_contents( $logfile, $str );
	unset( $str );
}
?>