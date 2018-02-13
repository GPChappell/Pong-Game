import { SVG_NS, KEYS } from '../settings';

export default class Ball {

  constructor(radius, boardWidth, boardHeight, player1, player2) {
    this.radius = radius;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    this.served = false;
    this.direction = 1;
    this.goalScored = false;
    this.numberOfPaddleHits = 0;
    this.ping = new Audio('public/sounds/pong-01.wav');
    this.ping2 = new Audio('public/sounds/pong-02.wav');
    this.ping3 = new Audio('public/sounds/pong-03.wav');
    this.ping4 = new Audio('public/sounds/pong-04.wav');


    document.addEventListener('keydown', event => {
      switch (event.key) {
        case KEYS.lShift:
        if ( this.served === false ) {
          this.served = true;
          this.vx = this.direction * 8;
          this.vy = this.serveY();
        }
          break;
        case KEYS.left:
        if ( this.served === false ) {
          this.served = true;
          this.vx = this.direction * 8;
          this.vy = this.serveY();
          break;
        }
      }
    });
  } //END OF CONSTRUCTOR

   reset( player1, player2 ) {
    this.numberOfPaddleHits = 0;
    this.served = false;
  }

  //Generate a random angle between -45 and 45 then calculate vy relative to vx to serve ball at that angle.
  serveY () {
    let serveAngle = Math.ceil( ((Math.random()*100-10) - (Math.random()*100-10))/2 );
    return Math.abs(this.vx) * Math.tan( serveAngle * Math.PI/180 );
  }

  goal( player ) {
    player.score++;
    this.goalScored = true;
  }

  wallCollision() {
    const hitLeft = ( this.x - this.radius ) <= 0;
    const hitRight = ( this.x + this.radius ) >= this.boardWidth;
    const hitTop = ( this.y - this.radius ) <= 0;
    const hitBottom = ( this.y + this.radius ) >= this.boardHeight;

      if( hitTop || hitBottom ) {
        this.vy = -this.vy;
        this.ping2.play();
      }
      else if ( hitLeft || hitRight ){
        this.ping4.play();
      }
  }

  ballColor() {
    let rbgValue = Math.floor( 255 - ((this.x/this.boardWidth)*255) );
    return `rgb(${rbgValue},${rbgValue},${rbgValue})`;
  }



  paddleCollision( player1, player2 ) {
    
    
    if( this.vx > 0) { //If travelling toward right
      
      let paddle = player2.coordinates( player2.x, player2.y, player2.width, player2.height );
      let [leftX, rightX, topY, bottomY] = paddle;

      if( 
        (this.x + this.radius >= leftX) //Ball right edge is touching or left of Paddle left edge
      && (this.x + this.radius <= rightX) //Ball right edge is touching or left of Paddle right edge
      && (this.y >= topY && this.y <= bottomY) //Ball within Paddle height
      ) 
      {
        this.numberOfPaddleHits++;
        if( this.numberOfPaddleHits % 5 === 0 ){
          this.vx = -this.vx * 1.07;
        }
        else {
          this.vx = -this.vx;
        }
        
        

        //Return angle determined by where ball hits the paddle.
        //If ball hits middle 1/3 then normal rebound (mirror angle)
        //If ball hits outer 1/3 then rebound is based on how far from center of paddle the ball hit up to a max of 30degrees

          if ( this.y <= topY + player2.height/3 || this.y >= bottomY - player2.height/3 ) {

            let reboundAngle = 30 * ( ( this.y - (topY + player2.height/2) ) / (player2.height/2) )
            this.vy = Math.abs(this.vx) * Math.tan( reboundAngle * Math.PI/180 );
          }
          this.ping.play();
      }

    }
    else {
      let paddle = player1.coordinates( player1.x, player1.y, player1.width, player1.height );
      let [leftX, rightX, topY, bottomY] = paddle;

      if( 
        (this.x - this.radius <= rightX) //Ball left edge is touching or left of Paddle left edge
      && (this.x - this.radius >= leftX) //Ball leftt edge is touching or left of Paddle right edge
      && (this.y >= topY && this.y <= bottomY) //Ball within Paddle height
      ) 
      {
        this.numberOfPaddleHits++;
        if( this.numberOfPaddleHits % 5 === 0 ){
          this.vx = -this.vx * 1.07;
        }
        else {
          this.vx = -this.vx;
        }

        //Return angle determined by where it hits the paddle.
        //If ball hits middle 1/3 then normal rebound (mirror angle)
        //If ball hits outer 1/3 then rebound is calculated based on how far from center of paddle the ball hit up to a max of 30degrees
        if ( this.y <= topY + player1.height/3 || this.y >= bottomY - player1.height/3 ) {
          let reboundAngle = 30 * ( ( this.y - (topY + player1.height/2) ) / (player1.height/2) )
          this.vy = Math.abs(this.vx) * Math.tan( reboundAngle * Math.PI/180 );
        }
          this.ping3.play();
      }

    }

  }

  render(svg, player1, player2) {

    if ( this.served === false ) {
      if ( this.direction === 1 ) { 
        this.x = player1.x + player1.width + this.radius + 1;
        this.y = player1.y + player1.height / 2;
      }
      else {
        this.x = player2.x - this.radius + 1;
        this.y = player2.y + player2.height / 2;    
      }
    }
    else {
      this.x += this.vx;
      this.y += this.vy;
    }

    this.wallCollision();
    this.paddleCollision( player1, player2 );

    let ball = document.createElementNS(SVG_NS, 'circle');
    ball.setAttribute('id', 'ball');
    ball.setAttributeNS( null, 'cx', this.x );
    ball.setAttributeNS( null, 'cy', this.y );
    ball.setAttributeNS( null, 'r', this.radius );
    ball.setAttributeNS( null, 'fill', this.ballColor() );
    svg.appendChild(ball);    


    const rightGoal = this.x + this.radius >= this.boardWidth;
    const leftGoal = this.x - this.radius <= 0;

    if ( rightGoal ) {
      this.goal( player1 );
      this.scoringPlayer = 'p1';
      this.direction = -1;
      this.reset();
    } else if ( leftGoal ) {
      this.goal( player2 );
      this.scoringPlayer = 'p2';
      this.direction = 1;
      this.reset();
    }
    
  }
}


