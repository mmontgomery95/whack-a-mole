
document.addEventListener('DOMContentLoaded', () => {
  const holes = document.querySelectorAll('.hole');
  const scoreEl = document.getElementById('score');
  const timerEl = document.getElementById('timer');
  const gameOverEl = document.getElementById('game-over');
  const pauseOverlay = document.getElementById('pause-overlay');

  let score = 0;
  let timeLeft = 30;
  let gameTick;
  let bugInterval;
  let gameActive = true;
  let paused = false;

  function randomHole() {
    return holes[Math.floor(Math.random() * holes.length)];
  }

  function showBug() {
    if (!gameActive || paused) return;
    const hole = randomHole();
    if (hole.textContent !== '') return;

    hole.textContent = '🐛';
    hole.classList.add('bug');

    const hideTimer = setTimeout(() => {
      if (hole.classList.contains('bug')) {
        hole.textContent = '';
        hole.classList.remove('bug');
      }
    }, 1000 + Math.random() * 1000);

    hole.onclick = () => {
      if (!hole.classList.contains('bug') || !gameActive || paused) return;
      score += 10;
      scoreEl.textContent = score;
      hole.textContent = '💥';
      hole.classList.remove('bug');
      hole.classList.add('squashed');
      setTimeout(() => {
        hole.textContent = '';
        hole.classList.remove('squashed');
      }, 500);
    };
  }

  function showObstacle() {
    if (!gameActive || paused) return;
    const hole = randomHole();
    if (hole.textContent !== '') return;

    hole.textContent = '💣';
    hole.classList.add('obstacle');

    const hideTimer = setTimeout(() => {
      if (hole.classList.contains('obstacle')) {
        hole.textContent = '';
        hole.classList.remove('obstacle');
      }
    }, 1000 + Math.random() * 1000);

    hole.onclick = () => {
      if (!hole.classList.contains('obstacle') || !gameActive || paused) return;
      score -= 50;
      if (score < 0) score = 0;
      scoreEl.textContent = score;
      hole.textContent = '💥';
      timeLeft -= 10;
      timerEl.textContent = timeLeft;
      hole.classList.remove('obstacle');
      setTimeout(() => {
        hole.textContent = '';
      }, 500);
    };
  }

  function showPowerUp() {
    if (!gameActive || paused) return;
    const hole = randomHole();
    if (hole.textContent !== '') return;

    hole.textContent = '⏰'; // clock emoji
    hole.classList.add('power-up');

    const hideTimer = setTimeout(() => {
      if (hole.classList.contains('power-up')) {
        hole.textContent = '';
        hole.classList.remove('power-up');
      }
    }, 1500);

    hole.onclick = () => {
      if (!hole.classList.contains('power-up') || !gameActive || paused) return;
      timeLeft += 5;
      timerEl.textContent = timeLeft;
      hole.textContent = '';
      hole.classList.remove('power-up');
    };
  }

  function showPauseOverlay() {
    pauseOverlay.style.display = 'flex';
  }

  function hidePauseOverlay() {
    pauseOverlay.style.display = 'none';
  }

  function pauseTimer() {
    clearInterval(gameTick);
    paused = true;
  }

  function resumeTimer() {
    paused = false;
    gameTick = setInterval(() => {
      if (!paused) {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(gameTick);
          clearInterval(bugInterval);
          gameActive = false;
          gameOverEl.textContent = `Game Over! Final Score: ${score}`;
        }
      }
    }, 1000);
  }

  function startGame() {
    score = 0;
    timeLeft = 30;
    paused = false;
    gameActive = true;
    scoreEl.textContent = score;
    timerEl.textContent = timeLeft;
    gameOverEl.textContent = '';
    hidePauseOverlay();

    resumeTimer();

    bugInterval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.6) {
        showBug();
      } else if (rand < 0.85) {
        showObstacle();
      } else {
        showPowerUp();
      }
    }, 600);
  }

  // Pause button logic
  const pauseBtn = document.getElementById('pause-btn');
  if (pauseBtn) {
    pauseBtn.onclick = () => {
      if (!paused && gameActive) {
        pauseTimer();
        showPauseOverlay();
      } else if (paused && gameActive) {
        resumeTimer();
        hidePauseOverlay();
      }
    };
  }

  startGame();
});
