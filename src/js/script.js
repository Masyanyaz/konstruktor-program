import {adminPanel} from '@/js/admin/index';
import {f} from "./functions";

const htmlUrl = window.location.href.match(/\/html/) || window.location.href.match(/\/autosave/);

document.addEventListener("DOMContentLoaded", () => {
  if (htmlUrl) {
    document.designMode = 'on';

    document
      .querySelectorAll('.first-page .first-page-title, .first-page .program-name, .first-page .program-data, .first-page .first-page-desc')
      .forEach(el => {
        if (!el.classList.contains('draggable')) el.classList.add('draggable')
      })
  }


  document.querySelector('head')
          .insertAdjacentHTML('beforeend', '<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">')
});

window.onload = () => {

  if (document.querySelectorAll('.structure .dir').length) {
    document.querySelectorAll('.structure .dir').forEach(el => {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        this.lastElementChild.classList.toggle('open-dir')
      })
    })
  }

  document.querySelectorAll('.needHidden').forEach(el => {
    el.setAttribute('contenteditable', false)
  });

  document.querySelectorAll('.program-delete').forEach(el => {
    el.addEventListener('click', e => {
      const target = e.target;
      const parent = target.parentElement;
      const element = target.nextElementSibling;
      const href = element.getAttribute('href');
      const name = element.textContent.trimEnd();

      if (confirm(`Вы уверены, что хотите удалить программу ${name}?`)) {
        const fd = new FormData();
        fd.append('href', href);
        $.ajax({
          type: "POST",
          url: "/remove-program.php",
          data: fd,
          contentType: false,
          processData: false
        })
         .then(res => {
           if (res)
             parent.remove()
         })
         .catch(e => console.log(e))
      }
    })
  })
};

/*window.onbeforeunload = () => {
  if (window.location.href.match(/html/))
    return "Были внесены изменения, которые НЕ БЫЛИ сохранены";
}*/

$(document).ready(function () {
///start
  // Сброс загрузки и очистка сообщения
  loading();
  clearMessage();
  removeAllBtn(
    '.price-btn',
    '.adminPanel',
    '.day-menu-btns',
    '.close-block',
    'header',
    '.addIncList',
    '.add-contain-item',
    '.contain-menu-btns'
  );

  document.querySelector('body').insertAdjacentHTML('afterbegin', adminPanel());


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
    if (fileName === null) {
      window.location.pathname = `/`;
      return
    }
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
         setTimeout(() => window.location.pathname = `/${htmlFileName}`, 800)
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
    let header = $('.header').height() + 40;
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

  // Добавление колонтитула
  function addHeader() {
    return `${document.querySelector('.header').outerHTML}`;
  }

  // Функция сохранения пдф
  function saveAsPdf() {
    console.log(htmlFileName);
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

  function uploadMapFlyer(e) {
    loading(true);
    let files = e.target.files;
    let arrFiles = [...files];
    let fd = new FormData();
    arrFiles.forEach((img, i) => fd.append(`${i}`, img));
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
       $('.flyer-desc').prop('style', `background-image: url(${window.location.origin}/uploads/${fileName}/${res[0]})`)
       setMessage('Файл загружен');
       loading(false)
     })
     .catch(e => {
       setMessage(`Что-то пошло не так, позовоите на помощь((((( Ошибка: ${e.statusText}`, false);
       loading(false)
     })
  }

  function uploadPhoto(e, main = false) {
    loading(true);
    let files = e.target.files;
    let arrFiles = [...files];
    let fd = new FormData();
    arrFiles.forEach((img, i) => fd.append(`${i}`, img));
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
       if (!main) {
         for (let i = 0; i < files.length; i++) {
           $(e.target.nextElementSibling)
             .append(`<div style="background: url(${window.location.origin}/uploads/${fileName}/${res[i]}) no-repeat center /cover;" class="images-item ${i}"></div>`)
         }
       } else {
         $('.first-page').prop('style', `background-image: url(${window.location.origin}/uploads/${fileName}/${res[0]})`)
       }
       setMessage('Файл загружен');
       loading(false)
     })
     .catch(e => {
       setMessage(`Что-то пошло не так, позовоите на помощь((((( Ошибка: ${e.statusText}`, false);
       loading(false)
     })
  }

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

  if (htmlUrl) {
    let autoSaveCounter = 1;

    // Автосохранение файла
    setInterval(() => {
      saveAsHtml(autoSave);
      autoSaveCounter++;
      if (autoSaveCounter % 2) setMessage('Вы давно не сохранялись')
    }, 300000);
  }

  function setMainPage() {
    if (!$('.first-page').length) {
      removeAllBtn('.header', '.red-title', '.program-name', '.program-data');

      $('.content')
        .prepend(`<div class="first-page">
                          <div class="first-page-title">
                            RUSSIE AUTREMENT
                          </div>
                          <div class="program-name height">
                            <div class="program-name-title">
                              Programme sur mesure spécialement étudié en faveur de
                            </div>
                            <div class="program-name-text">
                              Appéré Patricia
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
                                  <span>2 adultes</span>
                                  <span>septembre 2020</span>
                                  <span>7 jours et 6 nuits</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="first-page-desc">
                            <div>
                              Описание тура
                            </div>
                            <div>
                              Описание тура
                            </div>
                            <div>
                              Описание тура
                            </div>
                          </div>
                        </div>
                        <div class="second-page"></div>`);

      $('.second-page').load('/profile .manager-contacts', {limit: 1});

      saveAsHtml(htmlFileName, true);

      setTimeout(() => window.location.reload(), 500)
    }

  }

  // удаляет и добавляет кнопку добавления, что включено и не вкулючено
  $('.programm-include-left').prepend(`<button style="position: absolute; right: 20px;" class="needHidden btn hidden addIncList">Добавить пункты</button>`);


  $('.needHidden').removeClass('hidden');

  $(document)
    .on('change', e => {
      // Загрузка фотографий
      if (~e.target.className.indexOf('loadFile')) {
        uploadPhoto(e)
      }
      // Дизайн мод
      if (~e.target.className.indexOf('designMode')) {
        const target = e.target;
        document.designMode = target.checked ? 'on' : 'off';
        target.nextSibling.textContent = `Режим ${target.checked ? 'редактирования' : 'чтения'}`;
      }

      // Кнопка картинка на главную страницу
      if (~e.target.className.indexOf('setBgImageFirstPage')) {
        console.log('click')
        uploadPhoto(e, true)
      }

      // Кнопка картинка на главную страницу
      if (~e.target.className.indexOf('setBgImageFlyer')) {
        uploadMapFlyer(e)
      }

      // Загрузка фотографий
      if (~e.target.className.indexOf('custom-control-input')) {
        const target = $(e.target);
        target.prop('checked') ? $(`.${$(e.target).prop('id')}`).addClass('hidden') : $(`.${$(e.target).prop('id')}`).removeClass('hidden');
      }
    })
    .on('dblclick', e => {
      // Удаление картинки дабл кликом
      if (~e.target.className.indexOf('images-item')) {
        $(e.target).remove()
      }
    })
    // Кнопки клавиатуры
    .on('keydown', e => {
      // Показ панели редактирования (ctrl + 4)
      if (e.ctrlKey && e.keyCode === 52) {
        e.preventDefault();
        if (htmlUrl)
          document.designMode = document.querySelector('header').classList.contains('hidden') ? 'on' : 'off';
        $('.needHidden').toggleClass('hidden')
      }
      // Сохранение файла (ctrl + s)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        saveAsHtml(htmlFileName)
      }
    })
    .on('click', function (e) {
      // Сохранить как фр шаблон
      if (~e.target.className.indexOf('saveAsFr')) {
        saveAsHtml(`patterns/french/${pathName}.html`)
      }
      // Сохранить как ит шаблон
      if (~e.target.className.indexOf('saveAsIt')) {
        saveAsHtml(`patterns/italian/${pathName}.html`)
      }
      // Сохранить как нем шаблон
      if (~e.target.className.indexOf('saveAsDe')) {
        saveAsHtml(`patterns/german/${pathName}.html`)
      }
      // Сохранить как нем шаблон
      if (~e.target.className.indexOf('saveAsFlyer')) {
        saveAsHtml(`patterns/flyers/${pathName}.html`)
      }
      // Кнопка сохранить файл
      if (~e.target.className.indexOf('saveAsHtml')) {
        saveAsHtml(htmlFileName)
      }
      // Кнопка сохранить файл как
      if (~e.target.className.indexOf('saveAsOtherHtml')) {
        createNewFile()
      }
      // Установить титульную страницу
      if (~e.target.className.indexOf('setMainPage')) {
        setMainPage();
      }
      // Кнопка сохранить как пдф
      if (~e.target.className.indexOf('saveAsPdf')) {
        loading(true);
        saveAsHtml(htmlFileName);
        saveAsPdf()
      }

      if (~e.target.className.indexOf('dayMoveDown')) {
        let target = $(e.target);
        let item = $(e.target).closest('.program-days-item');
        let nextItem = item.next();
        if (nextItem.length) {
          nextItem.after(item)
        }
      }

      if (~e.target.className.indexOf('dayMoveUp')) {
        let item = $(e.target).closest('.program-days-item');
        let beforeItem = item.prev();
        if (beforeItem.length) {
          beforeItem.before(item)
        }
      }

      if (~e.target.className.indexOf('addDayBefore')) {
        $(e.target).closest('.program-days-item').before(addNewDay())
      }

      if (~e.target.className.indexOf('addDayAfter')) {
        $(e.target).closest('.program-days-item').after(addNewDay())
      }

      if (~e.target.className.indexOf('hideDay')) {
        const target = $(e.target);
        const item = target.closest('.program-days-item');
        const hideBlock = item.children().last();
        if (hideBlock.hasClass('hideActivated')) {
          hideBlock.removeClass('hideActivated');
          item.css('margin-bottom', '50px');
          target.html('&#8743;');
          target.prop('title', 'Свернуть день');
          hideBlock.show(300);
        } else {
          hideBlock.addClass('hideActivated');
          item.css('margin-bottom', '0');
          target.html('&#8744;');
          target.prop('title', 'Развернуть день');
          hideBlock.hide(300);
        }
      }

      if (~e.target.className.indexOf('deleteDay')) {
        if (!confirm('Вы уверены, что хотите удалить день?')) return;
        $(e.target).closest('.program-days-item').remove();
      }

      if (~e.target.className.indexOf('close-btn')) {
        const elements = $('.elements input');
        const parent = $(e.target).offsetParent().parent();
        parent.prop('class').split(' ').forEach(a => {
          [...elements].forEach(b => {
            if ($(b).prop('id') === a) {
              $(b).prop('checked', true);
              parent.addClass('hidden')
            }
          })
        });
      }

      // Кнопка добавить день
      if (~e.target.className.indexOf('addNewDay')) {
        $('.program-days').append(addNewDay());
        setMessage('День добавлен');
      }

      // Добавление что включено
      if (~e.target.className.indexOf('contain-add-check')) {
        const target = $(e.target);
        const num = target.hasClass('1') ? 1 : 2;
        const children = target.closest('.program-contain').children();
        $(children[num]).find('.program-contain-item-text').append(`<span>Текст</span>`)
      }

      // Добавление что не включено
      if (~e.target.className.indexOf('contain-add-text')) {
        const target = $(e.target);
        target.prop('disabled', true);
        $(target.closest('.program-contain')).append(`<div class="contain-textarea">
                                <div class="close" onclick="$(this).parent().remove(); $('.contain-add-text').prop('disabled', false)">x</div>
                                <div class="form-group">
                                  <label for="exampleFormControlTextarea1">Вставьте текст</label>
                                  <textarea class="form-control" id="exampleFormControlTextarea1" rows="10"></textarea>
                                </div>
                                <button class="contain-textarea-submit 1 btn btn-success">Вставить к галочкам</button>
                                <button class="contain-textarea-submit 2 btn btn-success">Вставить к крестикам</button>
                               </div>`)
      }

      // Добавление строки в таблицу цен
      if (~e.target.className.indexOf('contain-textarea-submit')) {
        const target = $(e.target);
        const num = target.hasClass('1') ? 1 : 2;
        const children = target.closest('.program-contain').children();
        const val = target.parent().find('textarea').val();
        if (!val) return;
        const arrVal = val.split('\n');
        $(children[num]).find('.program-contain-item-text').html(arrVal.map(a => `<span>${a}</span>`))

        target.parent().remove();
        $('.contain-add-text').prop('disabled', false)
      }

      // Добавление таблицы с ценами
      if (~e.target.className.indexOf('add-new-table')) {
        const target = $(e.target).closest('.program-price');
        target.before(target.clone())
      }

      // Добавление строки в таблицу цен
      if (~e.target.className.indexOf('add-price-row')) {
        $(e.target).closest('.program-price').find('.program-price-desc-item').append(`<span>Текст</span>`)
      }

      // Добавление строки в таблицу цен
      if (~e.target.className.indexOf('add-center-row')) {
        $(e.target).closest('.program-price').find('.program-price-desc').append(`<div class="program-price-desc-center-row">Текст</div>`)
      }

      // Добавление столбца в таблицу цен
      if (~e.target.className.indexOf('add-price-col')) {
        const tg = $(e.target);
        const target = tg.closest('.program-price');
        if (target.find('.program-price-desc-item').length >= 4) {
          let int = setInterval(() => {
            if (target.find('.program-price-desc-item').length < 4) {
              $(tg.removeClass('disabled'));
              tg.text('Столбец');
              clearInterval(int)
            }
          }, 500)
          $(tg.addClass('disabled'));
          tg.text('Максимум');
          return
        }
        target.find('.program-price-desc').append(target.find('.program-price-desc-item:nth-child(2)').clone())
      }
    });

  // Удаление старых кнопок
  function removeAllBtn() {
    for (let i = 0; i < arguments.length; i++) {
      $(arguments[i]).remove()
    }
  }

  $('.program-price').prepend(`<div class="needHidden price-btn">
              <button class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Действие
              </button>
              <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                <button class="add-center-row mr-1 btn btn-success dropdown-item">Строку по центру</button>
                <button class="add-price-row mr-1 btn btn-success dropdown-item">Строка</button>
                <button class="add-price-col btn btn-success dropdown-item">Столбец</button>
                <button class="add-new-table btn btn-success dropdown-item">Еще таблицу</button>
                <button class="btn btn-success dropdown-item" onclick="if($('.program-price').length > 1) $(this).closest('.program-price').remove()">Удалить таблицу</button>
              </div>
             </div>`);

  $('.program-days-item').prepend(addBtnInDay());


  function addBtnInDay() {
    return `<div class="needHidden day-menu-btns">
              <button class="hideDay mr-1 btn btn-outline-dark">&#8743;</button> 
              <button class="dayMoveDown mr-1 btn btn btn-secondary" title="Передвинуть день ниже">&#8595;</button>
              <button class="dayMoveUp mr-1 btn btn btn-secondary" title="Передвинуть день выше">&#8593;</button>
              <button class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Действие
              </button>
              <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                <button class="addDayBefore btn btn-success dropdown-item">Добавить день до</button>
                <button class="addDayAfter btn btn-success dropdown-item">Добавить день после</button>
                <button class="deleteDay btn btn-danger dropdown-item">Удалить день</button>
              </div>
             </div>`

  }

  $('.program-contain').prepend(`<div class="needHidden contain-menu-btns">
              <button class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Действие
              </button>
              <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                <button class="contain-add-check 1 btn btn-danger dropdown-item">Добавить галочки</button>
                <button class="contain-add-check 2 btn btn-danger dropdown-item">Добавить крестики</button>
                <button class="contain-add-text btn btn-danger dropdown-item">Добавить текст</button>
              </div>
            </div>`)

  !function btnHideDayText() {
    $('.program-days-item').each((i, a) => {
      const btn = $(a).find('.hideDay');
      if ($(a).find('.program-days-item-text').hasClass('hideActivated')) {
        btn.html('&#8744;');
        btn.prop('title', 'Развернуть день');
      } else {
        btn.html('&#8743;');
        btn.prop('title', 'Свернуть день');
      }
    })
  }();


  if ($('.second-page').length) $('.second-page').load('/profile .manager-contacts', {limit: 1});

  $('.program-end, .program-thanks, .program-remarque, .program-rule, .first-page, .second-page').append(`
    <div class="close-block needHidden">
      <button class="btn close" type="button" aria-label="Close">
        <span aria-hidden="true" class="close-btn">&times;</span>
      </button>
    </div>`);

  // Добавление нового дня
  function addNewDay() {
    let a = $('.program-days-item');
    return `<div class="program-days-item height">
              ${addBtnInDay()}
              <div class="program-days-item-header">
                <div class="program-days-item-header-count">
                  Jour ${a.length + 1}
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
                </div>
                <div class="desc">
                  <p>Текст</p>
                  <input type="file" multiple="" accept="image/*" class="loadFile needHidden" style="position: absolute;">
                  <div class="desc-images">
                  </div>
                </div>
              </div>
            </div>`;
  }

  if (htmlUrl) {
    !function () {
      const target = $('.belay-item-btn');
      if (!target.length) return;
      const targetText = target[0].textContent;
      if (target.children().length === 0) {
        target.html(`<a href="https://russieautrement.com/assurance-voyage/" target="_blank">${targetText}</a>`)
      }
    }()
  }

});