<?php
require('auth.php');
require_once("util.php");
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
			clearInfo();
			break;
	}
}

function dirList() { 

	$list=array();
	$files = glob(DATA_PATH . '/*.php'); 
	
	foreach ($files as $file) { 
		//$listinfo=array();
		$info=loadInfo(basename($file,".php"));
		
		//$listinfo["request_time"]=$info["request_time"];
		//$listinfo['user_IP']=$info['user_IP'];
		//$listinfo['location']=$info['location'];
		
		//$listinfo['request_method']=$info['request_method'];
		
		
		$data_type=array();
		if(count($info['get_data'])>0)
		{
			$get_keys=array();
			foreach($info['get_data'] as $k => $v) {
				$get_keys[]=$k;
			}
			$data_type['GET']=$get_keys;
		}
		
		
		if(count($info['post_data'])>0)
		{
			$post_keys=array();
			foreach($info['post_data'] as $k => $v) {
				$post_keys[]=$k;
			}
			$data_type['POST']=$post_keys;
		}
		
		
		if(count($info['cookie_data'])>0)
		{
			$cookie_keys=array();
			foreach($info['cookie_data'] as $k => $v) {
				$cookie_keys[]=$k;
			}
			$data_type['COOKIE']=$cookie_keys;
		}
		
		$info['data_type']=json_encode($data_type);
		
		$list[]= $info;
		
	} 
		
	return $list; 
} 
?>