const moveEmojis = {
    'Rock': '🪨',
    'Paper': '📄',
    'Scissors': '✂️',
    'Lizard': '🦎',
    'Spock': '🖖'
};

// Event Listeners
document.getElementById('determineWinnerBtn').addEventListener('click', playPvP);

document.querySelectorAll('.choice-btn').forEach(button => {
    button.addEventListener('click', playGame);
});

function playGame(event) {
    const move = event.currentTarget.getAttribute('data-move');
    playRound(move);
}

// PvP Mode
function playPvP() {
    const player1Move = document.getElementById('player1Choice').value.trim();
    const player2Move = document.getElementById('player2Choice').value.trim();

    const validMoves = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];
    
    // Capitalize input
    const player1Capitalized = player1Move.charAt(0).toUpperCase() + player1Move.slice(1).toLowerCase();
    const player2Capitalized = player2Move.charAt(0).toUpperCase() + player2Move.slice(1).toLowerCase();

    // Validate inputs
    if (!validMoves.includes(player1Capitalized) || !validMoves.includes(player2Capitalized)) {
        alert('Please enter valid moves: Rock, Paper, Scissors, Lizard, or Spock');
        return;
    }

    const result = comparePvPMoves(player1Capitalized, player2Capitalized);
    document.getElementById('result').innerHTML = result;
}

function comparePvPMoves(player1Move, player2Move) {
    const winConditions = {
        'Rock': ['Scissors', 'Lizard'],
        'Paper': ['Rock', 'Spock'],
        'Scissors': ['Paper', 'Lizard'],
        'Lizard': ['Spock', 'Paper'],
        'Spock': ['Scissors', 'Rock']
    };

    let resultText = `<div class="text-center"><h4>${moveEmojis[player1Move]} vs ${moveEmojis[player2Move]}</h4>`;

    if (player1Move === player2Move) {
        resultText += `<p class="draw">It's a tie! Both chose ${player1Move}!</p>`;
    } else if (winConditions[player1Move].includes(player2Move)) {
        resultText += `<p class="win">Player 1 wins! ${player1Move} beats ${player2Move}!</p>`;
    } else {
        resultText += `<p class="lose">Player 2 wins! ${player2Move} beats ${player1Move}!</p>`;
    }
    
    resultText += '</div>';
    return resultText;
}

// CPU Mode - Helper function to determine winner
function getAction(winner, loser) {
    const actions = {
        'Rock': { 'Scissors': 'crushes', 'Lizard': 'crushes' },
        'Paper': { 'Rock': 'covers', 'Spock': 'disproves' },
        'Scissors': { 'Paper': 'cuts', 'Lizard': 'decapitates' },
        'Lizard': { 'Paper': 'eats', 'Spock': 'poisons' },
        'Spock': { 'Rock': 'vaporizes', 'Scissors': 'smashes' }
    };
    return actions[winner][loser] || 'beats';
}

function playRound(playerMove) {
    // Show loading state
    showLoadingState();

    const cpuEndpoint = 'https://guptilllsg2526-fqapfdeffbdegwc5.westus3-01.azurewebsites.net/api/Game/random';

    fetch(cpuEndpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(cpuMove => {
        // Clean the response
        cpuMove = cpuMove.replace(/^["']|["']$/g, '').trim();
        cpuMove = cpuMove.charAt(0).toUpperCase() + cpuMove.slice(1).toLowerCase();
        
        const result = determineCPUWinner(playerMove, cpuMove);
        displayResult(result);
    })
    .catch(error => {
        console.error('Error:', error);
        resetUI();
        alert('Error: Unable to get CPU move. Please try again.');
    });
}

function determineCPUWinner(playerMove, cpuMove) {
    const winConditions = {
        'Rock': ['Scissors', 'Lizard'],
        'Paper': ['Rock', 'Spock'],
        'Scissors': ['Paper', 'Lizard'],
        'Lizard': ['Spock', 'Paper'],
        'Spock': ['Scissors', 'Rock']
    };

    let outcome = 'Draw';
    let message = '';

    if (playerMove === cpuMove) {
        outcome = 'Draw';
        message = "It's a tie!";
    } else if (winConditions[playerMove].includes(cpuMove)) {
        outcome = 'Win';
        message = `${playerMove} ${getAction(playerMove, cpuMove)} ${cpuMove}!`;
    } else {
        outcome = 'Lose';
        message = `${cpuMove} ${getAction(cpuMove, playerMove)} ${playerMove}!`;
    }

    return {
        playerMove: playerMove,
        cpuMove: cpuMove,
        outcome: outcome,
        message: message
    };
}

function showLoadingState() {
    document.getElementById('infoContainer').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'none';
    document.getElementById('loadingContainer').style.display = 'block';

    // Disable all choice buttons
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = true;
    });
}

function displayResult(result) {
    // Hide loading
    document.getElementById('loadingContainer').style.display = 'none';

    // Set the moves
    const playerMoveEmoji = moveEmojis[result.playerMove];
    const cpuMoveEmoji = moveEmojis[result.cpuMove];

    document.getElementById('playerMoveEmoji').textContent = playerMoveEmoji;
    document.getElementById('playerMoveName').textContent = result.playerMove;
    document.getElementById('cpuMoveEmoji').textContent = cpuMoveEmoji;
    document.getElementById('cpuMoveName').textContent = result.cpuMove;

    // Set outcome
    const outcomeText = document.getElementById('outcomeText');
    const messageText = document.getElementById('messageText');

    if (result.outcome === 'Win') {
        outcomeText.textContent = 'You Win!';
        outcomeText.className = 'fw-bold mb-2 win';
    } else if (result.outcome === 'Lose') {
        outcomeText.textContent = 'CPU Wins!';
        outcomeText.className = 'fw-bold mb-2 lose';
    } else {
        outcomeText.textContent = 'Draw!';
        outcomeText.className = 'fw-bold mb-2 draw';
    }

    messageText.textContent = result.message;

    // Highlight the selected move
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-move') === result.playerMove) {
            btn.classList.add('active');
        }
    });

    // Show result container
    document.getElementById('resultContainer').style.display = 'block';
}

function resetGame() {
    resetUI();
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('active');
    });
}

function resetUI() {
    document.getElementById('infoContainer').style.display = 'block';
    document.getElementById('resultContainer').style.display = 'none';
    document.getElementById('loadingContainer').style.display = 'none';
}
