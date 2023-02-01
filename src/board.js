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
            boxEle.classList.add('NaNBox');
          } else if (posData === Infinity) {
            boxEle.classList.add('InfBox');
            boxEle.innerText = '∞';
          } else if (posData < 0) {
            boxEle.style.backgroundColor = getColorStr(posData);
            boxEle.style.color = 'white';
          } else {
            boxEle.style.backgroundColor = getColorStr(posData);
          }

          if (this.newTurnHistoryList.length > 0) {
            let posSet = this.newTurnHistoryList[this.newTurnHistoryList.length - 1];
            for (const pos of posSet) {
              if (pos[0] === y && pos[1] === x) {
                boxEle.style.animationName = 'newBox';
                boxEle.style.animationDuration = '0.9s';
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

  // 获取一列数据成一个列表 顺序从上往下
  getCol(x) {
    let res = [];
    for (let y = 0; y < this.height; y++) {
      res.push(this.arr[y][x]);
    }
    return res;
  }

  setCol(x, arr) {
    let res = [];
    for (let y = 0; y < this.height; y++) {
      this.arr[y][x] = arr[y];
    }
  }

  move(dir) {
    switch (dir) {
      case 'left':
        for (let y = 0; y < this.height; y++) {
          let line = this.arr[y];
          this.mergeLineLeft(line);
        }
        break;
      case 'right':
        for (let y = 0; y < this.height; y++) {
          let line = this.arr[y].reverse();
          this.mergeLineLeft(line);
          this.arr[y] = line.reverse();
        }
        break;
      case 'top':
        for (let x = 0; x < this.width; x++) {
          let line = this.getCol(x);
          this.mergeLineLeft(line);
          this.setCol(x, line);
        }
        break;
      case 'down':
        for (let x = 0; x < this.width; x++) {
          let line = this.getCol(x).reverse();
          this.mergeLineLeft(line);
          this.setCol(x, line.reverse());
        }
        break;

      default:
        break;
    }
  }

  // 两个值是否能够合并
  isMergeAble(a, b) {
    if (a === null || b === null) {
      return false;
    }
    if (a === undefined && b === undefined) {
      return true;
    }
    if (isNaN(a) || isNaN(b)) {
      return false;
    }
    if (typeof a === 'number' && typeof b === 'number') {
      if (Math.abs(a) === Math.abs(b)) {
        return true;
      }
      return false;
    }
  }

  merge(a, b) {
    this.mergeScore++;
    if (a === undefined && b === undefined) {
      // 触发所有清除NaN
      this.clearNaN();
      this.fxList.push('flash');
      this.score += 50000;
      return Infinity;
    }
    if (a === Infinity && b === Infinity) {
      //清除所有null
      this.score += 1000_0000;
      this.fxList.push('boom');
      this.clearValue(null);

      for (let i = 0; i < 10; i++) {
        this.clearValue(2 ** i);
        this.clearValue(-(2 ** i));
      }
      return null;
    }
    return a + b;
  }

  clearNaN() {
    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.height; x++) {
        if (isNaN(this.arr[y][x]) && this.arr[y][x] !== undefined) {
          // if (this.arr[y][x] === value) {
          this.arr[y][x] = 0;
        }
      }
    }
  }
  clearValue(value) {
    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.height; x++) {
        if (this.arr[y][x] === value) {
          this.arr[y][x] = 0;
        }
      }
    }
  }
  // 这个地方需要多理解一下
  mergeLineLeft(line) {
    // 这个循环是保证可以进一步合并 比如 224直接合并就成了800 而不是440
    for (let i = 0; i < Math.ceil(Math.log2(line.length)); i++) {
      for (let x = 0; x < line.length; x++) {
        const dataX = line[x];
        if (dataX === null) {
          continue;
        }
        if (dataX === 0) {
          // 如果当前这个数字是0，则向右侧寻找第一个非零数字并拉过来
          for (let xi = x + 1; xi < line.length; xi++) {
            if (line[xi] === null) {
              break;
            }
            if (line[xi] !== 0) {
              line[x] = line[xi];
              line[xi] = 0;
              break;
            }
          }
        } else {
          for (let xi = x + 1; xi < line.length; xi++) {
            // 判断一下 如果可以合并就合并数字
            if (line[xi] === null) {
              break;
            }
            if (line[xi] !== 0) {
              if (this.isMergeAble(line[xi], line[x])) {
                line[x] = this.merge(line[xi], line[x]);
                line[xi] = 0;
                break;
              }
              break;
            }
          }
        }
      }
    }
  }
  newTurn() {
    let locList = []; // 先收集所有可以放置的点
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.arr[y][x] === 0) {
          locList.push([y, x]);
        }
      }
    }
    if (locList.length < this.settings.addCount) {
      this.isGameOver = true;
    } else {
      // 选择位置
      let putLocList = chioce(locList, this.settings.addCount);
      this.newTurnHistoryList.push(putLocList);
      for (let loc of putLocList) {
        this.createNumber(loc[1], loc[0]);
      }
    }
  }
  // 在x,y 位置生成按规则随机生成的数组
  createNumber(x, y) {
    if (Math.random() < this.settings.negNumberRate) {
      this.arr[y][x] = -this.settings.initNumber;
      return;
    }
    if (Math.random() < this.settings.NaNRate) {
      this.arr[y][x] = NaN;
      return;
    }
    if (Math.random() < this.settings.nullRate) {
      this.arr[y][x] = null;
      return;
    }
    if (Math.random() < this.settings.undefinedRate) {
      this.arr[y][x] = undefined;
      return;
    }
    this.arr[y][x] = this.settings.initNumber;
  }
}

function chioce(arr, count) {
  let shuffled = arr.slice(0),
    i = arr.length,
    min = i - count,
    temp,
    index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
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
