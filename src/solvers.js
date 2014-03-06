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

window.findNRooksSolutions = function(n, board, boardLength){
  board = board || makeEmptyBoard(n);
  boardLength = boardLength || n;
  var possibleBoards = placePiece(board, boardLength);
  // printBoards(possibleBoards, boardLength)
  n--;
  if (n === 0){
    return possibleBoards;
  } else if (n > 0){
    var arr = [];
    for (var i = 0; i < possibleBoards.length; i++){
      arr = arr.concat( findNRooksSolutions(n, possibleBoards[i], boardLength));
    }
    return removeDuplicates(arr);
  }
}
// //board == [occupied, conflicts]
// window.placePiece = function(board, boardLength)
window.findNRooksSolution = function(n, board) {
  var solution = findNRooksSolutions(n, board)[0];
  return convertToMatrix(solution, n);
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

var convertToMatrix = function(board, boardLength){
  var str = board[0].toString(2);
  var counterX = 0;
  var temp = [];
  var superTemp = [];
  for(var i = 0; i < boardLength * boardLength; i++){
    temp.push( parseInt(str[str.length-i-1]) || 0);
    counterX++;
    if(counterX >= boardLength){
      superTemp.push(temp);
      temp = [];
      counterX = 0;
    }
  }
  return superTemp;
}

var makeEmptyMatrix = function(n){
  return _(_.range(n)).map(function() {
    return _(_.range(n)).map(function() {
      return 0;
    });
  });
}
var printBoards = function(boards, boardLength){
  for(var i = 0; i < boards.length; i++){
    printBoard(boards[i][0], boardLength);
    console.log("");
    printBoard(boards[i][1], boardLength);
    console.log("--------");
  }
}
var printBoard = function(boardInt, boardLength){
  var str = boardInt.toString(2);
  var counterX = 0;
  var temp = [];
  var superTemp = [];
  for(var i = 0; i < boardLength * boardLength; i++){
    temp.push( parseInt(str[str.length-i-1]) || 0);
    counterX++;
    if(counterX >= boardLength){
      superTemp.push(temp);
      temp = [];
      counterX = 0;
    }
  }
  for(var j = superTemp.length - 1; j >= 0; j--){
    console.log(superTemp[j]);
  }
}
var get = function(boardInt, boardLength, x, y){
  var index = y * boardLength + x;
  return boardInt & 1<<index;
}

var set = function(boardInt, boardLength, x, y){
  if(get(boardInt, boardLength, x, y) === 0){
    boardInt += Math.pow(2, y * boardLength + x);
  }
  return boardInt;
}
//board == [occupied, conflicts]
window.placePiece = function(board, boardLength, isQueen){
  var possibleBoards = [];
  for (var x = 0; x < boardLength; x++){
    for (var y = 0; y < boardLength; y++){
      var occupied = board[0];
      var conflicts = board[1];
      if (get(conflicts, boardLength, x, y) === 0){
        occupied = set(occupied, boardLength, x, y);
        conflicts = set(conflicts, boardLength, x, y);
        if(isQueen){
          conflicts = updateQueenBoard(x, y, conflicts);
        } else { 
          conflicts = updateBoard(conflicts, boardLength, x, y);
        }
        possibleBoards.push([occupied, conflicts]);
      }
    }
  }
  return possibleBoards;
}
window.updateBoard = function(conflicts, boardLength, row, col){
  for (var y = 0; y < boardLength; y++){
    conflicts = set(conflicts,boardLength, row, y);
  }
  for (var x = 0; x < boardLength; x++){
    conflicts = set(conflicts,boardLength, x, col);
  }
  return conflicts;
}

window.updateQueenBoard = function(conflicts, boardLength, row, col){
  // row
  for (var y = 0; y < boardLength; y++){
    if (col !== y){
      conflicts = set(conflicts,boardLength, row, y);
    }
  }
  // column
  for (var x = 0; x < boardLength; x++){
    if (row !== x){
      conflicts = set(conflicts,boardLength, x, col);
    }
  }
  // diagonals
  var i = 1;
  while (col+i < boardLength && row+i < boardLength){
    conflicts = set(conflicts,boardLength, row+i, col+i);
    i++;
  }
  i = 1;
  while (col-i >= 0 && row-i >= 0){
    conflicts = set(conflicts,boardLength, row-i, col-i);
    i++;
  }
  i = 1;
  while (row-i >= 0 && col+i < boardLength){
    conflicts = set(conflicts,boardLength, row-i, col+i);
    i++;
  }
  i = 1;
  while (row+i < boardLength && col-i >= 0){
    conflicts = set(conflicts,boardLength, row+i, col-i);
    i++;
  }
  // console.log(board);
  return conflicts;
}

var makeEmptyBoard = function(n) {
  return [0,0];
};