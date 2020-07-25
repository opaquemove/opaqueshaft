/**
 *	Author: MASATO.NAKANISHI
 *	Date:	20.June.2020
 *	Reference: https://q-az.net/elements-drag-and-drop/
 */

var x, y;
var wbx, wby;
var delta_x, delta_y;
var curChild  = null;
var propChild = null;
var curChildZIndex = null;
var curChildMoved  = false;

var criteriaEscortPixel = 600;

var dndOffsetX = 0;
var dndOffsetY = 0;

var openWhiteboard = false;
var dayWhiteboard  = '';

var neverCloseDialog = false;

var palleteTimeSelector = null;

window.onload = init;
window.onresize = fitting;

//
//	初期化処理
//
function init()
{
	document.oncontextmenu = function(e) { return false; }
	var wbf = document.getElementById('WHITEBOARD_FRAME');
	// wbf.addEventListener('scroll',
	// 	function(e){
	// 		console.log( 'scrollTop:' + e.target.scrollTop );
	// 	});

	var wb = document.getElementById('WHITEBOARD');
//  touchmoveを抑制すると返って使いづらいので抑制はしないよ！ 
//	wb.addEventListener("touchmove",
//	 function( e ) { e.preventDefault(); }, { passive:false } );
//	wb.addEventListener('selectstart', function(e){return false;})

	// iPadでドラッグできなくなるのでコメント
	// var cpf = document.getElementById('CHILDREN_PALLETE_FRAME');
	// cpf.addEventListener("touchmove",
	//  function( e ) { e.preventDefault(); }, { passive:false } );
	 var wpf = document.getElementById('WHITEBOARD_PALLETE_FRAME');
	 wpf.addEventListener("touchmove",
	  function( e ) { e.preventDefault(); }, { passive:false } );
 

	wb.addEventListener('mousedown', locateWhiteboard );
	wb.addEventListener('mousemove', locateWhiteboard );
	wb.addEventListener('mouseup',   locateWhiteboard );
	document.addEventListener('keydown',   keyWhiteboard );


	//
	//	ドラッグオーバー時の処理
	//
	wb.addEventListener('dragover', 
		function(e) {
			e.preventDefault();
		});
	//
	//	ドラッグオーバー時の処理
	//
	wb.addEventListener('dragenter', 
		function(e) {
			e.preventDefault();	
		});
	//
	//	ドラッグリーブ時の処理
	//
	wb.addEventListener('dragleave', 
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
			var wb = document.getElementById('WHITEBOARD');
			console.log( e.pageY, e.pageX, id );
			if ( alreadyExistChildOnWhiteboard( id )){
				alert('すでにホワイトボードに配置されています．');
				return;
			}
			var itb = document.getElementById('ID_TIMELINE_BAR');
			var hm  = itb.innerText;
			var arHM = hm.split(':');

			var p = e.target.parentNode;
		
			var oChild = getChild(id);
			//var escort = document.getElementById('CPC_ESCORT_CHILD').getAttribute('flag');
//			addChild( ( arHM[0] - 8 ) * 100, arHM[1] * 160, oChild.child_id, oChild.child_name, oChild.child_type,oChild.child_grade );
			addChild( e.pageY - e.target.offsetTop - dndOffsetY + wb.parentNode.scrollTop,
				 e.pageX - e.target.offsetLeft - p.offsetLeft - dndOffsetX + wb.parentNode.scrollLeft,
				 oChild.child_id, oChild.child_name, oChild.child_type,oChild.child_grade );
			dndOffsetX = 0;
			dndOffsetY = 0;
			showWhiteboardChildCount();
		});

	//
	//	ホワイトボードパレットのイベント登録
	//	
	var wpc = document.getElementById('WHITEBOARD_PALLETE_CONTENT');
	//wpc.addEventListener('dblclick',  selectWhiteboard );
	//wpc.addEventListener('mouseup',   markPalleteWhiteboard );

	//
	//	チルドレンパレットのイベント登録
	//	
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
//	new Button( 'ACCOUNTS',                 null           ).play();
//	new Button( 'CHILDREN',                 null           ).play();
//	new Button( 'COMMIT',                   null           ).play();
	new Button( 'SIGN_STATUS',              signMenu       ).play();
	new Button( 'WHITEBOARD_PALLETE_TAB',   foldingWhiteboardPallete ).play();
	new Button( 'WPC_TURNONOFF_WHITEBOARD', turnWhiteboard ).play();
	new Button( 'WPC_SAVE_WHITEBOARD',      saveWhiteboard ).play();
	new Button( 'CHILDREN_PALLETE_TAB',     foldingChildrenPallete ).play();
	new Button( 'CPC_RELOAD',               makeChildrenPalleteList ).play();
	new Button( 'CPC_ADD_CHILD',            newChildForm ).play();
	// new Button( 'CPC_DND_CHILD',            dragPalleteChild ).play();
	new Button( 'ID_CHILD_DELETE',          deleteWhiteboardMarkChild ).play();
	new Button( 'ID_CHILD_CHECKOUT',        checkoutWhiteboardMarkChild ).play();
	new Button( 'ID_CHILD_CHECKCLEAR',      checkoutClearWhiteboardMarkChild ).play();
	new Button( 'ID_CHILD_TIMEUPDATE',		showTimelineSelector ).play();
	new Button( 'ID_GRADE1',                null           ).play();
	new Button( 'ID_GRADE2',                null           ).play();
	new Button( 'ID_GRADE3',                null           ).play();
	new Button( 'ID_GRADE4',                null           ).play();
	new Button( 'ID_GRADE5',                null           ).play();
	new Button( 'ID_GRADE6',                null           ).play();
	// new Checkbox('CPC_ESCORT_CHILD', 'ON').play();
	new Checkbox('CPC_GRADE1', 'OFF', null ).play();
	new Checkbox('CPC_GRADE2', 'OFF', null ).play();
	new Checkbox('CPC_GRADE3', 'OFF', null ).play();
	new Checkbox('CPC_GRADE4', 'OFF', null ).play();
	new Checkbox('CPC_GRADE5', 'OFF', null ).play();
	new Checkbox('CPC_GRADE6', 'OFF', null ).play();


	var mo = document.getElementById('MODAL_OVERLAY');
	mo.addEventListener('click', function(e){
		if ( e.target == this ) closeModalDialog();
		});

	ctlToolbar();
	makeWhiteboardPalleteList();
	makeChildrenPalleteList();
	if ( !checkSign() ){			//サインアウトしている
		signForm();
	} else {						//サインインしている
		if ( !openWhiteboard ){
			hiddenWhiteboard();
			showGuidanceWhiteboard();
		}
	}
	
	//
	//	タイムラインガイド初期化
	//
	var wbt = document.getElementById('WHITEBOARD_TIMELINE');
	wbt.addEventListener( 'mouseup',
		function(e){
			e.stopPropagation();
			if ( alreadyTimelineContextMenu( e.target )){
				console.log('already');
				document.getElementById('TIMELINE_CONTEXTMENU').parentNode.removeChild( document.getElementById('TIMELINE_CONTEXTMENU') );
				return;
			}
			if ( wbt != e.target.parentNode ) return;
			resetTimelineContextMenu();
			var m = document.createElement('DIV');
			m.setAttribute( 'id',      'TIMELINE_CONTEXTMENU' );
			m.setAttribute('cmenu', 'yes');
			m.style.position 		= 'absolute';
			m.style.top				= '-1px';
			m.style.left			= '28px';
			m.style.width			= '100px';
			m.style.height			= '70px';
			m.style.color			= 'white';
			m.style.backgroundColor	= 'red';
			m.style.textAlign		= 'left';
			m.style.border			= '1px solid lightgrey';
			m.style.writingMode		= 'horizontal-tb';
			m.style.overflow		= 'hidden';
			var r = '';
			//r += '<div>' + e.target.innerText + '</div>';
			r += '<div class="CM_MOVE"     >Move...</div>';
			r += '<div class="CM_CHECKOUT" >Checkout...</div>';
			r += '<div class="CM_DELETE"   >Delete...</div>';
			m.innerHTML				= r;
			var mm = e.target.appendChild(m);
			mm.addEventListener('mouseover',
			function(e) {
				e.stopPropagation();
				var c = e.target;
				if ( c != mm ){
					c.style.color			= 'gray';
					c.style.backgroundColor = '#EEEEEE';
				}
			} );
			mm.addEventListener('mouseout',
			function(e) {
				e.stopPropagation();
				var c = e.target;
				if ( c != mm ){
					c.style.color			= '';
					c.style.backgroundColor = '';
				}
			} );
		

			var contextFunc = [ moveTimelineWhiteboardChild, checkoutTimelineWhiteboardChild, null ];
			var c = mm.firstChild;
			c.addEventListener('mouseup',
				function(e){
					e.stopPropagation();
					console.log('move');
					contextFunc[0]( e.target.innerText );
				});
			c = c.nextSibling;
			c.addEventListener('mouseup',
				function(e){
					e.stopPropagation();
					console.log('checkout');
					contextFunc[1]( e.target.innerText );
				});
		
		}
	);

	//
	//	タイムセレクタ初期化
	//
	palleteTimeSelector = new TimeSelector( dragPalleteChild2 );
	palleteTimeSelector.play();
/*
	var mts = document.getElementById('MODAL_TIMESELECTOR');
	mts.addEventListener('mouseover',
		function(e){
			var o = e.target;
			o.style.backgroundColor	= 'darkred';
		});
	mts.addEventListener('mouseout',
		function(e){
			var o = e.target;
			o.style.backgroundColor	= '';
		});
	mts.addEventListener('mouseup',
		function(e){
			var h = e.target.innerText;
			console.log( h );
			ctlTimelineSelector( 'close', null );
			dragPalleteChild2( h + ':00' );
		});
*/

	//
	//	タイムラインバー初期化
	//
	var tmb = document.getElementById('ID_TIMELINE_BAR');
	tmb.addEventListener( 'mousedown',  locateTimelinebar );
	tmb.addEventListener( 'touchstart', locateTimelinebar );
	tmb.addEventListener( 'mousemove',  locateTimelinebar );
	tmb.addEventListener( 'touchmove',  locateTimelinebar );
	tmb.addEventListener( 'mouseup',    locateTimelinebar );
	tmb.addEventListener( 'touchend',   locateTimelinebar );

}

//
//	タイムセレクタのプロトタイプ
//
function TimeSelector( func ){
	this.frame 		= null;
	this.selector	= null;
	this.func		= func;
	this.device		= null;
	this.evtStart	= null;
	this.evtMove	= null;
	this.evtEnd		= null;
}

//
//	onmouseover(down) = ontouchstart
//	onmousemove = ontouchmove
//	onmouseup   near ontouchend
//	event       = event.touches[0]
TimeSelector.prototype = {
	play : function(){
		this.frame		= document.getElementById('MODAL_OVERLAY_TIMESELECTOR');
		this.selector	= document.getElementById('MODAL_TIMESELECTOR');
		this.touchdevice	= ( 'ontouchend' in document );
		console.log('touch device:' + this.device);
		switch ( this.touchdevice ){
			case true:		// touch device( iPad/iPhone/Android/Tablet )
				this.evtStart	= 'touchstart';
				this.evtMove	= 'touchmove';
				this.evtEnd		= 'touchend';
				break;
			case false:	// pc
				this.evtStart	= 'mousedown';
				this.evtMove	= 'mousemove';
				this.evtEnd		= 'mouseup';
				break;
		}
		// this.selector.addEventListener('touchstart',
		// 	(function(e){
		// 		e.preventDefault();
		// 	}).bind(this), false );
		this.selector.addEventListener( this.evtStart,		//	mousedown/touchstart
			(function(e){
				var o = ( this.touchdevice )? e.changedTouches[0]: e.target;
				while( true ){
					if ( this.selector == o.parentNode) break;
					 else o = o.parentNode;
				}
				if ( o.hasAttribute('target')){
					o.style.backgroundColor	= 'darkred';
					if ( o.getAttribute('target') == 'on' )
						document.getElementById('WHITEBOARD_FRAME').scrollTop = (parseInt( o.innerText ) - 8 ) * 400;
				}
			}).bind(this), false );
		// this.selector.addEventListener('mouseout',
		// 	( function(e){
		// 		var o = e.target;
		// 		while( true ){
		// 			if ( this.selector == o.parentNode) break;
		// 			 else o = o.parentNode;
		// 		}
		// 		if ( o.hasAttribute('target'))
		// 			o.style.backgroundColor	= '';
		// 	} ).bind( this ), false );
		this.selector.addEventListener( this.evtEnd,	// mouseup/touchend
			( function(e){
				var o = e.target;
				while( true ){
					if ( this.selector == o.parentNode) break;
					 else o = o.parentNode;
				}
				if ( o.hasAttribute('target')){
					console.log('target:' + o.getAttribute('target'));
					switch ( o.getAttribute('target')){
						case 'on':
							var h = e.target.innerText;
							if ( this.func != null ){
								this.close();
								this.func( h + ':00' );
							}
							break;
						case 'close':
							this.close();
							break;
					}
				}

			} ).bind( this ), false );
	
	},
	open : function(){
		this.frame.style.visibility = 'visible';
	},
	close : function(){
		this.frame.style.visibility = 'hidden';
	},
	opened : function(){
		return ( this.frame.visibility == 'visible' );
	}
};

//
//	タイムラインセレクタ制御
//
/*
function ctlTimelineSelector( cmd, func ){
	var mots = document.getElementById('MODAL_OVERLAY_TIMESELECTOR');
	switch ( cmd ){
		case 'open':
			mots.style.visibility = 'visible';
			break;
		case 'close':
			mots.style.visibility = 'hidden';
			break;
	}
}
*/

//
//	開いているタイムラインコンテキストメニューを閉じる
//
function resetTimelineContextMenu(){
	var cmenu = document.getElementById('TIMELINE_CONTEXTMENU');
	if ( cmenu != null ){
		cmenu.parentNode.removeChild( cmenu );
	}

}

//
//	選択したタイムラインにすでにコンテキストメニューが開いているかをチェック
//
function alreadyTimelineContextMenu( o ){
	var cmenu = document.getElementById('TIMELINE_CONTEXTMENU');
	if ( cmenu != null ){
		if ( o == cmenu.parentNode ) return true;
	}
	return false;


}

//
//	タイムライン・バー操作
//
var tlx = null;
var tlbOffset = null;
var tl_drag = false;
function locateTimelinebar( e ){
	e.preventDefault();

	var wbf = document.getElementById('WHITEBOARD_FRAME');
	var wb = document.getElementById('WHITEBOARD');
	var itb = document.getElementById('ID_TIMELINE_BAR');
	switch ( e.type ){
		case 'touchstart':
		case 'mousedown':
			if(e.type == "mousedown" ) {
				var event = e;
			} else {
				var event = e.changedTouches[0];
			}
			if ( itb != e.target ) return;
			if ( tlbOffset == null ) tlbOffset = e.target.offsetTop;
			//e.target.position = 'absolute';
			tlx = event.pageY - e.target.offsetTop;
			tl_drag = true;
//			console.log('tlx:' + tlx );
//			console.log( 'offsetTop' + e.target.offsetTop );
			break;
		case 'touchmove':
		case 'mousemove':
			if ( tlx == null ) return;
			if ( e.target != itb ) return;
			if ( !tl_drag ) return;
			if(e.type == "mousemove" ) {
				var event = e;
			} else {
				var event = e.changedTouches[0];
			}
			//console.log( e.target.offsetTop + ':' + tlbOffset );
			if ( ( event.pageY - tlx ) >= tlbOffset + 0 
				&& ( event.pageY - tlx ) <= tlbOffset + 144 ){
				itb.style.top = event.pageY - tlx + "px";
				var cur_time = ( 60 * 8 ) + ((event.pageY - tlx) * 5) - ( 60 * 28 ) - 20;
				var cur_time2 = ('00' + Math.floor( cur_time / 60 ) ).slice(-2)
								+ ':' + ( '00' + ( cur_time - Math.floor( cur_time / 60 ) * 60 )).slice(-2);
				itb.innerText = cur_time2;
			//	scrollWhiteboard( Math.floor( cur_time / 60 ) );
			} else {
				//console.log( 'other:' + e.target.offsetTop + ':' + tlbOffset );
			}
			break;
		case 'mouseup':
		case 'touchend':
			tl_drag = false;
			tlx = null;
			break;
	}
}

//
//	タイムライン・バーに連動してホワイトボードをスクロール
//
function scrollWhiteboard( hour ){
	var wbt = document.getElementById('WHITEBOARD_TIMELINE');
	var wb  = document.getElementById('WHITEBOARD');
	wbt.style.top = 0 - ( ( hour - 8 ) * 400  ) - 0 + 'px';
	wb.style.top  = 0 - ( ( hour - 8 ) * 400  ) - 4802 + 'px';
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
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
		r += 'open whiteboard';
	r += '</div>';
	r += '<div style="margin:0 auto;width:110px;">';
		r += '<form name="guidedance_whiteboard_form" onsubmit="return false;" >';
		r += '<div>Date:</div>';
		r += '<div style="padding-bottom:20px;" >';
		r += '<input type="text" id="whiteboard_day" name="day" style="width:96px;" value="' + ymd + '" />';
		r += '</div>';
		r += '</form>';
		r += '<div style="text-align:center;padding-top:40px;" >';
		r += '<button id="BTN_OPENWHITEBOARD" ';
		r += ' style="width:140px;height:60px;font-size:20px;background-color:transparent;border:none;background-image:url(./images/next.png);background-size:50px;background-repeat:no-repeat;background-position:left center;" ';
		r += ' onclick="createWhiteboard()" >';
		// r += '<img width="50px;" src="./images/next.png" >';
			r += 'Next...';
		r += '</button>';
		r += '</div>';
	r += '</div>';
	neverCloseDialog = true;
	openModalDialog( r, 'NOBUTTON' );
	document.getElementById('whiteboard_day').focus();
	document.getElementById('whiteboard_day').addEventListener('keydown',
		function (e){
			if ( e.keyCode == 13) // Enter key
				createWhiteboard();
		});
	
}

//
//	ホワイトボード作成
//
function createWhiteboard(){
	var target_day = guidedance_whiteboard_form.day.value;
	var cwd = document.getElementById('CUR_WHITEBOARD_DAY');
	dayWhiteboard = target_day;
	cwd.innerText = target_day;
	createWhiteboardHelper( dayWhiteboard );
	//alert( target_day );
	neverCloseDialog = false;
	closeModalDialog();
	visibleWhiteboard();
	loadWhiteboard();

}

//
//	ホワイトボードIDをデータベースに登録する
//
function createWhiteboardHelper( day ){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/whiteboardadd", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'day=' + day );
}

function alreadyExistChildOnWhiteboard( id ){
	var rc = false;
	var wb = document.getElementById('WHITEBOARD');
/*
	for ( var i=0; i<wb.childNodes.length; i++ ){
		if ( wb.childNodes[i].tagName.toLowerCase() == 'div' ){
			if ( wb.childNodes[i].getAttribute('child_id') == id )
				return true;
		}
	}
*/
	var children = wb.getElementsByClassName('CHILD');
	for ( var i=0; i<children.length; i++ ){
		if ( children[i].getAttribute('child_id') == id )
			return true;
	}
	return rc;
}

//
//	ホワイトボードをロードする
//
function loadWhiteboard(){
	var day = dayWhiteboard;
	var wb = document.getElementById('WHITEBOARD');
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/whiteboardload", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'day=' + day );
	if ( xmlhttp.status == 200 ){
		var result = JSON.parse( xmlhttp.responseText );
		if ( result != null ){
			//alert( result.whiteboard );
			wb.innerHTML = result.whiteboard;
			//
			//	チャイルドにイベントハンドラを割り当てる 
			//
			for ( var i=0; i<wb.childNodes.length; i++ ){
//				wb.childNodes[i].addEventListener( 'dblclick',   propertyWhiteboardChild, false );
				wb.childNodes[i].addEventListener( "mousedown",  mDown, false );
				wb.childNodes[i].addEventListener( "touchstart", mDown, false );
			}
			showWhiteboardChildCount();
		}	
	} else alert(http.status);

}

//
//	ホワイトボードを保存する
//
function saveWhiteboard(){
	var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
		r += 'save whiteboard';
	r += '</div>';
	r += "<div id='SIGNIN_STATUS' style='height:20px;text-align:center;' >status</div>";
	r += '<div style="margin:0 auto;width:110px;">';
		r += '<form name="guidedance_whiteboard_form" onsubmit="return false;" >';
		r += '<div>Date:</div>';
		r += '<div style="padding-bottom:20px;" >';
		r += '<input type="text" id="whiteboard_day" name="day" style="width:96px;" readonly value="' + dayWhiteboard + '" />';
		r += '</div>';
		r += '</form>';
		r += '<div style="height:50px;border:1px solid gray;" >';
		r += '</div>';
		r += '<button id="BTN_SAVEWHITEBOARD" type="button"  style="width:100px;height:20px;font-size:12px;" onclick="saveWhiteboardHelper();" >Save</button>';
	r += '</div>';
	openModalDialog( r, 'NOBUTTON' );
}

//
//	ホワイトボードを保存するヘルパー
//
function saveWhiteboardHelper(){
	var day = dayWhiteboard;
	var wb = document.getElementById('WHITEBOARD');
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/whiteboardupdate", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'day=' + day + '&html=' + encodeURIComponent( wb.innerHTML ) );

	closeModalDialog();
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

//
//	ホワイトボード自体のドラッグ操作
//
function locateWhiteboard( e ){
	e.preventDefault();
	var wb = document.getElementById('WHITEBOARD');
	switch ( e.type ){
		case 'mousedown':
			if ( document.getElementById('WHITEBOARD') != e.target ) return;
			e.target.position = 'absolute';
			wbx = event.pageX - e.target.offsetLeft;
			wby = event.pageY - e.target.offsetTop + 42 + 4802;
			console.log('event.pageY:', event.pageX );
			console.log('WHITEBOARD top:' + wb.style.top );
			console.log('WHITEBOARD offsetTop:' + e.target.offsetTop );
			break;
		case 'mousemove':
/*
			if ( document.getElementById('WHITEBOARD') != e.target ) return;
			if ( e.buttons & 1 ){
				document.getElementById('WHITEBOARD').style.top  = event.pageY - wby + "px";
			//	document.getElementById('WHITEBOARD').style.left = event.pageX - wbx + "px";
			}
*/
			break;
		case 'mouseup':
			if ( document.getElementById('WHITEBOARD') == e.target )	resetChildMark();
			break;
	}
}

//
//	キーボード操作
//
function keyWhiteboard(e){
	//e.preventDefault();
	var icc = document.getElementById('ID_CHILD_COORDINATE' );
	icc.innerText = 'Key:' + e.keyCode + ' tag:' + e.target.tagName;
	switch ( e.keyCode ){
		case 46:	//Delete
			var children = getMarkedChild();
			if ( children.length != 0)
				deleteWhiteboardChild('MARK');		//マークしたチャイルドの削除操作 
			break;
		case 27:	//ESC
			var mo  = document.getElementById('MODAL_OVERLAY');
			if ( mo.style.visibility == 'visible')
				closeModalDialog();
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
//	ホワイトボードエリアのフィッティング処理
//
function fitting(){
	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;
	var wbf = document.getElementById('WHITEBOARD_FRAME');
	wbf.style.height = ( h - 42 - 30 ) + 'px';

	var wb = document.getElementById('WHITEBOARD');
//	wb.style.width   = ( w - 70 ) + 'px';

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
	var wbf = document.getElementById('WHITEBOARD_FRAME');
	var wpf = document.getElementById('WHITEBOARD_PALLETE_FRAME');
	var left = parseInt( wpf.style.left );
	//console.log(left);
	//alert( '[' + cpf.style.marginLeft + ']' );
	if ( left < 0 || isNaN(left ) ){
		wpf.style.left = '0px';				//	open pallete
		wbf.style.paddingLeft = '170px';
		flagWhiteboardPallete = true;
	} else {
		wpf.style.left = '-170px';			// close pallete
		wbf.style.paddingLeft = '0px';
		flagWhiteboardPallete = false;
	}
}

//
//	ホワイトボードパレット強制クローズ
//
function closeWhiteboardPallete(){
	var wbf = document.getElementById('WHITEBOARD_FRAME');
	var wpf = document.getElementById('WHITEBOARD_PALLETE_FRAME');
	wpf.style.left = '-170px';
	wbf.style.paddingLeft = '0px';
	flagWhiteboardPallete = false;
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
		cpf.style.marginLeft = '-170px';	// open pallete
		flagChildrenPallete = true;
	} else {
		cpf.style.marginLeft = '0px';		// close pallete
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
	var wbb      = document.getElementById('WHITEBOARD_BAY');
//	var acc      = document.getElementById('ACCOUNTS');
//	var children = document.getElementById('CHILDREN');
	if ( checkSign()) {
		tb.style.visibility     = 'visible';
		wbf.style.visibility    = 'visible';
		status.style.visibility = 'visible';
		wbb.style.visibility	= 'visible';
//		acc.style.visibility	= 'visible';
//		children.style.visibility= 'visible';
	} else {
		tb.style.visibility     = 'hidden';
		wbf.style.visibility    = 'hidden';
		status.style.visibility = 'hidden';
		wbb.style.visibility	= 'hidden';
//		acc.style.visibility	= 'hidden';
//		children.style.visibility= 'hidden';
	}
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
function postWebBackend( area_id ){
	var r = "";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var o = document.getElementById('area_id');
			o.style.visibility = 'visible';
			r += "<pre>";
			r += xmlhttp.responseText;
			r += "</pre>";
			r += "<button onclick='' >OK</button>";
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
	hiddenWhiteboard();
	closeWhiteboardPallete();
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
/*
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
								clearWhiteboard();
								makeWhiteboardPalleteList();
								makeChildrenPalleteList();
							} else {
								r += 'sign in error'
							}
							o.innerText = r;
							break;
						default:
							alert( 'cmd:' + result );
							break;
					}
				} else{
					alert( xmlhttp.status );
				}
				break;
		}
	}
*/
	try{
		var sign_id = sign_form.id.value;
		var sign_pwd = sign_form.pwd.value;
		xmlhttp.open("POST", "/accounts/signin", false );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( "acc=" + sign_id + "&pwd=" + sign_pwd );
		r = "";
		if ( xmlhttp.status == 200 ){
			var result = JSON.parse( xmlhttp.responseText );
			//r += xmlhttp.responseText;
			switch( result.cmd ){
				case 'signin':
					var o = document.getElementById('SIGNIN_STATUS');
					if ( result.status == 'SUCCESS' ){
						ctlToolbar();
						clearWhiteboard();
						makeWhiteboardPalleteList();
						makeChildrenPalleteList();
						if ( !openWhiteboard ){
							hiddenWhiteboard();
							showGuidanceWhiteboard();
						}
				
					} else {
						r += 'sign in error'
					}
					o.innerText = r;
					break;
				default:
					alert( 'cmd:' + result );
					break;
			}
		} else{
			alert( xmlhttp.status );
		}

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
	o.style.top             = '8px';
	o.style.left            = '-91px';
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
//	r += '<div id="ID_LOAD_CHILDREN"    style="height:20px;padding:2px;" >load...</div>';
	r += '<div id="ID_CLEAR_WHITEBOARD" style="height:20px;padding:2px;" >clear whiteboard</div>';
	r += '<div id="ID_CURRENT_ACCOUNT"  style="height:20px;padding:2px;" >sign in ' + id + '</div>';
	m.innerHTML = r;

	new Button( 'ID_SIGN_OUT', signout ).play();
	new Button( 'ID_PROPERTY_ACCOUNT', propertyAccount ).play();
//	new Button( 'ID_LOAD_CHILDREN',     loadChildrenForm ).play();
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
		// r += "<div id='OPAQUESHAFT_LOGINTITLE' >";
		// r += "&nbsp;&nbsp;OpaqueShaft";
		// r += "</div>"; 
		r += "<div style='height:40px;padding-top:20px;text-align:center;font-size:20px;' >Sign in to your account</div>";
		r += "<div id='SIGNIN_STATUS' style='height:20px;text-align:center;' >status</div>";
		r += "<div style='margin:10px auto;width:210px;' >";
			r += "<form name='sign_form' onsubmit='return false;' >";
			r += "<div>ID:</div>";
			r += "<div><input style='width:200px;' type='text' id='acc_id' name='id' tabindex=1 /></div>";
			r += "<div style='padding-top:20px;' >Password:</div>";
			r += "<div><input style='width:200px;height:18px;' type='password' name='pwd' tabindex=2 /></div>";
			r += "<div style='padding-top:20px;text-align:center;' >";
				r += "<button style='background-color:transparent;border:none;' onclick='sign()' ><img width='50px;' src='/images/arrow-right.png' ></button>";
			r += "</div>";
			r += "</form>";
		r += "</div>";
		r += "<div style='padding-top:20px;text-align:center;' >";
			r += "created by MASATO.NAKANISHI. 2020"
		r += "</div>";
	r += "</div>";

	neverCloseDialog = true;
	openModalDialog( r, 'NOBUTTON' );
	o = document.getElementById( 'acc_id' );
	o.focus();
	
}

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
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				var o = document.getElementById( 'WHITEBOARD_PALLETE_CONTENT' );
				o.innerText = 'access...';
				break;
			case 4://done
				r = "";
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					//r += xmlhttp.responseText;
					var o = document.getElementById('WHITEBOARD_PALLETE_CONTENT');
					o.innerText = '';
					for ( var i=0; i<result.length; i++ ){
						addWhiteboardManage( o, result[i] );
					}
					//o.innerHTML = r;
				} else{
					document.getElementById('WHITEBOARD_PALLETE_CONTENT').innerText = xmlhttp.status;
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/whiteboardlist", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send();

	} catch ( e ) { alert( e );}

}

//
//	ホワイトボードリスト用DIV生成
//
function addWhiteboardManage( oParent, Result ){

	var c = document.createElement("DIV");
    c.setAttribute("whiteboard_id",  Result.child_id );
//    c.setAttribute("draggable", "true");
//    c.style.width       = '97%';
	c.style.backgroundColor	= 'white';
	// c.style.width = '80px';
	c.style.height			= '30px';
	c.style.marginBottom	= '1px';

	var day = new Date( Result.day );
	var ymd = day.getFullYear() + '/' + ( '00' + (day.getMonth() + 1 ) ).slice(-2) + '/' + ( '00' + day.getDate() ).slice(-2);

	var r = '';
    r += '<div style="height:20px;padding-left:2px;">';
    r += ymd;
    r += '</div>';
	c.innerHTML = r;
    var cc = oParent.appendChild( c );

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
			c.style.color			= 'gray';
			c.style.backgroundColor = '#EEEEEE';
			c.setAttribute('selected', 'yes' );
			palleteTimeSelector.open();
			//ctlTimelineSelector( 'open', null );
		} else {
			c.style.color			= '';
			c.style.backgroundColor = '';
			c.removeAttribute('selected' );
			var cpc = document.getElementById('CHILDREN_PALLETE_CONTENT');
			var c_selected = 0;
			for ( var i=0; i<cpc.childNodes.length; i++ ){
				if ( cpc.childNodes[i].hasAttribute('selected') )
					c_selected++;
			}
			console.log('c_selected:' + c_selected );
			if ( c_selected == 0 ){
				palleteTimeSelector.close();
				// ctlTimelineSelector('close', null );
				}
	
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
		palleteTimeSelector.close();
		// ctlTimelineSelector('close', null );

	}
}

//
//	パレット内のマークしたチャイルドをホワイトボードにドラッグ
//
/*
function dragPalleteChild(){
	var cpc = document.getElementById('CHILDREN_PALLETE_CONTENT');
	var itb = document.getElementById('ID_TIMELINE_BAR');
	var hm  = itb.innerText;
	var arHM = hm.split(':');
	
//	var escort = document.getElementById('CPC_ESCORT_CHILD').getAttribute('flag');

	var cursor = 0;
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
				cursor++;
			}
			cpc.childNodes[i].style.color = '';
			cpc.childNodes[i].style.backgroundColor = '';
			cpc.childNodes[i].removeAttribute('selected');
		}
	}
	showWhiteboardChildCount();

}
*/

//
//	パレット内のマークしたチャイルドをホワイトボードにドラッグ2
//
function dragPalleteChild2( hm ){
	var cpc = document.getElementById('CHILDREN_PALLETE_CONTENT');
	var arHM = hm.split(':');
	
	var cursor	= 0;
	var top		= ( parseInt( arHM[0] ) - 8 ) * 400;
	var left	= ( parseInt( arHM[1] ) );
	console.log( 'hm:' + hm );
	console.log( 'top:' + top + ' left:' + left );

	for ( var i=0; i<cpc.childNodes.length; i++ ){
		if ( cpc.childNodes[i].getAttribute('selected') != null ){
			var id = cpc.childNodes[i].getAttribute('child_id');
			if ( alreadyExistChildOnWhiteboard( id ) ) continue;
			var oChild = getChild( id );
			if ( oChild != null ){
				addChild( top + ( cursor * 20 ), left + ( cursor * 1 ), oChild.child_id, oChild.child_name, oChild.child_type, oChild.child_grade );
				cursor++;
			}
			cpc.childNodes[i].style.color = '';
			cpc.childNodes[i].style.backgroundColor = '';
			cpc.childNodes[i].removeAttribute('selected');
		}
	}
	showWhiteboardChildCount();

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
//	ホワイトボードの座標から時間軸への変換
//
function coordinateToTime( top, left ){
	var escort = Math.floor( left / criteriaEscortPixel );
	var left2  = left - ( escort * criteriaEscortPixel );
	var h = 8 + Math.floor( top / 400 );		//200px:1hour
	var m = Math.floor( left2 / 400 ) * 15;		// 210px:15min
	if ( m <= 0  ) m = 0;
	if ( m >= 15 ) m = 15;
	return ( '00' + h ).slice(-2) + ('00' + m ).slice(-2);
}

//
//	ホワイトボードの座標からエスコート（お迎え）判断
//
function coordinateToEscort( top, left ){
	var escort = Math.floor( left / criteriaEscortPixel );
	return ( escort > 0 )?true:false;
}

//
//	タイムラインガイド操作
//
function makeTimelineContextMenu( id ){
	var p = document.getElementById( id );
	p.addEventListener( 'mouseup',
		function(e){
			var m = document.createElement('DIV');
			m.setAttribute('cmenu', 'yes');
			m.style.position 		= 'absolute';
			m.style.top				= '0px';
			m.style.left			= '20px';
			m.style.width			= '100px';
			m.style.height			= '70px';
			m.style.color			= 'white';
			m.style.backgroundColor	= 'red';
			m.style.textAlign		= 'left';
			m.style.border			= '1px solid lightgrey';
			m.style.writingMode		= 'horizontal-tb';
			var r = '';
			r += '<div>Move...</div>';
			r += '<div>Checkout...</div>';
			m.innerHTML				= r;
			var mm = p.appendChild(m);

		});
		p.addEventListener( 'mouseleave',
		function(e){
			var c = this.lastChild;
			if ( c.hasAttribute('cmenu'))
				this.removeChild(c);
		});

}


//
//	チャイルド操作
//
function mDown( e ) {

		curChild = this;
		//console.log( this.style.top + ',' + this.style.left );
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
		
		var icc = document.getElementById('ID_CHILD_COORDINATE');
		icc.innerText = curChild.style.top + ' x ' + curChild.style.left;

        //ムーブイベントにコールバック
        document.body.addEventListener("mousemove", mMove, false);
        document.body.addEventListener("touchmove", mMove, false);	
        //マウスボタンが離されたとき、またはカーソルが外れたとき発火

		curChild.addEventListener("mouseup", mUp, false);
        document.body.addEventListener("mouseleave", mUp, false);
        curChild.addEventListener("touchend", mUp, false);
		document.body.addEventListener("touchleave", mUp, false);

		// エスコートガイド表示		
		var tri = document.createElement('DIV');
		tri.setAttribute('id', 'ESCORT_GUIDE');
		tri.style.top    = '42px';
		tri.style.left   = ( criteriaEscortPixel + 50 - 18 ) + 'px';
		tri.style.width  = '40px';
		tri.style.height = '40px';
		tri.style.backgroundImage 		= 'url(./images/arrow-down.png)';
		tri.style.backgroundSize 		= '30px';
		tri.style.backgroundPosition 	= 'center center';
		tri.style.backgroundRepeat 		= 'no-repeat';
		tri.style.position 				= 'absolute';
		tri.style.zIndex 				= 4000;
		document.body.appendChild( tri );

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

		//チェックアウト(checkout)しているチャイルドは対象外
		if ( drag.hasAttribute('checkout')) return;

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
		if ( e.type == 'touchmove' 
		    || (( e.buttons & 1 ) && e.type == 'mousemove' ) ){
			var old_top  = parseInt( drag.style.top  );
			var old_left = parseInt( drag.style.left );
			if ( ( event.pageY - y ) < 0 || ( event.pageX - x ) < 0 ) return;
			if ( !checkOtherChildCoordinate( drag, event.pageX - x, event.pageY - y ) ) return;
			drag.style.top  = event.pageY - y + "px";
			drag.style.left = event.pageX - x + "px";
			// delta_x = parseInt( drag.style.left ) - old_left;
			// delta_y = parseInt( drag.style.top  ) - old_top;
			 delta_x = ( event.pageX - x ) - old_left;
			 delta_y = ( event.pageY - y ) - old_top;
			moveOtherChild( drag, delta_x, delta_y );

			var co = drag.getElementsByClassName('CO_TIME');
			if ( co != null ){
				var hm = coordinateToTime( parseInt( drag.style.top ),parseInt( drag.style.left ));
				co[0].innerText = hm;
			}
			var escort = coordinateToEscort( parseInt( drag.style.top ), parseInt( drag.style.left ) );
			switch ( escort ){
				case true:
					drag.setAttribute('escort', 'yes');
					setEscortHelper( drag, 'ON' );
					break;
				case false:
					drag.removeAttribute('escort');
					setEscortHelper( drag, 'OFF' );
		
					break;
			}
		}

		var icc = document.getElementById('ID_CHILD_COORDINATE');
		icc.innerText = curChild.style.top + ' x ' + curChild.style.left;

        //マウスボタンが離されたとき、またはカーソルが外れたとき発火
/*
        drag.addEventListener("mouseup", mUp, false);
        document.body.addEventListener("mouseleave", mUp, false);
        drag.addEventListener("touchend", mUp, false);
        document.body.addEventListener("touchleave", mUp, false);
*/
}

//
//	他のチャイルドの座標をチェック
//
function checkOtherChildCoordinate( base_child, x, y ){
	var children = getMarkedChild();
	if ( children.length == 0 ) return true;
	for ( var i=0; i<children.length; i++ ){
		if ( base_child != children[i]){
			if ( parseInt( children[i].style.top )  + y < 0
			 || parseInt( children[i].style.left ) + x < 0 ) return false;
		}
	}
	return true;

}
//
//	マークしている他のチャイルドも移動
//
function moveOtherChild( base_child, x, y ){
	var children = getMarkedChild();
	if ( children.length == 0 ) return;
	for ( var i=0; i<children.length; i++ ){
		if ( base_child != children[i]){
			if ( ! children[i].hasAttribute('checkout')){
				children[i].style.top  = parseInt( children[i].style.top )  + y + 'px';
				children[i].style.left = parseInt( children[i].style.left ) + x + 'px';
				var co = children[i].getElementsByClassName('CO_TIME');
				if ( co != null ){
					var hm = coordinateToTime( parseInt( children[i].style.top ),
												parseInt( children[i].style.left ));
					co[0].innerText = hm;
				}

				var escort = coordinateToEscort( parseInt( children[i].style.top ), parseInt( children[i].style.left ) );
				switch ( escort ){
					case true:
						children[i].setAttribute('escort', 'yes');
						setEscortHelper( children[i], 'ON' );
						break;
					case false:
						children[i].removeAttribute('escort');
						setEscortHelper( children[i], 'OFF' );
			
						break;
				}
	
			}

		}
	}
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
					if ( existContextMenu( curChild ) ){
						console.log('existContextMenu');
						unmarkChild( curChild );
					} else {
							if ( !existContextMenu( curChild)){
								clearOtherContextMenu( curChild );
								makeContextMenu();
							}
						}
				}else {
					markChild( curChild );
					clearOtherContextMenu( curChild );
					// コンテキストメニュー
					makeContextMenu();
/*
					var cMenu = document.createElement('DIV');
					cMenu.setAttribute('class', 'CHILD_CONTEXTMENU' );
					cMenu.setAttribute('cmenu', 'yes');
					cMenu.style.position	= 'absolute';
					cMenu.style.top			= '-1px';
					cMenu.style.left		= (curChild.offsetWidth - 1) + 'px';
					var menu = curChild.appendChild( cMenu );
					var contextFunc = [ checkoutChild, WhiteboardChild, propertyWhiteboardChild  ];
					var r = '';
					r += '<div id="CM_CHECKOUT"  >checkout</div>';
					r += '<div id="CM_DELETE"    >delete...</div>';
					r += '<div id="CM_PROPERTY"  >Property...</div>';
					menu.innerHTML = r;
					
					var c = menu.firstChild;
					c.addEventListener('mouseup',
						function(e){
							e.stopPropagation();
							console.log('checkout');
							contextFunc[0]();
						});
					c = c.nextSibling;
					c.addEventListener('mouseup',
						function(e){
							e.stopPropagation();
							console.log('delete');
							contextFunc[1]();
						});
					c = c.nextSibling;
					c.addEventListener('mouseup',
						function(e){
							e.stopPropagation();
							console.log('property');
							contextFunc[2](curChild);
						});
					menu.addEventListener('mouseover',
					function(e) {
						e.stopPropagation();
						var c = e.target;
						if ( c != menu ){
							c.style.color			= 'gray';
							c.style.backgroundColor = '#EEEEEE';
						}
					} );
					menu.addEventListener('mouseout',
					function(e) {
						e.stopPropagation();
						var c = e.target;
						if ( c != menu ){
							c.style.color			= '';
							c.style.backgroundColor = '';
						}
					} );
					// menu.addEventListener('mouseleave',
					// function(e) {
					// 	e.stopPropagation();
					// 	this.parentNode.removeChild(menu);
					// } );
*/
				}
			}
		} 
	}

	var icc = document.getElementById('ID_CHILD_COORDINATE');
	icc.innerText = '';

	if ( curChild != null ) curChild.style.zIndex = '';
	curChildMoved         = false;
	curChild              = null;

	// エスコートガイド消去
	var eg = document.getElementById('ESCORT_GUIDE');
	if ( eg != null )
		eg.parentNode.removeChild( eg );

}

//
//	コンテキストメニューの作成
//
function makeContextMenu(){
	var cMenu = document.createElement('DIV');
	cMenu.setAttribute('class', 'CHILD_CONTEXTMENU' );
	cMenu.setAttribute('cmenu', 'yes');
	cMenu.style.position	= 'absolute';
	cMenu.style.top			= '-1px';
	cMenu.style.left		= (curChild.offsetWidth - 1) + 'px';
	var menu = curChild.appendChild( cMenu );
	propChild = curChild;		//	カレントのチャイルドを設定

	var contextFunc = [ checkoutWhiteboardChild, deleteWhiteboardChild, propertyWhiteboardChild  ];
	var r = '';
	r += '<div class="CM_CHECKOUT"  >checkout</div>';
	r += '<div class="CM_DELETE"    >delete...</div>';
	r += '<div class="CM_PROPERTY"  >Property...</div>';
	menu.innerHTML = r;
	var c = menu.firstChild;
	c.addEventListener('mouseup',
		function(e){
			e.stopPropagation();
			console.log('checkout');
			contextFunc[0]('SINGLE');
		});
	c = c.nextSibling;
	c.addEventListener('mouseup',
		function(e){
			e.stopPropagation();
			console.log('delete');
			contextFunc[1]('SINGLE');
		});
	c = c.nextSibling;
	c.addEventListener('mouseup',
		function(e){
			e.stopPropagation();
			console.log('property');
			contextFunc[2](curChild);
		});
	menu.addEventListener('mouseover',
	function(e) {
		e.stopPropagation();
		var c = e.target;
		if ( c != menu ){
			c.style.color			= 'gray';
			c.style.backgroundColor = '#EEEEEE';
		}
	} );
	menu.addEventListener('mouseout',
	function(e) {
		e.stopPropagation();
		var c = e.target;
		if ( c != menu ){
			c.style.color			= '';
			c.style.backgroundColor = '';
		}
	} );
	// menu.addEventListener('mouseleave',
	// function(e) {
	// 	e.stopPropagation();
	// 	this.parentNode.removeChild(menu);
	// } );

}
//
//	チャイルドのマークをリセット
//
function resetChildMark(){
	var wb = document.getElementById('WHITEBOARD');
/*
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
*/
	var children = wb.getElementsByClassName('CHILD');
	if ( children == null ) return;
	for ( var i=0; i<children.length; i++ ){
		unmarkChild( children[i]);
		// if ( children[i].getAttribute('marked') == 'MARKED') {
		// 	children[i].style.backgroundColor = '';
		// 	children[i].style.color 			= '';
		// 	children[i].removeAttribute('marked');
		// }
	}

}
