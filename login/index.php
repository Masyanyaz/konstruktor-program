<?php
// Страница авторизации

// Функция для генерации случайной строки
function generateCode($length = 6)
{
  $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHI JKLMNOPRQSTUVWXYZ0123456789";
  $code = "";
  $clen = strlen($chars) - 1;
  while (strlen($code) < $length) {
    $code .= $chars[mt_rand(0, $clen)];
  }
  return $code;
}

// Соединямся с БД
$link = mysqli_connect("localhost", "muser", "password123", "users");

if (isset($_POST)) {
  // Вытаскиваем из БД запись, у которой логин равняеться введенному
  $query = mysqli_query($link, "SELECT user_id, user_password FROM users WHERE user_login='" . mysqli_real_escape_string($link, $_POST['login']) . "' LIMIT 1");
  $data = mysqli_fetch_assoc($query);

  // Сравниваем пароли
  if ($data['user_password'] === md5(md5($_POST['password']))) {
    // Генерируем случайное число и шифруем его
    $hash = md5(generateCode(10));

    if (!empty($_POST['not_attach_ip'])) {
      // Если пользователя выбрал привязку к IP
      // Переводим IP в строку
      $insip = ", user_ip=INET_ATON('" . $_SERVER['REMOTE_ADDR'] . "')";
    }

    // Записываем в БД новый хеш авторизации и IP
    mysqli_query($link, "UPDATE users SET user_hash='" . $hash . "' " . $insip . " WHERE user_id='" . $data['user_id'] . "'");

    // Ставим куки
    setcookie("id", $data['user_id'], time() + 60 * 60 * 24 * 30, "/");
    setcookie("hash", $hash, time() + 60 * 60 * 24 * 30, "/", null, null, true); // httponly !!!

    // Переадресовываем браузер на страницу проверки нашего скрипта
    header("Location: /profile");
    exit();
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
<div class="content">

  <form class="col-4" method="POST" action="" style="padding-top: 80px;">
    <div class="form-group">
      <label for="login">Login</label>
      <input type="text" class="form-control" id="login" placeholder="Login" name="login">
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" class="form-control" id="password" placeholder="Password" name="password">
    </div>
    <input type="checkbox" name="not_attach_ip" checked style="display: none;">
    <button type="submit" name="submit" class="btn btn-primary">Войти</button>
  </form>
</div>
</body>
</html>