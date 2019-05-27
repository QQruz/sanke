var canvas = document.querySelector('#screen');
var ctx = canvas.getContext("2d");
var width = window.innerWidth;
var height = window.innerHeight;

var screenSize = (width >= height ? height : width) - 10;
canvas.width = screenSize;
canvas.height = screenSize;

var blockCount = 20;
var blockSize = screenSize / 20;

var speed = 10;
var level = 1;
var points = 0;

var player = {
    'x' : 10,
    'y' : 10,
}

var velocity = {
    'x' : 1,
    'y' : 0,
}

var point = {
    'x' : Math.floor(Math.random() * blockCount),
    'y' : Math.floor(Math.random() * blockCount),
}

var tail = []
var tailLenght = 2;

function spawnPoint() {
    point.x=Math.floor(Math.random()*blockCount);
    point.y=Math.floor(Math.random()*blockCount);
    for (i = 0; i < tail.length; i++) {
        // prevents point from spawning inside the snake
        if (tail[i].x == point.x && tail[i].y == point.y) {
            spawnPoint();
            break;
        }
        
    }
}

function changeSpeed () {
    clearInterval(interval);
    interval = setInterval(game, 1000/speed);
}

function gameOver() {
    player.x = 10;
    player.y = 10;
    speed = 10;
    tail = [];
    tailLenght = 2
    points = 0;
    level = 1;
    changeSpeed();
    document.querySelector('#points').textContent = 'Points: ' + points;
    document.querySelector('#level').textContent = 'Level: ' + level;
}

function levelUp() {
    if (tailLenght % 10 == 0) {
        level += 1;
        document.querySelector('#level').textContent = 'Level: ' + level;
        speed += 5;
        changeSpeed();
    }
}

function pointUp() {
    if(point.x==player.x && point.y==player.y) {
        tailLenght++;
        points += level;
        document.querySelector('#points').textContent = 'Points: ' + points;
        levelUp();
        spawnPoint();
    }
}

function game() {
    
    player.x += velocity.x;
    player.y += velocity.y;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (player.x<0) {
        player.x= blockCount-1;
    }
    if (player.x>blockCount-1) {
        player.x= 0;
    }
    if (player.y<0) {
        player.y= blockCount-1;
    }
    if (player.y>blockCount-1) {
        player.y= 0;
    }
    
    
    ctx.fillStyle = 'green';
    for (i=0; i<tail.length; i++) {
        ctx.fillRect(tail[i].x*blockSize,tail[i].y*blockSize,blockSize-2,blockSize-2);
        if(tail[i].x==player.x && tail[i].y==player.y) {
            gameOver();
        }
    }
    tail.push({
        x:player.x,
        y:player.y
    });
    while(tail.length > tailLenght) {
        tail.shift();
    }

    pointUp();

    ctx.fillStyle="red";
    ctx.fillRect(point.x*blockSize,point.y*blockSize,blockSize-2,blockSize-2);
}

function keyPush(event) {
	if (velocity.y != 0) {
		if (event.keyCode == 37) {
			event.preventDefault();
			velocity.x=-1;velocity.y=0;
		}
		if (event.keyCode == 39 && velocity.y != 0) {
			event.preventDefault();
			velocity.x=1;velocity.y=0;
		}
	}
    else if (velocity.x != 0) {
		if (event.keyCode == 38) {
			event.preventDefault();
			velocity.x=0;velocity.y=-1;
		}
		if (event.keyCode == 40) {
			event.preventDefault();
			velocity.x=0;velocity.y=1;
		}
	}
}

function touches(event) {
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    event.preventDefault();

    if (velocity.y != 0) {
        if (touchX  <= width / 2) {
            velocity.x=-1;velocity.y=0;
        }
        else {   
            velocity.x=1;velocity.y=0;
        }
    }
    else {
        if (touchY <= height / 2) {
            velocity.x=0;velocity.y=-1;
        }
        else {
            velocity.x=0;velocity.y=1;
        }
    }
    

}

document.addEventListener('touchstart', touches)
document.addEventListener("keydown",keyPush);
var interval = setInterval(game,1000/speed);
