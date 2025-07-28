function Gameboard() {
  const gameboard = Array.from({ length: 9 }, (val, idx) => "");
  const Status = {
    INVALID: 0,
    ONGOING: 1,
    X_WINS: 2,
    O_WINS: 3,
    DRAW: 4,
  };
  const getBoard = () => gameboard;
  const getCell = (idx) => gameboard[idx];
  const setCell = (idx, sign) => {
    if (!getCell(idx)) {
      gameboard[idx] = sign;
      if (gameboard.every((cell) => cell != "")) return Status.DRAW;
      const rowStart = Math.floor(idx / 3) * 3;
      const colStart = idx % 3;
      if (
        [rowStart, rowStart + 1, rowStart + 2].every(
          (index) => gameboard[index] === sign
        ) ||
        [colStart, colStart + 3, colStart + 6].every(
          (index) => gameboard[index] === sign
        ) ||
        (idx % 2 == 0 &&
          ([0, 4, 8].every((index) => gameboard[index] === sign) ||
            [2, 4, 6].every((index) => gameboard[index] === sign)))
      )
        return sign === "X" ? Status.X_WINS : Status.O_WINS;
      return Status.ONGOING;
    } else return Status.INVALID;
  };
  const resetBoard = () => {
    for (let i = 0; i < 9; i++) gameboard[i] = "";
  };
  return { getBoard, getCell, setCell, resetBoard };
}
function UI() {
  const container = document.getElementById("container");
  const announcementDiv = document.getElementById("announcementDiv");
  const scoreDiv = document.getElementById("scoreDiv");
  const resetBtn = document.getElementById("resetBtn");
  Array.from({ length: 9 }, (val, idx) => idx).forEach((idx) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-id", idx);
    cell.textContent = " ";
    container.appendChild(cell);
  });
  const displayScore = (score) => {
    scoreDiv.textContent = `X: ${score["X"]} , O: ${score["O"]}`;
  };
  const displayAnnouncement = (announcement) => {
    announcementDiv.textContent = announcement;
  };
  const disableUI = (disabled) => {
    container.classList.toggle("disabled", disabled);
  };
  const displayBoard = (cells) =>
    Array.from(container.children).forEach(
      (cellDiv, idx) => (cellDiv.textContent = cells[idx])
    );
  const addListenerToCellDivs = (listener) =>
    Array.from(container.children).forEach((cellDiv) =>
      cellDiv.addEventListener("click", listener)
    );
  const addListenerToResetBtn = (listener) =>
    resetBtn.addEventListener("click", listener);
  return {
    displayScore,
    displayAnnouncement,
    displayBoard,
    addListenerToCellDivs,
    addListenerToResetBtn,
    disableUI,
  };
}
function GameController(ui, gameboard) {
  const score = { X: 0, O: 0 };
  const announcements = [
    "Invalid move",
    "End of turn",
    "X wins!",
    "O wins!",
    "Draw",
  ];

  let sign = Math.floor(Math.random() * 2) == 1 ? "X" : "O";
  const resetGame = () => {
    ui.disableUI(false);
    gameboard.resetBoard();
    ui.displayBoard(gameboard.getBoard());
    sign = Math.floor(Math.random() * 2) == 1 ? "X" : "O";
    ui.displayAnnouncement(`Player ${sign} turn`);
  };
  ui.displayAnnouncement(`Player ${sign} turn`);
  ui.displayScore(score);
  ui.addListenerToResetBtn(resetGame);
  ui.addListenerToCellDivs((e) => {
    const idx = e.target.dataset.id;
    let result = gameboard.setCell(idx, sign);
    ui.displayAnnouncement(announcements[result]);
    if (result !== 0) {
      ui.displayBoard(gameboard.getBoard());
      if (result === 1) {
        sign = sign === "X" ? "O" : "X";
        ui.displayAnnouncement(`Player ${sign} turn`);
      } else {
        ui.displayAnnouncement(announcements[result]);
        if (result !== 4) score[sign]++;
        ui.displayScore(score);
        ui.disableUI(true);
      }
    }
  });
}

(function start() {
  document.addEventListener("DOMContentLoaded", () => {
    GameController(UI(), Gameboard());
  });
})();
