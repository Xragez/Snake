class Game{

    constructor(){
        this.gameBoard = document.getElementById('game_board');
        this.grid = new Grid(this.gameBoard, 20);
        this.input = new Input(this);
        this.activeScreen = this.input.getActiveScreen();
        this.snake = new Snake(this.gameBoard, this.input);
        this.fruit = new Fruit(this.gameBoard, this.grid, this.snake);
        this.setIsActive(false);
    }

    newGame(){
        this.gameOver = false;
        this.setIsActive(true);
        this.lastRenderTime = 0;
        this.score = 0;
        let gridSize = document.getElementById("grid_size").value;
        let snakeBody = this.grid.selectGridSize(gridSize);
        this.grid.restart();
        this.snake.restart(snakeBody);
        this.fruit.restart();
        this.input.restart();
        window.requestAnimationFrame(game.run.bind(game));
    }

    run(currentTime){
        if(this.isActive) {
            if (this.gameOver){
                this.gameIsOver();
            }
            window.requestAnimationFrame(this.run.bind(this));
            const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000
            if (secondsSinceLastRender < 1 / this.snake.getSnakeSpeed())
                return

            this.lastRenderTime = currentTime
            this.update()
            this.draw()
        }
    }

    setIsActive(isActive){
        this.isActive = isActive;
    }

    gameIsOver(){
        this.activeScreen.change('game_over_menu');
        this.isActive = false
        document.getElementById("end_score").innerHTML = this.score;
    }

    checkFailure(){
        this.gameOver = this.grid.outsideGrid(this.snake.getSnakeHead()) || this.snake.snakeIntersection()
    }

    update(){
        this.snake.update();
        this.fruit.update();
        this.checkFailure();
        this.score += this.snake.getNewSegments();

    }
    draw(){
        document.getElementById("score").innerHTML = this.score;
        this.gameBoard.innerHTML = ''
        this.snake.draw();
        this.fruit.draw();
    }
}

class Grid{

    constructor(gameBoard, gridSize){
        this.gameBoard = gameBoard;
        this.gridSize = gridSize;
        this.changeGridSize(gridSize);
    }

    restart(){
        this.changeGridSize(this.gridSize);
    }

    getRandomPosition(){
        return {
            x: Math.floor(Math.random() * this.gridSize) + 1,
            y: Math.floor(Math.random() * this.gridSize) + 1
        }
    }
    outsideGrid(position){
        return (
            position.x < 1 || position.x > this.gridSize ||
            position.y < 1 || position.y > this.gridSize
        )
    }
    changeGridSize(gridSize){
        this.gameBoard.style.setProperty('grid-template-rows', 'repeat(' + gridSize + ', 1fr)');
        this.gameBoard.style.setProperty('grid-template-columns', 'repeat(' + gridSize + ', 1fr)');
        this.gridSize = gridSize;
    }
    selectGridSize(option){
        let snakeBody;
        switch (option){
            case "1":
                this.changeGridSize(16);
                snakeBody = [{ x: 8, y:8 }];
                break;
            case "2":
                this.changeGridSize(20);
                snakeBody = [{ x: 10, y:10 }];
                break;
            case "3":
                this.changeGridSize(24);
                snakeBody = [{ x: 12, y:12 }];
                break;
        }
        console.log(this.gridSize);
        return snakeBody;
    }
}

class Input{

    constructor(game){
        this.inputDirection = { x: 0, y:0 };
        this.lastInputDirection = { x: 0, y:0 };
        this.activeScreen = new ActiveScreen();
        this.activeScreen.add("game", "flex");
        this.activeScreen.add("settings_menu", "flex");
        this.activeScreen.add("main_menu", "flex");
        this.activeScreen.add("game_over_menu", "flex");
        this.addEventListeners();
        this.activeScreen.change("main_menu");
        this.game = game;

    }

    restart(){
        this.inputDirection = { x: 0, y:0 };
        this.lastInputDirection = { x: 0, y:0 };
    }

    getInputDirection(){
        this.lastInputDirection = this.inputDirection;
        return this.inputDirection;
    }
    getActiveScreen(){
        return this.activeScreen;
    }
    settingsButton(){
        this.activeScreen.change("settings_menu")
    }
    exitButton(){
        this.activeScreen.change("main_menu")
        this.game.setIsActive(false);
    }
    newGameButton(){
        this.activeScreen.change("game")
        this.game.newGame();
    }
    addEventListeners(){
        document.getElementById("exit_button_1").addEventListener("click", this.exitButton.bind(this));
        document.getElementById("exit_button_2").addEventListener("click", this.exitButton.bind(this));
        document.getElementById("exit_button_3").addEventListener("click", this.exitButton.bind(this));
        document.getElementById("restart_button_1").addEventListener("click", this.newGameButton.bind(this));
        document.getElementById("restart_button_2").addEventListener("click", this.newGameButton.bind(this));
        document.getElementById("new_game_button").addEventListener("click", this.newGameButton.bind(this));
        document.getElementById("settings_button").addEventListener("click", this.settingsButton.bind(this));

        window.addEventListener('keydown', e =>{
            switch(e.key){
                case 'ArrowUp':
                    if(this.lastInputDirection.y !== 0) break
                    this.inputDirection= { x: 0, y: -1 }
                break
                case 'ArrowDown':
                    if(this.lastInputDirection.y !== 0) break
                    this.inputDirection= { x: 0, y: 1 }
                    break
                case 'ArrowLeft':
                    if(this.lastInputDirection.x !== 0) break
                    this.inputDirection= { x: -1, y: 0 }
                    break
                case 'ArrowRight':
                    if(this.lastInputDirection.x !== 0) break
                    this.inputDirection= { x: 1, y: 0 }
                    break
            }
        })
    }
}


class ActiveScreen{
    constructor(){
        this.screens = [];
    }
    change(name){
        for(let i = 0; i < this.screens.length; i ++){
            if(this.screens[i].name === name) {
                document.getElementById(name).style.display = this.screens[i].style;
            }
            else{
            document.getElementById(this.screens[i].name).style.display = "none";
            }
        }
    }
    add(name, style){
        this.screens.push({name: name, style: style});
    }
}

class Snake {

    constructor(gameBoard, input){
        this.snakeBody = [{ x: 8, y:8 }];
        this.newSegments = 0;
        this.snakeSpeed = 2;
        this.gameBoard = gameBoard;
        this.input = input;
    }
    setSnakeSpeed(snakeSpeed){
        this.snakeSpeed = snakeSpeed;
    }

    restart(snakeBody){
        this.snakeBody = snakeBody;
        this.newSegments = 0;
        this.snakeSpeed = 2;
    }

    getSnakeSpeed() {
        return this.snakeSpeed;
    }
    getNewSegments(){
        return this.newSegments;
    }
    update(){
        this.addSegments()
        const inputDirection = this.input.getInputDirection();
        for (let i = this.snakeBody.length - 2; i >= 0; i--){
            this.snakeBody[i + 1] = { ...this.snakeBody[i] }
        }
        this.snakeBody[0].x += inputDirection.x
        this.snakeBody[0].y += inputDirection.y
    }
    draw(){
        this.snakeBody.forEach(segment => {
            const snakeElement = document.createElement('div')
            snakeElement.style.gridRowStart = segment.y
            snakeElement.style.gridColumnStart = segment.x
            snakeElement.classList.add('snake')
            this.gameBoard.appendChild(snakeElement)
        })
    }
    expandSnake(amount){
        this.newSegments += amount;
    }

    getSnakeHead(){
        return this.snakeBody[0];
    }

    onSnake(position, { ignoreHead = false} = {}){
        return this.snakeBody.some((segment,index) => {
            if(ignoreHead && index === 0) return false;
            return this.equalPositions(segment, position);
        })
    }
    snakeIntersection(){
        return this.onSnake(this.snakeBody[0], { ignoreHead: true})
    }
    equalPositions(pos1, pos2){
        return pos1.x === pos2.x && pos1.y === pos2.y
    }
    addSegments(){
        for (let i = 0; i < this.newSegments; i++){
            this.snakeBody.push({ ...this.snakeBody[this.snakeBody.length - 1]})
        }
        this.newSegments = 0
    }
}

class Fruit{

    constructor(gameBoard, grid, snake){
        this.gameBoard = gameBoard;
        this.expansion_rate = 1;
        this.grid = grid;
        this.snake = snake;
        this.fruit_pos = this.getRandomPosition();
    }

    restart(){
        this.fruit_pos = this.getRandomPosition();
    }

    draw(){
        const fruitElement = document.createElement('div');
        fruitElement.style.gridRowStart = this.fruit_pos.y;
        fruitElement.style.gridColumnStart = this.fruit_pos.x;
        fruitElement.classList.add('fruit');
        this.gameBoard.appendChild(fruitElement);
    }

    update(){
        if(this.snake.onSnake(this.fruit_pos)){
            this.snake.setSnakeSpeed(this.snake.getSnakeSpeed() + 0.1);
            this.snake.expandSnake(this.expansion_rate)
            this.fruit_pos = this.getRandomPosition()
        }
    }

    getRandomPosition(){
        let newPosition;
        while (newPosition == null || this.snake.onSnake(newPosition)){
            newPosition = this.grid.getRandomPosition();
        }
        return newPosition
    }
}

const game = new Game();

//export { Game, Grid, Input, ActiveScreen, Snake, Fruit};