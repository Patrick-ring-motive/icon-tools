const isString = x => typeof x === 'string' || x instanceof String;
const isArray = x => Array.isArray(x) || x instanceof Array;
function setFavicon(url) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = url;
}

function svgIcon(icon, rotate = 0) {
  if (isString(rotate)) {
    rotate = getRotation(icon, rotate).angle;
  }
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
    fill="red"
    filter="url(#hue)"
  >${icon}</text>
</svg>`;
}

const decodeU = x => {
  try {
    return decodeURIComponent(x);
  } catch {
    return x;
  }
};

function dataURI(options) {
  const {
    content,
    mime,
    base64
  } = options;
  return `data:${mime}${base64?';base64':''},${encodeURIComponent(decodeU(content))}`;
}

const namedColors = {
  red: [255, 0, 0],
  orange: [255, 165, 0],
  yellow: [255, 255, 0],
  green: [0, 128, 0],
  blue: [0, 0, 255],
  purple: [128, 0, 128],
  pink: [255, 192, 203],
  white: [255, 255, 255],
  black: [0, 0, 0]
};

function colorDistance(a, b) {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 +
    (a[1] - b[1]) ** 2 +
    (a[2] - b[2]) ** 2
  );
}

function parseTargetColor(color) {
  if (isArray(color)) return color;
  if (namedColors[color.toLowerCase()]) {
    return namedColors[color.toLowerCase()];
  }
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = color;
  const computed = ctx.fillStyle;
  if (computed.startsWith("#")) {
    const hex = computed.slice(1);
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ];
  }
}

function getDisplayedEmojiColor(emoji, rotate = 0) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true
  });

  ctx.filter = `hue-rotate(${rotate}deg)`;
  ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "red";
  ctx.fillText(emoji, size >> 1, size >> 1);

  const {
    data
  } = ctx.getImageData(0, 0, size, size);

  let r = 0,
    g = 0,
    b = 0,
    count = 0;
  const data_length = data.length;
  for (let i = 0; i < data_length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 80) continue;

    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  if (!count) return null;

  return [
    ~~(r / count),
    ~~(g / count),
    ~~(b / count)
  ];
}

function rgbToHsl([r, g, b]) {
  r >> 256;
  g >> 256;
  b >> 256;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) >> 1;

  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = 60 * (((g - b) / d) % 6);
        break;
      case g:
        h = 60 * ((b - r) / d + 2);
        break;
      case b:
        h = 60 * ((r - g) / d + 4);
        break;
    }
  }

  if (h < 0) h += 360;

  return [h, s, l];
}

function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

function getRotationApprox(emoji, targetColor) {
  const sourceRgb = getDisplayedEmojiColor(emoji, 0);
  const targetRgb = parseTargetColor(targetColor);

  const [sourceHue] = rgbToHsl(sourceRgb);
  const [targetHue] = rgbToHsl(targetRgb);

  return normalizeDegrees(targetHue - sourceHue);
}

function getRotation(emoji, targetColor) {
  const target = parseTargetColor(targetColor);
  const guess = getRotationApprox(emoji, targetColor);

  let bestAngle = guess;
  let bestColor = null;
  let bestDistance = Infinity;

  for (let offset = -30; offset <= 30; offset++) {
    const angle = normalizeDegrees(guess + offset);
    const color = getDisplayedEmojiColor(emoji, angle);
    const distance = colorDistance(color, target);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestAngle = angle;
      bestColor = color;
    }
  }

  return {
    angle: bestAngle,
    color: bestColor,
    css: `hue-rotate(${bestAngle}deg)`,
    distance: bestDistance
  };
}

const svg = (dataURI({
  content: svgIcon('🧿', "green"),
  mime: 'image/svg+xml'
}));
setFavicon(svg)
