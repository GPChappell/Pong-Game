import { SVG_NS, KEYS } from '../settings';
import Board from './Board';
import Paddle from './Paddle';
import Ball from './Ball';
import Score from './Score';
import Text from './Text';

export default class Game {

	constructor(element, width, height ) {
		this.element = element;
		this.width = width;
		this.height = height;
		this.gameElement = document.getElementById(this.element);
	
		this.board = new Board(this.width, this.height);

		//Paddle Configuration
		this.paddleWidth = 10;
		this.paddleHeight = 112;
		this.boardGap = 10;

		//Create Player 1
		this.player1 = new Paddle(
			this.height,
			this.paddleWidth,
			this.paddleHeight,
			this.boardGap,
			((this.height - this.paddleHeight) / 2),
			KEYS.a,
			KEYS.z,
			'player1',
			'white'
		);

		//Create Player 2
		this.player2 = new Paddle(
			this.height,
			this.paddleWidth,
			this.paddleHeight,
			(this.width - this.paddleWidth - this.boardGap),
			((this.height - this.paddleHeight) / 2),
			KEYS.up,
			KEYS.down,
			'player2',
			'black'
		);

		//Ball Configuration
		this.ballRadius = 8;

		// Create Ball
		this.ball = new Ball(
			this.ballRadius,
			this.width,
			this.height,
			this.player1,
			this.player2
		)

		//Create Score
		this.score1 = new Score( this.width / 2 - 50, 40, 40, 'white' );
		this.score2 = new Score( this.width / 2 + 25, 40, 40, 'black' );

		//Create Goal Text
		this.goal = new Text( this.width / 2, this.height / 2, 100 );

		//Create Goal Text
		this.gameOver = new Text( this.width / 2, this.height / 2, 100 );


		//Pause game
		document.addEventListener('keydown', event => {
      switch (event.key) {
        case KEYS.spaceBar:
          this.pause = !this.pause;
          break;
      }
    });
	}

	render() {

		if( this.pause 
			|| this.ball.goalScored === true 
			|| this.ball.wonGame !== "" ) {
      return;
		}
		 
		this.gameElement.innerHTML = '';

		let svg = document.createElementNS(SVG_NS, 'svg');
		svg.setAttributeNS(null, 'width', this.width);
		svg.setAttributeNS(null, 'height', this.height);
		svg.setAttributeNS(null, 'viewBox', `0 0 ${this.width} ${this.height}`);

		this.board.render(svg);
		this.player1.render(svg, this.ball );
		this.player2.render(svg, this.ball );
		this.ball.render(svg, this.player1, this.player2 );
		this.score1.render( svg, this.player1.score );
		this.score2.render( svg, this.player2.score );
		
		if( this.ball.goalScored && this.ball.wonGame === "" ) {
			this.goal.render( svg, 'GOAL!', this.ball );
		}

		if( this.ball.wonGame === "player1" ){
			this.gameOver.render( svg, 'Player 1 Wins!', this.ball );

		}
		else if ( this.ball.wonGame === "player2" ) {
			this.gameOver.render( svg, 'Player 2 Wins!', this.ball );
		}
		

		this.gameElement.appendChild(svg);

	}

}