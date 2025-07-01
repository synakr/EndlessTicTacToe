// Player 1 (uses Circle symbol) is associated with clr1 (red-ish)
// Player 2 (uses Cross symbol) is associated with clr2 (blue-ish)
const clr1 = `#B75E77`;
const clr2 = `#B0D7FF`;

let currentPlayerColor;
let currentPlayerSymbol;
let currentTurnMessageElement; // To display whose turn it is / winner

let cross = `<i class="fa-solid fa-xmark logo"></i>`; // Symbol for Player 2
let circle = `<i class="fa-regular fa-circle logo"></i>`; // Symbol for Player 1
let win = false;
const queue = []; // Stores {index, playerSymbol} objects
const player1Moves = []; // Stores box indices clicked by Player 1 (Circle)
const player2Moves = []; // Stores box indices clicked by Player 2 (Cross)

const winArray = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
];

// Function to check for a win
function checkWin(playerMovesArray) {
    let winRow = [];
    winArray.some(combination => {
        if (combination.every(index => playerMovesArray.includes(index))) {
            winRow = combination;
            return true; // Exit .some() loop
        }
        return false;
    });
    return winRow; // Returns the winning combination or an empty array
}

// Function to make winning boxes glow
function glowBox(combination) {
    combination.forEach((i, idx) => {
        let originalColor = boxes[i].style.backgroundColor; // Should ideally get actual original, not current
        boxes[i].style.transition = "background-color 0.2s";
        setTimeout(() => {
            boxes[i].style.backgroundColor = "pink"; // Glow color
            setTimeout(() => {
                boxes[i].style.backgroundColor = originalColor; // Revert or set to a specific post-glow color
            }, 200);
        }, idx * 200);
    });
}

const boxes = document.querySelectorAll(".nineBox");

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (win || box.innerHTML !== "") { // If game won or box already taken
            return;
        }

        box.style.backgroundColor = currentPlayerColor;
        box.innerHTML = currentPlayerSymbol;
        queue.push({ index: index, symbol: currentPlayerSymbol }); // Store index and who played

        let currentPlayerMoves;
        let winnerName;

        if (currentPlayerSymbol === circle) { // Player 1's move
            player1Moves.push(index);
            currentPlayerMoves = player1Moves;
            winnerName = "Player 1 (O)";
        } else { // Player 2's move
            player2Moves.push(index);
            currentPlayerMoves = player2Moves;
            winnerName = "Player 2 (X)";
        }

        let winningCombination = checkWin(currentPlayerMoves);
        if (winningCombination.length > 0) {
            win = true;
            currentTurnMessageElement.innerText = `${winnerName} Won!`;
            glowBox(winningCombination);
            return; // Game over
        }

        // Switch turns
        if (currentPlayerSymbol === circle) {
            currentPlayerColor = clr2;
            currentPlayerSymbol = cross;
            currentTurnMessageElement.innerText = "Player 2's Turn (X)";
        } else {
            currentPlayerColor = clr1;
            currentPlayerSymbol = circle;
            currentTurnMessageElement.innerText = "Player 1's Turn (O)";
        }

        // Endless mode: If board is full, remove oldest moves
        if (queue.length >= 9) { // Using >= in case it ever exceeds 9 due to some bug
            const removed1 = queue.shift();
            boxes[removed1.index].style.backgroundColor = "#023e8a4D"; // Reset color
            boxes[removed1.index].innerHTML = "";
            if (removed1.symbol === circle) player1Moves.shift(); else player2Moves.shift();

            // Only remove a second one if still full (maintains 7 pieces on board for "endless")
            if (queue.length >= 8) { // Check if it's still "full enough" to remove another
                 const removed2 = queue.shift();
                 boxes[removed2.index].style.backgroundColor = "#023e8a4D"; // Reset color
                 boxes[removed2.index].innerHTML = "";
                 if (removed2.symbol === circle) player1Moves.shift(); else player2Moves.shift();
            }
        }
         if (!win && queue.length === 9 && checkWin(player1Moves).length === 0 && checkWin(player2Moves).length === 0) {
            // This condition is tricky with the endless queue.
            // A true "tie" (board full, no winner) is less likely in endless mode unless win check is exhaustive after each removal.
            // For now, if queue is full and no one has won yet, it's effectively a rolling state, not a hard tie.
            // The currentTurnMessageElement will show whose turn it is.
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const gameDifficulty = localStorage.getItem('gameDifficulty') || 'easy';
    const startingPlayerName = localStorage.getItem('startingPlayer');

    console.log(`Game difficulty: ${gameDifficulty}`);
    currentTurnMessageElement = document.querySelector("#winner");

    if (startingPlayerName === 'Player 1') {
        currentPlayerColor = clr1;
        currentPlayerSymbol = circle;
        currentTurnMessageElement.innerText = "Player 1's Turn (O)";
    } else { // Default to Player 2 if no setting or "Player 2"
        currentPlayerColor = clr2;
        currentPlayerSymbol = cross;
        currentTurnMessageElement.innerText = "Player 2's Turn (X)";
    }
    // localStorage.removeItem('gameDifficulty'); // Optional: clear after use
    // localStorage.removeItem('startingPlayer');
});

const restartButton = document.querySelector(".restart");
restartButton.addEventListener("click", ()=>{
    restartButton.style.backgroundColor = "#89577C"; // Original click feedback
    window.location.href = 'pregame.html'; // Go to pregame page
});
