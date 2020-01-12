let x = canvas.width / 2;
let y = canvas.height - 30;
let p = 15;
let dx = 4;
let dy = -4;
let platformHeight = 35;
let platformWidth = 300;
let platformSpeed = 100;
let platformX = (canvas.width - platformWidth) / 2;
let brickWidth = 150;
let brickHeight = 40;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let brickColumnCount = Math.floor(canvas.width / (brickWidth + brickPadding));
let brickRowCount = 4;
let ballHitPlatformSpeed = (4/(brickColumnCount));
let score =0;
let lives = Math.floor(brickRowCount/2);

let totalPoints=((brickRowCount/2)+0.5)*(brickColumnCount*brickRowCount)     

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    
    for (let r = 0; r < brickRowCount; r++) {
        let brickLives = (brickRowCount-r);
        console.log(brickLives);
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: brickLives,
            color: ['red','orange','yellow','green']
        };
    }
}

document.addEventListener('keydown', function (e) {
    switch (e.code) {
        case 'ArrowLeft':
            platformX -= platformSpeed;
            if (platformX < 0) {
                platformX = 0;
            }
            break;
        case 'ArrowRight':
            platformX += platformSpeed;
            if (platformX + platformWidth > canvas.width) {
                platformX = canvas.width - platformWidth;
            }
            break;
    }
})

document.addEventListener('mousemove', function(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        platformX = relativeX - platformWidth/2;
    }
    })

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status > 0) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    console.log();
                    b.status--;
                    score++;
                    if(score == totalPoints) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload(); // Needed for Chrome to end game
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, p, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPlatform() {
    ctx.beginPath();
    ctx.rect(platformX, canvas.height - platformHeight, platformWidth, platformHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status >= 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;                 
                let color =bricks[c][r].color[r];
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = color ;//"#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
  }

  function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
  }  

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPlatform();
    drawScore();
    drawLives();
    collisionDetection();
    console.log(totalPoints);

    if (x + dx > canvas.width - p || x + dx < p) {
        dx = -dx;
    }
    if (y + dy < p) {
        dy = -dy;
    } else if (y + dy > canvas.height - p) {
        if (x > platformX && x < platformX + platformWidth) {
            dy = -(dy + (ballHitPlatformSpeed));
            console.log(dy);
        } else {
            lives--;
            if(lives<0) {
            alert("GAME OVER");
            document.location.reload();
            }
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 4;
                dy = -4;
                platformX = (canvas.width - platformWidth) / 2;   
            }
        }
    }
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();