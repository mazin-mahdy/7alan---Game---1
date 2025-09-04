 document.addEventListener('DOMContentLoaded', function() {
            // Game state
            const gameState = {
                players: [
                    { id: 1, name: 'Player 1', choice: null, wins: 0 },
                    { id: 2, name: 'Player 2', choice: null, wins: 0 },
                    { id: 3, name: 'Player 3', choice: null, wins: 0 },
                    { id: 4, name: 'Player 4', choice: null, wins: 0 }
                ],
                gameOver: false,
                currentPlayer: 0
            };
            
            // DOM elements
            const playerElements = [
                document.getElementById('player1'),
                document.getElementById('player2'),
                document.getElementById('player3'),
                document.getElementById('player4')
            ];
            
            const resetBtn = document.getElementById('reset-btn');
            const resultText = document.querySelector('.result-text');
            const roundResult = document.querySelector('.round-result');
            
            // Initialize game
            initGame();
            
            // Set up event listeners for player activation
            playerElements.forEach((playerEl, index) => {
                playerEl.addEventListener('click', () => {
                    if (gameState.gameOver) return;
                    
                    // Set this player as active
                    gameState.currentPlayer = index;
                    playerElements.forEach(el => el.classList.remove('active'));
                    playerEl.classList.add('active');
                });
                
                // Set up event listeners for choice buttons
                const choiceBtns = playerEl.querySelectorAll('.choice-btn');
                const statusEl = playerEl.querySelector('.player-status');
                
                choiceBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent triggering the player click event
                        
                        if (gameState.gameOver) return;
                        if (gameState.currentPlayer !== index) return;
                        
                        const choice = btn.getAttribute('data-choice');
                        gameState.players[index].choice = choice;
                        
                        // Update UI
                        const choiceEl = playerEl.querySelector('.player-choice');
                        choiceEl.textContent = getChoiceEmoji(choice);
                        choiceEl.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            choiceEl.style.transform = 'scale(1)';
                        }, 300);
                        
                        // Highlight selected button
                        choiceBtns.forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        
                        // Update status
                        statusEl.textContent = `Chose: ${choice.charAt(0).toUpperCase() + choice.slice(1)}`;
                        statusEl.style.color = '#4CAF50';
                        
                        // Move to next player if available
                        const nextPlayer = findNextPlayer();
                        if (nextPlayer !== -1) {
                            gameState.currentPlayer = nextPlayer;
                            playerElements.forEach(el => el.classList.remove('active'));
                            playerElements[nextPlayer].classList.add('active');
                        }
                        
                        // Check if all players have chosen
                        checkAllPlayersChosen();
                    });
                });
            });
            
            resetBtn.addEventListener('click', initGame);
            
            // Find next player that hasn't made a choice
            function findNextPlayer() {
                for (let i = 0; i < gameState.players.length; i++) {
                    if (gameState.players[i].choice === null) {
                        return i;
                    }
                }
                return -1; // All players have chosen
            }
            
            // Game functions
            function initGame() {
                // Reset game state
                gameState.players.forEach(player => {
                    player.choice = null;
                    player.wins = 0;
                });
                
                gameState.gameOver = false;
                gameState.currentPlayer = 0;
                
                // Reset UI
                playerElements.forEach((playerEl, index) => {
                    playerEl.querySelector('.player-choice').textContent = '❔';
                    playerEl.querySelectorAll('.choice-btn').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                    playerEl.classList.remove('winner');
                    
                    const statusEl = playerEl.querySelector('.player-status');
                    statusEl.textContent = 'Click to choose';
                    statusEl.style.color = '#aaa';
                });
                
                // Set first player as active
                playerElements.forEach(el => el.classList.remove('active'));
                playerElements[0].classList.add('active');
                
                resultText.textContent = 'Make your selections!';
                roundResult.textContent = 'Click on each player to make their choice';
            }
            
            function checkAllPlayersChosen() {
                // Check if all players have made a selection
                const allPlayersChosen = gameState.players.every(player => player.choice !== null);
                
                if (allPlayersChosen) {
                    // Determine winners
                    const winners = determineWinners();
                    
                    // Update wins
                    winners.forEach(winnerIndex => {
                        gameState.players[winnerIndex].wins++;
                    });
                    
                    // Display results
                    if (winners.length === 0) {
                        resultText.textContent = "It's a tie!";
                        roundResult.textContent = "Everyone chose the same!";
                    } else if (winners.length === 1) {
                        resultText.textContent = `${gameState.players[winners[0]].name} wins the round!`;
                        roundResult.textContent = `${getChoiceEmoji(gameState.players[winners[0]].choice)} beats ${getLosingEmoji(gameState.players[winners[0]].choice)}`;
                    } else {
                        const winnerNames = winners.map(i => gameState.players[i].name).join(' and ');
                        resultText.textContent = `${winnerNames} win the round!`;
                        
                        const winningChoice = gameState.players[winners[0]].choice;
                        roundResult.textContent = `${getChoiceEmoji(winningChoice)} beats ${getLosingEmoji(winningChoice)}`;
                    }
                    
                    // Highlight winners
                    playerElements.forEach((playerEl, index) => {
                        if (winners.includes(index)) {
                            playerEl.classList.add('winner');
                        } else {
                            playerEl.classList.remove('winner');
                        }
                    });
                    
                    // Check for game over
                    const gameWinner = gameState.players.find(player => player.wins >= 3);
                    if (gameWinner) {
                        resultText.textContent = `${gameWinner.name} wins the game! 🎉`;
                        roundResult.textContent = 'Click "Reset Game" to play again!';
                        gameState.gameOver = true;
                    } else {
                        // Display current wins
                        const winsText = gameState.players.map(player => 
                            `${player.name}: ${player.wins} win${player.wins !== 1 ? 's' : ''}`
                        ).join(' | ');
                        
                        roundResult.textContent = winsText;
                        
                        // Reset choices for next round after a delay
                        setTimeout(() => {
                            gameState.players.forEach(player => player.choice = null);
                            playerElements.forEach((playerEl, index) => {
                                playerEl.querySelector('.player-choice').textContent = '❔';
                                playerEl.querySelectorAll('.choice-btn').forEach(btn => {
                                    btn.classList.remove('selected');
                                });
                                playerEl.classList.remove('winner');
                                
                                const statusEl = playerEl.querySelector('.player-status');
                                statusEl.textContent = 'Click to choose';
                                statusEl.style.color = '#aaa';
                            });
                            
                            // Reset to first player
                            gameState.currentPlayer = 0;
                            playerElements.forEach(el => el.classList.remove('active'));
                            playerElements[0].classList.add('active');
                            
                            resultText.textContent = 'Make your selections!';
                            roundResult.textContent = 'Click on each player to make their choice';
                        }, 4000);
                    }
                }
            }
            
            function determineWinners() {
                const choices = gameState.players.map(player => player.choice);
                
                // Check for all the same choice
                const allSame = choices.every(choice => choice === choices[0]);
                if (allSame) return [];
                
                // Determine which choice wins
                const hasRock = choices.includes('rock');
                const hasPaper = choices.includes('paper');
                const hasScissors = choices.includes('scissors');
                
                let winningChoice = null;
                
                if (hasRock && hasPaper && hasScissors) {
                    // All three choices present - no winner
                    return [];
                } else if (hasRock && hasScissors && !hasPaper) {
                    winningChoice = 'rock';
                } else if (hasPaper && hasRock && !hasScissors) {
                    winningChoice = 'paper';
                } else if (hasScissors && hasPaper && !hasRock) {
                    winningChoice = 'scissors';
                }
                
                // Find players with winning choice
                return gameState.players
                    .map((player, index) => ({ player, index }))
                    .filter(({ player }) => player.choice === winningChoice)
                    .map(({ index }) => index);
            }
            
            function getChoiceEmoji(choice) {
                switch(choice) {
                    case 'rock': return '✊';
                    case 'paper': return '✋';
                    case 'scissors': return '✌️';
                    default: return '❔';
                }
            }
            
            function getLosingEmoji(winningChoice) {
                switch(winningChoice) {
                    case 'rock': return '✌️'; // Rock beats scissors
                    case 'paper': return '✊'; // Paper beats rock
                    case 'scissors': return '✋'; // Scissors beats paper
                    default: return '❔';
                }
            }
        });