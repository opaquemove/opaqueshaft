function winker( frame, count_max ){
    this.frame      = frame;
    this.tid        = null;
    this.count      = null;
    this.count_max  = count_max;
}

winker.prototype = {
    play : function(){
        this.count  = 0;
        this.tid = setInterval( ( this.playHelper ).bind( this ), 500 );
    },
    playHelper : function(){
        this.count++;
        if ( ( this.count % 2) == 0 )   this.frame.classList.add( 'wink_on' );
                                else    this.frame.classList.remove( 'wink_on' );
        if ( this.count > this.count_max ){
            clearInterval( this.tid );
            this.frame.classList.remove( 'wink_on' );

        }

    }
};
