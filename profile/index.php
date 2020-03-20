<?php
// Скрипт проверки

// Соединямся с БД
$link = mysqli_connect("localhost", "muser", "password123", "users");

if (isset($_COOKIE['id']) and isset($_COOKIE['hash'])) {
  $query = mysqli_query($link, "SELECT *,INET_NTOA(user_ip) AS user_ip FROM users WHERE user_id = '" . intval($_COOKIE['id']) . "' LIMIT 1");
  $userdata = mysqli_fetch_assoc($query);

  if (($userdata['user_hash'] !== $_COOKIE['hash']) or ($userdata['user_id'] !== $_COOKIE['id'])
    or (($userdata['user_ip'] !== $_SERVER['REMOTE_ADDR']) and ($userdata['user_ip'] !== "0"))) {
    setcookie("id", "", time() - 3600 * 24 * 30 * 12, "/");
    setcookie("hash", "", time() - 3600 * 24 * 30 * 12, "/", null, null, true); // httponly !!!
    print "Надо войти в аккаунт";
  }
}
?>

<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <link href="https://fonts.googleapis.com/css?family=Lato&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="http://78.47.40.9/css/main.css">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <script src="/js/jquery-3.4.1.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  <script src="/js/script.js"></script>
</head>
<body>
<div class="content" style="max-width: 1000px;padding-top: 80px;">
  <h1 class="mb-3">Профиль</h1>
  <div class="manager-contacts height">
    <? if ($userdata) : ?>
      <div class="change-data-user">
        <a href="/updateDataUser.php">Изменить</a>
      </div>
      <div class="manager-contacts-photo">
        <img src="<?= json_decode($userdata['user_photo']) ?>" alt="">
      </div>
      <div class="manager-contacts-desc">
        <div class="manager-contacts-desc-name">
          <?= $userdata['user_name'] ?>
        </div>
        <div class="manager-contacts-desc-company">
          <?= $userdata['user_company'] ?>
        </div>
        <div class="manager-contacts-desc-items">
          <div class="manager-contacts-desc-item">
            <div class="manager-contacts-desc-item-title">
              Adresse:
            </div>
            <div class="manager-contacts-desc-item-text">
              <?= $userdata['user_address'] ?>
            </div>
          </div>
          <div class="manager-contacts-desc-item">
            <div class="manager-contacts-desc-item-title">
              Téléphone:
            </div>
            <div class="manager-contacts-desc-item-text">
              <?= $userdata['user_phone'] ?>
            </div>
          </div>
          <div class="manager-contacts-desc-item">
            <div class="manager-contacts-desc-item-title">
              E-mail:
            </div>
            <div class="manager-contacts-desc-item-text">
              <?= $userdata['user_email'] ?>
            </div>
          </div>
          <div class="manager-contacts-desc-item">
            <div class="manager-contacts-desc-item-title">
              Site web:
            </div>
            <div class="manager-contacts-desc-item-text">
              <a href="<?= 'https://' . $userdata['user_website'] ?>"><?= $userdata['user_website'] ?></a>
            </div>
          </div>
        </div>
      </div>
    <? endif; ?>
  </div>

  <h1 class="my-3">Мои программы</h1>

  <div class="py-1 px-2" style="display: flex;flex-direction: column">

    <?php


    $dir = opendir("../html");
    while (false !== ($file = readdir($dir))) {
      if ($file != "." && $file != "..") {
        $files[] = $file;
      }
    }
    closedir($dir);
    sort($files);
    $count = 1;

    foreach ($files as $fil) {
      if ($userdata AND preg_match('/^' . $userdata["user_programm_id"] . '/', $fil)) { ?>
        <div class="program-list">
          <span class="program-delete">&times;</span>
          <a style="font-size: 17px" class="text-dark mb-2" href="/html/<?= $fil ?>">
            <?= $count . '. ' . str_replace('.html', '', $fil) ?>
          </a>
        </div>
        <? $count++;
      }
    } ?>

  </div>
</body>
</html>
