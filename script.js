const playBoard = document.getElementsByClassName("play-board")[0];
const scoreElement = document.getElementsByClassName("score")[0];
const highScoreElement = document.getElementsByClassName("high-score")[0];
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Se busca la puntuación más alta del almacenamiento local
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Puntuación más alta: ${highScore} puntos`;

// Actualizamos la posición de la comida de forma aleatoria
const actualizarPosicionComida = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

// Final del juego
const finJuego = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Pulsa Aceptar para volver a jugar...");
    location.reload();
};

// Cambiar la dirección de la serpiente
const cambiarDirection = e => {
    switch (e.key) {
        case "ArrowUp":
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case "ArrowDown":
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case "ArrowLeft":
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case "ArrowRight":
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
        default:
            break;
    }
};

// Llamar a cambiarDirection en cada clic y pasar el valor del conjunto de datos clave como un objeto
controls.forEach(button => button.addEventListener("click", () => cambiarDirection({ key: button.dataset.key })));

const iniciarJuego = () => {
    if (gameOver) return finJuego();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Comprobamos si la serpiente se come la comida.
    if (snakeX === foodX && snakeY === foodY) {
        actualizarPosicionComida();
        snakeBody.push([foodY, foodX]); // Empujamos la comida a la matriz del cuerpo de la serpiente, para que la serpiente crezca
        score++; // Se incrementa la puntuación en 1
        // Guardamos las puntuaciones
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Puntuación: ${score} puntos`;
        highScoreElement.innerText = `Puntuación más alta: ${highScore} puntos`;
    }
    // Actualización de la posición de la cabeza de la serpiente en función de la velocidad actual
    snakeX += velocityX;
    snakeY += velocityY;

    // Desplazando hacia adelante los valores de los elementos en el cuerpo de la serpiente en uno
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Configuración del primer elemento del cuerpo de la serpiente en la posición actual de la serpiente

    // Comprobando si la cabeza de la serpiente está fuera de la pared, si es así se configura gameOver en verdadero para finalizar el juego
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Se dibuja un div para cada parte del cuerpo de la serpiente.
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Comprobamos si la cabeza de la serpiente golpeó el cuerpo, si es así, establezca gameOver en verdadero
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}
// Llamar a la actualización de la posición de la comida
actualizarPosicionComida();
setIntervalId = setInterval(iniciarJuego, 100);
document.addEventListener("keyup", cambiarDirection);