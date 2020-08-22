function ctlReportDlg(){
    if ( oReportDlg.opened() )    oReportDlg.close();
        else                 oReportDlg.open();
}


function report_dlg(){
    this.frame  = null;
    this.tid    = null;
    this.top    = 84;

    this.frame      = document.getElementById('REPORT_FRAME');
    this.close();

	var w = document.body.clientWidth;
	var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;
    this.frame.style.height = h + 'px';
}

report_dlg.prototype = {
    open : function( ){
        var w = document.body.clientWidth;
        var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;
        this.frame.style.visibility     = 'visible';
        this.frame.style.top = h + 'px';

        this.tid = setInterval( 
            ( function(){
                var t = parseInt( this.frame.style.top );
                // console.log( 'opening:' + t );
                var delta = Math.floor( (t - this.top ) / 3 );
                this.frame.style.top = ( t - delta ) + 'px';
                if ( delta <= 4 ){
                    this.stop();
                    this.frame.style.top = this.top + 'px';
                }
            }).bind( this ) , 30 );

    },
    stop : function(){
        // console.log('stop');
        clearTimeout( this.tid );
    },
    close : function(){
        var w = document.body.clientWidth;
        var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;
        
        
        this.frame.style.visibility     = 'hidden';
        console.log('close');
    },
    opened : function(){
        return ( this.frame.style.visibility != 'hidden' );
    }



};
