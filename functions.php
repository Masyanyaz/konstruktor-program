<?php

class Functions
{
  function log($path, $text, $fileName)
  {
    $text = date('H:i:s') . $text . $fileName;

    file_put_contents('logs/' . $path . '/' . date('d-m-Y') . '.txt', $text . PHP_EOL, FILE_APPEND | LOCK_EX);
  }

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
            $this->showdir($path);
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
}

return $fn = new Functions;

