/**
 *	Author: MASATO.NAKANISHI
 *	Date:	20.June.2020
 *	Reference: https://q-az.net/elements-drag-and-drop/
 */

var x, y;
var wbx, wby;
var curChild  = null;
var propChild = null;
var curChildZIndex = null;
var curChildMoved  = false;

var openWhiteboard = false;
var dayWhiteboard  = '';

var neverCloseDialog = false;

window.onload = init;
window.onresize = fitting;

//
//	初期化処理
//
function init()
{
	var wb = document.getElementById('WHITEBOARD');
//	wb.addEventListener("touchmove",
//	 function( e ) { e.preventDefault(); }, { passive:false } );
//	wb.addEventListener('selectstart', function(e){return false;})
	wb.addEventListener('mousedown', locateWhiteboard );
	wb.addEventListener('mousemove', locateWhiteboard );
	wb.addEventListener('mouseup',   locateWhiteboard );

/*
	wb.addEventListener('mousedown',
		function(e) {
			e.preventDefault();
			if ( document.getElementById('WHITEBOARD') != e.target ) return;
			e.target.position = 'absolute';
			wbx = event.pageX - e.target.offsetLeft;
			wby = event.pageY - e.target.offsetTop + 42;
		});
	wb.addEventListener('mousemove',
		function(e) {
			e.preventDefault();
			if ( document.getElementById('WHITEBOARD') != e.target ) return;
//			if ( e.buttons & 1 ){
				document.getElementById('WHITEBOARD').style.top  = event.pageY - wby + "px";
				document.getElementById('WHITEBOARD').style.left = event.pageX - wbx + "px";
//			}
	
		});	

	wb.addEventListener('mouseup', 
		function(e) {
			initArea();
			if ( e.target == wb)	resetChildMark();
		});
*/
	wb.addEventListener('dragover', 
		function(e) {
			e.preventDefault();
		});
	//
	//	チャイルドをドロップした時の処理	
	//
	wb.addEventListener('drop', 
		function(e) {
			e.preventDefault();
			//alert( e.dataTransfer.getData('text') );
			var id = e.dataTransfer.getData('text');
			console.log( e.pageY, e.pageX, id );
			if ( alreadyExistChildOnWhiteboard( id )){
				alert('すでにホワイトボードに配置されています．');
				return;
			}
			var oChild = getChild(id);
			addChild( e.pageY, e.pageX, oChild.child_id, oChild.child_name, oChild.child_type,oChild.child_grade );
		});

	var cpc = document.getElementById('CHILDREN_PALLETE_CONTENT');
	cpc.addEventListener('dblclick',  selectChild );
	cpc.addEventListener('mouseup',   markPalleteChild );
/*
	cpc.addEventListener('mouseover', function(e){
			var c = scanChild( e.target );
			if ( c != null ) c.style.backgroundColor = 'lightgrey';
		});
	cpc.addEventListener('mouseout', function(e){
			var c = scanChild( e.target );
			if ( c!= null ) c.style.backgroundColor = '';
		});
*/

	fitting();
	new Button( 'ACCOUNTS',                 null           ).play();
	new Button( 'CHILDREN',                 null           ).play();
//	new Button( 'COMMIT',                   null           ).play();
	new Button( 'SIGN_STATUS',              signMenu       ).play();
	new Button( 'WHITEBOARD_PALLETE_TAB',   foldingWhiteboardPallete ).play();
	new Button( 'WPC_TURNONOFF_WHITEBOARD', turnWhiteboard ).play();
	new Button( 'CHILDREN_PALLETE_TAB',     foldingChildrenPallete ).play();
	new Button( 'CPC_RELOAD',               makeChildrenPalleteList ).play();
	new Button( 'CPC_ADD_CHILD',            newChildForm ).play();
	new Button( 'CPC_DND_CHILD',            dragPalleteChild ).play();
	new Button( 'ID_CHILD_DELETE',          deleteWhiteboardChild ).play();

	var mo = document.getElementById('MODAL_OVERLAY');
	mo.addEventListener('click', function(e){
		if ( e.target == this ) closeModalDialog();
		});

		ctlToolbar();
		makeWhiteboardPalleteList();
		makeChildrenPalleteList();
		if ( !checkSign() ){
			signForm();
		} else {
			if ( !openWhiteboard ){
				hiddenWhiteboard();
				showGuidanceWhiteboard();
			}

		}
	
	//
	//	タイムラインバー初期化
	//
	var tmb = document.getElementById('ID_TIMELINE_BAR');
	tmb.addEventListener( 'mousedown',  locateTimelinebar );
	tmb.addEventListener( 'touchstart', locateTimelinebar );
	tmb.addEventListener( 'mousemove',  locateTimelinebar );
	tmb.addEventListener( 'touchmove',  locateTimelinebar );
	tmb.addEventListener( 'mouseup',    locateTimelinebar );

}

//
//	タイムラインバー操作
//
var tlx = 0;
function locateTimelinebar( e ){
	e.preventDefault();

	
	var itb = document.getElementById('ID_TIMELINE_BAR');
	switch ( e.type ){
		case 'touchstart':
		case 'mousedown':
			if(e.type === "mousedown" ) {
				var event = e;
			} else {
				var event = e.changedTouches[0];
			}
			if ( itb != e.target ) return;
			e.target.position = 'absolute';
			tlx = event.pageX - e.target.offsetLeft;
			break;
		case 'touchmove':
		case 'mousemove':
		//	if ( document.getElementById('ID_TIMELINE_BAR') != e.target ) return;
		//	if ( e.buttons & 1 ){
			if(e.type === "mousemove" ) {
				var event = e;
			} else {
				var event = e.changedTouches[0];
			}
				if ( ( event.pageX - tlx ) >= 0 && ( event.pageX - tlx ) <= 138 ){
					itb.style.left = event.pageX - tlx + "px";
					var cur_time = ( 60 * 8 ) + ((event.pageX - tlx) * 5);
					var cur_time2 = ('00' + Math.floor( cur_time / 60 ) ).slice(-2)
								 + ':' + ( '00' + ( cur_time - Math.floor( cur_time / 60 ) * 60 )).slice(-2);
					itb.innerText = cur_time2;
					itb.style.backgroundColor = 'lightcoral';
				}
		//	}
			break;
		case 'mouseup':
			itb.style.backgroundColor = '';
			break;
	}
}


//
//	ホワイトボードガイダンス表示
//
function showGuidanceWhiteboard(){
	var today = new Date();
	var y = today.getFullYear();
	var m = ('00' + (today.getMonth() + 1 ) ).slice(-2);
	var d = ('00' + today.getDate() ).slice(-2);
	var ymd = y + '/' + m + '/' + d;

	var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >create or open whiteboard</div>';
	r += '<div style="margin:0 auto;width:110px;">';
		r += '<form name="guidedance_whiteboard_form" >';
		r += '<div>Date:</div>';
		r += '<div style="padding-bottom:20px;" >';
		r += '<input type="text" id="whiteboard_day" name="day" style="width:96px;" value="' + ymd + '" />';
		r += '</div>';
		r += '</form>';
		r += '<button id="BTN_OPENWHITEBOARD" type="button"  style="width:100px;height:20px;font-size:12px;" onclick="createWhiteboard();" >Next &gt;</button>';
	r += '</div>';
	neverCloseDialog = true;
	openModalDialog( r, 'NOBUTTON' );
	document.getElementById('BTN_OPENWHITEBOARD').focus();
	visibleWhiteboard();

}

//
//	ホワイトボード作成
//
function createWhiteboard(){
	var target_day = guidedance_whiteboard_form.day.value;
	var cwd = document.getElementById('CUR_WHITEBOARD_DAY');
	dayWhiteboard = target_day;
	cwd.innerText = target_day;
	//alert( target_day );
	neverCloseDialog = false;
	closeModalDialog();
}



function alreadyExistChildOnWhiteboard( id ){
	var rc = false;
	var wb = document.getElementById('WHITEBOARD');
	for ( var i=0; i<wb.childNodes.length; i++ ){
		console.log(wb.childNodes[i].getAttribute('child_id'));
		if ( wb.childNodes[i].getAttribute('child_id') == id )
			return true;
	}
	return rc;
}

//
//	ホワイトボード表示切換
//
function turnWhiteboard(){
	switch ( openWhiteboard ){
		case true:
			hiddenWhiteboard();
			break;
		case false:
			visibleWhiteboard();
			break;
	}
}
		
//
//	ホワイトボードを非表示（操作不可）
//
function hiddenWhiteboard(){
	openWhiteboard = false;
	var wb = document.getElementById('WHITEBOARD');
	wb.style.visibility = 'hidden';
}

//
//	ホワイトボードを表示（操作可能）
//
function visibleWhiteboard(){
	openWhiteboard = true;
	var wb = document.getElementById('WHITEBOARD');
	wb.style.visibility = 'visible';
}

function locateWhiteboard( e ){
	e.preventDefault();
	switch ( e.type ){
		case 'mousedown':
			if ( document.getElementById('WHITEBOARD') != e.target ) return;
			e.target.position = 'absolute';
			wbx = event.pageX - e.target.offsetLeft;
			wby = event.pageY - e.target.offsetTop + 42;
			break;
		case 'mousemove':
			if ( document.getElementById('WHITEBOARD') != e.target ) return;
			if ( e.buttons & 1 ){
				document.getElementById('WHITEBOARD').style.top  = event.pageY - wby + "px";
				document.getElementById('WHITEBOARD').style.left = event.pageX - wbx + "px";
			}
			break;
		case 'mouseup':
			initArea();
			if ( document.getElementById('WHITEBOARD') == e.target )	resetChildMark();
			break;
	}
}
//
//	モーダルダイアログをオープン
//
function openModalDialog( r , option ){
	var mo  = document.getElementById('MODAL_OVERLAY');
	var mm  = document.getElementById('MODAL_MESSAGE');
	var mmf = document.getElementById('MODAL_MESSAGE_FOOTER');
	mm.innerHTML = r;

	var f = '';
	switch ( option ){
		case 'NOBUTTON':
			f += '';
			break;
		case 'NORMAL':
		default:
			f += '<button type="button" onclick="closeModalDialog();" >Close</button>';
			break;
	}
	mmf.innerHTML = f;
	mo.style.visibility = 'visible';
}

//
//	モーダルダイアログをクローズ
//
function closeModalDialog(){
	if ( neverCloseDialog) return;
	var mo = document.getElementById('MODAL_OVERLAY');
	var mm = document.getElementById('MODAL_MESSAGE');
	mm.innerHTML = '';
	mo.style.visibility = 'hidden';
	neverCloseDialog = false;
}

//
//	AREA初期化（削除予定）
//
function initArea(){
	var o = document.getElementById('AREA');
	if ( o.style.visibility != 'hidden' )
		clearArea();
}

//
//	ホワイトボードエリアのフィッティング処理
//
function fitting(){
	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;
	var wbf = document.getElementById('WHITEBOARD_FRAME');
	wbf.style.height = ( h - 42 - 30 ) + 'px';

	var cpf  = document.getElementById('CHILDREN_PALLETE_FRAME');
	cpf.style.height  = ( h -42 - 30 ) + 'px';
	cpf.style.left    = ( w - 30 ) + 'px';

	var wpf  = document.getElementById('WHITEBOARD_PALLETE_FRAME');
	wpf.style.height  = ( h -42 - 30 ) + 'px';
//	wpf.style.left    = ( w - 30 ) + 'px';

}

//
//	ホワイトボードパレットのフォールディング
//
var flagWhiteboardPallete = false;
function foldingWhiteboardPallete(){
	var wpf = document.getElementById('WHITEBOARD_PALLETE_FRAME');
	var left = parseInt( wpf.style.left );
	console.log(left);
	//alert( '[' + cpf.style.marginLeft + ']' );
	if ( left < 0 || isNaN(left ) ){
		wpf.style.left = '0px';
		flagWhiteboardPallete = true;
	} else {
		wpf.style.left = '-170px';
		flagWhiteboardPallete = false;
	}
}

//
//	チルドレンパレットのフォールディング
//
var flagChildrenPallete = false;
function foldingChildrenPallete(){
	var cpf = document.getElementById('CHILDREN_PALLETE_FRAME');
	var mleft = parseInt( cpf.style.marginLeft );
	//alert( '[' + cpf.style.marginLeft + ']' );
	if ( mleft == 0 || isNaN(mleft ) ){
		cpf.style.marginLeft = '-180px';
		flagChildrenPallete = true;
	} else {
		cpf.style.marginLeft = '0px';
		flagChildrenPallete = false;
	}
}


//
//	サインアウトデザイン
//
function ctlToolbar(){
	var tb       = document.getElementById('TOOLBAR');
	var wbf      = document.getElementById('WHITEBOARD_FRAME');
	var status   = document.getElementById('STATUS');
	var acc      = document.getElementById('ACCOUNTS');
	var children = document.getElementById('CHILDREN');
	if ( checkSign()) {
		tb.style.visibility     = 'visible';
		wbf.style.visibility    = 'visible';
		status.style.visibility = 'visible';
		acc.style.visibility	= 'visible';
		children.style.visibility= 'visible';
	} else {
		tb.style.visibility     = 'hidden';
		wbf.style.visibility    = 'hidden';
		status.style.visibility = 'hidden';
		acc.style.visibility	= 'hidden';
		children.style.visibility= 'hidden';
	}
}

function clearArea(){
	var r = "";
	var o = document.getElementById('AREA');
	o.style.visibility = 'hidden';
	o.innerHTML = r;

}


function getCookie(){
	var c = document.cookie;
	alert("[" + c + "]");
	alert( checkSign() );
}

//
//	サインインしているかをチェック
//
function checkSign(){
	var c = document.cookie;
	return  ( c.indexOf( 'acc=') > -1 );
}

//
//	バックエンド処理
//
function postWebBackend(){
	var r = "";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var o = document.getElementById('AREA');
			o.style.visibility = 'visible';
			r += "<pre>";
			r += xmlhttp.responseText;
			r += "</pre>";
			r += "<button onclick='clearArea();' >OK</button>";
			o.innerHTML = r;
		}
	}
	try{
		xmlhttp.open("POST", "/webbackend", true );

		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( "cmd=signstatus" );

	} catch ( e ) { alert( e );}

}

//
//	サインアウト処理（同期処理）
//
function signout(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/signout", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send();
	ctlToolbar();
	makeWhiteboardPalleteList();
	makeChildrenPalleteList();
	if ( flagChildrenPallete ) foldingChildrenPallete();
	signForm();
}

function showSignid(){
	var id = signid();
	alert( id );
}
//
//	サインインしているIDを取得
//
function signid(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/sign", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send();
	if ( xmlhttp.status == 200 ){
		var result = JSON.parse( xmlhttp.responseText );
		return ( result != null )? result.status:null;	
	} else return null;

}

//
//	サイン処理
//
function sign()
{
	var r = "";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				var o = document.getElementById( 'SIGN_STATUS' );
				o.innerText = 'access...';
				break;
			case 4://done
				r = "";
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					//r += xmlhttp.responseText;
					switch( result.cmd ){
						case 'signin':
							var o = document.getElementById('SIGNIN_STATUS');
							if ( result.status == 'SUCCESS' ){
								ctlToolbar();
								clearArea();
								clearWhiteboard();
								makeWhiteboardPalleteList();
								makeChildrenPalleteList();
							} else {
								r += 'sign in error'
							}
							o.innerText = r;
							break;
					}
				} else{
					alert( xmlhttp.status );
				}
				break;
		}
	}
	try{
		var sign_id = sign_form.id.value;
		var sign_pwd = sign_form.pwd.value;
		xmlhttp.open("POST", "/accounts/signin", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( "acc=" + sign_id + "&pwd=" + sign_pwd );

	} catch ( e ) { alert( e );}
}

//
//	サインインメニュー
//
function signMenu( e ){
	e.stopPropagation();
	if ( document.getElementById('SIGN_SUBMENU') != null ){
		var p = document.getElementById('SIGN_STATUS');
		var c = document.getElementById('SIGN_SUBMENU');
		p.removeChild( c );
		return;
	}
	var o = document.createElement('DIV');
	o.setAttribute( 'id', 'SIGN_SUBMENU');
	o.style.position		= 'relative';
	o.style.padding			= '2px';
	o.style.top             = '14px';
	o.style.left            = '-53px';
	o.style.width           = '120px';
	o.style.height          = '200px';
	o.style.backgroundColor = '#EEEEEE';
	o.style.textAlign		='left';
	o.style.zIndex			= 50000;
	o.innerText = 'sign menu...';
	var p = document.getElementById('SIGN_STATUS');
	var m = p.appendChild( o );
	var r = '';
	var id = signid();
	r += '<div id="ID_SIGN_OUT"         style="height:20px;padding:2px;" >sign out</div>';
	r += '<div id="ID_PROPERTY_ACCOUNT" style="height:20px;padding:2px;" >property...</div>';
	r += '<div id="ID_LOAD_CHILDREN"    style="height:20px;padding:2px;" >load...</div>';
	r += '<div id="ID_CLEAR_WHITEBOARD" style="height:20px;padding:2px;" >clear whiteboard</div>';
	r += '<div id="ID_CURRENT_ACCOUNT"  style="height:20px;padding:2px;" >sign in ' + id + '</div>';
	m.innerHTML = r;

	new Button( 'ID_SIGN_OUT', signout ).play();
	new Button( 'ID_PROPERTY_ACCOUNT', propertyAccount ).play();
	new Button( 'ID_LOAD_CHILDREN',     loadChildrenForm ).play();
	new Button( 'ID_CLEAR_WHITEBOARD',  clearWhiteboard  ).play();

	m.addEventListener('mouseleave', function(e) {
		var p = document.getElementById('SIGN_STATUS');
		var c = document.getElementById('SIGN_SUBMENU');
		p.removeChild( c );

	});
	m.addEventListener('mouseup', function(e) {
		e.stopPropagation();
	});
}

//
//	サインインフォーム
//
function signForm()
{
	if ( checkSign()) {
		alert('already signin.');
		return;
	}
	var r = "";
	
	r += "<div style='width:400px;height:100%;margin:10px auto;background-color:white;overflow:hidden;' >";
		r += "<div id='OPAQUESHAFT_LOGINTITLE' >";
		r += "&nbsp;&nbsp;OpaqueShaft";
		r += "</div>"; 
		r += "<div style='height:40px;padding-top:20px;text-align:center;font-size:20px;' >Sign in to your account</div>";
		r += "<div id='SIGNIN_STATUS' style='height:20px;text-align:center;' >status</div>";
		r += "<div style='margin:10px auto;width:210px;' >";
			r += "<form name='sign_form' >";
			r += "<div>Signin ID:</div>";
			r += "<div><input style='width:200px;' type='text' id='acc_id' name='id' tabindex=1 /></div>";
			r += "<div style='padding-top:20px;' >Password:</div>";
			r += "<div><input style='width:200px;height:18px;' type='password' name='pwd' tabindex=2 /></div>";
			r += "<div style='padding-top:20px;text-align:center;' >";
				r += "<button style='width:208px;height:20px;' type='button' tabindex=3 onclick='sign();' >signin</button>";
			r += "</div>";
			r += "</form>";
		r += "</div>";
		r += "<div style='padding-top:20px;text-align:center;' >";
			r += "created by MASATO.NAKANISHI. 2020"
		r += "</div>";
	r += "</div>";
	var o = document.getElementById('AREA');
	o.innerHTML = r;
	o.style.visibility = 'visible';
	o = document.getElementById( 'acc_id' );
	o.focus();
	
}

//
//
//
//
//	ホワイトボードパレットリスト生成処理
//
function makeWhiteboardPalleteList()
{
	document.getElementById( 'WHITEBOARD_PALLETE_CONTENT' ).innerHTML = '';
	if ( !checkSign()){
		document.getElementById( 'WHITEBOARD_PALLETE_FRAME' ).style.visibility = 'hidden';
		return;
	}
	document.getElementById( 'WHITEBOARD_PALLETE_FRAME' ).style.visibility = 'visible';
	var r = "";
}




//
//	チルドレンパレット関連
//
//
//	チルドレンパレットリスト生成処理
//
function makeChildrenPalleteList()
{
	document.getElementById( 'CHILDREN_PALLETE_CONTENT' ).innerHTML = '';
	if ( !checkSign()){
		document.getElementById( 'CHILDREN_PALLETE_FRAME' ).style.visibility = 'hidden';
		return;
	}
	document.getElementById( 'CHILDREN_PALLETE_FRAME' ).style.visibility = 'visible';
	var r = "";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				var o = document.getElementById( 'CHILDREN_PALLETE_CONTENT' );
				o.innerText = 'access...';
				break;
			case 4://done
				r = "";
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					//r += xmlhttp.responseText;
					var o = document.getElementById('CHILDREN_PALLETE_CONTENT');
					o.innerText = '';
					for ( var i=0; i<result.length; i++ ){
						addChildManage( o, result[i] );
					}
					//o.innerHTML = r;
				} else{
					document.getElementById('CHILDREN_PALLETE_CONTENT').innerText = xmlhttp.status;
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/childlist", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send();

	} catch ( e ) { alert( e );}
}


//
//	チャイルド管理
//
function manageChildren(){
	var r = "";
	
	r += "<div style='width:500px;height:100%;margin:10px auto;background-color:white;overflow:hidden;' >";
		r += "<div id='OPAQUESHAFT_LOGINTITLE' >";
		r += "&nbsp;&nbsp;OpaqueShaft";
		r += "</div>"; 
		r += "<div style='height:40px;padding-top:20px;text-align:center;font-size:20px;' >Manage Children</div>";
		r += "<div id='CHILD_STATUS' style='height:20px;text-align:center;' >status</div>";
//		r += "<div id='CHILD_LIST'   style='float:left;width:170px;height:200px;border:1px solid lightgray;overflow-y:auto;' >";
//		r += "</div>";
		r += "<div id='CHILD_PROP'   style='float:left;width:280px;height:200px;padding-left:12px;border:1px solid lightgrey;' ></div>";
		r += "<div style='clear:both;padding-top:4px;border-top:1px solid lightgrey;' >";
			r += "<button type='button' onclick='newChildForm()'     >+</button>";
			r += "<button type='button' onclick=''                   >ok</button>";
			r += "<button type='button' onclick='clearArea();'       >close</button>";
        r += "</div>";

	r += "</div>";
	var o = document.getElementById('AREA');
	o.innerHTML = r;
	o.style.visibility = 'visible';

}

//
//	チャイルド選択し、プロパティ表示
//
function selectChild( e ){
	var c = scanChild( e.target );
	if ( c != null ){
		var id = c.getAttribute('child_id');
		console.log( c.getAttribute( id ));
		propertyChild2( id );
	}
}

//
//	パレット内のチャイルド選択
//
function markPalleteChild( e ){
	var c = scanChild( e.target );
	if ( c != null ){
		var m = c.getAttribute('selected');
		if ( m == null ){
			c.style.color			= 'white';
			c.style.backgroundColor = 'lightcoral';
			c.setAttribute('selected', 'yes' );
		} else {
			c.style.color			= '';
			c.style.backgroundColor = '';
			c.removeAttribute('selected' );
		}
		var id = c.getAttribute('child_id');
	} else{
		var cpc = document.getElementById('CHILDREN_PALLETE_CONTENT');
		for ( var i=0; i<cpc.childNodes.length; i++ ){
			if ( cpc.childNodes[i].getAttribute('selected') != null ){
				cpc.childNodes[i].style.color = '';
				cpc.childNodes[i].style.backgroundColor = '';
				cpc.childNodes[i].removeAttribute('selected');
			}
		}

	}
}

//
//	パレット内のマークしたチャイルドをホワイトボードにドラッグ
//
function dragPalleteChild(){
	var cpc = document.getElementById('CHILDREN_PALLETE_CONTENT');
	for ( var i=0; i<cpc.childNodes.length; i++ ){
		if ( cpc.childNodes[i].getAttribute('selected') != null ){
			var id = cpc.childNodes[i].getAttribute('child_id');
			if ( alreadyExistChildOnWhiteboard( id ) ) continue;
			var oChild = getChild( id );
			if ( oChild != null ){
				var top  = 0;
				var left = 0;
				var lchild = latestWhiteboardChild();
				if ( lchild != null ){
					top  = parseInt( lchild.style.top ) + 20;
					left = parseInt( lchild.style.left ) + 20;
				}
				addChild( top, left, oChild.child_id, oChild.child_name, oChild.child_type, oChild.child_grade );
			}
			cpc.childNodes[i].style.color = '';
			cpc.childNodes[i].style.backgroundColor = '';
			cpc.childNodes[i].removeAttribute('selected');
		}
	}

}

//
//	チャイルド作成フォーム
//
/*
function newChildFormOld(){
	var p = document.getElementById('CHILD_PROP');
	var r = '';
	r += makeChildForm( null );
	r += '<div>';
		r += "<button type='button' onclick='newChildSend()' >add</button>";
		r += "<button type='button' onclick=''       >cancel</button>";
	r += '</div>';
	
}
*/

//
//	チャイルド作成フォーム
//
function newChildForm(){
	var r = '';
	r += makeChildForm( null );
	openModalDialog( r, 'NOBUTTON' );
}

//
//	チャイルドプロパティフォーム
//
function propertyChild2( id ){
	var r = '';
	var oChild = getChild( id );
	r += makeChildForm( oChild );
	openModalDialog( r, 'NORMAL' );

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
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >create child</div>';
	r += '<div style="margin:0 auto;width:110px;">';
		r += '<form name="child_form" >';
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
	alert( result );
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

//
//	チャイルド情報を取得
//
function getChild( id ){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/child", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'id=' + id );
	if ( xmlhttp.status == 200 ){
		//alert( xmlhttp.responseText );
		var result = JSON.parse( xmlhttp.responseText );
		return ( result != null )? result:null;	
	} else return null;

}

//
//	チャイルド操作
//
function mDown( e ) {

		curChild = this;
        //クラス名に .drag を追加
		curChild.classList.add("drag");
		curChildZIndex = curChild.style.zIndex;
		curChild.style.zIndex = 2001;
        //タッチイベントとマウスのイベントの差異を吸収
        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }
		//e.stopPropagation();
        //要素内の相対座標を取得
        x = event.pageX - curChild.offsetLeft;
        y = event.pageY - curChild.offsetTop;

        //ムーブイベントにコールバック
        document.body.addEventListener("mousemove", mMove, false);
        document.body.addEventListener("touchmove", mMove, false);	
        //マウスボタンが離されたとき、またはカーソルが外れたとき発火

		curChild.addEventListener("mouseup", mUp, false);
        document.body.addEventListener("mouseleave", mUp, false);
        curChild.addEventListener("touchend", mUp, false);
        document.body.addEventListener("touchleave", mUp, false);

	}

//
//	チャイルド操作
//
function mMove( e ){

        //ドラッグしている要素を取得
		//var drag = document.getElementsByClassName("drag")[0];
//		var drag = e.target;
		var drag = curChild;
		curChildMoved   = true;

        //同様にマウスとタッチの差異を吸収
        if(e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //フリックしたときに画面を動かさないようにデフォルト動作を抑制
		e.preventDefault();
		//e.stopPropagation();

		//マウスが動いた場所に要素を動かす
//		if ( event.type == 'touchmove' 
//		    || (( event.buttons & 1 ) && event.type == 'mousemove' ) ){
			drag.style.top  = event.pageY - y + "px";
			drag.style.left = event.pageX - x + "px";
//		}

        //マウスボタンが離されたとき、またはカーソルが外れたとき発火
/*
        drag.addEventListener("mouseup", mUp, false);
        document.body.addEventListener("mouseleave", mUp, false);
        drag.addEventListener("touchend", mUp, false);
        document.body.addEventListener("touchleave", mUp, false);
*/
}

//
//	チャイルド操作
//
function mUp( e ) {
	//var drag = document.getElementsByClassName("drag")[0];
	//var drag = e.target;
	var drag = curChild;
	//ムーブベントハンドラの消去
	document.body.removeEventListener("mousemove", mMove, false);
	if ( drag != null) drag.removeEventListener("mouseup", mUp, false);
	document.body.removeEventListener("touchmove", mMove, false);
	if ( drag != null ) drag.removeEventListener("touchend", mUp, false);

	//e.stopPropagation();

	//クラス名 .drag も消す
	if ( drag != null ) drag.classList.remove("drag");
	if ( e.type == 'mouseup'){		//	touchendで反応しないように！
		if ( !curChildMoved ){
			if ( curChild != null ){
				if ( curChild.getAttribute('marked') == 'MARKED' ) {
					unmarkChild( curChild );
				}else {
					markChild( curChild );
				}
			}
		} 
	}

	if ( curChild != null ) curChild.style.zIndex = '';
	curChildMoved         = false;
	curChild              = null;
}

//
//	チャイルドのマークをリセット
//
function resetChildMark(){
	var wb = document.getElementById('WHITEBOARD');
	if ( wb.childNodes.length == 0 ) return;
	var c = null;
	c = wb.firstChild;
	while ( c ) {
		if ( c.getAttribute('marked') == 'MARKED') {
			c.style.backgroundColor = '';
			c.style.color 			= '';
			c.removeAttribute('marked');
		}
		c = c.nextSibling;
	}

}
