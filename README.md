# Minesweeper

A collection of objects that provide the logic needed to create a Minesweeper clone.

All you need to do in your project is write the UI.

## Dependencies

Minesweeper is written in vanilla JS and has no dependencies. Works with node and in the browser.

## Why

With so many front-end frameworks and view layer libraries to choose from, I am able to use this library to play around with them without needing to write a lot of irrelevant logic code.

## How

### Step 1: Include the library

Available as an npm package using

    npm install minesweeper

or a bower package using

    bower install minesweeper


Alternatively, you can just download the file from the `dist` directory and manually include it in your project using

    <script src="minesweeper.js"></script>

### Step 2: Access the library

If you're using modules in your project, you'll need to

    var minesweeper = require('minesweeper');

or the equivalent using an AMD style script loader such as require.js.

If you're directly including the source file using a script tag, it will be accessible at

    window.minesweeper

### Step 3: Create a mine array

Create a mine array by passing some options to `minesweeper.generateMineArray`.

All properties are optional, and will use the defaults specified below if not provided.

    var mineArray = minesweeper.generateMineArray({
        rows: 10,
        cols: 10,
        mines: 15
    });

### Step 4: Create a new board using the mine array

Create a `board` using the mine array you just created.

    var board = new minesweeper.Board(mineArray);

### Step 5: Render the board

Get a copy of the board grid with a call to `board.grid()`

    var grid = board.grid();

This will return a two-dimensional array filled with `minesweeper.Cell` objects that you can use to render the board.

Each cell has the following properties:

- `x` The zero-based column index that this cell belongs to
- `y` The zero-based row index that this cell belongs to
- `isMine` Boolean that specifies if this cell is a mine or not
- `numAdjacentMines` The number of adjacent mine cells (0 - 8)
- `state` Type of `minesweeper.CellStateEnum` which determines whether this cell has been opened by the user or not. Can be one of:
  - minesweeper.CellStateEnum.CLOSED
  - minesweeper.CellStateEnum.OPEN
- `flag` Type of `minesweeper.CellFlagEnum` which determines if the user has flagged this cell with an exclamation or question mark. Can be one of:
  - minesweeper.CellFlagEnum.NONE
  - minesweeper.CellFlagEnum.EXCLAMATION
  - minesweeper.CellFlagEnum.QUESTION

Assuming you know the rules of Minesweeper, that's all the information you need to render the board.  For example, you could now render the board to the browser console with the following code

    var BoardStateEnum = minesweeper.BoardStateEnum;
    var CellStateEnum = minesweeper.CellStateEnum;
    var CellFlagEnum = minesweeper.CellFlagEnum;
    var Board = minesweeper.Board;
    var Cell = minesweeper.Cell;
    var generateMineArray = minesweeper.generateMineArray;

    var printBoard = function (board) {
      var i,
          strColHead = '   ',
          grid = board.grid();

      // print a header that shows the column numbers 
      for (i = 0; i < board.numCols(); i++) {
        strColHead += '   ' + i + '   ';
      }
      console.log(strColHead);

      // print all the rows on the board
      for (i = 0; i < board.numRows(); i++) {
        printRow(grid[i], i);
      }
    };

    var printRow = function (rowArray, rowNum) {
      var i,
          cell,
          strRow = '';

      // Start the row with the row number
      strRow += rowNum !== undefined ? ' ' + rowNum + ' ' : '';

      // Add each cell in the row to the string we will print
      for (i=0; i<rowArray.length; i++) {
        cell = rowArray[i];
        if (cell.state === CellStateEnum.CLOSED) {
          if (cell.flag === CellFlagEnum.NONE) {
            strRow += getCellString(' ');
          } else if (cell.flag === CellFlagEnum.EXCLAMATION) {
            strRow += getCellString('!');
          } else if (cell.flag === CellFlagEnum.QUESTION) {
            strRow += getCellString('?');
          }
        } else if (cell.state === CellStateEnum.OPEN) {
          if (cell.isMine) {
            strRow += getCellString('*');
          } else {
            strRow += getCellString(cell.numAdjacentMines);
          }
        }
      }

      // Print this row to the console
      console.log(strRow);
    };

    var getCellString = function (content) {
      return ' [ ' + content + ' ] ';
    };

    var mineArray = minesweeper.generateMineArray({
        rows: 5,
        cols: 5,
        mines: 5
    });

    var board = new Board(mineArray);

    printBoard(board);

### Step 6: Playing the game

There are two methods on the Board object that you use to play the game:

    board.openCell(x,y)
    board.cycleCellFlag(x,y)

x represents the column number, and y represents the row number. Both are zero-based indexes.

After each move, the internal state of the board and grid will update according to the rules of Minesweeper.

You can get the latest version of the grid by calling `board.grid()` again and re-rendering to the screen.

### Step 7: Check the game state

You can check the state of the board at anytime by calling

    board.state()

which returns an enum of type BoardStateEnum

- `BoardStateEnum.PRISTINE` Before any interaction (open cell, flag cell) the board is in this state
- `BoardStateEnum.IN_PROGRESS` The board has been interacted with, and is not in a winning or losing state
- `BoardStateEnum.LOST` The board is in a losing state, meaning that a mine cell has been opened
- `BoardStateEnum.WON` The board is in a winning state, meaning that all non-mine cells have been opened, and all mine cells have been flagged with an exclamation

Once the board enters either `BoardStateEnum.LOST` or `BoardStateEnum.WON`, any further attempts to modify the board using `board.openCell(x,y)` or board.cycleCellFlag(x,y)` will not be successful.

## Learn

The code is free and open-source under the MIT license, so feel free to use it in any way you like.  Whether that be in your own learning projects, in learning materials you put together for others, or in a published Minesweeper clone.

## Contributing

Any contributions to the code or this documentation are more than welcome. For bug fixes make sure you write new test cases that will prevent regression, and all existing tests should still be passing. Then submit your PR.

For breaking changes or new features, please raise an issue first. But I'm very friendly and will be receptive to your suggestions!

## Author

Feel free to connect with me on Twitter ([@binaryluke](https://twitter.com/binaryluke)), or learn more about me at [lukehoward.name](http://lukehoward.name)
    
