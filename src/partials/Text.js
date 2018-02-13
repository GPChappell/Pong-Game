import { SVG_NS } from '../settings';
import Ball from './Ball';

export default class Text {

  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

      // Function from David Walsh: http://davidwalsh.name/css-animation-callback
      whichAnimationEvent(){
        var t,
            el = document.createElement('fakeelement');
  
        var transitions = {
            'animation'      : 'animationend',
            'OAnimation'     : 'oAnimationEnd',
            'MozAnimation'   : 'animationend',
            'WebkitAnimation': 'webkitAnimationEnd'
        }
  
        for (t in transitions){
            if (el.style[t] !== undefined){
                return transitions[t];
            }
        }
    }

  render( svg, textContent, ball ) {
    //Create GOAL! text
    let goal = document.createElementNS(SVG_NS, 'text');
    goal.setAttribute('id', 'goal')
    goal.setAttributeNS(null, 'x', this.x );
    goal.setAttributeNS(null, 'y', this.y );
    goal.setAttributeNS(null, 'font-family', '"Silkscreen Web", monotype' );
    goal.setAttributeNS(null, 'font-size', this.size );
    if( ball.scoringPlayer === 'p1') {
      goal.setAttributeNS(null, 'fill', 'black');
      goal.setAttributeNS(null, 'stroke', 'white');
    } else {
      goal.setAttributeNS(null, 'fill', 'white');
      goal.setAttributeNS(null, 'stroke', 'black');
    }
    goal.setAttributeNS(null, 'text-anchor', 'middle');
    goal.textContent = textContent;

    var animationEvent = this.whichAnimationEvent();
    goal.addEventListener(animationEvent, function(){
      ball.goalScored = false;
    });

    let gameOver = document.createElementNS(SVG_NS, 'text');
    gameOver.setAttribute('id', 'gameOver')
    gameOver.setAttributeNS(null, 'x', this.x );
    gameOver.setAttributeNS(null, 'y', this.y );
    gameOver.setAttributeNS(null, 'font-family', '"Silkscreen Web", monotype' );
    gameOver.setAttributeNS(null, 'font-size', this.size );
    gameOver.setAttributeNS(null, 'text-anchor', 'middle');
    gameOver.textContent = textContent;


    svg.appendChild( goal );
  }
}