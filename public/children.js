window.onload = init;
window.onresize = fitting;

var w_whiteboard    = null;
var w_child			= null;

const arChildGrade = ['','4px solid lightcoral', '4px solid lightgreen', '4px solid lightblue','4px solid lightcyan','4px solid lightyellow','4px solid lightseagreen'];
const arChildGradeColor = ['','lightcoral', 'lightgreen', 'lightblue', 'lightcyan', 'lightyellow','lightseagreen'];

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
	
	child_form.keyword.focus();
	document.getElementById('ID_KEYWORD').addEventListener( 'keyup', finder, false );

	document.getElementById('FINDER_AREA').addEventListener( evtStart, locateFinder, false );
	document.getElementById('FINDER_AREA').addEventListener( evtMove, locateFinder, false );
	document.getElementById('FINDER_AREA').addEventListener( evtEnd, locateFinder, false );

	document.getElementById('BTN_PREV_CHILDREN').addEventListener( 'click',
		function(e){
			var p = document.getElementById('FINDER_AREA');
			prevChildren( p );
		}, false );
}

function locateFinder( e ){
	switch ( e.type ){
		case 'touchstart':
		case 'mousedown':
			break;
		case 'mousemove':
		case 'touchmove':
			break;
		case 'touchend':
		case 'mouseup':
			// if ( this == e.target ){
			// 	// reset selection
			// 	prevChildren( this );
			// 	return;
			// }
			var c = scanChild( e.target );
			if ( c != null ){
				if ( c.hasAttribute('selected')){
					// c.classList.remove('selected');
					// c.removeAttribute('selected');
					// c.getElementsByClassName('appendix')[0].style.display = 'none';
					// c.style.height = '';
					// var children = this.childNodes;
					// for ( var i=0; i<children.length; i++ ){
					// 	if ( c!= children[i] )
					// 		children[i].style.display = 'inline'
					// }
				} else{
					c.classList.add( 'selected' );
					c.setAttribute( 'selected', 'yes' );
					c.style.height = '460px';
					c.getElementsByClassName('appendix')[0].style.display = 'inline';
					var result_lst = c.getElementsByClassName('RESULT_LST')[0];
					var child_id = c.getAttribute('child_id');
					makeResultList( child_id, result_lst );

					var children = this.childNodes;
					for ( var i=0; i<children.length; i++ ){
						if ( c!= children[i] )
							children[i].style.display = 'none'
					}
				}
			}

			break;
	}
}

function prevChildren( p ){
	if ( !p.hasChildNodes ) return;
	var children = p.childNodes;

	for ( var i=0; i<children.length; i++ ){
		var c = children[i];
		if ( c.hasAttribute('selected')){
			c.classList.remove('selected');
			c.removeAttribute('selected');
			c.style.height = '';
		}
		c.getElementsByClassName('appendix')[0].style.display = 'none';
		c.style.display = 'inline'
	}

}

function scanChild( o ) {
    while ( true ) {
        var tn = o.tagName;
        if ( tn.toLowerCase() == "body" ) return null;
        // if ( o.getAttribute("child") == "yes" ) return o;
        if ( o.hasAttribute("child_id") ) return o;
        o = o.parentNode;
    }
}

function fitting(){
	var w = document.body.clientWidth;
	var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;
    
}

function finder( e ){
	var keyword = child_form.keyword.value;
	
	if ( e.keyCode == 13 ) finderHelper( keyword );
}
function finderHelper( keyword ){
	console.log( 'keyword:' + keyword );
	var fa = document.getElementById('FINDER_AREA');
	fa.innerText = keyword;

	var r = '';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.addEventListener('readystatechange', 
		function (e){
			switch ( xmlhttp.readyState){
				case 1://opened
					break;
				case 2://header received
					break;
				case 3://loading
					//var fcl = document.getElementById( 'FIND_CHILD_LST' );
					//if ( fcl != null ) fcl.innerText = 'access...';
					fa.innerText = 'access...'
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );
					if ( xmlhttp.status == 200 ){
						var result = JSON.parse( xmlhttp.responseText );
						
						fa.innerText = '';
						for ( var i=0; i<result.length; i++ ){
							var child_id    = result[i].child_id;
							var child_name  = result[i].child_name;
							var kana        = result[i].kana;
							var child_type  = result[i].child_type;
							var child_grade = result[i].child_grade;
							var range_id	= result[i].range_id;
							var imagefile	= result[i].imagefile;
							if ( imagefile == null ) imagefile = '';
							var c = document.createElement('DIV');
							c.setAttribute("child_id",    child_id );
							c.setAttribute("id",          "c_1");
							c.setAttribute("class",       "PALLETE_CHILD");
							c.setAttribute('kana',        kana );
							c.setAttribute('child_type',  child_type );
							c.setAttribute('child_grade', child_grade );
							// c.setAttribute("draggable",   "true");
							c.style.margin	        = '1px';
							c.style.padding			= '2px';
							c.style.float           = 'left';
							r = '';
							r += '<form onsubmit="return false;" >';
							r += '<div style="clear:both;width:100%;height:86px;" >';
								if ( imagefile != ''){
									r += '<div style="float:left;width:70px;height:70px;color:dimgrey;font-size:8px;margin:4px;padding:4px;overflow:hidden;border-radius:45%;background-image:url(./images/children/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
										r += child_id;
									r += '</div>';
								} else{
									r += '<div style="float:left;width:70px;height:70px;color:black;font-size:8px;opacity:0.3;margin:4px;padding:4px;overflow:hidden;border-radius:45%;background-image:url(./images/user-2.png);background-size:30px;background-position:center center;background-repeat:no-repeat;" >';
										r += child_id;
									r += '</div>';
								}
								r += '<div style="float:left;" >';
									r += '<div class="CHILD_NAME" style="font-size:16px;padding-left:2px;">';
										r += child_name;
									r += '</div>';
									// r += '<div style="padding:1px;text-align:right;" >ID:' + child_id + '</div>';
									r += '<div style="font-size:12px;text-align:right;padding-top:2px;" >';
										r += child_type;
										r += '<span style="color:' + arChildGradeColor[ child_grade ] + ';">●</span>';
									r += '</div>';
									r += '<div style="padding:1px;" >' + kana + '</div>';
								r += '</div>';
							r += '</div>';
							// r += '<div style="clear:both;" >';
							// 	r += '<div style="padding:1px;" >Type:' + child_type + '</div>';
							// 	r += '<div style="padding:1px;" >Grade:' + child_grade + '</div>';
							// r += '</div>';
							r += '<div class="appendix" style="clear:both;display:none;" >';
								r += '<div style="padding:1px;font-size:17px;font-weight:bold;" >Property:</div>';
								r += '<div style="padding:1px;height:77px;" >';
									r += '<div>';
										r += '<input type="text" name="child_name"  value="' + child_name  + '" />';
									r += '</div>';
									r += '<div>';
										r += '<input type="text" name="kana"        value="' + kana        + '" />';
									r += '</div>';
									r += '<div>';
										r += '<input type="text" name="child_type"  value="' + child_type  + '" />';
									r += '</div>';
									r += '<div>';
										r += '<input type="text" name="child_grade" value="' + child_grade + '" />';
									r += '<div>';
										r += 'Range:' + range_id;
									r += '</div>';
								r += '</div>';
								r += '<div                    style="padding:1px;font-size:17px;font-weight:bold;" >Result:</div>';
								r += '<div class="RESULT_LST" style="padding:1px;height:84px;border:1px solid lightgrey;" ></div>';
								r += '<div                    style="padding:1px;font-size:17px;font-weight:bold;" >Reservation:</div>';
								r += '<div class="RESERV_LST" style="padding:1px;height:84px;border:1px solid lightgrey;" ></div>';
								r += '<div style="padding:10px 1px 1px 1px;width:100%;text-align:center;" >';
									r += '<button class="BTN_COMMIT_CHILD" style="border:none;background-color:transparent;" >';
										r += '<img width="24px" src="./images/check-3.png" />';
									r += '</button>';
									r += '<button class="BTN_CANCEL_CHILD" style="border:none;background-color:transparent;" >';
										r += '<img   width="24px" src="./images/cancel-2.png" />';
									r += '</button>';
								r += '</div>';
							r += '</div>';
							r += '</form>';
					

							c.innerHTML = r;
							var cc = fa.appendChild( c );
							var bcc = cc.getElementsByClassName('BTN_CANCEL_CHILD')[0];
							bcc.addEventListener( 'click', function(e){
									var p = document.getElementById('FINDER_AREA');
									prevChildren( p );
								}, false );

						}
					} else{
						console.log( null, 'findChildrenTable:' + xmlhttp.status );
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/childfind", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		if ( keyword == '*' ) keyword = '%';
		xmlhttp.send( 'keyword=' + keyword );


}

function makeResultList( child_id, p ){

	var r = '';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.addEventListener('readystatechange', 
		function (e){
			switch ( xmlhttp.readyState){
				case 1://opened
					break;
				case 2://header received
					break;
				case 3://loading
					p.innerText = 'access...'
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );
					if ( xmlhttp.status == 200 ){
						var result = JSON.parse( xmlhttp.responseText );
						
						p.innerText = '';
						for ( var i=0; i<result.length; i++ ){
							var res = result[i];
							var day = res.day;
							var o = document.createElement('DIV');
							o.innerText = day;
							p.appendChild( o );
						}
					}
				break;
			}
		}, false );

		xmlhttp.open("POST", "/accounts/resultlist", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'child_id=' + child_id );

}

//
//	チャイルド作成フォーム
//
function newChildForm(){
	var r = '';
	r += makeChildForm( null );
	openModalDialog( null, r, 'NOBUTTON', null, null );
}

//
//	チャイルドフォームの生成
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
//	チャイルド情報を送信
//
function newChildSend(){
	var result = newChildSendHelper();
	oLog.log( null, 'newChildSend : ' + result );
	// alert( result );
}

//
//	チャイルドの登録（REST)
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

