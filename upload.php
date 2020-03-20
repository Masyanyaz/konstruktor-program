<?php
include 'functions.php';

$arr =[];
$fileName = $_POST["fileName"];
$path = 'uploads/' . $fileName . '/';
$fn->log('photo', ' Загрузка фотографии в программе: ', $fileName);

if (!is_dir($path)) {
  mkdir($path, 0777, true);
}

foreach ($_FILES as $img) {
  $name = cyrillic_translit($img['name']);
  $fileIsUploaded = move_uploaded_file($img['tmp_name'], $path . $name);
  if($fileIsUploaded) {
    array_push($arr, $name);
    $fn->log('photo', ' Перемещение фотографии: ', $img['name']);
  }else {
    $fn->log('photo', ' !!!ОШИБКА!!! Перемещение фотографии: ', $img['name']);
  }
}

echo json_encode($arr);


## Транслитирация кирилических символов
function cyrillic_translit( $title ){
  $iso9_table = array(
    'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Ѓ' => 'G',
    'Ґ' => 'G', 'Д' => 'D', 'Е' => 'E', 'Ё' => 'YO', 'Є' => 'YE',
    'Ж' => 'ZH', 'З' => 'Z', 'Ѕ' => 'Z', 'И' => 'I', 'Й' => 'J',
    'Ј' => 'J', 'І' => 'I', 'Ї' => 'YI', 'К' => 'K', 'Ќ' => 'K',
    'Л' => 'L', 'Љ' => 'L', 'М' => 'M', 'Н' => 'N', 'Њ' => 'N',
    'О' => 'O', 'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T',
    'У' => 'U', 'Ў' => 'U', 'Ф' => 'F', 'Х' => 'H', 'Ц' => 'TS',
    'Ч' => 'CH', 'Џ' => 'DH', 'Ш' => 'SH', 'Щ' => 'SHH', 'Ъ' => '',
    'Ы' => 'Y', 'Ь' => '', 'Э' => 'E', 'Ю' => 'YU', 'Я' => 'YA',
    'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'ѓ' => 'g',
    'ґ' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'yo', 'є' => 'ye',
    'ж' => 'zh', 'з' => 'z', 'ѕ' => 'z', 'и' => 'i', 'й' => 'j',
    'ј' => 'j', 'і' => 'i', 'ї' => 'yi', 'к' => 'k', 'ќ' => 'k',
    'л' => 'l', 'љ' => 'l', 'м' => 'm', 'н' => 'n', 'њ' => 'n',
    'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't',
    'у' => 'u', 'ў' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'ts',
    'ч' => 'ch', 'џ' => 'dh', 'ш' => 'sh', 'щ' => 'shh', 'ъ' => '',
    'ы' => 'y', 'ь' => '', 'э' => 'e', 'ю' => 'yu', 'я' => 'ya'
  );

  $name = strtr( $title, $iso9_table );
  $name = preg_replace('~[^A-Za-z0-9\'_\-\.]~', '-', $name );
  $name = preg_replace('~\-+~', '-', $name ); // --- на -
  $name = str_replace("'", "", $name); // удаляем одиночную кавычку
  $name = preg_replace('~^-+|-+$~', '', $name ); // кил - на концах

  return $name;
}
