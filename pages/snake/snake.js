// pages/snake/snake.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    maxScore: 0,
    ground: [],//操场
    rows: 28,
    cols: 22,
    snake: [],
    food: [],
    startx: 0,
    starty: 0,
    x: 0,
    y: 0,
    direction: '',
    timer: '',
    modalHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let maxscore = wx.getStorageSync('maxscore');
    if (!maxscore) maxscore = 0
    this.setData({
      maxscore: maxscore
    });

    this.initGround(this.data.rows, this.data.cols);
    this.initSnake(3);
    this.creatFood();
    this.move();
  },
  //初始化操场
  initGround: function (rows, cols) {
    let ground = Array(rows).fill(0).map(item => Array(cols).fill(0));
    this.setData({
      ground: ground
    });
  },
  //初始化蛇
  initSnake: function (len) {
    let snake = this.data.snake;
    let ground = this.data.ground;
    for (let i = 0; i < len; i++) {
      snake.push([0, i]);
      ground[0][i] = 1;
    }
    this.setData({
      snake: snake,
      ground: ground
    })
  },
  //生成食物
  creatFood: function () {
    let x = Math.floor(Math.random() * this.data.rows);
    let y = Math.floor(Math.random() * this.data.cols);
    let food = [x, y];
    let ground = this.data.ground;
    ground[x][y] = 2;
    this.setData({
      food: food,
      ground: ground
    })
  },
  touchStart: function (e) {
    let startx = e.touches[0].pageX;
    let starty = e.touches[0].pageY;
    this.setData({
      startx: startx,
      starty: starty
    })
  },
  touchMove: function (e) {
    this.setData({
      x: e.touches[0].pageX - this.data.startx,
      y: e.touches[0].pageY - this.data.starty
    });
  },
  touchEnd: function () {
    let x = this.data.x, y = this.data.y;
    let direction = '';
    if (Math.abs(x) > Math.abs(y) && x > 0) {
      direction = 'right';
      console.log('right');
    } else if (Math.abs(x) > Math.abs(y) && x < 0) {
      direction = 'left';
      console.log('left');
    } else if (Math.abs(x) < Math.abs(y) && y < 0) {
      direction = 'up';
      console.log('up');
    } else {
      direction = 'down';
      console.log('down');
    }
    this.setData({
      direction: direction
    })
  },
  //计分器
  storeScore: function () {
    if (this.data.maxScore < this.data.score) {
      this.setData({
        maxScore: this.data.score
      })
      wx.setStorageSync('maxScore', this.data.maxScore)
    }
  },
  //移动函数
  move: function () {
    let that = this;
    this.data.timer = setInterval(function () {
      that.changeDir(that.data.direction);
    }, 600)
  },
  changeDir: function (dir) {
    if(dir){
      let snake = this.data.snake;
      let len = snake.length;
      let snakeHead = snake[len - 1], snakeTail = snake[0];
      let ground = this.data.ground;
      ground[snakeTail[0]][snakeTail[1]] = 0;
      for (let i = 0; i < len - 1; i++) {
        snake[i] = snake[i + 1];
      }
      let x = snakeHead[0], y = snakeHead[1];
      switch (dir) {
        case 'left':
          y--;
          break;
        case 'right':
          y++;
          break;
        case 'up':
          x--;
          break;
        case 'down':
          x++;
          break;
      };
      snake[len - 1] = [x, y];
      this.checkGame(snakeTail);
      for (let i = 1; i < len; i++) {
        ground[snake[i][0]][snake[i][1]] = 1;
      }
      this.setData({
        snake: snake,
        ground: ground
      })
    }
  },
  checkGame: function (snakeTail) {
    let snake = this.data.snake;
    let len = snake.length;
    let snakeHead = snake[len - 1];
    if (snakeHead[0] < 0 || snakeHead[0] >= this.data.rows || snakeHead[1] < 0 || snakeHead[1] >= this.data.cols) {
      clearInterval(this.data.timer);
      this.setData({
        modalHidden: false
      })
    }
    if (snakeHead[0] == this.data.food[0] && snakeHead[1] == this.data.food[1]) {
      snake.unshift(snakeTail)
      this.setData({
        score: this.data.score + 10
      });
      this.storeScore();
      this.creatFood();
    }
  },
  modalChange: function () {
    this.setData({
      score: 0,
      snake: [],
      ground: [],
      food: [],
      modalHidden: true,
      direction: ''
    });
    this.onLoad();
  }
})