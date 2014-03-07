/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting



/*********************************
  N-ROOKS
*********************************/
// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function(n){
  var item = null;
  var isFound = false;
  var recurse = function(n, bitColumn, boardLength, matrix){
    var bitColumn = bitColumn || Math.pow(2,n)-1; 
    var matrix = matrix || makeEmptyBoard(n);
    var boardLength = boardLength || n;
    for(var i = 0; i < boardLength; i++){
      if(bitColumn & 1<<i){
        var matrixCopy = $.extend(true, [], matrix);
        matrixCopy[i][n-1] = 1;
        var clone = bitColumn & ~(1 << i);
        if(n <= 1){
          item = matrixCopy;
          isFound = true;
        } else {
          isFound || recurse(n-1, clone, boardLength, matrixCopy);
        }
      } 
    }
  };
  recurse(n);
  return item;
}

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

window.findNRooksSolutions = function(n){
  var possibleBoards = [];
  var isFound = false;
  var recurse = function(n, bitColumn, boardLength, matrix){
    var bitColumn = bitColumn || Math.pow(2,n)-1; 
    var matrix = matrix || makeEmptyBoard(n);
    var boardLength = boardLength || n;
    for(var i = 0; i < boardLength; i++){
      if(bitColumn & 1<<i){
        var matrixCopy = $.extend(true, [], matrix);
        matrixCopy[i][n-1] = 1;
        //set(matrix, boardLength, i, n-1);
        var clone = bitColumn & ~(1 << i);
        if(n <= 1){
          possibleBoards.push(matrixCopy);
        } else {
          recurse(n-1, clone, boardLength, matrixCopy);
        }
      } 
    }
  };
  recurse(n);
  return possibleBoards;
}


/*********************************
  N-QUEENS
*********************************/

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n){
  var item = null;
  var isFound = false;
  var recurse = function(n, bitColumn, bitMajorD, bitMinorD, boardLength, matrix){
    var bitColumn = bitColumn || Math.pow(2,n)-1; 
    var bitMajorD = bitMajorD || Math.pow(2,n)-1; 
    var bitMinorD = bitMinorD || Math.pow(2,n)-1;  
    var matrix = matrix || makeEmptyBoard(n);
    var boardLength = boardLength || n;
    for(var i = 0; i < boardLength; i++){
      var union = bitColumn & bitMajorD & bitMinorD;
      if(union & 1<<i){
        var matrixCopy = $.extend(true, [], matrix);
        matrixCopy[i][n-1] = 1;
        var a = bitColumn & ~(1 << i);
        var b = (((bitMajorD & ~(1 << i))<<1) + 1) % Math.pow(2,boardLength);
        var c = ((bitMinorD & ~(1 << i))>>1) + Math.pow(2,boardLength-1);
        if(n <= 1){
          item = matrixCopy;
          isFound = true;
        } else {
          isFound || recurse(n-1, a,b,c, boardLength, matrixCopy);
        }
      } 
    }
  };
  recurse(n);
  return item;
}
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

window.findNQueensSolutions = function(n){
  var possibleBoards = [];
  var recurse = function(n, bitColumn, bitMajorD, bitMinorD, boardLength, matrix){
    var bitColumn = bitColumn || Math.pow(2,n)-1; 
    var bitMajorD = bitMajorD || Math.pow(2,n)-1; 
    var bitMinorD = bitMinorD || Math.pow(2,n)-1;  
    var matrix = matrix || makeEmptyBoard(n);
    var boardLength = boardLength || n;
    for(var i = 0; i < boardLength; i++){
      var union = bitColumn & bitMajorD & bitMinorD;
      if(union & 1<<i){
        var matrixCopy = $.extend(true, [], matrix);
        matrixCopy[i][n-1] = 1;
        var a = bitColumn & ~(1 << i);
        var b = (((bitMajorD & ~(1 << i))<<1) + 1) % Math.pow(2,boardLength);
        var c = ((bitMinorD & ~(1 << i))>>1) + Math.pow(2,boardLength-1);
        if(n <= 1){
          possibleBoards.push(matrixCopy);
        } else {
          recurse(n-1, a,b,c, boardLength, matrixCopy);
        }
      } 
    }
  };
  recurse(n);
  return possibleBoards;
}

/*********************************
  HELPERS
*********************************/

var makeEmptyBoard = function(n) {
  return _(_.range(n)).map(function() {
    return _(_.range(n)).map(function() {
      return 0;
    });
  });
};