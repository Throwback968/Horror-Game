// JavaScript for the story game

console.log("theMagic.js loaded successfully!");

// Get references to the buttons and screens
const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const continueBtn = document.getElementById("continueBtn");
const homebtn = document.getElementById("homeBtn");

const startScreen = document.getElementById("startScreen");
const nameScreen = document.getElementById("nameScreen");
const introductionScreen = document.getElementById("introductionScreen");
const prologueScreen = document.getElementById("prologueScreen");
const prologueHeader = document.getElementById("prologue");

const nameInput = document.getElementById("nameInput");
const storyText = document.getElementById("storyText");

// Get references to the canvas and its context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Defining variables players
const PLAYER_VELOCITY_Y = 4;
const PLAYER_GRAVITY = 0.08;
const PLAYER_START_X = 100;
const PLAYER_START_Y = 500;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 50;

// Defining variables for obstacles
const OBSTACLE_START_X = 600;
const OBSTACLE_START_Y = 540;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 80;
const OBSTACLE_SPEED = 3 ;

// image for the player
const img = new Image();
img.src = 'gameDude.png';

// Define the minimum and maximum gap between obstacles
const MIN_OBSTACLE_GAP = 400;
const MAX_OBSTACLE_GAP = 650;
const OBSTACLE_SPAWN_THRESHOLD = 300;

// Define the screens and story lines
let screens = [startScreen, nameScreen, introductionScreen, prologueScreen];

// Define the story lines for the game
let storyLines = 
    [
        `You find yourself in a familiar forest behind your house. 
        You've explored this place many times before, but today it feels different.
        The trees seem taller, the air thicker, and the sounds of nature louder.
        You look behind you and realize that, for the first time,
        you can't see your house and lost sense of direction.
        You consider on your options. You can either try to find your way back home,
        or venture deeper into the forest to see if you can find any clues about where you are.`,
    ];

// Define the choices for the player
let buttonChoices = 
    [
        `Let's get out.`
    ];

// Define the player object
let player = {
    x: PLAYER_START_X,
    y: PLAYER_START_Y,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    velocityY: PLAYER_VELOCITY_Y,
    gravity: PLAYER_GRAVITY,
    grounded: false
};

// Reading keyboard input
let keys = {};

// Define the obstacle object
let obstacles = [];

obstacles.push(createObstacle(OBSTACLE_START_X));
obstacles.push(createObstacle(OBSTACLE_START_X + MIN_OBSTACLE_GAP + 100));

// Define Game State
let gameState = "playing";

// initialize the score
let score = 0;

// Define the obstacle speed variable
let obstacleSpeed = OBSTACLE_SPEED;

// Function to draw the player on the canvas
function drawPlayer() {
    const pattern = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );
}

// Update the player's position based on keyboard input
function updatePlayer() {

    if (keys["ArrowLeft"] || keys["a"]) {
        player.x -= PLAYER_VELOCITY_Y;
    }

    if (keys["ArrowRight"] || keys["d"]) {
        player.x += PLAYER_VELOCITY_Y;
    }

    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0;
    player.grounded = true;

    player.y = canvas.height - player.height;
    player.velocityY = 0;
    player.grounded = true;}

    if (keys[" "] && player.grounded) {
    player.velocityY = -PLAYER_VELOCITY_Y;
    player.grounded = false;
}
}

// Update the obstacle's position
function updateObstacles() {
 
     for (let obstacle of obstacles) {
        
        obstacle.x -= obstacleSpeed;

        if (obstacle.x + obstacle.width < player.x && !obstacle.passedPlayer) {
            score++;

            if (score % 5 === 0) {
            obstacleSpeed += 0.5; // Increase speed every 5 points
            }

            obstacle.passedPlayer = true;
        }
    }

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    const lastObstacle = obstacles[obstacles.length - 1];

    if (
        lastObstacle &&
        lastObstacle.x < canvas.width + OBSTACLE_SPAWN_THRESHOLD
    ) {
        spawnObstacle();
    }
}


// Draw the obstacle on the canvas
function drawObstacles() {

    for (let obstacle of obstacles) {
        ctx.fillStyle = "red";
        ctx.fillRect(
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
        );
    }
}

// Spawn a new obstacle at a random distance from the last obstacle
function spawnObstacle() {
    const lastObstacle = obstacles[obstacles.length - 1];

    let gap = Math.random() * (MAX_OBSTACLE_GAP - MIN_OBSTACLE_GAP)
        + MIN_OBSTACLE_GAP;

    let spawnX;

    if (lastObstacle) {
        spawnX = lastObstacle.x + lastObstacle.width + gap;
    } else {
        spawnX = canvas.width + gap;
    }

    obstacles.push(createObstacle(spawnX));
}

// Checks for collision between the player and the obstacle
function checkCollision() {
    for (let obstacle of obstacles) {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameState = "gameOver";
        }
    }
}

// Draw the game over screen
function drawGameOver() {

    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    ctx.font = "20px Arial";
    ctx.fillText(
        "Press R to restart",
        canvas.width / 2,
        canvas.height / 2 + 50
    );
}

// Function to create a new obstacle
function createObstacle(x) {
    return {
        x: x,
        y: OBSTACLE_START_Y,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
        passedPlayer: false
    };
}

// Game loop to update and render the game
function gameLoop() {

    if (gameState === "playing") {
    updatePlayer();
    updateObstacles();
    checkCollision();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawObstacles();

    if (gameState === "gameOver") {
        drawGameOver();
    }

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.fillText(" Score: " + score, 20, 30);

    requestAnimationFrame(gameLoop);
}

// Event listener for the home button
function resetGame() {
    localStorage.removeItem("name");

    nameInput.value = "";

    startScreen.style.display = "block";
    nameScreen.style.display = "none";
    introductionScreen.style.display = "none";
    prologueScreen.style.display = "none";

    storyTitle.textContent = "Welcome";
    storyText.textContent = "";

    prologueHeader.textContent = "And so it begins...";
    prologueText.textContent = storyLines[0];

    choiceOne.style.display = "inline-block";
    choiceTwo.style.display = "inline-block";

    choiceOne.textContent = "Let's get out.";

    currentChoice = null;
}

gameLoop();

// Event listeners for keyboard input
document.addEventListener("keydown", function(event) {
    keys[event.key] = true;
});

// Event listener for keyup to stop movement
document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

// Event listener for the start button
startBtn.addEventListener("click", function() {
    startScreen.style.display = "none";
    nameScreen.style.display = "block";
});

// Event listener for the submit button
submitBtn.addEventListener("click", function() {

    const name = nameInput.value.trim();

    // Validate the name input
    if (name.length > 0 && name.length <= 16 && /^[a-zA-Z]+$/.test(name)) {
        localStorage.setItem("name", name);

        nameScreen.style.display = "none";
        introductionScreen.style.display = "block";
        storyText.textContent = `Welcome, ${name} Your adventure begins now.`;
    }
    // error message for invalid input
    else {
        if (name.length === 0) {
            nameInput.placeholder = "Please enter a name!!!!!!";
        }
        else if (name.length > 16) {
            nameInput.value = "";
            nameInput.placeholder = "Less than 16 characters!";
        }
        else {
            nameInput.value = "";
            nameInput.placeholder = "Invalid name. Only letters.";
        }
    }
});

// Event listener for the continue button
continueBtn.addEventListener("click", function(event) {
    introductionScreen.style.display = "none";
    prologueScreen.style.display = "block";
    prologueText.textContent = storyLines[0];
    choiceOne.textContent = buttonChoices[0];
});

// Event listener for the restart button
document.addEventListener("keydown", function(event) {
    if (event.key === "r" && gameState === "gameOver") {
        gameState = "playing";

        player.x = PLAYER_START_X;
        player.y = PLAYER_START_Y;
        player.velocityY = 0;
        player.grounded = false;

        obstacles = [];
        obstacles.push(createObstacle(OBSTACLE_START_X));
        obstacles.push(createObstacle(OBSTACLE_START_X + MIN_OBSTACLE_GAP + 100));
        obstacles.push(createObstacle(OBSTACLE_START_X + MIN_OBSTACLE_GAP + 300));
        obstacleSpeed = OBSTACLE_SPEED;
        score = 0;
    }
});

homebtn.addEventListener("click", function(event) {
    resetGame();
});
