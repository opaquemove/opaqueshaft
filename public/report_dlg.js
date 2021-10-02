function ctlReportDlg(){
    if ( oReportDlg.opened() )    oReportDlg.close();
        else                 oReportDlg.open();
}


function report_dlg(){
    this.frame      = null;
    this.handle     = null;
    this.content    = null;
    this.footer     = null;
    this.tid        = null;
    this.top        = 0;       //  TOOLBAR Top margin 84 to 0 
    this.height     = null;
    this.counter    = -1;

    this.frame      = document.getElementById('REPORT_FRAME');
    this.content    = document.getElementById('REPORT_CONTENT');
    this.handle     = document.getElementById('REPORT_CONTENT_HANDLE');
    this.footer     = document.getElementById('REPORT_CONTENT_FOOTER');
    this.handle.addEventListener( 'click',
        ( function(e){
            this.close();
        } ).bind( this ), false );
    this.hidden();
    
    this.init();
}

report_dlg.prototype = {
    init : function(){
        var w = document.body.clientWidth;
        var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;
        this.frame.style.height = ( h - this.top ) + 'px';
        this.height     = h - this.top;
        },
    open : function( ){
        var w = document.body.clientWidth;
        var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;
        this.frame.style.visibility     = 'visible';
        this.frame.style.top = h + 'px';
        console.log( 'open...');
        this.tid = setInterval( 
            ( function(){
                var t = parseInt( this.frame.style.top );
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
    hidden : function(){
        this.frame.style.visibility     = 'hidden';
        console.log('hidden');
    },
    close : function(){
        var w = document.body.clientWidth;
        this.counter = 1;
        this.tid = setInterval( 
            ( function(){
                var t = parseInt( this.frame.style.top );
                this.frame.style.top = ( t + this.counter ) + 'px';
                if ( parseInt( this.frame.style.height ) < ( t + this.counter + 84 ) ){
                    this.stop();
                    var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;
                    this.frame.style.top = h + 'px';
                    this.frame.style.visibility     = 'hidden';
                    console.log('close');
                }
                this.counter = this.counter * 1.8;
            }).bind( this ) , 30 );
        
    },
    opened : function(){
        return ( this.frame.style.visibility != 'hidden' );
    },
    set : function( r ){
        this.content.innerHTML = r;
    },
    setHandle : function( r ){
        this.handle.innerHTML = r;
    },
    setFooter : function( r ){
        this.footer.innerHTML = r;
    }



};
