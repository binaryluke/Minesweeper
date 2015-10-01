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
        [ 0 , 1 , 0 ],
        [ 0 , 0 , 1 ],
        [ 0 , 0 , 0 ]
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
  describe('cells', function () {
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

  describe('boards', function () {
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

    describe('after initilising with a valid mine array', function () {
      var board, mineArray, correctGrid;

      beforeEach(function () {
        mineArray = [
          [ 0 , 1 , 0 ],
          [ 0 , 0 , 1 ],
          [ 0 , 0 , 0 ],
          [ 0 , 0 , 0 ]
        ];

        board = new BoardFactory.create({ mineArray: mineArray });

        correctGrid = [[
            CellFactory.create({ x: 0, y: 0, numAdjacentMines: 1 }),
            CellFactory.create({ x: 1, y: 0, numAdjacentMines: 1, isMine: true }),
            CellFactory.create({ x: 2, y: 0, numAdjacentMines: 2 })
          ],[
            CellFactory.create({ x: 0, y: 1, numAdjacentMines: 1 }),
            CellFactory.create({ x: 1, y: 1, numAdjacentMines: 2 }),
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
        expect(board.numMines()).to.equal(2);
      });

      it('should have a grid with correct values for all cells', function () {
        var grid = board.grid();
        expect(board.grid()).to.deep.equal(correctGrid);
      });
    });
  });
});