function Button( id, func ) {
  this.id = id;
  this.o  = null; 
  this.func = func;
  this.originalBackgroundColor = null;
}
Button.prototype = {
  play: function() {
    this.o = document.getElementById( this.id );
    this.originalBackgroundColor = this.o.style.backgroundColor;
    this.o.addEventListener( 'mouseover', ( function( e ) {
      var e2 = document.getElementById( this.id );
      if ( e2 != null ) e2.style.backgroundColor = '#BBBBBB';
      //e2.style.cursor          = 'pointer';
      e.stopPropagation();
    }).bind( this ), false );
    this.o.addEventListener( 'mouseleave', ( function( e ) {
      var e2 = document.getElementById( this.id );
      if ( e2 != null ) e2.style.backgroundColor = this.originalBackgroundColor;
      e.stopPropagation();
    }).bind( this ), false );
    if ( this.func != null )
      this.o.addEventListener( 'mouseup', ( function( e ) {
        var e2 = document.getElementById( this.id );
        if ( e2 != null ) e2.style.backgroundColor = this.originalBackgroundColor;
          e.stopPropagation();
        this.func(e);
      }).bind( this ), false ); 
  }
};


function Checkbox( id, flag, func ){
  this.id = id;
  this.o  = null;
  this.flag = flag;
  this.func = func;
  this.color = 'red';
}
Checkbox.prototype = {
  play: function(){
    this.o = document.getElementById( this.id );
    switch ( this.flag ){
      case 'ON':
        this.o.style.borderLeftColor    = this.color;
        this.o.style.borderLeftStyle    = 'solid';
        this.o.style.borderLeftWidth    = '4px';
        this.o.setAttribute('flag','ON');
        break;
      case 'OFF':
      default:
        this.o.style.borderLeftColor    = '';
        this.o.style.borderLeftStyle    = 'solid';
        this.o.style.borderLeftWidth    = '4px';
        this.o.setAttribute('flag','OFF');
        break;
    }
    this.o.addEventListener( 'mouseover', ( function( e ) {
      var e2 = document.getElementById( this.id );
      if ( e2 != null ) e2.style.backgroundColor = '#BBBBBB';
      //e2.style.cursor          = 'pointer';
      e.stopPropagation();
    }).bind( this ), false );
    this.o.addEventListener( 'mouseleave', ( function( e ) {
      switch ( this.o.getAttribute('flag') ){
        case 'ON':
          this.o.style.backgroundColor  = '';
          this.o.style.borderLeftColor    = this.color;
          this.o.style.borderLeftStyle    = 'solid';
          this.o.style.borderLeftWidth    = '4px';
          break;
        case 'OFF':
        default:
            this.o.style.backgroundColor  = '';
            this.o.style.borderLeftColor    = '';
            this.o.style.borderLeftStyle    = 'solid';
            this.o.style.borderLeftWidth    = '4px';
            break;
      }
      e.stopPropagation();
    }).bind( this ), false );
    this.o.addEventListener( 'click', ( function( e ) {
      switch ( this.o.getAttribute('flag') ){
        case 'ON':
          // this.o.style.backgroundColor  = '';
            this.o.style.borderLeftColor    = '';
            this.o.style.borderLeftStyle    = 'solid';
            this.o.style.borderLeftWidth    = '4px';
            this.o.setAttribute('flag','OFF');
          break;
        case 'OFF':
        default:
          this.o.style.borderLeftColor    = this.color;
          this.o.style.borderLeftStyle    = 'solid';
          this.o.style.borderLeftWidth    = '4px';
          this.o.setAttribute('flag','ON');
          break;
      }
      e.stopPropagation();
    }).bind( this ), false );

    if ( this.func != null )
      this.o.addEventListener( 'mouseup', this.func, false ); 

  }
};

