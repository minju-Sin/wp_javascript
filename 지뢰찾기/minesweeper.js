function bombCount(i,j){  //폭탄의 개수를 세는 함수 
    let bombCount = 0;
    let ii;
    let jj;
    for(let k=0; k<8; k++){
        ii = i + neighbor[k][0];
        jj = j + neighbor[k][1];
        if(ii<0 || height<=ii) continue;
        if(jj<0 || width<=jj) continue;
        if(cells[ii*width+jj]==1) bombCount++;
    }
    return bombCount;
}

function checkCount(i,j){
    let checks=0;
    let ii;
    let jj;
    for(let k=0; k<8; k++){
        ii = i+neighbor[k][0];
        jj = j+neighbor[k][1];
        if(ii<0 || height<=ii) continue;
        if(jj<0 || width<=jj) continue;
        if(checked[ii*width+jj] == 1) checks++;
    }
    return checks;
}

function timeCount(){ //시간을 세는 함수  
    curTime++;
    document.getElementById('time').innerHTML = leadingZeros(curTime,3); 
    if(curTime == 999){
        gameOver();
    }
}

function leadingZeros(n, digits){ 
    var zero = '';
    n = n.toString();
    if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

function mouseDown(e, element,id){ //mouseDown event 
    if(e.button ==0){
        leftMB = true;
        if(rightMB == true) bothDown(element, id);
    } 
    else if(e.button ==2){
        if(leftMB==true) bothDown(element, id);
        rightMB = true;
    } 
}

function mouseUp(e, element, id){ //mouseUp event 
    if(bothMB){
        leftMB = false;
        rightMB = false;
        bothMB = false;
        return;
    }
    if(e.button ==0){ 
        if(rightMB ==false) leftClick(element, id);
        else{
            bothMB = true;
            bothClick(element, id);
        }
        leftMB = false;
    }
    else if(e.button ==2){
        if(leftMB == false) rightClick(element, id);
        else{
            bothMB = true;
            bothClick(element, id);
        }
        rightMB = false;
    }
}

function doNothing(e){
    e.preventDefault();
}

function leftClick(element, id){
    if(isGameEnd == true) return;
    const i = parseInt(id/width);
    const j = id%width;
    let ii,jj;
    if(isStarted == false){
        for(k=0; k<nBombs; k++){
            ii = i; jj = j;
            while((ii-i)*(ii-i)<2 && (jj-j)*(jj-j)<2 && cells[ii*width+jj]==0){
                ii = Math.floor((Math.random() * height));
                jj = Math.floor((Math.random() * width));
            }
            cells[ii*width+jj] =1;
        }
        myInterval = setInterval(timeCount, 1000);
        isStarted = true;
    }
    openCells(i, j);
}

function rightClick(element, id){
    if(isGameEnd == true) return;
    if(remainBombs ==0 && checked[id]==0) return;
    const i = parseInt(id/width);
    const j = id%width;
    if(checked[id]==1){
        checked[id] = 0;
        remainBombs++;
        document.getElementById(String(i*width+j)).style.backgroundColor = 'lightgray';
    }
    else{
        checked[id] = 1;
        remainBombs--;
        document.getElementById(String(i*width+j)).style.backgroundColor = 'orange';
    }
    document.getElementById('bomb').innerHTML = leadingZeros(remainBombs, 3);
}

function bothDown(element, id){ //마우스 버튼을 눌렀을 때 8개의 칸을 눌려줌 
    if(isGameEnd ==true) return;
    //console.log("both mouse button down");
    savedID = id;
    //console.log("savedID" + savedID);
    const i = parseInt(id/width);
    const j = id%width;
    let ii;
    let jj;
    for(let k=0; k<8; k++){
        ii = i+neighbor[k][0];
        jj = j+neighbor[k][1];
        if(ii<0 || height<=ii) continue;
        if(jj<0 || width<=jj) continue;
        let iidd = ii*width+jj;
        if(cells[iidd]<2 && checked[iidd]==0) document.getElementById(String(iidd)).className = 'cellOpen';
    }
    if(cells[id]<2 && checked[id]==0) document.getElementById(String(id)).className = 'cellOpen';
}

function bothUp(element, id){ 
    if(isGameEnd == true) return;
    //console.log("both mouse button up");
    //console.log("savedID" + savedID);
    const i = parseInt(savedID/width);
    const j = savedID%width;
    let ii;
    let jj;
    for(let k=0; k<8; k++){
        ii = i+neighbor[k][0];
        jj = j+neighbor[k][1];
        if(ii<0 || height<=ii) continue;
        if(jj<0 || width<=jj) continue;
        let iidd = ii*width+jj;
        if(cells[iidd]<2 && checked[iidd]==0) document.getElementById(String(iidd)).className = 'cellClosed';
    }
    if(cells[savedID]<2 && checked[savedID]==0) document.getElementById(String(savedID)).className = 'cellClosed';
    if(cells[savedID]<2 && bombCount(i, j)==checkCount(i,j)){
        for(let k=0; k<8; k++){
            ii = i+neighbor[k][0];
            jj = j+neighbor[k][1];
            if(ii<0 || height<=ii) continue;
            if(jj<0 || width<=jj) continue;
            if(checked[ii*width+jj]==0 && cells[ii*width+jj]==0) openCells(ii,jj);
        }
    }
}

function bothClick(element, id){ //동시 클릭 
    if(isGameEnd == true) return;
}

function openCells(p, q){ 
    let visited = Array(arraySize);
    visited.fill(0);
    let queue = Array(arraySize);
    queue.fill(0);
    let front = 0, rear = 0;
    function deq(){
        return queue[front++];
    }
    function enq(id){
        queue[rear++] = id;
    }
    let i=p;
    let j=q;
    let ii;
    let jj;

    let id = i*width+j;
    if(cells[id]==2) return;
    if(checked[id]==1) return;
    if(cells[id]==1){
        document.getElementById(String(id)).style.backgroundColor = 'red';
        gameOver();
        return;
    }
    openCell(i,j);
    if(visited[id]==0 && bombCount(i,j)==0){
        enq(i*width+j);
    }
    visited[i*width+j] =1;
    while(front != rear){
        id  = deq();
        i = parseInt(id/width);
        j = id%width;
        openCell(i,j);
        for(let k=0; k<8; k++){
            ii = i+neighbor[k][0];
            jj = j+neighbor[k][1];
            if(ii<0 || 16<=ii) continue;
            if(jj<0 || 30<=jj) continue;

            openCell(ii,jj); 
            iidd = ii*width+jj;
            if(visited[iidd]==0 && bombCount(ii,jj)==0){
                enq(iidd);
            }
            visited[iidd] = 1;
        }
    }
    for(let i=0; i<height; i++){
        for(let j=0; j<width; j++){
            id = i*width+j;
            if(cells[id] ==1) return; //열리지 않은 빈칸 
        }
    }
    gameOver();
}

function openCell(i,j){
    let id = i*width+j;
    bombs = bombCount(i,j);
    extBombCount = "<span class='count cnt" + bombs + "'>" + (bombs?bombs:"")+ "</span>";

    document.getElementById(String(id)).className = 'cellOpen';
    document.getElementById(String(id)).innerHTML = extBombCount;

    let won = true;
    for(let i=0; i<height; i++){
        for(let j=0; j<width; j++){
            id = i*width+j;
            if(cells[id]==0){
                won = false;
                break;
            }
        }
    }
    if(won) gameOver();
}

function gameOver(){
    isGameEnd =true; 
    clearInterval(myInterval);
    for(let i=0; i<height; i++){
        for(let j=0; j<width; j++){
            id = i*width+j;
            if(cells[id] ==1){
                document.getElementById(String(id)).innerHTML =
                "<span class='bomb'>◎</span>";
            }
            if(cells[id] == 0 && checked[id] == 1){
                document.getElementById(String(id)).style.backgroundColor = 'red';
                document.getElementById(String(id)).innerHTML
                = "<span class='bomb cnt7'>●</span>";
            }
        }
    }
}

function reset(){
    isStarted = false;
    isGameEnd = false;

    remainBombs == 99;
    curTime = 0;

    leftMB = false;
    rightMB = false;
    bothMB = false;
    savedID = 16*30+1;
    
    cells.fill(0);
    checked.fill(0);
    clearInterval(myInterval);

    for(let i=0; i<height; i++){
        for(let j=0; j<width; j++){
            id = i*width+j;
            document.getElementById(String(id)).className = 'cellClosed';
            document.getElementById(String(id)).innerHTML = "";
            document.getElementById(String(id)).style.backgroundColor = 'lightgray';
        }
    }
}