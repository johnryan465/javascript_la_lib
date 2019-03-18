zipWith = (f, xs, ys) => xs.map((n,i) => f(n, ys[i]))

class Matrix {
  constructor(height, width, data = build2dArray(height,width)){
    this.height = height;
    this.width = width;
    this.data = data;
  }
  getData() {
    return this.data
  }
  setValue(i,j,x){
    this.data[i][j] = x
  }
  incrementValue(i,j,x){
    this.data[i][j] += x
  }
  getValue(i,j){
    return this.data[i][j]
  }
  addRow(i,x){
    this.setRow( i, zipWith( (a,b) => a + b ,this.getRow(i),x) )
  }
  scaleRow(i,l){
    this.setRow(i,this.getRow(i).map( a => a * l ));
  }
  getRow(i){
    return this.data[i]
  }
  setRow(i,x){
    this.data[i] = x
  }
  swapRows(i,j){
    var tmp = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = tmp;
  }
  copy(){
    var copyMatrx = new Matrix(this.height,this.width,this.data.slice());
    return copyMatrx;
  }
}

function add(a,b){
  var result = new Matrix(a.height , a.width);
  for(i = 0; i < a.height; i++){
    for(j = 0; j < a.width; j++){
      result.setValue(i,j,a.getValue(i,j) + b.getValue(i,j));
    }
  }
  return result;
}

function sub(a,b){
  var result = new Matrix(a.height , a.width);
  for(i = 0; i < a.height; i++){
    for(j = 0; j < a.width; j++){
      result.setValue(i,j,a.getValue(i,j) - b.getValue(i,j));
    }
  }
  return result;
}

function map(a,func){
  var result = new Matrix(a.height , a.width);
  for(i = 0; i < a.height; i++){
    for(j = 0; j < a.width; j++){
      result.setValue(i,j, func( a.getValue(i,j) ) );
    }
  }
  return result;
}

function scalarMul(a,lambda){
  return map(a, function (x) {return x * lambda});
}

function mul(a,b){
  var result = new Matrix(a.height , b.width);
  for(i = 0; i < a.height; i++){
    for(j = 0; j < b.width; j++){
      for(k = 0; k < a.width; k++){
        result.incrementValue(i,j,a.getValue(i,k) * b.getValue(k,j) );
      }
    }
  }
  return result;
}

function eye(n){
  var result = new Matrix(n , n);
  for(i = 0; i < n; i++){
    result.setValue(i,i,1);
  }
  return result;
}

function genPerm(i,j,n){
  var m = eye(n);
  m.swapRows(i,j);
  return m;
}

function subMul(n,lambda, x , subFrom){
  var m = eye(n);
  m.setValue(subFrom,x,lambda);
  return m;
}

function transpose(a){
  var result = new Matrix(a.width , a.height);
  for(i = 0; i < a.height; i++){
    for(j = 0; j < a.width; j++){
      result.setValue(j,i,a.getValue(i,j));
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

function ref(originalMatrix,all_rows=false){
  col = 0;
  matrices = []
  var x = originalMatrix.copy()
  for(row = 0; row < x.height && col < x.width;row++){
    while(col < x.width && x.getValue(row,col) == 0){
      rowToSwap = row;
      console.log(rowToSwap,col)
      console.log(x.data[rowToSwap][col])
      while(rowToSwap < x.height && x.getValue(rowToSwap,col) == 0){
        rowToSwap++;
      }
      console.log(rowToSwap,col)
      if(rowToSwap < x.height && x.getValue(rowToSwap,col) != 0 && row != rowToSwap){
        x.swapRows(rowToSwap,row);
        matrices.push(genPerm(row,rowToSwap,x.height) )
      }
      else{
        col++;
      }
    }

    //Scale row down
    var s = eye(x.height);
    s.setValue(row,row,x.getValue(row,col));
    matrices.push(s);
    x.scaleRow(row,1.0/x.getValue(row,col));

    for(next=row+1 ; next < x.height; next++){
      matrices.push(subMul(x.height,x.getValue(next,col),row,next))
      x.addRow(next, x.getRow(row).map(a => -a*x.getValue(next,col) )  );
    }
    col++;
  }
  matrices.push(x);
  console.log(x.data)
  return matrices
}


a = new Matrix(5,2,[[0.0001,2],[3,4],[5,6],[7,8],[9,10]]);

var f = ref(a)
console.log(a)
var res = eye(a.height)
for(d = 0; d < f.length; d++){
  res = mul(res,f[d])
}
console.log(res)
