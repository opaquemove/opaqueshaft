window.onload = init;
window.onresize = fitting;

var w_whiteboard    = null;

function init(){
	var touchdevice = ( 'ontouchend' in document );
	switch ( touchdevice ){
		case true:		// touch device( iPad/iPhone/Android/Tablet )
			var evtStart	= 'touchstart';
			var evtMove	    = 'touchmove';
			var evtEnd		= 'touchend';
			break;
		case false:	// pc
			var evtStart	= 'mousedown';
			var evtMove	    = 'mousemove';
			var evtEnd		= 'mouseup';
			break;
	}

    document.oncontextmenu = function(e) { return false; }

    var w = document.body.clientWidth;
	var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;

    fitting();

    var wb = document.getElementById('ID_WHITEBOARD');
    wb.addEventListener( evtStart,
        function ( e ){
            switch( wb.style.marginTop ){
                case '':
                case '0px':
                    wb.style.marginTop = '-40px';
                    break;
                default:
                    wb.style.marginTop = '0px';
                    break;
            }
        }, { passive : false } );
        wb.addEventListener( evtEnd,
            function ( e ){
                wb.style.marginTop = '0px';
                if ( w_whiteboard == null || w_whiteboard.closed )
                    w_whiteboard = window.open( '/index.html', 'WHITEBOARD' );
                    else
                    w_whiteboard.focus();
            }, { passive : false } );
    
}

function fitting(){
	var w = document.body.clientWidth;
	var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;

    var navi = document.getElementById('NAVI');
    navi.style.top  = ( h - navi.offsetHeight ) + 'px';
    navi.style.left = '0px';
    
}
