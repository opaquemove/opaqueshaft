window.onload = init;
window.onresize = fitting;

var w_whiteboard    = null;
var w_child			= null;

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

	var child = document.getElementById('ID_CHILD');
	child.addEventListener( evtStart,
		function ( e ){
			switch( child.style.marginTop ){
				case '':
				case '0px':
					child.style.marginTop = '-40px';
					break;
				default:
					child.style.marginTop = '0px';
					break;
			}
		}, { passive : false } );
	child.addEventListener( evtEnd,
		function ( e ){
			child.style.marginTop = '0px';
			if ( w_child == null || w_child.closed )
				w_child = window.open( '/children.html', 'CHILDREN' );
				else
				w_child.focus();
		}, { passive : false } );
			
}

function fitting(){
	var w = document.body.clientWidth;
	var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;

    var navi = document.getElementById('NAVI');
    navi.style.top  = ( h - navi.offsetHeight ) + 'px';
    navi.style.left = '0px';
    
}

//
//	?????????????????????????????????
//
function newChildForm(){
	var r = '';
	r += makeChildForm( null );
	openModalDialog( null, r, 'NOBUTTON', null, null );
}

//
//	????????????????????????????????????
//
function makeChildForm( oChild ){
	var id    = null;
	var name  = '';
	var type  = '';
	var grade = '';
	if ( oChild != null ) {
		id = oChild.child_id;
		name = oChild.child_name;
		type = oChild.child_type;
		grade = oChild.child_grade;
	}
	var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >Child</div>';
	r += '<div style="margin:0 auto;width:110px;">';
		r += '<form name="child_form" onsubmit="return false;" >';
		if ( id != null ){
			r += '<input type="hidden" name="child_id" value="' + id + '"  />';
		}
//		r += '<div>id:</div>';
//		r += '<div><input type="text" name="child_id"    value="' + id    + '" readonly /></div>';
		r += '<div>name:</div>';
		r += '<div><input type="text" name="child_name"  value="' + name  + '" /></div>';
		r += '<div>type:</div>';
		r += '<div><input type="text" name="child_type"  value="' + type  + '" /></div>';
		r += '<div>grade:</div>';
		r += '<div><input type="text" name="child_grade" value="' + grade + '" /></div>';
		r += '</form>';
		r += '<div style="padding-top:10px;" >';
			r += "<button type='button' onclick='newChildSend()' >next...</button>";
		r += '</div>';	
	r += '</div>';
	return r;

}

//
//	??????????????????????????????
//
function newChildSend(){
	var result = newChildSendHelper();
	oLog.log( null, 'newChildSend : ' + result );
	// alert( result );
}

//
//	???????????????????????????REST)
//
function newChildSendHelper(){
	var name  = child_form.child_name.value;
	var grade = child_form.child_grade.value;
	var type  = child_form.child_type.value;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/childadd", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'child_name=' + name + '&child_grade=' + grade + '&child_type=' + type );
	if ( xmlhttp.status == 200 ){
		var result = JSON.parse( xmlhttp.responseText );
		return ( result != null )? result:null;	
	} else return null;

}

