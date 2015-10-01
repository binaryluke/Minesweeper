(function() {
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
    LOST: 2
  };

  /**
   *  Cell
   */
    
  var Cell = function () {
    this.x = 0;
    this.y = 0;
    this.state = CellStateEnum.CLOSED;
    this.flag = CellFlagEnum.NONE;
    this.isMine = false;
    this.numAdjacentMines = 0;    
  };

  /**
   *  Board
   */

  var Board = function () {};

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