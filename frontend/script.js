const form = document.getElementById("file_form");
form.addEventListener("submit", submitFile);

const board = document.getElementById("pathfinder-board");
var isAnimating = false;
sampleBoard();

async function submitFile(event) {
    event.preventDefault();
    if (!isAnimating) {
        document.getElementById("load-msg").style = "display: block;";
        document.getElementById("error-resp").innerText = "";

        var xhr = new XMLHttpRequest();
        xhr.open("POST", form.action); 
        xhr.onload = handleResp;
        var formData = new FormData(form);
        xhr.send(formData);
    }
}


async function handleResp(event) {
    isAnimating = true;
    document.getElementById("load-msg").style = "display: none;";
    document.getElementById('results').innerText = "";

    try {
        respData = JSON.parse(event.target.response);
    } catch (err) {
        console.log(err);
        document.getElementById("error-resp").innerText = "Internal Error";
        isAnimating = false;
        return;
    }
    
    if (respData.error) {
        document.getElementById("error-resp").innerText = respData.error;
        isAnimating = false;
        return;
    }

    for (let board = 0; board < respData.length; board++) {
        createBoard(); // Reset board
        currentBoardData = respData[board];

        for (let wall = 0; wall < currentBoardData.walls.length; wall++) {
            document.getElementById(currentBoardData.walls[wall]).style = 'background-color: grey;';
        }
        
        document.getElementById(currentBoardData.start).innerHTML = '<img src="stick_figure.png" alt="Start" id="Start">';
        document.getElementById(currentBoardData.end).innerHTML = '<img src="hummus_emoji.png" alt="End" id="End">';
        await animateSpaces(currentBoardData.user_checked_spaces, '#28a745');
        await animateSpaces(currentBoardData.user_path, '#7DCE82');

        if (!currentBoardData.user_path_valid) {
            await animateSpaces(currentBoardData.correct_checked_spaces, '#2453ff');
        }
        await animateSpaces(currentBoardData.correct_path, '#43a0fd');

        document.getElementById('results').innerText += currentBoardData.msg;
    }
    isAnimating = false;
}


function animateSpaces(spaces, color) {
    i = 0;
    return new Promise((resolve)=> {
        animate = setInterval(()=>{
            if (i === spaces.length) {
                clearInterval(animate);
                return resolve();
            }
            coordinate = spaces[i];
            document.getElementById(coordinate).style = `background-color: ${color};`;
            i++;
        }, 50);
    });
}


function createBoard(height=20, width=20) {
    board.innerHTML = "";
    for (let row = 0; row < height; row++) {
        currentRow = document.createElement('tr');
        currentRow.id = `row${row}`;
        
        for (let col = 0; col < width; col++) {
            boardSquare = document.createElement('td');
            boardSquare.id = `${row},${col}`;

            currentRow.appendChild(boardSquare);
        }
        board.appendChild(currentRow);
    }
}

function sampleBoard() {
    board.innerHTML = `<tr id="row0"><td id="0,0" style="background-color: grey;"></td><td id="0,1"></td><td id="0,2"></td><td id="0,3"></td><td id="0,4"></td><td id="0,5" style="background-color: grey;"></td><td id="0,6"></td><td id="0,7"></td><td id="0,8"></td><td id="0,9"></td><td id="0,10" style="background-color: grey;"></td><td id="0,11"></td><td id="0,12" style="background-color: grey;"></td><td id="0,13" style="background-color: grey;"></td><td id="0,14" ></td><td id="0,15" ></td><td id="0,16" ></td><td id="0,17" style="background-color: grey;"></td><td id="0,18" style="background-color: grey;"></td><td id="0,19"></td></tr>
                        <tr id="row1"><td id="1,0" style="background-color: grey;"></td><td id="1,1" style="background-color: grey;"></td><td id="1,2"></td><td id="1,3"></td><td id="1,4"></td><td id="1,5"></td><td id="1,6" style="background-color: grey;"></td><td id="1,7"></td><td id="1,8" style="background-color: grey;"></td><td id="1,9" style="background-color: grey;"></td><td id="1,10" style="background-color: rgb(67, 160, 253);"><img src="hummus_emoji.png" alt="End" id="End"></td><td id="1,11" style="background-color: grey;"></td><td id="1,12" style="background-color: grey;"></td><td id="1,13" ></td><td id="1,14" ></td><td id="1,15" ></td><td id="1,16" ></td><td id="1,17" ></td><td id="1,18" ></td><td id="1,19"></td></tr>
                        <tr id="row2"><td id="2,0"></td><td id="2,1" style="background-color: grey;"></td><td id="2,2" style="background-color: grey;"></td><td id="2,3"></td><td id="2,4" style="background-color: grey;"></td><td id="2,5"></td><td id="2,6" style="background-color: grey;"></td><td id="2,7"></td><td id="2,8" ></td><td id="2,9"></td><td id="2,10" style="background-color: rgb(67, 160, 253);"></td><td id="2,11" style="background-color: grey;"></td><td id="2,12" style="background-color: grey;"></td><td id="2,13" ></td><td id="2,14" ></td><td id="2,15" ></td><td id="2,16" style="background-color: grey;"></td><td id="2,17" ></td><td id="2,18" style="background-color: grey;"></td><td id="2,19" style="background-color: grey;"></td></tr>
                        <tr id="row3"><td id="3,0"></td><td id="3,1" style="background-color: grey;"></td><td id="3,2" style="background-color: grey;"></td><td id="3,3"></td><td id="3,4"></td><td id="3,5"></td><td id="3,6"></td><td id="3,7" ></td><td id="3,8" ></td><td id="3,9" style="background-color: rgb(67, 160, 253);"></td><td id="3,10" style="background-color: rgb(67, 160, 253);"></td><td id="3,11" style="background-color: grey;"></td><td id="3,12" ></td><td id="3,13" style="background-color: grey;"></td><td id="3,14" ></td><td id="3,15" ></td><td id="3,16" ></td><td id="3,17" ></td><td id="3,18" ></td><td id="3,19" ></td></tr>
                        <tr id="row4"><td id="4,0"></td><td id="4,1"></td><td id="4,2"></td><td id="4,3" style="background-color: grey;"></td><td id="4,4" style="background-color: grey;"></td><td id="4,5"></td><td id="4,6" ></td><td id="4,7" ></td><td id="4,8" ></td><td id="4,9" style="background-color: rgb(67, 160, 253);"></td><td id="4,10" style="background-color: grey;"></td><td id="4,11" ></td><td id="4,12" ></td><td id="4,13" ></td><td id="4,14" ></td><td id="4,15" style="background-color: grey;"></td><td id="4,16" ></td><td id="4,17" ></td><td id="4,18" ></td><td id="4,19" ></td></tr>
                        <tr id="row5"><td id="5,0" style="background-color: grey;"></td><td id="5,1"></td><td id="5,2" style="background-color: grey;"></td><td id="5,3" style="background-color: grey;"></td><td id="5,4"></td><td id="5,5" ></td><td id="5,6" ></td><td id="5,7" ></td><td id="5,8" ></td><td id="5,9" style="background-color: rgb(67, 160, 253);"></td><td id="5,10" style="background-color: rgb(67, 160, 253);"></td><td id="5,11" style="background-color: rgb(67, 160, 253);"></td><td id="5,12" style="background-color: rgb(67, 160, 253);"></td><td id="5,13" style="background-color: rgb(67, 160, 253);"><img src="stick_figure.png" alt="Start" id="Start"></td><td id="5,14" ></td><td id="5,15" ></td><td id="5,16" style="background-color: grey;"></td><td id="5,17" ></td><td id="5,18" ></td><td id="5,19" ></td></tr>
                        <tr id="row6"><td id="6,0"></td><td id="6,1"></td><td id="6,2"></td><td id="6,3"></td><td id="6,4" style="background-color: grey;"></td><td id="6,5"></td><td id="6,6" ></td><td id="6,7" style="background-color: grey;"></td><td id="6,8" style="background-color: grey;"></td><td id="6,9" style="background-color: grey;"></td><td id="6,10" style="background-color: grey;"></td><td id="6,11" ></td><td id="6,12" ></td><td id="6,13" ></td><td id="6,14" ></td><td id="6,15" ></td><td id="6,16" ></td><td id="6,17" ></td><td id="6,18" ></td><td id="6,19" ></td></tr>
                        <tr id="row7"><td id="7,0"></td><td id="7,1"></td><td id="7,2"></td><td id="7,3"></td><td id="7,4" style="background-color: grey;"></td><td id="7,5" style="background-color: grey;"></td><td id="7,6" style="background-color: grey;"></td><td id="7,7" style="background-color: grey;"></td><td id="7,8"></td><td id="7,9" style="background-color: grey;"></td><td id="7,10"></td><td id="7,11" style="background-color: grey;"></td><td id="7,12" ></td><td id="7,13" ></td><td id="7,14" ></td><td id="7,15" ></td><td id="7,16" ></td><td id="7,17" ></td><td id="7,18" ></td><td id="7,19" ></td></tr>
                        <tr id="row8"><td id="8,0"></td><td id="8,1" style="background-color: grey;"></td><td id="8,2"></td><td id="8,3" style="background-color: grey;"></td><td id="8,4"></td><td id="8,5"></td><td id="8,6"></td><td id="8,7"></td><td id="8,8"></td><td id="8,9" style="background-color: grey;"></td><td id="8,10" style="background-color: grey;"></td><td id="8,11" ></td><td id="8,12" ></td><td id="8,13" ></td><td id="8,14" style="background-color: grey;"></td><td id="8,15" ></td><td id="8,16" ></td><td id="8,17" ></td><td id="8,18" style="background-color: grey;"></td><td id="8,19"></td></tr>
                        <tr id="row9"><td id="9,0"></td><td id="9,1"></td><td id="9,2"></td><td id="9,3"></td><td id="9,4"></td><td id="9,5"></td><td id="9,6"></td><td id="9,7"></td><td id="9,8"></td><td id="9,9"></td><td id="9,10" style="background-color: grey;"></td><td id="9,11" ></td><td id="9,12" ></td><td id="9,13" style="background-color: grey;"></td><td id="9,14" style="background-color: grey;"></td><td id="9,15" ></td><td id="9,16" style="background-color: grey;"></td><td id="9,17" ></td><td id="9,18" ></td><td id="9,19"></td></tr>
                        <tr id="row10"><td id="10,0"></td><td id="10,1"></td><td id="10,2"></td><td id="10,3"></td><td id="10,4"></td><td id="10,5"></td><td id="10,6"></td><td id="10,7" style="background-color: grey;"></td><td id="10,8"></td><td id="10,9" ></td><td id="10,10" ></td><td id="10,11" ></td><td id="10,12" ></td><td id="10,13" ></td><td id="10,14" ></td><td id="10,15" ></td><td id="10,16" ></td><td id="10,17"></td><td id="10,18" style="background-color: grey;"></td><td id="10,19"></td></tr>
                        <tr id="row11"><td id="11,0"></td><td id="11,1"></td><td id="11,2"></td><td id="11,3"></td><td id="11,4"></td><td id="11,5" style="background-color: grey;"></td><td id="11,6" style="background-color: grey;"></td><td id="11,7" style="background-color: grey;"></td><td id="11,8" style="background-color: grey;"></td><td id="11,9"></td><td id="11,10" ></td><td id="11,11" ></td><td id="11,12" ></td><td id="11,13" ></td><td id="11,14" ></td><td id="11,15" ></td><td id="11,16" style="background-color: grey;"></td><td id="11,17"></td><td id="11,18"></td><td id="11,19" style="background-color: grey;"></td></tr>
                        <tr id="row12"><td id="12,0" style="background-color: grey;"></td><td id="12,1"></td><td id="12,2" style="background-color: grey;"></td><td id="12,3" style="background-color: grey;"></td><td id="12,4"></td><td id="12,5" style="background-color: grey;"></td><td id="12,6"></td><td id="12,7" style="background-color: grey;"></td><td id="12,8" style="background-color: grey;"></td><td id="12,9"></td><td id="12,10"></td><td id="12,11"></td><td id="12,12" ></td><td id="12,13" style="background-color: grey;"></td><td id="12,14"></td><td id="12,15" ></td><td id="12,16" style="background-color: grey;"></td><td id="12,17"></td><td id="12,18"></td><td id="12,19"></td></tr>
                        <tr id="row13"><td id="13,0"></td><td id="13,1"></td><td id="13,2" style="background-color: grey;"></td><td id="13,3"></td><td id="13,4"></td><td id="13,5"></td><td id="13,6" style="background-color: grey;"></td><td id="13,7" style="background-color: grey;"></td><td id="13,8" style="background-color: grey;"></td><td id="13,9"></td><td id="13,10"></td><td id="13,11" style="background-color: grey;"></td><td id="13,12" ></td><td id="13,13" style="background-color: grey;"></td><td id="13,14" style="background-color: grey;"></td><td id="13,15" style="background-color: grey;"></td><td id="13,16"></td><td id="13,17" style="background-color: grey;"></td><td id="13,18"></td><td id="13,19"></td></tr>
                        <tr id="row14"><td id="14,0" style="background-color: grey;"></td><td id="14,1" style="background-color: grey;"></td><td id="14,2"></td><td id="14,3"></td><td id="14,4"></td><td id="14,5" style="background-color: grey;"></td><td id="14,6"></td><td id="14,7"></td><td id="14,8"></td><td id="14,9" style="background-color: grey;"></td><td id="14,10" style="background-color: grey;"></td><td id="14,11"></td><td id="14,12" style="background-color: grey;"></td><td id="14,13" style="background-color: grey;"></td><td id="14,14"></td><td id="14,15"></td><td id="14,16"></td><td id="14,17"></td><td id="14,18"></td><td id="14,19"></td></tr>
                        <tr id="row15"><td id="15,0"></td><td id="15,1"></td><td id="15,2"></td><td id="15,3"></td><td id="15,4"></td><td id="15,5"></td><td id="15,6"></td><td id="15,7"></td><td id="15,8"></td><td id="15,9"></td><td id="15,10"></td><td id="15,11" style="background-color: grey;"></td><td id="15,12" style="background-color: grey;"></td><td id="15,13" style="background-color: grey;"></td><td id="15,14"></td><td id="15,15"></td><td id="15,16"></td><td id="15,17"></td><td id="15,18"></td><td id="15,19"></td></tr>
                        <tr id="row16"><td id="16,0" style="background-color: grey;"></td><td id="16,1"></td><td id="16,2" style="background-color: grey;"></td><td id="16,3"></td><td id="16,4"></td><td id="16,5"></td><td id="16,6"></td><td id="16,7" style="background-color: grey;"></td><td id="16,8"></td><td id="16,9"></td><td id="16,10"></td><td id="16,11"></td><td id="16,12"></td><td id="16,13" style="background-color: grey;"></td><td id="16,14" style="background-color: grey;"></td><td id="16,15"></td><td id="16,16"></td><td id="16,17" style="background-color: grey;"></td><td id="16,18"></td><td id="16,19" style="background-color: grey;"></td></tr>
                        <tr id="row17"><td id="17,0"></td><td id="17,1"></td><td id="17,2" style="background-color: grey;"></td><td id="17,3" style="background-color: grey;"></td><td id="17,4" style="background-color: grey;"></td><td id="17,5"></td><td id="17,6"></td><td id="17,7" style="background-color: grey;"></td><td id="17,8"></td><td id="17,9" style="background-color: grey;"></td><td id="17,10" style="background-color: grey;"></td><td id="17,11"></td><td id="17,12" style="background-color: grey;"></td><td id="17,13"></td><td id="17,14"></td><td id="17,15" style="background-color: grey;"></td><td id="17,16"></td><td id="17,17"></td><td id="17,18" style="background-color: grey;"></td><td id="17,19"></td></tr>
                        <tr id="row18"><td id="18,0"></td><td id="18,1" style="background-color: grey;"></td><td id="18,2"></td><td id="18,3" style="background-color: grey;"></td><td id="18,4" style="background-color: grey;"></td><td id="18,5"></td><td id="18,6"></td><td id="18,7"></td><td id="18,8" style="background-color: grey;"></td><td id="18,9"></td><td id="18,10"></td><td id="18,11" style="background-color: grey;"></td><td id="18,12"></td><td id="18,13"></td><td id="18,14"></td><td id="18,15"></td><td id="18,16"></td><td id="18,17"></td><td id="18,18"></td><td id="18,19" style="background-color: grey;"></td></tr>
                        <tr id="row19"><td id="19,0" style="background-color: grey;"></td><td id="19,1"></td><td id="19,2" style="background-color: grey;"></td><td id="19,3" style="background-color: grey;"></td><td id="19,4" style="background-color: grey;"></td><td id="19,5"></td><td id="19,6"></td><td id="19,7" style="background-color: grey;"></td><td id="19,8"></td><td id="19,9" style="background-color: grey;"></td><td id="19,10" style="background-color: grey;"></td><td id="19,11"></td><td id="19,12"></td><td id="19,13"></td><td id="19,14"></td><td id="19,15"></td><td id="19,16"></td><td id="19,17"></td><td id="19,18"></td><td id="19,19"></td></tr>`
}