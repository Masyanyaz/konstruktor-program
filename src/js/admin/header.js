export const header = () => {
  return `<header class="adminHeader needHidden hidden">
  <div class="btn-group mr-2">
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('undo')"
      title="Отменить"
    >
      <img src="/static/header/undo-solid.svg" alt="" width="12" height="12">
    </button>
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('redo')"
      title="Повторить"
    >
      <img src="/static/header/redo-solid.svg" alt="" width="12" height="12">
    </button>
  </div>
  <div class="btn-group mr-2">
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('bold')"
      title="Жирный"
    >
      <img src="/static/header/bold-solid.svg" alt="" width="12" height="12">
    </button>
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('italic')"
      title="Курсив"
    >
      <img src="/static/header/italic-solid.svg" alt="" width="12" height="12">
    </button>
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('underline')"
      title="Подчеркнутый"
    >
      <img src="/static/header/underline-solid.svg" alt="" width="12" height="12">
    </button>
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('strikeThrough')"
      title="Зачеркнутый"
    >
      <img src="/static/header/strikethrough-solid.svg" alt="" width="12" height="12">
    </button>
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('superscript')"
      title="Надстрочный индекс"
    >
      <img src="/static/header/superscript-solid.svg" alt="" width="12" height="12">
    </button>
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('subscript')"
      title="Подстрочный индекс"
    >
      <img src="/static/header/subscript-solid.svg" alt="" width="12" height="12">
    </button>
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('removeFormat')"
      title="Убрать форматирование"
    >
      <img src="/static/header/remove-format-solid.svg" alt="" width="12" height="12">
    </button>
  </div>
  <div class="btn-group mr-2">
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('justifyLeft')"
      title="Выравнивание по левому краю"
    >
      <img src="/static/header/align-left-solid.svg" alt="" width="12" height="12">
    </button>
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('justifyCenter')"
      title="Выравнивание по центру"
    >
      <img src="/static/header/align-center-solid.svg" alt="" width="12" height="12">
    </button>
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('justifyRight')"
      title="Выравнивание по правому краю"
    >
      <img src="/static/header/align-right-solid.svg" alt="" width="12" height="12">
    </button>
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('justifyFull')"
      title="Выравнивание по ширине"
    >
      <img src="/static/header/align-justify-solid.svg" alt="" width="12" height="12">
    </button>
  </div>
  <div class="btn-group mr-2">
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('createLink', false, prompt('Вставьте ссылку'))"
      title="Вставить ссылку"
    >
      <img src="/static/header/link-solid.svg" alt="" width="12" height="12">
    </button>
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('unlink')"
      title="Удалить ссылку"
    >
      <img src="/static/header/unlink-solid.svg" alt="" width="12" height="12">
    </button>
  </div>
  <div class="btn-group mr-2">
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('insertOrderedList')"
      title="Нумерованный список"
    >
      <img src="/static/header/list-ol-solid.svg" alt="" width="12" height="12">
    </button>
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('insertUnorderedList')"
      title="Маркерованный список"
    >
      <img src="/static/header/list-ul-solid.svg" alt="" width="12" height="12">
    </button>
    <button
      type="button"
      class="btn btn-light btn-sm"
      onclick="document.execCommand('insertHorizontalRule')"
      title="Вставить горизонтальную линию"
    >
      <img src="/static/header/line-solid.svg" alt="" width="12" height="12">
    </button>
  </div>
  <div class="input-group-prepend mr-1">
    <button type="button" class="btn btn-light btn-sm" title="Установить цвет шрифта" onclick="document.execCommand('foreColor', false, this.nextElementSibling.children[0].value)">
      <img src="/static/header/palette-solid.svg" alt="" width="12" height="12">
    </button>
    <label type="button" class="btn btn-light btn-sm dropdown-toggle dropdown-toggle-split" title="Выбрать цвет текста">
      <input type="color" onchange="document.execCommand('foreColor', false, this.value);" style="display: none;" />
    </label>
  </div>
  <div class="input-group-prepend mr-2">
    <button type="button" class="btn btn-light btn-sm" title="Установить цвет фона" onclick="document.execCommand('backColor', false, this.nextElementSibling.children[0].value)">
      <img src="/static/header/fill-drip-solid.svg" alt="" width="12" height="12">
    </button>
    <label type="button" class="btn btn-light btn-sm dropdown-toggle dropdown-toggle-split" title="Выбрать цвет фона">
      <input type="color" onchange="document.execCommand('backColor', false, this.value);" style="display: none;" />
    </label>
  </div>
  <div class="input-group-prepend mr-1">
    <button type="button" class="btn btn-light btn-sm" title="Установить шрифт" onclick="document.execCommand('fontName', false, this.nextElementSibling.children[0].value)">
      <img src="/static/header/font-solid.svg" alt="" width="12" height="12">
    </button>
    <label type="button" class="btn btn-light" title="Выбрать шрифт">
      <select onchange="document.execCommand('fontName', false, this.value);" style="width: 160px;">
        <option value="Times New Roman">Times New Roman</option>
        <option value="Arial">Arial</option>
        <option value="Tahoma">Tahoma</option>
      </select>
    </label>
  </div>
  <div class="input-group-prepend mr-2">
    <button type="button" class="btn btn-light btn-sm" title="Установить размер шрифта" onclick="document.execCommand('fontSize', false, this.nextElementSibling.children[0].value)">
      <img src="/static/header/font-size-solid.svg" alt="" width="12" height="12">
    </button>
    <label type="button" class="btn btn-light" title="Выбрать размер шрифта">
      <select onchange="document.execCommand('fontSize', false, this.value);">
        <option value="1">10px</option>
        <option value="2">13px</option>
        <option value="3">16px</option>
        <option value="4">18px</option>
        <option value="5">24px</option>
        <option value="6">32px</option>
        <option value="7">48px</option>
      </select>
    </label>
  </div>
  <label type="button" class="btn btn-light" title="Переключить режим редактирования/чтения">
    <input type="checkbox" value="${document.designMode}" class="designMode" ${document.designMode === 'on' ? 'checked' : ''} style="display: none;" />
    Режим редактирования
  </label>
  <div style="margin-left: auto;">
    <a href="/news">Важно!!!</a>
  </div>
</header>
`
}