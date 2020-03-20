<?
include 'functions.php';

$href = substr($_POST["href"], 1);
$isRemoved = rename($href, preg_replace('/^html/', 'remove-program', $href));

$isRemoved ?
  $fn->log('remove-program', ' Файл удален ', $href) :
  $fn->log('remove-program', ' !!!ОШИБКА!!! при удалении файла ', $href);

echo $isRemoved;