function ctlReportDlg(){
    if ( oReportDlg.opened() )    oReportDlg.close();
        else                 oReportDlg.open();
}


function report_dlg(){
    this.frame  = null;

    this.frame      = document.getElementById('REPORT_FRAME');
    this.close();

	var w = document.body.clientWidth;
	var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;
    this.frame.style.height = h + 'px';
}

report_dlg.prototype = {
    open : function( ){
        this.frame.style.visibility     = 'visible';
        this.frame.style.top = '84px';
        console.log('open');
    },
    close : function(){
        this.frame.style.visibility     = 'hidden';
        console.log('close');
    },
    opened : function(){
        return ( this.frame.style.visibility != 'hidden' );
    }



};
