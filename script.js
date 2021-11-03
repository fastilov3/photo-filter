const filters = document.querySelector('.filters');
const resetBtn = document.querySelector('.btn-reset');
const nextPictureBtn = document.querySelector('.btn-next');
const fullScreenBtn = document.querySelector('.fullscreen');
const fileInput = document.querySelector('.btn-load--input');
const downloadBtn = document.querySelector('.btn-save');
const canvas = document.querySelector('canvas');
const editorBtns = document.querySelectorAll('.btn');

let pos = 0;

filters.addEventListener('input', filtersHandler);
resetBtn.addEventListener('click', toResetFilters);
nextPictureBtn.addEventListener('click', nextPictureHandler);
fullScreenBtn.addEventListener('click', activateFullScreen);
fileInput.addEventListener('change', toLoadPicture);
downloadBtn.addEventListener('click', toDownloadPicture);
editorBtns.forEach((el, idx, arr) => {
  el.addEventListener('click', () => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].matches('.btn-active')) arr[i].classList.remove('btn-active');
    }
    el.classList.add('btn-active');
  })
})


function filtersHandler(e) {
  const suffix = e.target.dataset.sizing || '';
  document.documentElement.style.setProperty(`--${e.target.name}`, e.target.value + suffix);
  e.target.nextElementSibling.value = e.target.value;
}

function toResetFilters() {
  const filtersInputs = document.querySelectorAll('.filters__input');

  for (let i = 0; i < filtersInputs.length; i++) {
    const suffix = filtersInputs[i].dataset.sizing || '';

    filtersInputs[i].value = 0;
    filtersInputs[i].nextElementSibling.value = 0;
    if (filtersInputs[i].name === 'saturate') {
      filtersInputs[i].value = 100;
      filtersInputs[i].nextElementSibling.value = 100;
    }

    document.documentElement.style.setProperty(`--${filtersInputs[i].name}`, filtersInputs[i].value + suffix);
  }
}

function nextPictureHandler() {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= 0 && hours < 6) setCurrentLinkForImg('night');
  if (hours >= 6 && hours < 12) setCurrentLinkForImg('morning');
  if (hours >= 12 && hours < 18) setCurrentLinkForImg('day');
  if (hours >= 18 && hours < 24) setCurrentLinkForImg('evening');
}

function setCurrentLinkForImg(timesOfDay) {
  const img = document.querySelector('img');

  if (pos < 21) {
    pos++;
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timesOfDay}/${(pos)}.jpg`;
    if (pos.toString().length !== 2) img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timesOfDay}/${('0' + pos)}.jpg`;
  }

  if (pos === 20) pos = 0;
}

function toLoadPicture() {
  const img = document.querySelector('img');
  const file = fileInput.files[0];
  const reader = new FileReader();
  fileInput.value = '';

  reader.onload = () => {
    img.src = reader.result;
  }

  reader.readAsDataURL(file);
}

function drawImage() {
  const canvasImg = new Image();
  const img = document.querySelector('img');
  const outputs = document.querySelectorAll('output');

  canvasImg.setAttribute('crossOrigin', 'anonymous');
  canvasImg.src = img.src;
  canvasImg.onload = () => {
    canvas.width = canvasImg.width;
    canvas.height = canvasImg.height;
    const coef = (canvas.height / img.height).toFixed(1);
    const ctx = canvas.getContext("2d");
    ctx.filter = `blur(${outputs[0].value*coef}px) invert(${outputs[1].value}%) sepia(${outputs[2].value}%) saturate(${outputs[3].value}%) hue-rotate(${outputs[4].value}deg)`;
    ctx.drawImage(canvasImg, 0, 0);
  };
}

function toDownloadPicture() {
  drawImage()
  setTimeout(() => {
    const link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  }, 500)
}

function activateFullScreen() {
  if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  else if (document.documentElement.mozRequestFullScreen) document.documentElement.mozRequestFullScreen();
  else if (document.documentElement.webkitRequestFullscreen) document.documentElement.webkitRequestFullscreen();
  else if (document.documentElement.msRequestFullscreen) document.documentElement.msRequestFullscreen();

  if (document.exitFullscreen) document.exitFullscreen();
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
}