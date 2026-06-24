

  function setFavicon(url) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = url;
  }

function svgIcon(icon){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="45%" font-size="60" text-anchor="middle" dy=".3em">${icon}</text></svg>`;
}


function dataURI(options){
  const {content,mime,base64} = options;
  return `data:${mime}${base64?';base64':''},${content}`;
}

const svg = (dataURI({content:svgIcon('Q'),mime:'image/svg+xml'}));

let a = document.createElement('a');

a.href = svg;

a.click();
