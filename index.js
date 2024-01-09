"use strict";

const squaresEl = document.querySelectorAll(".square");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

let score = 0;
let highScore = 0;

let playing = true;

let sequence = [1, 2, 3, 4];

// let events = [addSquare, changeColor];
// let squares = 4;

squaresEl.forEach((square, index) => {
    square.addEventListener("click", function () {
        if (playing) {
            console.log(square, index);
        }
    });
});

// TODO: Handle Render (10 Attempts)
function handleRender() {
    if (playing) {
        for (let i = 0; i < sequence.length; i++) {
            (function (index) {
                setTimeout(function () {
                    squaresEl[sequence[index] - 1].style.backgroundColor =
                        "#2ecc71";
                }, i * 2000); // Delay based on the loop index
                setTimeout(function () {
                    squaresEl[sequence[index] - 1].style.backgroundColor =
                        "grey";
                }, (i + 1) * 2000); // Delay for reverting color
            })(i);
        }
    }
}

handleRender();
function startGame() {
    playing = true;
    sequence = [];
    score = 0;
    scoreEl.textContent = 0;
    handleRender();
}

startGame();
function addSquare() {}

function changeColor() {}
