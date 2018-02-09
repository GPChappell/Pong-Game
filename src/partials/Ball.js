import { SVG_NS } from '../settings';

export default class Ball {

  constructor(radius, boardWidth, boardHeight/*, x, y*/) {
    this.radius = radius;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    // this.x = x; //Will use this later to spawn ball in specific location.
    // this.y = y;
    this.direction = 1;
    this.reset();
  }

  render(svg, player1, player2) {
    let ball = document.createElementNS(SVG_NS, 'circle');
    ball.setAttributeNS( null, 'cx', this.x );
    ball.setAttributeNS( null, 'cy', this.y );
    ball.setAttributeNS( null, 'r', this.radius );
    ball.setAttributeNS( null, 'fill', 'white' );

    svg.appendChild(ball);    
  }

  reset() {
    this.x = this.boardWidth / 2;
    this.y = this.boardHeight / 2;
  }
}