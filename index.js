const originalTextEl = document.getElementById("originalText");
const chiperedTextEl = document.getElementById("chiperedText");

const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const restartButton = document.getElementById("restart");

const liveEl = document.getElementById("live");
const streakEl = document.getElementById("streak");
const highStreakEl = document.getElementById("highStreak");

let originalText = "";
let chiperedText = "";
let currValue = 0;
let lives = 0;

let playing = true;

let streak = 0;
let highStreak = 0;

async function init() {
    streak = 0;
    lives = 5;
    switchRound();
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
