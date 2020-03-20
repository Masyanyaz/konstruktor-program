<!doctype html>
<html lang="ru">
<script type="text/javascript" charset="utf-8" id="zm-extension" src="chrome-extension://fdcgdnkidjaadafnichfpabhfomcebme/scripts/webrtc-patch.js" async=""></script>
<head>
  <link href="https://fonts.googleapis.com/css?family=Lato&amp;display=swap" rel="stylesheet">
  <meta charset="utf-8">
  <title></title>
  <link rel="stylesheet" href="http://78.47.40.9/css/main.css">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <script src="http://78.47.40.9/js/jquery-3.4.1.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

  <script src="http://78.47.40.9/js/bootstrap.min.js"></script>
  <script src="http://78.47.40.9/js/script.js"></script>

  <link rel="stylesheet" href="http://78.47.40.9/css/bootstrap.min.css">
</head>
<body style="max-width: 1000px; margin: 30px auto 0;">
<div class="py-5 px-5">

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

  foreach ($files as $fil) : ?>
    <div class="program-list">
      <span class="program-delete">&times;</span>
      <a style="font-size: 17px" class="text-dark mb-2" href="/html/<?= $fil ?>">
        <?= $count . '. ' . str_replace('.html', '', $fil) ?>
      </a>
    </div>
    <? $count++;
  endforeach; ?>

</div>
</body>
</html>