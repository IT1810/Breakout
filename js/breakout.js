let x = canvas.width / 2;
let y = canvas.height - 30;
let r = 15;
let dx = 6;
let dy = -6;
let ballHitPlatformSpeed = 1;
let platformHeight = 30;
let platformWidth = 225;
let platformSpeed = 100;
let platformX = (canvas.width - platformWidth) / 2;
let brickWidth = 150;
let brickHeight = 40;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let brickColumnCount = Math.floor(canvas.width / (brickWidth + brickPadding));
let brickRowCount = 4;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
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

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
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
            if (bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPlatform();

    collisionDetection();

    if (x + dx > canvas.width - r || x + dx < r) {
        dx = -dx;
    }
    if (y + dy < r) {
        dy = -dy;
    } else if (y + dy > canvas.height - r) {
        if (x > platformX && x < platformX + platformWidth) {
            dy = -(dy + ballHitPlatformSpeed);
        } else {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);
        }
    }
    x += dx;
    y += dy;
}

let interval = setInterval(draw, 10);