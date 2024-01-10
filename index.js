const originalTextEl = document.getElementById("originalText");
const chiperedTextEl = document.getElementById("chiperedText");

const upButton = document.getElementById("up");
const valueEl = document.getElementById("value");
const downButton = document.getElementById("down");
const submitButton = document.getElementById("submit");
const restartButton = document.getElementById("restart");

const liveEl = document.getElementById("live");
const streakEl = document.getElementById("streak");
const highStreakEl = document.getElementById("highStreak");

let originalText = "";
let chiperedText = "";
let inputValue = 0;
let currValue = 0;

let streak = 0;
let highStreak = 0;

async function init() {
    streak = 0;
    await switchRound();
}
init();

async function switchRound() {
    await updateElements();
    renderElement();
}

async function updateElements() {
    originalText = await generateWord();
    currValue = generateValue();
    chiperedText = caesarChiper(originalText, currValue);
    // console.log(originalText, chiperedText, currValue);
}

function generateValue() {
    value = Math.floor(Math.random() * 26) + 1;
    return value;
}

async function generateWord() {
    const response = await fetch("https://random-word-api.herokuapp.com/word");
    const data = await response.json();
    return data[0];
}

function caesarChiper(text, value) {
    return text
        .split("")
        .map((char) => {
            if (char.match(/[a-zA-Z]/)) {
                const charCode = char.charCodeAt(0);
                const isUpperCase = char === char.toUpperCase();
                const baseCharCode = isUpperCase
                    ? "A".charCodeAt(0)
                    : "a".charCodeAt(0);
                const shiftedCharCode =
                    ((charCode - baseCharCode + value) % 26) + baseCharCode;
                return String.fromCharCode(shiftedCharCode);
            } else {
                return char;
            }
        })
        .join("");
}

function renderElement() {
    originalTextEl.textContent = originalText;
    chiperedTextEl.textContent = chiperedText;
    streakEl.textContent = streak;
    highStreakEl.textContent = highStreak;
}

upButton.addEventListener("click", function () {
    inputValue++;
    if (inputValue > 26) {
        inputValue = 1;
    }
    valueEl.textContent = inputValue;
});

downButton.addEventListener("click", function () {
    inputValue--;
    if (inputValue < 0) {
        inputValue = 26;
    }
    valueEl.textContent = inputValue;
});

function handleGuess() {
    if (inputValue === currValue) {
        streak++;
        streakEl.textContent = streak;
        if (streak > highStreak) {
            highStreak = streak;
        }
        switchRound();
    } else {
        streak = 0;
        streakEl.textContent = streak;
        switchRound();
    }
}

submitButton.addEventListener("click", handleGuess);
