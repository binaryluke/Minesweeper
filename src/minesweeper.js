(function() {
  'use strict';

  /**
   *  CellStateEnum
   */

  var CellStateEnum = {
    CLOSED: 0,
    OPEN: 1
  };

  /**
   *  CellFlagEnum
   */

  var CellFlagEnum = {
    NONE: 0,
    EXCLAMATION: 1,
    QUESTION: 2
  };

  /**
   *  BoardStateEnum
   */

  var BoardStateEnum = {
    PRISTINE: 0,
    DIRTY: 1,
    LOST: 2,
    WON: 3
  };

  /**
   *  Cell
   */
    
  var Cell = function (x, y, isMine, numAdjacentMines) {
    this.x = x || 0;
    this.y = y || 0;
    this.isMine = isMine ? true : false;
    this.numAdjacentMines = numAdjacentMines || 0;
    this.state = CellStateEnum.CLOSED;
    this.flag = CellFlagEnum.NONE;
  };

  /**
   *  Board
   */

  var Board = function (mineArray) {
    var isValid;

    try {
      isValid = isMineArrayValid(mineArray);
    } catch (e) {
      isValid = false;
    }
    
    if (!isValid) {
      throw new Error('The mine array supplied to Board constructor was not valid');
    }

    this._state = BoardStateEnum.PRISTINE;
    this._numRows = mineArray.length;
    this._numCols = mineArray[0].length;
    this._numMines = getNumMinesFromMineArray(mineArray, this._numRows, this._numCols);
    this._grid = generateGridFromMineArray(mineArray, this._numRows, this._numCols);
  };

  Board.prototype.state = function () {
    return this._state;
  };

  Board.prototype.numRows = function () {
    return this._numRows;
  };

  Board.prototype.numCols = function () {
    return this._numCols;
  };

  Board.prototype.numMines = function () {
    return this._numMines;
  };

  Board.prototype.grid = function () {
    return this._grid;
  };

  /**
   *  Helpers
   */

  var generateGridFromMineArray = function (mineArray, numRows, numCols) {
    var x,
        y,
        grid = [];

    for (y = 0; y < numRows; y++) {
      grid[y] = [];
      for (x = 0; x < numCols; x++) {
        grid[y][x] = new Cell(
          x,
          y,
          mineArray[y][x] === 1 ? true : false,
          getNumAdjacentMineCount(mineArray, x, y)
        );
      }
    }

    return grid;
  };

  var getNumMinesFromMineArray = function (mineArray, numRows, numCols) {
    var x,
        y,
        mineCount = 0;

    for (y = 0; y < numRows; y++) {
      for (x = 0; x < numCols; x++) {
        if (mineArray[y][x] === 1) {
          mineCount++;
        }
      }
    }

    return mineCount;
  };

  var getNumAdjacentMineCount = function (mineArray, x, y) {
    var idxX,
        idxY,
        endX = x + 1,
        endY = y + 2,
        maxX = mineArray[0].length,
        maxY = mineArray.length,
        mineCount = 0;

    for (idxY = y - 1; idxY <= endY; idxY++) {
      for (idxX = x - 1; idxX <= endX; idxX++) {
        if (idxY !== y || idxX !== x) {
          if (idxY >= 0 && idxX >= 0 && idxY < maxY && idxX < maxX) {
            if (mineArray[idxY][idxX] === 1) {
              mineCount++;
            }
          }
        }
      }
    }

    return mineCount;
  };

  var isMineArrayValid = function (mineArray) {
    var rowIdx, colIdx, rows, columns, isValid = true;

    if (mineArray && mineArray.length) {
      rows = mineArray.length;
      columns = mineArray[0] ? mineArray[0].length : 0;

      if (columns === 0) {
        isValid = false;
      }
      
      for (rowIdx = 0; rowIdx < rows; rowIdx++) {
        if (mineArray[rowIdx].length !== columns) {
          isValid = false;
        } else {
          for (colIdx = 0; colIdx < columns; colIdx++) {
            if (mineArray[rowIdx][colIdx] !== 0 && mineArray[rowIdx][colIdx] !== 1) {
              isValid = false;
            }
          }
        }
      }  
    } else {
      isValid = false;
    }
    
    return isValid;
  };

  /**
   *  Object.extend polyfill
   */

  if (!Object.extend) {
    Object.extend = function (obj, props) {
      for (var prop in props) { obj[prop] = props[prop]; }
      return obj;
    };
  }

  /**
   *  Create exportable object
   */

  var minesweeper = {
    CellStateEnum: CellStateEnum,
    CellFlagEnum: CellFlagEnum,
    BoardStateEnum: BoardStateEnum,
    Cell: Cell,
    Board: Board
  };

  /**
   *  Export this module
   */

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = minesweeper;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return minesweeper;
      });
    }
    else {
      window.minesweeper = minesweeper;
    }
  }
})();