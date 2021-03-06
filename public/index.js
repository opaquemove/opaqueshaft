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
var wb_touch_move		= false;
var wb_touch_cnt_max	= 0;
var wb_description		= '';
var wb_report			= '';

var manageHourBand		= 12;
var pixelPerHour		= 600;
var oNav				= null;
var oSpotlight			= null;

var criteriaEscortPixel = -1;
var curWhiteboard		= 'WHITEBOARD';

var updateFlg			= false;
//
//	タイムライン・バー操作
//
var tlx 				= null;
var tly 				= null;
var tlbOffset 			= null;
var tlbOffsetLeft		= null;
var tl_drag 			= false;


var dndOffsetX 			= 0;
var dndOffsetY 			= 0;

var oldScrollPos 		= 0;
// ホワイトボードが開いているかフラグ
var openWhiteboardFlg 	= false;
var dayWhiteboard  		= null;

var palleteTimeSelector = null;

var oTile				= null;
var oLog				= null;
var oReportDlg			= null;

window.onload = init;
window.onresize = fitting;
window.onorientationchange = fitting;

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

	//	ホワイトボードの初期化
	initWhiteboard();


	//	ログエリアの初期化
	oLog = new messageLog();


	//モーダルダイアログ初期化
	initModalDialog();

	// コンテキストメニューはオフ
	document.oncontextmenu = function(e) { return false; }

	// fitting();


	//	モーダルダイアログの外側をクリックしたらクローズ
	var mo = document.getElementById('MODAL_OVERLAY');
	mo.addEventListener('click', function(e){
		if ( e.target == this ) closeModalDialog();
		});


	// ホワイトボード関連のツールバーを非表示
	hideToolbar();

	//	ワークプレイス表示
	initWorkplace();
	// showWorkPlace();		// initWorkplaceにインクルード
	
/*
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
*/

	//
	//	タイムラインガイド初期化
	//

	//
	//	タイムラインインジケータの生成
	//
	makeTimelineIndicator();

	//
	//	エスコートエリアの位置マーカーの生成（もう使わないのよ）
	//
	// var eam = document.getElementById('ESCORT_AREA_MARKER');
	// eam.style.left   = ( criteriaEscortPixel + 42 ) + 'px';

	//
	//	ホワイトボード表示制御機能の初期化
	//
	initWhiteboardMode();


	
	//
	//	パースペクティブバー初期化
	//
	 initPerspectivebar( evtStart, evtMove, evtEnd );

	makeToolbarCheckoutProgress( 0 );
}

function xxx( e ){
	var keyword = document.getElementById('TXT_KEYWORD4').value;
	var p = document.getElementById('NAV_STORAGE_CHILD_MAIN');
	oSpotlight.findChildrenTable( p, ( keyword == '' )? '*' : keyword );

}


//
//		ホワイトボードの初期化
//
function initWhiteboard(){
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

	//	ホワイトボードサイズ初期化
	initWhiteboardSize();

		//	レポートダイアログの初期化
	oReportDlg = new report_dlg();

	// TIMELINE_BARの初期座標を記憶する
	tlbOffset 		= document.getElementById('ID_TIMELINE_BAR').offsetTop;
	tlbOffsetLeft	= document.getElementById('ID_TIMELINE_BAR').offsetLeft;

	// 横軸でエスコート判断はしないように基準値を最大幅にしておく
	criteriaEscortPixel = document.body.clientWidth;

	var wbf = document.getElementById('WHITEBOARD_FRAME');
	wbf.addEventListener('scroll',
		function(e){
			var marked = ( getMarkedChild().length > 0 );
			if ( oldScrollPos > e.target.scrollTop ){
				// console.log( 'up' );
				showStartIcon();
				if ( !oNav.opened() && marked )
					oNav.open();
			} else {
				// console.log( 'down' );
				hideStartIcon();
				if ( oNav.opened() && !marked )
					oNav.close();
			}
			oldScrollPos = e.target.scrollTop;
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
 

	wbf.addEventListener( evtStart,    		locateWhiteboard, { passive : false } );
	wbf.addEventListener( evtMove,     		locateWhiteboard, { passive : false } );
	wbf.addEventListener( evtEnd,      		locateWhiteboard, { passive : false } );
	// document.getElementById('LAYER').addEventListener('keydown',	keyWhiteboard );
	document.body.addEventListener('keydown',	keyWhiteboard );


	//
	//	LAYERオブジェクト
	//
	document.body.addEventListener( 'click',
	// document.getElementById('LAYER').addEventListener( 'click',
		function (e){
			// document.body.focus();
			this.focus();
			console.log( 'layer / body reached');
		}	
	)
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
	wb.addEventListener('drop', dropHandler, false );

	//	チャイルドファインダー（スポットライト）初期化
	oNav = new Nav( null );
	oSpotlight = new spotlight( fitting );
	oSpotlight.play();

	new Button( 'WHITEBOARD_DAY_FRAME',     saveWhiteboard ).play();
	new Button( 'NAV_START_ICON',			ctlNav         ).play();
	new Button( 'ID_NAV_TILE',  			showTile ).play();
	new Button( 'ID_NAV_REPORT',  			reportWhiteboard ).play();
	new Button( 'ID_NAV_CHILDFINDER',       ctlSpotlight ).play();
	new Button( 'NAV_STORAGE_CHILD_OPTION_SEARCH', xxx ).play();
	// new Button( 'ID_NAV2_CHILDFINDER',      ctlSpotlight ).play();

	//	NAV2
	document.getElementById( 'ID_NAV2_CHECKINOUT').addEventListener(
		'click',
		function (e){
			switch ( curWhiteboard ){
				case 'WHITEBOARD':
					var o = document.getElementById('ID_MODE_CHECKOUT');
					o.dispatchEvent( new Event('click') );				
					break;
				case 'WHITEBOARD_CHECKOUT':
					var o = document.getElementById('ID_MODE_CHECKIN');
					o.dispatchEvent( new Event('click') );				
					break;
				}
		}
	);

	//
	//
	//
	document.getElementById('NAV_LOCATED_CHILD_HDR').addEventListener(
		'click',
		function(e){
			var f = document.getElementById('NAV_LOCATED_CHILD_FRAME');
			var h = document.getElementById('NAV_LOCATED_CHILD_HDR').offsetHeight;
			var m = document.getElementById('NAV_LOCATED_CHILD_MAIN').offsetHeight;
			var p = document.getElementById('NAV_LOCATED_CHILD_MAIN');
			var icon	= document.getElementById('NAV_LOCATED_CHILD_ICON');
			if ( icon.classList.contains('folder_open') ){
				// close
				icon.classList.remove('folder_open');
				icon.classList.add('folder_close');
				initNavLocatedChildFrame();
				p.innerHTML	= '';
			} else {
				// open
				icon.classList.remove('folder_close');
				icon.classList.add('folder_open');
				f.style.top	= '0px';
				f.style.height	= '100%';
				p.innerHTML	= '';
				oSpotlight.findWhiteboardChild( p, '*' );
			}
		}
	);
	document.getElementById('NAV_STORAGE_CHILD_HDR').addEventListener(
		'click',
		function(e){
			var f = document.getElementById('NAV_STORAGE_CHILD_FRAME');
			var h = document.getElementById('NAV_STORAGE_CHILD_HDR').offsetHeight;
			var m = document.getElementById('NAV_STORAGE_CHILD_MAIN').offsetHeight;
			var p = document.getElementById('NAV_STORAGE_CHILD_MAIN');
			var icon	= document.getElementById('NAV_STORAGE_CHILD_ICON');
			if ( icon.classList.contains('folder_open') ){
				// close
				icon.classList.remove('folder_open');
				icon.classList.add('folder_close');
				initNavStorageChildFrame();
				p.innerHTML	= '';
			} else {
				// open
				icon.classList.remove('folder_close');
				icon.classList.add('folder_open');
				f.style.top	= '0px';
				f.style.height	= '100%';
				p.innerHTML	= '';
				oSpotlight.findChildrenTable( p, '*' );
			}
		}
	);
	document.getElementById('TXT_KEYWORD4').addEventListener(
		'keyup',
		function( e ){
			var p = document.getElementById('NAV_STORAGE_CHILD_MAIN');
			var keyword = e.target.value;
			if ( e.key == 'Enter' )
				oSpotlight.findChildrenTable( p, ( keyword == '' )? '*' : keyword );
		}
	);

	document.getElementById( 'ID_NAV2_SEARCH3' ).addEventListener(
		'click',
		function(e){
			console.log('transform');
			var o = document.getElementById('ID_NAV2_SEARCH');
			var w = document.getElementById('ID_NAV2_SEARCH2').offsetWidth;
			if ( o.style.width == ''){
				o.style.width = w + 'px';
				ctlSpotlight();
			} else{
				o.style.width = '';
				ctlSpotlight();
			}

			// var o = document.getElementById('ID_NAV2_SEARCH2');
			// o.style.left = '0px';
			// o.classList.toggle('mode_right50per');
			// if ( o.style.transform == '' )
			// 	o.style.transform = 'translateX(0)';
			// 	else
			// 	o.style.transform = '';

		}
	);

	//
	//	タイムセレクタ初期化
	//
	palleteTimeSelector = new TimeSelector( checkinSelectedChild );
	palleteTimeSelector.play();

	//
	//	タイル初期化
	//
	oTile = new Tile( null );
	oTile.init();

	//
	//	タイムラインバー初期化
	//
	var tmb = document.getElementById('ID_TIMELINE_BAR');
	tmb.addEventListener( evtStart,    		locateTimelinebar, { passive : false } );
	tmb.addEventListener( evtMove,     		locateTimelinebar, { passive : false } );
	tmb.addEventListener( evtEnd,      		locateTimelinebar, { passive : false } );
	tmb.addEventListener( 'mouseleave', 	locateTimelinebar, { passive : false } );

}

//
//	ホワイトボードサイズの初期化
//
function initWhiteboardSize(){
	var wb = document.getElementById('WHITEBOARD');
	var wbco = document.getElementById('WHITEBOARD_CHECKOUT');
	var wbtl = document.getElementById('WHITEBOARD_TIMELINE');
	var wbbm = document.getElementById('WHITEBOARD_BOTTOM_MARGIN');
	wb.style.height	= ( pixelPerHour *  manageHourBand ) + 'px';
	wbco.style.height	= wb.style.height;
	wbtl.style.height	= wb.style.height;
	wbbm.style.top		= wb.style.height;
	wbbm.style.height	= ( pixelPerHour / 2 ) + 'px';
}
//
//	ホワイトボード表示制御機能の初期化
//
function initWhiteboardMode(){
	var imne = document.getElementById('ID_MODE_CHECKIN');
	var ime  = document.getElementById('ID_MODE_CHECKOUT');
	imne.addEventListener( 'click', modeWhiteboard, false );
	ime.addEventListener( 'click', modeWhiteboard, false );
	imne.dispatchEvent( new Event('click') );
}

function modeWhiteboard( e ){
	console.log( curWhiteboard, this.getAttribute('id'));
	var imne = document.getElementById('ID_MODE_CHECKIN');
	var ime  = document.getElementById('ID_MODE_CHECKOUT');

	var wb	= document.getElementById('WHITEBOARD');
	var wbe	= document.getElementById('WHITEBOARD_CHECKOUT');

	resetChildMark();
	switch ( this.getAttribute('id')){
		case 'ID_MODE_CHECKIN':
			imne.classList.add( 'mode_on' );
			ime.classList.remove( 'mode_on' );
			wb.style.zIndex		= 3;
			wb.style.opacity	= 1;
			wbe.style.zIndex	= 2;

			wbe.style.opacity	= 0.6;
			curWhiteboard		= 'WHITEBOARD';
			break;
		case 'ID_MODE_CHECKOUT':
			ime.classList.add( 'mode_on' );
			imne.classList.remove( 'mode_on' );
			wbe.style.zIndex	= 3;
			wbe.style.opacity	= 1;
			wbe.style.backgroundColor	= '';
			wb.style.zIndex		= 2;

			wb.style.opacity	= 0.6;
			curWhiteboard		= 'WHITEBOARD_CHECKOUT';
			break;
		}

}

//
//	drop処理
//
function dropHandler( e ){
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
	var child_name = e.dataTransfer.getData('text2');
	var wb = document.getElementById('WHITEBOARD');
	console.log( e.target.getAttribute('id'), e.pageY, e.pageX, id );
	if ( alreadyExistChildOnWhiteboard( id )){
		// alert('すでにホワイトボードに配置されています．');
		//var child_name = e.target.getElementsByClassName('CHILD_NAME')[0].innerText;
		oLog.log( null, child_name + ' : すでにホワイトボードに配置されています.');
		oLog.open( 3 );
		return;
	}

	var oChild = getChild(id);
	// var itb = document.getElementById('ID_TIMELINE_BAR');
	// var hm  = itb.innerText;
	// var arHM = hm.split(':');

	var p = e.target.parentNode;

	// topを相対座標に変換
	var pxTop 	= ( e.pageY - e.target.offsetTop  - dndOffsetY + wb.parentNode.scrollTop - wb.parentNode.offsetTop + child_top );
	var perTop	= ( Math.floor( pxTop / wb.offsetHeight * 10000 ) / 100 ) + '%';

	// leftを相対座標に変換
	var pxLeft  = ( e.pageX - e.target.offsetLeft - p.offsetLeft - dndOffsetX + wb.parentNode.scrollLeft + child_left );
	var perLeft = ( Math.floor( pxLeft / wb.offsetWidth * 10000 ) / 100 ) + '%';

	addChild(
			//  e.pageY - e.target.offsetTop - dndOffsetY + wb.parentNode.scrollTop - wb.parentNode.offsetTop + child_top,
			perTop,
			// e.pageX - e.target.offsetLeft - p.offsetLeft - dndOffsetX + wb.parentNode.scrollLeft + child_left,
			perLeft,
			oChild.child_id, oChild.child_name, oChild.kana, oChild.child_type,oChild.child_grade, oChild.imagefile, null, false, false, false );
	dndOffsetX = 0;
	dndOffsetY = 0;
	showWhiteboardChildCount();

}

function test(){

	ctlReportDlg();

}
//
//	ツールバーにチェックアウトプログレスを表示
//
function makeToolbarCheckoutProgress( progress_ratio ){
	var p = document.getElementById('ID_PROGRESS');
	if ( p.firstChild != null )
		p.removeChild( p.firstChild );
	// p.innerHTML = '';
	var d = document.createElement('DIV');
	d.setAttribute( 'class', 'vh-center');
	d.style.position		= 'relative';
	d.style.paddingTop		= '1px';
	d.style.paddingLeft		= '1px';
	d.style.width			= '42px';
	d.style.height			= '42px';
	// d.style.backgroundColor	= 'rgb(241,241,241)';
	// d.style.border			= '1px solid lightgrey';
	var ccl = p.appendChild( d );
	var cp = new CircleProgress( ccl, 38, 38, progress_ratio, 'rgb(255,123,0)', 14 );
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

	// console.log('commonProc.schowWhiteboardChildCount');
	showWhiteboardChildCount();

}

//
//	タイムラインインジケータの生成
//
function makeTimelineIndicator(){
	var wbf = document.getElementById('WHITEBOARD_FRAME');
	// var tb_height = document.getElementById('TOOLBAR').offsetHeight;
	var wbt = document.getElementById('WHITEBOARD_TIMELINE');
	var wbt_width = wbt.offsetWidth;

	arTL = [ '08', '09', '10', '11', '12','13','14','15','16','17','18','19' ];
	for ( var i=0; i<arTL.length; i++ ){
		var o = document.createElement('DIV');
		o.setAttribute('class', 'timeline_class vh-center' );
		// o.style.pointerEvents		= 'none';
		// o.innerHTML = '<div style="border-bottom:0px solid white;" >' + arTL[i] + ':00' + '</div>';
		wbt.appendChild( o );
	}
	
	for ( var i=0; i<arTL.length - 0; i++ ){
		var guide = document.createElement('DIV');
		guide.setAttribute('class', 'timeline1_class' );
		guide.style.top				= ( ( i + 0 ) * pixelPerHour - 1 )+ 'px';
		// guide.style.pointerEvents	= 'none';
		guide.innerHTML = '<div style="margin:2px 0px 0px 42px;background-color:#DDDDDD;border:1px solid lightgrey;border-radius:2px;" >' + arTL[i] + ':00' + '</div>';
		wbf.appendChild( guide ).addEventListener('click',
			function (e ){
				// alert( e.target.innerText);
			}
		);
	}
	for ( var i=0; i<arTL.length - 0; i++ ){
		var guide = document.createElement('DIV');
		guide.setAttribute('class', 'timeline2_class' );
		guide.style.top				= ( ( i + 1 ) * pixelPerHour - 1 )+ 'px';
		// guide.style.pointerEvents	= 'auto';
		guide.innerHTML				= '&nbsp;';
		wbf.appendChild( guide );
	}
	for ( var i=0; i<arTL.length - 0; i++ ){
		var guide = document.createElement('DIV');
		guide.setAttribute('class', 'timeline3_class' );
		guide.style.top				= ( ( i + 1 ) * pixelPerHour - 1 )+ 'px';
		// guide.style.pointerEvents	= 'auto';
		guide.innerHTML				= '&nbsp;';
		wbf.appendChild( guide );
	}

	guide = document.createElement('DIV');
	guide.setAttribute('class', 'timeline_15minute_class' );
	// guide.style.pointerEvents	= 'auto';
	guide.innerHTML				= '15';
	wbf.appendChild( guide );
	guide = document.createElement('DIV');
	guide.setAttribute('class', 'timeline_30minute_class' );
	// guide.style.pointerEvents	= 'auto';
	guide.innerHTML				= '30';
	wbf.appendChild( guide );
	guide = document.createElement('DIV');
	guide.setAttribute('class', 'timeline_45minute_class' );
	// guide.style.pointerEvents	= 'auto';
	guide.innerHTML				= '45';
	wbf.appendChild( guide );

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
	init : function(){
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

		// new Button( 'MODAL_TILE_SIGN',    function(){ accountProperty(); oTile.close('menu'); hideStartIcon();} ).play();
		new Button( 'MODAL_TILE_SAVE',    function(){ saveWhiteboard(); oTile.close('menu');hideStartIcon(); } ).play();
		// new Button( 'MODAL_TILE_SIGNOUT', function(){ signoutForm(); oTile.close('menu');hideStartIcon(); } ).play();
		new Button( 'MODAL_TILE_CLEAR',   function(){ clearWhiteboard(); oTile.close('menu');hideStartIcon(); } ).play();
		// new Button( 'MODAL_TILE_ABSENT',  function(){ absentWhiteboard(); oTile.close('menu'); } ).play();
		// new Button( 'MODAL_TILE_OPEN',    function(){ openWhiteboard(); oTile.close('menu');hideStartIcon(); } ).play();
		new Button( 'MODAL_TILE_CLOSE',   function(){ closeWhiteboard(); oTile.close('menu');hideStartIcon(); } ).play();
		new Button( 'MODAL_TILE_REPORT',  function(){ reportWhiteboard(); oTile.close('menu');hideStartIcon(); } ).play();
		new Button( 'MODAL_TILE_LOG',  	  function(){ ctlMessageLog(); oTile.close('menu');hideStartIcon(); } ).play();

		var tiles = document.getElementById( 'ID_TILES' );
		tiles.style.display	= 'none';
		var icf2 = document.getElementById( 'ID_CHILDFINDER2' );
		icf2.style.display	= 'none';
	},
	open : function( target ){
		this.frame.style.visibility = 'visible';
		switch ( target ){
			case 'menu':
				var tiles =document.getElementById('ID_TILES');
				tiles.style.display = '';
				break;
			case 'childfinder':
				var icf2 =document.getElementById('ID_CHILDFINDER2');
				icf2.style.display = '';
				break;
		}
		this.day( dayWhiteboard );

		// var tile2 = document.getElementById('MODAL_TILE_SIGN');
		// tile2.innerText = 'sign ' + isSignId();
	},
	close : function( target ){
		// this.frame.style.visibility = 'hidden';
		switch ( target ){
			case 'menu':
				var tiles =document.getElementById('ID_TILES');
				tiles.style.display = 'none';
				var mt1 = document.getElementById('MODAL_TILE_DAY');
				mt1.innerHTML = '';
				break;
			case 'childfinder':
				var icf2 =document.getElementById('ID_CHILDFINDER2');
				icf2.style.display = 'none';
				break;
			}
		// var mt3 = document.getElementById('MODAL_TILE_SIGN');
		// mt3.innerHTML = '';
	},
	opened : function( target ){
		// return ( this.frame.style.visibility == 'visible' );
		switch (target){
			case 'menu':
				var tiles = document.getElementById('ID_TILES');
				return ( tiles.style.display == '' );
				break;
			case 'childfinder':
				var icf2 =document.getElementById('ID_CHILDFINDER2');
				return ( icf2.style.display == '' );
				break;
			}
	},
	day : function( day ){
		var mt1 = document.getElementById('MODAL_TILE_DAY');
		mt1.innerHTML = '';
		var d = document.createElement('DIV');
		d.innerText			= day;
		mt1.appendChild( d );

	}
}


//
//	タイムライン・バー操作
//
function locateTimelinebar( e ){
	// var w = document.body.clientWidth;

	e.preventDefault();

	var wbf = document.getElementById('WHITEBOARD_FRAME');
	var wb  = document.getElementById('WHITEBOARD');
	var wbe = document.getElementById('WHITEBOARD_CHECKOUT');
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
			// itb.style.width 		= '24px';
			// itb.style.paddingLeft	= '60px'
			// itb.style.height		= '84px';
			// itb.style.fontSize 		= '20px';
			tly = event.pageY - event.target.offsetTop;
			tlx = event.pageX - event.target.offsetLeft;
			tl_drag = true;

			//	Spotlight UIにセレクトしたチャイルドがあればチェックイン
			if ( oSpotlight.existSelectedChild() ){
				resetChildMark();	// すでにマークしているチャイルドを外す
				oSpotlight.checkin( itb.innerText );	// マーク状態でチェックインする
			}

			//	タイムラインを分かりやすく表示するインジケータ
			var o = document.createElement('DIV');
			o.id					= 'INDICATOR1'
			o.style.position		= 'absolute';
			o.style.textAlign		= 'center';
			o.style.color			= 'white';
			o.style.backgroundColor	= 'red';
			o.style.fontSize		= '24px';
			o.style.width			= '80px';
			o.style.height			= '32px';
			o.style.borderRadius	= '4px';
			o.style.zIndex			= 40001;
			//var new_top  = event.pageY - tly;

			o.style.top		= ( event.pageY - tly ) + 'px';
			o.style.left	= ( event.pageX - tlx - 100 ) + 'px';
			o.innerText = event.target.innerText;

			// document.body.appendChild( o );
			document.getElementById('LAYER').appendChild( o );

			//	タイムラインを分かりやすく表示するインジケータ
			o = document.createElement('DIV');
			o.id					= 'INDICATOR2'
			o.style.position		= 'absolute';
			o.style.textAlign		= 'center';
			o.style.color			= 'white';
			o.style.backgroundColor	= 'rgb(255, 123, 0)';
			o.style.fontSize		= '24px';
			o.style.width			= '2px';
			o.style.height			= '32px';
			o.style.zIndex			= 40001;

			var minute = event.target.innerText.split(':')[1];
			o.style.top		= '42px';
			o.style.left	= ( parseInt( minute) / 60 * 100 ) + '%';

			// document.body.appendChild( o );
			document.getElementById('LAYER').appendChild( o );



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
			var new_left = event.pageX - tlx;
			console.log('origin:' + tlbOffsetLeft + ' new_left:' + new_left );
			if ( ( new_top ) >= tlbOffset + 0 
				&& ( new_top ) <= tlbOffset + 132 ){
				//	縦方向移動
				itb.style.top 	= new_top + 'px';

				if ( ( new_left ) <= tlbOffsetLeft + 0
					&& ( new_left ) >= tlbOffsetLeft - 84 ){
					//	横方向移動
					itb.style.left	= new_left + 'px';
					var wbf = document.getElementById('WHITEBOARD_FRAME');
					var wb  = document.getElementById('WHITEBOARD');
					var wbt = document.getElementById('WHITEBOARD_TIMELINE');
					var bo  = document.getElementById('BOTTOM_OVERLAY');
					var bf  = document.getElementById('BOTTOM_FRAME');
					// if ( itb.offsetLeft == tlbOffsetLeft + 0 ){
					// 	wbf.style.perspective	= '';
					// 	wb.style.transform 		= '';
					// 	wb.style.border 		= '';
					// 	wbt.style.border 		= '';
					// 	wbt.style.transform		= '';
					// 	bo.style.perspective 	= '';
					// 	bf.style.transform 		= '';
					// } else {
					// 	wb.style.transformStyle	= 'preserve-3d';
					// 	wb.style.transform 		= 'perspective(470px) translate3d( 0px, 0px, -700px) rotateX(' + ( new_left - tlbOffsetLeft ) + 'deg)';
					// 	wb.style.border 		= '1px solid white';
					// 	wbt.style.transformStyle	= 'preserve-3d';
					// 	wbt.style.transform 	= 'perspective(470px) translate3d( 0px, 0px, -700px) rotateX(' + ( new_left - tlbOffsetLeft ) + 'deg)';
					// 	wbt.style.border 		= '1px solid white';
					// 	bo.style.transformStyle	= 'preserve-3d';
					// 	bf.style.transform 		= 'perspective(470px) translate3d( 0px, 0px, -710px) rotateX(' + ( new_left - tlbOffsetLeft ) + 'deg)';
					// }
				}

				//	8:00からマウス増分
				// var cur_time = ( 60 * 8 ) + ((event.pageY - tly) * 5) -( 42 * 4 );
				// var cur_time2 = ('00' + Math.floor( cur_time / 60 ) ).slice(-2) + ':00';
				var ttl_min = ( itb.offsetTop - tlbOffset ) * 5;
				var h = Math.floor( ttl_min / 60 ) + 8;
				var m = ttl_min % 60;
				// console.log( 'hour:' + h + ':' + m );
				itb.innerHTML = ( '00' + h ).slice(-2) + ':' + ( '00' + m ).slice(-2) + '<br>';

				var o = document.getElementById('INDICATOR1');
				if ( o != null ){
					o.style.top		= ( event.pageY - tly ) + 'px';
					// o.style.left	= ( event.pageX - tlx - 100 ) + 'px';
					o.innerText = event.target.innerText;
				}
				o = document.getElementById('INDICATOR2');
				if ( o != null ){
					var minute = event.target.innerText.split(':')[1];
					o.style.left	= ( parseInt( minute) / 60 * 100 ) + '%';
					// o.innerText = o.style.left;
				}
	
				moveMarkedChildByTimelinebar( h, m );
				scrollWhiteboard( h, m );
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

			var o = document.getElementById('INDICATOR1');
			if ( o != null ){
				// document.body.removeChild( o );
				o.parentNode.removeChild( o );
			}
			o = document.getElementById('INDICATOR2');
			if ( o != null ){
				// document.body.removeChild( o );
				// document.getElementById('LAYER').removeChild( o );
				o.parentNode.removeChild( o );
			}
			break;
	}
}

//
//	スクルール量からID_TIMELINE_BARを移動する
//
function setTimelinebarByScroll(){

	// +64 は早めに時間を切り替えるマージン
	var scroll_top = document.getElementById('WHITEBOARD_FRAME').scrollTop + 64;
	var h = Math.floor( scroll_top / pixelPerHour ) + 8;
	var m = ( scroll_top % pixelPerHour )  / Math.floor( pixelPerHour / 5 );
	var delta = ( h - 8 ) * 5;

	var itb = document.getElementById('ID_TIMELINE_BAR');
	itb.style.top = ( tlbOffset + ( h - 8 ) * ( 60 / 5 ) ) + 'px';
	itb.innerText = ( '00' + h ).slice(-2) + ':00';

}

//
//	タイムラインバーに連動してマークしているチャイルドの移動を行う
//	minuteパラメータはまだ対応検討中
//
function moveMarkedChildByTimelinebar( hour, minute ){
	var h = document.getElementById('WHITEBOARD').offsetHeight;
	var children = getMarkedChild();
	if ( children.length == 0 ) return;
	for ( var i=0; i<children.length; i++ ){
		var c = children[i];
		var top_delta = c.offsetTop % pixelPerHour;
		// 座標変更
		var pxTop = ( ( hour - 8 ) * pixelPerHour + top_delta );
		var perTop = ( Math.floor( pxTop / h * 10000 ) / 100 ) + '%';
		// c.style.top = ( ( hour - 8 ) * pixelPerHour + top_delta ) + 'px';
		c.style.top	= perTop;

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
function scrollWhiteboard( hour, minute ){
	// var wbt = document.getElementById('WHITEBOARD_TIMELINE');
	// var wb  = document.getElementById('WHITEBOARD');
	// wbt.style.top = 0 - ( ( hour - 8 ) * pixelPerHour  ) - 0 + 'px';
	// wb.style.top  = 0 - ( ( hour - 8 ) * pixelPerHour  ) - 4802 + 'px';
	document.getElementById('WHITEBOARD_FRAME').scrollTop = ( hour - 8 ) * pixelPerHour + ( pixelPerHour * minute / 60 );
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
	r += '<div style="height:;font-size:24px;text-align:center;padding-top:2px;padding-bottom:2px;" >';
		// r += 'open whiteboard';
	r += '</div>';
	r += '<div style="margin:0 auto;font-size:14px;width:80%;">';
		r += '<form name="guidedance_whiteboard_form" onsubmit="return false;" >';
		r += '<div>Date:</div>';
		r += '<div style="height:30px;padding-bottom:2px;" >';
			r += '<div style="width:50%;float:left;" >';
				r += '<input type="text" id="whiteboard_day" name="day" style="width:90%;font-size:;" value="' + ymd + '" />';
			r += '</div>';
			r += '<div style="float:left;width:30px;" >';
				r += '<button type="button" id="BTN_ADD_DATE"   style="width:18px;height:8px;background-color:transparent;border:none;background-image:url(./images/arrow-black-triangle-up.png);background-size:6px;background-repeat:no-repeat;background-position:center center;" ></button>';
				r += '<button type="button" id="BTN_MINUS_DATE" style="width:18px;height:8px;background-color:transparent;border:none;background-image:url(./images/arrow-black-triangle-down.png);background-size:6px;background-repeat:no-repeat;background-position:center center;" ></button>';
				// r += '<img id="BTN_ADD_DATE"        width="6px" src="./images/arrow-black-triangle-up.png" />';
				// r += '<br/><img id="BTN_MINUS_DATE" width="6px" src="./images/arrow-black-triangle-down.png" />';
			r += '</div>';
		r += '</div>';
		// r += '<div id="WHITEBOARD_LIST" style="clear:both;margin-top:10px;height:120px;display:flex;font-size:12px;padding:4px;overflow-y:scroll;border:0px solid lightgrey;" >';
		r += '<div style="clear:both;" >Ranges:</div>';
		r += '<div id="RANGE_LIST" ></div>';
		r += '<div style="padding-top:14px;" >Whiteboards:</div>';
		r += '<div id="WHITEBOARD_LIST" >';
		r += '</div>';
		r += '<div style="clear:both;padding-bottom:5px;text-align:center;" >';
		r += '</div>';
		r += '</form>';
		r += '<div style="text-align:center;padding-top:5px;" >';
			r += '<button type="button" id="BTN_OPENWHITEBOARD" class="next_button" ';
				// r += ' style="width:140px;height:60px;padding-left:20px;font-size:20px;background-color:transparent;border:none;background-image:url(./images/arrow-right.png);background-size:26px;background-repeat:no-repeat;background-position:center center;" ';
				r += ' onclick="createWhiteboard()" >';
				r += 'next';
			r += '</button>';
			r += '<button type="button" id="BTN_OPENWHITEBOARD" class="cancel_button" ';
				// r += ' style="width:140px;height:60px;padding-left:20px;font-size:20px;background-color:transparent;border:none;background-image:url(./images/arrow-right.png);background-size:26px;background-repeat:no-repeat;background-position:center center;" ';
				r += ' onclick="closeModalDialog()" >';
				r += 'cancel';
			r += '</button>';
		r += '</div>';
	r += '</div>';

	 var children = document.getElementById('WHITEBOARD').childNodes;
	//  neverCloseDialog = ( children.length == 0 ) ? true : false;
	// neverCloseDialog = true;
	openModalDialog( 'open Whiteboard', r, 'NOBUTTON', null, 'OPENWHITEBOARD' );


	//	レンジリスト作成
	makeRangeList( 'RANGE_LIST', 'H' );
	document.getElementById('RANGE_LIST').addEventListener('mousedown',
		function(e) {
			var o = e.target;
			if ( o == document.getElementById('RANGE_LIST')) return;
			while ( o.parentNode != document.getElementById('RANGE_LIST') ){
				o = o.parentNode;
			}
			o.style.color			= 'white';
			o.style.backgroundColor = 'royalblue';
		}, false );
	document.getElementById('RANGE_LIST').addEventListener('mouseup',
		function(e) {
			var o = e.target;
			if ( o == document.getElementById('RANGE_LIST')) return;
			while ( o.parentNode != document.getElementById('RANGE_LIST') ){
				o = o.parentNode;
			}
			o.style.color			= '';
			o.style.backgroundColor = '';
			var range_id = o.getAttribute('range_id' );
			makeWhiteboardList( range_id );
		}, false );




	//	ホワイトボードリスト作成
	// makeWhiteboardList( 2021 );
	document.getElementById('BTN_OPENWHITEBOARD').focus();
	document.getElementById('whiteboard_day').addEventListener('keydown',
		function (e){
			if ( e.keyCode == 13) // Enter key
				createWhiteboard();
		});
	// document.getElementById('BTN_ADD_DATE').addEventListener('click',
	// 	function(e){
	// 		var d = guidedance_whiteboard_form.day.value;
	// 		var dd = new Date( d );
	// 		dd.setDate( dd.getDate() + 1 );
	// 		guidedance_whiteboard_form.day.value =
	// 			dd.getFullYear() + '/' + ('00' + ( dd.getMonth() + 1 )).slice(-2) + '/' + ('00' + dd.getDate()).slice(-2);
	// 	}, false );
	// document.getElementById('BTN_MINUS_DATE').addEventListener('click',
	// 	function(e){
	// 		var d = guidedance_whiteboard_form.day.value;
	// 		var dd = new Date( d );
	// 		dd.setDate( dd.getDate() - 1 );
	// 		guidedance_whiteboard_form.day.value =
	// 			dd.getFullYear() + '/' + ('00' + ( dd.getMonth() + 1 )).slice(-2) + '/' + ('00' + dd.getDate()).slice(-2);
	// 	}, false );
	document.getElementById('WHITEBOARD_LIST').addEventListener('mousedown',
		function(e) {
			var o = e.target;
			if ( o == document.getElementById('WHITEBOARD_LIST')) return;
			while ( o.parentNode != document.getElementById('WHITEBOARD_LIST') ){
				o = o.parentNode;
			}
			o.style.color			= 'white';
			o.style.backgroundColor = 'royalblue';
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
	if ( target_day == ''){
		oLog.log( null, 'date expected.' )
		oLog.open(3);
		return;
	}
	var cwd = document.getElementById('CUR_WHITEBOARD_DAY');
	var itba = document.getElementById('ID_TIMELINE_BAR_AREA');
	dayWhiteboard 	= target_day;
	cwd.innerText 	= target_day;
	updateFlg		= false;
	neverCloseDialog = false;
	
	closeModalDialog();
	visibleWhiteboard();
	loadWhiteboard();
	fitting();

	//	OPAQUESHAFT_TITLE表示制御
	var opaqueshaft_title = document.getElementById('OPAQUESHAFT_TITLE');
	opaqueshaft_title.style.visibility = ( openWhiteboardFlg )? 'visible' : 'hidden';

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

//
//	ホワイトボードにすでに配置されているかをチェック
//
function alreadyExistChildOnWhiteboard( id ){
	var children = document.getElementById('WHITEBOARD').childNodes;
	for ( var i=0; i<children.length; i++ ){
		if ( children[i].getAttribute('child_id') == id )
			return true;
	}
	children = document.getElementById('WHITEBOARD_CHECKOUT').childNodes;
	for ( var i=0; i<children.length; i++ ){
		if ( children[i].getAttribute('child_id') == id )
			return true;
	}

	return false;
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

	//	スクロールポジションの初期化
	oldScrollPos = 0;

	//ホワイトボード概要をロードする
	loadWhiteboardHelper();

	// チルドレンをロードする
	loadWhiteboardChildren();

	//	ホワイトボードのスクロール調整
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	console.log( 'time is ' + h + ':' + m );
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
	//
	//	ホワイトボード内のチルドレンを全削除
	//
	deleteWhiteboardChildren();

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
			
						// var w = document.body.clientWidth;
						var w = document.getElementById('WHITEBOARD').offsetWidth;

						for ( var i=0; i<result.length; i++ ){
							var c = result[i];
							var cc = addChild( c.coordi_top + '%', c.coordi_left + '%',
								c.child_id, c.child_name, c.kana,
								c.child_type, c.child_grade, c.imagefile, c.remark, c.escort, ( c.absent == 1 )?true : false, false );
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

					// リザーブテーブルからロード
					loadWhiteboardReserveChildren( day );

					//	ホワイトボードを最初のチャイルドまでスクロール
					var earlyChildHour = getEarlyChildHour();
					if ( earlyChildHour > 0 ) scrollWhiteboard( earlyChildHour, 0 );

				} else{
					oLog.log( null, 'loadWhiteboardChildren:' + xmlhttp.status );
					oLog.open( 3 );
				} 
				break;
		}
	};

	xmlhttp.open("POST", "/accounts/resultwhiteboard", true );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'day=' + day );

}

//
//	リザーブテーブルからチャイルドをロードする。すでにホワイトボードに存在するチャイルドはパス
//
function loadWhiteboardReserveChildren( day ){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
				break;
			case 2://header received
				break;
			case 3://loading
				oLog.log( null, 'load Whiteboard reserve children...' );
				oLog.open( 3 );
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					for ( var i=0; i<result.length; i++ ){
						var c = result[i];
						if ( ! alreadyExistChildOnWhiteboard( c.child_id ) ){
							var ar_hm		= c.eott.split(':');
							var top 		= ( ( parseInt( ar_hm[0] ) - 8 ) * pixelPerHour );
							// var coordi_left = Math.floor( c.offsetLeft / w * 10000 ) / 100;
							// var m15 = Math.floor( ( criteriaEscortPixel - 144 ) * 0.25 );	//  144 is child width
							// var m = Math.floor( left / m15 ) * 15;
						
							var left 		= Math.floor( parseInt( ar_hm[1] ) / 60 * 100 ) + '%';
							var child_id 	= c.child_id;
							var child_name 	= c.child_name;
							var kana 		= c.kana;
							var child_type 	= c.child_type;
							var child_grade = c.child_grade;
							console.log( 'top:' + top );
							console.log( 'child_id:' + c.child_id + ',' + c.sott + ',' + ar_hm[0] + ':' + ar_hm[1] );
							// 将来削除なので修正はしない
							addChild( top, left, child_id, child_name, kana, child_type,
								child_grade, null, null, false, false, false );
						} else {
							console.log( 'child_id:' + c.child_id + ' already deploy')
						}
					}
					showWhiteboardChildCount();
				}
				break;
		}
	};

	xmlhttp.open("POST", "/accounts/reserveday", true );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'day=' + day );

}

//
//	ホワイトボードを保存する
//
function saveWhiteboard(){

	//	マーク状態をクリア
	resetChildMark();
	var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:4px;padding-bottom:4px;" >';
	// 	r += 'save whiteboard';
	r += '</div>';
	r += '<div style="margin:0 auto;width:70%;font-size:18px;">';
		r += '<form name="guidedance_whiteboard_form" onsubmit="return false;" >';
		r += '<div>Date:</div>';
		r += '<div style="padding-bottom:10px;" >';
		r += '<input type="text" id="whiteboard_day" name="day" style="width:96px;font-size:16px;" readonly value="' + dayWhiteboard + '" />';
		r += '</div>';
		r += '<div>Description:</div>';
		r += '<div style="clear:both;font-size:12px;width:100%;height:40px;border:0px solid gray;" >';
		r += '<textarea id="WB_DESC" name="desc" style="width:100%;" >' + wb_description + '</textarea>';
		r += '</div>';
		r += '<div>Report:</div>';
		r += '<div style="clear:both;font-size:12px;width:100%;height:50px;border:0px solid gray;" >';
		r += '<textarea id="WB_REPORT" name="report" style="width:100%;height:48px;" >' + wb_report + '</textarea>';
		r += '</div>';
		r += '</form>';

		r += '<div style="margin:0 auto;width:100%;padding-top:20px;">';
			r += '<button id="BTN_SAVEWHITEBOARD" class="accept_button" type="button" ';
			// r += ' style="font-size:24px;width:80px;height:80px;border:none;background-color:transparent;background-image:url(./images/check-3.png);background-size:24px;background-position:center center;background-repeat:no-repeat;" ';
			r += ' onclick="saveWhiteboardHelper();closeModalDialog();"   >';
			r += 'save whiteboard';
			r += '</button>';

			r += '<button id="" type="button" class="cancel_button" ';
			// r += ' style="font-size:20px;width:80px;height:80px;border:none;background-color:transparent;background-image:url(./images/cancel-2.png);background-position:center center;background-size:24px;background-repeat:no-repeat;" ';
			r += ' onclick="closeModalDialog();" >';
			r += 'cancel';
			r += '</button>'

        r += '</div>';

	r += '</div>';

	openModalDialog( 'save whiteboard', r, 'NOBUTTON', null, null );

	// openModalDialog( 'save whiteboard', r, 'OK_CANCEL',
	// 		function(){
	// 			saveWhiteboardHelper();
	// 			closeModalDialog();
	// 		}, null );
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

	var desc =  document.getElementById('WB_DESC').value;
	wb_description = desc;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/whiteboardupdate", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'day=' + day + '&desc=' + encodeURIComponent( desc ) +
				'&json_children=' + encodeURIComponent( JSON.stringify(json_children ) ) );

	// var progress = document.getElementById('SAVE_PROGRESS');
	// var r = '';
	if ( xmlhttp.status == 200){
		oLog.log( null, 'ホワイトボード(' + day + ')を保存しました.' );
		// r += '<div>save whiteboard html data.</div>';
	} else{
		oLog.log( null, 'ホワイトボード(' + day + ')の保存に失敗しました.' );
		// r += '<div>save whiteboard html data. FAILED</div>';
	}
	oLog.log( null, xmlhttp.responseText );
	//	Results削除
	// rc = deleteChildResult( dayWhiteboard );
	// oLog.log( null, 'delete child results...' );

	// oLog.log( null, 'save process completed.' );
	oLog.open( 5 );

	updateFlg = false;

	// closeModalDialog();
}

//
// チルドレンのJSONデータ生成
//
function getJSONChildren(){
	// var w = document.body.clientWidth;

	var w = document.getElementById('WHITEBOARD').offsetWidth;
	var h = document.getElementById('WHITEBOARD').offsetHeight;

	var jsonChildren = [];
	var children = document.getElementById('WHITEBOARD').childNodes;
	for ( var i=0; i<children.length; i++ ){
		var c = children[i];
		var child_id	= c.getAttribute('child_id');
		var kana		= c.getAttribute('kana');
		var child_name	= c.getElementsByClassName('CHILD_NAME')[0].innerText;
		var child_type	= c.getAttribute('child_type');
		var child_grade	= c.getAttribute('child_grade');
		var imagefile	= c.getAttribute('imagefile');
		// var coordi_top	= c.offsetTop;
		var coordi_top  = Math.floor( c.offsetTop  / h * 10000 ) / 100;
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
			 'child_name'	: child_name,
			 'kana'			: kana,
			 'child_type'	: child_type,
			 'child_grade'	: child_grade,
			 'imagefile'	: imagefile,
			 'checkin'		: checkin,
			 'estimate'		: estimate,
			 'checkout'		: checkout,
			 'operator'		: operator,
			 'direction'	: direction,
			 'escort'		: escort,
			 'coordi_top'	: coordi_top,
			 'coordi_left'	: coordi_left,
			 'remark'		: remark,
			 'absent' 		: 0,
			 'day'			: dayWhiteboard
			 } );
	}
	var children = document.getElementById('WHITEBOARD_CHECKOUT').childNodes;
	for ( var i=0; i<children.length; i++ ){
		var c = children[i];
		var child_id	= c.getAttribute('child_id');
		var kana		= c.getAttribute('kana');
		var child_name	= c.getElementsByClassName('CHILD_NAME')[0].innerText;
		var child_type	= c.getAttribute('child_type');
		var child_grade	= c.getAttribute('child_grade');
		var imagefile	= c.getAttribute('imagefile');
		// var coordi_top	= c.offsetTop;
		var coordi_top  = Math.floor( c.offsetTop  / h * 10000 ) / 100;
		// var coordi_left	= c.offsetLeft;
		var coordi_left = Math.floor( c.offsetLeft / w * 10000 ) / 100;
		var checkin		= c.getAttribute('checkin');
		var estimate	= c.getElementsByClassName('ESTIMATE_TIME')[0].innerText;
		var checkout	= c.getAttribute('checkout');
		var operator	= c.getAttribute('operator');
		if ( operator == null ) operator = acc_id;
		var escort		= ( c.hasAttribute('escort') )? 1:0;		// 0: no escort, 1: escort
		var absent		= ( c.hasAttribute('absent') )? 1:0;		// 0: attend, 1: absent
		var direction	= c.getAttribute('direction');
		if ( direction == null ) direction = '';
		var remark 		= ( c.hasAttribute('remark') )? decodeURIComponent( c.getAttribute('remark') ) : '';
		jsonChildren.push( {
			 'child_id' 	: child_id,
			 'child_name'	: child_name,
			 'kana'			: kana,
			 'child_type'	: child_type,
			 'child_grade'	: child_grade,
			 'imagefile'	: imagefile,
			 'checkin'		: checkin,
			 'estimate'		: estimate,
			 'checkout'		: checkout,
			 'operator'		: operator,
			 'direction'	: direction,
			 'escort'		: escort,
			 'coordi_top'	: coordi_top,
			 'coordi_left'	: coordi_left,
			 'remark'		: remark,
			 'absent' 		: absent,
			 'day'			: dayWhiteboard
			 } );
	}

	return jsonChildren;

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
//	ホワイトボードをクローズ(保存はしていない)
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
		r += '<input type="text" id="whiteboard_day" name="day" style="width:96px;background-color:lightgrey;border:1px solid lightgrey;border-radius:3px;" readonly value="' + dayWhiteboard + '" />';
		r += '</div>';
		r += '</form>';

		r += '<div style="margin:0 auto;width:100%;text-align:center;padding-top:4px;">';
			r += '<button id="" type="button" class="accept_button" ';
			// r += ' style="font-size:24px;width:40px;height:40px;border:none;background-color:transparent;background-image:url(./images/check-3.png);background-size:24px;background-position:center center;background-repeat:no-repeat;" ';
			r += ' onclick="closeModalDialog();closeWhiteboardHelper();"   >';
				r += 'close';
			r += '</button>';

			r += '<button id="" type="button" class="cancel_button" ';
			// r += ' style="font-size:20px;width:40px;height:40px;border:none;background-color:transparent;background-image:url(./images/cancel-2.png);background-position:center center;background-size:24px;background-repeat:no-repeat;" ';
			r += ' onclick="closeModalDialog();" >';
				r += 'cancel';
			r += '</button>'
		r += '</div>';


	r += '</div>';
	openModalDialog( 'close whiteboard', r, 'NOBUTTON', null, null );
	// openModalDialog( 'close whiteboard', r, 'OK_CANCEL',
	// 	function(){
	// 		closeModalDialog();
	// 		closeWhiteboardHelper();
	// 	}, null );

}
//	ホワイトボードクローズ処理
function closeWhiteboardHelper(){
	dayWhiteboard 		= null;
	openWhiteboardFlg	= false;
	updateFlg			= false;
	ctlToolbar();
	oNav.close();
	oTile.close('menu');
	oTile.close('childfinder');
	showWorkPlace();
	// hiddenWhiteboard();
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
	var wbe = document.getElementById('WHITEBOARD_CHECKOUT');
	wb.style.visibility = 'hidden';
	wbe.style.visibility = 'hidden';
}

//
//	ホワイトボードを表示（操作可能）
//
function visibleWhiteboard(){
	openWhiteboardFlg = true;
	var wb  = document.getElementById('WHITEBOARD');
	var wbe = document.getElementById('WHITEBOARD_CHECKOUT');
	wb.style.visibility = 'visible';
	wbe.style.visibility = 'visible';
	// oNav.open();
}

//
//	ホワイトボード自体のドラッグ操作
//
function locateWhiteboard( e ){
	//e.preventDefault();
	var wb = document.getElementById('WHITEBOARD');
	var wbe = document.getElementById('WHITEBOARD_CHECKOUT');
	switch ( e.type ){
		case 'touchstart':
		case 'mousedown':
			console.log( 'locateWhiteboard(' + e.type + ')')
			if ( wb != e.target && wbe != e.target ) {
				console.log( 'wb_touch_move:' + wb_touch_move );
				return;
			}
			if(e.type === "mousedown") {
					var event = e;
				} else {
					var event = e.changedTouches[0];
					wb_touch_cnt += e.changedTouches.length;
					if ( wb_touch_cnt_max < wb_touch_cnt ) wb_touch_cnt_max = wb_touch_cnt;
				}
			wb_touch_move = false;
			break;
		case 'mousemove':
		case 'touchmove':
			wb_touch_move = true;
			break;
		case 'touchend':
		case 'mouseup':
			console.log( 'locateWhiteboard(' + e.type + ')')
			if(e.type === "mouseup") {
				var event = e;
			} else {
				var event = e.changedTouches[0];
				document.getElementById('ID_CHILD_COORDINATE').innerText = 'touches:' + wb_touch_cnt + ' force:' + event.force;
				wb_touch_cnt -= e.changedTouches.length;
				if ( wb_touch_cnt == 0 ) wb_touch_cnt_max = 0;
			}

			if ( wb_touch_cnt_max < 2){
				if ( wb == e.target || wbe == e.target ){
					if ( ! wb_touch_move ){
						if ( oNav.opened() )
							oNav.close();
						resetChildMark();
					}
				}
			} else {
			}
			if ( oTile.opened('menu'))
				oTile.close('menu');
			wb_touch_move = false;
			break;
	}
}

//
//	キーボード操作
//
function keyWhiteboard(e){
	//e.preventDefault();
	if ( !openWhiteboardFlg ) return;
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
	m.style.pointerEvents	= 'none';
	m.style.position		= 'absolute';
	m.style.top 			= ( ( h / 2 ) - ( 126 / 2 ) ) + 'px';
	// m.style.left			= ( ( w / 2 ) - this.size )+ 'px';
	m.style.left			= '0px';
	m.style.width			= '192px';
	m.style.height			= '196px';
	m.style.color			= 'snow';
	m.style.backgroundColor	= 'transparent';
	m.style.fontSize		= '12px';
	m.style.zIndex			= 65000;
	m.style.visibility		= 'hidden';
	var r = '';
	// r += '<div                        class="vh-center nav_icon2" style="position:absolute;top:42px;left:42px;" >';
	// 	r += '&nbsp;';
	// r += '</div>';
	r += '<div marked="yes" target="escort"        class="nav_icon2" ';
	r += ' style="text-align:center;position:absolute;top:128px;left:64px;background-image:url(./images/family.png);background-size:20px;background-position:center center;background-repeat:no-repeat;" >';
		r += 'escort';
	r += '</div>';
	r += '<div marked="yes" target="delete"        class="nav_icon2" ';
	r += ' style="text-align:center;position:absolute;top:0px;left:64px;background-image:url(./images/minus-2.png);background-size:20px;background-position:center center;background-repeat:no-repeat;" >';	// Delete Mark Child
		r += 'delete';
	r += '</div>';
	r += '<div marked="yes" target="checkout"      class="nav_icon2" ';
	r += ' style="text-align:center;position:absolute;top:32px;left:128px;background-image:url(./images/check-3.png);background-size:20px;background-position:center center;background-repeat:no-repeat;" >';	// Checkout Mark Child
		r += 'chk out';
	r += '</div>';
	r += '<div marked="yes" target="checkoutclear" class="nav_icon2" ';
	r += ' style="text-align:center;position:absolute;top:96px;left:128px;background-image:url(./images/dry-clean.png);background-size:20px;background-position:center center;background-repeat:no-repeat;" >';	// Checkout Clear Mark Child
		r += 'chk clr';
	r += '</div>';
	r += '<div marked="yes" target="property"      class="nav_icon2" ';
	r += ' style="text-align:center;position:absolute;top:32px;left:0px;background-image:url(./images/hexagon.png);background-size:20px;background-position:center center;background-repeat:no-repeat;" >';	// Checkout Mark Child
		r += 'property';
	r += '</div>';
	r += '<div marked="yes" target="absent" class="nav_icon2" ';
	r += ' style="text-align:center;position:absolute;top:96px;left:0px;background-image:url(./images/sleep-2.png);background-size:20px;background-position:center center;background-repeat:no-repeat;" >';	// Absent Child
		r += 'absent';
	r += '</div>';
	r += '<div target="exchange"   class="vh-center nav_icon2" ';
	r += ' style="position:absolute;top:160px;left:128px;height:21px;background-image:url(./images/exchange.png);background-size:12px;background-position:center center;background-repeat:no-repeat;" >';
		r += 'socket';
	r += '</div>';
	r += '<div marked="yes" target="close" class="nav_icon2" ';
	r += ' style="text-align:center;position:absolute;top:64px;left:64px;background-image:url(./images/compass.png);background-size:20px;background-position:center center;background-repeat:no-repeat;" >';	// ON_OFF
		r += 'NAV';
	r += '</div>';

	m.innerHTML				= r;

	// this.frame = document.body.appendChild( m );
	this.frame	= document.getElementById('LAYER').appendChild( m );
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
		this.frame.style.left		= ( ( w / 2 ) - ( this.frame.offsetWidth / 2 ) )+ 'px';
		// this.frame.style.left		= '0px';
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
				// propertyWhiteboardChild();
				propertyChildren();
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
//	ホワイトボードエリアのフィッティング処理
//
function fitting(){
	console.log('fitting');
	if ( !openWhiteboardFlg ){
		resizeWorkplace();
		return;
	}
	var w = document.body.clientWidth;
	var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;

	// w = document.getElementById('LAYER').offsetWidth;
	// h = document.getElementById('LAYER').offsetHeight;

	var layer = document.getElementById('LAYER');
	var wbt	  = document.getElementById('WHITEBOARD_TOOLBAR');
	layer.style.width = w + 'px';
	layer.style.height = h + 'px';
	wbt.style.width		= w + 'px';
	

	criteriaEscortPixel = w;

	// var tb_height = document.getElementById('TOOLBAR').offsetHeight;
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

	var nsi = document.getElementById('NAV_START_ICON');
	nsi.style.top 	= ( ( h / 2 ) - ( nsi.offsetHeight / 2) ) + 'px';
	// nsi.style.left	= ( ( w / 2 ) - ( nsi.offsetWidth / 2 ) ) + 'px';

	//	NAVリロケーション
	if ( oNav.opened() ){
		oNav.frame.style.top	= ( ( h / 2 ) - ( oNav.frame.offsetHeight / 2 ) ) + 'px';
		oNav.frame.style.left	= ( ( w / 2 ) - ( oNav.frame.offsetWidth  / 2 ) ) + 'px';	
		// oNav.frame.style.left	= '0px';
	}

	var nsi2 = document.getElementById('NAV_START_ICON2');
	// nsi2.style.top = ( ( h / 2 ) - ( tb_height + ( nsi2.offsetHeight / 2 ) ) ) + 'px';
	// nsi2.style.top = ( h - nsi2.offsetHeight ) + 'px';
	nsi2.style.top = '0px';
	// nsi2.style.left	= ( w - 42 ) + 'px';
	nsi2.style.left	= ( ( w / 2 ) - ( nsi2.offsetWidth / 2 ) ) + 'px';

	var cfm = document.getElementById('CHILDFINDER_MAIN');
	if ( cfm != null ){
		var cff 	= document.getElementById('CHILDFINDER_FRAME')
		var cfh   	= document.getElementById('CHILDFINDER_HEADER');
		var h 		= cff.offsetHeight - cfh.offsetHeight;
		console.log( 'CHILDFINDER_HEADER height:' + cfh.offsetHeight);
		// console.log( 'cfm height:' + h );
		cfm.style.height = h + 'px';
	}

	var imne = document.getElementById('ID_MODE_CHECKIN');
	var ime  = document.getElementById('ID_MODE_CHECKOUT');
	imne.style.top	= '84px';
	imne.style.left	= ( w - imne.offsetWidth ) + 'px';
	ime.style.top	= '84px';
	ime.style.left	= ( w - ime.offsetWidth * 2 ) + 'px';

	var itba = document.getElementById('ID_TIMELINE_BAR_AREA');
	var itb = document.getElementById('ID_TIMELINE_BAR');
	itba.style.left	= ( w - itba.offsetWidth ) + 'px';
	itb.style.left	= ( w - itb.offsetWidth  ) + 'px';

	var icf = document.getElementById('ID_NAV_CHILDFINDER');
	icf.style.left	= ( w - icf.offsetWidth ) + 'px';
	var iprog = document.getElementById('ID_PROGRESS');
	iprog.style.left	= ( w - iprog.offsetWidth ) + 'px';

	var tr = document.getElementById('TOOLBAR_RIGHT');
	tr.style.left	= ( w - tr.offsetWidth ) + 'px';

	initNavLocatedChildFrame();
	initNavStorageChildFrame();

	// レポートダイアログのサイズ調整
	oReportDlg.init();

	if ( w <= 414){
		document.getElementById('WHITEBOARD_DAY_FRAME').style.display = 'none';
	} else{
		document.getElementById('WHITEBOARD_DAY_FRAME').style.display = 'inline';
	}

	if ( h <= 300 ){
		itba.style.visibility	= 'hidden';
		itb.style.visibility	= 'hidden';
	} else{
		itba.style.visibility	= 'visible';
		itb.style.visibility	= 'visible';
	}


}

function initNavLocatedChildFrame(){
	var w = document.body.clientWidth;
	var wbf = document.getElementById('WHITEBOARD_FRAME');
	var nlcf = document.getElementById('NAV_LOCATED_CHILD_FRAME');
	var nscf = document.getElementById('NAV_STORAGE_CHILD_FRAME');
	nlcf.style.top	= ( wbf.offsetHeight - 32 ) + 'px';
	nlcf.style.left	= ( w - ( nlcf.offsetWidth + nscf.offsetWidth + 42 + 1 ) ) + 'px';

}
function initNavStorageChildFrame(){
	var w = document.body.clientWidth;
	var wbf = document.getElementById('WHITEBOARD_FRAME');
	var nlcf = document.getElementById('NAV_LOCATED_CHILD_FRAME');
	var nscf = document.getElementById('NAV_STORAGE_CHILD_FRAME');
	nscf.style.top	= ( wbf.offsetHeight - 32 ) + 'px';
	nscf.style.left	= ( w - ( nlcf.offsetWidth + 42 + 0 ) ) + 'px';
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
	// oTile.close();
	oTile.close('menu');
	oTile.close('childfinder');
	oSpotlight.close();
	// if ( flagChildrenPallete ) foldingChildrenPallete();

}

//
//	ツールバーの表示制御
//
function showToolbar(){
	var lf		= document.getElementById('LAYER_FRAME');
	var layer	= document.getElementById('LAYER');
	var nsi 	= document.getElementById('NAV_START_ICON');
	var nlcf	= document.getElementById('NAV_LOCATED_CHILD_FRAME');
	var nscf	= document.getElementById('NAV_STORAGE_CHILD_FRAME');
	// var tb      = document.getElementById('TOOLBAR');
	var tr  	= document.getElementById('TOOLBAR_RIGHT');
	var wbf     = document.getElementById('WHITEBOARD_FRAME');
	var wbt		= document.getElementById('WHITEBOARD_TOOLBAR');
	// var ia		= document.getElementById('ID_NAV_ACCOUNT');
	var icf		= document.getElementById('ID_NAV_CHILDFINDER');
	var iprog	= document.getElementById('ID_PROGRESS');
	var tlb		= document.getElementById('ID_TIMELINE_BAR');
	var tlba	= document.getElementById('ID_TIMELINE_BAR_AREA');
	var psb		= document.getElementById('ID_PERSPECTIVE_BAR');
	var imne 	= document.getElementById('ID_MODE_CHECKIN');
	var ime  	= document.getElementById('ID_MODE_CHECKOUT');
	lf.style.visibility		= 'visible';
	layer.style.visibility	= 'visible';
	nlcf.style.visibility	= 'visible';
	nscf.style.visibility	= 'visible';
	// tb.style.visibility     = 'visible';
	tr.style.visibility		= 'visible';
	wbf.style.visibility    = 'visible';
	wbt.style.visibility	= 'visible';
	tlb.style.visibility	= 'visible';
	tlba.style.visibility	= 'visible';
	// psb.style.visibility	= 'visible';
	imne.style.visibility	= 'visible';
	ime.style.visibility	= 'visible';
	// ia.style.visibility		= 'visible';
	icf.style.visibility	= 'visible';
	iprog.style.visibility	= 'visible';
	// eam.style.visibility	= 'visible';
	// showStartIcon();
	visibleWhiteboard();

}

function hideToolbar(){
	console.log('hideToolbar');
	var lf		= document.getElementById('LAYER_FRAME');
	var layer	= document.getElementById('LAYER');
	var nsi 	= document.getElementById('NAV_START_ICON');
	var nlcf	= document.getElementById('NAV_LOCATED_CHILD_FRAME');
	var nscf	= document.getElementById('NAV_STORAGE_CHILD_FRAME');
	// var tb      = document.getElementById('TOOLBAR');
	var tr		= document.getElementById('TOOLBAR_RIGHT');
	var wbf     = document.getElementById('WHITEBOARD_FRAME');
	var wbt		= document.getElementById('WHITEBOARD_TOOLBAR');
	// var ia		= document.getElementById('ID_NAV_ACCOUNT');
	var icf		= document.getElementById('ID_NAV_CHILDFINDER');
	var iprog	= document.getElementById('ID_PROGRESS');
	var tlb		= document.getElementById('ID_TIMELINE_BAR');
	var tlba	= document.getElementById('ID_TIMELINE_BAR_AREA');
	var psb		= document.getElementById('ID_PERSPECTIVE_BAR');
	var imne 	= document.getElementById('ID_MODE_CHECKIN');
	var ime  	= document.getElementById('ID_MODE_CHECKOUT');
	lf.style.visibility		= 'hidden';
	layer.style.visibility	= 'hidden';
	nlcf.style.visibility	= 'hidden';
	nscf.style.visibility	= 'hidden';
	nsi.style.visibility	= 'hidden';
	// nsi2.style.visibility	= 'hidden';
	// tb.style.visibility     = 'hidden';
	tr.style.visibility		= 'hidden';
	wbf.style.visibility    = 'hidden';
	wbt.style.visibility	= 'hidden';
	tlb.style.visibility	= 'hidden';
	tlba.style.visibility	= 'hidden';
	psb.style.visibility	= 'hidden';
	imne.style.visibility	= 'hidden';
	ime.style.visibility	= 'hidden';
	// ia.style.visibility		= 'hidden';
	icf.style.visibility	= 'hidden';
	iprog.style.visibility	= 'hidden';
	// eam.style.visibility	= 'hidden';
	hideStartIcon();
	hiddenWhiteboard();

}

//
//	スタートアイコン表示制御
//
function showStartIcon(){
	var nsi2 	= document.getElementById('NAV_START_ICON2');
	nsi2.style.visibility	= 'visible';
}
function hideStartIcon(){
	var nsi2 	= document.getElementById('NAV_START_ICON2');
	nsi2.style.visibility	= 'hidden';
}



function getCookie(){
	var c = document.cookie;
	oLog.log( null, c );
	oLog.log( null, 'checkSign:' + checkSign() );
	// alert("[" + c + "]");
	// alert( checkSign() );
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
			r += "<button type='button' onclick='' >OK</button>";
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
		// r += "<div id='SIGNIN_STATUS' style='height:20px;text-align:center;' >status</div>";
		r += "<div style='margin:10px auto;width:210px;height:100px;' >";
		r += "</div>";

		r += '<div style="margin:0 auto;width:60%;text-align:center;padding-top:4px;">';
			r += '<button id="" type="button" class="accept_button" ';
			// r += ' style="font-size:24px;width:80px;height:80px;border:none;background-color:transparent;background-image:url(./images/check-3.png);background-size:24px;background-position:center center;background-repeat:no-repeat;" ';
			r += ' onclick="closeModalDialog();signout();"   >';
				r += 'sign out';
			r += '</button>';

			r += '<button id="" type="button" class="cancel_button" ';
			// r += ' style="font-size:20px;width:80px;height:80px;border:none;background-color:transparent;background-image:url(./images/cancel-2.png);background-position:center center;background-size:24px;background-repeat:no-repeat;" ';
			r += ' onclick="closeModalDialog();" >';
				r += 'cancel';
			r += '</button>'

		r += '</div>';


	r += "</div>";

	openModalDialog( 'sign out', r, 'NOBUTTON', null, 'SIGNOUT' );
	// openModalDialog( 'sign out', r, 'OK_CANCEL',
	// 	function(){
	// 		closeModalDialog();
	// 		signout();
	// 	}, 'SIGNOUT' );

}


//
//	サインアウト処理（同期処理）
//
function signout(){
	console.log('sign out');

	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
				break;
			case 2://header received
				break;
			case 3://loading
				// oLog.log( null, 'サインアウト処理中.' );
				// oLog.open( 3 );
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					if ( result != null ){
						switch( result.cmd ){
							case 'signout':
								oLog.log( null, 'サインアウトしました.' );
								oLog.open( 1 );
								acc_id = null;
								// signForm();
								document.cookie = 'acc=; max-age=0';
								workplace_id = 'AUTHENTICATION';
								showWorkPlace();
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

//
//	サインインしているIDをサーバから取得
//
// function signid(){
// 	var xmlhttp = new XMLHttpRequest();
// 	xmlhttp.open("POST", "/accounts/sign", false );
// 	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
// 	xmlhttp.send();
// 	if ( xmlhttp.status == 200 ){
// 		var result = JSON.parse( xmlhttp.responseText );
// 		return ( result != null )? result.status:null;	
// 	} else return null;

// }

//
//	サイン処理
//
function sign()
{
	var sign_id = sign_form.id.value;
	var sign_pwd = sign_form.pwd.value;

	if ( sign_id == '' ){
		oLog.log( null, 'ID　を入力してください.' );
		oLog.open( 3 );
		sign_form.id.focus();
		return;
	}
	if ( sign_pwd == '' ){
		oLog.log( null, 'Password　を入力してください.' );
		oLog.open( 3 );
		sign_form.pwd.focus();
		return;
	}


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
								oLog.log( null, 'サインインしました.' );
								oLog.open( 3 );
								acc_id = result.acc_id;
								workplace_id = 'DASHBOARD';
								showWorkPlace();
								// ホワイトボードをオープン
								// if ( !openWhiteboardFlg ){
								// 	openWhiteboard();
								// }
							} else {
								oLog.log( null, 'サインインエラー.' );
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
		xmlhttp.open("POST", "/accounts/signin", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( "acc=" + sign_id + "&pwd=" + sign_pwd );
	} catch ( e ) {
		oLog.log( null, 'sign:e:' + e );
		oLog.open( 3 );
	}
}



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
	oTile.close('menu');
	oTile.close('childfinder');
	oSpotlight.close();
	// if ( flagChildrenPallete ) foldingChildrenPallete();

	
	var r = "";	
	r += "<div style='width:350px;height:;margin:10px auto;background-color:white;overflow:hidden;' >";
		r += "<div style='height:40px;padding-top:20px;text-align:center;font-size:20px;' >Sign in to your account</div>";
		r += "<div id='SIGNIN_STATUS' style='height:20px;text-align:center;' >&nbsp;</div>";
		r += "<div style='margin:10px auto;width:210px;' >";
			r += "<form name='sign_form' onsubmit='return false;' >";
			r += "<div style='font-size:12px;' >ID:</div>";
			r += "<div><input style='width:200px;outline:none;border-radius:3px;padding:6px;background-color:lightgrey;background-image:url(./images/user-2.png);background-size:10px;background-repeat:no-repeat;background-position:right 4px center;' type='text' id='acc_id' name='id' tabindex=1 autocomplete='off' /></div>";
			r += "<div style='font-size:12px;padding-top:20px;' >Password:</div>";
			r += "<div><input style='width:200px;outline:none;border-radius:3px;padding:6px;background-color:lightgrey;background-image:url(./images/key.png);background-size:8px;background-repeat:no-repeat;background-position:right 4px center;' type='password' name='pwd' tabindex=2 /></div>";
			r += "<div style='padding-top:40px;text-align:center;' >";
				r += "<button type='button' class='next_button' ";
				r += " style='border:none;' onclick='sign()' >";
				r += "next";
				r += "</button>";
				r += "<button type='button' class='cancel_button' ";
				r += " style='border:none;' onclick='closeModalDialog()' >";
				r += "cancel";
				r += "</button>";
			r += "</div>";
			r += "</form>";
		r += "</div>";
	r += "</div>";

	neverCloseDialog = false;
	openModalDialog( 'sign in to your account', r, 'NOBUTTON', null, 'SIGNIN' );
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
//	レンジリスト生成処理
//
function makeRangeList( id, direction )
{
	console.log('makeRangeList:' + id );
	var p = document.getElementById( id );
	if ( p.hasChildNodes() ) return;
	p.innerHTML = '';

	var r = "";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				var o = document.getElementById( id );
				o.innerText = 'access...';
				break;
			case 4://done
				r = "";
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					//r += xmlhttp.responseText;
					var o = document.getElementById( id );
					o.innerText = '';
					for ( var i=0; i<result.length; i++ ){
						addRangeListHelper( o, result[i], direction );
					}
					//o.innerHTML = r;
				} else{
					document.getElementById( id ).innerText = xmlhttp.status;
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/rangelist", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send();
	} catch ( e ) {
		oLog.log( null, 'makeRangeList : ' + e );
		oLog.open( 3 );
		// alert( e );
	}

}

//
//	レンジリスト用DIV生成ヘルパー
//
function addRangeListHelper( oParent, Result, direction ){

	var c = document.createElement("DIV");
	console.log( 'writing mode:' + oParent.style.writingMode );
	switch ( direction ){
		case 'H':
			c.classList.add('range_box');
			break;
		case 'V':
			c.classList.add('range_box_lr');
			break;
	}
	c.classList.add('unselected');

	c.setAttribute("range_id",  Result.range_id );
	c.setAttribute("sotd", 		Result.sotd );
	c.setAttribute("eotd", 		Result.eotd );

	var range_id = Result.range_id;

	var r = '';
    r += '<div style="text-align:center;"  >';
    	r += range_id;
    r += '</div>';
	c.innerHTML = r;
    var cc = oParent.appendChild( c );
	if ( cur_range_id == range_id ){
		cc.setAttribute( 'selected', 'yes' );
		cc.classList.add( 'selected' );
	}

}


//
//	ホワイトボードリスト生成処理
//
function makeWhiteboardList( range_id )
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
		xmlhttp.send( 'range_id=' + range_id );
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

	var day = new Date( Result.day );
	var c_children		= Result.c_children;
	var c_resv_children	= Result.c_resv_children;
	var ymd = day.getFullYear() + '/' + ( '00' + (day.getMonth() + 1 ) ).slice(-2) + '/' + ( '00' + day.getDate() ).slice(-2);

	var r = '';
    r += '<div style="text-align:center;"  >';
    	r += ymd;
    r += '</div>';
    r += '<div style="font-size:24px;text-align:center;padding-top:8px;" >';
    	r += c_children
		// r += '(' + c_resv_children + ' rsrv)' + ' child';
    r += '</div>';
	c.innerHTML = r;
    var cc = oParent.appendChild( c );

}




//
//	セレクトしたチャイルドをホワイトボードにチェックイン
//
function checkinSelectedChild( hm ){
	console.log( 'checkinSelectedChild(' + hm + ')');
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

	var w = document.getElementById('WHITEBOARD').offsetWidth;
	var h = document.getElementById('WHITEBOARD').offsetHeight;

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

				// 相対座標に変換
				var perTop	= ( Math.floor( ( top  + ( cursor * 20 ) ) / h * 10000 ) / 100 ) + '%';
				var perLeft	= ( Math.floor( ( left + ( cursor *  0 ) ) / w * 10000 ) / 100 ) + '%';

				// addChild( top + ( cursor * 20 ), left + ( cursor * 0 ), id, child_name, kana, child_type, child_grade, null, null, false, false, false );
				addChild( perTop, perLeft, id, child_name, kana, child_type, child_grade, null, null, false, false, false );
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
	// var escort = Math.floor( left / criteriaEscortPixel );
	// var left2  = left - ( escort * criteriaEscortPixel );
	var m15 = Math.floor( ( criteriaEscortPixel - 0 ) * 0.25 );	//  144->0 is child width

	var h = 8 + Math.floor( top / pixelPerHour );		//200px:1hour
	var m = Math.floor( left / m15 ) * 15;
	// var m = Math.floor( 60 * left2 / criteriaEscortPixel );
	// m = Math.floor( m / 15 ) * 15;
	// console.log( 'm:' + m + ', left:' + left );
	if ( m <= 0  ) m = 0;
	if ( m >= 45 ) m = 45;
//	if ( m >= 15 ) m = 15;

	return ( '00' + h ).slice(-2) + ('00' + m ).slice(-2);
}

//
//	ホワイトボードの座標からエスコート（お迎え）判断
//
// function coordinateToEscort( top, left ){
// 	var escort = Math.floor( left / criteriaEscortPixel );
// 	return ( escort > 0 )?true:false;
// }

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

	// var w = document.body.clientWidth;
	var w = document.getElementById('WHITEBOARD').offsetWidth;
	var h = document.getElementById('WHITEBOARD').offsetHeight;
	var ratioLeft = Math.floor( curChild.offsetLeft   / w * 10000 ) / 100;
	var ratioTop  = Math.floor( curChild.offsetTop    / h * 10000 ) / 100;

	console.log('mDown:top:'  + '(' + curChild.offsetTop  + '/' + h + ')' + ratioTop );
	console.log('mDown:left:' + '(' + curChild.offsetLeft + '/' + w + ')' + ratioLeft );

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
	// var w = document.body.clientWidth;
	var w = document.getElementById('WHITEBOARD').offsetWidth;
	var h = document.getElementById('WHITEBOARD').offsetHeight;

	// console.log('mMove:' + e.type );
	//ドラッグしている要素を取得
	//var drag = document.getElementsByClassName("drag")[0];
//		var drag = e.target;
	var drag = curChild;

	if ( drag == null ) return;
	//	マークしていないとムーブしないよ
	if ( !isMarkedChild( drag ) ) return; 

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
	if ( e.type == 'touchmove' ||
		 (( e.buttons & 1 ) && e.type == 'mousemove' ) ){
		var old_top  = drag.offsetTop;
		var old_left = drag.offsetLeft;
		if ( ( event.pageY - y ) < 0 || ( event.pageX - x ) < 0 ) return;
		if ( ( event.pageY - y ) >= wb_height || ( event.pageX - x  ) >= wb_width  ) return;
		//if ( !checkOtherChildCoordinate( drag, event.pageX - x, event.pageY - y ) ) return;
		if ( !checkOtherChildCoordinate( drag, event.pageX - x - old_left, event.pageY - y - old_top ) ) return;
		
		// topを相対座標で移動
		// drag.style.top  = event.pageY - y + "px";
		drag.style.top  = ( Math.floor( ( event.pageY - y ) / h * 10000 ) / 100 ) + '%';

		// leftを相対座標で移動
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
function moveOtherChild( base_child, delta_x, delta_y ){
	var w = document.getElementById('WHITEBOARD').offsetWidth;
	var h = document.getElementById('WHITEBOARD').offsetHeight;
	var children = getMarkedChild();
	if ( children.length == 0 ) return;
	for ( var i=0; i<children.length; i++ ){
		if ( base_child != children[i]){
			var pxTop	= children[i].offsetTop + delta_y;
			var perTop	= ( Math.floor( pxTop / h * 10000 ) / 100 ) + '%';
			var pxLeft	= children[i].offsetLeft + delta_x;
			var perLeft	= ( Math.floor( pxLeft / w * 10000 ) / 100 ) + '%';
	
			children[i].style.top  = perTop;
			children[i].style.left = perLeft;
			var et = children[i].getElementsByClassName('ESTIMATE_TIME');
			if ( et != null ){
				var hm = coordinateToTime( children[i].offsetTop, children[i].offsetLeft );
				et[0].innerText = hm;
				if ( children[i].hasAttribute('checkout') ) children[i].setAttribute('checkout', hm );
			}

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
						if ( getMarkedChild().length == 0 ){
							if ( oNav.opened() )
								oNav.close();
						}


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
	console.log('resetChildMark()');
	var children = document.getElementById( 'WHITEBOARD' ).childNodes;
	for ( var i=0; i<children.length; i++ ){
		unmarkChild( children[i] );
	}
	children = document.getElementById( 'WHITEBOARD_CHECKOUT' ).childNodes;
	for ( var i=0; i<children.length; i++ ){
		unmarkChild( children[i] );
	}

}



