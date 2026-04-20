// Game Variables
const gameBoard = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const pairsDisplay = document.getElementById('pairs');
const winMessage = document.getElementById('winMessage');
const winStats = document.getElementById('winStats');

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameActive = true;
let timerInterval = null;
let secondsElapsed = 0;

// Card Values (emojis for visual appeal)
const cardValues = ['🍎', '🍎', '🍊', '🍊', '🍋', '🍋', '🍌', '🍌', 
                    '🍉', '🍉', '🍇', '🍇', '🍓', '🍓', '🍒', '🍒'];

/**
 * Fisher-Yates Shuffle Algorithm
 * Shuffles an array in-place
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Initialize the game board with shuffled cards
 */
function initializeGame() {
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameActive = true;
    secondsElapsed = 0;

    // Shuffle the card values
    const shuffledCards = shuffleArray([...cardValues]);

    // Create card elements
    shuffledCards.forEach((value, index) => {
        const card = document.createElement('button');
        card.className = 'card';
        card.dataset.value = value;
        card.dataset.index = index;
        card.textContent = '?';

        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
        cards.push(card);
    });

    updateStats();
    startTimer();
}

/**
 * Start the game timer
 */
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        secondsElapsed++;
        timerDisplay.textContent = secondsElapsed + 's';
    }, 1000);
}

/**
 * Handle card flip logic
 */
function flipCard(card) {
    // Prevent actions if game is inactive or card is already flipped/matched
    if (!gameActive || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    // Prevent more than 2 cards from being flipped
    if (flippedCards.length >= 2) {
        return;
    }

    // Flip the card
    card.classList.add('flipped');
    card.textContent = card.dataset.value;
    flippedCards.push(card);

    // Check for match after 2 cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        updateStats();
        checkForMatch();
    }
}

/**
 * Check if two flipped cards match
 */
function checkForMatch() {
    gameActive = false;

    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.value === card2.dataset.value;

    if (isMatch) {
        // Cards match
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            updateStats();

            flippedCards = [];
            gameActive = true;

            // Check if game is won
            if (matchedPairs === cardValues.length / 2) {
                endGame();
            }
        }, 500);
    } else {
        // Cards don't match - flip them back
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.classList.add('no-match');
            card2.classList.add('no-match');

            // Remove the shake animation class
            setTimeout(() => {
                card1.classList.remove('no-match');
                card2.classList.remove('no-match');
                card1.textContent = '?';
                card2.textContent = '?';
                flippedCards = [];
                gameActive = true;
            }, 500);
        }, 600);
    }
}

/**
 * Update statistics display
 */
function updateStats() {
    movesDisplay.textContent = moves;
    pairsDisplay.textContent = matchedPairs + '/8';
}

/**
 * End the game and show win message
 */
function endGame() {
    gameActive = false;
    clearInterval(timerInterval);

    // Show win message after a delay
    setTimeout(() => {
        winStats.textContent = `You completed the game in ${secondsElapsed}s with ${moves} moves!`;
        winMessage.classList.remove('hidden');
    }, 500);
}

/**
 * Restart the game
 */
function restartGame() {
    clearInterval(timerInterval);
    winMessage.classList.add('hidden');
    initializeGame();
}

// Initialize the game on page load
window.addEventListener('load', initializeGame);
