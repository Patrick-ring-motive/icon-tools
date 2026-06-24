

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
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <filter id="hue">
      <feColorMatrix type="hueRotate" values="180"/>
    </filter>
  </defs>

  <text
    x="50%"
    y="45%"
    font-size="60"
    text-anchor="middle"
    dy=".3em"
    filter="url(#hue)"
  >${icon}</text>
</svg>`;
}

const decodeU = x =>{
  try{
    return decodeURIComponent(x);
  }catch{
    return x;
  }
};

function dataURI(options){
  const {content,mime,base64} = options;
  return `data:${mime}${base64?';base64':''},${encodeURIComponent(decodeU(content))}`;
}

const svg = (dataURI({content:svgIcon('🐢'),mime:'image/svg+xml'}));
setFavicon(svg)
