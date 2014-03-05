/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

var PieceType = {};
PieceType['empty'] = 0;
PieceType['rook'] = 1;
PieceType['attack'] = 2;
PieceType['queen'] = 3;

window.findNRooksSolution = function(n, board) {
  board = board || makeEmptyBoard(n);
  var possibleBoards = placeRook(board);
  n--;

  if (n === 0){
    console.log('Single solution for ' + n + ' rooks:', JSON.stringify(possibleBoards));
    return possibleBoards;
  } else (n > 0){
    var arr = [];
    for (var i = 0; i < possibleBoards.length; i++){
      arr = arr.concat( findNRooksSolution(n, possibleBoards[i]) );
    }
    return arr;
  }
};



window.placeRook = function(board){
  var possibleBoards = [];

  for (var x = 0; x < board.length; x++){
    for (var y = 0; y < board.length; y++){
      if (board[x][y] === PieceType.empty){
        var b = $.extend(true, [], board);
        b[x][y] = PieceType.rook;
        updateBoard(x, y, b);
        possibleBoards.push(b);
      }
    }
  }

  return possibleBoards;
}


// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

window.updateBoard = function(row, col, board){
  for (var y = 0; y < board[row].length; y++){
    if (col !== y){
      board[row][y] = PieceType.attack;
    }
  }
  for (var x = 0; x < board[col].length; x++){
    if (row !== x){
      board[x][col] = PieceType.attack;
    }
  }
}

var makeEmptyBoard = function(n) {
  return _(_.range(n)).map(function() {
    return _(_.range(n)).map(function() {
      return PieceType.empty;
    });
  });
};