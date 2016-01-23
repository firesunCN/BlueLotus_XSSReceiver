<?php
if(!defined('IN_XSS_PLATFORM')) {
	exit('Access Denied');
}
require_once("config.php");
require_once("functions.php");

//对记录的读写操作，无数据库，采用读写文件的方式，文件名即请求时的时间戳，同时也是记录的id
function save_xss_record($info,$filename)
{
	$logFile = dirname( __FILE__ ).'/'.DATA_PATH.'/'.$filename.'.php';
	!file_exists($logFile) && @touch($logFile);
	
	$info=encrypt($info);
	
	if(file_put_contents($logFile, '<?php exit();?>'.$info)===false)
		return false;
	else
		return true;
}

function load_xss_record($filename)
{
	if(strpos($filename, "..")===false && strpos($filename, "/")===false && strpos($filename, "\\")===false)
	{
		$logFile = dirname( __FILE__ ).'/'.DATA_PATH.'/'.$filename.'.php';
		if(!file_exists($logFile))
			return false;
		$info=@file_get_contents($logFile);
		if($info===false)
			return false;
		
		if(strncmp($info,'<?php exit();?>',15)!=0)
			return false;
		
		$info=substr($info,15);
		$info=decrypt($info);
		
		//只会出现在加密密码错误的时候
		if(!preg_match('/^[A-Za-z0-9\x00-\x80~!@#$%&_+-=:";\'<>,\/"\[\]\\\^\.\|\?\*\+\(\)\{\}\s]+$/',$info))
			return false;
		
		$info=json_decode($info, true); 
		
		//只会出现在加密密码错误的时候
		if($info===false)
			return false;
		
		$isChange=false;
		if(!isset($info['location']))
		{
			$info['location']=stripStr(convertip($info['user_IP'],IPDATA_PATH));
			$isChange=true;
		}
		
		//只会出现在加密密码错误的时候
		if(!isset($info['request_time']))
		{
			return false;
		}
		
		if($isChange)
			save_xss_record(json_encode($info),$filename);
		
		return $info;
	}
	else
		return false;
}

function delete_xss_record($filename)
{
	if(strpos($filename, "..")===false && strpos($filename, "/")===false && strpos($filename, "\\")===false)
	{
		$logFile = dirname( __FILE__ ).'/'.DATA_PATH.'/'.$filename.'.php';
		return unlink($logFile);
	}
	else
		return false;
}

function clear_xss_record()
{
	$files = glob(DATA_PATH . '/*.php'); 
	
	foreach ($files as $file) { 
		unlink($file);
	} 
	return true;
}

function load_js_content($path,$filename)
{
	if(strpos($filename, "..")===false && strpos($filename, "/")===false && strpos($filename, "\\")===false)
	{
		$file = dirname( __FILE__ ).'/'.$path.'/'.$filename.'.js';
		if(!file_exists($file))
			return false;
		
		$info=@file_get_contents($file);
		if($info===false)
			$info="";
		return $info;
	}
	else
		return false;
}
		
function delete_js($path,$filename)
{
	if(strpos($filename, "..")===false && strpos($filename, "/")===false && strpos($filename, "\\")===false)
	{
		$file = dirname( __FILE__ ).'/'.$path.'/'.$filename.'.desc';
		unlink($file);
		$file = dirname( __FILE__ ).'/'.$path.'/'.$filename.'.js';
		return unlink($file);
	}
	else
		return false;
	
}

function clear_js($path)
{
	$files = glob($path . '/*.desc'); 
	foreach ($files as $file) { 
		unlink($file);
	}
	
	$files = glob($path . '/*.js'); 
	foreach ($files as $file) { 
		unlink($file);
	}
	return true;
}

function save_js_content($path,$content,$filename)
{
	$file = dirname( __FILE__ ).'/'.$path.'/'.$filename.'.js';
	!file_exists($file) && @touch($file);
	
	if(file_put_contents($file, $content)===false)
		return false;
	else
		return true;
}

function save_js_desc($path,$desc,$filename)
{
	$file = dirname( __FILE__ ).'/'.$path.'/'.$filename.'.desc';
	!file_exists($file) && @touch($file);

	$desc=encrypt($desc);
	
	if(file_put_contents($file, $desc)===false)
		return false;
	else
		return true;
}

?>