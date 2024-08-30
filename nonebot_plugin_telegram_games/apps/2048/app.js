document.addEventListener('DOMContentLoaded', () => {
  let score = 0;
  const boardSize = 4;

  let startX, startY, endX, endY;
  let board = Array(boardSize * boardSize).fill(0);

  const tiles = document.querySelectorAll('.tile');
  const scoreDisplay = document.querySelector('#score')

  function initBoard() {
    generateTile();
    generateTile();
    updateBoard();
  }

  function updateBoard() {
    tiles.forEach((tile, index) => {
      tile.textContent = board[index] === 0 ? '' : board[index];
      tile.setAttribute('data-board', board[index]);
    });
  }

  function generateTile() {
    let emptyTiles = board
      .map((val, idx) => (val === 0 ? idx : null))
      .filter(val => val !== null);

    if (emptyTiles.length === 0) return;

    let randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    let newValue = Math.random() > 0.1 ? 2 : 4;
    board[randomIndex] = newValue;

    const tileElement = tiles[randomIndex];
    tileElement.textContent = newValue;
    tileElement.classList.add('new');

    tileElement.addEventListener('animationend', () => {
      tileElement.classList.remove('new');
    });
  }


  function slide(row) {
    row = row.filter(val => val);
    while (row.length < boardSize) {
      row.push(0);
    }
    return row;
  }

  function combine(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1] && row[i] !== 0) {
        row[i] *= 2;
        row[i + 1] = 0;
        score += row[i];
        scoreDisplay.textContent = score;
      }
    }
    return row;
  }

  function handleMove() {

    setTimeout(() => {
      generateTile();
      updateBoard();
    }, 130);

    function isGameOver() {
      if (board.includes(0)) return false;
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize - 1; j++) {
          if (board[i * boardSize + j] === board[i * boardSize + j + 1]) return false;
          if (board[j * boardSize + i] === board[(j + 1) * boardSize + i]) return false;
        }
      }
      return true;
    }

    if (isGameOver()) {
      window.location.href = `over.html?score=${score}`;
    }
  }

  function moveLeft() {
    for (let i = 0; i < boardSize; i++) {
      let row = board.slice(i * boardSize, i * boardSize + boardSize);
      row = slide(row);
      row = combine(row);
      row = slide(row);
      board.splice(i * boardSize, boardSize, ...row);
    }
    handleMove();
  }

  function moveRight() {
    for (let i = 0; i < boardSize; i++) {
      let row = board.slice(i * boardSize, i * boardSize + boardSize);
      row.reverse();
      row = slide(row);
      row = combine(row);
      row = slide(row);
      row.reverse();
      board.splice(i * boardSize, boardSize, ...row);
    }
    handleMove();
  }

  function moveUp() {
    for (let i = 0; i < boardSize; i++) {
      let column = [];
      for (let j = 0; j < boardSize; j++) {
        column.push(board[i + j * boardSize]);
      }
      column = slide(column);
      column = combine(column);
      column = slide(column);
      for (let j = 0; j < boardSize; j++) {
        board[i + j * boardSize] = column[j];
      }
    }
    handleMove();
  }

  function moveDown() {
    for (let i = 0; i < boardSize; i++) {
      let column = [];
      for (let j = 0; j < boardSize; j++) {
        column.push(board[i + j * boardSize]);
      }
      column.reverse();
      column = slide(column);
      column = combine(column);
      column = slide(column);
      column.reverse();
      for (let j = 0; j < boardSize; j++) {
        board[i + j * boardSize] = column[j];
      }
    }
    handleMove();
  }

  document.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      case 'ArrowUp':
        moveUp();
        break;
      case 'ArrowDown':
        moveDown();
        break;
    }
  });

  document.addEventListener('touchstart', (event) => {
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
  });

  document.addEventListener('touchend', (e) => {
    e.cancelable && e.preventDefault();

    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;

    let diffX = endX - startX;
    let diffY = endY - startY;

    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        moveRight();
      } else {
        moveLeft();
      }
    } else if (Math.abs(diffY) > threshold) {
      if (diffY > 0) {
        moveDown();
      } else {
        moveUp();
      }
    }
  });

  initBoard();
});
