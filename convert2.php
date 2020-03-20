<?php
include 'functions.php';
$_GET['file']='html/newProgram1584359583055.html';
$name = explode(".", $_GET['file']);
$command = "xvfb-run --auto-servernum --server-num=1 wkhtmltopdf '" . $_GET['file'] . "' '" . str_replace('html', 'pdf', $name[0] . ".pdf") . "'";
echo exec($command);
$fn->log('save-program', ' Конвертация в pdf файла ', $_GET['file']);
