const wordText= document.querySelector(".word");
hintText= document.querySelector(".hint span");
timeText= document.querySelector(".time b");
inputField= document.querySelector("input");
refreshBtn= document.querySelector(".refresh-word");
checkBtn= document.querySelector(".check-word");
const hintDisplay = document.querySelector(".hint-display");
const hintBtn = document.querySelector(".hint-btn"); // Select hint button
let hintUsed = false; 

let correctWord,timer;

const initTimer = maxTime=> {
    clearInterval(timer);
    timer=setInterval(()=>{
       
        if(maxTime>0){
            maxTime--;
            return timeText.innerText= maxTime;
        }
        clearInterval(timer);
        alert(`time off! ${correctWord.toUpperCase()} was the correct word`);
        initGame();
    },1000);
}

const initGame=()=>{
    initTimer(30);
    let randomObj= words[Math.floor(Math.random()*words.length)];
    let wordArray= randomObj.word.split("");
    for(let i= wordArray.length-1; i>0; i--){
        let j= Math.floor(Math.random()*(i+1));
        [wordArray[i], wordArray[j]]= [wordArray[j], wordArray[i]];
    }
    wordText.innerText= wordArray.join("");
    hintText.innerText= randomObj.hint;
    correctWord= randomObj.word.toLowerCase();
    inputField.value="";
    inputField.setAttribute("mexlength", correctWord.length);
    hintUsed = false; // Reset hint usage for a new game
    hintDisplay.innerText = "";
}
initGame();

const checkWord=()=>{
    let userWord= inputField.value.toLocaleLowerCase();
    if(!userWord) return alert("Please enter a word");
    if(userWord !== correctWord) return alert(`Oops! ${userWord} is not the correct word`);
    alert(`Congratulation! ${userWord.toUpperCase()} is the correct word`);
    initGame();
}

const giveHint = () => {
    if (hintUsed) return; // Prevent multiple hints in one game

    let hintArray = wordText.innerText.split("");  // Copy the scrambled word

    // Reveal the first and last correct letters (if the word length is 4+)
    hintArray = correctWord.split("").map((letter, index) => {
        if (index < 2 || index >= correctWord.length - 2) return letter;  // Reveal 1st and last 2 letters
        return "_";  // Hide other letters
    });

    hintDisplay.innerText = `Hint: ${hintArray.join("")}`;
    hintUsed = true;  // Mark hint as used
};

hintBtn.addEventListener("click", giveHint);
refreshBtn.addEventListener("click", initGame);
checkBtn.addEventListener("click",checkWord);

inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkBtn.click();
    }
});

