<?php
require_once("config.php");
require_once("util.php");

function saveInfo($info,$filename)
{
	$logFile = dirname( __FILE__ ).'/'.DATA_PATH.'/'.$filename.'.php';
	!file_exists($logFile) && @touch($logFile);
	
	if(ENABLE_ENCRYPT)
		$info=encrypt($info,ENCRYPT_PASS);
	else
		$info=base64_encode($info);
	
	@file_put_contents($logFile, '<?php exit();?>'.$info);
}

function loadInfo($filename)
{
	$logFile = dirname( __FILE__ ).'/'.DATA_PATH.'/'.$filename.'.php';
	if(!file_exists($logFile))
		return false;
	$info=@file_get_contents($logFile);
	
	if(strncmp($info,'<?php exit();?>',15)!=0)
		return false;
	
	$info=substr($info,15);
	if(ENABLE_ENCRYPT)
		$info=decrypt($info,ENCRYPT_PASS);
	else
		$info=base64_decode($info);

	if(!preg_match('/^[A-Za-z0-9\x00-\x80~!@#$%&_+-=:";\'<>,\/"\[\]\\\^\.\|\?\*\+\(\)\{\}\s]+$/',$info))
		return false;
	$info=json_decode($info); 
	
	return $info;
}
?>