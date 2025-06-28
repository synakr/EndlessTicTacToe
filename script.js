let clr = "blue";
let cross = `<i class="fa-regular fa-circle-xmark logo"></i>`;
let right = `<i class="fa-regular fa-circle-check logo"></i>`;
let win = false;
const queue = [];
const player1 = [];
const player2 = [];

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
    if(clr === "blue") return "red";
    else return "blue";
}

function checkWin(playerArray){
    return winArray.some((row) => row.every(x => playerArray.includes(x)));
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

        //push the element and check for win
        if(clr === "blue"){
            player1.push(index);
            if(checkWin(player1)){
                document.querySelector("#winner").innerText = "Player1 Won";
                win = true;
                return;
            }
        }
        else{
            player2.push(index);
            if (checkWin(player2)){
                document.querySelector("#winner").innerText = "Player2 Won";
                win = true;
                return;
            }
        }

        clr = toggleClr(clr);

        //console.log(queue.length);
        // console.log("player1 ", player1);
        // console.log("player2 ",player2);

        //check for tie
        if(queue.length === 9){
            let idx = queue.shift();
            boxes[idx].style.backgroundColor = "pink";
            idx = queue.shift();
            boxes[idx].style.backgroundColor = "pink";

            player1.shift();
            player2.shift();
        }
    });
});

