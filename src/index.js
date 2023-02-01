import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import Board from './board';

function startGame() {
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

  // 记录鼠标的开始进入和离开的位置来判断是往哪边滑动
  let mouseDownLoc = { x: 0, y: 0 };
  let mouseUpLoc = { x: 0, y: 0 };

  window.addEventListener('keydown', handler);
  gameBoardEle.addEventListener('mousedown', mousedownHandler);
  gameBoardEle.addEventListener('mouseup', mouseuphandler);

  function mousedownHandler(e) {
    gameBoardEle.style.backgroundColor = 'gray';
    mouseDownLoc.x = e.screenX;
    mouseDownLoc.y = e.screenY;
  }

  function handler(e) {
    if (e.key === 'ArrowUp') {
      opUp();
    } else if (e.key === 'ArrowDown') {
      opDown();
    } else if (e.key === 'ArrowLeft') {
      opLeft();
    } else if (e.key === 'ArrowRight') {
      opRight();
    }
  }

  function mouseuphandler(e) {
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
  }

  return () => {
    window.removeEventListener('keydown', handler);
    gameBoardEle.removeEventListener('mousedown', mousedownHandler);
    gameBoardEle.removeEventListener('mouseup', mouseuphandler);
  };
}

document.onkeydown = function (e) {
  e.preventDefault();
};
document.querySelector('#playEle').addEventListener('click', () => {
  if (window.removeListenner) {
    window.removeListenner();
  }
  window.removeListenner = startGame();
});
