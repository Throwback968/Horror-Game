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

screens = [startScreen, nameScreen, introductionScreen, prologueScreen];

const nameInput = document.getElementById("nameInput");
const storyText = document.getElementById("storyText");

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

continueBtn.addEventListener("click", function(event) {
    introductionScreen.style.display = "none";
    prologueScreen.style.display = "block";
    
});


homebtn.addEventListener("click", function(event) {
    localStorage.removeItem("name");
    
    for (let i = 0; i < screens.length; i++) {
        screens[i].style.display = "none";

        console.log(screens[i].id + " hidden");
    }
    startScreen.style.display = "block";
});