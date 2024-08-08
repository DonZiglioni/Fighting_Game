const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.8

const background = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './img/streetBG.png',
})

const shop = new Sprite({
    position: { x: 820, y: 340 },
    imageSrc: './img/shop_anim.png',
    scale: 1.4,
    framesMax: 6,
})


const player = new Fighter({
    position: { x: 110, y: 0 },
    velocity: { x: 0, y: 0 },
    color: 'red',
    imageSrc: './img/Idle.png',
    framesMax: 8,
    scale: 3.5,
    offset: { x: 320, y: 275 },
    sprites: {
        idle: {
            imageSrc: './img/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/TakeHitWhiteSilhouette.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './img/Death.png',
            framesMax: 6,
        }
    },
    attackBox: {
        offset: {
            x: 75,
            y: 0,
        },
        width: 250,
        height: 50,
    }
})

const playerTwo = new Fighter({
    position: { x: 875, y: 0 },
    velocity: { x: 0, y: 0 },
    color: 'blue',
    imageSrc: './img/playerTwoImg/Idle.png',
    framesMax: 4,
    scale: 3.5,
    offset: { x: 320, y: 295 },
    sprites: {
        idle: {
            imageSrc: './img/playerTwoImg/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/playerTwoImg/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/playerTwoImg/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/playerTwoImg/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/playerTwoImg/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './img/playerTwoImg/TakeHit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './img/playerTwoImg/Death.png',
            framesMax: 7,
        }
    },
    attackBox: {
        offset: {
            x: -250,
            y: 0,
        },
        width: 200,
        height: 50,
    }
})

// player.draw();
// playerTwo.draw();

console.log("Player One: ", player)
console.log("Player Two: ", playerTwo)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}


decreaseTimer()


function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, .15  )'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update();
    playerTwo.update();
    player.velocity.x = 0;
    playerTwo.velocity.x = 0;
    // c.fillRect(player.position.x, player.position.y, player.width, player.height)
    // c.fillRect(playerTwo.position.x, playerTwo.position.y, playerTwo.width, playerTwo.height)

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run');
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    if (keys.ArrowLeft.pressed && playerTwo.lastKey === 'ArrowLeft') {
        playerTwo.velocity.x = -5
        playerTwo.switchSprite('run');
    } else if (keys.ArrowRight.pressed && playerTwo.lastKey === 'ArrowRight') {
        playerTwo.velocity.x = 5
        playerTwo.switchSprite('run');
    } else {
        playerTwo.switchSprite('idle')
    }
    if (playerTwo.velocity.y < 0) {
        playerTwo.switchSprite('jump')
    } else if (playerTwo.velocity.y > 0) {
        playerTwo.switchSprite('fall')
    }

    if (rectangleCollision({
        rectangle1: player,
        rectangle2: playerTwo,
    }) && player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
        console.log("PLAYER 1 HIT PLAYER 2");
        playerTwo.takeHit()
        //document.querySelector("#playerTwoHealth").style.width = playerTwo.health + '%'
        gsap.to('#playerTwoHealth', {
            width: playerTwo.health + '%'
        })

    }

    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    if (rectangleCollision({
        rectangle1: playerTwo,
        rectangle2: player,
    }) && playerTwo.isAttacking && playerTwo.framesCurrent === 2) {
        playerTwo.isAttacking = false;
        console.log("PLAYER 2 HIT PLAYER 1!");
        player.takeHit()

        // document.querySelector("#playerHealth").style.width = player.health + '%'
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })

    }


    if (playerTwo.isAttacking && playerTwo.framesCurrent === 2) {
        playerTwo.isAttacking = false;
    }

    if (player.health === 0) {
        determineWinner({ player, playerTwo, timerID })

    }
    if (playerTwo.health === 0) {
        determineWinner({ player, playerTwo, timerID })
    }


}

animate()

window.addEventListener("keydown", (object) => {
    console.log(object)

    if (!playerTwo.dead) {
        switch (object.key) {
            case "ArrowRight":
                keys.ArrowRight.pressed = true;
                playerTwo.lastKey = 'ArrowRight';
                break;
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true;
                playerTwo.lastKey = 'ArrowLeft';
                break;
            case "ArrowUp":
                playerTwo.velocity.y += -17
                break;
            case "Control":
                playerTwo.attack()
                break;
        }

    }
    if (!player.dead) {
        switch (object.key) {
            case "d":
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case "a":
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case "w":
                player.velocity.y += -17
                break;
            case ' ':
                player.attack()
                break;

        }


    }
})

window.addEventListener("keyup", (object) => {
    console.log(object)

    switch (object.key) {
        case "d":
            keys.d.pressed = false
            break;
        case "a":
            keys.a.pressed = false
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = false
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false
            break;

        default:
            break;
    }
})




//   node index.js