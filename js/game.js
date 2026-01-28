const moveEmojis = {
    'Rock': '🪨',
    'Paper': '📄',
    'Scissors': '✂️',
    'Lizard': '🦎',
    'Spock': '🖖'
};

document.querySelectorAll('.choice-btn').forEach(button => {
    button.addEventListener('click', playGame);
});

function playGame(event) {
    const move = event.currentTarget.getAttribute('data-move');
    playRound(move);
}

async function playRound(playerMove) {
    // Show loading state
    showLoadingState();

    try {
        const response = await fetch('http://localhost:5001/api/game/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ move: playerMove })
        });

        if (!response.ok) {
            throw new Error('Failed to play game');
        }

        const result = await response.json();
        displayResult(result);
    } catch (error) {
        console.error('Error:', error);
        alert('Error playing game. Please try again.');
        resetUI();
    }
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
