
var psbx          = null;
var psby          = null;
var psb_drag      = false;
var psbOffsetTop  = null;
var psbOffsetLeft = null;

//
//  パースペクティブバー初期化
//
function initPerspectivebar( evtStart, evtMove, evtEnd ){
    var psb = document.getElementById('ID_PERSPECTIVE_BAR');
	psbOffsetTop	= psb.offsetTop;
    psbOffsetLeft	= psb.offsetLeft;

	psb.addEventListener( evtStart,    		locatePerspectivebar, { passive : false } );
	psb.addEventListener( evtMove,     		locatePerspectivebar, { passive : false } );
	psb.addEventListener( evtEnd,      		locatePerspectivebar, { passive : false } );
	psb.addEventListener( 'mouseleave', 	locatePerspectivebar, { passive : false } );

}
//
//	パースペクティブバー操作
//
function locatePerspectivebar( e ){
	e.preventDefault();

	var wbf = document.getElementById('WHITEBOARD_FRAME');
    var wb  = document.getElementById('WHITEBOARD');
    var wbt = document.getElementById('WHITEBOARD_TIMELINE');
    var wba = document.getElementById('WHITEBOARD_ABSENT');
	var psb = document.getElementById('ID_PERSPECTIVE_BAR');
	switch ( e.type ){
		case 'touchstart':
		case 'mousedown':
			if( e.type == "mousedown" ) {
				var event = e;
			} else {
				var event = e.changedTouches[0];
			}
			if ( psb != e.target ) return;
			psby = event.pageY - event.target.offsetTop;
			psbx = event.pageX - event.target.offsetLeft;
			psb_drag = true;
			break;
		case 'touchmove':
		case 'mousemove':
			if( e.type == "mousemove" ) {
				var event = e;
			} else {
				var event = e.changedTouches[0];
			}
			// if ( psby == null ) 		return;
			if ( event.target != psb ) 	return;
            if ( !psb_drag ) 		    return;
			var new_top  = event.pageY - psby;
            var new_left = event.pageX - psbx;
			if ( new_top >= psbOffsetTop + 0 
              && new_top <= psbOffsetTop + 270 ){
                psb.style.top 	= new_top + 'px';
                var rotate = null;
                if ( new_left >= psbOffsetLeft + 0
                    && new_left <= psbOffsetLeft + 180 ){
                        psb.style.left 	= new_left + 'px';
                        psb.innerText = ( new_top - psbOffsetTop ) + ',' + ( new_left - psbOffsetLeft );
                    } else {
                        if ( new_left < psbOffsetLeft ) new_left = psbOffsetLeft;
                        else                        new_left = psbOffsetLeft + 180;
                    }
                    // console.log('left:' +  ( new_left - psbOffsetLeft ) );
                    var rotate = ' rotateY(' + ( new_left - psbOffsetLeft ) + 'deg)';
                    
                    if ( new_top == psbOffsetTop && new_left == psbOffsetLeft ){
                        wba.style.border        = '';
                        // wba.style.backgroundColor   = '';
                        wbt.style.backgroundColor   = '';
                        wbt.style.opacity           = 1;
                        wbf.style.perspective   = '';
                        wb.style.border         = '';
                    } else{
                        wba.style.border        = '1px solid red';
                        // wba.style.backgroundColor   = 'red';
                        wbt.style.backgroundColor   = 'red';
                        wbt.style.opacity           = 0.5;
                        wbf.style.perspective   = '270px';
                        wb.style.border         = '1px solid white';
                        wb.style.transform      = 'translateZ(-' + ( new_top - psbOffsetTop ) *2       + 'px)' + rotate;
                        wbt.style.transform     = 'translateZ(-' + ( new_top - psbOffsetTop ) *2       + 'px)' + rotate;
                        wba.style.transform     = 'translateZ(-' + ( new_top - psbOffsetTop + 60 ) * 2 + 'px)' + rotate;
                        var timelines = document.getElementsByClassName('timeline2_class');
                        for ( var i=0; i<timelines.length; i++ ){
                            var tlb = timelines[i];
                            tlb.style.transform = 'translateZ(-' + ( new_top - psbOffsetTop ) * 2 + 'px)' + rotate;
                        }                    
                    } 
                } else{
                    if ( new_top < psbOffsetTop ) new_top = psbOffsetTop;
                        else                        new_top = psbOffsetTop + 270;
                }
                // console.log( wb.style.transform );
            break;
		case 'mouseleave':
		case 'mouseup':
		case 'touchend':
			psb_drag = false;
            psby = null;
            psbx = null;
			break;
	}
}
