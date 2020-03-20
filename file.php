<?php
$htmlFileName = $_POST["htmlFileName"];
if (file_exists($htmlFileName)) {
  echo json_encode(false);
} else {
  echo json_encode(true);
}
