import { SVG_NS } from '../settings';

export default class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  render(svg) {

    // Perimeter
    let rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttributeNS(null, 'width', this.width);
    rect.setAttributeNS(null, 'height', this.height);
    rect.setAttributeNS(null, 'fill', '#353535' );
    rect.setAttributeNS(null, 'stroke', 'black' );
    rect.setAttributeNS(null, 'stroke-width', '5' );
    
    // Middle Line 
    let line = document.createElementNS(SVG_NS, 'line');
    line.setAttributeNS(null, 'x1', ( this.width / 2 ) );
    line.setAttributeNS(null, 'y1', 0 );
    line.setAttributeNS(null, 'x2', ( this.width / 2 ) );
    line.setAttributeNS(null, 'y2', this.height );
    line.setAttributeNS(null, 'stroke', 'darkgrey' );
    line.setAttributeNS(null, 'stroke-width', '3' );
    line.setAttributeNS(null, 'stroke-dasharray', '5' );
    

    svg.appendChild(rect);
    svg.appendChild(line);



    //...
  }
}