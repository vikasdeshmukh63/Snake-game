// SELECTION OF THE HTML ELEMENTS
const containerEle = document.querySelector(".container");
const titleEle = document.querySelector(".title");
const boardEle = document.querySelector(".board");
const scoreEle = document.querySelector(".score");
const highScoreEle = document.querySelector(".high-score");
const sliderEle = document.querySelector("input");
const sliderTextEle = document.querySelector(".slider-text");

// GAME AUDIO
const moveAudio = new Audio("./sounds/move.mp3");
const eatingAudio = new Audio("./sounds/food.mp3");
const gameOverAudio = new Audio("./sounds/gameover.mp3");

// DECLARING VARIABLES
let previousPaintTime = 0;
let speed;
let direction = { x: 0, y: 0 };
let snakeArray = [{ x: 10, y: 10 }];
let food = { x: 20, y: 20 };
let score = 0;

// GAME DIFFCULTY

sliderEle.addEventListener("input", () => {
    speed = sliderEle.value;
    console.log(speed);
});


// CREATING ANIMATION LOOP
function main(ctime) {
    requestAnimationFrame(main);
    if ((ctime - previousPaintTime) / 1000 < 1 / speed) {
        return;
    }

    previousPaintTime = ctime;

    gameLogic();
}

main();

function collapseDetect(snake) {
    // IF SNAKE COLLIDE TO ITSELF
    for (let i = 1; i < snakeArray.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // IF SNAKE COLLIDE WITH WALL
    if (
        snake[0].x >= 30 ||
        snake[0].x <= 0 ||
        snake[0].y >= 30 ||
        snake[0].y <= 0
    ) {
        return true;
    }
}

function gameLogic() {
    boardEle.innerHTML = "";
    // IF GAME OVER THEN
    if (collapseDetect(snakeArray)) {
        gameOverAudio.play();
        direction = { x: 0, y: 0 };
        titleEle.innerText = "Game Over. Press any Key to Play Again!";
        snakeArray = [{ x: 10, y: 10 }];
        score = 0;
    }

    // EATING FOOD
    if (snakeArray[0].x === food.x && snakeArray[0].y === food.y) {
        snakeArray.unshift({
            x: snakeArray[0].x + direction.x,
            y: snakeArray[0].y + direction.y,
        });
        let a = 1;
        let b = 29;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random()),
        };
        eatingAudio.play();
        score += 1;
        scoreEle.innerText = `Score : ${score}`;

        // UPDATING HIGH SCORE
        if (score > highscoreval) {
            highscoreval = score;
            localStorage.setItem("highscore", JSON.stringify(highscoreval));
            highScoreEle.innerText = `High Score : ${highscoreval}`;
        }
    }

    // MOVING THE SNAKE
    for (let i = snakeArray.length - 2; i >= 0; i--) {
        snakeArray[i + 1] = { ...snakeArray[i] };
    }

    snakeArray[0].x += direction.x;
    snakeArray[0].y += direction.y;

    //RENDER THE SNAKE BODY
    snakeArray.forEach((segment, index) => {
        const snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;

        // FOR ADDING THE HEAD CLASS ONLY TO THE HEAD OF SNAKE
        if (index === 0) {
            snakeElement.classList.add("head");
        } else {
            snakeElement.classList.add("body");
        }
        boardEle.appendChild(snakeElement);
    });

    // RENDER THE FOOD
    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    boardEle.appendChild(foodElement);
}

// KEYPRESS LOGIC
window.addEventListener("keydown", (event) => {
    titleEle.innerText = "welcome to Snake Game";
    if (event.key == "ArrowUp" || event.key == "w") {
        direction.x = 0;
        direction.y = -1;
        moveAudio.play();
    } else if (event.key == "ArrowDown" || event.key == "s") {
        direction.x = 0;
        direction.y = 1;
        moveAudio.play();
    } else if (event.key == "ArrowLeft" || event.key == "a") {
        direction.x = -1;
        direction.y = 0;
        moveAudio.play();
    } else if (event.key == "ArrowRight" || event.key == "d") {
        direction.x = 1;
        direction.y = 0;
        moveAudio.play();
    }
});

// HIGH SCORE SETUP
let highscore = localStorage.getItem("highscore");
if (highscore === null) {
    highscoreval = 0;
    localStorage.setItem("highscore", JSON.stringify(highscoreval));
} else {
    highscoreval = JSON.parse(highscore);
    highScoreEle.innerText = `High Score : ${highscore}`;
}
