let HEIGHT = 600;
let WIDTH = window.innerWidth;
let DIMNS = 600;
let barWidth = 20, barHeight = 80;
let xBarLeft, yBarLeft, xBarRight, yBarRight;
let leftX = 0, leftY = 0;
let rightX = DIMNS - barWidth, rightY = DIMNS - barWidth;
let barSpeed = 7, ballSpeed = 7;
var xBall = WIDTH/2;
var yBall = HEIGHT/2;
var xSpeed = (4, 8);
var ySpeed = (-4, -8);
var noteP1 = 0;
var noteP2 = 0;

function LBar() 
{
	xBarLeft = 0
	if (leftY < 40)
	{
		yBarLeft = 0;
		leftY = 40;
	}
	else if (leftY < 600 - 40)
	{
		yBarLeft = leftY - 40;
	}
	else
	{
		yBarLeft = 600 - 80;
	}
	fill(255, 255, 0);
	stroke(255, 255, 0);
	rect(xBarLeft, yBarLeft, barWidth, barHeight, 20);
}

function RBar() 
{
	xBarRight = WIDTH - barWidth
	if (rightY < 40)
	{
		yBarRight = 0;
		rightY = 40;
	}
	else if (rightY < 600 - 40)
	{
		yBarRight = rightY - 40;
	}
	else
	{
		yBarRight = 600 - 80;
	}
	fill(255, 255, 0);
	stroke(255, 255, 0);
	rect(xBarRight, yBarRight, barWidth, barHeight,20);
}

function setup() 
{
  createCanvas(WIDTH, HEIGHT);	
}

function draw() 
{
	createCanvas(WIDTH, HEIGHT);	
	background('rgb(0, 147, 71)');
	fill(255, 255, 0);
	stroke(255, 255, 0);
	circle(WIDTH / 2, HEIGHT / 2, 100);
	// rect(WIDTH / 2, 0, 10, HEIGHT);
	RBar();
	LBar();
	if (keyIsDown(UP_ARROW)) {
		leftY -= barSpeed;
	}
	if (keyIsDown(DOWN_ARROW)) {
		leftY += barSpeed;
	}
  
	if (keyIsDown(87)) { 
		rightY -= barSpeed;
	}
	if (keyIsDown(83)) {
		rightY += barSpeed;
	}

  	movement();
  	attackWall();
	result();
}

function movement() 
{
  xBall += xSpeed;
  yBall += ySpeed;  
  fill(255);
  ellipse(xBall, yBall, 20, 20);
}

function attackWall() 
{
 	if (xBall <= 20 || xBall > WIDTH - 20) 
	{
    	xSpeed *= -1;
		if(xBall < 20 && (yBall < yBarLeft || yBall > yBarLeft + barHeight))
		{
			resetGame();
			noteP2+=1;
		}
		else if (xBall > WIDTH - 20 && (yBall < yBarRight || yBall > yBarRight + barHeight))
		{
			resetGame();
			noteP1+=1;
		}
  	}
	if (yBall < 20 || yBall >= HEIGHT) 
    	ySpeed *= -1;
}

function resetGame()
{
	xBall = WIDTH / 2;
	yBall = HEIGHT / 2;
}

function result()
{
	fill(255, 255, 0);
	stroke(255, 255, 0);
	textSize(20);
	text("Player 1 : " + noteP1, WIDTH/3 , 25);
	text("Player 2 : " + noteP2, WIDTH/3 + 300, 25);
}
