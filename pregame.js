document.addEventListener('DOMContentLoaded', () => {
    const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
    const tossButton = document.getElementById('tossButton');
    const tossResultDisplay = document.getElementById('tossResult');
    const tossMessage = document.getElementById('tossMessage');
    const coinDisplay = document.getElementById('coin');
    const startGameButton = document.getElementById('startGameButton');

    let selectedDifficulty = 'easy'; // Default difficulty
    let tossWinner = null;

    difficultyRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            selectedDifficulty = event.target.value;
            console.log(`Difficulty set to: ${selectedDifficulty}`);
        });
    });

    tossButton.addEventListener('click', () => {
        // Disable toss button after one click to prevent re-tossing
        tossButton.disabled = true;
        tossButton.textContent = "Coin Tossed!";

        // Simulate coin animation
        coinDisplay.style.display = 'inline-block';
        coinDisplay.classList.add('tossing');

        // Determine winner after a short delay for animation
        setTimeout(() => {
            const randomToss = Math.random();
            if (randomToss < 0.5) {
                tossWinner = 'Player 1';
                coinDisplay.textContent = 'P1'; // Heads for Player 1
            } else {
                tossWinner = 'Player 2';
                coinDisplay.textContent = 'P2'; // Tails for Player 2
            }

            tossMessage.textContent = `${tossWinner} starts!`;
            tossResultDisplay.style.display = 'block';
            coinDisplay.classList.remove('tossing');
            coinDisplay.classList.add(tossWinner === 'Player 1' ? 'heads' : 'tails');

            // Enable start game button
            startGameButton.disabled = false;
            startGameButton.textContent = "Let's Go!";

        }, 1500); // Duration of the toss animation
    });

    startGameButton.addEventListener('click', () => {
        if (!tossWinner) {
            alert("Please toss the coin to determine who starts!");
            return;
        }

        // Store settings in localStorage
        localStorage.setItem('gameDifficulty', selectedDifficulty);
        localStorage.setItem('startingPlayer', tossWinner);

        // Navigate to the main game page
        window.location.href = 'index.html';
    });
});
