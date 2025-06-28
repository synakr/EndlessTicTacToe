const clr1 = `#B75E77`; //player 1, shade of red
const clr2 = `#B0D7FF`; //player 2, shade of blue
let clr = clr2;
let cross = `<i class="fa-solid fa-xmark logo"></i>`; //use with clr 2
let circle = `<i class="fa-regular fa-circle logo"></i>`; //use with clr 1
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
    if(clr === clr2) return clr1;
    else return clr2;
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

        //push the element and check for win
        if(clr === clr2){
            box.innerHTML = cross;
            player1.push(index);

            let tempRow = checkWin(player1);
            if(tempRow.length == 3){
                document.querySelector("#winner").innerText = "Player1 Won";
                glowBox(tempRow);
                win = true;
                return;
            }
        }
        else{
            box.innerHTML = circle;
            player2.push(index);

            let tempRow = checkWin(player2);
            if (tempRow.length == 3){
                document.querySelector("#winner").innerText = "Player2 Won";
                glowBox(tempRow);
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
            boxes[idx].style.backgroundColor = "#023e8a4D";
            boxes[idx].innerHTML = "";
            idx = queue.shift();
            boxes[idx].style.backgroundColor = "#023e8a4D";
            boxes[idx].innerHTML = "";

            player1.shift();
            player2.shift();
        }
    });
});

let btn = document.querySelector(".restart");
btn.addEventListener("click", ()=>{
    btn.style.backgroundColor = "#89577C";
    location.reload();
});
