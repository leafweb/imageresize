var body = document.body;
var preview = document.querySelector('#preview');
var sizePreview = document.querySelector('#size-preview');
var widthPreview = document.querySelector('#width-preview');
var heightPreview = document.querySelector('#height-preview');
var sizes = document.querySelector('#sizes');
var file = document.querySelector('#file');
var download = document.querySelector('#download');
var rangeSize = document.querySelector('#range-size');
var upload = document.querySelector('#upload');
var width = document.querySelector('#width');
var height = document.querySelector('#height');
var warn = document.querySelector('#warn');

var mode = eval(localStorage.getItem('darkMode'));
if (mode == undefined) {
   mode = false;
   localStorage.setItem('darkMode', mode);
}
var M = Mushroom();
M.setColor('hsl(0,0%,100%)');
M.setDarkmode(mode);
body.style.backgroundImage = (mode) ? 'url(/image/bg-dark.png)' : 'url(/image/bg-light.png)';
function Darkmode() {
   M.toggleMode();
   localStorage.setItem('darkMode', M.darkmode);
   body.style.backgroundImage = (M.darkmode) ? 'url(/image/bg-dark.png)' : 'url(/image/bg-light.png)';
}

file.onchange = () => {
   var reader = new FileReader();
   reader.readAsDataURL(file.files[0])
   reader.onload = () => {
      var data = reader.result;
      var img = new Image();
      img.src = data;
      img.onload = () => {
         var [w, h] = [img.width, img.height];
         widthPreview.innerHTML = `${w}px`;
         heightPreview.innerHTML = `${h}px`;
         preview.innerHTML = `<svg viewbox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><image href="${data}" width="${w}" height="${h}"/></svg>`;
         var size = ((data.length*(w+h)/2)/10000000).toFixed(1);
            if (size > 1000 || w > 10001 || h > 10001) {
               warn.classList.add('on');
            } else {
               warn.classList.remove('on');
            }
         rangeSize.oninput = () => {
            var [w2, h2] = [parseInt(w * rangeSize.value), parseInt(h * rangeSize.value)];
            widthPreview.innerHTML = `${w2}px`;
            heightPreview.innerHTML = `${h2}px`;
            width.value = w2;
            height.value = h2;
            var size = ((data.length*(w2+h2)/2)/10000000).toFixed(1);
            if (size > 1000 || w2 > 10001 || h2 > 10001) {
               warn.classList.add('on');
            } else {
               warn.classList.remove('on');
            }
         }
         width.oninput = () => {
            var [w2, h2] = [width.value, parseInt(width.value*h/w)];
            widthPreview.innerHTML = `${w2}px`;
            heightPreview.innerHTML = `${h2}px`;
            height.value = h2;
            var size = ((data.length*(w2+h2)/2) / 10000000).toFixed(1);
            if (size > 1000 || w2 > 10001 || h2 > 10001) {
               warn.classList.add('on');
            } else {
               warn.classList.remove('on');
            }
         }
         height.oninput = () => {
            var [w2, h2] = [parseInt(height.value*w/h), height.value];
            widthPreview.innerHTML = `${w2}px`;
            heightPreview.innerHTML = `${h2}px`;
            width.value = w2;
            var size = ((data.length*(w2+h2)/2) / 10000000).toFixed(1);
            if (size > 1000 || w2 > 10001 || h2 > 10001) {
               warn.classList.add('on');
            } else {
               warn.classList.remove('on');
            }
         }
      }
      sizePreview.classList.add('on');
      download.classList.add('on');
      preview.classList.add('on');
      upload.classList.add('on');
      sizes.classList.add('on');
   }
}

function Download(){
  const canvas = document.createElement("canvas");
  const svg = document.querySelector('svg');
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const w = parseInt(widthPreview.innerHTML.replace('px',''));
  const h = parseInt(heightPreview.innerHTML.replace('px',''));
  const img = new Image();
  img.src = 'data:image/svg+xml;base64,' + base64doc;
  img.onload = function () {
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    const context = canvas.getContext("2d");
    context.drawImage(img,0,0,w,h);
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
      a.download = 'download.png';
      a.href = dataURL;
      a.click();
  }
}

download.addEventListener('click', Download);