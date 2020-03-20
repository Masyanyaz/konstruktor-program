export const flyers = () => {
  return `<div>
            <button class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Флаеры
            </button>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
              <button class="dropdown-item">
                <label style="margin: 0;">
                  Вставить карту
                  <input type="file" class="setBgImageFlyer" style="display: none;" accept="image/*">
                </label>
              </button>
            </div>
          </div>`
};