/* ---------------------
fase di preparazione 
-----------------------*/

// recuperare dalla pagina tutti gli elementi di interesse
const scoreCounter = document.querySelector('.score-counter');
const grid = document.querySelector('.grid');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again')

// preparo delle informazione utili alla logica di gioco
const totalCells = 100;
const totalBombs = 16;
const maxScore = totalCells - totalBombs;
const bombsList = [];
let score = 0;

//Generare TOT bombe casuali
while(bombsList.length < totalBombs){
    const number = Math.floor(Math.random() * totalCells) + 1;
    if (!bombsList.includes(number)) {
        bombsList.push(number);
    }
}

console.log(bombsList);

/* ------------------------
griglia e logica di gioco
---------------------------*/

let isCellEven = false;
let isRowEven = false;

for (let i = 1; i <= totalCells; i++) {
    // creo un elemento e gli do la classe 'cell'
    const cell = document.createElement('div');
    cell.classList.add('cell');
    
    isCellEven = i % 2 === 0;
    
     // se la riga è pari e la cella è pari: casella grigia
     if (isRowEven && isCellEven) cell.classList.add('cell-dark');
     // se la riga è dispari e la cella è dispari: casella grigia
    else if (!isRowEven && !isCellEven) cell.classList.add('cell-dark');

    /* oppure è possibile scriverlo anche in questo modo:
    if (isRowEven && isCellEven) cell.classList.add('cell-dark') || (!isRowEven && !isCellEven) cell.classList.add('cell-dark') */
    
    if (i % 10 === 0) isRowEven = !isRowEven;
    
    // * gestiamo il click della cella
    cell.addEventListener('click', function () {
        //!controllo che la cella non sia stata gia cliccata
        if (cell.classList.contains('cell-clicked')) return;

        if (bombsList.includes(i)) {
            //se e una bomba ..
            cell.classList.add('cell-bomb');
            endGame(false);
        } else {
            // se non lo e ...
            cell.classList.add ('cell-clicked');
            updateScore();
        }
    });
    
    // lo inserisco nella griglia
    grid.appendChild(cell);
}

/* --------------
funzioni
-------------- */

// funzione per aggiornare il punteggio
function updateScore() {
    // Incremento lo score
    score++;
    // Lo inserisco nel contatore
    scoreCounter.innerText = String(score).padStart(5, 0);
    
    // Controlliamo se l'utente ha vinto
    if (score === maxScore) endGame(true);
}

// funzione per decretare la fine del gioco
function endGame (isVictory) {
    if (isVictory === true) {
        //coloriamo di verde e cambiamo il messaggio
        endGameScreen.classList.add('win');
        endGameText.innerHTML = 'YOU<br>WIN'
    } else {
        //riveliamo tutte le bombe
        revealAllBombs();
    }
    //mostriamo la schermata rimuovendo la classe 
    endGameScreen.classList.remove('hidden');
}

// funzione per ricarire la pagina
function playAgain() {
    location.reload();
}

//* BONUS
//funzione che rivela tutte le bombe
function revealAllBombs() {
    //recupero tutte le celle
    const cells = document.querySelectorAll('.cell');
    for (let i = 1; i <= cells.length; i++) {
        //controllo se la cella è una bomba
        if (bombsList.includes (i)) {
            const cellToReveal = cells [i - 1];
            cellToReveal.classList.add('cell-bomb');
        }
    }
}

/* ----------
eventi
----------- */

//gestiamo il click sul tasto rigioca 
playAgainButton.addEventListener('click', playAgain);



