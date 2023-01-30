export default class Board {
  constructor(w, h, bindEle) {
    this.width = w;
    this.height = h;
    this.isGameOver = false;
    this.arr = [];
    this.score = 0;
    this.mergeScore = 0;

    /**
     * 存放新地点集合，
     * 类型： [[pos, pos, pos...], [pos, pos, pos...], ...]
     * pos: [y, x]
     * @type {*[]}
     */
    this.newTurnHistoryList = [];
    this.fxList = [];
    /**
     * 游戏设定
     */
    this.settings = {
      addCount: 1, // 一次性会添加多少个数字？
      initNumber: 1, // 初始数字

      negNumberRate: 0.1, // 出现负数字的概率
      NaNRate: 0.05, // NaN 出现概率
      infinityRate: 0.01, // 出现无穷的概率
      nullRate: 0.01, // 出现null的概率
      undefinedRate: 0.01 // 出现未定义的概率
    };

    this.bindEle = bindEle;
    this.boardEle = bindEle.querySelector('.gameBoard');
    this.scoreEle = bindEle.querySelector('#score');
    this.mergeScoreEle = bindEle.querySelector('#mergeScore');

    for (let y = 0; y < h; y++) {
      let line = [];
      for (let x = 0; x < w; x++) {
        line.push(0);
      }
      this.arr.push(line);
    }
    this.refresh();
  }

  refresh() {
    if (this.isGameOver) {
      return;
    }
    this.updateScore();
    this.scoreEle.innerText = this.score.toString();
    this.mergeScoreEle.innerText = this.mergeScore.toString();

    this.bindEle.removeChild(this.boardEle);
    let boardElement = newDiv('gameBoard');
    // set width dynamic
    boardElement.style.width = ((50 + 5) * this.width).toString() + 'px';

    while (this.fxList.length > 0) {
      boardElement.style.animationName = this.fxList.pop();
    }

    for (let y = 0; y < this.height; y++) {
      let lineEle = newDiv('line');
      for (let x = 0; x < this.width; x++) {
        let boxEle = newDiv('box');
        const posData = this.arr[y][x];

        if (posData !== 0) {
          boxEle.innerText = this.arr[y][x];

          // set color
          if (posData === null) {
            boxEle.classList.add('nullbox');
            boxEle.innerText = 'null';
          }
          if (posData === undefined) {
            boxEle.classList.add('undefinedBox');
          } else if (isNaN(posData)) {
            boxEle.classList.add('NaNbox');
          } else if (posData === Infinity) {
            boxEle.classList.add('Infbox');
            boxEle.innerText = '∞';
          } else if (posData < 0) {
            boxEle.style.backgroundColor = getColorStr(posData);
            boxEle.style.color = 'white';
          } else {
            boxEle.style.backgroundColor = getColorStr(posData);
          }

          if (this.newTurnHistoryList.length > 0) {
            let posSet = this.newTurnHistoryList(this.newTurnHistoryList.length - 1);
            for (const pos of posSet) {
              if (pos[0] === y && pos[1] === x) {
                boxEle.style.animationName = 'newBox 0.4s';
              }
            }
          }
          boxEle.style.outline = '';
        }
        lineEle.appendChild(boxEle);
      }
      boardElement.appendChild(lineEle);
    }
    this.boardEle = boardElement;
    this.bindEle.appendChild(boardElement);
  }
  updateScore() {
    let res = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (isNaN(this.arr[y][x])) {
          continue;
        }
        if (this.arr[y][x] === Infinity) {
          continue;
        }
        res += this.arr[y][x];
        // res += this.arr[y][x] ** 3;
      }
    }
    this.score = res;
  }
}

function newDiv(className) {
  let res = document.createElement('div');
  res.classList.add(className);
  return res;
}

function getColorStr(num) {
  let flag = 1;
  if (num < 0) {
    flag = -1;
  }
  let level = Math.log2(Math.abs(num)) * flag;
  return `rgb(${100 + level * 20}, ${255 + level * 10}, ${180 - level * 2})`;
}
