let ctx = null;
let boardDrawer = null;
let imageDrawer = null;
let playersData = [];

function initAnimationSystem(c, boxAndLaddersFunc, loadDrawImagesFunc, players) {
    ctx = c;
    boardDrawer = boxAndLaddersFunc;
    imageDrawer = loadDrawImagesFunc;
    playersData = Array.isArray(players) ? players : [];
    
    console.log('Animation system initialized with:', {
        hasContext: !!ctx,
        hasBoardDrawer: !!boardDrawer,
        hasImageDrawer: !!imageDrawer,
        playerCount: playersData.length,
        playerData: playersData
    });
}

const drawStarInCircle = (x, y, radius, starColor, circleColor) => {
    const spikes = 5; 
    const outerRadius = radius * 0.6; 
    const innerRadius = radius * 0.3; 
    ctx.save();

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
    ctx.restore();
}

const moveStar = (startX, startY, endX, endY, radius = 15, starColor, circleColor, whoseChance, duration = 1000) => {
    if (!ctx || !boardDrawer || !imageDrawer) {
        return Promise.reject(new Error('Animation system not initialized.'));
    }

    return new Promise((resolve) => {
        const startTime = performance.now();
        const canvas = ctx.canvas;

        function animate(time) {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (typeof boardDrawer === 'function') boardDrawer();
            if (typeof imageDrawer === 'function') imageDrawer();

            playersData.forEach((player) => {
                const color = player.getColor();
                if (circleColor !== color.getCircleColor()) {
                    const position = player.getPosition();
                    drawStarInCircle(position.getX(), position.getY(), radius, color.getStarColor(), color.getCircleColor());
                }
            });

            drawStarInCircle(currentX, currentY, radius, starColor, circleColor);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve(); // Animation complete
            }
        }

        requestAnimationFrame(animate);
    });
}

export { moveStar, initAnimationSystem };