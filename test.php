<?php
// адрес сайта
$url = "http://78.47.40.9/test/flyer.html";

// вызов методов сервиса
$api_data = file_get_contents("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=$url&screenshot=true");
// расшифровка данных** json
$api_data = json_decode($api_data, true);

// данные снимка
$screenshot = $api_data['screenshot']['data'];
$screenshot = str_replace(array('_','-'),array('/','+'),$screenshot);

// отображаем изображение
echo "<img src=\"data:image/jpeg;base64,".$screenshot."\" />";