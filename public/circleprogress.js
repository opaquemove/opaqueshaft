function CircleProgress( frame, width, height, ratio, cColor, stroke ){
    this.frame      = frame;
    this.svg        = null;
    this.ratioBox   = null;
    this.width      = width;
    this.height     = height;
    this.ratio      = ratio;
    this.stroke     = stroke;
    this.cColor     = cColor;
    this.circle     = null;
}

CircleProgress.prototype = {
    play : function(){
        var sv = document.createElementNS( 'http://www.w3.org/2000/svg',  'svg' );
        sv.setAttribute( 'width',  this.width );
        sv.setAttribute( 'height', this.height );
        sv.setAttribute( 'viewBox', '0 0 ' + 200 + ' ' + 200 );
        sv.style.position  = 'absolute';
        sv.style.top       = '0px';
        sv.style.left      = '0px';
        this.svg = this.frame.appendChild( sv );

        var ratioBox = document.createElement('DIV');
        // ratioBox.style.color        = 'white';
        // ratioBox.style.fontSize     = '24px';
        ratioBox.innerHTML          = this.ratio + '%';
        this.ratioBox = this.frame.appendChild( ratioBox );

        var r = 90;
        var c = Math.PI * ( r * 2 );
        var c25 = Math.PI * ( 25 * 2 );
        var pct = ((100 - this.ratio ) / 100 ) * c;

        var circ = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle');    
        circ.setAttribute( 'r', 90 );
        circ.setAttribute( 'cy', 100 );
        circ.setAttribute( 'cx', 100 );
        circ.setAttribute( 'fill', 'transparent' );
        circ.setAttribute( 'stroke', this.cColor );
        circ.setAttribute( 'stroke-width', this.stroke );
        if ( this.ratio > 50 ){
            circ.setAttribute( 'stroke-dashoffset', 0 );
            circ.setAttribute( 'stroke-dasharray', c - pct );
            circ.setAttribute( 'transform', 'rotate( ' + ( -90 ) + ',100,100 )');
        }
        
        var circ2 = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle');
        circ2.setAttribute( 'id', 'hoge_circle');
        circ2.setAttribute( 'r', 90 );
        circ2.setAttribute( 'cy', 100 );
        circ2.setAttribute( 'cx', 100 );
        circ2.setAttribute( 'fill', 'transparent' );
        if ( this.ratio > 50 ){
            circ2.setAttribute( 'stroke', 'transparent' );
            circ2.setAttribute( 'stroke-width', this.stroke );
            circ2.setAttribute( 'stroke-dashoffset', 0 );
            circ2.setAttribute( 'stroke-dasharray', pct );
        } else{
            circ2.setAttribute( 'stroke', this.frame.style.backgroundColor );
            circ2.setAttribute( 'stroke-width', this.stroke );
            circ2.setAttribute( 'stroke-dashoffset', 0 );
            circ2.setAttribute( 'stroke-dasharray', pct );
            if ( this.ratio <= 25 ){
                var delta = 0 - ( 25 - this.ratio );
                delta = 360 * (delta / 100 );
               circ2.setAttribute( 'transform', 'rotate( ' + delta + ',100,100 )');
            } else {
                var delta = ( this.ratio - 25 );
                delta = 360 * ( delta / 100 );
                circ2.setAttribute( 'transform', 'rotate( ' + delta + ',100,100 )');
            }
        }

        this.svg.appendChild( circ );
        this.svg.appendChild( circ2 );


    }
};

