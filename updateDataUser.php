<?php
// Страница регистрации нового пользователя

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


if (isset($_POST["submit"])) {
  $err = [];

  // проверям логин
  if (!preg_match("/^[a-zA-Z0-9]+$/", $_POST['login'])) {
    $err[] = "";
  }

  // Если нет ошибок, то добавляем в БД нового пользователя
  if (count($err) == 0) {

    $login = $_POST['login'];
    $name = $_POST['name'];
    $company = $_POST['company'];
    $address = $_POST['address'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $programm_id = $_POST['programm_id'];
    $website = $_POST['website'];
    $photo = $_POST['photo'];

    // Убераем лишние пробелы и делаем двойное хеширование
    $password = md5(md5(trim($_POST['password'])));

    mysqli_query($link, "UPDATE users SET 
        user_login='" . $login . "', 
        user_password='" . $password . "', 
        user_name='" . $name . "', 
        user_company='" . $company . "', 
        user_address='" . $address . "', 
        user_phone='" . $phone . "', 
        user_email='" . $email . "', 
        user_programm_id='" . $programm_id . "', 
        user_website='" . $website . "', 
        user_photo='" . json_encode($photo) . "'
        WHERE user_id='" . $userdata["user_id"] . "'");
    header("Location: /profile");
    exit();
  } else {
    foreach ($err AS $error) {
      print $error . "<br>";
    }
  }
} ?>

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
  <form class="col-4" method="POST" action="">
    <div class="form-group">
      <label for="login">Login</label>
      <input type="text" class="form-control" id="login" placeholder="Login" name="login" value="<?= $userdata['user_login'] ?>">
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" class="form-control" id="password" placeholder="Password" name="password" required>
    </div>
    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" class="form-control" id="name" placeholder="Name" name="name" value="<?= $userdata['user_name'] ?>">
    </div>
    <div class="form-group">
      <label for="company">Company</label>
      <input type="text" class="form-control" id="company" placeholder="Company" name="company" value="<?= $userdata['user_company'] ?>">
    </div>
    <div class="form-group">
      <label for="address">Address</label>
      <input type="text" class="form-control" id="address" placeholder="Address" name="address" value="<?= $userdata['user_address'] ?>">
    </div>
    <div class="form-group">
      <label for="phone">Phone</label>
      <input type="text" class="form-control" id="phone" placeholder="Phone" name="phone" value="<?= $userdata['user_phone'] ?>">
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="text" class="form-control" id="email" placeholder="Email" name="email" value="<?= $userdata['user_email'] ?>">
    </div>
    <div class="form-group">
      <label for="programm_id">Индивидуальный код</label>
      <input type="text" class="form-control" id="skype" placeholder="Индивидуальный код" name="programm_id" value="<?= $userdata['user_programm_id'] ?>">
    </div>
    <div class="form-group">
      <label for="website">Web site</label>
      <input type="text" class="form-control" id="website" placeholder="Web site" name="website" value="<?= $userdata['user_website'] ?>">
    </div>
    <div class="form-group">
      <label for="photo">Photo</label>
      <input type="text" style="display: none;" class="loadFileValue" name="photo" value="<?= json_decode($userdata['user_photo']) ?>">
      <input type="file" id="photo" class="loadFile">
      <div class="form-images">
        <div style="background: url(<?= json_decode($userdata['user_photo']) ?>) no-repeat center /cover;" class="images-item 0"></div>
      </div>
    </div>
    <button type="submit" name="submit" class="btn btn-primary">Обновить</button>
  </form>
</div>

<script>
  $('.loadFile').on('change', function () {
    $('.form-images').empty();

    setTimeout(() => {
      const url = $('.form-images div:first-child').prop('style').backgroundImage.match(/"(.*)"/)[1];

      $('.loadFileValue').prop('value', url)
    }, 2000)
  })
</script>
</body>
</html>
