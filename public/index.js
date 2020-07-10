/**
 *	Author: MASATO.NAKANISHI
 *	Date:	20.June.2020
 *	Reference: https://q-az.net/elements-drag-and-drop/
 */

var x, y;
var curChild  = null;
var propChild = null;
var curChildZIndex = null;
var curChildMoved  = false;
window.onload = init;
window.onresize = fitting;

//
//	初期化処理
//
function init()
{
	var wb = document.getElementById('WHITEBOARD');
	wb.addEventListener("touchmove",
	 function( e ) { e.preventDefault(); }, { passive:false } );
	wb.addEventListener('selectstart', function(e){return false;})
	wb.addEventListener('click', 
		function(e) {
			initArea();
			if ( e.target == wb)	resetChildMark();
		});
	fitting();
	new Button( 'ACCOUNTS',             null           ).play();
	new Button( 'CHILDREN',             manageChildren ).play();
	new Button( 'COMMIT',               null           ).play();
	new Button( 'SIGN_STATUS',          signMenu       ).play();
	new Button( 'CHILDREN_PALLETE_TAB', foldingChildrenPallete ).play();

	ctlToolbar();
	makeChildrenPalleteList();
	if ( !checkSign() )  signForm();
}

//
//	モーダルダイアログをオープン
//
function openModalDialog(){
	var mo = document.getElementById('MODAL_OVERLAY');
	mo.style.visibility = 'visible';
}

//
//	モーダルダイアログをクローズ
//
function closeModalDialog(){
	var mo = document.getElementById('MODAL_OVERLAY');
	mo.style.visibility = 'hidden';
}

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
	cpf.style.left    = ( w - 20 ) + 'px';
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
	var o = document.createElement('DIV');
	o.setAttribute( 'id', 'SIGN_SUBMENU');
	o.style.position		= 'relative';
	o.style.padding			= '2px';
	o.style.top             = '18px';
	o.style.left            = '-34px';
	o.style.width           = '100px';
	o.style.height          = '100px';
	o.style.backgroundColor = 'white';
	o.style.textAlign		='left';
	o.style.zIndex			= 30000;
	o.innerText = 'sign menu...';
	var p = document.getElementById('SIGN_STATUS');
	var m = p.appendChild( o );
	var r = '';
	var id = signid();
	r += '<div id="ID_SIGN_OUT"         style="height:20px;padding:2px;" >sign out</div>';
	r += '<div id="ID_PROPERTY_ACCOUNT" style="height:20px;padding:2px;" >property...</div>';
	r += '<div id="ID_CURRENT_ACCOUNT"  style="height:20px;padding:2px;" >sign in ' + id + '</div>';
	m.innerHTML = r;

	new Button( 'ID_SIGN_OUT', signout ).play();
	new Button( 'ID_PROPERTY_ACCOUNT', propertyAccount ).play();

	m.addEventListener('mouseleave', function(e) {
		var p = document.getElementById('SIGN_STATUS');
		var c = document.getElementById('SIGN_SUBMENU');
		//if ( e == c )
			p.removeChild( c );
		//p.removeChild( e );
		//while ( p.firstChild) {
		//		p.removeChild( p.firstChild );
		//}
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
		r += "<form name='sign_form' >";
			r += "<table align='center' >";
			r += "<tr>";
			r += "<td>Sign in ID:</td>";
			r += "</tr>";
			r += "<tr>";
			r += "<td><input style='width:200px;' type='text' id='acc_id' name='id' tabindex=1 /></td>";
			r += "</tr>";
			r += "<tr>";
			r += "<td>Password:</td>";
			r += "<tr>";
			r += "<tr>";
			r += "<td><input style='width:200px;height:18px;' type='password' name='pwd' tabindex=2 /></td>";
			r += "<tr>";
			r += "</table>";
			r += "<div style='text-align:center;' >";
				r += "<button style='width:208px;height:20px;' type='button' tabindex=3 onclick='sign();' >signin</button>";
			r += "</div>";
		r += "</form>";
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
		r += "<div id='CHILD_LIST'   style='float:left;width:170px;height:200px;border:1px solid lightgray;overflow-y:auto;' >";
		r += "</div>";
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
	loadChildList();
	var cl = document.getElementById('CHILD_LIST');
	cl.addEventListener('click', selectChild );
	cl.addEventListener('dblclick', selectCandidateChild );

}

//
//	チャイルド選択し、プロパティ表示
//
function selectChild( e ){
	var c = e.target;
	while ( true ){
		if ( c.getAttribute('child') == 'yes' ) break;
		c = c.parentNode;
	}

	var id = c.getAttribute('child_id');
	var oChild = getChild(id);
	
	var p = document.getElementById('CHILD_PROP');
	var r = '';
	r += makeChildForm( oChild );
	r += '<div>';
		r += "<button type='button' onclick=''       >apply</button>";
		r += "<button type='button' onclick=''       >close</button>";
	r += '</div>';

	p.innerHTML = r;

}

//
//
//
function newChildForm(){
	var p = document.getElementById('CHILD_PROP');
	var r = '';
	r += makeChildForm( null );
	r += '<div>';
		r += "<button type='button' onclick='newChildSend()' >add</button>";
		r += "<button type='button' onclick=''       >cancel</button>";
	r += '</div>';
	
	p.innerHTML = r;

}

//
//	チャイルドフォームの生成
//
function makeChildForm( oChild ){
	var id = '';
	var name = '';
	var type = '';
	var grade = '';
	if ( oChild != null ) {
		id = oChild.child_id;
		name = oChild.child_name;
		type = oChild.child_type;
		grade = oChild.child_grade;
	}
	var r = '';
	r += '<form name="child_form" >';
	r += '<div>id:</div>';
	r += '<div><input type="text" name="child_id"    value="' + id    + '" readonly /></div>';
	r += '<div>name:</div>';
	r += '<div><input type="text" name="child_name"  value="' + name  + '" /></div>';
	r += '<div>type:</div>';
	r += '<div><input type="text" name="child_type"  value="' + type  + '" /></div>';
	r += '<div>grade:</div>';
	r += '<div><input type="text" name="child_grade" value="' + grade + '" /></div>';
	r += '</form>';
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
//
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
//	候補チャイルド
//
function selectCandidateChild( e ){
	var c = e.target;
	while ( true ){
		if ( c.getAttribute('child') == 'yes' ) break;
		c = c.parentNode;
	}
//	alert(c.innerHTML);
	addChild( 0, 0, 'Yurie.K', 'A', 4 );
}

//
//	チャイルドリスト生成処理
//
function loadChildList()
{
	var r = "";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				var o = document.getElementById( 'CHILD_STATUS' );
				o.innerText = 'access...';
				break;
			case 4://done
				r = "";
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					//r += xmlhttp.responseText;
					var o = document.getElementById('CHILD_LIST');
					o.innerHTML = '';
					for ( var i=0; i<result.length; i++ ){
						addChildManage( o, result[i] );
					}
				} else{
					document.getElementById( 'CHILD_STATUS' ).innerText = xmlhttp.status;
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
//	チャイルド操作
//
function mDown( e ) {

		curChild = this;
        //クラス名に .drag を追加
		curChild.classList.add("drag");
		curChildZIndex = curChild.style.zIndex;
		curChild.style.zIndex = 2001;
        //タッチデイベントとマウスのイベントの差異を吸収
        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }
		e.stopPropagation();
        //要素内の相対座標を取得
        x = event.pageX - curChild.offsetLeft;
        y = event.pageY - curChild.offsetTop;

        //ムーブイベントにコールバック
        document.body.addEventListener("mousemove", mMove, false);
        document.body.addEventListener("touchmove", mMove, false);	
}

//
//	チャイルド操作
//
function mMove( e ){

        //ドラッグしている要素を取得
		//var drag = document.getElementsByClassName("drag")[0];
//		var drag = e.target;
		var drag = curChild;

        //同様にマウスとタッチの差異を吸収
        if(e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //フリックしたときに画面を動かさないようにデフォルト動作を抑制
		e.preventDefault();
		e.stopPropagation();

        //マウスが動いた場所に要素を動かす
        drag.style.top  = event.pageY - y + "px";
		drag.style.left = event.pageX - x + "px";
		curChildMoved   = true;

        //マウスボタンが離されたとき、またはカーソルが外れたとき発火
        drag.addEventListener("mouseup", mUp, false);
        document.body.addEventListener("mouseleave", mUp, false);
        drag.addEventListener("touchend", mUp, false);
        document.body.addEventListener("touchleave", mUp, false);

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
	if ( !drag ) drag.removeEventListener("mouseup", mUp, false);
	document.body.removeEventListener("touchmove", mMove, false);
	if ( !drag ) drag.removeEventListener("touchend", mUp, false);

	e.stopPropagation();

	//クラス名 .drag も消す
	if ( !drag ) drag.classList.remove("drag");
	if ( !curChildMoved ){
		if ( curChild.getAttribute('marked') == 'MARKED' ) {
			unmarkChild( curChild );
		}else {
			markChild( curChild );
		}
	} 

	curChild.style.zIndex = '';
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
			c.removeAttribute('marked');
		}
		c = c.nextSibling;
	}

}
