
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense

interface GameWindowProps {
  width: number;
  height: number;

  initBallX: number;
  initBallY: number;
  ballRadius: number;
  ballSpeed:    number;

  paddleWidth: number;
  paddleHeight: number;
  paddleSpeed: number;

}

const min = (a : number , b : number)=>{
  return a < b ? a : b;
}
const max = (a : number , b : number)=>{
  return a > b ? a : b;
}
  
const YourComponent: React.FC<GameWindowProps> = (props: GameWindowProps) => {

  let ballX : number = props.initBallX;
  let ballY : number = props.initBallY;
  let ballDirX: number = 1;
  let ballDirY: number = 1;

  let paddleX : number = 0;
  let paddleY : number = 0;

  let mousePressed : boolean = false;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
		let canvas = p5.createCanvas(props.width, props.height).parent(canvasParentRef);
    canvas.mousePressed(()=>{mousePressed = true});
    canvas.mouseReleased(()=>{mousePressed = false});

	};
	
  const drawBall = (p5: p5Types) => {
		p5.ellipse(ballX, ballY, props.ballRadius, props.ballRadius);
	};

  const updateBall = (p5: p5Types) => {
    //update
    ballX += props.ballSpeed * ballDirX;
    ballY += props.ballSpeed * ballDirY;

    //no overlap ?
    if (ballDirX > 0)
      ballX = min(ballX, props.width-props.ballRadius/2);
    else
      ballX = max(ballX, props.ballRadius/2);
    if (ballDirY > 0)
      ballY = min(ballY, props.height-props.ballRadius/2);
    else
      ballY = max(ballY, props.ballRadius/2);

    //collision
    if (ballX + props.ballRadius/2 >= props.width || ballX - props.ballRadius/2 <= 0)
      ballDirX *= -1;
    if (ballY + props.ballRadius/2 >= props.height || ballY - props.ballRadius/2 <= 0)
      ballDirY *= -1;
	};

  const drawPaddle = (p5 : p5Types) =>{
    p5.rect(paddleX,paddleY,props.paddleWidth, props.paddleHeight);
  }
  const updatePaddle= (p5: p5Types) =>{

    if (!mousePressed){
  
      //handle keys

      return ;
    }

    console.log(p5.mouseX,p5.mouseY)
    if (p5.mouseY > paddleY + props.paddleHeight / 2 + props.paddleSpeed)
      paddleY += props.paddleSpeed;
    else if(p5.mouseY < paddleY + props.paddleHeight / 2 - props.paddleSpeed)
      paddleY -= props.paddleSpeed;

    if (p5.mouseY > paddleY + props.paddleHeight / 2)
      paddleY = min(paddleY, props.height - props.paddleHeight);
    else
      paddleY = max(paddleY, 0);
  }
  
  // ball paddle collision
  const handlePaddleBounce= (p5: p5Types) =>{
  
    if (
         ballDirX == -1 
      && ballY > paddleY
      && ballY < paddleY + props.paddleHeight // ball in front of paddle and going toward paddle
    ){
      console.log("in paddle range")
      ballX = max(ballX, props.ballRadius/2 + props.paddleWidth);
      if (ballX - props.ballRadius/2 - props.paddleWidth <= 0)
        ballDirX *= -1;
    }
  }


	const draw = (p5: p5Types) => {

		p5.background(0);
    p5.frameRate(30);

    //ball
		drawBall(p5);
		updateBall(p5);

    //paddle
    drawPaddle(p5);
    updatePaddle(p5);

    // game logic ?

    handlePaddleBounce(p5);

	};

	return <Sketch setup={setup} draw={draw} />;
};

//Render using :
<YourComponent 
width={1000} height={700}
initBallX={500} initBallY={350} ballRadius={50} ballSpeed={10} 
paddleWidth={30} paddleHeight={150} paddleSpeed={10} 
/>
