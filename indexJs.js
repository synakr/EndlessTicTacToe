let tosseResult = null; // Global scope

  function toss() {
    const p1 = document.getElementById('player1').value.trim();
    const p2 = document.getElementById('player2').value.trim();
    const coin = document.getElementById('coin');
    const resultDiv = document.getElementById('result');

    if (!p1 || !p2) return;

    resultDiv.innerText = '';
    coin.classList.remove('animate');
    void coin.offsetWidth;
    coin.classList.add('animate');

    setTimeout(() => {
      const isPlayer1 = Math.random() < 0.5;
      const symbol = isPlayer1 ? '✖' : '◯';
      const winner = isPlayer1 ? p1 : p2;
      tosseResult = isPlayer1 ? "1" : "0"; // Set toss result globally

      coin.textContent = symbol;
      resultDiv.innerText = `${winner} will go first!`;
    }, 1000);
  }

  function startGame() {
    const p1 = document.getElementById('player1').value.trim();
    const p2 = document.getElementById('player2').value.trim();

    if (!p1 || !p2 || tosseResult === null) {
      alert("Please enter names and toss the coin first.");
      return;
    }

    localStorage.setItem("player1", p1);
    localStorage.setItem("player2", p2);
    localStorage.setItem("toss", tosseResult); // Now storing the real result
    localStorage.setItem("tieBreaker", document.querySelector("#tiebreaker").value);
    alert("Redirecting to game...");
    window.location.href = "game.html";
  }