class Matrix {
  constructor(height, width, data = build2dArray(height,width)){
    this.height = height;
    this.width = width;
    this.data = data;
  }
}

function add(a,b){
  var result = new Matrix(a.height , a.width);
  for(i = 0; i < a.height; i++){
    for(j = 0; j < a.width; j++){
      result.data[i][j] = a.data[i][j] + b.data[i][j];
    }
  }
  return result;
}

function sub(a,b){
  var result = new Matrix(a.height , a.width);
  for(i = 0; i < a.height; i++){
    for(j = 0; j < a.width; j++){
      result.data[i][j] = a.data[i][j] - b.data[i][j];
    }
  }
  return result;
}

function applyElem(a,func){
  var result = new Matrix(a.height , a.width);
  for(i = 0; i < a.height; i++){
    for(j = 0; j < a.width; j++){
      result.data[i][j] = func(a.data[i][j])
    }
  }
  return result;
}

function scalarMul(a,lambda){
  return applyElem(a, function (x) {return x * lambda});
}

function mul(a,b){
  var result = new Matrix(a.height , b.width);
  for(i = 0; i < a.height; i++){
    for(j = 0; j < b.width; j++){
      for(k = 0; k < a.width; k++){
        result.data[i][j] += a.data[i][k] * b.data[k][j];
      }
    }
  }
  return result;
}

function build2dArray(height,width){
  var arr = [];

  for (var i=0;i<height;i++) {
      arr[i] = [];
      arr[i].length = width;
      arr[i].fill(0);
  }

  return arr;
}

a = new Matrix(2,2,[[2,2],[2,2]]);
b = new Matrix(2,2,[[1,0],[0,1]]);

console.log(mul(a,scalarMul(b,2)))
