function rectangleCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({ player, playerTwo, timerID }) {
    clearTimeout(timerID)
    document.querySelector('#displayText').style.display = 'flex';
    if (player.health === playerTwo.health) {
        document.querySelector('#displayText').innerHTML = 'TIE GAME!';
    } else if (player.health > playerTwo.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 WINS!';
    } else if (player.health < playerTwo.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 WINS!';
    }
}


let timer = 60;
let timerID;
function decreaseTimer() {
    timerID = setTimeout(decreaseTimer, 1000)
    if (timer > 0) {
        timer--,
            document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({ player, playerTwo })
    }

}