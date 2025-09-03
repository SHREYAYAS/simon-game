
document.addEventListener('DOMContentLoaded', () => {
    const pads = {
        green: document.getElementById('green'),
        red: document.getElementById('red'),
        yellow: document.getElementById('yellow'),
        blue: document.getElementById('blue'),
    };

    const levelDisplay = document.getElementById('level-display-span');
    const messageDisplay = document.getElementById('message-display');
    const startButton = document.getElementById('start-button');
    const gameOverModal = document.getElementById('game-over-modal');
    const finalLevelDisplay = document.getElementById('final-level');
    const restartButton = document.getElementById('restart-button');

    const colors = ['green', 'red', 'yellow', 'blue'];
    
    const sounds = {
        green: new Tone.Synth().toDestination(),
        red: new Tone.Synth().toDestination(),
        yellow: new Tone.Synth().toDestination(),
        blue: new Tone.Synth().toDestination(),
    };

    let sequence = [];
    let playerSequence = [];
    let level = 0;
    let isPlayerTurn = false;
    let gameInProgress = false;
    
    async function startGame() {
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }

        if (gameInProgress) return;
        gameInProgress = true;
        sequence = [];
        playerSequence = [];
        level = 0;
        startButton.classList.add('hidden');
        messageDisplay.textContent = "Watch carefully...";
        nextLevel();
    }
    
    function nextLevel() {
        isPlayerTurn = false;
        playerSequence = [];
        level++;
        levelDisplay.textContent = level;
        
        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(nextColor);
        
        setTimeout(() => {
            playSequence();
        }, 1000);
    }

    function playSequence() {
        let i = 0;
        messageDisplay.textContent = "Watch carefully...";
        const interval = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(interval);
                isPlayerTurn = true;
                messageDisplay.textContent = "Your turn!";
                return;
            }
            lightUpPad(sequence[i]);
            i++;
        }, 700);
    }

    function lightUpPad(color) {
        const pad = pads[color];
        pad.classList.add('lit');
        playSound(color);
        
        setTimeout(() => {
            pad.classList.remove('lit');
        }, 350);
    }

    function playSound(color) {
        const note = {
            green: 'C4',
            red: 'E4',
            yellow: 'G4',
            blue: 'B4'
        }[color];
        sounds[color].triggerAttackRelease(note, '8n', Tone.now());
    }

    function handlePlayerInput(e) {
        if (!isPlayerTurn || !gameInProgress) return;

        const color = e.target.dataset.color;
        if (!color) return;

        playerSequence.push(color);
        lightUpPad(color);
        
        checkPlayerSequence();
    }
    
    function checkPlayerSequence() {
        const currentMoveIndex = playerSequence.length - 1;

        if (playerSequence[currentMoveIndex] !== sequence[currentMoveIndex]) {
            endGame();
            return;
        }
        
        if (playerSequence.length === sequence.length) {
            isPlayerTurn = false;
            messageDisplay.textContent = "Well done!";
            setTimeout(nextLevel, 1200);
        }
    }
    
    function endGame() {
        gameInProgress = false;
        isPlayerTurn = false;
        finalLevelDisplay.textContent = level;
        gameOverModal.classList.add('visible');
    }

    function resetGame() {
        gameOverModal.classList.remove('visible');
        startButton.classList.remove('hidden');
        levelDisplay.textContent = '0';
        messageDisplay.textContent = '';
    }

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', resetGame);
    
    Object.values(pads).forEach(pad => {
        pad.addEventListener('click', handlePlayerInput);
    });
});