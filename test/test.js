import {Game, Grid,  Input, ActiveScreen, Snake, Fruit} from './../src/js/snake_game.js';

const game = new Game();
const grid = new Grid(document.getElementById('game_board'), 20)
const input = new Input(game);
const snake = new Snake(document.getElementById('game_board'), input);
const fruit = new Fruit(document.getElementById('game_board'), grid, snake)
const activeScreen = new ActiveScreen();
console.log(snake.getSnakeSpeed())

let expect = chai.expect;
let assert = chai.assert;

describe('Snake', () => {
  describe('setSnakeSpeed(snakeSpeed)', () => {
    it('should set snakeSpeed variable', () => {
      snake.setSnakeSpeed(2)
      assert.equal(2, snake.snakeSpeed)
    });
  });
  describe('getSnakeSpeed()', () => {
    it('should return snakeSpeed variable', () => {
      assert.equal(2, snake.getSnakeSpeed())
    });
  });
  describe('restart()', () => {
    it('should change variables: snakeBody, newSegments, snakeSpeed', () => {
      assert.equal(0, snake.newSegments)
      assert.equal(2, snake.snakeSpeed)
      let sb = [{ x: 8, y:8 }]
      assert.deepEqual(sb, snake.snakeBody)
    });
  });
  describe('getNewSegments()', () => {
    it('should return number of new segments', () => {
      assert.equal(0, snake.newSegments)
    });
  });
  describe('expandSnake(amount)', () => {
    it('should add amount to newSegments variable', () => {
      snake.expandSnake(2)
      assert.equal(2, snake.newSegments)
    });
  });
  describe('getSnakeHead()', () => {
    it('should return position of snake head', () => {
      assert.deepEqual({ x: 8, y:8 }, snake.getSnakeHead())
    });
  });
  describe('onSnake(position, { ignoreHead = false} = {})', () => {
    it('should check if given position is occupied by snake segment', () => {
      assert.equal(true, snake.onSnake({ x: 8, y:8 }))
      assert.equal(false, snake.onSnake({ x: 5, y:5 }))
    });
  });
  describe('equalPositions(pos1, pos2)', () => {
    it('should check if given positions are equal', () => {
      assert.equal(true, snake.equalPositions({ x: 8, y:8 },{ x: 8, y:8 }))
      assert.equal(false, snake.equalPositions({ x: 8, y:8 },{ x: 5, y:8 }))
    });
  });
  describe('addSegments()', () => {
    it('should add new snake segments, amount is stored in newSegments variable', () => {
      snake.addSegments();
      assert.equal(3, snake.snakeBody.length)
      assert.equal(0, snake.newSegments)
    });
  });
});

describe('Fruit', () => {
  describe('getRandomPosition()', () => {
    it('should return new position', () => {
      let pos = fruit.getRandomPosition();
      expect(pos).to.have.property('x').to.be.a('number');
      expect(pos).to.have.property('y').to.be.a('number');
    });
  });
});

describe('ActiveScreen', () => {
  describe('add(name, style)', () => {
    it('should add object to the list', () => {
      activeScreen.add("foo", "bar");
      expect(activeScreen.screens).to.have.length(1);
      expect(activeScreen.screens[0]).to.have.property('name').equal('foo');
      expect(activeScreen.screens[0]).to.have.property('style').equal('bar');
    });
  });
});

describe('Input', () => {
  describe('restart()', () => {
    it('should change input direction and last input direction', () => {
      input.restart()
      assert.deepEqual({ x: 0, y:0 }, input.inputDirection);
      assert.deepEqual({ x: 0, y:0 }, input.lastInputDirection);
    });
  });
  describe('getInputDirection()', () => {
    it('should return input direction', () => {
      assert.deepEqual({ x: 0, y:0 }, input.getInputDirection());
    });
  });
});

describe('Grid', () => {
  describe('changeGridSize(gridSize)', () => {
    it('should change size of the grid', () => {
      grid.changeGridSize(12);
      assert.equal(12, grid.gridSize );
    });
  });
  describe('outsideGrid(position)', () => {
    it('check if given position is outside the grid', () => {
      assert.equal(true, grid.outsideGrid({ x: 21, y:3 }));
      assert.equal(false, grid.outsideGrid({ x: 5, y:6 }));
    });
  });
});

describe('Game', () => {
  describe('setIsActive(isActive)', () => {
    it('should set isActive variable', () => {
      game.setIsActive(true);
      assert.equal(true, game.isActive);
    });
  });
});