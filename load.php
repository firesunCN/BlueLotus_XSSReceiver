<?php
if (file_exists('config.php')) {
    require_once('config.php');
} else {
    //缺少config文件，转至install.php
    header('Location: install.php');
    exit();
}