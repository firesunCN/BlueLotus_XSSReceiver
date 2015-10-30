<?php
if(!defined('IN_XSS_PLATFORM')) {
	exit('Access Denied');
}
require_once("config.php");
require_once("functions.php");

//对记录的读写操作，无数据库，采用读写文件的方式，文件名即请求时的时间戳，同时也是记录的id
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
	$info=json_decode($info, true); 
	
	
	$isChange=false;
	if(!isset($info['location']))
	{
		$info['location']=convertip($info['user_IP'],IPDATA_PATH);
		$isChange=true;
	}
		
	if($isChange)
		saveInfo(json_encode($info),$filename);
	
	return $info;
}

function delInfo($filename)
{
	$logFile = dirname( __FILE__ ).'/'.DATA_PATH.'/'.$filename.'.php';
	return unlink($logFile);
}

function clearInfo()
{
	$files = glob(DATA_PATH . '/*.php'); 
	
	foreach ($files as $file) { 
		unlink($file);
	} 
	return true;
}
?>