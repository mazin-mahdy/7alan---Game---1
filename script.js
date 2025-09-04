const players = {
  player1: null,
  player2: null,
  player3: null,
  player4: null,
};

document.querySelectorAll(".player").forEach(playerBox => {
  const buttons = playerBox.querySelectorAll(".choices button");
  const submitBtn = playerBox.querySelector(".submit-btn");
  const status = playerBox.querySelector(".status");
  let choice = null;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      choice = btn.dataset.choice;
      status.textContent = `Selected: ${choice}`;
    });
  });

  submitBtn.addEventListener("click", () => {
    if (!choice) {
      status.textContent = "Please pick first!";
      return;
    }
    players[playerBox.id] = choice;
    status.textContent = "Submitted ✅";
    submitBtn.disabled = true;

    if (Object.values(players).every(val => val !== null)) {
      calculateWinner();
    }
  });
});

function calculateWinner() {
  const resultBox = document.getElementById("result");
  const resetBtn = document.getElementById("reset-btn");

  let summary = "📊 Results:<br>";
  for (let p in players) {
    summary += `${p}: ${players[p]}<br>`;
  }

  const winners = findWinners(Object.entries(players));

  if (winners.length === 1) {
    summary += `<br>🏆 Winner: ${winners[0]}`;
  } else if (winners.length > 1) {
    summary += `<br>🤝 It's a tie between: ${winners.join(", ")}`;
  } else {
    summary += `<br>⚔️ No clear winner (all same choice)`;
  }

  resultBox.innerHTML = summary;
  resetBtn.style.display = "inline-block";
}

function findWinners(entries) {
  const beats = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper"
  };

  const moves = {};
  entries.forEach(([player, move]) => {
    if (!moves[move]) moves[move] = [];
    moves[move].push(player);
  });

  if (Object.keys(moves).length === 1) {
    return []; // all picked same
  }

  if (Object.keys(moves).length === 3) {
    return []; // rock, paper, scissors all present => tie
  }

  let [move1, move2] = Object.keys(moves);
  if (beats[move1] === move2) {
    return moves[move1]; // move1 wins
  } else {
    return moves[move2]; // move2 wins
  }
}

document.getElementById("reset-btn").addEventListener("click", () => {
  for (let p in players) players[p] = null;
  document.querySelectorAll(".player").forEach(playerBox => {
    playerBox.querySelector(".status").textContent = "Pick and Submit";
    playerBox.querySelector(".submit-btn").disabled = false;
  });
  document.getElementById("result").innerHTML = "";
  document.getElementById("reset-btn").style.display = "none";
});
