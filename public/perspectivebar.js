
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
                        psb.innerText = Math.floor( new_top - psbOffsetTop ) + ',' + Math.floor( new_left - psbOffsetLeft );
                    } else {
                        if ( new_left < psbOffsetLeft ) new_left = psbOffsetLeft;
                        else                        new_left = psbOffsetLeft + 180;
                    }
                    // console.log('left:' +  ( new_left - psbOffsetLeft ) );
                    // var rotate  = ' rotateX(' + ( new_left - psbOffsetLeft ) + 'deg)';
                    // var rotate2 = ' rotateX(' + ( new_left - psbOffsetLeft ) + 'deg)';
                    var rotate = ' rotateX(-10deg)';

                    var wbf = document.getElementById('WHITEBOARD_FRAME');
                    var wb  = document.getElementById('WHITEBOARD');
                    var wbt = document.getElementById('WHITEBOARD_TIMELINE');
                    var wbe = document.getElementById('WHITEBOARD_CHECKOUT');
                    var wba = document.getElementById('WHITEBOARD_ABSENT');
                    var bo = document.getElementById('BOTTOM_OVERLAY');
                    var bf = document.getElementById('BOTTOM_FRAME');
                    var wb_width = wb.offsetWidth;

                    if ( new_top == psbOffsetTop && new_left == psbOffsetLeft ){
                        bo.style.perspective 	        = '';
						bf.style.transform 		        = '';
                        wbf.style.perspective 	        = '';
						wb.style.transform 		        = '';
						wbe.style.transform 		        = '';
						wba.style.transform 	        = '';
                        wba.style.border                = '';
                        wbe.style.border                = '';
                        wb.style.border                 = '';
                    } else{
                        // bo.style.perspective 	= 1770 + ( new_top - psbOffsetTop )*1.5 + 'px';
                        // wbf.style.perspective 	= 1770 + ( new_top - psbOffsetTop )*1.5 + 'px';
                        // bo.style.perspective 	        = '570px';
                        // wbf.style.perspective 	        = '570px';
                        wb.style.transformStyle         = 'preserve-3d';
                        wbe.style.transformStyle        = 'preserve-3d';
                        wba.style.transformStyle        = 'preserve-3d';
                        wbt.style.transformStyle        = 'preserve-3d';
						bf.style.transform 		        = 'perspective(570px) translate3d( 0px, 0px, -1110px)' + rotate;
						wbe.style.transform 	        = 'perspective(570px) translate3d( ' + ( - wb_width ) + 'px, 0px, -1100px)' + rotate;
						wba.style.transform 	        = 'perspective(570px) translate3d( ' + wb_width + 'px, 0px, -1100px)' + rotate;
						wb.style.transform 		        = 'perspective(570px) translate3d( 0px, 0px, -1100px)' + rotate;
						wbt.style.transform 		    = 'perspective(570px) translate3d( 0px, 0px, -1100px)' + rotate;
                        wba.style.border                = '1px dashed white';
                        wbe.style.border                = '1px dashed white';
                        wb.style.border                 = '1px solid white';
                        var timelines = document.getElementsByClassName('timeline2_class');
                        for ( var i=0; i<timelines.length; i++ ){
                            var tlb = timelines[i];
                            // tlb.style.transformStyle    = 'preserve-3d';
                            tlb.style.transform         = 'perspective(570px) translate3d(0px,0px,-1100px)' + rotate;
                        }                    
                    }
/*                
                    if ( new_top == psbOffsetTop && new_left == psbOffsetLeft ){
                        wbf.style.perspective           = '270px';
                        wba.style.border                = '';
                        wb.style.border                 = '';
                    } else{
                        wbf.style.perspective           = 70 - ( new_top - psbOffsetTop )  + 'px';
                        wba.style.border                = '1px solid red';
                        wb.style.border                 = '1px solid white';
                        wb.style.transform              = 'translate3d(0px, 0px,-300px)' + rotate;
                        wbt.style.transform             = 'translate3d(0px, 0px,-300px)' + rotate;
                        wba.style.transform             = 'translate3d(0px, 0px,-350px)' + rotate;
                        var timelines = document.getElementsByClassName('timeline2_class');
                        for ( var i=0; i<timelines.length; i++ ){
                            var tlb = timelines[i];
                            tlb.style.transform = 'translate3d(0px,0px,-300px)' + rotate;
                        }                    
                    } 
*/
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

//stock
                        // wb.style.transform              = 'translate3d(0px, 0px,-' + ( new_top - psbOffsetTop ) *2       + 'px)' + rotate;
                        // wbt.style.transform             = 'translate3d(0px, 0px,-' + ( new_top - psbOffsetTop ) *2       + 'px)' + rotate;
                        // wba.style.transform             = 'translate3d(0,0,-' + ( new_top - psbOffsetTop + 60 ) * 2 + 'px)' + rotate;
                        // var timelines = document.getElementsByClassName('timeline2_class');
                        // for ( var i=0; i<timelines.length; i++ ){
                        //     var tlb = timelines[i];
                        //     tlb.style.transform = 'translate3d(0px,0px,-' + ( new_top - psbOffsetTop ) * 2 + 'px)' + rotate;
                        // }                    
