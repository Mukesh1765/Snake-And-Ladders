const canvas = document.querySelector("canvas");
const image = document.getElementById("dice_image");
const dValue = document.getElementById("diceValue");
const scriptTag = document.getElementsByTagName("script");
const conatiner = document.getElementById("bgimage");
const element1 = document.getElementById("rollDice");
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
let innerwidth = "600";
let innerheight = "600";
canvas.height = innerheight;
canvas.width = innerwidth;
let c = canvas.getContext("2d");
let player1Position = 99;
let player2Position = 99;
let diceNumber = 0;
let previousPlayer = 1;
let whoseChance = 1;
let winner = null;
const normalDuration = 1500;
let extraDuration = 2000;

const player1Colour = {
    starColor : "#32CD32",
    circleColor : "#000080"
}
const player2Colour = {
    starColor : "#FFD700",
    circleColor : "#008080"
}
let previousPosition1 = {
    x : 30,
    y : 570
}
let currentPosition1 = {
    x : null,
    y : null
}

let previousPosition2 = {
    x : 30,
    y : 570
}
let currentPosition2 = {
    x : null,
    y : null
}

let middleCordinate = { 
    x : null,
    y : null
}

function boxAndLadders(c, innerwidth, innerheight) {
    let x = 0;
    let y = 0;
    let diff = 211;
    function number(count, x, y, width, height){
        c.fillStyle = "black";
        c.font = "20px Arial";
        c.textAlign = "center";
        c.textRendering = "optimizeLegibility";
        c.textBaseline = "middle";
        c.fillText(count, x + width/2, y + height/2);
        c.fill();
    }
    class rectangle {
        constructor(x, y, width, height, color, count) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.count = count;
            if(this.count % 10 === 0){
                diff -= 20;
            }
        }
        draw() {
            c.fillStyle = this.color;
            c.fillRect(this.x, this.y, this.width, this.height);
            c.strokeStyle = "black";
            c.lineWidth = 2.2;
            c.strokeRect(this.x, this.y, this.width, this.height);
            if((this.count <= 100 && this.count > 90) || (this.count <= 80 && this.count > 70) || (this.count <= 60 && this.count > 50) || (this.count <= 40 && this.count > 30) || (this.count <= 20 && this.count > 10)){
                number(this.count, this.x, this.y, this.width, this.height);
            }
            else {
                this.count = diff - this.count;
                number(this.count, this.x, this.y, this.width, this.height);
            }
        }
    }
    let rectWidth = innerwidth/10;
    let rectHeight = innerheight/10;
    let xIncrease = innerwidth/10;
    let yIncrease = innerheight/10;
    let count = 100;
    function drawRectangles(){
        let color = ((x / rectWidth + y / rectHeight) % 2 === 0) ? "#3A5A40" : "#E1B07E";
        let rect = new rectangle(x, y, rectWidth, rectHeight, color, count);
        rect.draw();
        x += xIncrease;
        if(x >= innerwidth){
            x = 0;
            y += yIncrease;
        }
        count--;
    }
    for(let i = 0; i < 100; i++){
        drawRectangles();
    }

    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(innerwidth, 0);
    c.lineTo(innerwidth, innerheight);
    c.lineTo(0, innerheight);
    c.lineTo(0, 0);
    c.strokeStyle = "black";
    c.stroke();
    c.closePath();

    function drawLadder(x1, y1, x2, y2, x3, y3, x4, y4, rungCount) {
        c.beginPath();
        c.moveTo(x1, y1);
        c.lineTo(x2, y2);
        c.lineWidth = 12;
        c.lineCap = "round";
        c.strokeStyle = "#8C5E58";
        c.stroke();
    
        c.beginPath();
        c.moveTo(x3, y3);
        c.lineTo(x4, y4);
        c.lineWidth = 12;
        c.lineCap = "round";
        c.strokeStyle = "#8C5E58";
        c.stroke();
    
        for(let i = 1; i < rungCount; i++){
            let t = i/rungCount;
            let rx1 = x1 + t*(x2 - x1);
            let ry1 = y1 + t*(y2 - y1);
            let rx2 = x3 + t*(x4 - x3);
            let ry2 = y3 + t*(y4 - y3);
    
            c.beginPath();
            c.moveTo(rx1, ry1);
            c.lineTo(rx2, ry2);
            c.lineWidth = 9;
            c.lineCap = "round";
            c.strokeStyle = "#8C5E58";
            c.stroke();
        }
    }
    
    function getLadder(x1, y1, x2, y2, offset, rungCount) {
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

const imgSrcs = [
    'snake2.png', 'snake3.png', 'snake4.png', 'snake5.png', 'snake7.png', 
    'snake8.png', 'snake10.png', 'snake1.png', 'snake9.png', 'snake6.png'
];

const images = imgSrcs.map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

function loadImages() {
    const imagePromises = images.map(img => new Promise(resolve => {
        console.log(resolve);
        img.onload = resolve;
    }));
    console.log(imagePromises);
    return Promise.all(imagePromises);
}

function drawStaticImages() {
    c.drawImage(images[0], 30, 185, 190, 100);
    c.drawImage(images[1], 39, 1, 150, 175);
    c.drawImage(images[2], 215, 2, 150, 175);
    c.drawImage(images[3], 470, 22, 125, 150);
    c.drawImage(images[4], 10, 130, 143, 530);
    c.drawImage(images[5], 200, 50, 200, 450);
    c.drawImage(images[6], 90, 430, 350, 250);
    c.drawImage(images[7], 500, 304, 90, 290);
    c.drawImage(images[8], 329, 254, 150, 165);
    c.drawImage(images[9], 170, 240, 190, 285);
}

function drawStarInCircle(ctx, x, y, radius, starColor, circleColor) {
    const spikes = 5; 
    const outerRadius = radius * 0.6; 
    const innerRadius = radius * 0.3; 

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = circleColor;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    let rotation = Math.PI / 2 * 3;  
    let step = Math.PI / spikes; 

    ctx.moveTo(x, y - outerRadius);
    for (let i = 0; i < spikes; i++) {
        let xOuter = x + Math.cos(rotation) * outerRadius;
        let yOuter = y + Math.sin(rotation) * outerRadius;
        ctx.lineTo(xOuter, yOuter);
        rotation += step;

        let xInner = x + Math.cos(rotation) * innerRadius;
        let yInner = y + Math.sin(rotation) * innerRadius;
        ctx.lineTo(xInner, yInner);
        rotation += step;
    }
    ctx.closePath();
    ctx.fillStyle = starColor;
    ctx.fill();
}

function moveStar(startX, startY, endX, endY, radius, starColor, circleColor, duration) {
    const startTime = performance.now();

    function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;

        c.clearRect(0, 0, canvas.width, canvas.height);

        boxAndLadders(c, innerwidth, innerheight);
        drawStaticImages();
        if(starColor === player1Colour.starColor && circleColor === player1Colour.circleColor) {
            drawStarInCircle(c, currentPosition2.x, currentPosition2.y, 15, player2Colour.starColor, player2Colour.circleColor);
        }else if(starColor === player2Colour.starColor && circleColor === player2Colour.circleColor) {
            drawStarInCircle(c, currentPosition1.x, currentPosition1.y, 15, player1Colour.starColor, player1Colour.circleColor);
        }
        drawStarInCircle(c, currentX, currentY, radius, starColor, circleColor);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function orangeWhiteSnake98to78(starColor, circleColor) {
    setTimeout(() => {
        moveStar(70, 75, 150, 150, 15, starColor, circleColor, 1500);
    }, 1500);
    moveStar(150, 30, 70, 75, 15, starColor, circleColor, 1500);
}

function greenyellowSnake95to75(starColor, circleColor) {
    setTimeout(() => {
        moveStar(240, 75, 330, 150, 15, starColor, circleColor, 1500);
    }, 1500);
    moveStar(300, 30, 240, 75, 15, starColor, circleColor, 1500);
}

function orangeYellowSnake92to72(starColor, circleColor) {
    setTimeout(() => {
        moveStar(579, 90, 500, 155, 15, starColor, circleColor, 1500);
    }, 1500);
    moveStar(545, 60, 579, 90, 15, starColor, circleColor, 1500);
}

function blueCyanSnake54to34(starColor, circleColor) {
    setTimeout(() => {
        moveStar(450, 300, 380, 380, 15, starColor, circleColor, 1500);
    }, 1500);
    moveStar(390, 270, 450, 300, 15, starColor, circleColor, 1500);
}

function brownYellowSnake64to60(starColor, circleColor) {
    setTimeout(() => {
        moveStar(115, 235, 30, 280, 15, starColor, circleColor, 1500);
    }, 1500);
    moveStar(210, 190, 115, 235, 15, starColor, circleColor, 1500);
}

function darkGreenYellowSnake18to7(starColor, circleColor) {
    setTimeout(() => {
        moveStar(200, 520, 390, 580, 15, starColor, circleColor, 1500);
    }, 1000);
    moveStar(150, 510, 200, 520, 15, starColor, circleColor, 1000);
}

function pinkVoiletSnake49to10(starColor, circleColor) {
    setTimeout(() => {
        moveStar(565, 370, 570, 570, 15, starColor, circleColor, 1200);
    }, 500);
    moveStar(510, 330, 565, 370, 15, starColor, circleColor, 500);
}

function redBrownSnake57to15(starColor, circleColor) {
    setTimeout(() => {
        moveStar(300, 450, 340, 510, 15, starColor, circleColor, 500);
    }, 1500);
    setTimeout(() => {
        moveStar(210, 360, 300, 450, 15, starColor, circleColor, 1000);
    }, 500);
    moveStar(210, 270, 210, 360, 15, starColor, circleColor, 500);
}

function blueDarkBlueSnake87to24(starColor, circleColor) {
    setTimeout(() => {
        moveStar(265, 435, 210, 450, 15, starColor, circleColor, 500);
    }, 2700);
    setTimeout(() => {
        moveStar(290, 240, 265, 435, 15, starColor, circleColor, 1000);
    }, 1700);
    setTimeout(() => {
        moveStar(360, 210, 290, 240, 15, starColor, circleColor, 1000);
    }, 700);
    moveStar(390, 90, 360, 210, 15, starColor, circleColor, 700);
}

function orangeBrownSnake79to2(starColor, circleColor) {
    setTimeout(() => {
        moveStar(65, 480, 90, 560, 15, starColor, circleColor, 700);
    }, 3500);
    setTimeout(() => {
        moveStar(60, 420, 65, 480, 15, starColor, circleColor, 700);
    }, 2800);
    setTimeout(() => {
        moveStar(90, 330, 60, 420, 15, starColor, circleColor, 700);
    }, 2100);
    setTimeout(() => {
        moveStar(60, 270, 90, 330, 15, starColor, circleColor, 700);
    }, 1400);
    setTimeout(() => {
        moveStar(90, 240, 60, 270, 15, starColor, circleColor, 700);
    }, 700);
    moveStar(90, 150, 90, 240, 15, starColor, circleColor, 700);
}

function rollDice(callback) {
    return new Promise((resolve) => {
        image.style.animation = "roll 0.3s ease-out";

        image.addEventListener("animationend", () => {
            callback(); 
            image.style.animation = "";  
            resolve(diceNumber);
        }, { once: true });  
    });
}

function printDice() {
    diceNumber = Math.floor(Math.random() * 6) + 1;
    const imgType = (diceNumber === 6) ? "png" : "jpeg";
    image.setAttribute("src", `images/side${diceNumber}.${imgType}`);
    setTimeout(() => {
        dValue.innerHTML = "Dice Value: " + diceNumber;
    }, 50);
    setTimeout(() => {
        image.setAttribute("src", `images/die_pic.jpg`);
    }, 1500);
}

function ladder1to38(starColor, circleColor) {
    moveStar(30, 570, 150, 390, 15, starColor, circleColor, 700);
}

function ladder4to14(starColor, circleColor) {
    moveStar(210, 570, 390, 510, 15, starColor, circleColor, 700);
}

function ladder9to31(starColor, circleColor) {
    moveStar(510, 570, 570, 390, 15, starColor, circleColor, 700);
}

function ladder21to42(starColor, circleColor) {
    moveStar(30, 450, 90, 330, 15, starColor, circleColor, 700);
}

function ladder28to84(starColor, circleColor) {
    moveStar(450, 450, 210, 90, 15, starColor, circleColor, 1000);
}

function ladder36to44(starColor, circleColor) {
    moveStar(270, 390, 210, 330, 15, starColor, circleColor, 400);
}

function ladder51to68(starColor, circleColor) {
    moveStar(570, 270, 450, 210, 15, starColor, circleColor, 700);
}

function ladder71to91(starColor, circleColor) {
    moveStar(570, 150, 570, 30, 15, starColor, circleColor, 700);
}

function ladder80to99(starColor, circleColor) {
    moveStar(30, 150, 90, 30, 15, starColor, circleColor, 700);
}

loadImages().then(() => {
    boxAndLadders(c, innerwidth, innerheight);
    drawStaticImages();
});

function numberToCoordinates(number, coordinate) {
    let a = Math.floor(number / 10);
    let b = number % 10;
    if (number % 10 == 0){
        a -= 1;
    }
    let yDirection = (9 - a)*60 + 30; 
    let XDirection = (b - 1)*60 + 30;
    if((number >= 1 && number <= 10) || (number >= 21 && number <= 30) || (number >= 41 && number <= 50) || (number >= 61 && number <= 70) || (number >= 81 && number <= 90)) {
        if (number % 10 == 0){
            XDirection = 570;
        }
        coordinate.x = XDirection;
        coordinate.y = yDirection;
    }else {
        if (number % 10 == 0){
            XDirection = 570;
        }
        coordinate.x = 600 - XDirection;
        coordinate.y = yDirection;  
    }
}

function checkLadder(playerPosition, player) {
    let update = 0;
    let starColor, circleColor;
    element1.style.cursor = "no-drop";
    image.style.cursor = "not-allowed";
    if(player === 1) {
       starColor = player1Colour.starColor;
       circleColor = player1Colour.circleColor; 
    }else if(player === 2) {
        starColor = player2Colour.starColor;
        circleColor = player2Colour.circleColor; 
    }

    if(playerPosition === 1) {
        ladder1to38(starColor, circleColor);
        update = 38;
        if(player === 1) {
            player1Position = update;
        }else if(player === 2) {
            player2Position = update;
        }
    }else if(playerPosition === 4) {
        ladder4to14(starColor, circleColor);
        update = 14;
        if(player === 1) {
            player1Position = update;
        }else if(player === 2) {
            player2Position = update;
        }
    }else if(playerPosition === 9) {
        ladder9to31(starColor, circleColor);
        update = 31;
        if(player === 1) {
            player1Position = update;
        }else if(player === 2) {
            player2Position = update;
        }
    }else if(playerPosition === 21) {
        ladder21to42(starColor, circleColor);
        update = 42;
        if(player === 1) {
            player1Position = update;
        }else if(player === 2) {
            player2Position = update;
        }
    }else if(playerPosition === 28) {
        ladder28to84(starColor, circleColor);
        update = 84;
        if(player === 1) {
            player1Position = update;
        }else if(player === 2) {
            player2Position = update;
        }
    }else if(playerPosition === 36) {
        ladder36to44(starColor, circleColor);
        update = 44;
        if(player === 1) {
            player1Position = update;
        }else if(player === 2) {
            player2Position = update;
        }
    }else if(playerPosition === 51) {
        ladder51to68(starColor, circleColor);
        update = 68;
        if(player === 1) {
            player1Position = update;
        }else if(player === 2) {
            player2Position = update;
        }
    }else if(playerPosition === 71) {
        ladder71to91(starColor, circleColor);
        update = 91;
        if(player === 1) {
            player1Position = update;
        }else if(player === 2) {
            player2Position = update;
        }
    }
    else if(playerPosition == 80) {
        ladder80to99(starColor, circleColor);
        update = 99;
        if(player === 1) {
            player1Position = update;
        }else if(player === 2) {
            player2Position = update;
        }
    }
    setTimeout(() => {
        element1.style.cursor = "pointer";
        image.style.cursor = "pointer";
    }, 700);
} 

function checkSnakes(playerPosition, player) {
    let change = 0;
    let starColor, circleColor;
    element1.style.cursor = "no-drop";
    image.style.cursor = "not-allowed";

    if(player === 1) {
        starColor = player1Colour.starColor;
        circleColor = player1Colour.circleColor; 
     }else if(player === 2) {
         starColor = player2Colour.starColor;
         circleColor = player2Colour.circleColor; 
    }

    if(playerPosition === 18) {
        darkGreenYellowSnake18to7(starColor, circleColor);
        change = 7;
        if(player === 1) {
            player1Position = change;
        }else if(player === 2) {
            player2Position = change;
        }
    }else if(playerPosition === 49) {
        pinkVoiletSnake49to10(starColor, circleColor);
        change = 10;
        if(player === 1) {
            player1Position = change;
        }else if(player === 2) {
            player2Position = change;
        }
    }else if(playerPosition === 54) {
        blueCyanSnake54to34(starColor, circleColor);
        change = 34;
        if(player === 1) {
            player1Position = change;
        }else if(player === 2) {
            player2Position = change;
        }
    }else if(playerPosition === 57) {
        redBrownSnake57to15(starColor, circleColor);
        change = 15;
        if(player === 1) {
            player1Position = change;
        }else if(player === 2) {
            player2Position = change;
        }
    }else if(playerPosition === 64) {
        brownYellowSnake64to60(starColor, circleColor);
        change = 60;
        if(player === 1) {
            player1Position = change;
        }else if(player === 2) {
            player2Position = change;
        }
    }else if(playerPosition === 79) {
        orangeBrownSnake79to2(starColor, circleColor);
        change = 2;
        if(player === 1) {
            player1Position = change;
        }else if(player === 2) {
            player2Position = change;
        }
    }else if(playerPosition === 87) {
        blueDarkBlueSnake87to24(starColor, circleColor);
        change = 24;
        if(player === 1) {
            player1Position = change;
        }else if(player === 2) {
            player2Position = change;
        }
    }else if(playerPosition === 92) {
        orangeYellowSnake92to72(starColor, circleColor);
        change = 72;
        if(player === 1) {
            player1Position = change;
        }else if(player === 2) {
            player2Position = change;
        }
    }else if(playerPosition === 95) {
        greenyellowSnake95to75(starColor, circleColor);
        change = 75;
        if(player === 1) {
            player1Position = change;
        }else if(player === 2) {
            player2Position = change;
        }
    }else if(playerPosition === 98) {
        orangeWhiteSnake98to78(starColor, circleColor);
        change = 78;
        if(player === 1) {
            player1Position = change;
        }else if(player === 2) {
            player2Position = change;
        }
    }

    setTimeout(() => {
        element1.style.cursor = "pointer";
        image.style.cursor = "pointer";
    }, 2000);
}

function diceMovement(playerPosition, diceNumber, previousPosition, currentPosition, player) {
    let starColor, circleColor;
    if(player === 1) {
       starColor = player1Colour.starColor;
       circleColor = player1Colour.circleColor; 
    }else if(player === 2) {
        starColor = player2Colour.starColor;
        circleColor = player2Colour.circleColor; 
    }

    let firstDigit = Math.floor(playerPosition / 10);
    if (playerPosition % 10 == 0){
        firstDigit -= 1;
    }
    let checkDigit = (firstDigit + 1)*10;

    setTimeout(() => {
        if(playerPosition + diceNumber <= 100) {
            if(player === 1) {
                player1Position += diceNumber;
            }else if(player === 2) {
                player2Position += diceNumber;
            }
            playerPosition += diceNumber;
        }
        checkLadder(playerPosition, player);
        checkSnakes(playerPosition, player);
        if(player === 1) {
            numberToCoordinates(player1Position, currentPosition1);
            numberToCoordinates(player1Position, previousPosition1);
        }else if(player === 2) {
            numberToCoordinates(player2Position, currentPosition2);
            numberToCoordinates(player2Position, previousPosition2);
        }
    }, 1500);

    if(playerPosition + diceNumber > 100) {
           moveStar(previousPosition.x, previousPosition.y, previousPosition.x, previousPosition.y, 15, starColor, circleColor, 1500);
    }else if(playerPosition + diceNumber === 100) {
        moveStar(previousPosition.x, previousPosition.y, 30, 30, 15, starColor, circleColor, 1500);
        winner = player;
    }else if(playerPosition + diceNumber > checkDigit && playerPosition != 0){
        numberToCoordinates(checkDigit, middleCordinate);
        setTimeout(() => {
            moveStar(middleCordinate.x, middleCordinate.y - 60, currentPosition.x, currentPosition.y, 15, starColor, circleColor, 600);
        }, 900);
        setTimeout(() => {
            moveStar(middleCordinate.x, middleCordinate.y, middleCordinate.x, middleCordinate.y - 60, 15, starColor, circleColor, 600);
        }, 300);
        moveStar(previousPosition.x, previousPosition.y, middleCordinate.x, middleCordinate.y, 15, starColor, circleColor, 300);
    }else {
        moveStar(previousPosition.x, previousPosition.y, currentPosition.x, currentPosition.y, 15, starColor, circleColor, 1500);
    }
}

if(player1Position === 100 || player2Position === 100) {
    displayWinner();
}

function gamePlay() {
    rollDice(printDice).then(() => {
        let check = false;
        let stop = false;
        if (whoseChance === 1) {
            let newPosition = player1Position + diceNumber;
            if(newPosition > 100) {
                check = true;
            }else if(newPosition === 100){
                stop = true;
                setTimeout(() => {
                    displayWinner();
                }, 1500);
            }
            numberToCoordinates(newPosition, currentPosition1);
            diceMovement(player1Position, diceNumber, previousPosition1, currentPosition1, 1);
            previousPlayer = 1;
        }else if (whoseChance === 2) {
            let newPosition = player2Position + diceNumber;
            if(newPosition > 100) {
                check = true;
            }else if(newPosition === 100){
                stop = true;
                setTimeout(() => {
                    displayWinner();
                }, 1500);
            }
            numberToCoordinates(newPosition, currentPosition2);
            diceMovement(player2Position, diceNumber, previousPosition2, currentPosition2, 2);
            previousPlayer = 2;
        }else if (whoseChance === 0){
            return;
        }

        if(diceNumber < 6) {
            whoseChance = 3 - previousPlayer;
        }else if(check === true){
            whoseChance =  3 - previousPlayer;
        }else if(check === false){
            whoseChance = previousPlayer;
        }

        if(stop === true){
            whoseChance = 0;
        }

        setTimeout(()=> {
            if(whoseChance === 2) {
                player1.style.borderColor = "rgb(177, 232, 25)";
                player2.style.borderColor = "red";
            } else if (whoseChance === 1) {
                player1.style.borderColor = "red";
                player2.style.borderColor = "rgb(177, 232, 25)";
            }
        }, 1650);
    });
}

function handleGamePlay() {
    element1.removeEventListener("click", handleGamePlay);
    element1.style.cursor = "no-drop";
    image.style.cursor = "not-allowed";

    gamePlay();

    setTimeout(() => {
    element1.style.cursor = "pointer";
    image.style.cursor = "pointer";
    element1.addEventListener("click", handleGamePlay);
    }, 3000);
}

element1.addEventListener("click", handleGamePlay);

function displayWinner() {
    const winnerPopup = document.createElement("div");  
    winnerPopup.classList.add("winnerPopup");
    winnerPopup.style.overflow = "auto";

    const text = `Player ${winner} won the match.`;
    const message = document.createElement("p");
    message.textContent = text;
    message.style.textAlign = "center";
    message.style.fontSize = "30px";
    message.style.position = "absolute";
    message.style.top = "50px";

    winnerPopup.appendChild(message);

    const restart_button = document.createElement("div");
    restart_button.classList.add("restart");
    winnerPopup.appendChild(restart_button);

    if (scriptTag[0] && scriptTag[0].parentNode) {
        scriptTag[0].parentNode.insertBefore(winnerPopup, scriptTag[0]);
    } else {
        console.error("Script tag not found. Unable to insert winner popup.");
        return;
    }

    conatiner.style.filter = "opacity(0.8) blur(4px)";
    element1.removeEventListener("click", gamePlay);

    restart_button.addEventListener("click", () => {
        location.reload();
    });
}