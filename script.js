import { getContext, setupCanvas, boxAndLadders, loadDrawImages, loadAndDrawArena } from "./buildArena.js";
import { moveStar, initAnimationSystem } from "./animation.js";
import { getElementById, getElementsByTagName, toggleDisplay, toggleCursor, toggleFilter, getFormDetails, getDuration, Person, renderIconImage, validatePlayer } from "./helper.js";
import { manVsComp, getWinner } from "./gameLogic.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        setupCanvas();
        await loadAndDrawArena();
        initializeGame();
    } catch (error) {
        console.error("Failed to initialize game:", error);
        showError("Failed to load game. Please refresh the page.");
    }
});

function initializeGame() {
    const c = getContext();
    const diceImages = {};
    preloadDiceImages();

    const gameArea = getElementById("main_container");
    const diceButton = getElementById("rollDice");
    const diceImage = getElementById("dice_image");
    const diceValue = getElementById("diceValue");
    // const container = getElementById("bgimage");
    const humanvshuman = getElementById("onevsone");
    const humanvscomp = getElementById("manvscomp");
    const humanModeImages = document.querySelectorAll('#mode2 img');
    const iconHolder = getElementById("icon_holder");

    let audio = null;

    try {
        audio = new Audio("audio/dice_roll.mp3");
        audio.volume = 0.3;
        audio.preload = "auto";
    } catch (error) {
        console.warn("Audio initialization failed:", error);
    }

    let gameState = {
        diceNumber: 0,
        whoseChance: 0,
        winner: null,
        audioPaused: false,
        gameInProgress: false,
        isProcessingMove: false,
        totalHumans: 0,
        players: [],
        selectedColors: new Set(),
        mode: undefined
    };

    const STAR_COLOR = "#14f387";
    const MOVE_DURATIONS = [350, 700, 1050, 1400, 1750, 2100];
    const LADDER_DURATIONS = {
        1: 700,
        4: 700,
        9: 700,
        21: 700,
        28: 1000,
        36: 400,
        51: 700,
        71: 700,
        80: 700
    };
    const SNAKE_DURATIONS = {
        98: 3000,
        95: 3000,
        92: 3000,
        54: 3000,
        64: 3000,
        18: 2500,
        49: 1700,
        57: 2000,
        87: 3200,
        79: 4200
    };
    const AVAILABLE_COLORS = ["red", "blue", "green", "yellow", "pink", "white"];

    initializeUI();
    setupModeSelectionListeners();
    setupFormListeners();
    setupGameControlListeners();
    setupAudioControlListeners();

    function initializeUI() {
        if (gameArea) {
            toggleCursor(gameArea, "not-allowed");
            toggleFilter(gameArea, "opacity(0.2) blur(4px)");
        }

        if (diceImage) {
            toggleCursor(diceImage, "not-allowed");
        }

        if (diceValue) {
            diceValue.textContent = "Choose game mode to start!";
        }
    }

    function setupModeSelectionListeners() {
        if (humanvscomp) {
            humanvscomp.addEventListener("click", () => {
                try {
                    toggleDisplay("mode1", "none");
                    toggleDisplay("mode3", "flex");
                    gameState.totalHumans = 1;
                    resetGameState();
                    const computerColor = getRandomAvailableColor();
                    const computerPlayer = Person("Computer", 30, 570, STAR_COLOR, computerColor);
                    gameState.players.push(computerPlayer);
                    gameState.selectedColors.add(computerColor);
                    const iconElement = renderIconImage(`images/${computerColor}.png`);
                    gameState.mode = "humanVsComputer";
                    if (iconHolder) {
                        iconHolder.appendChild(iconElement);
                        iconElement.classList.add(`icon${gameState.players.length}`);
                    }
                    updateColorOptions(computerColor);
                    console.log("Human vs Computer mode selected");
                } catch (error) {
                    console.error("Error setting up human vs computer mode:", error);
                }
            });
        }

        if (humanvshuman) {
            humanvshuman.addEventListener("click", () => {
                try {
                    toggleDisplay("mode1", "none");
                    toggleDisplay("mode2", "flex");
                    resetGameState();
                    console.log("Human vs Human mode selected");
                    gameState.mode = "humanVsHuman";
                } catch (error) {
                    console.error("Error setting up human vs human mode:", error);
                }
            });
        }

        humanModeImages.forEach((image, index) => {
            image.addEventListener("click", () => {
                try {
                    toggleDisplay("mode2", "none");
                    toggleDisplay("mode3", "flex");
                    gameState.totalHumans = index + 2;
                    resetGameState();
                    console.log(`${gameState.totalHumans} players mode selected`);
                } catch (error) {
                    console.error("Error setting up multi-player mode:", error);
                }
            });
        });
    }

    function setupFormListeners() {
        const forms = Array.from(getElementsByTagName("form"));

        forms.forEach((form, index) => {
            if (form) {
                form.addEventListener("submit", async (event) => {
                    event.preventDefault();

                    try {
                        const formData = getFormDetails(`form${index + 1}`);

                        if (!formData || !formData.name?.trim() || !formData.color) {
                            throw new Error("Please fill in all required fields");
                        }

                        if (gameState.selectedColors.has(formData.color)) {
                            throw new Error("Color already selected by another player");
                        }

                        if (formData.name.trim().length > 20) {
                            throw new Error("Player name must be 20 characters or less");
                        }

                        const iconElement = (index === 0) ? renderIconImage(`images/${formData.color}_clicked.png`) : renderIconImage(`images/${formData.color}.png`);

                        if (iconHolder) {
                            iconHolder.appendChild(iconElement);
                            iconElement.classList.add(`icon${gameState.players.length + 1}`);
                        }

                        const player = Person(formData.name.trim(), 30, 570, STAR_COLOR, formData.color);
                        gameState.players.push(player);
                        gameState.selectedColors.add(formData.color);

                        updateColorOptions(formData.color);

                        console.log(`Player ${gameState.players.length}: ${formData.name} (${formData.color})`);

                        toggleDisplay(`mode${index + 3}`, "none");

                        if (gameState.players.length >= gameState.totalHumans) {
                            toggleDisplay("mode9", "flex");
                            initAnimationSystem(c, boxAndLadders, loadDrawImages, gameState.players);
                            console.log("All players configured, ready to start");
                        } else {
                            toggleDisplay(`mode${index + 4}`, "flex");
                        }
                    } catch (error) {
                        console.error("Form submission error:", error);
                        showError(error.message);
                    }
                });
            }
        });
    }

    function setupGameControlListeners() {
        const startButton = getElementById("startGameButton");

        if (startButton) {
            startButton.addEventListener("click", () => {
                try {
                    if (gameState.players.length === 0) {
                        throw new Error("No players configured!");
                    }

                    for (let i = 0; i < gameState.players.length; i++) {
                        if (!validatePlayer(gameState.players[i])) {
                            throw new Error(`Invalid player data for player ${i + 1}`);
                        }
                    }

                    startGame();
                } catch (error) {
                    console.error("Start game error:", error);
                    showError(error.message);
                }
            });
        }
    }

    function setupAudioControlListeners() {
        const playAudioButton = getElementById("playAudio");
        const stopAudioButton = getElementById("stopAudio");

        if (playAudioButton) {
            playAudioButton.addEventListener("click", () => {
                gameState.audioPaused = false;
                console.log("Audio enabled");
            });
        }

        if (stopAudioButton) {
            stopAudioButton.addEventListener("click", () => {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
                gameState.audioPaused = true;
                console.log("Audio disabled");
            });
        }
    }

    function startGame() {
        try {
            toggleDisplay("mode9", "none");

            if (gameArea) {
                toggleCursor(gameArea, "default");
                toggleFilter(gameArea, "opacity(1) blur(0px)");
            }

            if (diceImage) {
                toggleCursor(diceImage, "pointer");
            }

            gameState.gameInProgress = true;
            gameState.whoseChance = 0;
            if (gameState.totalHumans == 1) gameState.whoseChance = 1;
            gameState.isProcessingMove = false;

            if (diceButton) {
                diceButton.addEventListener("click", handleDiceClick);
            }

            updateTurnDisplay();
            console.log(`Game started with ${gameState.players.length} players`);
        } catch (error) {
            console.error("Error starting game:", error);
            showError("Failed to start game. Please try again.");
        }
    }

    function updateTurnDisplay() {
        if (diceValue && gameState.gameInProgress && gameState.players[gameState.whoseChance]) {
            const currentPlayer = gameState.players[gameState.whoseChance];
            diceValue.textContent = `${currentPlayer.getName()}'s turn - Roll the dice!`;
        }
    }

    const handleDiceClick = async () => {
        if (gameState.isProcessingMove || !gameState.gameInProgress) {
            return;
        }

        try {
            gameState.isProcessingMove = true;

            if (diceImage) {
                toggleCursor(diceImage, "not-allowed");
            }

            const rollResult = await rollDice();

            if (rollResult === "animation ended") {
                const { duration, diceNumber: rolled } = await showDiceResult();
                gameState.diceNumber = rolled;

                const currentPlayer = gameState.players[gameState.whoseChance];
                console.log(`${currentPlayer.getName()} rolled ${gameState.diceNumber}`);

                const nextTurn = await manVsComp(
                    c,
                    gameState.diceNumber,
                    gameState.players,
                    gameState.whoseChance,
                    duration,
                    iconHolder,
                    moveStar, diceImage, toggleCursor, diceButton, handleDiceClick, gameState.totalHumans
                );

                if (nextTurn === -1) {
                    gameState.winner = getWinner(gameState.players);

                    if (gameState.winner !== null) {
                        gameState.gameInProgress = false;
                        await displayWinner();
                    }
                } else {
                    gameState.whoseChance = nextTurn;
                    updateTurnDisplay();
                }
            }
        } catch (error) {
            console.error("Error during dice roll:", error);
            showError("An error occurred during the game. Please try again.");
        } finally {
            gameState.isProcessingMove = false;
        }
    };

    function preloadDiceImages() {
        try {
            let img = new Image();
            img.src = "images/die_pic.jpg";
            img.onerror = () => console.warn("Failed to load default dice image");
            diceImages[0] = img;

            for (let i = 1; i <= 6; i++) {
                img = new Image();
                img.src = `images/side${i}.${i === 6 ? "png" : "jpeg"}`;
                img.onerror = () => console.warn(`Failed to load dice image for side ${i}`);
                diceImages[i] = img;
            }
        } catch (error) {
            console.error("Error preloading dice images:", error);
        }
    }

    function rollDice() {
        return new Promise((resolve) => {
            if (!diceImage) {
                resolve("animation ended");
                return;
            }

            diceImage.style.animation = "roll 0.5s ease-in-out";

            if (audio && !gameState.audioPaused) {
                audio.play().catch((error) => {
                    console.warn("Audio playback failed:", error);
                });
            }

            let isResolved = false;

            const cleanup = () => {
                if (isResolved) return;
                isResolved = true;
                
                diceImage.style.animation = "";
                diceImage.removeEventListener("animationend", handleAnimationEnd);
                clearTimeout(timeoutId);
                resolve("animation ended");
            };

            const handleAnimationEnd = () => cleanup();
            
            diceImage.addEventListener("animationend", handleAnimationEnd);
            diceButton.removeEventListener("click", handleDiceClick);
            
            // Fallback timeout (longer than animation duration)
            const timeoutId = setTimeout(cleanup, 700);
        });
    }

    function showDiceResult() {
        return new Promise((resolve) => {
            const result = Math.floor(Math.random() * 6) + 1;

            if (diceImage && diceImages[result]) {
                diceImage.src = diceImages[result].src;
            }

            setTimeout(() => {
                if (diceValue && gameState.players[gameState.whoseChance]) {
                    const playerName = gameState.players[gameState.whoseChance].getName();
                    diceValue.textContent = `${playerName} rolled: ${result}`;
                }
            }, 100);

            const currentPlayerPosition = gameState.players[gameState.whoseChance]?.getPlace() || 0;
            const duration = getDuration(LADDER_DURATIONS, SNAKE_DURATIONS, MOVE_DURATIONS, result, currentPlayerPosition);

            setTimeout(() => {
                if (diceImage && diceImages[0]) {
                    diceImage.src = diceImages[0].src;
                }

                resolve({ duration, diceNumber: result });
            }, 100);
        });
    }

    async function displayWinner() {
        if (gameState.winner === null || !gameState.players[gameState.winner]) {
            console.error("No valid winner found");
            return;
        }

        const winnerName = gameState.players[gameState.winner].getName();

        if (diceButton) {
            diceButton.removeEventListener("click", handleDiceClick);
        }

        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const popup = document.createElement("div");
        popup.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            text-align: center;
            min-width: 350px;
            animation: bounceIn 0.5s ease-out;
        `;

        const congratsText = document.createElement("div");
        congratsText.style.cssText = `
            font-size: 48px;
            margin-bottom: 10px;
        `;
        congratsText.textContent = "🎉";

        const winnerText = document.createElement("h1");
        winnerText.style.cssText = `
            margin: 20px 0;
            font-size: 28px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        `;
        winnerText.textContent = `${winnerName} Wins!`;

        const restartButton = document.createElement("button");
        restartButton.textContent = "Play Again";
        restartButton.style.cssText = `
            background: #ffffff;
            color: #667eea;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            transition: all 0.3s ease;
            margin-top: 20px;
        `;

        restartButton.addEventListener("mouseenter", () => {
            restartButton.style.transform = "scale(1.05)";
            restartButton.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
        });

        restartButton.addEventListener("mouseleave", () => {
            restartButton.style.transform = "scale(1)";
            restartButton.style.boxShadow = "none";
        });

        popup.appendChild(congratsText);
        popup.appendChild(winnerText);
        popup.appendChild(restartButton);
        overlay.appendChild(popup);

        document.body.appendChild(overlay);

        restartButton.addEventListener("click", () => {
            location.reload();
        });

        console.log(`🎉 Game ended! Winner: ${winnerName} 🎉`);
    }

    function resetGameState() {
        gameState.players = [];
        gameState.selectedColors.clear();
        gameState.whoseChance = 0;
        gameState.winner = null;
        gameState.gameInProgress = false;
        gameState.isProcessingMove = false;

        if (iconHolder) {
            iconHolder.innerHTML = "";
        }
    }

    function getRandomAvailableColor() {
        const availableColors = AVAILABLE_COLORS.filter(color => !gameState.selectedColors.has(color));
        return availableColors[Math.floor(Math.random() * availableColors.length)] || "red";
    }

    function updateColorOptions(selectedColor) {
        const selects = document.querySelectorAll("select");

        selects.forEach(select => {
            const options = Array.from(select.options);

            options.forEach(option => {
                if (option.value === selectedColor && option.value !== "") {
                    option.remove();
                }
            });
        });
    }

    function showError(message) {
        const errorDiv = document.createElement("div");

        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 2000;
            font-weight: bold;
            max-width: 300px;
        `;

        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    window.addEventListener('error', (event) => {
        console.error('Game error:', event.error);

        if (gameState.gameInProgress) {
            showError("An unexpected error occurred. Please refresh the page.");
        }
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault();
    });
}