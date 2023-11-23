/* e un game loop */

const grid = document.querySelector('.grid');
const stackBtn = document.querySelector('.stack')
const scoreCounter = document.querySelector('.score-counter');

const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again');

// 0 = cella vuota
// 1 = barra

const gridMatrix = [
    [0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0,],
    [1, 1, 1, 0, 0, 0,]
];

//prepariamo dalle informazioni necessarie alla logica di gioco
let currentRowIndex = gridMatrix.length - 1;
let barDirection = 'right';
let barSize = 3;
let isGameOver = false;
let score = 0;
let t;

function draw () {
    grid.innerHTML = '';
    
    gridMatrix.forEach(function(rowContent, rowIndex) {
        rowContent.forEach(function(cellContent, cellIndex) {
            //creiamo una cella 
            const cell = document.createElement('div');
            cell.classList.add('cell');
            //cell.innerText = cellContent;
            
            //stile della scacchiera
            const isRowEven = rowIndex % 2 === 0;
            const isCellEven = cellIndex % 2 === 0;
            
            if ((isRowEven && isCellEven) || (!isRowEven && !isCellEven)){
                cell.classList.add('cell-dark');
            }
            
            //la cella è parte della barra
            if (cellContent === 1) {
                cell.classList.add('bar');
            }
            
            // inseriamo nella griglia
            grid.appendChild(cell);
        });
    });
}

function moveRight (row) {
    //const row = gridMatrix[currentRowIndex];
    row.pop();
    row.unshift(0);
    console.log(row);
}

function moveLeft (row) {
    //const row = gridMatrix[currentRowIndex];
    row.shift();
    row.push(0);
    console.log(row);
}

function isRightEdge (row) {
    const lastElement = row[row.length - 1];
    return lastElement === 1;
}

function isLeftEdge(row) {
    const firstElement = row[0];
    return firstElement === 1;
    
}

function moveBar () {
    const currentRow = gridMatrix[currentRowIndex];
    
    if (barDirection === 'right') {
        moveRight(currentRow);
        
        if (isRightEdge(currentRow)) {
            barDirection = 'left';
        }
        
    } else if (barDirection === 'left') {
        moveLeft(currentRow);
        
        if (isLeftEdge(currentRow)) {
            barDirection = 'right';
        }
    }
}

function checkLost () {
    // salvo in variabile un riferimento
    //alla riga corrente e alla riga precedente
    const currentRow = gridMatrix[currentRowIndex];
    const prevRow = gridMatrix[currentRowIndex  + 1];
    
    //se non esiste una riga precedente (inizio gioco)
    if (!prevRow)
    return;
    
    //controllo se ogni elemento della barra
    //esiste almeno un elemento dello stack accumulato
    for (let i = 0; i < currentRow.length; i++) {
        // se sotto un elemento della barra
        // non c'è un elemento dello stack accumulato
        if (currentRow[i] === 1 && prevRow[i] === 0) {
            // rimuovo il pezzo della barra
            // e la accorcio di un elemento
            currentRow[i] = 0;
            barSize--;
            // se la barra non ha più elementi
            // hai perso il gioco!
            if (barSize === 0) {
                isGameOver = true;
                clearInterval(t);
                scoreCounter.innerText = '00000';
                //window.alert('hai perso!');
                endGame(false);
            }
        }
    }
}

function checkWin () {
    if (currentRowIndex === 0) {
        isGameOver = true;
        clearInterval(t);
        //window.alert('hai vinto!');
        endGame(true);
    }
}

function onStack () {
    // controllo se ho vinto o perso
    checkLost();
    checkWin();
    //aggiorno il punteggio
    updateScore();
    // ho finito il gioco?
    if (isGameOver) 
    return;
    
    //cambio riga
    currentRowIndex--;      /* => currentRowIndex = currentRowIndex - 1; */
    barDirection = 'right'
    // disegno la barra
    for (let i = 0; i < barSize; i++) {
        gridMatrix[currentRowIndex][i] = 1;   
    }
    
    draw();
    
}

function updateScore() {
    //score++;
    //scoreCounter.innerText = score.toString().padStart( 5,'0')
    
    //total score ' punteggio basato sui blocchi rimanenti
    const finalBlock = document.querySelectorAll('.bar');
    scoreCounter.innerText = finalBlock.length.toString().padStart(5, '0');
}

// funzione per decretare la fine del gioco
function endGame (isVictory) {
    if (isVictory === true) {
        //coloriamo di verde e cambiamo il messaggio
        endGameScreen.classList.add('win');
        endGameText.innerHTML = 'YOU<br>WIN'
    }
    //mostriamo la schermata rimuovendo la classe 
    endGameScreen.classList.remove('hidden');
}

function onPlayAgain () {
    location.reload();
}


function main () {
    // update
    moveBar();
    // disegno
    draw();
}


// Events
stackBtn.addEventListener('click', onStack);
playAgainButton.addEventListener('click', function() {
    location.reload();
});
//first draw
draw();

t = setInterval (main,600);