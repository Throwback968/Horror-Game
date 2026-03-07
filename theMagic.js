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

screens = [startScreen, nameScreen, introductionScreen, prologueScreen];
storyLines = [`You find yourself in a familiar forest behind your house. 
        You've explored this place many times before, but today it feels different.
        The trees seem taller, the air thicker, and the sounds of nature louder.
        You look behind you and realize that, for the first time,
        you can't see your house and lost sense of direction.
        You consider on your options. You can either try to find your way back home,
        or venture deeper into the forest to see if you can find any clues about where you are.`,

        `You decide to try to find your way back home. You start walking in the direction you think is correct,
        but after a while, you realize that you're only getting more lost. The trees all look the same, and 
        you can't find any landmarks to guide you. You start to feel a sense of panic as the sun begins to set
        and the forest becomes darker.`,

        `You decide to venture deeper into the forest. As you walk,
        you notice that the trees are getting taller and the air is getting thicker.
        You feel a sense of unease as you realize that you're not alone.
        You hear rustling in the bushes and see shadows moving in the distance.`];

buttonChoices = [`Try to find your way back home`,
                 `Venture deeper into the forest`];

// Event listener for the start button
startBtn.addEventListener("click", function() {
    startScreen.style.display = "none";
    nameScreen.style.display = "block";
});

// Event listener for the submit button
submitBtn.addEventListener("click", function() {

    const name = nameInput.value.trim();

    // Validate the name input
    if (name.length > 0 && name.length <= 16) {
        localStorage.setItem("name", name);

        nameScreen.style.display = "none";
        introductionScreen.style.display = "block";
        storyText.textContent = `Welcome, ${name} Your adventure begins now.`;
    }
    // error message for invalid input
    else {
        alert("Enter a name between 1 and 16 characters.");
    }
});

// Event listener for the continue button
continueBtn.addEventListener("click", function(event) {
    introductionScreen.style.display = "none";
    prologueScreen.style.display = "block";
    prologueText.textContent = storyLines[0];
    choiceOne.textContent = buttonChoices[0];
    choiceTwo.textContent = buttonChoices[1];
});


const choiceOne = document.getElementById("choiceOne");
const choiceTwo = document.getElementById("choiceTwo");

choiceOne.addEventListener("click", function () {
    prologueHeader.textContent = "You try to find your way back home...";
    prologueText.textContent = storyLines[1];
    choiceOne.style.display = "none";
    choiceTwo.style.display = "none";
});

choiceTwo.addEventListener("click", function () {
    prologueHeader.textContent = "You venture deeper into the forest...";
    prologueText.textContent = storyLines[2];
    choiceOne.style.display = "none";
    choiceTwo.style.display = "none";
});

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

    choiceOne.textContent = "Try to find your way back home";
    choiceTwo.textContent = "Venture deeper into the forest";

    currentChoice = null;
}


homebtn.addEventListener("click", function(event) {
    resetGame();
});
