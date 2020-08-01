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

var wb_touch_cnt		= 0;
var wb_touch_cnt_max	= 0;

var oNav	= null;

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
	var wbf = document.getElementById('WHITEBOARD_FRAME');
	wbf.addEventListener('scroll',
		function(e){
			//return false;
			 if ( curChildMoved )
				 e.preventDefault();
			document.getElementById('ID_ON_SCROLL').innerText = 'scroll:' + e.target.scrollTop;
		});

	var wb = document.getElementById('WHITEBOARD');
//  touchmoveを抑制すると返って使いづらいので抑制はしないよ！ 
//	wb.addEventListener("touchmove",
//	 function( e ) { e.preventDefault(); }, { passive:false } );
//	wb.addEventListener('selectstart', function(e){return false;})

	// iPadでドラッグできなくなるのでコメント
	// var cpf = document.getElementById('CHILDREN_PALLETE_FRAME');
	// cpf.addEventListener("touchmove",
	//  function( e ) { e.preventDefault(); }, { passive:false } );
	//  var wpf = document.getElementById('WHITEBOARD_PALLETE_FRAME');
	//  wpf.addEventListener("touchmove",
	//   function( e ) { e.preventDefault(); }, { passive:false } );
 

	wb.addEventListener( evtStart,    		locateWhiteboard, { passive : false } );
	wb.addEventListener( evtMove,     		locateWhiteboard, { passive : false } );
	wb.addEventListener( evtEnd,      		locateWhiteboard, { passive : false } );
	document.addEventListener('keydown',	keyWhiteboard );


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
			// var itb = document.getElementById('ID_TIMELINE_BAR');
			// var hm  = itb.innerText;
			// var arHM = hm.split(':');

			var p = e.target.parentNode;
		
			var oChild = getChild(id);
			//var escort = document.getElementById('CPC_ESCORT_CHILD').getAttribute('flag');
//			addChild( ( arHM[0] - 8 ) * 100, arHM[1] * 160, oChild.child_id, oChild.child_name, oChild.child_type,oChild.child_grade );
			addChild( e.pageY - e.target.offsetTop - dndOffsetY + wb.parentNode.scrollTop - wb.parentNode.offsetTop,
				 e.pageX - e.target.offsetLeft - p.offsetLeft - dndOffsetX + wb.parentNode.scrollLeft,
				 oChild.child_id, oChild.child_name, oChild.child_type,oChild.child_grade );
			dndOffsetX = 0;
			dndOffsetY = 0;
			showWhiteboardChildCount();
		});

	//
	//	ホワイトボードパレットのイベント登録
	//	
	// var wpc = document.getElementById('WHITEBOARD_PALLETE_CONTENT');
	//wpc.addEventListener('dblclick',  selectWhiteboard );
	//wpc.addEventListener('mouseup',   markPalleteWhiteboard );

	//
	//	チルドレンパレットのイベント登録
	//	
	var cpc = document.getElementById('CHILDREN_PALLETE_CONTENT');
	// cpc.addEventListener('dblclick',  selectChild );
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

	oNav = new Nav( null );

	fitting();
	new Button( 'SIGN_STATUS',              signMenu       ).play();
	new Button( 'WHITEBOARD_DAY_FRAME',     whiteboardMenu ).play();
	new Button( 'ID_NAV',                   ctlNav         ).play();
	new Button( 'NAV_START_ICON',			ctlNav         ).play();
	new Button( 'CHILDREN_PALLETE_TAB',     foldingChildrenPallete ).play();
	new Button( 'CPC_RELOAD',               makeChildrenPalleteList ).play();
	new Button( 'CPC_ADD_CHILD',            newChildForm ).play();
	// new Button( 'CPC_DND_CHILD',            dragPalleteChild ).play();
	// new Button( 'ID_CHILD_DELETE',          deleteWhiteboardMarkChild ).play();
	// new Button( 'ID_CHILD_CHECKOUT',        checkoutWhiteboardMarkChild ).play();
	// new Button( 'ID_CHILD_CHECKCLEAR',      checkoutClearWhiteboardMarkChild ).play();
	new Button( 'ID_SHEET_ESCORT',          turnWhiteboard ).play();
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

	//
	//	タイムセレクタ初期化
	//
	palleteTimeSelector = new TimeSelector( dragPalleteChild );
	palleteTimeSelector.play();


	ctlToolbar();
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
/*
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
*/

	//
	//	タイムラインインジケータの生成
	//
	makeTimelineIndicator();

	//
	//	エスコートエリアの位置マーカーの生成
	//
	var eam = document.getElementById('ESCORT_AREA_MARKER');
	eam.style.left   = ( criteriaEscortPixel + 42 ) + 'px';


	//
	//	タイムラインバー初期化
	//
	var tmb = document.getElementById('ID_TIMELINE_BAR');
	tmb.addEventListener( evtStart,    		locateTimelinebar, { passive : false } );
	tmb.addEventListener( evtMove,     		locateTimelinebar, { passive : false } );
	tmb.addEventListener( evtEnd,      		locateTimelinebar, { passive : false } );

	// tmb.addEventListener( 'mousedown',  locateTimelinebar );
	// tmb.addEventListener( 'touchstart', locateTimelinebar );
	// tmb.addEventListener( 'mousemove',  locateTimelinebar );
	// tmb.addEventListener( 'touchmove',  locateTimelinebar );
	// tmb.addEventListener( 'mouseup',    locateTimelinebar );
	// tmb.addEventListener( 'touchend',   locateTimelinebar );

}

//
//	タイムラインインジケータの生成
//
function makeTimelineIndicator(){
	var wbt = document.getElementById('WHITEBOARD_TIMELINE');
	arTL = [ '08:00', '09:00', '10:00', '11:00', '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00' ];
	for ( var i=0; i<arTL.length; i++ ){
		var o = document.createElement('DIV');
		o.setAttribute('class', 'timeline_class' );
		o.innerText = arTL[i];
		wbt.appendChild( o );
	}

}
//
//	タイムセレクタのプロトタイプ
//
function TimeSelector( func ){
	this.frame 			= null;
	this.selector		= null;
	this.func			= func;
	this.touchdevice	= null;
	this.evtStart		= null;
	this.evtMove		= null;
	this.evtEnd			= null;
	this.current		= null;
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
		console.log('touch device:' + this.touchdevice);
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
				var o = ( this.touchdevice )? e.changedTouches[0].target: e.target;
				while( true ){
					if ( this.selector == o.parentNode) break;
					 else o = o.parentNode;
				}
				if ( o.hasAttribute('target')){
					this.current = o;
					o.style.backgroundColor	= 'darkred';
					if ( o.getAttribute('target') == 'on' )
						document.getElementById('WHITEBOARD_FRAME').scrollTop = (parseInt( o.innerText ) - 8 ) * 400;
				}
			}).bind(this), false );
		this.selector.addEventListener( this.evtMove,		//	mousedown/touchstart
			(function(e){
				var o = ( this.touchdevice )? e.changedTouches[0].target: e.target;
				while( true ){
					if ( this.selector == o.parentNode) break;
						else o = o.parentNode;
				}
				if ( o.hasAttribute('target')){
					this.current = o;
					o.style.backgroundColor	= 'darkred';
					if ( o.getAttribute('target') == 'on' )
						document.getElementById('WHITEBOARD_FRAME').scrollTop = (parseInt( o.innerText ) - 8 ) * 400;
				}
			}).bind(this), false );
		if ( !this.touchdevice ){
			this.selector.addEventListener('mouseout',
				( function(e){
					var o = e.target;
					while( true ){
						if ( this.selector == o.parentNode) break;
						 else o = o.parentNode;
					}
					if ( o.hasAttribute('target'))
						o.style.backgroundColor	= '';
				} ).bind( this ), false );
		}

		this.selector.addEventListener( this.evtEnd,	// mouseup/touchend
			( function(e){
				var o = ( this.touchdevice ) ? this.current : e.target;
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
		for ( var i=0; i<this.selector.childNodes.length; i++ ){
			var o = this.selector.childNodes[i];
			if ( 'hasAttribute' in o ){
				//if ( o.hasAttribute('target') )
					o.style.backgroundColor = '';
			}
		}
	},
	close : function(){
		this.frame.style.visibility = 'hidden';
	},
	opened : function(){
		return ( this.frame.style.visibility == 'visible' );
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
			//console.log( event.pageY - tlx );
			if ( ( event.pageY - tlx ) >= tlbOffset + 0 
				&& ( event.pageY - tlx ) <= tlbOffset + 130 ){
				itb.style.top = event.pageY - tlx + "px";
				//	8:00からマウス増分
				var cur_time = ( 60 * 8 ) + ((event.pageY - tlx) * 5) -( 42 * 4 );
				// var cur_time2 = ('00' + Math.floor( cur_time / 60 ) ).slice(-2)
				// 				+ ':' + ( '00' + ( cur_time - Math.floor( cur_time / 60 ) * 60 )).slice(-2);
				var cur_time2 = ('00' + Math.floor( cur_time / 60 ) ).slice(-2) + ':00';
								// + ':' + ( '00' + ( cur_time - Math.floor( cur_time / 60 ) * 60 )).slice(-2);
				itb.innerText = cur_time2;
				scrollWhiteboard( Math.floor( cur_time / 60 ) );
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
	// var wbt = document.getElementById('WHITEBOARD_TIMELINE');
	// var wb  = document.getElementById('WHITEBOARD');
	// wbt.style.top = 0 - ( ( hour - 8 ) * 400  ) - 0 + 'px';
	// wb.style.top  = 0 - ( ( hour - 8 ) * 400  ) - 4802 + 'px';
	document.getElementById('WHITEBOARD_FRAME').scrollTop = ( hour - 8 ) * 400;
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
	r += '<div style="margin:0 auto;font-size:14px;width:150px;">';
		r += '<form name="guidedance_whiteboard_form" onsubmit="return false;" >';
		r += '<div>Date:</div>';
		r += '<div style="padding-bottom:10px;" >';
			r += '<div style="width:50%;float:left;" >';
				r += '<input type="text" id="whiteboard_day" name="day" style="width:100%;font-size:14px;" value="' + ymd + '" />';
			r += '</div>';
			r += '<div style="float:right;width:48%;" >';
				r += '<button style="background-color:transparent;border:none;" disabled ><img width="12px" src="./images/add.png" /></button>';
				r += '<button style="background-color:transparent;border:none;" disabled ><img width="12px" src="./images/minus-2.png" /></button>';
			r += '</div>';
		r += '</div>';
		r += '<div id="WHITEBOARD_LIST" style="clear:both;height:70px;font-size:10px;padding:2px;overflow-y:scroll;border:1px solid lightgrey;" >';
		r += '</div>';
		r += '<div style="padding-bottom:5px;text-align:center;" >';
		r += '</div>';
		r += '</form>';
		r += '<div style="text-align:center;padding-top:5px;" >';
		r += '<button id="BTN_OPENWHITEBOARD" ';
		r += ' style="width:140px;height:60px;padding-left:20px;font-size:20px;background-color:transparent;border:none;background-image:url(./images/next.png);background-size:50px;background-repeat:no-repeat;background-position:left center;" ';
		r += ' onclick="createWhiteboard()" >';
		// r += '<img width="50px;" src="./images/next.png" >';
			r += 'Next...';
		r += '</button>';
		r += '</div>';
	r += '</div>';
	neverCloseDialog = true;
	openModalDialog( r, 'NOBUTTON' );
	makeWhiteboardList();
	document.getElementById('BTN_OPENWHITEBOARD').focus();
	document.getElementById('whiteboard_day').addEventListener('keydown',
		function (e){
			if ( e.keyCode == 13) // Enter key
				createWhiteboard();
		});
	
}

//
//	ホワイトボード作成・開く
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
	//e.preventDefault();
	var wb = document.getElementById('WHITEBOARD');
	switch ( e.type ){
		case 'touchstart':
		case 'mousedown':
			if ( document.getElementById('WHITEBOARD') != e.target ) return;
			if(e.type === "mousedown") {
					var event = e;
				} else {
					var event = e.changedTouches[0];
					wb_touch_cnt += e.changedTouches.length;
					if ( wb_touch_cnt_max < wb_touch_cnt ) wb_touch_cnt_max = wb_touch_cnt;
				}

			// document.getElementById('WHITEBOARD').style.pointerEvents = 'none';
/*				
			var nav = document.getElementById('NAVI');
			if ( nav != null ){
				nav.parentNode.removeChild( nav );
				wb_touch_cnt_max = 0;
			}
*/
			break;
		case 'mousemove':
		case 'touchmove':
/*
			var nav = document.getElementById('NAVI');
			if ( nav != null ){
				nav.parentNode.removeChild( nav );
				wb_touch_cnt_max = 0;
			}
*/
			break;
		case 'touchend':
		case 'mouseup':
			// document.getElementById('WHITEBOARD').style.pointerEvents = 'auto';
			if(e.type === "mouseup") {
				var event = e;
			} else {
				var event = e.changedTouches[0];
				document.getElementById('ID_CHILD_COORDINATE').innerText = 'touches:' + wb_touch_cnt + ' force:' + event.force;
				wb_touch_cnt -= e.changedTouches.length;
				if ( wb_touch_cnt == 0 ) wb_touch_cnt_max = 0;
			}

			if ( wb_touch_cnt_max < 2){
				if ( document.getElementById('WHITEBOARD') == e.target )	resetChildMark();
			} else {
				//
				//	NAVI
				//
/*
				var nav = document.getElementById('NAVI');
				if ( nav != null ){
					nav.parentNode.removeChild( nav );
					wb_touch_cnt_max = 0;
					return;
				}

				var m = document.createElement('DIV');
				m.setAttribute('id', 'NAVI' );
				m.style.position		= 'absolute';
				m.style.top 			= ( event.pageY - 60 ) + 'px';
				m.style.left			= ( event.pageX - 60 )+ 'px';
				m.style.width			= '120px';
				m.style.height			= '120px';
				m.style.color			= 'snow';
				m.style.backgroundColor	= 'transparent';
				m.style.fontSize		= '14px';
				m.style.zIndex			= 80000;
				var r = '';
				r += '<div class="vh-center" style="float:left;width:40px;height:40px;background-color:transparent;" >1</div>';
				r += '<div class="vh-center" style="float:left;width:40px;height:40px;background:red;" >2</div>';
				r += '<div class="vh-center" style="float:left;width:40px;height:40px;background-color:transparent;" >3</div>';
				r += '<div class="vh-center" style="float:left;width:40px;height:40px;background-color:red;" >4</div>';
				r += '<div class="vh-center" style="float:left;width:40px;height:40px;background-color:red;" >NAV</div>';
				r += '<div class="vh-center" style="float:left;width:40px;height:40px;background-color:red;" >6</div>';
				r += '<div class="vh-center" style="float:left;width:40px;height:40px;background-color:transparent;" >7</div>';
				r += '<div class="vh-center" style="float:left;width:40px;height:40px;background-color:red;" >8</div>';
				r += '<div target="close" class="vh-center" style="float:left;width:40px;height:40px;background-color:red;" >';
					r += '<img width="40px" src="./images/close.png" />';
				r += '</div>';
				m.innerHTML				= r;
				var nav = document.body.appendChild( m );
				nav.addEventListener('mouseup',
					function(e){
						console.log('nav close');
						var o = e.target;
						while ( true ){
							if ( o.parentNode == nav ) break;
							else o = o.parentNode;
						}
						switch ( o.getAttribute('target')) {
							case 'close':
								var n = document.getElementById('NAVI');
								if ( n != null ){
									n.parentNode.removeChild( n );
									wb_touch_cnt_max = 0;
								}
								break;
						}
					}
				);
				// nav.addEventListener( 'mouseleave',
				// 	function(e){
				// 		e.target.parentNode.removeChild( e.target );
				// 	});
*/
			}

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
//	NAV関連
//
function Nav( func ){
	this.frame 			= null;
	this.selector		= null;
	this.func			= func;
	this.touchdevice	= null;
	this.evtStart		= null;
	this.evtMove		= null;
	this.evtEnd			= null;
	this.current		= null;
	this.size 			= 60;

	this.touchdevice	= ( 'ontouchend' in document );
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

	var w = document.body.clientWidth;
//	var h = document.body.clientHeight;
	var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;

	// var w = document.documentElement.clientWidth;
	// var h = document.documentElement.clientHeight;

	var m = document.createElement('DIV');
	m.setAttribute('id', 'NAVI2' );
	m.setAttribute('class', 'not_select' );
	m.style.position		= 'absolute';
	m.style.top 			= ( ( h / 2 ) - this.size ) + 'px';
	// m.style.left			= ( ( w / 2 ) - this.size )+ 'px';
	m.style.left			= '0px';
	m.style.width			= '126px';
	m.style.height			= '126px';
	m.style.color			= 'snow';
	m.style.backgroundColor	= 'transparent';
	m.style.fontSize		= '14px';
	m.style.zIndex			= 65000;
	m.style.visibility		= 'hidden';
	var r = '';
	r += '<div class="vh-center nav_icon_blank" >1</div>';
	r += '<div target="delete" class="vh-center nav_icon" >';	// Delete Mark Child
		r += '<img width="20px" src="./images/minus-2.png" />';
	r += '</div>';
	r += '<div class="vh-center nav_icon_blank" >3</div>';
	r += '<div target="checkout" class="vh-center nav_icon" >';	// Checkout Mark Child
		r += '<img width="20px" src="./images/check-3.png" />';
	r += '</div>';
	r += '<div class="vh-center nav_icon" >';
		r += '&nbsp;';
	r += '</div>';
	r += '<div target="checkoutclear" class="vh-center nav_icon" >';	// Checkout Clear Mark Child
		r += '<img width="20px" src="./images/dry-clean.png" />';
	r += '</div>';
	r += '<div class="vh-center nav_icon_blank" >7</div>';
	r += '<div target="timeselector"  class="vh-center nav_icon" >';
		r += '<img width="20px" src="./images/time.png" />';
	r += '</div>';
	r += '<div target="close" class="vh-center nav_icon" >';	//	Close NAV
		r += '<img width="16px" src="./images/cancel.png" />';
	r += '</div>';
	m.innerHTML				= r;
	this.frame = document.body.appendChild( m );
	this.frame.addEventListener( this.evtStart,
		( function(e){
			var o = ( this.touchdevice )? e.changedTouches[0].target : e.target;
			while ( true ){
				if ( o.parentNode == this.frame ) break;
				else o = o.parentNode;
			}

		}).bind( this ), false );
	this.frame.addEventListener( this.evtMove,
		( function(e){}).bind( this ), false );
	this.frame.addEventListener( this.evtEnd,
		( function(e){
			var o = ( this.touchdevice )? e.changedTouches[0].target : e.target;
			while ( true ){
				if ( o.parentNode == this.frame ) break;
				else o = o.parentNode;
			}
			this.proc( o );
		}).bind( this ), false );

}

//
//	Navメソッド定義
//
Nav.prototype = {
	open : function(){
		var w = document.body.clientWidth;
		// var h = document.body.clientHeight;
		var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;

		this.frame.style.top 		= ( ( h / 2 ) - this.size ) + 'px';
		// this.frame.style.left		= ( ( w / 2 ) - this.size )+ 'px';
		this.frame.style.left		= '0px';
		this.frame.style.visibility	= 'visible';
	},
	close : function(){
		this.frame.style.visibility	= 'hidden';
	},
	opened : function(){
		return ( this.frame.style.visibility == 'visible');
	},
	proc : function( o ){
		switch ( o.getAttribute('target')) {
			case 'delete':
				this.close();
				deleteWhiteboardMarkChild();
				break;
			case 'checkout':
				this.close();
				checkoutWhiteboardMarkChild();
				break;
			case 'checkoutclear':
				this.close();
				checkoutClearWhiteboardMarkChild();
				break;
			case 'close':
				this.close();
				break;
		}
	}
};

//
//	モーダルダイアログをオープン
//
function openModalDialog( r , option ){
	// タイムセレクタを非表示
	palleteTimeSelector.close();
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
	var w = document.body.clientWidth;
	var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;
	var wbf = document.getElementById('WHITEBOARD_FRAME');
	wbf.style.height = ( h - 42 - 30 ) + 'px';

	var wb = document.getElementById('WHITEBOARD');
//	wb.style.width   = ( w - 70 ) + 'px';

	var cpf  = document.getElementById('CHILDREN_PALLETE_FRAME');
	cpf.style.height  = ( h -42 - 30 ) + 'px';
	cpf.style.left    = ( w - 42 ) + 'px';

	// var wpf  = document.getElementById('WHITEBOARD_PALLETE_FRAME');
	// wpf.style.height  = ( h -42 - 30 ) + 'px';

	var sts = document.getElementById('STATUS');
	sts.style.top		= ( h - 30 ) + 'px';

	var nsi = document.getElementById('NAV_START_ICON');
	nsi.style.top = ( ( h / 2 ) - oNav.size + 42 ) + 'px'
	//	NAVリロケーション
	if ( oNav.opened() ){
		oNav.frame.style.top	= ( ( h / 2 ) - ( oNav.frame.offsetHeight / 2 ) ) + 'px';
		// oNav.frame.style.left	= ( ( w / 2 ) - ( oNav.frame.offsetWidth  / 2 ) ) + 'px';	
		oNav.frame.style.left	= '0px';
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
	if ( checkSign()) {
		tb.style.visibility     = 'visible';
		wbf.style.visibility    = 'visible';
		status.style.visibility = 'visible';
	} else {
		tb.style.visibility     = 'hidden';
		wbf.style.visibility    = 'hidden';
		status.style.visibility = 'hidden';
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
	makeChildrenPalleteList();
	hiddenWhiteboard();
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
//	ホワイトボードメニュー
//
function whiteboardMenu( e ){
	e.stopPropagation();
	if ( document.getElementById('WHITEBOARD_SUBMENU') != null ){
		var p = document.getElementById('WHITEBOARD_DAY_FRAME');
		var c = document.getElementById('WHITEBOARD_SUBMENU');
		p.removeChild( c );
		return;
	}
	var o = document.createElement('DIV');
	o.setAttribute( 'id', 'WHITEBOARD_SUBMENU');
	o.style.position		= 'relative';
	o.style.padding			= '2px';
	o.style.top             = '12px';
	o.style.left            = '-44px';
	o.style.width           = '120px';
	o.style.height          = '120px';
	o.style.color			= ' gray';
	o.style.backgroundColor = '#EEEEEE';
	o.style.textAlign		='left';
	o.style.zIndex			= 50000;
	o.innerText = 'whiteboard menu...';
	var p = document.getElementById('WHITEBOARD_DAY_FRAME');
	var m = p.appendChild( o );
	var r = '';
	r += '<div id="ID_SAVE_WHITEBOARD"   style="height:20px;padding-top:2px;padding-left:16px;background-image:url(./images/upload.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >save whiteboard</div>';
	r += '<div id="ID_LOAD_WHITEBOARD"   style="height:20px;padding-top:2px;padding-left:16px;background-image:url(./images/cloud-computing.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >open whiteboard</div>';
	r += '<div id="ID_CLOSE_WHITEBOARD"  style="height:20px;padding-top:2px;padding-left:16px;background-image:url(./images/cancel.png);background-size:10px;background-position:left center;background-repeat:no-repeat;" >close</div>';
	r += '<div id="ID_CLEAR_WHITEBOARD"  style="height:20px;padding-top:2px;padding-left:16px;background-image:url(./images/eraser.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >clear whiteboard</div>';
	r += '<div id="ID_REPORT_WHITEBOARD" style="height:20px;padding-top:2px;padding-left:16px;background-image:url(./images/report.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >report...</div>';
	m.innerHTML = r;

	new Button( 'ID_SAVE_WHITEBOARD',   saveWhiteboard   ).play();
	new Button( 'ID_LOAD_WHITEBOARD',   null             ).play();
	new Button( 'ID_LOAD_WHITEBOARD',   null             ).play();
	new Button( 'ID_CLEAR_WHITEBOARD',  clearWhiteboard  ).play();
	new Button( 'ID_REPORT_WHITEBOARD', reportWhiteboard ).play();

	p.addEventListener('mouseleave', function(e) {
		var c = document.getElementById('WHITEBOARD_SUBMENU');
		if ( c!= null ) p.removeChild( c );

	});
	m.addEventListener('mouseleave', function(e) {
		var p = document.getElementById('WHITEBOARD_DAY_FRAME');
		var c = document.getElementById('WHITEBOARD_SUBMENU');
		p.removeChild( c );

	});
	m.addEventListener('mouseup', function(e) {
		e.stopPropagation();
	});

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
	o.style.left            = '-113px';
	o.style.width           = '150px';
	o.style.height          = '150px';
	o.style.backgroundColor = '#EEEEEE';
	o.style.textAlign		='left';
	o.style.zIndex			= 50000;
	o.innerText = 'sign menu...';
	var p = document.getElementById('SIGN_STATUS');
	var m = p.appendChild( o );
	var r = '';
	var id = signid();
	r += '<div id="ID_SIGN_OUT"         style="height:20px;padding-top:2px;padding-left:16px;background-image:url(./images/exit.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >sign out</div>';
	r += '<div id="ID_PROPERTY_ACCOUNT" style="height:20px;padding-top:2px;padding-left:16px;background-image:url(./images/user.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >property...</div>';
//	r += '<div id="ID_LOAD_CHILDREN"    style="height:20px;padding:2px;" >load...</div>';
	r += '<div id="ID_CURRENT_ACCOUNT"  style="height:20px;padding:2px;border-top:1px solid gray;" >sign in ' + id + '</div>';
	m.innerHTML = r;

	new Button( 'ID_SIGN_OUT', signout ).play();
	new Button( 'ID_PROPERTY_ACCOUNT', propertyAccount ).play();
//	new Button( 'ID_LOAD_CHILDREN',     loadChildrenForm ).play();

	p.addEventListener('mouseleave', function(e) {
		var c = document.getElementById('SIGN_SUBMENU');
		if ( c!= null ) p.removeChild( c );

	});
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
	
	r += "<div style='width:400px;height:;margin:10px auto;background-color:white;overflow:hidden;' >";
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
//	Nav表示制御
//
function ctlNav(){
	console.log( 'oNav:' + oNav.opened() );
	if ( ! oNav.opened() )	oNav.open();
		else				oNav.close();
}

//
//	ホワイトボードリスト生成処理
//
function makeWhiteboardList()
{
	document.getElementById( 'WHITEBOARD_LIST' ).innerHTML = '';
	var r = "";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				var o = document.getElementById( 'WHITEBOARD_LIST' );
				o.innerText = 'access...';
				break;
			case 4://done
				r = "";
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					//r += xmlhttp.responseText;
					var o = document.getElementById('WHITEBOARD_LIST');
					o.innerText = '';
					for ( var i=0; i<result.length; i++ ){
						addWhiteboardManage( o, result[i] );
					}
					//o.innerHTML = r;
				} else{
					document.getElementById('WHITEBOARD_LIST').innerText = xmlhttp.status;
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
	c.style.backgroundColor	= 'white';
	c.style.height			= '14px';
	c.style.marginBottom	= '1px';

	var day = new Date( Result.day );
	var ymd = day.getFullYear() + '/' + ( '00' + (day.getMonth() + 1 ) ).slice(-2) + '/' + ( '00' + day.getDate() ).slice(-2);

	var r = '';
    r += '<div>';
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
//	パレット内のマークしたチャイルドをホワイトボードにドラッグ2
//
function dragPalleteChild( hm ){
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
	var m = Math.floor( 60 * left2 / criteriaEscortPixel );
	m = Math.floor( m / 15 ) * 15;
	if ( m <= 0  ) m = 0;
//	if ( m >= 15 ) m = 15;

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
	var touchdevice = ( 'ontouchend' in document );

		console.log('mDown');
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
        document.body.addEventListener("mousemove", mMove, { passive : false } );
        document.body.addEventListener("touchmove", mMove, { passive : false } ) ;	
		
		if ( touchdevice ){
			//ムーブイベントにコールバック
			document.body.addEventListener("touchmove", mMove, { passive : false } ) ;	
			//マウスボタンが離されたとき、またはカーソルが外れたとき発火
			curChild.addEventListener("touchend", mUp, false);
//			document.body.addEventListener("touchleave", mUp, false);
		} else{
			//ムーブイベントにコールバック
			document.body.addEventListener("mousemove", mMove, { passive : false } );
			//マウスボタンが離されたとき、またはカーソルが外れたとき発火
			curChild.addEventListener("mouseup", mUp, false);
			document.body.addEventListener("mouseleave", mUp, false);
		}

		// エスコートガイド表示		
		// var tri = document.createElement('DIV');
		// tri.setAttribute('id', 'ESCORT_GUIDE');
		// tri.style.top    = '42px';
		// tri.style.left   = ( criteriaEscortPixel + 50 - 18 ) + 'px';
		// tri.style.width  = '40px';
		// tri.style.height = '40px';
		// tri.style.backgroundImage 		= 'url(./images/arrow-down.png)';
		// tri.style.backgroundSize 		= '30px';
		// tri.style.backgroundPosition 	= 'center center';
		// tri.style.backgroundRepeat 		= 'no-repeat';
		// tri.style.position 				= 'absolute';
		// tri.style.zIndex 				= 4000;
		// document.body.appendChild( tri );


	}

//
//	チャイルド操作
//
function mMove( e ){
	var touchdevice = ( 'ontouchend' in document );

		console.log('mMove');
        //ドラッグしている要素を取得
		//var drag = document.getElementsByClassName("drag")[0];
//		var drag = e.target;
		var drag = curChild;
		curChildMoved   = true;

		//チェックアウト(checkout)しているチャイルドは対象外
		//if ( drag.hasAttribute('checkout')) return;

        //同様にマウスとタッチの差異を吸収
        if(e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

		//フリックしたときに画面を動かさないようにデフォルト動作を抑制
		if ( e.type != "mouseover" ){
			e.preventDefault();
			e.stopPropagation();
		}

		//
		var wb_height = document.getElementById('WHITEBOARD').offsetHeight;
		var wb_width  = parseInt( document.getElementById('WHITEBOARD').style.width );
		wb_height -= parseInt( drag.offsetHeight / 2 );
		wb_width  -= parseInt( drag.offsetWidth  / 2 );
		//マウスが動いた場所に要素を動かす
		if ( e.type == 'touchmove' 
		    || (( e.buttons & 1 ) && e.type == 'mousemove' ) ){
			var old_top  = parseInt( drag.style.top  );
			var old_left = parseInt( drag.style.left );
			if ( ( event.pageY - y ) < 0 || ( event.pageX - x ) < 0 ) return;
			if ( ( event.pageY - y ) >= wb_height || ( event.pageX - x  ) >= wb_width  ) return;
			//if ( !checkOtherChildCoordinate( drag, event.pageX - x, event.pageY - y ) ) return;
			if ( !checkOtherChildCoordinate( drag, event.pageX - x - old_left, event.pageY - y - old_top ) ) return;
			drag.style.top  = event.pageY - y + "px";
			drag.style.left = event.pageX - x + "px";
			// delta_x = parseInt( drag.style.left ) - old_left;
			// delta_y = parseInt( drag.style.top  ) - old_top;
			 delta_x = ( event.pageX - x ) - old_left;
			 delta_y = ( event.pageY - y ) - old_top;
			if ( isMarkedChild( drag ) )
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
	var wb_height = document.getElementById('WHITEBOARD').offsetHeight;
	var wb_width  = parseInt( document.getElementById('WHITEBOARD').style.width );
	wb_height -= parseInt( base_child.offsetHeight / 2 );
	wb_width  -= parseInt( base_child.offsetWidth  / 2 );
	
	var children = getMarkedChild();
	if ( children.length == 0 ) return true;
	for ( var i=0; i<children.length; i++ ){
		if ( base_child != children[i]){
			console.log( 'checkOtherChildCoordi:' + children[i].style.top );
			if ( parseInt( children[i].style.top )  + y < 0
			 || parseInt( children[i].style.left ) + x < 0 ) return false;
			if ( parseInt( children[i].style.top  ) + y >= wb_height ) return false;
			if ( parseInt( children[i].style.left ) + x >= wb_width ) return false;
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
			// if ( ! children[i].hasAttribute('checkout')){
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
	
			// }

		}
	}
}
//
//	チャイルド操作
//
function mUp( e ) {
	var touchdevice = ( 'ontouchend' in document );
	console.log('mUp:' + e.type );

	//var drag = document.getElementsByClassName("drag")[0];
	//var drag = e.target;
	var drag = curChild;
	//ムーブベントハンドラの消去
	if ( touchdevice ){
		document.body.removeEventListener("touchmove", mMove, false);
		if ( drag != null ) drag.removeEventListener("touchend", mUp, false);
	} else{
		document.body.removeEventListener("mousemove", mMove, false);
		if ( drag != null) drag.removeEventListener("mouseup", mUp, false);
	}

	e.stopPropagation();

	//クラス名 .drag も消す
	if ( drag != null ) drag.classList.remove("drag");
	if ( e.type == 'mouseup'){		//	touchendで反応しないように！
		if ( !curChildMoved ){
			if ( curChild != null ){
				if ( isMarkedChild( curChild ) ) {
						// if ( existContextMenu( curChild ) ){
					// console.log('existContextMenu');
						unmarkChild( curChild );
					// } else {
							// if ( !existContextMenu( curChild)){
								// clearOtherContextMenu( curChild );
								// makeContextMenu();
							// }
					// }
				}else {
					markChild( curChild );
					// clearOtherContextMenu( curChild );
					// コンテキストメニュー
					// makeContextMenu();
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
	var children = wb.getElementsByClassName('CHILD');
	if ( children == null ) return;
	for ( var i=0; i<children.length; i++ ){
		unmarkChild( children[i]);
	}

}
