<!doctype html>
<html lang="ru">
  <link href="https://fonts.googleapis.com/css?family=Lato&amp;display=swap" rel="stylesheet">
  <meta charset="utf-8">
  <title></title>
  <link rel="stylesheet" href="http://78.47.40.9/css/style.css">
  <script src="http://78.47.40.9/js/jquery-3.4.1.min.js"></script>
  <script src="http://78.47.40.9/js/bootstrap.min.js"></script>
  <script src="http://78.47.40.9/js/main.js"></script>

  <link rel="stylesheet" href="http://78.47.40.9/css/bootstrap.min.css">

</head>
<body>
<div class="py-5 px-5" style="display: flex;flex-direction: column">

  <?php


  $dir = opendir("../autosave");
  while (false !== ($file = readdir($dir))) {
    if ($file != "." && $file != ".." && $file != "index.php") {
      $files[] = $file;
    }
  }
  closedir($dir);
  sort($files);
  $count = 1;
  
  foreach ($files as $fil) {

    echo '
      <a style="font-size: 17px" class="text-dark mb-2" href="/autosave/' . $fil . '">
        ' . $count . '. '. str_replace('.autosave', '', $fil) . '
      </a>
';
    $count++;
  }

  ?>

</div>
</body>
</html>