import { SVG_NS, KEYS } from '../settings';
import Paddle from './Paddle';

export default class Ball {

  constructor(radius, boardWidth, boardHeight/*, x, y*/) {
    this.radius = radius;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    // this.x = x; //Will use this later to spawn ball in specific location.
    // this.y = y;
    this.direction = 1;
    this.reset();

    this.ping = new Audio('public/sounds/pong-01.wav');


  } //END OF CONSTRUCTOR

   reset() {
    //Start position
    this.x = this.boardWidth / 2;
    this.y = this.boardHeight / 2;
    
    //Start vector
    this.vy = 0;

    //Prevent ball being trapped in middle of board if vy is set to 0.
    while( this.vy === 0 ) {
      this.vy = Math.floor(Math.random() * 10 - 5);
    }
    this.vx = this.direction * (6 - Math.abs(this.vy));
  }

  goal( player ) {
    player.score++;
    console.log(player.score)
  }

  wallCollision() {
    const hitLeft = ( this.x - this.radius ) <= 0;
    const hitRight = ( this.x + this.radius ) >= this.boardWidth;
    const hitTop = ( this.y - this.radius ) <= 0;
    const hitBottom = ( this.y + this.radius ) >= this.boardHeight;

      if( hitTop || hitBottom ) {
        this.vy = -this.vy;
      }
      else if ( hitLeft || hitRight ){
        // GOAL RESPONSE
        this.vx = -this.vx;
      }
  }

  paddleCollision( player1, player2 ) {
    if( this.vx > 0) {
      let paddle = player2.coordinates( player2.x, player2.y, player2.width, player2.height );
      let [leftX, rightX, topY, bottomY] = paddle;

      if( 
        (this.x + this.radius >= leftX) //Ball right edge is touching or left of Paddle left edge
      && (this.x + this.radius <= rightX) //Ball right edge is touching or left of Paddle right edge
      && (this.y >= topY && this.y <= bottomY) //Ball within Paddle height
      ) 
      {
        this.vx = -this.vx;
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
        this.vx = -this.vx;
        this.ping.play();
      }

    }

  }

  render(svg, player1, player2) {

    this.x += this.vx;
    this.y += this.vy;

    this.wallCollision();
    this.paddleCollision( player1, player2 );

    let ball = document.createElementNS(SVG_NS, 'circle');
    ball.setAttributeNS( null, 'cx', this.x );
    ball.setAttributeNS( null, 'cy', this.y );
    ball.setAttributeNS( null, 'r', this.radius );
    ball.setAttributeNS( null, 'fill', 'white' );
    svg.appendChild(ball);    

    const rightGoal = this.x + this.radius >= this.boardWidth;
    const leftGoal = this.x - this.radius <= 0;

    if ( rightGoal ) {
      this.goal( player1 );
      this.direction = -1;
      this.reset();
    } else if ( leftGoal ) {
      this.goal( player2 );
      this.direction = 1;
      this.reset();
    }
    
  }
}