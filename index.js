const gameContainer = document.querySelector(".container-game");
const allChildElements = [...gameContainer.children];

const originalTextEl = document.getElementById("originalText");
const chiperedTextEl = document.getElementById("chiperedText");

const upButton = document.getElementById("up");
const valueEl = document.getElementById("value");
const downButton = document.getElementById("down");
const submitButton = document.getElementById("submit");

const actualValueEl = document.getElementById("actualValue");

const restartButton = document.getElementById("restart");

const liveEl = document.getElementById("live");
const streakEl = document.getElementById("streak");
const streakDiv = document.getElementById("streak-div");
const highStreakEl = document.getElementById("highStreak");

let originalText = "";
let chiperedText = "";
let inputValue = 0;
let currValue = 0;

let streak = 0;
let highStreak = 0;

restartButton.addEventListener("click", init);

async function init() {
    disableInput();
    streak = 0;
    streakDiv.classList.remove("mediumStreak");
    streakDiv.classList.remove("highStreak");
    await switchRound();
}
init();

async function switchRound() {
    await updateElements();
    renderElement();
    enableInput();
}

async function updateElements() {
    actualValueEl.textContent = "";
    originalText = await generateWord();
    currValue = generateValue();
    chiperedText = caesarChiper(originalText, currValue);
}
function disableInput() {
    upButton.classList.add("disabled");
    downButton.classList.add("disabled");
    submitButton.classList.add("disabled");
}
function enableInput() {
    upButton.classList.remove("disabled");
    downButton.classList.remove("disabled");
    submitButton.classList.remove("disabled");
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
    valueEl.textContent = `${inputValue < 10 ? "0" : ""}${inputValue}`;
});

downButton.addEventListener("click", function () {
    inputValue--;
    if (inputValue < 0) {
        inputValue = 26;
    }
    valueEl.textContent = `${inputValue < 10 ? "0" : ""}${inputValue}`;
});

const addAndRemoveClass = (indices, className) => {
    indices.forEach((index) => {
        allChildElements[index].classList.add(className);
        setTimeout(() => {
            allChildElements[index].classList.remove(className);
        }, 2000);
    });
};

function handleGuess() {
    disableInput();
    if (inputValue === currValue) {
        streak++;
        streakEl.textContent = streak;
        if (streak > 5) {
            streakDiv.classList.add("mediumStreak");
        } else if (streak > 10) {
            streakDiv.classList.add("highStreak");
        }
        if (streak > highStreak) {
            highStreak = streak;
        }
        addAndRemoveClass([1, 3, 5, 7], "correct");
        addAndRemoveClass([4], "correctButFaster");
        setTimeout(() => {
            addAndRemoveClass([2, 6], "correct");
            setTimeout(() => {
                switchRound();
            }, 4000);
        }, 500);
    } else {
        streak = 0;
        streakEl.textContent = streak;
        streakEl.classList.remove("mediumStreak");
        streakEl.classList.remove("highStreak");
        actualValueEl.textContent = `Actual value: ${currValue}`;
        addAndRemoveClass([1, 3, 5, 7], "wrong");
        addAndRemoveClass([4], "wrongButFaster");
        setTimeout(() => {
            addAndRemoveClass([2, 6], "wrong");
            setTimeout(() => {
                switchRound();
            }, 4000);
        }, 500);
    }
}

submitButton.addEventListener("click", function () {
    console.log("clicked");
    handleGuess();
});
