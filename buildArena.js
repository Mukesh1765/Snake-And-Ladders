let canvas, c;
const innerwidth = 600;
const innerheight = 600;

const setupCanvas = () => {
  canvas = document.querySelector("canvas");
  c = canvas.getContext("2d");

  canvas.width = innerwidth;
  canvas.height = innerheight;
};

const getContext = () => {
  if (!c) throw new Error("Canvas context not initialized. Call setupCanvas() first.");
  return c;
};

const number = (count, x, y, width, height) => {
  const ctx = getContext();
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textRendering = "optimizeLegibility";
  ctx.textBaseline = "middle";
  ctx.fillText(count, x + width/2, y + height/2);
  ctx.fill();
}

const drawRectangle = (x, y, width, height, color, count, diff) => {
  const ctx = getContext();
  if (count % 10 === 0) {
    diff -= 20;
  }

  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2.2;
  ctx.strokeRect(x, y, width, height);

  if ((count > 10 && Math.floor(count / 10) % 2 === 1 && count % 10 != 0) || (count % 10 == 0 && Math.floor(count / 10) % 2 === 0)) {
    number(count, x, y, width, height);
  } else {
    count = diff - count;
    number(count, x, y, width, height);
  }
  return diff;
}

const drawLadder = (x1, y1, x2, y2, x3, y3, x4, y4, rungCount) => {
    getContext().beginPath();
    getContext().moveTo(x1, y1);
    getContext().lineTo(x2, y2);
    getContext().lineWidth = 12;
    getContext().lineCap = "round";
    getContext().strokeStyle = "#8C5E58";
    getContext().stroke();

    getContext().beginPath();
    getContext().moveTo(x3, y3);
    getContext().lineTo(x4, y4);
    getContext().lineWidth = 12;
    getContext().lineCap = "round";
    getContext().strokeStyle = "#8C5E58";
    getContext().stroke();

    for(let i = 1; i < rungCount; i++){
        let t = i/rungCount;
        let rx1 = x1 + t*(x2 - x1);
        let ry1 = y1 + t*(y2 - y1);
        let rx2 = x3 + t*(x4 - x3);
        let ry2 = y3 + t*(y4 - y3);

        getContext().beginPath();
        getContext().moveTo(rx1, ry1);
        getContext().lineTo(rx2, ry2);
        getContext().lineWidth = 9;
        getContext().lineCap = "round";
        getContext().strokeStyle = "#8C5E58";
        getContext().stroke();
    }
}

const getLadder = (x1, y1, x2, y2, offset, rungCount) => {
    let dx = x2 - x1;
    let dy = y2 - y1;
    let length = Math.sqrt(dx * dx + dy * dy);

    let perpX = (offset * dy) / length;
    let perpY = (offset * dx) / length;

    let x1Above = x1 + perpX;
    let y1Above = y1 - perpY;
    let x2Above = x2 + perpX;
    let y2Above = y2 - perpY;

    let x1Below = x1 - perpX;
    let y1Below = y1 + perpY;
    let x2Below = x2 - perpX;
    let y2Below = y2 + perpY;

    drawLadder(x1Above, y1Above, x2Above, y2Above, x1Below, y1Below, x2Below, y2Below, rungCount);
}

const boxAndLadders = () => {
    let x = 0;
    let y = 0;
    
    let rectWidth = innerwidth/10;
    let rectHeight = innerheight/10;
    let xIncrease = innerwidth/10;
    let yIncrease = innerheight/10;

    let diff = 211;
    for(let i = 100; i > 0; i--){
        let color = ((x / rectWidth + y / rectHeight) % 2 === 0) ? "#3A5A40" : "#E1B07E";
        diff = drawRectangle(x, y, rectWidth, rectHeight, color, i, diff);
        x += xIncrease;
        if(x >= innerwidth){
            x = 0;
            y += yIncrease;
        }
    }

    diff = 211;

    getContext().beginPath();
    getContext().moveTo(0, 0);
    getContext().lineTo(innerwidth, 0);
    getContext().lineTo(innerwidth, innerheight);
    getContext().lineTo(0, innerheight);
    getContext().lineTo(0, 0);
    getContext().strokeStyle = "black";
    getContext().stroke();
    getContext().closePath();

    let halfWidth = rectWidth / 2;
    let halfHeight = rectHeight / 2;
    
    getLadder(rectWidth*0 + halfWidth, rectHeight*9 + halfHeight, rectWidth*2+halfWidth, rectHeight*6 + halfHeight, 20, 6);
    getLadder(rectWidth*3 + halfWidth, rectHeight*9 + halfHeight, rectWidth*6+halfWidth, rectHeight*8 + halfHeight, 20, 6);
    getLadder(rectWidth*8 + halfWidth, rectHeight*9 + halfHeight, rectWidth*9+halfWidth, rectHeight*6 + halfHeight, 20, 6);
    getLadder(rectWidth*0 + halfWidth, rectHeight*7 + halfHeight, rectWidth*1+halfWidth, rectHeight*5 + halfHeight, 20, 4);
    getLadder(rectWidth*7 + halfWidth, rectHeight*7 + halfHeight, rectWidth*3+halfWidth, rectHeight*1 + halfHeight, 20, 9);
    getLadder(rectWidth*4 + halfWidth, rectHeight*6 + halfHeight, rectWidth*3+halfWidth, rectHeight*5 + halfHeight, 20, 3);
    getLadder(rectWidth*9 + halfWidth, rectHeight*4 + halfHeight, rectWidth*7+halfWidth, rectHeight*3 + halfHeight, 20, 6);
    getLadder(rectWidth*9 + halfWidth, rectHeight*2 + halfHeight, rectWidth*9+halfWidth, rectHeight*0 + halfHeight, 20, 4);
    getLadder(rectWidth*0 + halfWidth, rectHeight*2 + halfHeight, rectWidth*1+halfWidth, rectHeight*0 + halfHeight, 20, 4);  
}

//snakes
const imageSrcs = [
  'images/snake2.png', 'images/snake3.png', 'images/snake4.png',
  'images/snake5.png', 'images/snake7.png', 'images/snake8.png',
  'images/snake10.png', 'images/snake1.png', 'images/snake9.png',
  'images/snake6.png'
];

const imagePositions = [
  { x: 30, y: 185, width: 190, height: 100 },
  { x: 39, y: 1, width: 150, height: 175 },
  { x: 215, y: 2, width: 150, height: 175 },
  { x: 470, y: 10, width: 125, height: 150 },
  { x: 10, y: 130, width: 143, height: 530 },
  { x: 200, y: 50, width: 200, height: 450 },
  { x: 90, y: 430, width: 350, height: 250 },
  { x: 500, y: 304, width: 90, height: 290 },
  { x: 329, y: 254, width: 150, height: 165 },
  { x: 174, y: 255, width: 190, height: 275 }
];

const images = imageSrcs.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

function loadImages() {
  const imagePromises = images.map(img => new Promise(resolve => {
    img.onload = resolve;
  }));
  return Promise.all(imagePromises);
}

function loadDrawImages() {
  const ctx = getContext();
  imagePositions.forEach(({ x, y, width, height }, i) => {
    ctx.drawImage(images[i], x, y, width, height);
  });
}

const loadAndDrawArena = async () => {
  await loadImages();
  boxAndLadders();
  loadDrawImages();
};

export { getContext, setupCanvas, boxAndLadders, loadDrawImages, loadAndDrawArena };