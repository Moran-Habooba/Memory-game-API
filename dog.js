const tilesContainer = document.querySelector(".tiles");

let allTiles = [];

let tiles = [];
let currentId = 0;

function getTiles() {
  return tiles;
}

function addTile() {
  const newTile = {
    name: `pic${currentId}`,
    src: `${""}`,
    isFlipped: false,
  };
  allTiles.push(newTile);

  return newTile;
}

function findAllTilesIndex(id) {
  const index = tiles.findIndex((tile) => tile.id === id);

  return index === -1 ? null : index;
}

function changeTilesIsFlipped(id) {
  const index = findAllTilesIndex(id);
  if (typeof index !== "number") {
    return null;
  }

  tiles[index].isFlipped = !tiles[index].isFlipped;

  flippedTiles.push(tiles[index]);
  return tiles[index];
}

function shuffleTiles(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createTiles(tilesNumber) {
  allTiles = [];
  if (tilesNumber !== 16 && tilesNumber !== 24) {
    throw new Error("Invalid number of tiles");
  }
  for (let i = 0; i < tilesNumber / 2; i++) {
    currentId++;
    addTile();
    tiles.push({ ...allTiles[i] });
    tiles.push({ ...allTiles[i] });
  }
  renderAllTiles();
  const fetchUrl = level2
    ? "https://dog.ceo/api/breeds/image/random/12"
    : "https://dog.ceo/api/breeds/image/random/8";
  fetch(fetchUrl)
    .then((response) => response.json())
    .then((responseData) => {
      const data = responseData.message.slice(0, tiles.length * 2);
      const imgElements = document.getElementsByClassName("front-tile");
      for (let i = 0; i < imgElements.length; i++) {
        imgElements[i].src = data[i % data.length];
        tiles[i].src = data[i % data.length];
      }
    })
    .catch((error) => {
      throw new Error("Error:", error);
    });

  shuffleTiles(tiles);
  currentId = 0;
  for (let tile of tiles) {
    currentId++;
    tile.id = currentId;
  }
  return tiles;
}

function playSound(audio) {
  const sound = document.getElementById("sound");
  audio = new Audio(`./Cartoon Weird Noise Short Mouth Popping 02.mp3`);
  sound.play();
}
function playSoundEndGame() {
  sound.src = "./Audience Clapping - Sound Effect  מחיאת כפיים.mp3";
  sound.play();
}

// RENDER

const gameZone = document.getElementById("game-zone");
const $pairsFound = document.getElementById("paired-found-counter");
let $flippedTiles = [];
let flippedTiles = [];
let matchesTiles = [];
let pauseGame = false;
const startTime = new Date();
let timeCounter = 0;

gameZone.addEventListener("click", (e) => {
  if (e.target.matches(".back-tile") && !pauseGame) {
    playSound();
    $flippedTiles.push(e.target);
    const tileId = Number(e.target.closest(".tile-container").dataset.tileId);
    renderFlipTile(tileId);
    e.target.classList.add("d-none");
    checkTilesMatch();
  }
});

function renderTile(index) {
  return `
  <div data-tile-id="${tiles[index].id}" class="tile-container col tile center-all">
    <img class="back-tile" src="./pic/Dog-back.jpg" alt="" />
    <img class="front-tile" src="" alt="" />
  </div>
  `;
}
function renderAllTiles() {
  let html = "";
  for (let i in tiles) {
    html += renderTile(i);
  }
  gameZone.innerHTML = html;
}

function renderFlipTile(id) {
  changeTilesIsFlipped(id);

  return tiles[findAllTilesIndex(id)];
}

const btn_startGame = document.querySelector(".btn_startGame");
const playerName = document.querySelector(".playerName");
const startGame = document.querySelector(".startGame");
const levels = document.querySelector(".levels");

let level2 = false;

btn_startGame.addEventListener("click", startTheGame);
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    startTheGame();
  }
});

function startTheGame() {
  if (playerName.value.length >= 2) {
    setInterval(() => timeCounter++, 1000);
    localStorage.setItem("player's- name", playerName.value);
    startGame.style.display = "none";
    $pairsFound.classList.remove("d-none");
    levels.classList.remove("d-none");

    createTiles(16);
    renderAllTiles();
    return;
  }
  return alert("השם חייב להכיל לפחות 2 תווים");
}
function checkTilesMatch() {
  if (flippedTiles.length === 2) {
    const imgSrc1 = flippedTiles[0].src;
    const imgSrc2 = flippedTiles[1].src;
    if (imgSrc1 === imgSrc2) {
      matchesTiles.push(flippedTiles[0]);
      matchesTiles.push(flippedTiles[1]);
      $pairsFound.innerHTML = `זוגות שנמצאו - ${matchesTiles.length / 2}`;

      resetFlippedTiles();
      return setTimeout(() => checkWin(), 500);
    }
    pauseGame = true;
    return setTimeout(() => {
      autoFlipBack();
      pauseGame = false;
    }, 600);
  }
}

function autoFlipBack() {
  $flippedTiles[0].classList.remove("d-none");
  $flippedTiles[1].classList.remove("d-none");
  changeTilesIsFlipped(flippedTiles[0].id);
  changeTilesIsFlipped(flippedTiles[1].id);
  resetFlippedTiles();
}

function resetFlippedTiles() {
  $flippedTiles = [];
  flippedTiles = [];
}
function checkWin() {
  if (matchesTiles.length === tiles.length && !level2) {
    $pairsFound.textContent = "";
    gameZone.innerHTML = "";
    const winTitle = document.querySelector(".win-title");
    winTitle.innerHTML = "👏👏👏 עברת לשלב הבא ";
    setTimeout(() => goToNextLevel(), 3000);
  } else {
    if (matchesTiles.length === tiles.length) {
      return checkEndGame();
    }
  }
}

function resetFlippedTiles() {
  $flippedTiles = [];
  flippedTiles = [];
}

function secondsToFormattedTime(SECONDS) {
  return new Date(SECONDS * 1000).toISOString().slice(11, 19);
}

function updateShortestTime() {
  const highestScore =
    localStorage.getItem("highestScore") === null
      ? null
      : Number(localStorage.getItem("highestScore"));
  const endTime = Date.now();
  const timeElapsed = endTime - startTime;

  const didBreakHighestScore = timeCounter < highestScore;
  if (highestScore === null || didBreakHighestScore) {
    localStorage.setItem("highestScore", timeCounter);
    localStorage.setItem(
      "highestScore-name",
      localStorage.getItem("player's- name")
    );
    document.querySelector(".saveTime").innerHTML = `
       ${playerName.value} סיימ/ה את המשחק מהר יותר:  ${secondsToFormattedTime(
      timeCounter
    )}
    `;

    return;
  }

  document.querySelector(".saveTime").innerHTML = `
       הזמן הקצר ביותר: ${secondsToFormattedTime(highestScore)}
    `;
  if (highestScore < localStorage.getItem("highestScore")) {
    document.querySelector(".currentHigheScore").innerHTML = `
      השיא הנוכחי הוא של: ${localStorage.getItem("player's- name")}
      `;
  }
}

// שלב 2

function goToNextLevel() {
  level2 = true;
  levels.innerHTML = `שלב 2`;
  document.querySelector(".saveTime").innerHTML = "";
  document.querySelector(".timer").innerHTML = "";
  document.querySelector(".win-title").innerHTML = "";
  tiles = [];
  matchesTiles = [];
  currentId = 0;
  resetGame();
  $pairsFound.innerHTML = `זוגות שנמצאו - ${matchesTiles.length / 2}`;
  checkTilesMatch();
}

function resetGame() {
  resetFlippedTiles();
  createTiles(24);
  renderAllTiles();
}

function checkEndGame() {
  $pairsFound.textContent = "";
  gameZone.innerHTML = "";
  $pairsFound.textContent = "";
  gameZone.innerHTML = "";
  const winTitle = document.querySelector(".win-title");
  winTitle.innerHTML = "😎 סיימת את המשחק ";
  playSoundEndGame();
  document.querySelector(
    ".timer"
  ).textContent = `הזמן שעבר מתחילת המשחק: ${secondsToFormattedTime(
    timeCounter
  )}`;
  updateShortestTime();
  setTimeout(() => location.reload(), 3500);
}

// קיצור דרך להפיכת כל הקלפים לצורך בדיקות
function flipAllTiles() {
  matchesTiles.length = tiles.length;
  checkWin();
}
