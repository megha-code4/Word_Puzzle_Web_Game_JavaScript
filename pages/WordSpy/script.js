// script.js

let words = {};
let guessedLetters = []; 

fetch('words.json')
    .then(response => response.json())
    .then(data => {
        words = data;
        initGame();

        document.getElementById("category").addEventListener("change", initGame);
        document.getElementById("difficulty").addEventListener("change", initGame);
        document.getElementById("submit1").addEventListener("click", checkGuess);
        document.getElementById("hint1").addEventListener("click", giveHint);
    })
    .catch(error => {
        console.error('Error loading words:', error);
    });

let currentWord, maskedWord, guessesLeft, currentCategory, currentDifficulty;
let wins = 0, losses = 0;
let timerInterval; 
wins = parseInt(localStorage.getItem('wins')) || 0;
losses = parseInt(localStorage.getItem('losses')) || 0;

function initGame() {
    currentCategory = document.getElementById("category").value;
    currentDifficulty = document.getElementById("difficulty").value;
    guessesLeft = currentDifficulty === "easy" ? 8 : currentDifficulty === "medium" ? 6 : 4;

    const wordList = words[currentCategory] || words.all;
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    maskedWord = currentWord.replace(/./g, "_");

    guessedLetters = [];  // Clear guessed letters on a new game
    document.getElementById("guessedLetters").textContent = "Guessed letters: ";

    document.getElementById("word").textContent = maskedWord;
    document.getElementById("result").textContent = "Guesses left: " + guessesLeft;
    document.getElementById("guess").value = "";
    document.getElementById("wins").textContent = wins;
    document.getElementById("losses").textContent = losses;
    
    startTimer();
}
function startTimer() {
    let timeLeft = 90; 

    clearInterval(timerInterval); 

    timerInterval = setInterval(() => {
        document.getElementById("time").textContent = "Time left: " + timeLeft + " seconds";
        timeLeft--;

        if (timeLeft == 0) {
            console.log("Test"+timeLeft);
            clearInterval(timerInterval);
            
            location.reload(true);
        }
    }, 1000);
}
function resetTimer() {
    clearInterval(timerInterval); 
    startTimer(); 
}

function checkGuess() {
    let guess = document.getElementById("guess").value.toLowerCase();

    if (guess.length !== 1 || !guess.match(/[a-z]/)) {
        document.getElementById("result").textContent = "Invalid guess. Enter a single letter.";
        return;
    }

    let found = false;
    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === guess) {
            maskedWord = maskedWord.substring(0, i) + guess + maskedWord.substring(i + 1);
            found = true;
        }
    }

    if (!found) {
        guessesLeft--;
    }

    if (!guessedLetters.includes(guess)) {
        guessedLetters.push(guess);  // Store the guessed letter
        document.getElementById("guessedLetters").textContent = "Guessed letters: " + guessedLetters.join(", ");
    }
    

    document.getElementById("word").textContent = maskedWord;
    document.getElementById("guess").value = "";

    if (maskedWord === currentWord) {
        document.getElementById("result").textContent = "You win!";
        wins++;
        document.getElementById("word").classList.add("tada");
        setTimeout(() => {
            document.getElementById("word").classList.remove("tada");
            initGame();
        }, 1000);

        resetTimer(); // Reset the timer on win
    } else if (guessesLeft === 0) {
        document.getElementById("result").textContent = "You lose! The word was " + currentWord;
        losses++;
        setTimeout(initGame, 2000);
    } else {
        document.getElementById("result").textContent = "Guesses left: " + guessesLeft;
    }
    document.getElementById("wins").textContent = wins;
    document.getElementById("losses").textContent = losses;
    localStorage.setItem('wins', wins);  // Save updated wins
    localStorage.setItem('losses', losses); // Save updated losses  
}

function giveHint() {
    if (guessesLeft > 1) {
        let unrevealedIndices = [];
        for (let i = 0; i < (maskedWord.length-3); i++) {
            if (maskedWord[i] === "_") {
                unrevealedIndices.push(i);
            }
        }
        if (unrevealedIndices.length > 0) {
            let randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
            maskedWord = maskedWord.substring(0, randomIndex) + currentWord[randomIndex] + maskedWord.substring(randomIndex + 1);
            document.getElementById("word").textContent = maskedWord;
            guessesLeft--;
            document.getElementById("result").textContent = "Guesses left: " + guessesLeft;
        } else {
            document.getElementById("result").textContent = "No more hints available!";
        }
    } else {
        document.getElementById("result").textContent = "Not enough guesses for a hint!";
    }
}
function resetScores() {
    wins = 0;
    losses = 0;
    localStorage.setItem('wins', wins);
    localStorage.setItem('losses', losses);
    
    document.getElementById("wins").textContent = wins;
    document.getElementById("losses").textContent = losses;
    document.getElementById("result").textContent = "Scores have been reset!";
}

document.getElementById("resetScores").addEventListener("click", resetScores);

document.getElementById("guess").addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        document.getElementById("submit1").click(); 
    }
});
const inputField = document.getElementById('guess');
inputField.maxLength = 1;

initGame(); 
