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
	var fa = document.getElementById('FINDER_AREA');
	fa.innerText = keyword;

	var r = '';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.addEventListener('readystatechange', 
		function (e){
			switch ( xmlhttp.readyState){
				case 1://opened
				case 2://header received
				case 3://loading
					//var fcl = document.getElementById( 'FIND_CHILD_LST' );
					//if ( fcl != null ) fcl.innerText = 'access...';
					fa.innerText = 'access...'
					break;
				case 4://done
					if ( xmlhttp.status == 200 ){
						var result = JSON.parse( xmlhttp.responseText );
						
						fa.innerText = '';
						for ( var i=0; i<result.length; i++ ){
							var child_id    = result[i].child_id;
							var child_name  = result[i].child_name;
							var kana        = result[i].kana;
							var child_type  = result[i].child_type;
							var child_grade = result[i].child_grade;
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
							c.style.marginTop       = '1px';
							c.style.marginLeft      = '1px';
							c.style.float           = 'left';
							r = '';
							r += '<form onsubmit="return false;" >';
							r += '<div class="CHILD_NAME" style="float:left;font-size:16px;width:100%;height:24px;padding-left:2px;border-bottom:1px solid lightgrey;">';
								r += child_name;
							r += '</div>';
							r += '<div style="float:right;font-size:12px;text-align:right;padding-top:2px;" >';
								r += child_type;
								r += '<span style="color:' + arChildGradeColor[ child_grade ] + ';">●</span>';
							r += '</div>';
							if ( imagefile != ''){
								r += '<div style="float:left;width:70px;height:70px;margin:4px;padding:4px;overflow:hidden;border-radius:45%;background-image:url(./images/children/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
								r += '</div>';
		
							}
							r += '<div style="clear:both;" >';
								r += '<div style="padding:1px;" >ID</div>';
								r += '<div style="padding:1px;" >' + child_id + '</div>';
								r += '<div style="padding:1px;" >Child name</div>';
								r += '<div style="padding:1px;" >' + child_name + '</div>';
								r += '<div style="padding:1px;" >Kana</div>';
								r += '<div style="padding:1px;" >' + kana + '</div>';
								r += '<div style="padding:1px;" >Type</div>';
								r += '<div style="padding:1px;" >' + child_type + '</div>';
								r += '<div style="padding:1px;" >Grade</div>';
								r += '<div style="padding:1px;" >' + child_grade + '</div>';
							r += '</div>';
							r += '</form>';
					

							c.innerHTML = r;
							var cc = fa.appendChild( c );

						}
					} else{
						// oLog.log( null, 'findChildrenTable:' + xmlhttp.status );
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/childfind", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		if ( keyword == '*' ) keyword = '%';
		xmlhttp.send( 'keyword=' + keyword );


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

