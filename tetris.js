const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');  // Referência ao elemento de score
const gameOverScreen = document.getElementById('game-over-screen');  // Tela de Game Over
const finalScoreElement = document.getElementById('final-score');  // Exibe o score final
const restartButton = document.getElementById('restart-btn');  // Botão de reiniciar

// Configuração do tabuleiro
const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 40;
context.scale(BLOCK_SIZE, BLOCK_SIZE);

// Grid do tabuleiro (0 = vazio, 1 = ocupado)
const board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));

// Peças do Tetris (Tetrominos)
const TETROMINOS = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]]  // Z
];

// Peça atual
let currentPiece = getRandomPiece();
let pieceX = 3;
let pieceY = 0;
let score = 0;

// Sorteia uma peça aleatória
function getRandomPiece() {
  return TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
}

// Gira a peça 90 graus
function rotatePiece() {
  const rotated = currentPiece[0].map((_, i) =>
    currentPiece.map(row => row[i]).reverse()
  );

  // Evita rotação se houver colisão
  if (!checkCollision(0, 0, rotated)) {
    currentPiece = rotated;
  }
}

// Desenha o tabuleiro e as peças fixadas
function drawBoard() {
  context.clearRect(0, 0, COLUMNS, ROWS);
  context.fillStyle = 'blue';
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillRect(x, y, 1, 1);
      }
    });
  });
}

// Desenha a peça atual
function drawTetromino() {
  context.fillStyle = 'red';
  currentPiece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillRect(pieceX + x, pieceY + y, 1, 1);
      }
    });
  });
}

// Atualiza o valor do score no HTML
function updateScore() {
  scoreElement.textContent = score;
}

// Checa colisão (agora aceita uma peça testada)
function checkCollision(offsetX = 0, offsetY = 0, testPiece = currentPiece) {
  return testPiece.some((row, y) =>
    row.some((value, x) =>
      value &&
      (board[pieceY + y + offsetY]?.[pieceX + x + offsetX] !== 0 ||
        pieceY + y + offsetY >= ROWS ||
        pieceX + x + offsetX < 0 ||
        pieceX + x + offsetX >= COLUMNS)
    )
  );
}

// Salva a peça no tabuleiro
function mergePiece() {
  currentPiece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        board[pieceY + y][pieceX + x] = 1;
      }
    });
  });

  clearFullLines(); // Remove linhas completas
}

// Remove linhas completas
function clearFullLines() {
  for (let y = ROWS - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== 0)) {
      board.splice(y, 1); // Remove a linha completa
      board.unshift(Array(COLUMNS).fill(0)); // Adiciona uma linha vazia no topo
      score += 100; // Adiciona pontos por linha completa
    }
  }
}

// Exibe a tela de Game Over
function showGameOver() {
  finalScoreElement.textContent = score;
  gameOverScreen.style.display = 'block';  // Exibe a tela de Game Over
}

// Reinicia o jogo
function restartGame() {
  score = 0;
  board.forEach((row, y) => row.fill(0));  // Limpa o tabuleiro
  currentPiece = getRandomPiece();
  pieceX = 3;
  pieceY = 0;
  gameOverScreen.style.display = 'none';  // Oculta a tela de Game Over
  updateGame();
}

// Atualiza o jogo
function updateGame() {
  drawBoard();
  drawTetromino();
  updateScore(); // Atualiza o score
}

// Movimentação
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' && !checkCollision(-1, 0)) {
    pieceX--;
  } else if (event.key === 'ArrowRight' && !checkCollision(1, 0)) {
    pieceX++;
  } else if (event.key === 'ArrowDown' && !checkCollision(0, 1)) {
    pieceY++;
  } else if (event.key === ' ') {
    rotatePiece();
  }
  updateGame();
});

// Queda automática
function dropPiece() {
  if (!checkCollision(0, 1)) {
    pieceY++;
  } else {
    mergePiece();
    // Verifica se já tem peças no topo, caso sim, game over
    if (board[0].some(cell => cell !== 0)) {
      showGameOver();  // Mostra a tela de Game Over
      return;
    }
    // Gera uma nova peça
    currentPiece = getRandomPiece();
    pieceX = 3;
    pieceY = 0;
  }
  updateGame();
}

setInterval(dropPiece, 500);

// Botão de reiniciar
restartButton.addEventListener('click', restartGame);

// Inicia o jogo
updateGame();




