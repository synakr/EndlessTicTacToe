const p1 = localStorage.getItem("player1");
const p2 = localStorage.getItem("player2");
const tieVal = localStorage.getItem("tieBreaker");

document.querySelector("h3").innerText = `✖ : ${p1}  |  ◯ : ${p2};`

const clr1 = `#B75E77`; //player 1, shade of red
const clr2 = `#B0D7FF`; //player 2, shade of blue
let clr = clr2;
let cross = `<i class="fa-solid fa-xmark logo" style="font-size: 2em;"></i>`; //use with clr 2
let circle = `<i class="fa-regular fa-circle logo" style="font-size: 1.5em;"></i>`; //use with clr 1
let win = false;
const queue = [];
const player1 = [];
const player2 = [];

//currect player and symbol
const toss = localStorage.getItem("toss") === "1";
let symbol = toss ? cross : circle;

let currPlayer;
if(toss) currPlayer = player1; // toss true = player1 starts
else currPlayer = player2;

const winArray = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

function toggleClr(clr){
    if(clr === clr2) return clr1;
    else return clr2;
}

function togglePlayer(plr){
    if(plr === player1) return player2;
    else return player1;
}

function toggleSymbol(sym){
    if(sym === cross) return circle;
    else return cross;
}

//this function return an array
function checkWin(playerArray){
    let winRow = [];
    //return winArray.some((row) => row.every(x => playerArray.includes(x)));
    winArray.some(row => {
        if(row.every(x => playerArray.includes(x))){
            winRow = row;
            return true;
        }
        else return false;
    });

    return winRow;
}

function glowBox(array){
    array.forEach((i, idx) => {
        let clr = boxes[i].style.backgroundColor;
        boxes[i].style.transition = "background-color 1s";
        setTimeout(()=> {
            boxes[i].style.backgroundColor = "pink";
            setTimeout(() => {
                boxes[i].style.backgroundColor = clr;
            }, 500);
        }, idx * 500);
    });
}


//create a fnction that retuens the box/ box index that is clikcked
//boxes is an array of all the 9 boxes
const boxes = document.querySelectorAll(".nineBox"); 
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        //if already won or the box is already clicked then no more inputs
        if(queue.includes(index) || win) return;

        box.style.backgroundColor = clr;
        queue.push(index);

        box.innerHTML = symbol;
        symbol = toggleSymbol(symbol);

        //push the element and check for win
        currPlayer.push(index);

        let tempRow = checkWin(currPlayer);
        if(tempRow.length == 3){
            if(clr == clr2) document.querySelector("#winner").innerText = `${p2} Won`;
            else document.querySelector("#winner").innerText = `${p1} Won`;
            glowBox(tempRow);
            win = true;
            return;
        }

        clr = toggleClr(clr);

        //console.log(queue.length);
        // console.log("player1 ", player1);
        // console.log("player2 ",player2);

        //check for tie
        //let tie = 2;
        if(queue.length === 9){
            let tempPlayer = currPlayer;
            for(let i=0;i<tieVal;i++){
                let idx = queue.shift();
                boxes[idx].style.backgroundColor = "#023e8a4D";
                boxes[idx].innerHTML = "";
    
                tempPlayer.shift();
                tempPlayer = togglePlayer(tempPlayer);
            }
        }

        //toggle the player
        currPlayer = togglePlayer(currPlayer);
    });
});

let btn = document.querySelector(".restart");
btn.addEventListener("click", ()=>{
    btn.style.backgroundColor = "#89577C";
    location.reload();
});
