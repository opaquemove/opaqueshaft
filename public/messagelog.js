function ctlMessageLog(){
    console.log( oLog.opened() );
    if ( oLog.opened() )    oLog.close();
        else                oLog.open( 10 );
}

function messageLog(){
    this.overlay    = null;
    this.frame      = null;
    this.latest     = null;
    this.history    = null;
    this.hTimeout   = null;

    var r = '';
    r += '<div id="MODAL_OVERLAY_MESSAGELOG" class="not_select">';
        r += '<div id="MESSAGELOG_FRAME"       class="not_select" >';
            r += '<div id="MESSAGELOG_LATEST"  class="not_select">latest message</div>';
            r += '<div id="MESSAGELOG_HISTORY" class="not_select"></div>';
        r += '</div>';
    r += '</div>';

    var o = document.createElement('DIV');
    o.innerHTML = r;
    document.body.appendChild( o );

    this.overlay    = document.getElementById('MODAL_OVERLAY_MESSAGELOG');
    this.frame      = document.getElementById('MESSAGELOG_FRAME');
    this.latest     = document.getElementById('MESSAGELOG_LATEST');
    this.history    = document.getElementById('MESSAGELOG_HISTORY');
    this.close();

}

messageLog.prototype = {
    showHistory : function( ttl ){
        this.overlay.style.visibility   = 'visible';
        this.frame.style.visibility     = 'visible';
        this.latest.style.visibility    = 'visible';
        this.history.style.visibility   = 'visible';

        if ( ttl != 0 || ttl != null){
            if ( this.hTimeout != null) clearTimeout( this.hTimeout );
            this.hTimeout = setTimeout( 'oLog.close()', ttl * 1000 );
        }
    },
    open : function( ttl ){
        this.overlay.style.visibility   = 'visible';
        this.frame.style.visibility     = 'visible';
        this.latest.style.visibility    = 'visible';
        this.history.style.visibility   = 'hidden';

		this.latest.style.animationName			= 'scale-in-out';
    	this.latest.style.animationDuration		= '0.3s';
    	this.latest.style.animationIterationCount = 1;

        if ( ttl != 0 || ttl != null){
            if ( this.hTimeout != null) clearTimeout( this.hTimeout );
            this.hTimeout = setTimeout( 'oLog.close()', ttl * 1000 );
        }
    },
    close : function(){
        this.overlay.style.visibility   = 'hidden';
        this.frame.style.visibility     = 'hidden';
        this.latest.style.visibility    = 'hidden';
		this.latest.style.animationName			= '';
    	this.latest.style.animationDuration		= '';
    	this.latest.style.animationIterationCount = '';

        this.latest.innerHTML = '';
        if ( this.hTimeout != null) clearTimeout( this.hTimeout );
        this.hTimeout = null;
    },
    opened : function(){
        return ( this.overlay.style.visibility != 'hidden' );
    },
    clear : function(){
        this.history.innerText = '';
    },
    log : function( log_level, message ){
        var today = new Date();
        var o = document.createElement('DIV');
        hm = ( '00' + today.getHours() ).slice( -2 ) + ':' + ( '00' + today.getMinutes() ).slice(-2);
        hm += ':' + ( '00' + today.getSeconds()).slice(-2);
        o.innerHTML = hm + '&nbsp;:&nbsp;' + message;

        var o2 = document.createElement('DIV');
        o2.innerHTML = hm + '&nbsp;:&nbsp;' + message;

        this.latest.innerHTML = '';
        this.latest.appendChild( o );
        this.history.insertBefore( o2, this.history.firstChild );
    }
};
