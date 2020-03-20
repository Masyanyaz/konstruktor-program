// Получить куки
export function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export const f = () => new Promise((res, rej) => {
  setTimeout(() => res('asd'), 2000)
});

const message = document.querySelector('.message');

export const loading = (payload = false) => {
  const element = document.querySelector('#fountainTextG');

  payload ? element.css('display', 'block') : element.css('display', 'none');
  !payload ? message.css('display', 'block') : message.css('display', 'none')
};

export const l = name => console.log(name);