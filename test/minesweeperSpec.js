/*jshint expr: true*/

var chai = require('chai');
var expect = chai.expect;

var minesweeper = require('../src/minesweeper.js');

var CellStateEnum = minesweeper.CellStateEnum;
var CellFlagEnum = minesweeper.CellFlagEnum;
var BoardStateEnum = minesweeper.BoardStateEnum;
var Cell = minesweeper.Cell;
var Board = minesweeper.Board;

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
  });
});