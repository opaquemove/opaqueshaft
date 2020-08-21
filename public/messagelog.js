function ctlMessageLog(){
    if ( oLog.opened() )    oLog.close();
        else                oLog.open( 10 );
}

function messageLog(){
    this.overlay    = null;
    this.frame      = null;
    this.content    = null;
    this.hTimeout   = null;

    this.overlay    = document.getElementById('MODAL_OVERLAY_MESSAGELOG');
    this.frame      = document.getElementById('MESSAGELOG_FRAME');
    this.content    = document.getElementById('MESSAGELOG_CONTENT');
    this.close();

}

messageLog.prototype = {
    open : function( ttl ){
        this.overlay.style.visibility   = 'visible';
        this.frame.style.visibility     = 'visible';
        if ( ttl != 0 || ttl != null){
            if ( this.hTimeout != null) clearTimeout( this.hTimeout );
            this.hTimeout = setTimeout( 'oLog.close()', ttl * 1000 );
        }
    },
    close : function(){
        this.overlay.style.visibility   = 'hidden';
        this.frame.style.visibility     = 'hidden';
        if ( this.hTimeout != null) clearTimeout( this.hTimeout );
        this.hTimeout = null;
    },
    opened : function(){
        return ( this.overlay.style.visibility != 'hidden' );
    },
    clear : function(){
        this.content.innerText = '';
    },
    log : function( log_level, message ){
        var today = new Date();
        hm = ( '00' + today.getHours() ).slice( -2 ) + ':' + ( '00' + today.getMinutes() ).slice(-2);
        this.content.innerHTML += '<div>' + hm + ':' + message + '</div>';
    }
};
