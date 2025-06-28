function numberToCoordinates(number) {
    let a = Math.floor((number - 1) / 10);
    let b = (number - 1) % 10;
    let y = (9 - a) * 60 + 30;
    let x = (a % 2 === 0) ? (b * 60 + 30) : (600 - (b * 60 + 30));
    return { x, y };
}

const checkSnakes = new Map([
    [98, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(150, 30, 70, 75, 15, starColor, circleColor, whoseChance, 1500);
        await moveStar(70, 75, 150, 150, 15, starColor, circleColor, whoseChance, 1500);
        return 78;
    }],
    [95, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(300, 30, 240, 75, 15, starColor, circleColor, whoseChance, 1500);
        await moveStar(240, 75, 330, 150, 15, starColor, circleColor, whoseChance, 1500);
        return 75;
    }],
    [92, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(545, 60, 579, 90, 15, starColor, circleColor, whoseChance, 1500);
        await moveStar(579, 90, 500, 155, 15, starColor, circleColor, whoseChance, 1500);
        return 72;
    }],
    [54, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(390, 270, 450, 300, 15, starColor, circleColor, whoseChance, 1500);
        await moveStar(450, 300, 380, 380, 15, starColor, circleColor, whoseChance, 1500);
        return 34;
    }],
    [64, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(210, 190, 115, 235, 15, starColor, circleColor, whoseChance, 1500);
        await moveStar(115, 235, 30, 280, 15, starColor, circleColor, whoseChance, 1500);
        return 60;
    }],
    [18, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(150, 510, 200, 520, 15, starColor, circleColor, whoseChance, 1000);
        await moveStar(200, 520, 390, 580, 15, starColor, circleColor, whoseChance, 1500);
        return 7;
    }],
    [49, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(510, 330, 565, 370, 15, starColor, circleColor, whoseChance, 500);
        await moveStar(565, 370, 570, 570, 15, starColor, circleColor, whoseChance, 1200);
        return 10;
    }],
    [57, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(210, 270, 210, 360, 15, starColor, circleColor, whoseChance, 500);
        await moveStar(210, 360, 300, 450, 15, starColor, circleColor, whoseChance, 1000);
        await moveStar(300, 450, 340, 510, 15, starColor, circleColor, whoseChance, 500);
        return 15;
    }],
    [87, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(390, 90, 360, 210, 15, starColor, circleColor, whoseChance, 700);
        await moveStar(360, 210, 290, 240, 15, starColor, circleColor, whoseChance, 1000);
        await moveStar(290, 240, 265, 435, 15, starColor, circleColor, whoseChance, 1000);
        await moveStar(265, 435, 210, 450, 15, starColor, circleColor, whoseChance, 500);
        return 24;
    }],
    [79, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(90, 150, 90, 240, 15, starColor, circleColor, whoseChance, 700);
        await moveStar(90, 240, 60, 270, 15, starColor, circleColor, whoseChance, 700);
        await moveStar(60, 270, 90, 330, 15, starColor, circleColor, whoseChance, 700);
        await moveStar(90, 330, 60, 420, 15, starColor, circleColor, whoseChance, 700);
        await moveStar(60, 420, 65, 480, 15, starColor, circleColor, whoseChance, 700);
        await moveStar(65, 480, 90, 560, 15, starColor, circleColor, whoseChance, 700);
        return 2;
    }]
]);

const checkLadders = new Map([
    [1, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(30, 570, 150, 390, 15, starColor, circleColor, whoseChance, 700);
        return 38;
    }],
    [4, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(210, 570, 390, 510, 15, starColor, circleColor, whoseChance, 700);
        return 14;
    }],
    [9, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(510, 570, 570, 390, 15, starColor, circleColor, whoseChance, 700);
        return 31;
    }],
    [21, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(30, 450, 90, 330, 15, starColor, circleColor, whoseChance, 700);
        return 42;
    }],
    [28, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(450, 450, 210, 90, 15, starColor, circleColor, whoseChance, 1000);
        return 84;
    }],
    [36, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(270, 390, 210, 330, 15, starColor, circleColor, whoseChance, 400);
        return 44;
    }],
    [51, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(570, 270, 450, 210, 15, starColor, circleColor, whoseChance, 700);
        return 68;
    }],
    [71, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(570, 150, 570, 30, 15, starColor, circleColor, whoseChance, 700);
        return 91;
    }],
    [80, async (starColor, circleColor, whoseChance, moveStar) => {
        await moveStar(30, 150, 90, 30, 15, starColor, circleColor, whoseChance, 700);
        return 99;
    }]
]);

async function tokenMovement(c, players, diceNumber, whoseChance, moveStar) {
    if (!players || !players[whoseChance]) throw new Error(`Invalid player at index ${whoseChance}`);
    if (diceNumber < 1 || diceNumber > 6) throw new Error(`Invalid dice number: ${diceNumber}. Must be between 1 and 6.`);

    const player = players[whoseChance];
    const starColor = player.getColor().getStarColor();
    const circleColor = player.getColor().getCircleColor();
    const oldPosition = player.getPlace();
    let newPosition = oldPosition + diceNumber;
    const oldRow = Math.floor(oldPosition / 10);
    const newRow = Math.floor(newPosition / 10);
    if (newPosition > 100) {
        console.log(`Player ${whoseChance} rolled ${diceNumber} but would exceed 100. Staying at ${oldPosition}`);
        return oldPosition;
    }

    const oldCoords = player.getPosition();
    const newCoords = numberToCoordinates(newPosition);

    if (newPosition === 100) {
        await moveStar(oldCoords.getX(), oldCoords.getY(), 30, 30, 15, starColor, circleColor, whoseChance, diceNumber * 350);
    } else if ((oldPosition !== 0) && ((newPosition % 10 !== 0 && newRow !== oldRow) || oldPosition % 10 === 0)) {
        const intermediateCoordinate = numberToCoordinates(newRow * 10);
        await moveStar(oldCoords.getX(), oldCoords.getY(), intermediateCoordinate.x, intermediateCoordinate.y, 15, starColor, circleColor, whoseChance, ((newRow * 10) - oldPosition) * 350);
        await moveStar(intermediateCoordinate.x, intermediateCoordinate.y, intermediateCoordinate.x, intermediateCoordinate.y - 60, 15, starColor, circleColor, whoseChance, 350);
        await moveStar(intermediateCoordinate.x, intermediateCoordinate.y - 60, newCoords.x, newCoords.y, 15, starColor, circleColor, whoseChance, (newPosition - newRow * 10 + 1) * 350);
    } else {
        await moveStar(oldCoords.getX(), oldCoords.getY(), newCoords.x, newCoords.y, 15, starColor, circleColor, whoseChance, diceNumber * 350);
    }

    player.setPlace(newPosition);
    player.setPosition(newCoords.x, newCoords.y);

    let finalPosition = newPosition;

    if (checkLadders.has(newPosition)) {
        finalPosition = await checkLadders.get(newPosition)(starColor, circleColor, whoseChance, moveStar);
    } else if (checkSnakes.has(newPosition)) {
        finalPosition = await checkSnakes.get(newPosition)(starColor, circleColor, whoseChance, moveStar);
    }

    if (finalPosition !== newPosition) {
        const finalCoords = numberToCoordinates(finalPosition);
        player.setPlace(finalPosition);
        player.setPosition(finalCoords.x, finalCoords.y);
    }

    return finalPosition;
}

export async function manVsComp(c, diceNumber, players, whoseChance, timeDuration, iconHolder, moveStar, diceImage, toggleCursor, diceButton, handleDiceClick, totalHumans) {
    if (!Array.isArray(players) || players.length === 0) throw new Error('Invalid players array');
    if (whoseChance < 0 || whoseChance >= players.length) throw new Error(`Invalid player index: ${whoseChance}`);
    if (diceNumber < 1 || diceNumber > 6) throw new Error(`Invalid dice number: ${diceNumber}`);

    const currentPosition = players[whoseChance].getPlace();
    const newPosition = currentPosition + diceNumber;

    const finalPosition = await tokenMovement(c, players, diceNumber, whoseChance, moveStar);

    if (finalPosition === 100) return -1;

    let nextTurn = whoseChance;
    if (diceNumber === 6 && newPosition <= 100) {
        // same player's turn
    } else {
        nextTurn = (whoseChance + 1) % players.length;
    }

    setTimeout(() => {
        const prevIcon = iconHolder.children[whoseChance];
        const newIcon = iconHolder.children[nextTurn];
        const prevIconSrc = players[whoseChance].getColor().getCircleColor();
        const newIconSrc = players[nextTurn].getColor().getCircleColor();
        let src = `images/${prevIconSrc}.png`;
        prevIcon.style.setProperty('--bg-url', `url("${src}")`);
        src = `images/${newIconSrc}_clicked.png`;
        newIcon.style.setProperty('--bg-url', `url("${src}")`);
        toggleCursor(diceImage, "pointer");
        diceButton.addEventListener("click", handleDiceClick);
        if (totalHumans == 1 && nextTurn == 0) {
            diceButton.click();
        }
    }, timeDuration);

    return nextTurn;
}

export function getGameState(players) {
    return players.map((player, index) => ({
        player: index,
        position: player.getPlace(),
        coordinates: player.getPosition()
    }));
}

export function isGameFinished(players) {
    return players.some(player => player.getPlace() === 100);
}

export function getWinner(players) {
    const winnerIndex = players.findIndex(player => player.getPlace() === 100);
    return winnerIndex !== -1 ? winnerIndex : null;
}