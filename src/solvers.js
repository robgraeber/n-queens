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

var removeDuplicates = function (collection){
  var strCollection = _.map(collection, function(item){
    return JSON.stringify(item);
  });
  strCollection = _.uniq(strCollection);
  return _.map(strCollection, function(item){
    return JSON.parse(item);
  });
}

window.findNRooksSolutions = function(n, board){
  board = board || makeEmptyBoard(n);
  var possibleBoards = placePiece(board, PieceType.rook);
  n--;
  if (n === 0){
    return possibleBoards;
  } else if (n > 0){
    var arr = [];
    for (var i = 0; i < possibleBoards.length; i++){
      arr = arr.concat(findNRooksSolutions(n, possibleBoards[i]) );
    }
    return removeDuplicates(arr);
  }
}

window.findNRooksSolution = function(n, board) {
  board = board || makeEmptyBoard(n);
  var possibleBoards = placePiece(board, PieceType.rook);
  n--;
  if (n === 0){
    return possibleBoards;
  } else if (n > 0){
    var arr = [];
    for (var i = 0; i < possibleBoards.length; i++){
      arr = arr.concat( findNRooksSolution(n, possibleBoards[i]) );
      break;
    }
    return removeDuplicates(arr);
  }
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = findNRooksSolutions(n).length; //fixme
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

window.debugFindNRooksSolution = function(n, board){
  var before = (new Date()).getTime();
  var results = findNRooksSolutions(n,board);
  var after = (new Date()).getTime();
  console.log("Time Taken", after-before);
  return JSON.stringify(results);

}



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n, board) {
  return findNQueensSolutions(n)[0];
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = findNQueensSolutions(n).length; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
window.findNQueensSolutions = function(n, board){
  board = board || makeEmptyBoard(n);
  var possibleBoards = placePiece(board, PieceType.queen);
  n--;
  if (n === 0){
    return possibleBoards;
  } else if (n > 0){
    var arr = [];
    for (var i = 0; i < possibleBoards.length; i++){
      arr = arr.concat(findNQueensSolutions(n, possibleBoards[i]) );
    }
    return removeDuplicates(arr);
  }
}
window.placePiece = function(board, pieceType){
  var possibleBoards = [];
  for (var x = 0; x < board.length; x++){
    for (var y = 0; y < board.length; y++){
      if (board[x][y] === PieceType.empty){
        var b = $.extend(true, [], board);
        b[x][y] = pieceType;
        if(pieceType === PieceType.rook){
          updateBoard(x, y, b);
        }else{
          updateQueenBoard(x, y, b);
        }
        possibleBoards.push(b);
      }
    }
  }
  return possibleBoards;
}
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

window.updateQueenBoard = function(row, col, board){
  // row
  for (var y = 0; y < board[row].length; y++){
    if (col !== y){
      board[row][y] = PieceType.attack;
    }
  }
  // column
  for (var x = 0; x < board[col].length; x++){
    if (row !== x){
      board[x][col] = PieceType.attack;
    }
  }
  // diagonals
  var i = 1;
  while (col+i < board.length && row+i < board.length){
    board[row+i][col+i] = PieceType.attack;
    i++;
  }
  i = 1;
  while (col-i >= 0 && row-i >= 0){
    board[row-i][col-i] = PieceType.attack;
    i++;
  }
  i = 1;
  while (row-i >= 0 && col+i < board.length){
    board[row-i][col+i] = PieceType.attack;
    i++;
  }
  i = 1;
  while (row+i < board.length && col-i >= 0){
    board[row+i][col-i] = PieceType.attack;
    i++;
  }
  // console.log(board);
  return board;
}

var makeEmptyBoard = function(n) {
  return _(_.range(n)).map(function() {
    return _(_.range(n)).map(function() {
      return PieceType.empty;
    });
  });
};