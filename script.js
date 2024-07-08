const PLAYFILED_COLUMNS = 10;
const PLAYFILED_ROWS = 20;

let playfileld;
let smallfileld;
let cells;
let smallCells;
let timerId;
let isPaused = true;
let isGameOver = false;
let overlay = document.querySelector(".overlay");
let btnRestart = document.querySelector(".btn-restart");
let pause = document.querySelector(".pause");
let restart = document.querySelector(".restart");
let scoreElement = document.querySelector(".score");
let score = 0;
let speedIncrease = document.querySelector(".speed-increase");
let speedReduction = document.querySelector(".speed-reduction");
let speed = 0;
let speedElement = document.querySelector(".speed");
let allTetraminos = [];
let isInstructionOpen = false;
let btnInstruction = document.querySelector(".btn-instruction");
let instructionWindow = document.querySelector(".overlay-instruction");
let instruction = document.querySelector(".instruction");
let left = document.querySelector(".left");
let right = document.querySelector(".right");
let down = document.querySelector(".down");
let btnRotate = document.querySelector(".rotate");
let fall = document.querySelector(".fall");



const TETROMINO_NAMES = [
    "O",
    "L",
    "J",
    "I",
    "Z",
    "S",
    "T",
    "T2",
    "plus",
    "point",
    "r",
    "p"
];

const TETROMINOES = {
    "O": [
        [1, 1],
        [1, 1]
    ],

    "L": [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],

    "J": [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],

    "I": [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],

    "Z": [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],

    "S": [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],

    "T": [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],

    "T2": [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],

    "plus": [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],

    "point": [
        [1]
    ],

    "r": [
        [1, 0],
        [1, 1]
    ],

    "p": [
        [1, 1, 1],
        [1, 0, 1],
        [0, 0, 0]
    ]
};

let tetromino = {
    name: "",
    matrix: [],
    column: 0,
    row: 0
};

// COMMON

function init() {
    document.querySelector(".record").innerHTML = localStorage.getItem("gameScore") || 0;
    score = 0;
    scoreElement.innerHTML = 0;
    speed = 0;
    speedElement.innerHTML = 0;
    isGameOver = false;
    generatePlayField();
    generateSmallField();

    cells = document.querySelectorAll(".tetris div");
    smallCells = document.querySelectorAll(".tetramino div");

    allTetraminos.push(randomFigure(TETROMINO_NAMES));

    generateTetromino();
    draw();
};

function convertPositionToIndex(row, column) {
    return row * PLAYFILED_COLUMNS + column
};

function randomFigure(array) {
    let num = Math.floor(Math.random() * array.length);
    return array[num]
};

// GENERATION

//обирається та фіксується данні про наступну деталь
function generateTetromino() {
    allTetraminos.push(randomFigure(TETROMINO_NAMES));
    const nameTetro = allTetraminos[allTetraminos.length - 2];
    const matrix = TETROMINOES[nameTetro];

    drawSmallTetramino()

    const columnTetro = Math.floor(PLAYFILED_COLUMNS / 2 - matrix.length / 2); //початкові позиції фігури
    const rowTetro = -2;

    tetromino = {
        name: nameTetro,
        matrix: matrix,
        column: columnTetro,
        row: rowTetro
    }
};

//малюємо поле та матрицю з 0 відповідно до кожного div
function generatePlayField() {

    for (let i = 0; i < PLAYFILED_COLUMNS * PLAYFILED_ROWS; i++) {
        const div = document.createElement("div");
        document.querySelector(".tetris").append(div);
    };

    playfileld = new Array(PLAYFILED_ROWS).fill()
        .map(() => new Array(PLAYFILED_COLUMNS).fill(0))
};

//малюємо маленьке поле для майбутніх фігур
function generateSmallField() {

    for (let i = 0; i < 25; i++) {
        const div = document.createElement("div");
        document.querySelector(".tetramino").append(div);
    };

    smallfileld = new Array(5).fill()
        .map(() => new Array(5).fill(0))
};


// KEYBOARDS & CLICKS

btnInstruction.addEventListener("click", function(){
    isInstructionOpen = false;
    instructionWindow.style.display = "none";
});

instruction.addEventListener("click", function(){
    isInstructionOpen = true;
    instructionWindow.style.display = "flex";
    if(!isPaused){
        togglePaused();
    }
});

document.addEventListener("keydown", onKeyDown);

pause.addEventListener("click", function (){
        togglePaused();
    });

btnRestart.addEventListener("click", restartGame);
restart.addEventListener("click", restartGame);

speedReduction.addEventListener("click", speedDecreases);

speedIncrease.addEventListener("click", speedIncreases);

left.addEventListener("click", function(){
    if(!isPaused){
        moveTetraminoLeft();
        draw();
    }
});

right.addEventListener("click", function(){
    if(!isPaused){
        moveTetraminoRight();
        draw();
    }
});

down.addEventListener("click", function(){
    if(!isPaused){
        moveTetraminoDoun();
        draw();
    }
});

btnRotate.addEventListener("click", function(){
    if(!isPaused){
        rotate();
        draw();
    }
});

fall.addEventListener("click", function(){
    if(!isPaused){
        dropTetraminoDoun();
        draw();
    }
});

function speedDecreases() {
    if(speed > 0 && score == 0){
        speed -= 1;
        speedElement.innerHTML = speed;
    }
}

function speedIncreases() {
    if(speed < 5){
        speed += 1;
        speedElement.innerHTML = speed;
    }
}

function restartGame() {
    document.querySelector(".tetris").innerHTML = "";
    document.querySelector(".tetramino").innerHTML = "";
    overlay.style.display = "none";
    init();
}

function onKeyDown(event) {
    if(event.key == "Escape") {
        togglePaused();
    }
    if(!isPaused){
        if (event.key == "ArrowLeft") {
            moveTetraminoLeft()
        }else if (event.key == "ArrowRight") {
            moveTetraminoRight()
        }else if (event.key == "ArrowDown") {
            moveTetraminoDoun()
        }else if(event.key == "ArrowUp"){
            rotate()
        }else if(event.key == " "){
            dropTetraminoDoun()
        }
    }
    draw();
};

function moveTetraminoLeft() {
    tetromino.column -= 1;
    if (!isValid()) {
        tetromino.column += 1
    }
};

function moveTetraminoRight() {
    tetromino.column += 1
    if (!isValid()) {
        tetromino.column -= 1
    }
};

function moveTetraminoDoun() {
    tetromino.row += 1
    if (!isValid()) {
        tetromino.row -= 1;
        placeTetramino();
    }
};

function togglePaused() {

    if(isPaused){
        timerId = setTimeout(function tick() {
            moveTetraminoDoun()
            draw();
            timerId = setTimeout(tick, 800 - speed * 100); // (*)
          }, 800 - speed * 100);
        pause.innerHTML = "Pause";
    } else {
        stop();
        pause.innerHTML = "Start"
    }

    isPaused = !isPaused;
};

function draw() {
    cells.forEach(element => element.removeAttribute("class"));
    drawPlayfield();
    drawTetromino();
};

function dropTetraminoDoun() {
    while (isValid()) {
        tetromino.row ++
    }
    tetromino.row --
}

// ROTATE

function rotate() {
    rotateTetramino();
    draw()
}

function rotateTetramino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(oldMatrix);
    tetromino.matrix = rotatedMatrix;
    if(!isValid()){
        tetromino.matrix = oldMatrix
    }
}

function rotateMatrix(matrixTetramino) {
    const N = matrixTetramino.length;
    const rotateMatrix = [];

    for (let i = 0; i < N; i++) {
        rotateMatrix[i] = [];
        for (let j = 0; j < N; j++) {
            rotateMatrix[i][j] = matrixTetramino[N - j - 1][i];            
        }        
    }

    return rotateMatrix
}

// COLLISIONS

function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if(isOutsideofGameboard(row, column)){
                return false
            }
            if(hasCollisions(row, column)){
                return false
            }   
        }        
    }
    return true
}

function isOutsideofGameboard(row, column) {
    return tetromino.matrix[row][column] &&
            (tetromino.row + row >= PLAYFILED_ROWS ||
            tetromino.column + column >= PLAYFILED_COLUMNS ||
            tetromino.column + column < 0)
};

function hasCollisions(row, column) {
    return tetromino.matrix[row][column] && playfileld[tetromino.row + row] ?. [tetromino.column + column]
};

// DRAW

function drawTetromino () {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if(!tetromino.matrix[row][column]){continue}
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            if(cellIndex < 0){continue}  
            cells[cellIndex].classList.add(name)
        }        
    }
};

function drawPlayfield() {

    for (let row = 0; row < PLAYFILED_ROWS; row++) {
        for (let column = 0; column < PLAYFILED_COLUMNS; column++) {
            if(!playfileld[row][column]) continue;
            const nameFigure = playfileld[row][column];
            const cellIndex = convertPositionToIndex(row, column);

            cells[cellIndex].classList.add(nameFigure)
        }
    }
};

function countScore(destroyRows) {
    let startScore = score;
    if(destroyRows == 1){
        score += 1
    }else if(destroyRows == 2){
        score += 3
    }else if(destroyRows == 3){
        score += 5
    }else if(destroyRows == 4){
        score += 7
    };

    if((startScore < 10 && score >= 10) || (startScore < 20 && score >= 20) || 
                    (startScore < 30 && score >= 30) || (startScore < 40 && score >= 40) || (startScore < 50 && score >= 50)){
        speedIncreases()
    }

    scoreElement.innerHTML = score;
}

function placeTetramino() {
    const tetrominoMatrixSize = tetromino.matrix.length;

    if(!isGameOver){
        for (let row = 0; row <tetrominoMatrixSize; row++) {
            for (let column = 0; column < tetrominoMatrixSize; column++) {
                if(convertPositionToIndex(tetromino.row + row, tetromino.column + column) < 0){
                    isGameOver = true;
                    let gameNumber = localStorage.getItem("gameNumber");
                    let gameScore = localStorage.getItem("gameScore");
                    if(!gameNumber){
                        localStorage.setItem("gameNumber", 1);
                        localStorage.setItem("gameScore", score);    
                    }else {
                        let max = Math.max(+gameScore, score);
                        let number = + gameNumber + 1;
                        localStorage.setItem("gameNumber", number);
                        localStorage.setItem("gameScore", max);
                        if(score > +gameScore){
                            document.querySelector(".container-score").style.display = "none";
                            document.querySelector(".container-new-record").style.display = "block";
                            document.querySelector(".container-record").style.display = "none";
                        }else{
                            document.querySelector(".container-score").style.display = "block";
                            document.querySelector(".container-new-record").style.display = "none";
                            document.querySelector(".container-record").style.display = "block";
                        }
                        
                    }
                    overlay.style.display = "flex";
                    document.querySelector(".game-over-score").innerHTML = score;
                    document.querySelector(".game-over-number").innerHTML = localStorage.getItem("gameNumber");
                    document.querySelector(".game-over-record").innerHTML = localStorage.getItem("gameScore");
                    document.querySelector(".new-record").innerHTML = score;

                    return
                }
                if(tetromino.matrix[row][column]){
                    playfileld[tetromino.row + row][tetromino.column + column] = tetromino.name;
                }
            }        
        };
        let filledRows = findFilledRows();
        removeFillRow(filledRows);
        countScore(filledRows.length);
        generateTetromino();
    }
};

function findFilledRows() {
    const fillRows = [];

    for (let row = 0; row < PLAYFILED_ROWS; row++) {
        let filledColumns = 0;

        for (let column = 0; column < PLAYFILED_COLUMNS; column++) {
            if(playfileld[row][column] != 0){
                filledColumns ++;
            }
        }
        
        if(filledColumns == PLAYFILED_COLUMNS){
            fillRows.push(row)
        }
    }

    return fillRows
};

function drawSmallTetramino() {
    smallCells.forEach(element => element.removeAttribute("class"));
    let nextTetraminoMatrix = structuredClone(TETROMINOES[allTetraminos[allTetraminos.length - 1]]);

    nextTetraminoMatrix.unshift([0, 0, 0, 0, 0])

    for (let row = 1; row < nextTetraminoMatrix.length; row++) {
        nextTetraminoMatrix[row].unshift(0);
        for (let column = nextTetraminoMatrix.length; column < 5; column++) {
                nextTetraminoMatrix[row].push(0);
        }        
    }

    for (let row = nextTetraminoMatrix.length; row < 5; row++) {
        nextTetraminoMatrix.push([0, 0, 0, 0, 0])
    }

    for (let row = 0; row < nextTetraminoMatrix.length; row++) {
        for (let column = 0; column < nextTetraminoMatrix.length; column++) {
            if(nextTetraminoMatrix[row][column] == 1){
                smallCells[row * 5 + column].classList.add(allTetraminos[allTetraminos.length - 1]);
            }
        }            
    }
};

// findFilledRows

function removeFillRow(filledRows) {
    for (let i = 0; i < filledRows.length; i++) {
        const row = filledRows[i];
        dropRowsAbove(row)
    }
};

function dropRowsAbove(rowDelete) {
    for (let row = rowDelete; row > 0; row--) {
        playfileld[row] = playfileld[row - 1]
    };
    playfileld[0] = new Array(PLAYFILED_COLUMNS).fill(0);
};

function stop() {
clearTimeout(timerId);

timerId = null;
}

init();
