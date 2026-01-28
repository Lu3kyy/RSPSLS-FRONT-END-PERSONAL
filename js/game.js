const moveEmojis = {
    'Rock': '🪨',
    'Paper': '📄',
    'Scissors': '✂️',
    'Lizard': '🦎',
    'Spock': '🖖'
};

// Store PvP choices
let pvpChoices = {
    player1: null,
    player2: null
};

// ==================== MODE TOGGLE ====================
document.getElementById('cpuToggleBtn').addEventListener('click', toggleCPUMode);
document.getElementById('pvpToggleBtn').addEventListener('click', togglePvPMode);

// ==================== PvP EVENT LISTENERS ====================
document.getElementById('player1SelectBtn').addEventListener('click', showPlayer1Input);
document.getElementById('player2SelectBtn').addEventListener('click', showPlayer2Input);
document.getElementById('determineWinnerBtn').addEventListener('click', playPvP);

document.querySelectorAll('.pvp-choice-btn').forEach(button => {
    button.addEventListener('click', recordPvPChoice);
});

// ==================== CPU EVENT LISTENERS ====================
document.querySelectorAll('.choice-btn').forEach(button => {
    button.addEventListener('click', playGame);
});

// ==================== MODE TOGGLE FUNCTIONS ====================
function toggleCPUMode() {
    document.getElementById('cpuSection').style.display = 'block';
    document.getElementById('pvpSection').style.display = 'none';
    document.getElementById('cpuToggleBtn').classList.remove('btn-outline-success');
    document.getElementById('cpuToggleBtn').classList.add('btn-success');
    document.getElementById('pvpToggleBtn').classList.remove('btn-success');
    document.getElementById('pvpToggleBtn').classList.add('btn-outline-success');
    resetGame();
}

function togglePvPMode() {
    document.getElementById('pvpSection').style.display = 'block';
    document.getElementById('cpuSection').style.display = 'none';
    document.getElementById('pvpToggleBtn').classList.remove('btn-outline-success');
    document.getElementById('pvpToggleBtn').classList.add('btn-success');
    document.getElementById('cpuToggleBtn').classList.remove('btn-success');
    document.getElementById('cpuToggleBtn').classList.add('btn-outline-success');
    resetPvP();
}

// ==================== PvP MODE FUNCTIONS ====================
function showPlayer1Input() {
    document.getElementById('player1InputSection').style.display = 'block';
    document.getElementById('player1SelectBtn').style.display = 'none';
}

function showPlayer2Input() {
    document.getElementById('player2InputSection').style.display = 'block';
    document.getElementById('player2SelectBtn').style.display = 'none';
}

function recordPvPChoice(event) {
    const playerNum = event.currentTarget.getAttribute('data-player');
    const move = event.currentTarget.getAttribute('data-move');
    
    pvpChoices[`player${playerNum}`] = move;
    
    if (playerNum === '1') {
        document.getElementById('player1InputSection').style.display = 'none';
        document.getElementById('player1SelectBtn').style.display = 'block';
        document.getElementById('player1SelectBtn').textContent = '✓ Player 1: Choice Made';
        document.getElementById('player1SelectBtn').disabled = true;
    } else {
        document.getElementById('player2InputSection').style.display = 'none';
        document.getElementById('player2SelectBtn').style.display = 'block';
        document.getElementById('player2SelectBtn').textContent = '✓ Player 2: Choice Made';
        document.getElementById('player2SelectBtn').disabled = true;
    }
    
    // Show determine winner button if both made choices
    if (pvpChoices.player1 && pvpChoices.player2) {
        document.getElementById('determineWinnerBtn').style.display = 'inline-block';
    }
}

function playGame(event) {
    const move = event.currentTarget.getAttribute('data-move');
    playRound(move);
}

// PvP Mode
function playPvP() {
    const player1Move = pvpChoices.player1;
    const player2Move = pvpChoices.player2;

    const result = comparePvPMoves(player1Move, player2Move);
    document.getElementById('pvpResult').innerHTML = result;
    
    // Show reset button option
    document.getElementById('determineWinnerBtn').style.display = 'none';
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
        resultText += `<p class="draw"><strong>It's a tie! Both chose ${player1Move}!</strong></p>`;
    } else if (winConditions[player1Move].includes(player2Move)) {
        resultText += `<p class="win"><strong>Player 1 wins! ${player1Move} beats ${player2Move}!</strong></p>`;
    } else {
        resultText += `<p class="lose"><strong>Player 2 wins! ${player2Move} beats ${player1Move}!</strong></p>`;
    }
    
    resultText += '<button class="btn btn-primary mt-3" onclick="resetPvP()">Play Again</button></div>';
    return resultText;
}

function resetPvP() {
    pvpChoices = { player1: null, player2: null };
    document.getElementById('player1SelectBtn').textContent = 'Player 1: Make Your Choice';
    document.getElementById('player1SelectBtn').disabled = false;
    document.getElementById('player1SelectBtn').style.display = 'block';
    document.getElementById('player1InputSection').style.display = 'none';
    
    document.getElementById('player2SelectBtn').textContent = 'Player 2: Make Your Choice';
    document.getElementById('player2SelectBtn').disabled = false;
    document.getElementById('player2SelectBtn').style.display = 'block';
    document.getElementById('player2InputSection').style.display = 'none';
    
    document.getElementById('determineWinnerBtn').style.display = 'none';
    document.getElementById('pvpResult').innerHTML = '';
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
