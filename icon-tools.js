

  function setFavicon(url) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = url;
  }

function svgIcon(icon,rotate=0){
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <filter id="hue">
      <feColorMatrix type="hueRotate" values="${rotate}"/>
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

function getEmojiColor(emoji, options = {}) {
  const {
    size = 128,
    font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`,
    background = null
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);
  }

  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, size / 2, size / 2);

  const { data } = ctx.getImageData(0, 0, size, size);

  let r = 0, g = 0, b = 0, count = 0;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 80) continue;

    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  if (!count) return null;

  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  return {
    rgb: [r, g, b],
    css: `rgb(${r}, ${g}, ${b})`,
    hex: "#" + [r, g, b]
      .map(x => x.toString(16).padStart(2, "0"))
      .join("")
  };
}

const svg = (dataURI({content:svgIcon('🐢',90),mime:'image/svg+xml'}));
setFavicon(svg)
