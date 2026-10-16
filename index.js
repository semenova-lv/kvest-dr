/* в этот файл добавляет скрипты*/
// const URL = 'https://rutube.ru/play/embed/6b1064118ff99c99c0ad98e91a413163?autoplay=true&loop=false';
const URL = [
  '6b1064118ff99c99c0ad98e91a413163',
  '60706cd64b62d4eee0dda87a3d829003',
  'disco',
  'fc09fbb41a8ab4cdd75aeecdc0ab0d35',
  '91615ea3e46c2302670fc8a054bcd925',
  '391b736abb9b00e5a29cd67d7c13d5f3'
];
const video = document.querySelector('.video');
// const buttonPlay = video.querySelector('.video__button--fox');

function createIframe (id) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen');
  iframe.setAttribute('src', 'https://rutube.ru/play/embed/'.concat(URL[id], '?autoplay=true&loop=false'));
  // iframe.setAttribute('loading', 'lazy');
  // iframe.setAttribute('height', '170');
  // iframe.setAttribute('width', '320');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;');

  return iframe;
}

// function createButtonClose () {
//   const buttonClose = document.createElement('button');
//   buttonClose.setAttribute('style', 'position: absolute; top: 0; right: 0; width: 50px; height: 50px; z-index: 20;');

//   return buttonClose;
// }

// buttonPlay.addEventListener('click', ()=>{
//   const iframe = createIframe();
//   // const buttonClose = createButtonClose();
//   video.appendChild(iframe);
//   // video.appendChild(buttonClose);

//   // buttonClose.addEventListener('click', () => {
//   //   iframe.remove();
//   //   buttonClose.remove();
//   // });

video.addEventListener('click', (evt)=> {
  const currentButton = evt.target.closest('.video__button');
  if (currentButton) {
    const id = Number(currentButton.dataset.id);
    const iframe = createIframe(id);
    video.appendChild(iframe);
  }

  (function () {
    let finished = false;
    const iframe = document.querySelector('iframe');
    window.addEventListener('message', (event) => {
    // Принимаем сообщения только от Rutube
      if (event.origin !== 'https://rutube.ru') {
        return;
      }
      if (finished) {
        return;
      }

      let message;

      try {
        message = typeof event.data === 'string'
          ? JSON.parse(event.data)
          : event.data;
      } catch (e) {
        return;
      }

      if (
        message.type === 'player:playComplete' ||
        (
          message.type === 'player:changeState' &&
          message.data &&
          message.data.state === 'stopped'
        )
      ) {
        finished = true;

        // Останавливаем плеер
        iframe.contentWindow.postMessage(
          JSON.stringify({
            type: 'player:stop',
            data: {}
          }),
          'https://rutube.ru'
        );

        // Удаляем iframe
        iframe.remove();
      }
    });
  })();
});
