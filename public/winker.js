function winker( frame, count_max, winker_name ){
    this.frame          = frame;
    this.tid            = null;
    this.count          = null;
    this.count_max      = count_max;
    this.winker_name    = winker_name;
}

winker.prototype = {
    play : function(){
        this.count  = 0;
        this.tid = setInterval( ( this.playHelper ).bind( this ), 500 );
    },
    playHelper : function( ){
        this.count++;
        if ( ( this.count % 2) == 0 )   this.frame.classList.add( this.winker_name );
                                else    this.frame.classList.remove( this.winker_name );
        if ( this.count > this.count_max ){
            clearInterval( this.tid );
            this.frame.classList.remove( this.winker_name );

        }

    }
};
