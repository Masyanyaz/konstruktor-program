$(document).ready(function () {
///start
  // Сброс загрузки и очистка сообщения
  loading();
  clearMessage();
  removeAllBtn('.price-btn', '.adminPanel');


  // Получение имени файла из адрестной строки
  let path = window.location.pathname;
  let pathName = path
    .slice(window.location.pathname.lastIndexOf('/'))
    .replace('/', '')
    .replace('.html', '');
  let fileName;
  let htmlFileName;
  let autoSave;
  let pdfFileName;

  // Если дефолтный шаблон, то сохраняем под другим названием
  if (path.indexOf('patterns') === 1) {
    createNewFile()
  } else {
    fileName = pathName;
    htmlFileName = `html/${pathName}.html`;
    autoSave = `autosave/${pathName}.html`;
    pdfFileName = `pdf/${pathName}.pdf`;
  }

  // Создание нового файла с именем, сохранение файла и редирект
  function createNewFile(mes = 'Введите название файла') {
    fileName = prompt(mes, `newProgram${Date.now()}`).replace(/ /g, '_');
    if (fileName === null) fileName = `newProgram${Date.now()}`;
    htmlFileName = `html/${fileName}.html`;
    autoSave = `autosave/${fileName}.html`;
    pdfFileName = `pdf/${fileName}.pdf`;
    let fd = new FormData();
    fd.append('htmlFileName', htmlFileName);
    $.ajax({
      type: "POST",
      url: "/file.php",
      data: fd,
      contentType: false,
      processData: false
    })
     .then(res => {
       res = JSON.parse(res);
       if (res) {
         saveAsHtml(htmlFileName, true);
         setTimeout(() => window.location.pathname = `/${htmlFileName}`, 300)
       } else {
         createNewFile('Такое имя файла уже существует, введите, пожалуйста, другое')
       }
     })
     .catch(e => {
       setMessage(`Ошибка: ${e.statusText}`, false);
     })
  }

  // Установка колонтитула на каждой странице
  function setHeader() {
    let header = $('.programm-header').height() + 40;
    let newTopHeight = 0;
    let blocksHeight = $('.height');
    let maxHeight = 1439;//1439
    let count = 1;
    let body = $('body');
    let countPage = Math.ceil(body.height() / 1409) + 1;

    for (let i = 0; i < blocksHeight.length - 1; i++) {
      let height = blocksHeight.eq(i + 1).offset().top - blocksHeight.eq(i).offset().top;
      newTopHeight += height;
      if (newTopHeight >= maxHeight) {
        let offSet = blocksHeight.eq(i)
                                 .offset().top;
        let dif = Math.abs(offSet - maxHeight);
        blocksHeight.eq(i - 1)
                    .after(addHeader())
                    .after(`<div style="position: absolute;right: 50%; margin-top: -50px;" class="deleteHeader">${count} / ${countPage}</div>`)
                    .after(`<div class="deleteHeader" style="height: ${dif}px; position: relative; z-index: 999999;">
                              <button class="btn-success heightBtn minus needHidden">-</button>
                              <button class="btn-success heightBtn plus needHidden">+</button>
                            </div>`);
        maxHeight += 1426;//1426
        // count === 4 ? maxHeight += 1400 : maxHeight += 1308;
        newTopHeight += dif + header
        count++
      }
    }
    body.append(`<div style="position: absolute;right: 50%; margin-top: -50px; top: ${maxHeight}px" class="deleteHeader">${count} / ${countPage}</div>`)
  }


  // Удаление колонтитула и очистка пустых мест
  function deleteHeader() {
    let header = $('.deleteHeader');
    for (let i = 1; i < header.length; i++) {
      header.eq(i).remove()
    }
  }

  // Очистка поля с сообщением
  function clearMessage() {
    let message = $('.message');
    message.text('')
  }

  // Установка загрузки
  function loading(payload = false) {
    let element = $('#fountainTextG');
    let message = $('.message');
    payload ? element.css('display', 'block') : element.css('display', 'none');
    !payload ? message.css('display', 'block') : message.css('display', 'none')
  }

  // Вывод сообщения или ошибки
  function setMessage(message, isSuccess = true) {
    let element = $('.message');
    let color = isSuccess ? '#1e7e34' : 'darkred';
    element.html(`<p style="color: ${color}">${message}</p>`)
  }

  // Редактирование текста
  $('.editable')
    .on('dblclick', function (e) {
      if ($(e.target).hasClass('needHidden') || $(e.target).parent().hasClass('needHidden')) return;
      $(e.target).attr('contentEditable', 'true');
    })
    .on('focusout', function (e) {
      $(e.target).removeAttr('contentEditable');
    });

  // Добавление колонтитула
  function addHeader() {
    return `${document.querySelector('.programm-header').outerHTML}`;
  }

  $('.addColPrice').remove();
  // Кнопка Добавить столбик с ценами
  $('.programm-tarifs').prepend(`<button style="position: absolute; right: 0;" class="addColPrice needHidden mr-5 btn btn-success hidden">Столбик</button>
                                        <button style="position: absolute; right: 100px;" class="addStrPrice needHidden mr-5 btn btn-success hidden">Строка</button>`)

  // Добавление нового дня
  function addDay() {
    let a = $('.day-block');
    return `<div class="day-block height" id="${a.length + 1}" style="position: relative;">
                ${addBtnInDay()}
                <div class="day-header">
                  <div class="day-number" contentEditable>
                    jour ${a.length + 1}
                  </div>
                  <div class="day-town-and-date" contentEditable>
                    <span>Дата</span> - <span>Название дня</span>
                  </div>
                </div>
                <div class="day-body">
                <input type="file" multiple accept="image/*" class="loadFile needHidden" style="position: absolute;">
                  <div class="day-pictures">
                  </div>
                  <div class="day-text" contentEditable>
                      <p>Текст дня</p>
                  </div>
                </div>
              </div>
            </div>`;
  }

  function addPhotoInText() {
    return `<input type="file" multiple accept="image/*" class="loadFile needHidden" style="position: absolute;">
            <div class="text-pictures">
            </div>`
  }

  // Функция сохранения пдф
  function saveAsPdf() {
    $.ajax({
      type: "POST",
      processData: false,
      contentType: false,
      url: `/convert.php?file=${htmlFileName}`,
      success: () => {
        setMessage(`Ура ура, пдф готов <a href="/${pdfFileName}" target="_blank">Вот ссылка</a>`);
      },
      error: e => {
        setMessage(`Что-то пошло не так, позовоите на помощь((((( Ошибка: ${e.statusText}`, false);
      },
      complete: () => {
        saveAsHtml(htmlFileName, false);
        $('.addKolontitul').attr('disabled', false);
        loading(false)
      }
    })
  }

  function uploadPhoto(e) {
    loading(true);
    let files = e.target.files;
    let arrFiles = [...files];
    let fd = new FormData();
    arrFiles.forEach((img, i) => fd.append(`${i}`, img))
    fd.append('fileName', fileName);
    $.ajax({
      url: '/upload.php',
      dataType: 'text',
      cache: false,
      contentType: false,
      processData: false,
      data: fd,
      type: 'post'
    })
     .then(res => {
       res = JSON.parse(res);
       for (let i = 0; i < files.length; i++) {
         $(e.target.nextElementSibling)
           .append(`<div style="background: url(${window.location.origin}/uploads/${fileName}/${res[i]}) no-repeat center /cover;" class="bgImg ${i}"></div>`)
       }
       setMessage('Файл загружен');
       loading(false)
     })
     .catch(e => {
       setMessage(`Что-то пошло не так, позовоите на помощь((((( Ошибка: ${e.statusText}`, false);
       loading(false)
     })
  }

  // Прослушивания на динамические элементы
  $('.days')
  // Загрузка фотографий
    .on('change', e => {
      if (~e.target.className.indexOf('loadFile')) {
        uploadPhoto(e)
      }
    })
    // Удаление картинки дабл кликом
    .on('dblclick', e => {
      if (~e.target.className.indexOf('bgImg')) {
        $(e.target).remove()
      }
    })
    // Кнопка удаления дня
    .on('click', e => {
      if (~e.target.className.indexOf('deleteDay')) {
        $(e.target).closest('.day-block').remove();
      }
    })
    // Кнопка добавления дня после данного дня
    .on('click', e => {
      if (~e.target.className.indexOf('addDayAfter')) {
        $(e.target).parent().hasClass('day-block') ? $(e.target).parent().after(addDay()) : $(e.target).parent().parent().after(addDay())
      }

      if (~e.target.className.indexOf('addDayBefore')) {
        $(e.target).parent().hasClass('day-block') ? $(e.target).parent().before(addDay()) : $(e.target).parent().parent().before(addDay())
      }
    })
    .on('click', e => {
      if (~e.target.className.indexOf('addPhotoInText')) {
        if (~e.target.className.indexOf('photoDiv')) {
          $(e.target).parent().parent().find('.day-text').append(addPhotoInText())
          $(e.target).text('Добавить текст')
          $(e.target).removeClass('photoDiv')
        } else {
          $(e.target).parent().parent().find('.day-text').append(`<p>Текст</p>`)
          $(e.target).text('Добавить фото')
          $(e.target).addClass('photoDiv')
        }
      }
    });

  // сохранение текущего файла
  function saveAsHtml(fileName, message = true) {
    $('.needHidden').addClass('hidden');
    let DOM = $('html').html();
    let fd = new FormData();
    fd.append('DOM', DOM);
    fd.append('htmlFileName', fileName);
    $.ajax({
      type: "POST",
      url: "/saveAsHtml.php",
      data: fd,
      contentType: false,
      processData: false
    })
     .then(res => {
       message ? setMessage(res) : false;
       $('.needHidden').removeClass('hidden')
     })
     .catch(e => {
       setMessage(`Ошибка: ${e.statusText}`, false);
       $('.needHidden').removeClass('hidden')
     })
  }

  // Автосохранение файла
  setInterval(() => {
    if (pathName === '' || pathName === 'index.php') return;
    saveAsHtml(autoSave)
  }, 300000);

  // Панель с кнопками справа
  function adminPanel() {
    return `<header class="needHidden hidden" style="border: 1px solid; padding: 5px 15px;">
              <p style="line-height: 18px">
                <a href="/news">Появился новый функционал</a>
              </p>
            </header>

            <div class="adminPanel needHidden hidden">
              <div class="adminPanel-result">
                <div class="message"><p style="font-size: 12px;">С новым годом!</p></div>
                <div id="fountainTextG" style="display: none;">
                  <div id="fountainTextG_1" class="fountainTextG">З</div>
                  <div id="fountainTextG_2" class="fountainTextG">а</div>
                  <div id="fountainTextG_3" class="fountainTextG">г</div>
                  <div id="fountainTextG_4" class="fountainTextG">р</div>
                  <div id="fountainTextG_5" class="fountainTextG">у</div>
                  <div id="fountainTextG_6" class="fountainTextG">з</div>
                  <div id="fountainTextG_7" class="fountainTextG">к</div>
                  <div id="fountainTextG_8" class="fountainTextG">а</div>
                </div>
              </div>
              <button class="addNewDay btn-success btn">Добавить день</button>
              <button class="saveAsHtml btn-success btn">Сохранить файл</button>
              <button class="saveAsOtherHtml btn-success btn">Сохранить как</button>
              <button class="btn-success btn addKolontitul">Добавить колонтитулы</button>
              <button class="btn-success btn deleteKolontitul">Удалить Колонтитулы</button>
              <button class="btn-success btn saveAsPdf">Сохранить как pdf</button>
<!--              <button class="goToNewDesign btn">Тестовая кнопка</button>-->
              <div style="margin-top: 15px;font-size: 12px;">
                
              </div>
            </div>`
  }

  // удаляет лишние панели и добавляет новую
  $('.adminPanel').remove();

  $('.day-menu-btns').remove();
  $('.day-block').prepend(addBtnInDay());

  $('header').remove();
  $('body').prepend(adminPanel());

  // удаляет и добавляет кнопку добавления, что включено и не вкулючено
  $('.addIncList').remove();
  $('.programm-include-left').prepend(`<button style="position: absolute; right: 20px;" class="needHidden btn hidden addIncList">Добавить пункты</button>`);

  // Кнопки клавиатуры
  $(document)
    .on('keydown', e => {
      // Показ панели редактирования (ctrl + 4)
      if (e.ctrlKey && e.keyCode === 52) {
        e.preventDefault();
        $('.needHidden').toggleClass('hidden')
      }
      // Сохранение файла (ctrl + s)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        saveAsHtml(htmlFileName)
      }
    })
    .on('click', function (e) {
      // Уменьшить отступ у колонтитула
      if (~e.target.className.indexOf('minus')) {
        const target = $(e.target.offsetParent);
        let height = target.height() - 10;
        target.css('height', `${height}px`)
      }
      // Увеличить отступ у колонтитула
      if (~e.target.className.indexOf('plus')) {
        const target = $(e.target.offsetParent);
        let height = target.height() + 10;
        target.css('height', `${height}px`)
      }
      // Кнопка добавить день
      if (~e.target.className.indexOf('addNewDay')) {
        $('.days').append(addDay());
        setMessage('День добавлен');
      }
      // Кнопка сохранить файл
      if (~e.target.className.indexOf('saveAsHtml')) {
        saveAsHtml(htmlFileName)
      }
      // Кнопка сохранить файл как
      if (~e.target.className.indexOf('saveAsOtherHtml')) {
        createNewFile()
      }
      // Кнопка добавить колонтитул
      if (~e.target.className.indexOf('addKolontitul')) {
        setHeader();
        setMessage('Колонтитулы добавлены');
        $(e.target).attr('disabled', true);
        $('.savePdf').attr('disabled', true)
      }
      // Кнопка удалить колонтитул
      if (~e.target.className.indexOf('deleteKolontitul')) {
        deleteHeader();
        setMessage('Колонтитулы удалены');
        $('.addKolontitul').attr('disabled', false);
        $('.savePdf').attr('disabled', false)
      }
      // Кнопка сохранить как пдф
      if (~e.target.className.indexOf('saveAsPdf')) {
        loading(true);
        saveAsHtml(htmlFileName);
        saveAsPdf()
      }
      // Кнопка добавления пунктa в что включено и не включено
      if (~e.target.className.indexOf('addIncList')) {
        $('.galochka').append(`<li>Текст</li>`)
        $('.krestik').append(`<li>Текст</li>`)
      }
      // Кнопка добавления столбика цены
      if (~e.target.className.indexOf('addColPrice')) {
        $('.programm-tarifs-body').append($('.ttt').eq(0).clone())
      }
      // Кнопка добавления строки цены
      if (~e.target.className.indexOf('addStrPrice')) {
        $('.rrr').append(`<span>Текст :</span>`)
        $('.ttt').append(`<span>XXXX €</span>`)
      }

      if (~e.target.className.indexOf('goToNewDesign')) {
        (async () => {
          try {
            const fields = await getAllFields();
            await document.write(goToNewDesign(fields));
            await setTimeout(() => saveAsHtml(htmlFileName), 1000)
          } catch (e) {
            console.log(e)
          }
        })()
      }



      // // Кнопка добавить день
      // if (~e.target.className.indexOf('addNewDay')) {
      //   $('.program-days').append(addNewDay());
      //   setMessage('День добавлен');
      // }

      // Добавление что включено и не включено
      if (~e.target.className.indexOf('add-contain-item')) {
        $(e.target).before(`<span>Текст</span>`)
      }

      // Добавление строки в таблицу цен
      if (~e.target.className.indexOf('add-price-row')) {
        $('.program-price-desc-item').append(`<span>Текст</span>`)
      }

      // Добавление столбца в таблицу цен
      if (~e.target.className.indexOf('add-price-col')) {
        if ($('.program-price-desc-item').length >= 4) {
          let int = setInterval(() => {
            if ($('.program-price-desc-item').length < 4) {
              $($(e.target).removeClass('disabled'));
              $(e.target).text('Столбец');
              console.log('asd')
              clearInterval(int)
            }
          }, 500)
          $($(e.target).addClass('disabled'));
          $(e.target).text('Максимум');
          return
        }
        $('.program-price-desc').append($('.program-price-desc-item:last-child').clone())
      }
    });

  // Удаление старых кнопок
  function removeAllBtn() {
    for (let i = 0; i < arguments.length; i++) {
      $(arguments[i]).remove()
    }
  }

  $('.program-price')
    .prepend(`
    <div class="price-btn needHidden hidden">
      <button class="add-price-row mr-1 btn btn-success">Строка</button>
      <button class="add-price-col btn btn-success">Столбец</button>
    </div>`);


  function addBtnInDay() {
    return `<div style="position: absolute; right: 0; display: flex;" class="needHidden day-menu-btns hidden">
              <button class="addPhotoInText photoDiv mr-1 btn btn-success">Добавить фото</button>
              <button class="addDayBefore mr-1 btn btn-success">Добавить день до</button>
              <button class="addDayAfter mr-1 btn btn-success">Добавить день после</button>
              <button class="deleteDay btn btn-danger">Удалить день</button>
            </div>`
  }

  // Добавление нового дня
  function addNewDay() {
    let a = $('.program-days-item');
    return `<div class="program-days-item">
              ${addBtnInDay()}
              <div class="program-days-item-header">
                <div class="program-days-item-header-count">
                  Jour 1
                </div>
                <div class="program-days-item-header-data">
                  01.01.2020
                </div>
                <div class="program-days-item-header-name">
                  Moscou
                </div>
              </div>
              <div class="program-days-item-text">
                <div class="images">
                  <div class="images-item" style="background: url(http://78.47.40.9/uploads/SB_2019_12_N55_DUPONT/141324_or.jpg) no-repeat center /cover"></div>
                  <div class="images-item" style="background: url(http://78.47.40.9/uploads/SB_2019_12_N55_DUPONT/141324_or.jpg) no-repeat center /cover"></div>
                </div>
                <div class="desc">
                  <p>Arrivée à Moscou.</p>
                  <p>Accueil par votre chauffeur russophone à l'aéroport, transfert en ville.</p>
                  <p>Installation à l'hôtel Bagration 3* en chambre double standard.</p>
                  <div class="desc-images">
                    <div class="desc-images-item" style="background: url(http://78.47.40.9/uploads/SB_2019_12_N55_DUPONT/141324_or.jpg) no-repeat center /cover"></div>
                    <div class="desc-images-item" style="background: url(http://78.47.40.9/uploads/SB_2019_12_N55_DUPONT/141324_or.jpg) no-repeat center /cover"></div>
                  </div>
                </div>
              </div>
            </div>`;
  }

  getAllFields()

});




function addDayNewDesign(fields) {
  let res = ``;
  fields.forEach((a,i) => {
    let image = '';
    a.photo.forEach(b => image += `<div style="background: ${b}" class="images-item ${i + 1}"></div>`)

    res += `<div class="program-days-item height">
              <div class="program-days-item-header">
                <div class="program-days-item-header-count">
                  Jour ${i + 1}
                </div>
                <div class="program-days-item-header-data">
                  01.01.2020
                </div>
                <div class="program-days-item-header-name">
                  Название
                </div>
              </div>
              <div class="program-days-item-text">
                <input type="file" multiple="" accept="image/*" class="loadFile needHidden" style="position: absolute;">
                <div class="images">
                  ${image}
                </div>
                <div class="desc">
                  ${a.text}
                  <input type="file" multiple="" accept="image/*" class="loadFile needHidden" style="position: absolute;">
                  <div class="desc-images">
                  </div>
                </div>
              </div>
            </div>`
  })
  return res;
}




function getAllFields() {
  const fields = {};
  fields.header = {
    logo: $('.programm-header-left span').text(),
    site: $('.programm-header-left a').text(),
    address: $('.programm-header-right .www span:first-child').text(),
    phone: $('.programm-header-right .www span:nth-child(2)').text(),
    email: $('.www .email').text()
  };

  fields.redTitle = $('.programm-data-name').text();
  fields.programmNameTitle = $('.programm-data-text p').html().replace(/<span>[a-zA-Z\s]*<\/span>/, '');
  fields.programmNameText = $('.programm-data-text p span').text();
  fields.proframmData = {
    number: $('.programm-data-list .www span:first-child').text(),
    date: $('.programm-data-list .www span:nth-child(2)').text(),
    days: $('.programm-data-list .www span:nth-child(3)').text()
  };
  fields.days = [];

  $('.day-block').each((i,a) => {
    fields.days.push({
      photo: [],
      text: $(a).find('.day-text').html()
    });

    $(a).find(`.day-pictures div`).each((y,b) => {
      fields.days[i].photo.push($(b).prop('style').background)
    })

  })

  console.log(fields)

  return fields
}





function goToNewDesign(fields) {
  return `
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
  <div class="editable">
    <div class="header height deleteHeader">
      <div class="header-logo">
        <div class="header-logo-title">${fields.header.logo}</div>
        <div class="header-logo-text">agence de voyage specialisee sur la russie</div>
      </div>
      <div class="header-contacts">
        <div class="header-contacts-item">
          <div class="email">
            ${fields.header.email}
          </div>
          <div class="site">
            ${fields.header.site}
          </div>
        </div>
        <div class="header-contacts-item">
          <div class="adress">
            ${fields.header.address}
          </div>
          <div class="phone">
            ${fields.header.phone}
          </div>
        </div>
      </div>
    </div>
    <div class="red-title height">
      ${fields.redTitle}
    </div>
    <div class="content">
      <div class="program-name height">
        <div class="program-name-title">
          ${fields.programmNameTitle}
        </div>
        <div class="program-name-text">
          ${fields.programmNameText}
        </div>
      </div>
      <div class="program-data height">
        <div class="program-data-title">
          Votre demande:
        </div>
        <div class="program-data-text">
          <div class="program-data-text-city">
            Moscou - Saint-Pétersbourg
          </div>
          <div class="program-data-text-desc">
            <div class="program-data-text-desc-item">
              <span>Nombre de personnes:</span>
              <span>Date de sejour:</span>
              <span>Durée du séjour:</span>
            </div>
            <div class="program-data-text-desc-item">
              <span>${fields.proframmData.number}</span>
              <span>${fields.proframmData.date}</span>
              <span>${fields.proframmData.days}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="program-days">
        ${addDayNewDesign(fields.days)}
      </div>
      <div class="program-end height">
        <div class="program-end-title title">
          Fin de nos services
        </div>
        <div class="program-end-text">
          Le programme culturel proposé est susceptible de connaître de légères modifications en fonction des changements de jours et heures d'ouverture des sites. Si tel était le
          cas, tout serait mis en oeuvre pour limiter cela à des modifications dans l'ordre des visites, ou, éventuellement, vous proposer des prestations de remplacement de
          qualité équivalente.
        </div>
      </div>
      <div class="program-price height">
        <div class="program-price-title title">
          Détails et tarifs
        </div>
        <div class="program-price-desc">
          <div class="program-price-desc-item">
            <span>Prix total pour 2 personnes</span>
            <span>Prix par personne dans le groupe de 2 personnes</span>
          </div>
          <div class="program-price-desc-item">
            <span>2 404 €</span>
            <span>1 202 €</span>
          </div>
        </div>
      </div>
      <div class="program-contain height">
        <div class="program-contain-item">
          <div class="program-contain-item-title">
            Ces prix comprennent
          </div>
          <div class="program-contain-item-text">
            <span>Le support visa (les vouchers et lettre d'invitation)</span>
            <span>2 nuits à l'hôtel avec le petit déjeuner à Moscou</span>
            <span>3 nuits en chambre d'hôte avec le petit déjeuner à Saint-Pétersbourg</span>
            <span>Le transport terrestre et tous les transferts en véhicule privatif selon le programme</span>
            <span>Les services d'un guide francophone particulier diplômé pour toutes les excursions mentionnées</span>
            <span>Les droits d'entrée dans les musées et les sites selon le programme</span>
            <span>Les billets de train de nuit Moscou - Saint-Pétersbourg (compartiment de 1re classe, 2 couchettes)</span>
            <div class="add-contain-item needHidden hidden">Добавить пункт</div>
          </div>
        </div>
        <div class="program-contain-item">
          <div class="program-contain-item-title">
            Ces prix ne comprennent pas
          </div>
          <div class="program-contain-item-text">
            <span>Les frais consulaires pour le visa</span>
            <span>Les vols internationaux</span>
            <span>Les assurances</span>
            <span>Les repas</span>
            <span>Tous frais et dépenses d'ordre personnel</span>
            <div class="add-contain-item needHidden hidden">Добавить пункт</div>
          </div>
        </div>
      </div>
      <div class="program-remarque height">
        <div class="program-remarque-item">
          Remarques
        </div>
        <div class="program-remarque-item">
          Les chambres dans les hôtels sont disponibles à 14h00. Le jour de votre départ il faut libérer votre chambre avant 12h00.
        </div>
      </div>
      <div class="program-thanks height">
        <div class="program-thanks-title title">
          Voyagez en toute sécurité en souscrivant
          à une assurance voyage !
        </div>
        <div class="program-thanks-text">
          Grâce à notre partenaire officiel Chapka Assurances, nous sommes heureux de vous proposer en exclusivité des contrats d'assurance afin que vous puissiez partir l’esprit
          tranquille et en toute sécurité:
        </div>
        <div class="belay">
          <div class="belay-item">
            <div class="belay-item-title">
              Cap Assistance 24/24
            </div>
            <div class="belay-item-text">
              Un problème pendant votre séjour ? Faîtes-nous confiance et partez l’esprit tranquille avec le Cap Assistance 24h/24. Soyez sûr d’obtenir une aide efficace avec cette
              assurance mise à votre disposition.
            </div>
            <div class="belay-item-btn">
              Obtenir l’assurance ›››
            </div>
          </div>
          <div class="belay-item">
            <div class="belay-item-title">
              Cap Annulation
            </div>
            <div class="belay-item-text">
              L'assurance Cap Annulation, dite assurance annulation toutes causes , vous remboursera les frais d'annulation de votre vol et/ou séjour retenus par l'organisateur du
              voyage (agence, transporteur, loueur) pour "toutes causes justifiées".
            </div>
            <div class="belay-item-btn">
              Obtenir l’assurance ›››
            </div>
          </div>
        </div>
      </div>
      <div class="program-rule height">
        <div class="program-rule-title title">
          Modalités de réservation,
          d'annulation et de paiement
        </div>
        <div class="program-rule-text">
          <p>Le prépaiement de 20% doit être versé au moment de la réservation par carte bancaire par le lien sécurisé.</p>
          <h3>Le solde du voyage doit être réglé:</h3>
          <ul>
            <li>par carte bancaire au plus tard 60 jours avant votre arrivée,</li>
            <li>par virement bancaire au plus tard 60 jours avant votre arrivée (les frais sont à votre charge),</li>
          </ul>
          <h3>Conditions d'annulation</h3>
          <p>Toute annulation doit faire l’objet d’un mail adressé à l’agence locale. Le montant des frais d’annulation varie en fonction du moment où intervient l’annulation :</p>
          <ul>
            <li>à plus de 60 jours du départ : 5% du prix du voyage</li>
            <li>entre 59 et 30 jours du départ : 25% du prix du voyage</li>
            <li>entre 29 et 21 jours du départ : 50% du prix du voyage</li>
            <li>entre 20 et 7 jours du départ : 75% du prix du voyage</li>
            <li>à moins de 6 jours du départ et après la date de départ : 100% du prix du voyage</li>
          </ul>
        </div>
      </div>
      <div class="program-footer height">
        <div class="program-footer-title">
          Bienvenue en Russie!
        </div>
        <div class="program-footer-text">
          L'équipe RussieAutrement
        </div>
      </div>
    </div>
  </div>
  </body>
  </html>`
}