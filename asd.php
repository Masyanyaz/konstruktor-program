<!doctype html>
<html lang="ru">
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
<div class="py-5 px-5" style="padding-top: 80px!important;">

  <?
  function showdir($dir)
  {
    $list = scandir($dir);
    if (is_array($list)) {
      $list = array_diff($list, array('.', '..'));
      if ($list) {
        echo '<ul>';
        foreach ($list as $name) {
          $path = $dir . '/' . $name;
          $is_dir = is_dir($path);
          if ($is_dir) {
            $name = file_get_contents($path . '/.section.php') ?: htmlspecialchars($name);
            echo '<li class="dir"><span>' . $name . '</span>';
            showdir($path);
          } else {
            if ($name !== '.section.php')
              echo '<li class="file"><span><a href="' . $path . '">' . htmlspecialchars($name) . '</a></span>';
          }
          echo '</li>';
        }
        echo '</ul>';
      }
    } else {
      echo '<i>не могу прочитать</i>';
    }
  }

  $dir = 'patterns';

  ?>
  <div>
    <div class="structure">
      <? showdir($dir); ?>
    </div>
  </div>
</div>
</body>
</html>
