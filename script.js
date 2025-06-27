let clr = "red";
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
    [1,4,8],
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
        box.style.backgroundColor = clr;

        //push the element and check for win
        if(clr === "blue"){
            player1.push(index);
            if(checkWin(player1)){
                console.log("player 1 won");
                return;
            }
        }
        else{
            player2.push(index);
            if (checkWin(player2)){
                console.log("player 2 won");
                return;
            }
        }

        clr = toggleClr(clr);

        queue.push(index);
        console.log(queue);
        console.log("player1 ", player1);
        console.log("player2 ",player2);
    });
});

