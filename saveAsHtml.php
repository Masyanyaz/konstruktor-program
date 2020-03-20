<?php
include 'functions.php';

$htmlFileName = $_POST["htmlFileName"];
$head = '<!doctype html><html lang="ru">';
$end = '</html>';
$DOM = $_POST["DOM"];
$current = $head . $DOM . $end;
$result = file_put_contents($htmlFileName, $current, LOCK_EX);

if($result) {
  echo 'Файл сохранен';
  $fn->log('save-program', ' Файл сохранен ', $htmlFileName);
} else {
  echo 'Ошибка при сохранении файла';
  $fn->log('save-program', ' !!!ОШИБКА!!! при сохранении файла ', $htmlFileName);
}
