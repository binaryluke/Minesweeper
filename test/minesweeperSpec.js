/*jshint expr: true*/

var chai = require('chai');
var minesweeper = require('../src/minesweeper.js');

/**
 *  Aliases
 */

var expect = chai.expect;
var CellStateEnum = minesweeper.CellStateEnum;
var CellFlagEnum = minesweeper.CellFlagEnum;
var BoardStateEnum = minesweeper.BoardStateEnum;
var Cell = minesweeper.Cell;
var Board = minesweeper.Board;
var generateMineArray = minesweeper.generateMineArray;

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
 *  Cell Factory
 */

var CellFactory = {
  create: function (overwrites) {
    var defaults = {
      x: 2,
      y: 3,
      isMine: false,
      numAdjacentMines: 1
    };
    var values = Object.extend(defaults, overwrites);
    return new Cell(values.x, values.y, values.isMine, values.numAdjacentMines);
  }
};

/**
 *  Board Factory
 */

var BoardFactory = {
  create: function (overwrites) {
    var defaults = {
      mineArray: [
        [ 0 , 1 ]
      ]
    };
    var values = Object.extend(defaults, overwrites);
    return new Board(values.mineArray);
  }
};

/**
 *  Tests
 */

describe('Minesweeper', function() {
  describe('cell', function () {
    describe('constructor', function () {
      it('should have sensible defaults', function () {
        var cell = new Cell();
        expect(cell.x).to.equal(0);
        expect(cell.y).to.equal(0);
        expect(cell.state).to.equal(CellStateEnum.CLOSED);
        expect(cell.flag).to.equal(CellFlagEnum.NONE);
        expect(cell.isMine).to.be.false;
        expect(cell.numAdjacentMines).to.equal(0);
      });

      it('should let you specify the x,y coords', function () {
        var X = 3,
            Y = 4;

        var cell = CellFactory.create({ x: X, y: Y });
        expect(cell.x).to.equal(X);
        expect(cell.y).to.equal(Y);      
      });

      it('should let you specify whether the cell is a mine', function () {
        var cell = CellFactory.create({ isMine: false });
        var mineCell = CellFactory.create({ isMine: true });
        expect(cell.isMine).to.be.false;
        expect(mineCell.isMine).to.be.true;
      });

      it('should let you specify the number of adjacent cells that are mines', function () {
        var cell = CellFactory.create({ numAdjacentMines: 4 });
        expect(cell.numAdjacentMines).to.equal(4);
      });
    });
  });

  describe('board', function () {
    describe('constructor', function () {
      it('should require a mine array to be created', function () {
        var fn = function () { return new Board(); }; 
        expect(fn).to.throw(Error);
      });

      it('should require a two dimensional mine array that\'s at least 1x1', function () {
        var fn1 = function () { return new Board([]); };
        var fn2 = function () { return new Board([[]]); };
        var fn3 = function () { return new Board([[0]]); };

        expect(fn1).to.throw(Error);
        expect(fn2).to.throw(Error);
        expect(fn3).to.not.throw(Error);
      });
    });

    describe('after initilising with a valid mine array', function () {
      var board, mineArray, correctGrid;

      beforeEach(function () {
        mineArray = [
          [ 1 , 1 , 0 ],
          [ 0 , 0 , 1 ],
          [ 0 , 0 , 0 ],
          [ 0 , 0 , 0 ]
        ];

        board = new BoardFactory.create({ mineArray: mineArray });

        correctGrid = [[
            CellFactory.create({ x: 0, y: 0, numAdjacentMines: 1, isMine: true }),
            CellFactory.create({ x: 1, y: 0, numAdjacentMines: 2, isMine: true }),
            CellFactory.create({ x: 2, y: 0, numAdjacentMines: 2 })
          ],[
            CellFactory.create({ x: 0, y: 1, numAdjacentMines: 2 }),
            CellFactory.create({ x: 1, y: 1, numAdjacentMines: 3 }),
            CellFactory.create({ x: 2, y: 1, numAdjacentMines: 1, isMine: true })
          ],[
            CellFactory.create({ x: 0, y: 2, numAdjacentMines: 0 }),
            CellFactory.create({ x: 1, y: 2, numAdjacentMines: 1 }),
            CellFactory.create({ x: 2, y: 2, numAdjacentMines: 1 })
          ],[
            CellFactory.create({ x: 0, y: 3, numAdjacentMines: 0 }),
            CellFactory.create({ x: 1, y: 3, numAdjacentMines: 0 }),
            CellFactory.create({ x: 2, y: 3, numAdjacentMines: 0 })
          ]
        ];
      });

      it('should have a board state of PRISTINE', function () {
        expect(board.state()).to.equal(BoardStateEnum.PRISTINE);
      });

      it('should have the correct row count', function () {
        expect(board.numRows()).to.equal(4);
      });

      it('should have the correct column count', function () {
        expect(board.numCols()).to.equal(3);
      });

      it('should have the correct mine count', function () {
        expect(board.numMines()).to.equal(3);
      });

      it('should have a grid with correct values for all cells', function () {
        var grid = board.grid();
        expect(board.grid()).to.deep.equal(correctGrid);
      });
    });

    describe('after flagging a cell', function () {
      var mineArray, board;

      beforeEach(function () {
        mineArray = [[ 0 , 1 ]];
        board = BoardFactory.create({ mineArray: mineArray });
      });

      it('should update that cell flag to EXCLAMATION from NONE for closed cells', function () {
        expect(board.cell(0,0).flag).to.equal(CellFlagEnum.NONE);
        board.cycleCellFlag(0,0);
        expect(board.cell(0,0).flag).to.equal(CellFlagEnum.EXCLAMATION);
      });

      it('should update that cell flag to QUESTION from EXCLAMATION for closed cells', function () {
        board.cycleCellFlag(0,0);
        expect(board.cell(0,0).flag).to.equal(CellFlagEnum.EXCLAMATION);
        board.cycleCellFlag(0,0);
        expect(board.cell(0,0).flag).to.equal(CellFlagEnum.QUESTION);
      });

      it('should update that cell flag to NONE from QUESTION for closed cells', function () {
        board.cycleCellFlag(0,0);
        board.cycleCellFlag(0,0);
        expect(board.cell(0,0).flag).to.equal(CellFlagEnum.QUESTION);
        board.cycleCellFlag(0,0);
        expect(board.cell(0,0).flag).to.equal(CellFlagEnum.NONE);
      });

      it('should not update the cell flag for open cells', function () {
        expect(board.cell(0,0).flag).to.equal(CellFlagEnum.NONE);
        board.openCell(0,0);
        board.cycleCellFlag(0,0);
        expect(board.cell(0,0).flag).to.equal(CellFlagEnum.NONE);
      });

      it('should not update the cell flag if the board state is already WON', function () {
        board.openCell(0,0);
        board.cycleCellFlag(1,0);
        expect(board.cell(1,0).flag).to.equal(CellFlagEnum.EXCLAMATION);
        expect(board.state()).to.equal(BoardStateEnum.WON);
        board.cycleCellFlag(1,0);
        expect(board.cell(1,0).flag).to.equal(CellFlagEnum.EXCLAMATION);
      });

      it('should not update the cell flag if the board state is already LOST', function () {
        board.cycleCellFlag(0,0);
        board.openCell(1,0);
        expect(board.cell(0,0).flag).to.equal(CellFlagEnum.EXCLAMATION);
        expect(board.state()).to.equal(BoardStateEnum.LOST);
        board.cycleCellFlag(0,0);
        expect(board.cell(0,0).flag).to.equal(CellFlagEnum.EXCLAMATION);
      });
    });

    describe('after opening a cell', function () {
      var mineArray,
          numRows,
          numCols,
          board,
          o,
          c;

      beforeEach(function () {
        o = CellStateEnum.OPEN;
        c = CellStateEnum.CLOSED;

        mineArray = [
          [ 0 , 0 , 1 ],
          [ 0 , 0 , 0 ],
          [ 0 , 0 , 0 ],
          [ 0 , 1 , 0 ]
        ];

        numRows = 4;
        numCols = 3;

        board = BoardFactory.create({ mineArray: mineArray });
      });

      it('should change the cell state to OPEN for CLOSED cells', function () {
        expect(board.cell(1,1).state).to.equal(CellStateEnum.CLOSED);
        board.openCell(1,1);
        expect(board.cell(1,1).state).to.equal(CellStateEnum.OPEN);
      });

      it('should not change the cell state for flagged cells', function () {
        expect(board.cell(1,1).state).to.equal(CellStateEnum.CLOSED);
        board.cycleCellFlag(1,1);
        board.openCell(1,1);
        expect(board.cell(1,1).state).to.equal(CellStateEnum.CLOSED);
        board.cycleCellFlag(1,1);
        board.openCell(1,1);
        expect(board.cell(1,1).state).to.equal(CellStateEnum.CLOSED);
      });

      it('should not change the cell state if the board state is LOST', function () {
        board = BoardFactory.create();
        board.openCell(1,0);
        expect(board.state()).to.equal(BoardStateEnum.LOST);
        expect(board.cell(0,0).state).to.equal(CellStateEnum.CLOSED);
      });

      it('should use the four-way flood-fill algorithm to "open up" the board (no flags)', function () {
        var openArray = [
          [ o , o , c ],
          [ o , o , o ],
          [ o , o , c ],
          [ c , c , c ]
        ];

        board.openCell(1,1);

        expect(board.cell(0,0).state).to.equal(openArray[0][0]);
        expect(board.cell(1,0).state).to.equal(openArray[0][1]);
        expect(board.cell(2,0).state).to.equal(openArray[0][2]);
        expect(board.cell(0,1).state).to.equal(openArray[1][0]);
        expect(board.cell(1,1).state).to.equal(openArray[1][1]);
        expect(board.cell(2,1).state).to.equal(openArray[1][2]);
        expect(board.cell(0,2).state).to.equal(openArray[2][0]);
        expect(board.cell(1,2).state).to.equal(openArray[2][1]);
        expect(board.cell(2,2).state).to.equal(openArray[2][2]);
        expect(board.cell(0,3).state).to.equal(openArray[3][0]);
        expect(board.cell(1,3).state).to.equal(openArray[3][1]);
        expect(board.cell(2,3).state).to.equal(openArray[3][2]);
      });

      it('should use the four-way flood-fill algorithm to "open up" the board (with EXCLAMATION flag)', function () {
        var openArray = [
          [ c , o , c ],
          [ c , o , o ],
          [ c , o , c ],
          [ c , c , c ]
        ];

        board.cycleCellFlag(0,1);
        board.openCell(1,1);

        expect(board.cell(0,0).state).to.equal(openArray[0][0]);
        expect(board.cell(1,0).state).to.equal(openArray[0][1]);
        expect(board.cell(2,0).state).to.equal(openArray[0][2]);
        expect(board.cell(0,1).state).to.equal(openArray[1][0]);
        expect(board.cell(1,1).state).to.equal(openArray[1][1]);
        expect(board.cell(2,1).state).to.equal(openArray[1][2]);
        expect(board.cell(0,2).state).to.equal(openArray[2][0]);
        expect(board.cell(1,2).state).to.equal(openArray[2][1]);
        expect(board.cell(2,2).state).to.equal(openArray[2][2]);
        expect(board.cell(0,3).state).to.equal(openArray[3][0]);
        expect(board.cell(1,3).state).to.equal(openArray[3][1]);
        expect(board.cell(2,3).state).to.equal(openArray[3][2]);
      });

      it('should use the four-way flood-fill algorithm to "open up" the board (with QUESTION flag)', function () {
        var openArray = [
          [ c , o , c ],
          [ c , o , o ],
          [ c , o , c ],
          [ c , c , c ]
        ];

        board.cycleCellFlag(0,1);
        board.cycleCellFlag(0,1);
        board.openCell(1,1);

        expect(board.cell(0,0).state).to.equal(openArray[0][0]);
        expect(board.cell(1,0).state).to.equal(openArray[0][1]);
        expect(board.cell(2,0).state).to.equal(openArray[0][2]);
        expect(board.cell(0,1).state).to.equal(openArray[1][0]);
        expect(board.cell(1,1).state).to.equal(openArray[1][1]);
        expect(board.cell(2,1).state).to.equal(openArray[1][2]);
        expect(board.cell(0,2).state).to.equal(openArray[2][0]);
        expect(board.cell(1,2).state).to.equal(openArray[2][1]);
        expect(board.cell(2,2).state).to.equal(openArray[2][2]);
        expect(board.cell(0,3).state).to.equal(openArray[3][0]);
        expect(board.cell(1,3).state).to.equal(openArray[3][1]);
        expect(board.cell(2,3).state).to.equal(openArray[3][2]);
      });
    });

    describe('state', function () {
      var board;

      beforeEach(function () {
        board = BoardFactory.create();
      });

      it('should be PRISTINE immediately following initilisation', function () {  
        expect(board.state()).to.equal(BoardStateEnum.PRISTINE);
      });

      it('should change from PRISTINE to IN_PROGRESS after first flag placed', function () {
        expect(board.state()).to.equal(BoardStateEnum.PRISTINE);
        board.cycleCellFlag(0,0);
        expect(board.state()).to.equal(BoardStateEnum.IN_PROGRESS);
      });

      it('should change from PRISTINE to IN_PROGRESS after first cell opening', function () {
        expect(board.state()).to.equal(BoardStateEnum.PRISTINE);
        board.openCell(0,0);
        expect(board.state()).to.equal(BoardStateEnum.IN_PROGRESS);
      });

      it('should change from IN_PROGRESS to WON if the cell flag causes the board' +
         ' to enter a winning state', function () {
        board.openCell(0,0);
        expect(board.state()).to.equal(BoardStateEnum.IN_PROGRESS);
        board.cycleCellFlag(1,0);
        expect(board.state()).to.equal(BoardStateEnum.WON);
      });

      it('should change from IN_PROGRESS to WON if opening the cell causes the board' +
         ' to enter a winning state', function () {
        board.cycleCellFlag(1,0);
        expect(board.state()).to.equal(BoardStateEnum.IN_PROGRESS);
        board.openCell(0,0);
        expect(board.state()).to.equal(BoardStateEnum.WON);
      });

      it('should change from IN_PROGRESS to LOST if a mine cell is opened', function () {
        board.openCell(1,0);
        expect(board.state()).to.equal(BoardStateEnum.LOST);
      });
    });
  });

  describe('generating mine arrays', function () {
    var board, mineArray, numRows, numCols, numMines;

    beforeEach(function () {
      numRows = 2;
      numCols = 3;
      numMines = 4;
      
      mineArray = generateMineArray({
        rows: numRows,
        cols: numCols,
        mines: numMines
      });

      board = BoardFactory.create({ mineArray: mineArray });
    });

    it('should produce the correct number of rows and columns', function () {
      expect(board.numRows()).to.equal(numRows);
      expect(board.numCols()).to.equal(numCols);
    });

    it('should produce the correct number of mines', function () {
      expect(board.numMines()).to.equal(numMines);
    });
  });
});