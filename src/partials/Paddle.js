import { SVG_NS } from '../settings';
import Ball from './Ball';

export default class Paddle {
  constructor(boardHeight, width, height, x, y, up, down, player, color ) {
    this.boardHeight = boardHeight;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speed = 6;
    this.score = 0;
    this.color = color;

    this.player = player;
    this.keyState = {};
    document.addEventListener('keydown', event => {
      this.keyState[event.key || event.which] = true;
    }, true);
    document.addEventListener('keyup', event => {
      this.keyState[event.key || event.which] = false;
    }, true);
  }
  //...


  up() { 
    this.y = Math.max( ( this.y - this.speed ), 0 ); 
  }

  down() { 
    this.y = Math.min( ( this.y + this.speed ), ( this.boardHeight - this.height ) );
  }

  coordinates(x, y, width, height) {
    let leftX = x;
    let rightX = x + width;
    let topY = y;
    let bottomY = y + height;
    return [leftX, rightX, topY, bottomY];
  }

  render(svg, ball) {

    let rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttributeNS( null, 'width', this.width );
    rect.setAttributeNS( null, 'height', Math.max(this.height/2, this.height - ball.numberOfPaddleHits ) );
    rect.setAttributeNS( null, 'fill', this.color );
    rect.setAttributeNS( null, 'x', this.x );
    rect.setAttributeNS( null, 'y', this.y );

    // Player movement
    if (this.keyState['a'] && this.player === 'player1') {
      this.up();
    }
    if (this.keyState['z'] && this.player === 'player1') {
      this.down();
    }
    if (this.keyState['ArrowUp'] && this.player === 'player2') {
      this.up();
    }
    if (this.keyState['ArrowDown'] && this.player === 'player2') {
      this.down();
    }

    svg.appendChild(rect);    
  }
}