// základní souřadnice kuličky a její poloměr p
let x = canvas.width / 2;
let y = canvas.height - 30;
let p = 15;
// posun kuličky
let dx = 4;
let dy = -4;
// základní údaje plošinky
let platformHeight = 35;
let platformWidth = 300;
let platformSpeed = 100;
let platformX = (canvas.width - platformWidth) / 2;
// základní údaje cihliček
let brickWidth = 150;
let brickHeight = 40;
// mezery mezi nimi
let brickPadding = 10;
// odsazení
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
// při nové hře se vypočítá počet sloupců
let brickColumnCount = Math.floor(canvas.width / (brickWidth + brickPadding));
let brickRowCount = 4;
// výpočet rychlosti
let ballHitPlatformSpeed = (4/(brickColumnCount));
let score =0;
// výpočet životů hráče a celkového počtu bodů
let lives = Math.floor(brickRowCount/2);

let totalPoints=((brickRowCount/2)+0.5)*(brickColumnCount*brickRowCount)     
// vytvoření pole objektů cihel s barvami, životy a souřadnicemi
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];// nejdříve se vytvoří sloupce a následně do nich sloupce
    
    for (let r = 0; r < brickRowCount; r++) {
        let brickLives = (brickRowCount-r);// zde se musí vypočítat životy cihliček a dát do objektu cihly[sloupec][řádek]
        console.log(brickLives);
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: brickLives,
            color: ['red','orange','yellow','green']
        };
    }
}

// ovládání odrazové plošinky pomocí kláves
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

// ovládání odrazové plošinky pomocí myši
document.addEventListener('mousemove', function(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        platformX = relativeX - platformWidth/2;
    }
    })

// řešení kolize pomocí kontrolování poloh objektů bricks (cihel) v poli bricks[sloupce][řádky]
function collisionDetection() {
    // vnořený cyklus for ve foru
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            // aby se lépe psal kód a pro přehlednost
            let b = bricks[c][r];
            if (b.status > 0) {//pokud má 1 a více životů
                /* Pokud je poloha kuličky (x,y) je mezi hodnotami jakékoli cihly
                    kulička se odrazí od cihly tím,
                    že se směr kuličky obrátí, 
                    žívot se odečte a připíše se skóre
                */ 
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    console.log();
                    b.status--;
                    score++;
                    // pokud skóre bude rovno celkovým bodům všech vytvořených cihel, vyhraješ
                    if(score == totalPoints) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}
// vykreslí se kruh s nějakým posunem x,y, poloměrem p, s fázovým posunem vykreslením a úhlem vykresleného oblouku 
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, p, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
// vykreslí odrazovou platformu pomocí posunu x,y a velikostí plošinky
function drawPlatform() {
    ctx.beginPath();
    ctx.rect(platformX, canvas.height - platformHeight, platformWidth, platformHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
// vykresli cihly
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {// nejdříve vykreslí sloupce, s počtem řádků
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status >= 1) {//vykreslí cihlu pokud má  1 a více životů
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;//lokální souřadnice cihel x,y 
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;                 
                let color =bricks[c][r].color[r];// nastavení barvy pomocí řádku
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = color ;//nastavení výplně obdélníku 
                ctx.fill();//vyplnění
                ctx.closePath();
            }
        }
    }
}
// výpis počtu skóre
function drawScore() {
    ctx.font = "16px Arial";// nastavení velikosti a typu písma
    ctx.fillStyle = "#0095DD";// nastavení barvy výplně textu
    ctx.fillText("Score: "+score, 8, 20);//vyplnění textu a hodnoty skóre
  }
//výpis životů
  function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
  }  
// vykreslení všech javascript a canvas objektů
function draw() {
    /* překreslení canvasu, aby se zvýšila plynulost,
        jinak by se kreslily objekty na objekty
        a hra by mohla spadnout a měli bychom několik stejných objektů různě po canvasu
    */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPlatform();
    drawScore();
    drawLives();
    collisionDetection();//kolize se musí řešit až po vykreslení
    console.log(totalPoints);
    // pokud souřadnice kuličky x s posunem dx je větší než šiřka canvasu, přehodí se hodnoty
    if (x + dx > canvas.width - p || x + dx < p) {
        dx = -dx;
    }
    if (y + dy < p) {
        dy = -dy;
    } else if (y + dy > canvas.height - p) {
        if (x > platformX && x < platformX + platformWidth) {
            dy = -(dy + (ballHitPlatformSpeed));// zde je řešeno zrychlení kuličky při dotyku s plošinkou
            console.log(dy);
        } else {// pokud x kuličky nebude v max a min x plošinky
            lives--;
            if(lives<0) {// pokud dojdou životy
            alert("GAME OVER");
            document.location.reload();
            }
            else {// jinak se obnoví nastavení platformy na původní
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 4;
                dy = -4;
                platformX = (canvas.width - platformWidth) / 2;   
            }
        }
    }
    // zde je řešen posun kuličky
    x += dx;
    y += dy;
    requestAnimationFrame(draw);// zde je řešené vykreslování celé hry
}
// spuštění celé hry
draw();