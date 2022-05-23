<?php
session_start();
$_SESSION['isLogin']    = false;
$_SESSION['user_IP']    = '';
$_SESSION['user_agent'] = '';
session_unset();
session_destroy();
header('Location: login.php');
exit();