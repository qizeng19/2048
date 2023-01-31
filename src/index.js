import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import Board from './board';

function startGame() {
  let mode = document.querySelector('#modeEle').value;
  let gameBoardEle = document.querySelector('.gameRange');

  let w = +document.querySelector('#widthEle').value;
  let h = +document.querySelector('#heightEle').value;
  let b = new Board(w, h, gameBoardEle);
  b.settings.negNumberRate = +document.querySelector('#negRateEle').value / 100;
  b.settings.NaNRate = +document.querySelector('#NaNRateEle').value / 100;
  b.settings.addCount = +document.querySelector('#countEle').value;
  b.settings.nullRate = +document.querySelector('#nullRateEle').value / 100;
  b.settings.undefinedRate = +document.querySelector('#undefinedRateEle').value / 100;

  function opUp() {
    b.move('top');
    b.newTurn();
    b.refresh();
  }

  function opDown() {
    b.move('down');
    b.newTurn();
    b.refresh();
  }

  function opLeft() {
    b.move('left');
    b.newTurn();
    b.refresh();
  }

  function opRight() {
    b.move('right');
    b.newTurn();
    b.refresh();
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
      opUp();
    } else if (e.key === 'ArrowDown') {
      opDown();
    } else if (e.key === 'ArrowLeft') {
      opLeft();
    } else if (e.key === 'ArrowRight') {
      opRight();
    }
  });

  let mouseDownLoc = { x: 0, y: 0 };
  let mouseUpLoc = { x: 0, y: 0 };
  gameBoardEle.addEventListener('mousedown', e => {
    gameBoardEle.style.backgroundColor = 'gray';
    mouseDownLoc.x = e.screenX;
    mouseDownLoc.y = e.screenY;
  });

  gameBoardEle.addEventListener('mouseup', e => {
    gameBoardEle.style.backgroundColor = 'transparent';
    mouseUpLoc.x = e.screenX;
    mouseUpLoc.y = e.screenY;
    let dx = mouseUpLoc.x - mouseDownLoc.x;
    let dy = mouseUpLoc.y - mouseDownLoc.y;
    // 通过绝对值来判断鼠标到底是往哪个方向移动
    if (Math.abs(dx) > Math.abs(dy)) {
      // 横移
      if (dx > 0) {
        // 向右边
        opRight();
      } else {
        opLeft();
      }
    } else {
      if (dy > 0) {
        opDown();
      } else {
        opUp();
      }
    }
  });
}

window.onload = function () {
  document.onkeydown = function (e) {
    e.preventDefault();
  };
  document.querySelector('#playEle').addEventListener('click', () => {
    startGame();
  });
};
