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

/*********************************
  N-ROOKS
*********************************/

// //board == [occupied, conflicts]
// window.placePiece = function(board, boardLength)
window.findNRooksSolution = function(n, board) {
  var solution = findNRooksSolutions(n, board)[0];
  return convertToMatrix(solution, n);
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other

window.countNRooksSolutions = function(n, bitColumn, boardLength, count){
  var bitColumn = bitColumn || Math.pow(2,n)-1; 
  var count = count || 0;
  var boardLength = boardLength || n;
  for(var i = 0; i < boardLength; i++){
    if(bitColumn & 1<<i){
      var clone = bitColumn & ~(1 << i);
      if(n <= 1){
        count++;
      } else {
        count = countNRooksSolutions(n-1, clone, boardLength, count);
      }
    } 
  }
  return count;
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

/*********************************
  N-QUEENS
*********************************/

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n, board) {
  var solution = findNQueensSolutions(n)[0];
  return convertToMatrix(solution, n);
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n, bitColumn, bitMajorD, bitMinorD, boardLength, count){
  var bitColumn = bitColumn || Math.pow(2,n)-1; 
  var bitMajorD = bitMajorD || Math.pow(2,n)-1; 
  var bitMinorD = bitMinorD || Math.pow(2,n)-1; 
  var count = count || 0;
  var boardLength = boardLength || n;
  for(var i = 0; i < boardLength; i++){
    var union = bitColumn & bitMajorD & bitMinorD;
    if(union & 1<<i ){
      var a = bitColumn & ~(1 << i);
      var b = (((bitMajorD & ~(1 << i))<<1) + 1) % Math.pow(2,boardLength);
      var c = ((bitMinorD & ~(1 << i))>>1) + Math.pow(2,boardLength-1);
      if(n <= 1){
        count++;
      } else {
        count = countNQueensSolutions(n-1, a,b,c, boardLength, count);
      }
    } 
  }
  return count;
}

window.findNQueensSolutions = function(n, board, boardLength){
  board = board || makeEmptyBoard(n);
  boardLength = boardLength || n;
  var possibleBoards = placePiece(board, boardLength, true);
  // printBoards(possibleBoards, boardLength)
  n--;
  if (n === 0){
    return possibleBoards;
  } else if (n > 0){
    var arr = [];
    for (var i = 0; i < possibleBoards.length; i++){
      arr = arr.concat(findNQueensSolutions(n, possibleBoards[i], boardLength) );
    }
    return removeDuplicates(arr);
  }
}

/*********************************
  HELPERS
*********************************/

var convertToMatrix = function(board, boardLength){
  if (board === undefined){
    return [];
  } else {
    var str = board[0].toString(2);
    var counterX = 0;
    var output = [];
    var row = [];
    for(var i = 0; i < boardLength * boardLength; i++){
      row.push( parseInt(str[str.length-i-1]) || 0);
      counterX++;
      if(counterX >= boardLength){
        output.push(row);
        row = [];
        counterX = 0;
      }
    }
    return output;
  }
}

var printBoards = function(boards, boardLength){
  for(var i = 0; i < boards.length; i++){
    printBoard(boards[i][0], boardLength);
    console.log("");
    printBoard(boards[i][1], boardLength);
    console.log("--------");
  }
}

var printBoard = function(board, boardLength){
  var str = board.toString(2);
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
    console.log( JSON.stringify(superTemp[j]) );
  }
}

var get = function(board, boardLength, x, y){
  var index = y * boardLength + x;
  return board & 1<<index;
}

var set = function(board, boardLength, x, y){
  if(get(board, boardLength, x, y) === 0){
    board += Math.pow(2, y * boardLength + x);
  }
  return board;
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
          conflicts = updateQueenBoard(conflicts, boardLength, x, y);
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
    conflicts = set(conflicts,boardLength, row, y);
  }
  // column
  for (var x = 0; x < boardLength; x++){
    conflicts = set(conflicts,boardLength, x, col);
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

var removeDuplicates = function (collection){
  var strCollection = _.map(collection, function(item){
    return JSON.stringify(item);
  });
  strCollection = _.uniq(strCollection);
  return _.map(strCollection, function(item){
    return JSON.parse(item);
  });
}

var makeEmptyBoard = function(n) {
  return [0,0];
};