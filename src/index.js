import "./styles/styles.scss";

console.clear();

/* const */
const container = document.querySelector("#memory-game");
const types = [
  "pink",
  "peachpuff",
  "palevioletred",
  "lightsalmon",
  "lightcoral"
];
const levels = {
  easy: { number: 12 },
  medium: { number: 18 },
  hard: { number: 24 }
};
const modalEnd = document.createElement("div");
const movesCounter = document.createElement("span");

/* vars */
let cardsAmount = 4;
let closedCards = 0;
let movesDone = 0;
let firstCard;
let firstCardType = "";
let currentCard;
let currentCardType = "";
let isMoveEnd = false;

/* functions*/

const init = function () {
  container.classList.add("memory");
  createBar();
  createModal();
  createElements();
};

const restart = function () {
  modalEnd.classList.add("hidden");
  document.querySelector(".memory-table").remove();
  movesDone = 0;
  closedCards = 0;
  createElements();
};

const createBar = function () {
  /* create levels list */
  const levelsList = document.createElement("div");
  levelsList.className = "memory-levels-list";
  const fragment = document.createDocumentFragment();
  for (const levelName in levels) {
    console.log(levels[levelName].number);
    const level = document.createElement("span");
    level.innerHTML = levelName;
    level.className = `memory-level memory-level-${levelName}`;
    level.setAttribute("id", levelName);
    level.setAttribute("data-level", levelName);
    fragment.appendChild(level);
  }
  levelsList.appendChild(fragment);

  /* create moves counter */
  const moves = document.createElement("div");
  moves.className = "memory-moves";
  moves.innerHTML = '<span class="memory-moves-name">Moves</span>';
  movesCounter.className = "memory-moves-counter";
  movesCounter.innerHTML = "9";
  moves.appendChild(movesCounter);

  /* create bar and appends to it */
  const bar = document.createElement("div");
  bar.className = "memory-bar";
  bar.appendChild(levelsList);
  bar.appendChild(moves);
  container.appendChild(bar);
};

const createElements = function () {
  const table = document.createElement("div");
  table.className = "memory-table";
  const fragment = document.createDocumentFragment();
  const colorsSet = getColors();
  for (let i = 1; i <= cardsAmount; i++) {
    let card = document.createElement("div");
    card.setAttribute(
      "data-memory",
      // get random element from colorsSet array and delete it
      colorsSet.splice(getRandom(0, colorsSet.length - 1), 1)
    );
    card.className = `memory-card card-${i}`;
    card.addEventListener("click", reverseCard.bind(card));
    fragment.appendChild(card);
  }
  table.appendChild(fragment);
  container.appendChild(table);
};

const createModal = function () {
  modalEnd.className = "memory-end-message memory-message hidden";
  modalEnd.innerHTML =
    "<h3 class='score-outer'>Moves done: <span class='score'>0</score></h3>";
  const btn = document.createElement("button");
  btn.className = "btn btn-primary";
  btn.id = "retry";
  btn.innerHTML = "Retry";
  btn.addEventListener("click", restart);
  modalEnd.appendChild(btn);
  container.appendChild(modalEnd);
};

const getColors = function () {
  let newSet = types.slice(0, cardsAmount / 2);
  newSet = newSet.concat(newSet); /* double colors for pairs */
  return newSet;
};

const getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const reverseCard = function () {
  if (isMoveEnd) {
    isMoveEnd = false;
    reverseCards(firstCard, currentCard);
  }
  currentCard = this;
  currentCardType = this.getAttribute("data-memory");
  currentCard.classList.add(currentCardType);
  if (firstCard === undefined) {
    firstCard = currentCard;
    firstCardType = currentCardType;
  } else {
    if (currentCardType === firstCardType) {
      fadeCards(firstCard, currentCard);
    } else {
      isMoveEnd = true;
    }
  }
};

const endMove = function () {
  movesDone++;
  movesCounter.innerHTML = movesDone;
  firstCard = undefined;
  firstCardType = "";
  currentCard = undefined;
  currentCardType = "";
};

const reverseCards = function (a, b) {
  a.classList.remove(a.getAttribute("data-memory"));
  b.classList.remove(b.getAttribute("data-memory"));
  endMove();
};

const fadeCards = function (a, b) {
  a.classList.add("hidden");
  b.classList.add("hidden");
  closedCards++;
  endMove();
  if (isEnd()) {
    endOfGame();
  }
};

const isEnd = function () {
  return !(closedCards * 2 < cardsAmount);
};

const endOfGame = function () {
  document.querySelector(".score").innerHTML = movesDone;
  modalEnd.classList.remove("hidden");
};

/* initialize of game */

init();

/* TO DO:

3. oganąć licznik ruchów ---czasu
4. pozwolić na wybór poziomu trudności 10 / 15 / 20 elementów
5. przechowywanie highScore w ciasteczku
6. poprawić odwracanie elementów, bo to działa dziwnie :/
7. wyświetlić czas i rekord
8. no i zrobić refaktorkę tego colors -> types itp.

DONE:

1. oskryptować button zacznik do nowa

REJECTED
2. dodać button start


*/
