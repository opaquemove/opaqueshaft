/**
 *	Author: MASATO.NAKANISHI
 *	Date:	20.June.2020
 *	Reference: https://q-az.net/elements-drag-and-drop/
 */

// const { json } = require("body-parser");

var x, y;
var wbx, wby;
var delta_x, delta_y;
var curChild  = null;
var propChild = null;
var curChildZIndex = null;
var curChildMoved  = false;

var ongoingTouches = [];

var wb_touch_cnt		= 0;
var wb_touch_cnt_max	= 0;
var wb_description		= '';
var wb_report			= '';

var pixelPerHour		= 600;
var oNav				= null;
var oSpotlight			= null;

var criteriaEscortPixel = 600;
var curWhiteboard		= 'WHITEBOARD';

var updateFlg			= false;
//
//	タイムライン・バー操作
//
var tlx = null;
var tly = null;
var tlbOffset 		= null;
var tlbOffsetLeft	= null;
var tl_drag = false;


var dndOffsetX = 0;
var dndOffsetY = 0;

// ホワイトボードが開いているかフラグ
var openWhiteboardFlg = false;
var dayWhiteboard  = null;

var neverCloseDialog = false;

var palleteTimeSelector = null;

var oTile				= null;
var oLog				= null;
var oReportDlg			= null;

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

	//	ログエリアの初期化
	oLog = new messageLog();

	//	レポートダイアログの初期化
	oReportDlg = new report_dlg();

	// TIMELINE_BARの初期座標を記憶する
	tlbOffset 		= document.getElementById('ID_TIMELINE_BAR').offsetTop;
	tlbOffsetLeft	= document.getElementById('ID_TIMELINE_BAR').offsetLeft;

	document.oncontextmenu = function(e) { return false; }
	var wbf = document.getElementById('WHITEBOARD_FRAME');
	wbf.addEventListener('scroll',
		function(e){
			//  if ( curChildMoved )
			// 	 e.preventDefault();
			// document.getElementById('ID_ON_SCROLL').innerText = 'scroll:' + e.target.scrollTop;
			if ( !tl_drag )			//	TIMELINE_BAR移動中でなければ動作
				setTimelinebarByScroll();
		}, { passive : false });

	var wb = document.getElementById('WHITEBOARD');
//  touchmoveを抑制すると返って使いづらいので抑制はしないよ！ 
//	wb.addEventListener("touchmove",
//	 function( e ) { e.preventDefault(); }, { passive:false } );
//	wb.addEventListener('selectstart', function(e){return false;})

	// iPadでドラッグできなくなるのでコメント
	// var cpf = document.getElementById('CHILDREN_PALLETE_FRAME');
	// cpf.addEventListener("touchmove",
	//  function( e ) { e.preventDefault(); }, { passive:false } );
 

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
			var child_top = 0;
			var child_left = 0;
			if ( e.target.getAttribute('id') != 'WHITEBOARD' ){	// ドロップ先がチャイルド
				var o = e.target;
				while ( true ){
					if ( o.parentNode.getAttribute('id') == 'WHITEBOARD') break;
					o = o.parentNode;
				}
				child_top = parseInt( o.style.top );
				child_left = parseInt( o.style.left );
				console.log( 'child_top,left:' + child_top + ',' + child_left);
			}
			//alert( e.dataTransfer.getData('text') );
			var id = e.dataTransfer.getData('text');
			var wb = document.getElementById('WHITEBOARD');
			console.log( e.target.getAttribute('id'), e.pageY, e.pageX, id );
			var oChild = getChild(id);
			if ( alreadyExistChildOnWhiteboard( id )){
				// alert('すでにホワイトボードに配置されています．');
				var child_name = e.target.getElementsByClassName('CHILD_NAME')[0].innerText;
				oLog.log( null, oChild.child_name + ' : すでにホワイトボードに配置されています.');
				oLog.open( 3 );
				return;
			}
			// var itb = document.getElementById('ID_TIMELINE_BAR');
			// var hm  = itb.innerText;
			// var arHM = hm.split(':');

			var p = e.target.parentNode;
		
			//var escort = document.getElementById('CPC_ESCORT_CHILD').getAttribute('flag');
//			addChild( ( arHM[0] - 8 ) * 100, arHM[1] * 160, oChild.child_id, oChild.child_name, oChild.child_type,oChild.child_grade, null, false, false, false );
			addChild( e.pageY - e.target.offsetTop - dndOffsetY + wb.parentNode.scrollTop - wb.parentNode.offsetTop + child_top,
				 e.pageX - e.target.offsetLeft - p.offsetLeft - dndOffsetX + wb.parentNode.scrollLeft + child_left,
				 oChild.child_id, oChild.child_name, oChild.kana, oChild.child_type,oChild.child_grade, null, false, false, false );
			dndOffsetX = 0;
			dndOffsetY = 0;
			showWhiteboardChildCount();
		});

	//
	//	チルドレンパレットのイベント登録
	//	
	// var cpc = document.getElementById('CHILDREN_PALLETE_CONTENT');
	// cpc.addEventListener('dblclick',  selectChild );

	//	パレット上のチャイルドリストをクリックした時の動作
	// cpc.addEventListener('mouseup',   markPalleteChild );

	//	チャイルドファインダー（スポットライト）初期化
	oNav = new Nav( null );
	oSpotlight = new spotlight( fitting );
	oSpotlight.play();

	fitting();
	//new Button( 'OPAQUESHAFT_NAV', test ).play();
	// new Button( 'SIGN_STATUS',              signMenu       ).play();
	// new Button( 'OPAQUESHAFT_TITLE',        whiteboardMenu ).play();
	// new Button( 'WHITEBOARD_DAY_FRAME',     whiteboardMenu ).play();
//	new Button( 'CHILD_FINDER',				childFinder    ).play();
//	new Button( 'ID_NAV',                   ctlNav         ).play();
	// new Button( 'ID_SEARCH',                ctlSpotlight   ).play();
	new Button( 'WHITEBOARD_DAY_FRAME',     saveWhiteboard ).play();
	new Button( 'NAV_START_ICON',			ctlNav         ).play();
	// new Button( 'CHILDREN_PALLETE_TAB',     foldingChildrenPallete ).play();
	// new Button( 'ID_CHILDREN',		        foldingChildrenPallete ).play();
	// new Button( 'CPC_RELOAD',               makeChildrenPalleteList ).play();
	// new Button( 'CPC_UPDATE_CHILD_TIME',	showTimelineSelector ).play();
	new Button( 'ID_NAV_TILE',  			showTile ).play();
	new Button( 'ID_NAV_REPORT',  			reportWhiteboard ).play();
	// new Button( 'ID_NAV_CHILD',  			foldingChildrenPallete ).play();
	new Button( 'ID_NAV_SEARCH',            ctlSpotlight ).play();
	new Button( 'ID_NAV_LOG',               ctlMessageLog ).play();

	// new Checkbox('CPC_GRADE1', 'OFF', null ).play();
	// new Checkbox('CPC_GRADE2', 'OFF', null ).play();
	// new Checkbox('CPC_GRADE3', 'OFF', null ).play();
	// new Checkbox('CPC_GRADE4', 'OFF', null ).play();
	// new Checkbox('CPC_GRADE5', 'OFF', null ).play();
	// new Checkbox('CPC_GRADE6', 'OFF', null ).play();

	//	モーダルダイアログの外側をクリックしたらクローズ
	var mo = document.getElementById('MODAL_OVERLAY');
	mo.addEventListener('click', function(e){
		if ( e.target == this ) closeModalDialog();
		});

	//
	//	タイムセレクタ初期化
	//
	palleteTimeSelector = new TimeSelector( checkinSelectedChild );
	palleteTimeSelector.play();

	//
	//	タイル初期化
	//
	oTile = new Tile( null );
	oTile.play();

	// チャイルドパレットのチャイルドリスト作成
	if ( !checkSign() ){			//サインアウトしている
		// ツールバーの表示制御(サインイン、サインアウトによる制御)
		// ctlToolbar();
		// hiddenWhiteboard();
		signForm();					// サインインUIを表示
	} else {						//サインインしている
		if ( !openWhiteboardFlg ){		// ホワイトボードが開いてなければの対応
			// ツールバーの表示制御(サインイン、サインアウトによる制御)
			ctlToolbar();
			// hiddenWhiteboard();
			openWhiteboard();
		}
	}
	
	//
	//	チャイルドファインダー初期化
	//
	// var tk = document.getElementById('TXT_KEYWORD');
	// tk.addEventListener('keyup', childFinder, false );

	//
	//	タイムラインガイド初期化
	//

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
	tmb.addEventListener( 'mouseleave', 	locateTimelinebar, { passive : false } );
	tmb.addEventListener( 'dblclick',	 	locateTimelinebar, { passive : false } );

	// tmb.addEventListener( 'mousedown',  locateTimelinebar );
	// tmb.addEventListener( 'touchstart', locateTimelinebar );
	// tmb.addEventListener( 'mousemove',  locateTimelinebar );
	// tmb.addEventListener( 'touchmove',  locateTimelinebar );
	// tmb.addEventListener( 'mouseup',    locateTimelinebar );
	// tmb.addEventListener( 'touchend',   locateTimelinebar );

	//
	//	パースペクティブバー初期化
	//
	initPerspectivebar( evtStart, evtMove, evtEnd );

	makeToolbarCheckoutProgress( 0 );
}

function test(){

	// var jsonText = JSON.stringify( [ { data:'hogehoge'}, {data:'hoehoe'} ] );

    // var xmlhttp = new XMLHttpRequest();
	// xmlhttp.open("POST", "/accounts/jsonsend", false );
	// xmlhttp.setRequestHeader( "Content-Type", "application/json" );
	// xmlhttp.send( jsonText );

	ctlReportDlg();

}
//
//	ツールバーにチェックアウトプログレスを表示
//
function makeToolbarCheckoutProgress( progress_ratio ){
	console.log( 'maketoolbarcheckoutprogress:' + progress_ratio );
	var p = document.getElementById('ID_PROGRESS');
	p.innerHTML = '';
	var d = document.createElement('DIV');
	d.setAttribute( 'class', 'vh-center');
	d.style.position		= 'relative';
	d.style.paddingTop		= '1px';
	d.style.paddingLeft		= '1px';
	d.style.width			= '80px';
	d.style.height			= '80px';
	// d.style.backgroundColor	= 'rgb(241,241,241)';
	// d.style.border			= '1px solid lightgrey';
	var ccl = p.appendChild( d );
	var cp = new CircleProgress( ccl, 70, 70, progress_ratio, 'gray', 12 );
	cp.play();

}
//
//	共通処理をまとめる
//
function commonProc(){

	var children = getMarkedChild();
	var visible  = ( children.length > 0);
	if ( oNav.opened()){
		for ( var i=0; i< oNav.frame.childNodes.length; i++ ){
			var n = oNav.frame.childNodes[i];
			if ( n.hasAttribute('marked'))
				n.style.visibility = ( visible )?'visible':'hidden';
		}
	}else{
		for ( var i=0; i< oNav.frame.childNodes.length; i++ ){
			var n = oNav.frame.childNodes[i];
			if ( n.hasAttribute('marked'))
				n.style.visibility = 'hidden';
		}

	}

	showWhiteboardChildCount();

}

//
//	タイムラインインジケータの生成
//
function makeTimelineIndicator(){
	var wbf = document.getElementById('WHITEBOARD_FRAME');
	var tb_height = document.getElementById('TOOLBAR').offsetHeight;
	var wbt = document.getElementById('WHITEBOARD_TIMELINE');
	var wbt_width = wbt.offsetWidth;

	arTL = [ '08', '09', '10', '11', '12','13','14','15','16','17','18','19' ];
	for ( var i=0; i<arTL.length; i++ ){
		var o = document.createElement('DIV');
		o.setAttribute('class', 'timeline_class vh-center' );
		o.innerHTML = '<div style="border-bottom:4px solid white;" >' + arTL[i] + '</div>';
		wbt.appendChild( o );

	}
	
	for ( var i=0; i<arTL.length - 1; i++ ){
		var guide = document.createElement('DIV');
		guide.setAttribute('class', 'timeline2_class' );
		// guide.style.position		= 'absolute';
		guide.style.top				= ( ( i + 1 ) * pixelPerHour - 1 )+ 'px';
		// guide.style.left			= '40%';
		// guide.style.width			= '20%';
		// guide.style.margin			= '0 auto';
		// guide.style.height			= '1px';
		// guide.style.backgroundColor	= 'transparent';
		// guide.style.borderBottom	= '1px dashed lightgrey';
		guide.style.pointerEvents	= 'auto';
		// guide.style.zIndex			= 17000;
		guide.innerHTML				= '&nbsp;';
		wbf.appendChild( guide );

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
		this.frame			= document.getElementById('MODAL_OVERLAY_TIMESELECTOR');
		this.selector		= document.getElementById('MODAL_TIMESELECTOR');
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
						 		document.getElementById('WHITEBOARD_FRAME').scrollTop = ( h - 8 ) * pixelPerHour;

								this.func( h + ':00' );		//チャイルド追加
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
//	タイルのプロトタイプ
//
function Tile( func ){
	this.overlay		= null;
	this.frame 			= null;
	this.func			= func;
	this.touchdevice	= null;
	this.evtStart		= null;
	this.evtMove		= null;
	this.evtEnd			= null;
}
Tile.prototype = {
	play : function(){
		this.frame			= document.getElementById('MODAL_OVERLAY_TILE');
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

		this.frame.addEventListener( this.evtEnd,
			( function(e){
				e.stopPropagation();
				if ( e.target == this.frame )
				 this.close();
			} ).bind( this ), false );

		new Button( 'MODAL_TILE2', function(){ propertyAccount(); oTile.close();} ).play();
		new Button( 'MODAL_TILE3', showTile     ).play();
		new Button( 'MODAL_TILE4', function(){ saveWhiteboard(); oTile.close(); } ).play();
		new Button( 'MODAL_TILE5', function(){ signoutForm(); oTile.close(); } ).play();
		new Button( 'MODAL_TILE6', function(){ clearWhiteboard(); oTile.close(); } ).play();
		new Button( 'MODAL_TILE7', function(){ absentWhiteboard(); oTile.close(); } ).play();
		new Button( 'MODAL_TILE8', function(){ openWhiteboard(); oTile.close(); } ).play();
		new Button( 'MODAL_TILE9', function(){ closeWhiteboard(); oTile.close(); } ).play();
		new Button( 'MODAL_TILE10', function(){ reportWhiteboard(); oTile.close(); } ).play();

	},
	open : function(){
		this.frame.style.visibility = 'visible';
		this.day( dayWhiteboard );

		var tile2 = document.getElementById('MODAL_TILE2');
		tile2.innerText = 'sign ' + isSignId();
	},
	close : function(){
		this.frame.style.visibility = 'hidden';
		var mt1 = document.getElementById('MODAL_TILE1');
		mt1.innerHTML = '';
		var mt3 = document.getElementById('MODAL_TILE3');
		mt3.innerHTML = '';
	},
	opened : function(){
		return ( this.frame.style.visibility == 'visible' );
	},
	day : function( day ){
		var mt1 = document.getElementById('MODAL_TILE1');
		var d = document.createElement('DIV');
		d.innerText			= day;
		mt1.appendChild( d );

	}
}


//
//	タイムライン・バー操作
//
function locateTimelinebar( e ){
	e.preventDefault();

	var wbf = document.getElementById('WHITEBOARD_FRAME');
	var wb  = document.getElementById('WHITEBOARD');
	var wbe = document.getElementById('WHITEBOARD_ESCORT');
	var wba = document.getElementById('WHITEBOARD_ABSENT');
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
			// if ( tlbOffset == null ) tlbOffset = e.target.offsetTop;
			//e.target.position = 'absolute';
			itb.style.width 		= '24px';
			itb.style.paddingLeft	= '60px'
			itb.style.height		= '84px';
			itb.style.fontSize 		= '20px';
			tly = event.pageY - event.target.offsetTop;
			tlx = event.pageX - event.target.offsetLeft;
			tl_drag = true;

			//	Spotlight UIにセレクトしたチャイルドがあればチェックイン
			if ( oSpotlight.existSelectedChild() ){
				resetChildMark();	// すでにマークしているチャイルドを外す
				oSpotlight.checkin( itb.innerText );	// マーク状態でチェックインする
			}

			break;
		case 'touchmove':
		case 'mousemove':
			if(e.type == "mousemove" ) {
				var event = e;
			} else {
				var event = e.changedTouches[0];
			}
			if ( tly == null ) 		return;
			if ( event.target != itb ) 	return;
			if ( !tl_drag ) 		return;
			var new_top  = event.pageY - tly;
			var new_left = event.pageX - tlx
			if ( ( new_top ) >= tlbOffset + 0 
				&& ( new_top ) <= tlbOffset + 132 ){
				itb.style.top 	= new_top + 'px';
				if ( ( new_left ) >= tlbOffsetLeft + 0
				&& ( new_left ) <= tlbOffsetLeft + 84 ){
					itb.style.left	= new_left + 'px';
					var wbf = document.getElementById('WHITEBOARD_FRAME');
					var wb  = document.getElementById('WHITEBOARD');
					var wbt = document.getElementById('WHITEBOARD_TIMELINE');
					var wba = document.getElementById('WHITEBOARD_ABSENT');
					var bo  = document.getElementById('BOTTOM_OVERLAY');
					var bf  = document.getElementById('BOTTOM_FRAME');
					if ( itb.offsetLeft == tlbOffsetLeft + 0 ){
						wbf.style.perspective	= '';
						wb.style.transform 		= '';
						wb.style.border 		= '';
						wbt.style.border 		= '';
						wba.style.border 		= '';
						bo.style.perspective 	= '';
						bf.style.transform 		= '';
						// bf.style.border 		= '';
						// console.log('0');
					} else {
						wbf.style.perspective	= '270px';
						wb.style.transformStyle	= 'preserve-3d';
						wb.style.transform 		= 'translate3d( 0px, 0px, -300px) rotateY(' + ( new_left - tlbOffsetLeft ) + 'deg)';
						wb.style.border 		= '1px solid white';
						wbt.style.transformStyle	= 'preserve-3d';
						wbt.style.transform 	= 'translate3d( 0px, 0px, -300px) rotateY(' + ( new_left - tlbOffsetLeft ) + 'deg)';
						wbt.style.border 		= '1px solid white';
						wba.style.transformStyle	= 'preserve-3d';
						wba.style.transform 	= 'translate3d( 0px, 0px, -350px) rotateY(' + ( new_left - tlbOffsetLeft ) + 'deg)';
						wba.style.border 		= '1px solid red';
						bo.style.perspective 	= '270px';
						bf.style.transform 		= 'translate3d( 0px, 0px, -400px) rotateY(' + ( new_left - tlbOffsetLeft ) + 'deg)';
						// bf.style.border 		= '1px solid white';
						// console.log('42');
					}
				}

				//	8:00からマウス増分
				// var cur_time = ( 60 * 8 ) + ((event.pageY - tly) * 5) -( 42 * 4 );
				// var cur_time2 = ('00' + Math.floor( cur_time / 60 ) ).slice(-2) + ':00';
				var ttl_min = ( itb.offsetTop - tlbOffset ) * 5;
				var h = Math.floor( ttl_min / 60 ) + 8;
				var m = ttl_min % 60;
				// console.log( 'hour:' + h + ':' + m );
				itb.innerHTML = ( '00' + h ).slice(-2) + ':' + ( '00' + m ).slice(-2) + '<br>' + itb.style.left;
				moveMarkedChildByTimelinebar( h );
				scrollWhiteboard( h );
			} else {
				//console.log( 'other:' + e.target.offsetTop + ':' + tlbOffset );
			}
			break;
		case 'mouseleave':
		case 'mouseup':
		case 'touchend':
			itb.style.width 		= '';
			itb.style.paddingLeft	= '';
			itb.style.height		= '';
			itb.style.fontSize 		= '';
			tl_drag = false;
			tly = null;
			break;
		case 'dblclick':
			console.log( 'zIndex:' + wb.style.zIndex );
			switch ( wb.style.zIndex ){
				case '':
				case '3':
					wbe.style.zIndex	= 3;
					wb.style.zIndex		= 2;
					wba.style.zIndex	= 1;
					curWhiteboard		= 'WHITEBOARD_ESCORT';
					break;
				case '2':
					wb.style.zIndex		= 3;
					wbe.style.zIndex	= 2;
					wba.style.zIndex	= 1;
					curWhiteboard		= 'WHITEBOARD';
					break;
					default:
						break;
					}
			console.log( 'current whiteboard:' + curWhiteboard );
			oLog.log( null, 'current whiteboard:' + curWhiteboard );
			oLog.open( 2 );
			break;
	}
}

//
//	スクルール量からID_TIMELINE_BARを移動する
//
function setTimelinebarByScroll(){

	var scroll_top = document.getElementById('WHITEBOARD_FRAME').scrollTop;
	var h = Math.floor( scroll_top / pixelPerHour ) + 8;
	var m = ( scroll_top % pixelPerHour )  / Math.floor( pixelPerHour / 5 );
	var delta = ( h - 8 ) * 5;

	var itb = document.getElementById('ID_TIMELINE_BAR');
	itb.style.top = ( tlbOffset + ( h - 8 ) * ( 60 / 5 ) ) + 'px';
	itb.innerText = ( '00' + h ).slice(-2) + ':00';

}

//
//	タイムラインバーに連動してマークしているチャイルドの移動を行う
//
function moveMarkedChildByTimelinebar( hour ){
	var children = getMarkedChild();
	if ( children.length == 0 ) return;
	for ( var i=0; i<children.length; i++ ){
		var c = children[i];
		var top_delta = c.offsetTop % pixelPerHour;
		// 座標変更
		c.style.top = ( ( hour - 8 ) * pixelPerHour + top_delta ) + 'px';
		// チェックアウト予定時刻変更
		var et = c.getElementsByClassName('ESTIMATE_TIME');
		if ( et != null ){
			var hm = coordinateToTime( c.offsetTop, c.offsetLeft );
			et[0].innerText = hm;
			if ( c.hasAttribute('checkout') )  c.setAttribute('checkout', hm );

		}

	}

}
//
//	タイムライン・バーに連動してホワイトボードをスクロール
//
function scrollWhiteboard( hour ){
	// var wbt = document.getElementById('WHITEBOARD_TIMELINE');
	// var wb  = document.getElementById('WHITEBOARD');
	// wbt.style.top = 0 - ( ( hour - 8 ) * pixelPerHour  ) - 0 + 'px';
	// wb.style.top  = 0 - ( ( hour - 8 ) * pixelPerHour  ) - 4802 + 'px';
	document.getElementById('WHITEBOARD_FRAME').scrollTop = ( hour - 8 ) * pixelPerHour;
}


//
//	ホワイトボードを開く(レコードは作成しない)
//
function openWhiteboard(){
	var today = new Date();
	var y = today.getFullYear();
	var m = ('00' + (today.getMonth() + 1 ) ).slice(-2);
	var d = ('00' + today.getDate() ).slice(-2);
	var ymd = y + '/' + m + '/' + d;

	var r = '';
	r += '<div style="height:;font-size:24px;text-align:center;padding-top:10px;padding-bottom:10px;" >';
		// r += 'open whiteboard';
	r += '</div>';
	r += '<div style="margin:0 auto;font-size:18px;width:80%;">';
		r += '<form name="guidedance_whiteboard_form" onsubmit="return false;" >';
		r += '<div>Date:</div>';
		r += '<div style="height:40px;padding-bottom:10px;" >';
			r += '<div style="width:50%;float:left;" >';
				r += '<input type="text" id="whiteboard_day" name="day" style="width:100%;font-size:24px;" value="' + ymd + '" />';
			r += '</div>';
			r += '<div style="float:right;width:48%;" >';
				// r += '<button id="BTN_ADD_DATE"   style="background-color:transparent;border:none;" ><img width="12px" src="./images/add.png" /></button>';
				// r += '<button id="BTN_MINUS_DATE" style="background-color:transparent;border:none;" ><img width="12px" src="./images/minus-2.png" /></button>';
				r += '<img id="BTN_ADD_DATE"   width="22px" style="padding-right:3px;" src="./images/up-arrow.png" />';
				r += '<img id="BTN_MINUS_DATE" width="22px" src="./images/down-arrow.png" />';
			r += '</div>';
		r += '</div>';
		// r += '<div id="WHITEBOARD_LIST" style="clear:both;margin-top:10px;height:120px;display:flex;font-size:12px;padding:4px;overflow-y:scroll;border:0px solid lightgrey;" >';
		r += '<div id="WHITEBOARD_LIST" >';
		r += '</div>';
		r += '<div style="clear:both;padding-bottom:5px;text-align:center;" >';
		r += '</div>';
		r += '</form>';
		r += '<div style="text-align:center;padding-top:5px;" >';
		r += '<button id="BTN_OPENWHITEBOARD" ';
		r += ' style="width:140px;height:60px;padding-left:20px;font-size:20px;background-color:transparent;border:none;background-image:url(./images/arrow-right.png);background-size:50px;background-repeat:no-repeat;background-position:center center;" ';
		r += ' onclick="createWhiteboard()" >';
		// r += '<img width="50px;" src="./images/next.png" >';
			r += '';
		r += '</button>';
		r += '</div>';
	r += '</div>';

	 var children = document.getElementById('WHITEBOARD').childNodes;
	 neverCloseDialog = ( children.length == 0 ) ? true : false;
	// neverCloseDialog = true;
	openModalDialog( 'open Whiteboard', r, 'NOBUTTON', null, 'OPENWHITEBOARD' );
	makeWhiteboardList();
	document.getElementById('BTN_OPENWHITEBOARD').focus();
	document.getElementById('whiteboard_day').addEventListener('keydown',
		function (e){
			if ( e.keyCode == 13) // Enter key
				createWhiteboard();
		});
	document.getElementById('BTN_ADD_DATE').addEventListener('click',
		function(e){
			var d = guidedance_whiteboard_form.day.value;
			var dd = new Date( d );
			dd.setDate( dd.getDate() + 1 );
			guidedance_whiteboard_form.day.value =
				dd.getFullYear() + '/' + ('00' + ( dd.getMonth() + 1 )).slice(-2) + '/' + ('00' + dd.getDate()).slice(-2);
		}, false );
	document.getElementById('BTN_MINUS_DATE').addEventListener('click',
		function(e){
			var d = guidedance_whiteboard_form.day.value;
			var dd = new Date( d );
			dd.setDate( dd.getDate() - 1 );
			guidedance_whiteboard_form.day.value =
				dd.getFullYear() + '/' + ('00' + ( dd.getMonth() + 1 )).slice(-2) + '/' + ('00' + dd.getDate()).slice(-2);
		}, false );
	document.getElementById('WHITEBOARD_LIST').addEventListener('mousedown',
		function(e) {
			var o = e.target;
			if ( o == document.getElementById('WHITEBOARD_LIST')) return;
			while ( o.parentNode != document.getElementById('WHITEBOARD_LIST') ){
				o = o.parentNode;
			}
			o.style.color			= 'white';
			o.style.backgroundColor = 'red';
		}, false );
		document.getElementById('WHITEBOARD_LIST').addEventListener('mouseup',
		function(e) {
			var o = e.target;
			if ( o == document.getElementById('WHITEBOARD_LIST')) return;
			while ( o.parentNode != document.getElementById('WHITEBOARD_LIST') ){
				o = o.parentNode;
			}
			o.style.color			= '';
			o.style.backgroundColor = '';
			guidedance_whiteboard_form.day.value = o.firstChild.innerText;
			createWhiteboard();
		}, false );
	
}

//
//	ホワイトボード開く（WHITEBOARDレコードはこのタイミングでは作成しないよ）
//
function createWhiteboard(){
	var target_day = guidedance_whiteboard_form.day.value;
	var cwd = document.getElementById('CUR_WHITEBOARD_DAY');
	dayWhiteboard 	= target_day;
	cwd.innerText 	= target_day;
	updateFlg		= false;
	//createWhiteboardHelper( dayWhiteboard );
	neverCloseDialog = false;
	closeModalDialog();
	visibleWhiteboard();
	loadWhiteboard();

	ctlToolbar();
	// clearWhiteboard();

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
	var children = wb.getElementsByClassName('CHILD');
	for ( var i=0; i<children.length; i++ ){
		if ( children[i].getAttribute('child_id') == id )
			return true;
	}
	var wb_absent = document.getElementById('WHITEBOARD_ABSENT');
	var absents = wb_absent.getElementsByClassName('CHILD');
	for ( var i=0; i<absents.length; i++ ){
		if ( absents[i].getAttribute('child_id') == id )
			return true;
	}
	return rc;
}

function whiteboard(){
	this.day				= null;
	this.description		= null;
	this.reportMessage		= null;
}
//
//	ホワイトボードをロードする
//
function loadWhiteboard(){

	//ホワイトボード概要をロードする
	loadWhiteboardHelper();

	// チルドレンをロードする
	loadWhiteboardChildren();

}

//
//	ホワイトボード概要をロードする
//
function loadWhiteboardHelper(){
	var day = dayWhiteboard;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
				break;
			case 2://header received
				break;
			case 3://loading
				oLog.log( null, 'load Whiteboard summary...' );
				oLog.open( 3 );
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					if ( result.length > 0 ){		//	レコードが存在すれば
						wb_description			= result[0].description;
						// wb_report				= result[0].report;
						// wb.innerHTML 		= result[0].whiteboard;
						// wb_absent.innerHTML	= result[0].whiteboard_absent;

					}

					oLog.log( null, 'load Whiteboard summary ok.' );
					oLog.open( 3 );
				} else{
					oLog.log( null, 'loadWhiteboardHelper:' + xmlhttp.status );
					oLog.open( 3 );
				} 
				break;
		}
	};

	xmlhttp.open("POST", "/accounts/whiteboardload", true );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'day=' + day );

}

//
//	ホワイトボード:チルドレンをロードする
//
function loadWhiteboardChildren(){
	var touchdevice = ( 'ontouchend' in document );

	var day = dayWhiteboard;
	var wb = document.getElementById('WHITEBOARD');
	var wb_absent = document.getElementById('WHITEBOARD_ABSENT');
	wb.innerHTML 		= '';
	wb_absent.innerHTML	= '';

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
				break;
			case 2://header received
				break;
			case 3://loading
				oLog.log( null, 'load Whiteboard children...' );
				oLog.open( 3 );
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					if ( result.length > 0 ){		//	レコードが存在すれば
			
						// //	チャイルドにイベントハンドラを割り当てる 
						// for ( var i=0; i<wb.childNodes.length; i++ ){
						// 	if ( touchdevice )	wb.childNodes[i].addEventListener( "touchstart", mDown, false );
						// 		else			wb.childNodes[i].addEventListener( "mousedown",  mDown, false );
						// }
						// for ( var i=0; i<wb_absent.childNodes.length; i++ ){
						// 	if ( touchdevice )	wb_absent.childNodes[i].addEventListener( "touchstart", mDown, false );
						// 		else			wb_absent.childNodes[i].addEventListener( "mousedown",  mDown, false );
						// }

						var w = document.body.clientWidth;

						for ( var i=0; i<result.length; i++ ){
							var c = result[i];
							// var cc = addChild( c.coordi_top, ( w * ( c.coordi_left / 100 ) ),
							// var cc = addChild( c.coordi_top, c.coordi_left,
							var cc = addChild( c.coordi_top, c.coordi_left + '%',
								c.child_id, c.child_name, c.kana,
								c.child_type, c.child_grade, c.remark, c.escort, ( c.absent == 1 )?true : false, false );
							if ( c.checkout != '' && c.checkout != null )
								checkoutChild( cc, c.acc_id, c.checkout, c.direction );
						}

					} else{							// レコードが存在しなければ
						// wb.innerHTML 		= '';
						// wb_absent.innerHTML	= '';
					}

					//	WHITEBOARD_FRAMEのスクロール情報を初期化する
					document.getElementById('WHITEBOARD_FRAME').scrollTop = 0;
					showWhiteboardChildCount();
					oLog.log( null, 'load Whiteboard children ok.' );
					oLog.open( 3 );
				} else{
					oLog.log( null, 'loadWhiteboardChildren:' + xmlhttp.status );
					oLog.open( 3 );
				} 
				break;
		}
	};

	// xmlhttp.open("POST", "/accounts/whiteboardload", true );
	xmlhttp.open("POST", "/accounts/resultwhiteboard", true );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'day=' + day );
/*
	if ( xmlhttp.status == 200 ){
		var result = JSON.parse( xmlhttp.responseText );
		if ( result.length > 0 ){		//	レコードが存在すれば
			wb.innerHTML 		= result[0].whiteboard;
			wb_absent.innerHTML	= result[0].whiteboard_absent;

			//	チャイルドにイベントハンドラを割り当てる 
			for ( var i=0; i<wb.childNodes.length; i++ ){
				if ( touchdevice )	wb.childNodes[i].addEventListener( "touchstart", mDown, false );
					else			wb.childNodes[i].addEventListener( "mousedown",  mDown, false );
			}
			for ( var i=0; i<wb_absent.childNodes.length; i++ ){
				if ( touchdevice )	wb_absent.childNodes[i].addEventListener( "touchstart", mDown, false );
					else			wb_absent.childNodes[i].addEventListener( "mousedown",  mDown, false );
			}
		} else{							// レコードが存在しなければ
			wb.innerHTML 		= '';
			wb_absent.innerHTML	= '';
		}
		//	WHITEBOARD_FRAMEのスクロール情報を初期化する
		document.getElementById('WHITEBOARD_FRAME').scrollTop = 0;
		showWhiteboardChildCount();
	} else{
		oLog.log( null, 'loadWhiteboard:' + xmlhttp.status );
		oLog.open( 3 );
	} 
*/

}

//
//	ホワイトボードを保存する
//
function saveWhiteboard(){

	//	マーク状態をクリア
	resetChildMark();
	var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
	// 	r += 'save whiteboard';
	r += '</div>';
	r += '<div style="margin:0 auto;width:70%;font-size:18px;">';
		r += '<form name="guidedance_whiteboard_form" onsubmit="return false;" >';
		r += '<div>Date:</div>';
		r += '<div style="padding-bottom:20px;" >';
		r += '<input type="text" id="whiteboard_day" name="day" style="width:96px;font-size:16px;" readonly value="' + dayWhiteboard + '" />';
		r += '</div>';
		r += '<div>Description:</div>';
		r += '<div style="clear:both;font-size:12px;width:100%;height:60px;border:0px solid gray;" >';
		r += '<textarea id="WB_DESC" name="desc" style="width:100%;" >' + wb_description + '</textarea>';
		r += '</div>';
		r += '<div>Report:</div>';
		r += '<div style="clear:both;font-size:12px;width:100%;height:60px;border:0px solid gray;" >';
		r += '<textarea id="WB_REPORT" name="report" style="width:100%;" >' + wb_report + '</textarea>';
		r += '</div>';
		r += '</form>';
	r += '</div>';
	openModalDialog( 'save whiteboard', r, 'OK_CANCEL', saveWhiteboardHelper, null );
}

//
//	ホワイトボードを保存するヘルパー
//
function saveWhiteboardHelper(){

	var day = dayWhiteboard;
	//	whiteboardレコードを追加（存在すれば何もしない）
	createWhiteboardHelper( day );

	//	チルドレンのJSONデータを準備
	var json_children = getJSONChildren();

	//	whiteboardレコードを更新
	var rc = '';
	var wb = document.getElementById('WHITEBOARD');
	var wb_absent = document.getElementById('WHITEBOARD_ABSENT');

	var desc =  document.getElementById('WB_DESC').value;
	wb_description = desc;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/whiteboardupdate", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'day=' + day + '&desc=' + encodeURIComponent( desc ) +
				'&html=' + encodeURIComponent( wb.innerHTML ) +
				'&html_absent=' + encodeURIComponent( wb_absent.innerHTML ) +
				'&json_children=' + encodeURIComponent( JSON.stringify(json_children ) ) );

	// var progress = document.getElementById('SAVE_PROGRESS');
	// var r = '';
	if ( xmlhttp.status == 200){
		oLog.log( null, 'save whiteboard html data.' );
		// r += '<div>save whiteboard html data.</div>';
	} else{
		oLog.log( null, 'save whiteboard html data. FAILED' );
		// r += '<div>save whiteboard html data. FAILED</div>';
	}
	
	//	Results削除
	// rc = deleteChildResult( dayWhiteboard );
	// oLog.log( null, 'delete child results...' );
/*
	// チャイルドのセーブ
	var children = wb.childNodes;
	for ( var i=0; i<children.length; i++ ){
		var c = children[i];
		var day = dayWhiteboard;
		var child_id	= c.getAttribute('child_id');
		var checkin		= c.getAttribute('checkin');
		var estimate	= c.getElementsByClassName('ESTIMATE_TIME')[0].innerText;
		var checkout	= c.getAttribute('checkout');
		//	if ( checkout == null ) checkout = checkin;
		var escort		= ( c.hasAttribute('escort') )? 1:0;		// 0: no escort, 1: escort
		var direction	= c.getAttribute('direction');
		if ( direction == null ) direction = '';
		rc = saveChildResult( day, child_id, checkin, estimate, checkout, escort, direction, false );
		oLog.log( null, 'save child ' + c.getElementsByClassName('CHILD_NAME')[0].innerText + '(' + rc + ')' );
	}

	// 欠席チャイルドのセーブ
	var absents = wb_absent.childNodes;
	for ( var i=0; i<absents.length; i++ ){
		var c = absents[i];
		var day = dayWhiteboard;
		var child_id	= c.getAttribute('child_id');
		var checkin		= c.getAttribute('checkin');
		var estimate	= c.getElementsByClassName('ESTIMATE_TIME')[0].innerText;
		var checkout	= c.getAttribute('checkout');
		//	if ( checkout == null ) checkout = checkin;
		var escort		= ( c.hasAttribute('escort') )? 1:0;		// 0: no escort, 1: escort
		var direction	= c.getAttribute('direction');
		if ( direction == null ) direction = '';
		rc = saveChildResult( day, child_id, checkin, estimate, checkout, escort, direction, true );
		oLog.log( null, 'save absent child ' + c.getElementsByClassName('CHILD_NAME')[0].innerText + '(' + rc + ')' );
	}
*/	
	oLog.log( null, 'save process completed.' );
	oLog.open( 5 );

	updateFlg = false;

	// closeModalDialog();
}

//
// チルドレンのJSONデータ生成
//
function getJSONChildren(){
	var w = document.body.clientWidth;

	var jsonChildren = [];
	var children = document.getElementById('WHITEBOARD').childNodes;
	for ( var i=0; i<children.length; i++ ){
		var c = children[i];
		var child_id	= c.getAttribute('child_id');
		var coordi_top	= c.offsetTop;
		// var coordi_left	= c.offsetLeft;
		var coordi_left = Math.floor( c.offsetLeft / w * 10000 ) / 100;
		var checkin		= c.getAttribute('checkin');
		var estimate	= c.getElementsByClassName('ESTIMATE_TIME')[0].innerText;
		var checkout	= c.getAttribute('checkout');
		var operator	= c.getAttribute('operator');
		if ( operator == null ) operator = acc_id;
		var escort		= ( c.hasAttribute('escort') )? 1:0;		// 0: no escort, 1: escort
		var direction	= c.getAttribute('direction');
		if ( direction == null ) direction = '';
		var remark 		= ( c.hasAttribute('remark') )? decodeURIComponent( c.getAttribute('remark') ) : '';
		jsonChildren.push( {
			 'child_id' 	: child_id,
			 'checkin'		: checkin,
			 'estimate'		: estimate,
			 'checkout'		: checkout,
			 'operator'		: operator,
			 'direction'	: direction,
			 'escort'		: escort,
			 'coordi_top'	: coordi_top,
			 'coordi_left'	: coordi_left,
			 'remark'		: remark,
			 'absent' 		: 0
			 } );
	}
	var children = document.getElementById('WHITEBOARD_ESCORT').childNodes;
	for ( var i=0; i<children.length; i++ ){
		var c = children[i];
		var child_id	= c.getAttribute('child_id');
		var coordi_top	= c.offsetTop;
		// var coordi_left	= c.offsetLeft;
		var coordi_left = Math.floor( c.offsetLeft / w * 10000 ) / 100;
		var checkin		= c.getAttribute('checkin');
		var estimate	= c.getElementsByClassName('ESTIMATE_TIME')[0].innerText;
		var checkout	= c.getAttribute('checkout');
		var operator	= c.getAttribute('operator');
		if ( operator == null ) operator = acc_id;
		var escort		= ( c.hasAttribute('escort') )? 1:0;		// 0: no escort, 1: escort
		var direction	= c.getAttribute('direction');
		if ( direction == null ) direction = '';
		var remark 		= ( c.hasAttribute('remark') )? decodeURIComponent( c.getAttribute('remark') ) : '';
		jsonChildren.push( {
			 'child_id' 	: child_id,
			 'checkin'		: checkin,
			 'estimate'		: estimate,
			 'checkout'		: checkout,
			 'operator'		: operator,
			 'direction'	: direction,
			 'escort'		: escort,
			 'coordi_top'	: coordi_top,
			 'coordi_left'	: coordi_left,
			 'remark'		: remark,
			 'absent' 		: 0
			 } );
	}

	var children = document.getElementById('WHITEBOARD_ABSENT').childNodes;
	for ( var i=0; i<children.length; i++ ){
		var c = children[i];
		var child_id	= c.getAttribute('child_id');
		var coordi_top	= c.offsetTop;
		// var coordi_left	= c.offsetLeft;
		var coordi_left = Math.floor( c.offsetLeft / w * 10000 ) / 100;
		var checkin		= c.getAttribute('checkin');
		var estimate	= c.getElementsByClassName('ESTIMATE_TIME')[0].innerText;
		var checkout	= c.getAttribute('checkout');
		var operator	= c.getAttribute('operator');
		if ( operator == null ) operator = acc_id;
		var escort		= ( c.hasAttribute('escort') )? 1:0;		// 0: no escort, 1: escort
		var direction	= c.getAttribute('direction');
		if ( direction == null ) direction = '';
		var remark 		= ( c.hasAttribute('remark') )? decodeURIComponent( c.getAttribute('remark') ) : '';
		jsonChildren.push( {
			 'child_id' 	: child_id,
			 'checkin'		: checkin,
			 'estimate' 	: estimate,
			 'checkout'		: checkout,
			 'operator'		: operator,
			 'direction'	: direction,
			 'escort'		: escort,
			 'coordi_top'	: coordi_top,
			 'coordi_left'	: coordi_left,
			 'remark'		: remark,
			 'absent' 		: 1
			 } );
	}

	return jsonChildren;

}

//
//  チャイルド履歴追加
//
function saveChildResult( day, child_id, checkin, estimate, checkout, escort, direction, absent ){

	var acc_id = signid();
	var absentValue = ( absent )?1:0;
    var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/resultadd", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'acc_id=' + acc_id + '&day=' + day + '&child_id=' + child_id + '&checkin=' + checkin + '&estimate=' + estimate + '&checkout=' + checkout + '&escort=' + escort + '&direction=' + direction + '&absent=' + absentValue );
	if ( xmlhttp.status == 200 ){
        var result = JSON.parse( xmlhttp.responseText );
        //alert( result.status + result.message );
		return ( result != null )? result.status : 'error';	
	} else return 'error status:' + xmlhttp.status;

}

//
//	JSON形式のデータをnode.jsサーバに送信する
//
function saveChildResultJSON( jsondata ){
	var jsonText = JSON.stringify( jsondata );

    var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/resultadd", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/json" );
	xmlhttp.send( jsonText );

}

//
//
//	JSON形式のデータをnode.jsから受信する
//
function loadChildResultJON(){

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if ( this.readyState == 4 ){
			if ( this.status == 200 ){
				var jsondata = this.response;	// JSONデータ受け取り
			}
		}
	};

	xmlhttp.open("POST", "/accounts/resultget", true );
	xmlhttp.responseType = 'json';
	xmlhttp.send();

}


//  チャイルド履歴削除
//
function deleteChildResult( day ){

    var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/resultdelete", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'day=' + day );
	if ( xmlhttp.status == 200 ){
        var result = JSON.parse( xmlhttp.responseText );
        //alert( result.status + result.message );
		return ( result != null )? result.status : 'error';	
	} else return 'error status:' + xmlhttp.status;

}

//
//	ホワイトボードをクローズ
//
function closeWhiteboard(){
	//	マーク状態をクリア
	resetChildMark();
	var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
		r += 'close whiteboard';
	r += '</div>';
//	r += "<div id='SAVE_STATUS' style='height:20px;text-align:center;' >status</div>";
	r += '<div style="margin:0 auto;width:70%;">';
		r += '<form name="guidedance_whiteboard_form" onsubmit="return false;" >';
		r += '<div>Date:</div>';
		r += '<div style="padding-bottom:20px;" >';
		r += '<input type="text" id="whiteboard_day" name="day" style="width:96px;" readonly value="' + dayWhiteboard + '" />';
		r += '</div>';
		r += '</form>';
		r += '<div>Progress:</div>';
		r += '<div id="CLOSE_PROGRESS" style="clear:both;width:100%;height:100px;border:1px solid gray;overflow:auto;" >';
		r += '</div>';
		r += '<button id="BTN_CLOSEWHITEBOARD" type="button"  style="width:100px;height:20px;font-size:12px;" onclick="closeWhiteboardHelper();" >Close</button>';
	r += '</div>';
	openModalDialog( 'close whiteboard', r, 'NORMAL', null, null );

}

function closeWhiteboardHelper(){
	dayWhiteboard 		= null;
	openWhiteboardFlg	= false;
	updateFlg			= false;
	ctlToolbar();
	openWhiteboard();
}

//
//	ホワイトボード表示切換
//
function turnWhiteboard(){
	switch ( openWhiteboardFlg ){
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
	openWhiteboardFlg = false;
	var wb  = document.getElementById('WHITEBOARD');
	var wba = document.getElementById('WHITEBOARD_ABSENT');
	wb.style.visibility = 'hidden';
	wba.style.visibility = 'hidden';

}

//
//	ホワイトボードを表示（操作可能）
//
function visibleWhiteboard(){
	openWhiteboardFlg = true;
	var wb  = document.getElementById('WHITEBOARD');
	var wbe = document.getElementById('WHITEBOARD_ESCORT');
	var wba = document.getElementById('WHITEBOARD_ABSENT');
	wb.style.visibility = 'visible';
	wbe.style.visibility = 'visible';
	wba.style.visibility = 'visible';
	oNav.open();
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
				if ( document.getElementById('WHITEBOARD') == e.target ){
					resetChildMark();
					//closeChildFinder();
					// oSpotlight.close();
				}
			} else {
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
	icc.innerText = 'Ky:' + e.keyCode + ' tg:' + e.target.tagName;
	switch ( e.keyCode ){
		case 46:	//Delete
			var children = getMarkedChild();
			if ( children.length != 0)
				deleteWhiteboardChild();		//マークしたチャイルドの削除操作 
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
	// this.size 			= 60 ;

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
	m.setAttribute('id',    'NAVI2' );
	m.setAttribute('class', 'not_select' );
	m.style.position		= 'absolute';
	m.style.top 			= ( ( h / 2 ) - ( 126 / 2 ) ) + 'px';
	// m.style.left			= ( ( w / 2 ) - this.size )+ 'px';
	m.style.left			= '0px';
	m.style.width			= '126px';
	m.style.height			= '126px';
	m.style.color			= 'snow';
	m.style.backgroundColor	= 'transparent';
	m.style.fontSize		= '14px';
	// m.style.pointerEvents	= 'none';
	m.style.zIndex			= 65000;
	m.style.visibility		= 'hidden';
	var r = '';
	r += '<div                        class="vh-center nav_icon2" style="position:absolute;top:42px;left:42px;" >';
		r += '&nbsp;';
	r += '</div>';
	r += '<div marked="yes" target="escort"        class="vh-center nav_icon2" style="position:absolute;top:84px;left:42px;" >';
		r += '<img width="22px" src="./images/family.png" />';
	r += '</div>';
	// r += '<div target="close" class="vh-center nav_icon2" style="position:absolute;top:84px;left:42px;" >';	//	Close NAV
	// 	r += '<img width="16px" src="./images/cancel.png" />';
	// r += '</div>';
	r += '<div marked="yes" target="delete"        class="vh-center nav_icon2" style="position:absolute;top:0px;left:42px;" >';	// Delete Mark Child
		r += '<img width="22px" src="./images/minus-2.png" />';
	r += '</div>';
	r += '<div marked="yes" target="checkout"      class="vh-center nav_icon2" style="position:absolute;top:21px;left:84px;" >';	// Checkout Mark Child
		r += '<img width="22px" src="./images/check-3.png" />';
	r += '</div>';
	r += '<div marked="yes" target="checkoutclear" class="vh-center nav_icon2" style="position:absolute;top:63px;left:84px;" >';	// Checkout Clear Mark Child
		r += '<img width="22px" src="./images/dry-clean.png" />';
	r += '</div>';
	r += '<div marked="yes" target="property"      class="vh-center nav_icon2" style="position:absolute;top:21px;left:0px;" >';	// Checkout Mark Child
		r += '<img width="22px" src="./images/hexagon.png" />';
	r += '</div>';
	r += '<div marked="yes" target="absent" class="vh-center nav_icon2" style="position:absolute;top:63px;left:0px;" >';	// Checkout Clear Mark Child
		r += '<img width="22px" src="./images/sleep-2.png" />';
	r += '</div>';
	r += '<div target="exchange"   class="vh-center nav_icon2" style="position:absolute;top:105px;left:84px;height:21px;" >';
		r += '<img width="12px" src="./images/exchange.png" />';
	r += '</div>';

	m.innerHTML				= r;
	this.frame = document.body.appendChild( m );
	this.frame.addEventListener( this.evtStart,
		( function(e){
			var o = ( this.touchdevice )? e.changedTouches[0].target : e.target;
			if ( o == this.frame ) return;
			while ( true ){
				if ( ! ( 'parentNode' in o ) ) return;
				if ( o.parentNode == this.frame ) break;
				else o = o.parentNode;
			}

		}).bind( this ), false );
	this.frame.addEventListener( this.evtMove,
		( function(e){}).bind( this ), false );
	this.frame.addEventListener( this.evtEnd,
		( function(e){
			var o = ( this.touchdevice )? e.changedTouches[0].target : e.target;
			if ( o == this.frame ) return;
			if ( ! ( 'parentNode' in o ) ) return;
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

		this.frame.style.top 		= ( ( h / 2 ) - ( this.frame.offsetHeight / 2 ) ) + 'px';
		// this.frame.style.left		= ( ( w / 2 ) - this.size )+ 'px';
		this.frame.style.left		= '0px';
		this.frame.style.visibility	= 'visible';
		commonProc();
	},
	close : function(){
		this.frame.style.visibility	= 'hidden';
		commonProc();
	},
	opened : function(){
		return ( this.frame.style.visibility == 'visible');
	},
	proc : function( o ){
		switch ( o.getAttribute('target')) {
			case 'delete':
				this.close();
				deleteWhiteboardChild();
				break;
			case 'checkout':
				this.close();
				checkoutWhiteboardChild();
				break;
			case 'checkoutclear':
				this.close();
				checkoutClearWhiteboardChild();
				break;
			case 'escort':
				this.close();
				escortChild();
				// escortWhiteboardChild();
				break;
			case 'property':
				this.close();
				propertyWhiteboardChild();
				break;
			case 'absent':
				this.close();
				absentWhiteboardChild();
				break;
			case 'exchange':
				this.close();
				exchange();
			case 'close':
				this.close();
				break;
		}
	}
};

//
//	モーダルダイアログをオープン
//
function openModalDialog( title, r , option, proc, dialog_size ){
	// タイムセレクタを非表示
	palleteTimeSelector.close();
	var w = document.body.clientWidth;
	var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;

	var mo      = document.getElementById('MODAL_OVERLAY');
	var mt	    = document.getElementById('MODAL_TITLE');
	var mframe  = document.getElementById('MODAL_MESSAGE_FRAME');
	var mmh     = document.getElementById('MODAL_MESSAGE_HEADER');
	var mm      = document.getElementById('MODAL_MESSAGE');
	var mmf     = document.getElementById('MODAL_MESSAGE_FOOTER');

	switch ( dialog_size ){
		case 'MAX':
			var wfh = document.getElementById('WHITEBOARD_FRAME').offsetHeight;
			mframe.style.height = ( wfh - 8 ) + 'px';
			mm.style.height		= ( wfh - 8 - 73 ) +  'px';
			mframe.style.width	= '100%';
			mo.style.opacity	= 1;
			break;
		case 'SIGNIN':
		case 'SIGNOUT':
		case 'OPENWHITEBOARD':
			mframe.style.width	= '350px';
			mframe.style.height	= '';
			mo.style.opacity	= 0.7;
			break;
		default:
			mframe.style.height = '400px';
			mframe.style.width	= '';
			mm.style.height		= '327px';
			mo.style.opacity	= 1;
			break;
	}
	mt.innerText = ( title != null )? title : '';
	mm.innerHTML = r;

	var f = '';
	switch ( option ){
		case 'NOBUTTON':
			f += '';
			break;
		case 'OK_CANCEL':
			f += '<button id="MDL_OK"     type="button"  >OK</button>';
			f += '<button id="MDL_CANCEL" type="button" onclick="closeModalDialog();" >Cancel</button>';
			break;
		case 'CANCEL':
			f += '<button id="MDL_CANCEL" type="button" onclick="closeModalDialog();" >Cancel</button>';
			break;
		case 'NORMAL':
		default:
			f += '<button id="MDL_CLOSE"  type="button" onclick="closeModalDialog();" >Close</button>';
			break;
	}
	f += '&nbsp;&nbsp;';
	mmf.innerHTML = f;
	mo.style.visibility = 'visible';
	if ( proc != null ){
		document.getElementById('MDL_OK').addEventListener( 'click',
			function(e){
				proc();
				closeModalDialog();
			}, false );
	}
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
//	モーダルダイアログが開いているかをチェック
//	true: open / false : close
function isModalDialog(){
	var mo  = document.getElementById('MODAL_OVERLAY');
	return ( mo.style.visibility != 'hidden' );

}

//
//	ホワイトボードエリアのフィッティング処理
//
function fitting(){
	var w = document.body.clientWidth;
	var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;

	var tb_height = document.getElementById('TOOLBAR').offsetHeight;
	var tb_height = 0;
	// var sts_height = document.getElementById('STATUS').offsetHeight;
	var sts_height = 0;
	// console.log('status height:' + sts_height );
	var wbf = document.getElementById('WHITEBOARD_FRAME');
	wbf.style.height = ( h - tb_height - sts_height ) + 'px';

	// var rptf = document.getElementById('REPORT_FRAME');
	// rptf.style.height = wbf.style.height;

	var wb = document.getElementById('WHITEBOARD');
//	wb.style.width   = ( w - 70 ) + 'px';

	// var cpf  = document.getElementById('CHILDREN_PALLETE_FRAME');
	// cpf.style.height  = ( h -tb_height - sts_height ) + 'px';
	// cpf.style.left    = ( w - 42 ) + 'px';

	// var cpc = document.getElementById('CHILDREN_PALLETE_CONTENT');
	// cpc.style.height	= ( cpf.offsetHeight - parseInt(cpc.style.marginTop ) - 1 ) + 'px'; 

	// var sts = document.getElementById('STATUS');
	// sts.style.top		= ( h - sts_height ) + 'px';

	var nsi = document.getElementById('NAV_START_ICON');
	nsi.style.top = ( ( h / 2 ) - ( nsi.offsetHeight / 2) ) + 'px';
	//	NAVリロケーション
	if ( oNav.opened() ){
		oNav.frame.style.top	= ( ( h / 2 ) - ( oNav.frame.offsetHeight / 2 ) ) + 'px';
		// oNav.frame.style.left	= ( ( w / 2 ) - ( oNav.frame.offsetWidth  / 2 ) ) + 'px';	
		oNav.frame.style.left	= '0px';
	}

	var nsi2 = document.getElementById('NAV_START_ICON2');
	nsi2.style.top = ( ( h / 2 ) - ( tb_height + ( nsi2.offsetHeight / 2 ) ) ) + 'px';
	nsi2.style.left	= ( w - 42 ) + 'px';

	var cfm = document.getElementById('CHILDFINDER_MAIN');
	if ( cfm != null ){
		var cff 	= document.getElementById('CHILDFINDER_FRAME')
		var cfh   	= document.getElementById('CHILDFINDER_HEADER');
		var h 		= cff.offsetHeight - cfh.offsetHeight;
		// console.log( 'cfm height:' + h );
		cfm.style.height = h + 'px';
	}

	// レポートダイアログのサイズ調整
	oReportDlg.init();

	if ( w <= 414){
		//document.getElementById('OPAQUESHAFT_TITLE').style.display = 'none';
		// document.getElementById('ID_PROGRESS').style.display = 'none';
		// document.getElementById('ID_PROGRESS_COUNT').style.display = 'none';
		// document.getElementById('ID_WHITEBOARD_CHILD_COUNT_ABSENT').style.display = 'none';
		document.getElementById('WHITEBOARD_DAY_FRAME').style.display = 'none';
	} else{
		// document.getElementById('OPAQUESHAFT_TITLE').style.display = 'inline';
		// document.getElementById('ID_PROGRESS').style.display = 'inline';
		// document.getElementById('ID_PROGRESS_COUNT').style.display = 'inline';
		// document.getElementById('ID_WHITEBOARD_CHILD_COUNT_ABSENT').style.display = 'inline';
		document.getElementById('WHITEBOARD_DAY_FRAME').style.display = 'inline';
	}


}


//
//	チルドレンパレットのフォールディング
//
/*
var flagChildrenPallete = false;
var countOpenChildrenPallete = 0;
function foldingChildrenPallete(){
	var cpf = document.getElementById('CHILDREN_PALLETE_FRAME');
	var mleft = parseInt( cpf.style.marginLeft );
	//alert( '[' + cpf.style.marginLeft + ']' );
	if ( mleft == 0 || isNaN(mleft ) ){
		cpf.style.marginLeft = '-168px';	// open pallete
		flagChildrenPallete = true;
		countOpenChildrenPallete++;
		if ( countOpenChildrenPallete == 1 )
			makeChildrenPalleteList();
	} else {
		cpf.style.marginLeft = '0px';		// close pallete
		flagChildrenPallete = false;
	}
}
*/

//
//	サインイン・アウト時のUIデザイン
//
function ctlToolbar(){
	if ( checkSign() && openWhiteboardFlg ) {
		showToolbar();
	} else {
		hideToolbar();
	}
	oTile.close();
	oSpotlight.close();
	// if ( flagChildrenPallete ) foldingChildrenPallete();

}

function showToolbar(){
	var nsi 	= document.getElementById('NAV_START_ICON');
	var nsi2 	= document.getElementById('NAV_START_ICON2');
	var tb      = document.getElementById('TOOLBAR');
	var wbf     = document.getElementById('WHITEBOARD_FRAME');
	// var is		= document.getElementById('ID_SEARCH');
	// var ic		= document.getElementById('ID_CHILDREN');
	var tlb		= document.getElementById('ID_TIMELINE_BAR');
	var psb		= document.getElementById('ID_PERSPECTIVE_BAR');
	var eam		= document.getElementById('ESCORT_AREA_MARKER');
	nsi.style.visibility	= 'visible';
	nsi2.style.visibility	= 'visible';
	tb.style.visibility     = 'visible';
	wbf.style.visibility    = 'visible';
	// is.style.visibility		= 'visible';
	// ic.style.visibility		= 'visible';
	tlb.style.visibility	= 'visible';
	psb.style.visibility	= 'visible';
	eam.style.visibility	= 'visible';
	visibleWhiteboard();

}

function hideToolbar(){
	console.log('hideToolbar');
	var nsi 	= document.getElementById('NAV_START_ICON');
	var nsi2 	= document.getElementById('NAV_START_ICON2');
	var tb      = document.getElementById('TOOLBAR');
	var wbf     = document.getElementById('WHITEBOARD_FRAME');
	// var is		= document.getElementById('ID_SEARCH');
	// var ic		= document.getElementById('ID_CHILDREN');
	var tlb		= document.getElementById('ID_TIMELINE_BAR');
	var psb		= document.getElementById('ID_PERSPECTIVE_BAR');
	var eam		= document.getElementById('ESCORT_AREA_MARKER');
	nsi.style.visibility	= 'hidden';
	nsi2.style.visibility	= 'hidden';
	tb.style.visibility     = 'hidden';
	wbf.style.visibility    = 'hidden';
	// is.style.visibility		= 'hidden';
	// ic.style.visibility		= 'hidden';
	tlb.style.visibility	= 'hidden';
	psb.style.visibility	= 'hidden';
	eam.style.visibility	= 'hidden';
	hiddenWhiteboard();

}

function getCookie(){
	var c = document.cookie;
	oLog.log( null, c );
	oLog.log( null, 'checkSign:' + checkSign() );
	// alert("[" + c + "]");
	// alert( checkSign() );
}

//
//	サインインしているかをチェック
//
function checkSign(){
	var c = document.cookie;
	if ( c.indexOf( 'acc=') > -1 ){
		var token = c.split('&');
		for ( var i=0; i<token.length; i++ ){
			var kv = token[i].split('=');
			for ( var j=0; j<kv.length; j+=2){
				if ( kv[j] == 'acc' ) acc_id = kv[j+1];
			}
		}
	}
	return  ( c.indexOf( 'acc=') > -1 );
}

//
//	サインインIDを取得する
//
function isSignId(){
	return acc_id;
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

	} catch ( e ) {
		oLog.log( null, 'postWebBackend:' + e );
		oLog.open( 3 );
		// alert( e );
	}

}

//
//	サインアウトフォーム
//
function signoutForm(){

	var r = "";	
	r += "<div style='width:350px;height:;margin:10px auto;background-color:white;overflow:hidden;' >";
		r += "<div style='height:40px;padding-top:20px;text-align:center;font-size:20px;' >Sign out</div>";
		r += "<div id='SIGNIN_STATUS' style='height:20px;text-align:center;' >status</div>";
		r += "<div style='margin:10px auto;width:210px;' >";
		r += "</div>";
	r += "</div>";

	openModalDialog( 'sign out', r, 'OK_CANCEL', signout, 'SIGNOUT' );

}


//
//	サインアウト処理（同期処理）
//
function signout(){

	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
				break;
			case 2://header received
				break;
			case 3://loading
				oLog.log( null, 'signout...' );
				oLog.open( 3 );
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					if ( result != null ){
						switch( result.cmd ){
							case 'signout':
								oLog.log( null, 'signout...ok.' );
								oLog.open( 1 );
								acc_id = null;
								signForm();
								break;
							default:
								break;
						}
					}
				}
				break;
		}
	}

	xmlhttp.open("POST", "/accounts/signout", true );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send();
	// acc_id = null;
	// signForm();
}

function showSignid(){
	var id = signid();
	oLog.log( null, 'signid:' + id );
	oLog.open( 3 );
	// alert( id );
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
var acc_id = null;
function sign()
{
	var r = "";
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
				break;
			case 2://header received
				break;
			case 3://loading
				oLog.log( null, 'signin...' );
				oLog.open( 3 );
				break;
			case 4://done
				r = '';
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					switch( result.cmd ){
						case 'signin':
							if ( result.status == 'SUCCESS' ){
								oLog.log( null, 'signin ok.' );
								oLog.open( 3 );
								acc_id = result.acc_id;
								if ( !openWhiteboardFlg ){
									openWhiteboard();
								}
							} else {
								oLog.log( null, 'signin error.' );
								oLog.open( 3 );
							}
							break;
						default:
							oLog.log( null, 'sign:cmd:' + result );
							oLog.open( 3 );
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
/*
		r = "";
		if ( xmlhttp.status == 200 ){
			var result = JSON.parse( xmlhttp.responseText );
			switch( result.cmd ){
				case 'signin':
					var o = document.getElementById('SIGNIN_STATUS');
					if ( result.status == 'SUCCESS' ){
						acc_id = result.acc_id;
						if ( !openWhiteboardFlg ){
							openWhiteboard();
						}
				
					} else {
						r += 'sign in error'
					}
					o.innerText = r;
					break;
				default:
					oLog.log( null, 'sign:cmd:' + result );
					oLog.open( 3 );
					// alert( 'cmd:' + result );
					break;
			}
		} else{
			oLog.log( null, 'sign:status:' + xmlhttp.status );
			oLog.open( 3 );
			// alert( xmlhttp.status );
		}
*/
	} catch ( e ) {
		oLog.log( null, 'sign:e:' + e );
		oLog.open( 3 );
	}
}


//
//	ホワイトボードメニュー
//
/*
function whiteboardMenu( e ){
	console.log('whiteboardMenu:' + e.target.getAttribute('id'));
	e.stopPropagation();
	if ( document.getElementById('WHITEBOARD_SUBMENU') != null ){
		// var p = document.getElementById('WHITEBOARD_DAY_FRAME');
		var p = document.getElementById('OPAQUESHAFT_TITLE');
		var c = document.getElementById('WHITEBOARD_SUBMENU');
		p.removeChild( c );
		return;
	}
	var o = document.createElement('DIV');
	o.setAttribute( 'id', 'WHITEBOARD_SUBMENU');
	o.style.position		= 'relative';
	o.style.padding			= '4px';
	o.style.top             = '26px';
	o.style.left            = '0px';
	o.style.width           = '200px';
	o.style.height          = '300px';
	o.style.color			= ' gray';
	o.style.backgroundColor = '#EEEEEE';
	o.style.textAlign		='left';
	o.style.fontSize		= '18px';
	o.style.zIndex			= 50000;
	o.innerText = 'whiteboard menu...';
	// var p = document.getElementById('WHITEBOARD_DAY_FRAME');
	var p = document.getElementById('OPAQUESHAFT_TITLE');
	var m = p.appendChild( o );

	var id = signid();

	var r = '';
	r += '<div id="ID_LOAD_WHITEBOARD"   style="height:28px;padding-top:2px;padding-left:16px;background-image:url(./images/cloud-computing.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >open whiteboard</div>';
	r += '<div id="ID_SAVE_WHITEBOARD"   style="height:28px;padding-top:2px;padding-left:16px;background-image:url(./images/upload.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >save whiteboard</div>';
	r += '<div id="ID_CLOSE_WHITEBOARD"  style="height:28px;padding-top:2px;padding-left:16px;background-image:url(./images/cancel.png);background-size:10px;background-position:left center;background-repeat:no-repeat;" >close</div>';
	r += '<div id="ID_CLEAR_WHITEBOARD"  style="height:28px;padding-top:2px;padding-left:16px;background-image:url(./images/eraser.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >clear whiteboard</div>';
	r += '<div id="ID_REPORT_WHITEBOARD" style="height:28px;padding-top:2px;padding-left:16px;background-image:url(./images/report.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >report...</div>';
	r += '<div id="ID_ABSENT_WHITEBOARD" style="height:28px;padding-top:2px;padding-left:16px;background-image:url(./images/sleep-2.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >absent...</div>';
	r += '<div id="ID_SIGN_OUT"          style="height:28px;padding-top:4px;padding-left:18px;background-image:url(./images/exit.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >sign out</div>';
	r += '<div id="ID_PROPERTY_ACCOUNT"  style="height:28px;padding-top:4px;padding-left:18px;background-image:url(./images/user.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >property...</div>';
	m.innerHTML = r;

	new Button( 'ID_SAVE_WHITEBOARD',   saveWhiteboard         ).play();
	new Button( 'ID_LOAD_WHITEBOARD',   openWhiteboard         ).play();
	new Button( 'ID_CLOSE_WHITEBOARD',  closeWhiteboard        ).play();
	new Button( 'ID_CLEAR_WHITEBOARD',  clearWhiteboard        ).play();
	new Button( 'ID_REPORT_WHITEBOARD', reportWhiteboard       ).play();
	new Button( 'ID_ABSENT_WHITEBOARD', absentWhiteboard       ).play();

	new Button( 'ID_SIGN_OUT', signout ).play();
	new Button( 'ID_PROPERTY_ACCOUNT', propertyAccount ).play();


	p.addEventListener('mouseleave', function(e) {
		var c = document.getElementById('WHITEBOARD_SUBMENU');
		if ( c!= null ) p.removeChild( c );
		console.log('out;' + e.relatedTarget.getAttribute('id') );

	});
	m.addEventListener('mouseleave', function(e) {
		var p = document.getElementById('OPAQUESHAFT_TITLE');
		// var p = document.getElementById('WHITEBOARD_DAY_FRAME');
		var c = document.getElementById('WHITEBOARD_SUBMENU');
		p.removeChild( c );

	});
	m.addEventListener('mouseup', function(e) {
		e.stopPropagation();
	});

}
*/

//
//	サインインメニュー(右上メニュー)
//
/*
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
	o.style.padding			= '4px';
	o.style.top             = '8px';
	o.style.left            = '-117px';
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
	// r += '<div id="ID_SIGN_OUT"         style="height:20px;padding-top:4px;padding-left:18px;background-image:url(./images/exit.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >sign out</div>';
	// r += '<div id="ID_PROPERTY_ACCOUNT" style="height:20px;padding-top:4px;padding-left:18px;background-image:url(./images/user.png);background-size:14px;background-position:left center;background-repeat:no-repeat;" >property...</div>';
	// r += '<div id="ID_CURRENT_ACCOUNT"  style="height:20px;padding-top:4px;padding-left:18px;" >sign in ' + id + '</div>';
	m.innerHTML = r;

	// new Button( 'ID_SIGN_OUT', signout ).play();
	// new Button( 'ID_PROPERTY_ACCOUNT', propertyAccount ).play();

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
*/
//
//	サインインフォーム
//
function signForm()
{
	if ( checkSign()) {
		oLog.log( null, 'already signin.');
		oLog.open( 3 );
		return;
	}

	// ツールバーの表示制御(サインイン、サインアウトによる制御)
	ctlToolbar();
	// hiddenWhiteboard();
	oNav.close();
	oTile.close();
	oSpotlight.close();
	// if ( flagChildrenPallete ) foldingChildrenPallete();

	
	var r = "";	
	r += "<div style='width:350px;height:;margin:10px auto;background-color:white;overflow:hidden;' >";
		r += "<div style='height:40px;padding-top:20px;text-align:center;font-size:20px;' >Sign in to your account</div>";
		r += "<div id='SIGNIN_STATUS' style='height:20px;text-align:center;' >status</div>";
		r += "<div style='margin:10px auto;width:210px;' >";
			r += "<form name='sign_form' onsubmit='return false;' >";
			r += "<div>ID:</div>";
			r += "<div><input style='width:200px;' type='text' id='acc_id' name='id' tabindex=1 autocomplete='off' /></div>";
			r += "<div style='padding-top:20px;' >Password:</div>";
			r += "<div><input style='width:200px;height:18px;' type='password' name='pwd' tabindex=2 /></div>";
			r += "<div style='padding-top:20px;text-align:center;' >";
				r += "<button style='background-color:transparent;border:none;' onclick='sign()' ><img width='50px;' src='/images/arrow-right.png' ></button>";
			r += "</div>";
			r += "</form>";
		r += "</div>";
	r += "</div>";

	// var children = document.getElementById('WHITEBOARD').childNodes;
	// neverCloseDialog = ( children.length == 0 ) ? true : false;
	neverCloseDialog = true;
	openModalDialog( null, r, 'NOBUTTON', null, 'SIGNIN' );
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
	} catch ( e ) {
		oLog.log( null, 'makeWhiteboardList : ' + e );
		oLog.open( 3 );
		// alert( e );
	}

}

//
//	ホワイトボードリスト用DIV生成
//
function addWhiteboardManage( oParent, Result ){

	var c = document.createElement("DIV");
	c.setAttribute("whiteboard_id",  Result.child_id );
	c.setAttribute('class', 'whiteboard_box');
	// c.style.float			= 'left';
	// c.style.width			= '100px';
	// c.style.height			= '50px';
	// c.style.backgroundColor	= 'rgb(241,241,241)';
	// c.style.border			= '1px solid lightgrey';
	// c.style.margin			= '1px';
	// c.style.fontSize		= '18px';

	var day = new Date( Result.day );
	var c_children	= Result.c_children;
	var ymd = day.getFullYear() + '/' + ( '00' + (day.getMonth() + 1 ) ).slice(-2) + '/' + ( '00' + day.getDate() ).slice(-2);

	var r = '';
    r += '<div style="text-align:center;"  >';
    	r += ymd;
    r += '</div>';
    r += '<div style="text-align:center;" >';
    	r += c_children + ' child';
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
/*
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

	} catch ( e ) {
		oLog.log( null, 'makeChildrenPalleteList : ' + e );
		// alert( e );
	}
}
*/

//
//	チャイルド選択し、プロパティ表示
//
// function selectChild( e ){
// 	var c = scanChild( e.target );
// 	if ( c != null ){
// 		var id = c.getAttribute('child_id');
// 		console.log( c.getAttribute( id ));
// 		propertyChild2( id );
// 	}
// }

//
//	パレット内のチャイルド選択
//
/*
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
*/

//
//	セレクトしたチャイルドをホワイトボードにチェックイン
//
function checkinSelectedChild( hm ){
	// var cpc = document.getElementById('CHILDREN_PALLETE_CONTENT').childNodes;
	var ffct2 = null;
	if ( document.getElementById('FOLDER_FIND_CHILDREN_TABLE2') != null )
		ffct2 = document.getElementById('FOLDER_FIND_CHILDREN_TABLE2').childNodes;
	var arHM = hm.split(':');
	
	var top		= ( parseInt( arHM[0] ) - 8 ) * pixelPerHour;
	var left	= ( parseInt( arHM[1] ) ) + 42;				// 42px タイムライン分右にオフセット
	console.log( 'hm:' + hm );
	console.log( 'top:' + top + ' left:' + left );
	var cursor	= 0;

	// CHILDREN_PALLETE
/*	
	for ( var i=0; i<cpc.length; i++ ){
		var c = cpc[i];
		if ( c.hasAttribute('selected') ){
			var id = c.getAttribute('child_id');
			var child_name	= c.getElementsByClassName('CHILD_NAME')[0].innerText;
			var kana		= c.getAttribute('kana');
			var child_type	= c.getAttribute('child_type');
			var child_grade	= c.getAttribute('child_grade');
			if ( alreadyExistChildOnWhiteboard( id ) ){
				c.classList.remove('selected');
				c.removeAttribute('selected');
				// c.style.color = '';
				// c.style.backgroundColor = '';	
				oLog.log( null, child_name + ' : すでにホワイトボードに配置されています.');
				oLog.open( 3 );
				continue;
			} 
			addChild( top + ( cursor * 20 ), left + ( cursor * 0 ), id, child_name, kana, child_type, child_grade, null, false, false, false );
			cursor++;
			c.classList.remove('selected');
			// c.style.color = '';
			// c.style.backgroundColor = '';
			c.removeAttribute('selected');
		}
	}
*/

	// FOLDER_FIND_CHILDREN_TABLE2
	if ( ffct2 != null ){
		for ( var i=0; i<ffct2.length; i++ ){
			var c = ffct2[i];
			if ( c.hasAttribute('selected') ){
				var id = c.getAttribute('child_id');
				var child_name	= c.getElementsByClassName('CHILD_NAME')[0].innerText;
				var kana		= c.getAttribute('kana');
				var child_type	= c.getAttribute('child_type');
				var child_grade	= c.getAttribute('child_grade');
				if ( alreadyExistChildOnWhiteboard( id ) ){
					c.classList.remove('selected');
					c.removeAttribute('selected');
					// c.style.color = '';
					// c.style.backgroundColor = '';		
					oLog.log( null, child_name + ' : すでにホワイトボードに配置されています.');
					oLog.open( 3 );
					continue;
				} 
				addChild( top + ( cursor * 20 ), left + ( cursor * 0 ), id, child_name, kana, child_type, child_grade, null, false, false, false );
				cursor++;
				c.classList.remove('selected');
				// c.style.color = '';
				// c.style.backgroundColor = '';
				c.removeAttribute('selected');
			}
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
//	チャイルドプロパティフォーム
//
// function propertyChild2( id ){
// 	var r = '';
// 	var oChild = getChild( id );
// 	r += makeChildForm( oChild );
// 	openModalDialog( null, r, 'NORMAL', null, null );

// }


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
	var h = 8 + Math.floor( top / pixelPerHour );		//200px:1hour
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
	var t_id = null;
	curChild = this;

	var w = document.body.clientWidth;
	var ratioLeft = Math.floor( curChild.offsetLeft / w * 10000 ) / 100;

	console.log('mDown:' + '(' + curChild.offsetLeft + '/' + w + ')' + ratioLeft );
	//クラス名に .drag を追加
	curChild.classList.add("drag");
	curChildZIndex = curChild.style.zIndex;
	curChild.style.zIndex = 2001;
	//タッチイベントとマウスのイベントの差異を吸収
	if(e.type === "mousedown") {
		var event = e;
	} else {
		var event = e.changedTouches[0];
		console.log( 'touchstart identifier:' + event.identifier );
		t_id = event.identifier;
		// マルチタップ
		if ( e.changedTouches.length > 1 ){
			if ( e.changedTouches[0].identifier == e.changedTouches[1].identifier )
				propertyWhiteboardChild( this );
		}
	}
	//e.stopPropagation();
	//要素内の相対座標を取得
	y = event.pageY - curChild.offsetTop;
	x = event.pageX - curChild.offsetLeft;
	
	var icc = document.getElementById('ID_CHILD_COORDINATE');
	icc.innerText = curChild.style.top + ' x ' + curChild.style.left + '(' + t_id + ')';

	//ムーブイベントにコールバック
	// document.body.addEventListener("mousemove", mMove, { passive : false } );
	// document.body.addEventListener("touchmove", mMove, { passive : false } ) ;	
	
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

}

//
//	チャイルド操作
//
function mMove( e ){
	var touchdevice = ( 'ontouchend' in document );
	var w = document.body.clientWidth;

	console.log('mMove:' + e.type );
	//ドラッグしている要素を取得
	//var drag = document.getElementsByClassName("drag")[0];
//		var drag = e.target;
	var drag = curChild;

	if ( drag == null ) return;

	curChildMoved   = true;

	//チェックアウト(checkout)しているチャイルドは対象外
	//if ( drag.hasAttribute('checkout')) return;

	//同様にマウスとタッチの差異を吸収
	if(e.type === "mousemove") {
		var event = e;
	} else {
		var event = e.changedTouches[0];
		console.log( 'touchmove identifier:' + event.identifier );

	}

	//フリックしたときに画面を動かさないようにデフォルト動作を抑制
	if ( e.type != "mouseover" ){
		e.preventDefault();
		e.stopPropagation();
	}else{
		e.stopPropagation();
	}

		//
	var wb_height = document.getElementById('WHITEBOARD').offsetHeight;
	var wb_width  = document.getElementById('WHITEBOARD').offsetWidth;
	wb_height -= drag.offsetHeight / 2;
	wb_width  -= drag.offsetWidth  / 2;
	//マウスが動いた場所に要素を動かす
	if ( e.type == 'touchmove' 
		|| (( e.buttons & 1 ) && e.type == 'mousemove' ) ){
		var old_top  = drag.offsetTop;
		var old_left = drag.offsetLeft;
		if ( ( event.pageY - y ) < 0 || ( event.pageX - x ) < 0 ) return;
		if ( ( event.pageY - y ) >= wb_height || ( event.pageX - x  ) >= wb_width  ) return;
		//if ( !checkOtherChildCoordinate( drag, event.pageX - x, event.pageY - y ) ) return;
		if ( !checkOtherChildCoordinate( drag, event.pageX - x - old_left, event.pageY - y - old_top ) ) return;
		drag.style.top  = event.pageY - y + "px";
		// drag.style.left = event.pageX - x + "px";
		drag.style.left = ( Math.floor( ( event.pageX - x ) / w * 10000 ) / 100 ) + '%';

		updateFlg		= true;
		delta_x = ( event.pageX - x ) - old_left;
		delta_y = ( event.pageY - y ) - old_top;
		if ( isMarkedChild( drag ) )
			moveOtherChild( drag, delta_x, delta_y );

		var et = drag.getElementsByClassName('ESTIMATE_TIME');
		if ( et != null ){
			var hm = coordinateToTime( drag.offsetTop, drag.offsetLeft );
			et[0].innerText = hm;
			if ( drag.hasAttribute('checkout') ) drag.setAttribute('checkout', hm );

		}
		// var escort = coordinateToEscort( drag.offsetTop, drag.offsetLeft );
		// switch ( escort ){
		// 	case true:
		// 		drag.setAttribute('escort', 'yes');
		// 		setEscortHelper( drag, 'ON' );
		// 		break;
		// 	case false:
		// 		drag.removeAttribute('escort');
		// 		setEscortHelper( drag, 'OFF' );	
		// 		break;
		// }
	}

	var icc = document.getElementById('ID_CHILD_COORDINATE');
	icc.innerText = curChild.offsetTop + ' x ' + curChild.offsetLeft;

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
	var wb_width  = document.getElementById('WHITEBOARD').offsetWidth;
	wb_height -= base_child.offsetHeight / 2;
	wb_width  -= base_child.offsetWidth  / 2;
	
	var children = getMarkedChild();
	if ( children.length == 0 ) return true;
	for ( var i=0; i<children.length; i++ ){
		if ( base_child != children[i]){
			console.log( 'checkOtherChildCoordi:' + children[i].offsetTop );
			if ( children[i].offsetTop + y < 0
			 ||  children[i].offsetLeft + x < 0 ) return false;
			if ( children[i].offsetTop  + y >= wb_height ) return false;
			if ( children[i].offsetLeft + x >= wb_width ) return false;
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
				children[i].style.top  = children[i].offsetTop + y + 'px';
				children[i].style.left = children[i].offsetLeft + x + 'px';
				var et = children[i].getElementsByClassName('ESTIMATE_TIME');
				if ( et != null ){
					var hm = coordinateToTime( children[i].offsetTop, children[i].offsetLeft );
					et[0].innerText = hm;
					if ( children[i].hasAttribute('checkout') ) children[i].setAttribute('checkout', hm );

				}

				var escort = coordinateToEscort( children[i].offsetTop , children[i].offsetLeft );
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
		document.body.removeEventListener("mouseleave", mUp, false);
	}

	e.stopPropagation();

	//クラス名 .drag も消す
	if ( drag != null ) drag.classList.remove("drag");
//	if ( e.type == 'mouseup'){		//	touchendで反応しないように！
		if ( !curChildMoved ){
			if ( curChild != null ){
				if ( isMarkedChild( curChild ) ) {
						unmarkChild( curChild );
				}else {
					markChild( curChild );
				}
			}
		} 
//	}

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
/*
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
*/

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
