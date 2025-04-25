
const socket = io();
const boxes = document.querySelectorAll(".box");
const statusText = document.querySelector("h3");

let playerSymbol = null;
let myTurn = false;
let gameOver = false;
let turnCount = 0;

// Assign symbol
socket.on("assignSymbol", (symbol) => {
  playerSymbol = symbol;
  myTurn = symbol === "X";
  statusText.innerText = myTurn ? "Your turn (X)" : "Opponent's turn (X)";
});

// Listen to moves
socket.on("events", ({ button, value }) => {
  const box = document.querySelector(`[data-index="${button}"]`);
  if (box && box.textContent === "") {
    box.textContent = value;
    box.style.backgroundColor = value === "X" ? "lightblue" : "#be8f8f";
    turnCount++;
    checkWin();
    myTurn = true;
    if (!gameOver) {
      statusText.innerText = "Your turn";
    }
  }
});

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (!myTurn || gameOver || box.textContent !== "") return;

    const index = box.getAttribute("data-index");
    box.textContent = playerSymbol;
    box.style.backgroundColor =
      playerSymbol === "X" ? "lightblue" : "#be8f8f";

    socket.emit("events", {
      button: index,
      value: playerSymbol,
    });

    myTurn = false;
    turnCount++;
    checkWin();

    if (!gameOver) {
      statusText.innerText = "Opponent's turn";
    }
  });
});

function checkWin() {
  const patterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let pattern of patterns) {
    const [a, b, c] = pattern;
    const va = boxes[a].textContent;
    const vb = boxes[b].textContent;
    const vc = boxes[c].textContent;

    if (va && va === vb && vb === vc) {
      statusText.innerText = `${va} wins!`;
      boxes[a].classList.add("winner");
      boxes[b].classList.add("winner");
      boxes[c].classList.add("winner");
      gameOver = true;

      setTimeout(resetGame, 4000);
      return;
    }
  }

  if (turnCount === 9 && !gameOver) {
    statusText.innerText = "Draw!";
    gameOver = true;
    setTimeout(resetGame, 4000);
  }
}

function resetGame() {
  boxes.forEach((box) => {
    box.textContent = "";
    box.classList.remove("winner");
    box.style.backgroundColor = "";
  });
  gameOver = false;
  turnCount = 0;
  myTurn = playerSymbol === "X";
  statusText.innerText = myTurn ? "Your turn" : "Opponent's turn";
}
