// JavaScript for the story game


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
const OBSTACLE_HEIGHT = 60;
const OBSTACLE_SPEED = 5;

// Define the screens and story lines
screens = [startScreen, nameScreen, introductionScreen, prologueScreen];

storyLines = 
    [
        `You find yourself in a familiar forest behind your house. 
        You've explored this place many times before, but today it feels different.
        The trees seem taller, the air thicker, and the sounds of nature louder.
        You look behind you and realize that, for the first time,
        you can't see your house and lost sense of direction.
        You consider on your options. You can either try to find your way back home,
        or venture deeper into the forest to see if you can find any clues about where you are.`,
    ];

buttonChoices = 
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
let obstacle = {
    x: OBSTACLE_START_X,
    y: OBSTACLE_START_Y,
    width: OBSTACLE_WIDTH,
    height: OBSTACLE_HEIGHT,
    speed: OBSTACLE_SPEED,
    passedPlayer: false
};

// Define Game State
let gameState = "playing";

// initialize the score
let score = 0;

document.addEventListener("keydown", function(event) {
    keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

// Function to draw the player on the canvas
function drawPlayer() {
    ctx.fillStyle = "red";
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
function updateObstacle() {

    obstacle.x -= obstacle.speed;


    if (obstacle.x + obstacle.width < 0) {
    obstacle.x = canvas.width;
    obstacle.passedPlayer = false;
}

    if (obstacle.x + obstacle.width < player.x && !obstacle.passedPlayer) {
    score++;

    if (score % 5 === 0) {
        obstacle.speed += 0.5; // Increase speed every 5 points
    }
    obstacle.passedPlayer = true;
    }

}

// Draw the obstacle on the canvas
function drawObstacle() {
    ctx.fillStyle = "White";
    ctx.fillRect(
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
    );
}

// Checks for collision between the player and the obstacle
function checkCollision() {
    if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    ) {
        gameState = "gameOver";
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

// Game loop to update and render the game
function gameLoop() {

    if (gameState === "playing") {
    updatePlayer();
    updateObstacle();
    checkCollision();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawObstacle();

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

        obstacle.x = OBSTACLE_START_X;
        obstacle.speed = OBSTACLE_SPEED;
        obstacle.passedPlayer = false;

        score = 0;
    }
});

homebtn.addEventListener("click", function(event) {
    resetGame();
});
