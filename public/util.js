function Button( id, func ) {
  this.id = id;
  this.o  = null; 
  this.func = func;
}
Button.prototype = {
  play: function() {
    this.o = document.getElementById( this.id );
    this.o.addEventListener( 'mouseover', ( function( e ) {
      var e2 = document.getElementById( this.id );
      if ( e2 != null ) e2.style.backgroundColor = '#BBBBBB';
      //e2.style.cursor          = 'pointer';
      e.stopPropagation();
    }).bind( this ), false );
    this.o.addEventListener( 'mouseleave', ( function( e ) {
      var e2 = document.getElementById( this.id );
      if ( e2 != null ) e2.style.backgroundColor = '';
      e.stopPropagation();
    }).bind( this ), false );
    if ( this.func != null )
      this.o.addEventListener( 'mouseup', this.func, false ); 
  }
};

