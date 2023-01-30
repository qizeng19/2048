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
}

window.onload = function () {
  document.onkeydown = function (e) {
    e.preventDefault();
  };
  document.querySelector('#playEle').addEventListener('click', () => {
    startGame();
  });
};
