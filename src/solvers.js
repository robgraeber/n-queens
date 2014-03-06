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
//rotate 90 degrees counter-clockwise
var rotateBoard = function(board){
  var n = board.length;
  var b = $.extend(true, [], board);
  var tmp;
  for (var i=0; i<n/2; i++){
    for (var j=i; j<n-i-1; j++){
      tmp=b[i][j];
      b[i][j]=b[j][n-i-1];
      b[j][n-i-1]=b[n-i-1][n-j-1];
      b[n-i-1][n-j-1]=b[n-j-1][i];
      b[n-j-1][i]=tmp;
    }
  }
  return b;
}

var removeDuplicates = function (collection){
  var strCollection = _.map(collection, function(item){
    return JSON.stringify(item);
  });
  strCollection = _.uniq(strCollection);
  return _.map(strCollection, function(item){
    return JSON.parse(item);
  });
}

var removeDuplicateRotations = function(boards){
  var rotatedBoards = [];
  for(var i = 0; i < boards.length; i++){
    var b1 = boards[i];
    var b2 = rotateBoard(b1);
    var b3 = rotateBoard(b2);
    var b4 = rotateBoard(b3);
    b1 = JSON.stringify(b1);
    b2 = JSON.stringify(b2);
    b3 = JSON.stringify(b3);
    b4 = JSON.stringify(b4);
    var found = false;
    for(var j = i+1;  j < boards.length; j++){
      var a1 = JSON.stringify(boards[j]);
      if(a1 === b1 || a1 === b2 || a1 === b3 || a1 === b4){
        found = true;
        break;
      }
    }
    if(!found){
      rotatedBoards.push(boards[i]);
    };
  }
  return removeDuplicates(rotatedBoards);
}

window.findNRooksSolution = function(n, board) {
  board = board || makeEmptyBoard(n);
  var possibleBoards = placeRook(board, n==1);
  n--;

  if (n === 0){
    // console.log('Single solution for ' + n + ' rooks:', JSON.stringify(possibleBoards));
    return possibleBoards;
  } else if (n > 0){
    var arr = [];
    for (var i = 0; i < possibleBoards.length; i++){
      arr = arr.concat( findNRooksSolution(n, possibleBoards[i]) );
    }
    return removeDuplicates(arr);
  }
};
window.debugFindNRooksSolution = function(n, board){
  var before = (new Date()).getTime();
  var results = findNRooksSolution(n,board);
  var after = (new Date()).getTime();
  console.log("Time Taken", after-before);
  return JSON.stringify(results);

}


window.placeRook = function(board, firstTime){
  firstTime = false;
  var possibleBoards = [];
  var boardLength = board.length;
  if(firstTime){
    boardLength = Math.ceil(board.length/2);
  }
  for (var x = 0; x < boardLength; x++){
    for (var y = 0; y < boardLength; y++){
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