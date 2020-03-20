import {getCookie} from "@/js/functions";
import {header} from "@/js/admin/header";
import {flyers} from "@/js/admin/flyers";

function loading() {
  return `<div class="adminPanel-result">
            <div class="message"><p style="font-size: 12px;">Привет)</p></div>
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
          </div>`
}

function menu() {
  return `<div>
            <button class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Меню
            </button>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
              <button class="addNewDay dropdown-item">Добавить день</button>
              ${!document.querySelectorAll('.first-page').length ?
    `<button class="setMainPage dropdown-item">Добавить главную страницу</button>` :
    `<button class="dropdown-item">
                    <label style="margin: 0;">
                      Картинка на главную страницу
                      <input type="file" class="setBgImageFirstPage" style="display: none;" accept="image/*">
                    </label>
                  </button>`
  }
              <button class="saveAsHtml dropdown-item" title="ctrl + s">Сохранить файл</button>
              <button class="saveAsOtherHtml dropdown-item">Сохранить как</button>
              <button class="saveAsPdf dropdown-item">Сохранить как pdf</button>
            </div>
          </div>`
}

function elements() {
  return `<div class="elements">
            <button class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Скрыть ненужные блоки">
              Элементы 
            </button>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1" style="padding: .5rem 10px;">
              ${document.querySelectorAll('.first-page').length ?
    `<div class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" id="first-page" ${document.querySelector('.first-page').classList.contains('hidden') ? 'checked' : ''}>
                  <label class="custom-control-label" for="first-page">Главная</label>
                </div>
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" id="second-page" ${document.querySelector('.second-page').classList.contains('hidden') ? 'checked' : ''}>
                  <label class="custom-control-label" for="second-page">Контакты</label>
                </div>` : ''
  }
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="program-end" ${document.querySelector('.program-end').classList.contains('hidden') ? 'checked' : ''}>
                <label class="custom-control-label" for="program-end">Конец услуг</label>
              </div>
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="program-thanks" ${document.querySelector('.program-thanks').classList.contains('hidden') ? 'checked' : ''}>
                <label class="custom-control-label" for="program-thanks">Страховка</label>
              </div>
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="program-remarque" ${document.querySelector('.program-remarque').classList
                                                                                                    .contains('hidden') ? 'checked' : ''}>
                <label class="custom-control-label" for="program-remarque">Замечания</label>
              </div>
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="program-rule" ${document.querySelector('.program-rule').classList.contains('hidden') ? 'checked' : ''}>
                <label class="custom-control-label" for="program-rule">Условия</label>
              </div>
            </div>
          </div>`
}

function other() {
  return `<div>
            <button class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Другое
            </button>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
              <a href="/" class="dropdown-item" title="Перейти на главную страницу" target="_blank">Главная</a>
              <a href="/all" class="dropdown-item" title="Перейти ко всем программам" target="_blank">Все программы</a>
              <a href="/news" class="dropdown-item" title="Перейти к новостям" target="_blank">Новости</a>
              <a href="/${getCookie('id') ? 'profile' : 'register'}" class="dropdown-item" target="_blank">${getCookie('id') ? 'Профиль' : 'Регистрация'}</a>
              <a href="/${getCookie('id') ? 'logout.php' : 'login'}" class="dropdown-item" target="_blank">${getCookie('id') ? 'Выйти' : 'Войти'}</a>
            </div>
          </div>`
}

function patterns() {
  return `<div>
            <button class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Шаблоны
            </button>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
              <button class="saveAsFr dropdown-item">Сохранить как франзуский шаблон</button>
              <button class="saveAsIt dropdown-item">Сохранить как итальянский шаблон</button>
              <button class="saveAsDe dropdown-item">Сохранить как немецкий шаблон</button>
              <button class="saveAsFlyer dropdown-item">Сохранить как шаблон флаера</button>
            </div>
          </div>`
}

function bottomMessage() {
  return `<div style="margin-top: 15px;font-size: 12px;">
            
          </div>`
}


export function adminPanel() {
  return `${header()}
            <div class="adminPanel needHidden hidden">
              ${loading()}
              ${menu()}
              ${document.querySelectorAll('.first-page').length ? elements() : ''}
              ${other()}
              ${patterns()}
              ${flyers()}
              ${bottomMessage()}
            </div>`
}

