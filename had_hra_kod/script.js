const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Nastavení velikosti canvasu
canvas.width = 400;
canvas.height = 400;

// Konstanty
const gridSize = 20; // Velikost jednoho políčka
let score = 0;
let gameOver = false;

// Had
let snake = [
    { x: gridSize * 5, y: gridSize * 5 }
];
let direction = { x: 1, y: 0 };

// Jablko
let apple = { x: gridSize * 10, y: gridSize * 10 };

// Pomocné funkce
function getRandomPosition() {
    let x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    let y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    // Kontrola, jestli není na těle hada
    while (snake.some(segment => segment.x === x && segment.y === y)) {
        x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    }
    return { x, y };
}

function drawRect(color, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
}

function updateSnake() {
    const head = { 
        x: snake[0].x + direction.x * gridSize, 
        y: snake[0].y + direction.y * gridSize 
    };

    // Konec hry, pokud had narazí do zdi nebo do sebe
    if (
        head.x < 0 || head.x >= canvas.width || 
        head.y < 0 || head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver = true;
        alert('Game Over! Stiskni mezerník pro restart.');
        return;
    }

    snake.unshift(head);

    // Kontrola, jestli sežral jablko
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        scoreElement.textContent = score;
        apple = getRandomPosition();
    } else {
        snake.pop(); // Odstranění posledního segmentu (pohyb)
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Jablko
    drawRect('red', apple.x, apple.y);

    // Had
    snake.forEach(segment => drawRect('green', segment.x, segment.y));
}

function gameLoop() {
    if (!gameOver) {
        updateSnake();
        draw();
        setTimeout(gameLoop, 100);
    }
}

// Ovládání
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
    if (e.code === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
    if (e.code === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
    if (e.code === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
    if (e.code === 'Space' && gameOver) {
        // Restart hry
        snake = [{ x: gridSize * 5, y: gridSize * 5 }];
        direction = { x: 1, y: 0 };
        apple = getRandomPosition();
        score = 0;
        scoreElement.textContent = score;
        gameOver = false;
        gameLoop();
    }
});

// Zahájení hry
gameLoop();
