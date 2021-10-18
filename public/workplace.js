var workplace_id = null;

function initWorkplace(){

	var hdr = document.getElementById('WORKPLACE_HDR');
	hdr.setAttribute( 'orgHeight', hdr.offsetHeight + 'px' );

	// test code
	document.getElementById('OPAQUESHAFT_TITLE').addEventListener(
		'click',
		function(e){
			var layer = document.getElementById('LAYER_FRAME');
			if ( layer.style.transform == '' ){
				layer.style.transform = 'scale(0.5,0.5)';
				layer.style.transformOrigin	= 'left bottom';
			}else{
				layer.style.transform = '';
				layer.style.transformOrigin	= '';
			}
			console.log('test');
		}
	);
	document.getElementById('TAB_OPAQUESHAFT').addEventListener(
		'click', workplaceReset );
	document.getElementById('WORKPLACE_ICON').addEventListener(
		'click', workplaceReset );
		
    document.getElementById('WP_KEYWORD').addEventListener(
		'keyup',
		function( e ){
			if ( e.key == 'Enter' )
            finder();
		}
	);

	document.getElementById('BTN_ADD_DATE').addEventListener('click',
	function(e){
		var d = guidedance_whiteboard_form.day.value;
		var dd = null;
		if ( d == '' )	dd = new Date();
		 else			dd = new Date( d );
		dd.setDate( dd.getDate() + 1 );
		guidedance_whiteboard_form.day.value =
			dd.getFullYear() + '/' + ('00' + ( dd.getMonth() + 1 )).slice(-2) + '/' + ('00' + dd.getDate()).slice(-2);
	}, false );
	document.getElementById('BTN_MINUS_DATE').addEventListener('click',
	function(e){
		var d = guidedance_whiteboard_form.day.value;
		var dd = null;
		if ( d == '' )	dd = new Date();
		 else			dd = new Date( d );
		dd.setDate( dd.getDate() - 1 );
		guidedance_whiteboard_form.day.value =
			dd.getFullYear() + '/' + ('00' + ( dd.getMonth() + 1 )).slice(-2) + '/' + ('00' + dd.getDate()).slice(-2);
	}, false );


	new Button( 'WP_WHITEBOARD',  workplaceWhiteboard ).play();
	new Button( 'WP_CHILDREN',    workplaceChildren ).play();
	new Button( 'WP_SETTING',     accountProperty ).play();
	new Button( 'WP_SIGNIN',      signForm ).play();
	new Button( 'WP_SIGNOUT',     signoutForm ).play();

	document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST').addEventListener(
		'click', selectChildren );
	document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST').addEventListener(
		'transitionend', selectChildrenTransitionEnd );
	
	// document.getElementById('BOTTOM_FRAME').addEventListener(
	// 	'resize', resizeWorkplace );
	// var bf = document.getElementById('BOTTOM_FRAME');
	// var observer = new MutationObserver( records => {
	// 	resizeWorkplace();
	// });
	// observer.observe( bf, { attributes: true });

}

//
//		ワークプレイス（統合メニュー）を表示
//
function showWorkPlace(){

	closeModalDialog();

	//	OPAQUESHAFT_TITLE表示制御
	var opaqueshaft_title = document.getElementById('OPAQUESHAFT_TITLE');
	opaqueshaft_title.style.visibility = ( openWhiteboardFlg )? 'visible' : 'hidden';

	var bo		= document.getElementById('BOTTOM_OVERLAY');
	bo.style.visibility		= 'visible';

	var wp_signin	= document.getElementById('WP_SIGNIN');
	var wp_siginout	= document.getElementById('WP_SIGNOUT');
	var wp_whiteboard	= document.getElementById('WP_WHITEBOARD');
	var wp_children		= document.getElementById('WP_CHILDREN');
	var wp_setting		= document.getElementById('WP_SETTING');

	if ( checkSign() ){
		// signed
		wp_signin.setAttribute( 'disabled', 'true' );
		wp_whiteboard.removeAttribute( 'disabled' );
		wp_children.removeAttribute( 'disabled' );
		wp_setting.removeAttribute( 'disabled' );
		// wp_open.removeAttribute( 'disabled' );
		wp_siginout.removeAttribute( 'disabled' );
		wp_signin.style.visibility		= 'hidden';
		wp_siginout.style.visibility	= 'visible';
		wp_whiteboard.style.visibility	= 'visible';
		wp_children.style.visibility	= 'visible';
		wp_setting.style.visibility	= 'visible';
	} else {
		// not sign
		wp_signin.removeAttribute( 'disabled' );
		wp_siginout.setAttribute( 'disabled', 'true' );
		wp_whiteboard.setAttribute( 'disabled', 'true' );
		wp_children.setAttribute( 'disabled', 'true' );
		wp_setting.setAttribute( 'disabled', 'true' );
		// wp_open.setAttribute( 'disabled', 'true' );
		wp_signin.style.visibility		= 'visible';
		wp_siginout.style.visibility	= 'hidden';
		wp_whiteboard.style.visibility	= 'hidden';
		wp_children.style.visibility	= 'hidden';
		wp_setting.style.visibility	= 'hidden';
	}

	resizeWorkplace();

}

//
//	ワークプレイス
//
function workplaceReset(){

	workplace_id = null;
	var icon	= document.getElementById('WORKPLACE_ICON');
	var hdr		= document.getElementById('WORKPLACE_HDR');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');
	var children= document.getElementById('WORKPLACE_CHILDREN');

	if ( icon.style.height == '0px'){
		icon.style.height = icon.getAttribute('orgHeight');
		hdr.style.height = hdr.getAttribute('orgHeight');
	} else {
		icon.setAttribute('orgHeight', icon.style.height );
	}

	wb.style.height = '0px';
	children.style.height = '0px';

	//	TAB
	var tab = document.getElementById('TAB_OPAQUESHAFT');
	var current = document.getElementById('TAB_CURRENT');
	tab.style.visibility = 'hidden';
	current.style.visibility = 'hidden';

}

//
//	ホワイトボードメニュー
//
function workplaceWhiteboard(){
	workplace_id = 'WHITEBOARD';

	// var today = new Date();
	// var y = today.getFullYear();
	// var m = ('00' + (today.getMonth() + 1 ) ).slice(-2);
	// var d = ('00' + today.getDate() ).slice(-2);
	// var ymd = y + '/' + m + '/' + d;
	// guidedance_whiteboard_form.day.value = ymd;
	guidedance_whiteboard_form.day.value = '';


	var icon	= document.getElementById('WORKPLACE_ICON');
	var hdr		= document.getElementById('WORKPLACE_HDR');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');
	var children= document.getElementById('WORKPLACE_CHILDREN');
	var wpwm	= document.getElementById('WORKPLACE_WHITEBOARD_MAIN');
	var list	= document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST');

	//	TAB
	var tab = document.getElementById('TAB_OPAQUESHAFT');
	var current = document.getElementById('TAB_CURRENT');
	tab.style.visibility = 'visible';
	current.style.visibility = 'visible';
	current.innerText = 'whiteboard';
	
	if ( icon.style.height == '0px'){
		icon.style.height	= icon.getAttribute('orgHeight');
		hdr.style.height	= hdr.getAttribute('orgHeight');
	} else {
		icon.setAttribute('orgHeight', icon.style.height );
		icon.style.height	= '0px';
		hdr.style.height	= '0px';
	}

	resizeWorkplace();
	children.style.height = '0px';
	list.innerHTML = '';

		//	レンジリスト作成
		makeRangeList();
		addWorkplaceWhiteboard();

}

function addWorkplaceWhiteboard(){
	var p = document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST');

	// var today = new Date();
	// var y = today.getFullYear();
	// var m = ('00' + (today.getMonth() + 1 ) ).slice(-2);
	// var d = ('00' + today.getDate() ).slice(-2);
	// var ymd = y + '/' + m + '/' + d;

	var r = '';
	r += '<div style="margin:0 auto;font-size:14px;width:70%;">';
	// r += '<form name="guidedance_whiteboard_form" onsubmit="return false;" >';
	// r += '<div>Date:</div>';
	// r += '<div style="height:30px;padding-bottom:2px;" >';
	// 	r += '<div style="width:50%;float:left;" >';
	// 		r += '<input type="text" id="whiteboard_day" name="day" style="width:90%;font-size:;" value="' + ymd + '" />';
	// 	r += '</div>';
	// 	r += '<div style="float:left;width:30px;" >';
	// 		r += '<button id="BTN_ADD_DATE"   style="width:18px;height:8px;background-color:transparent;border:none;background-image:url(./images/arrow-black-triangle-up.png);background-size:6px;background-repeat:no-repeat;background-position:center center;" ></button>';
	// 		r += '<button id="BTN_MINUS_DATE" style="width:18px;height:8px;background-color:transparent;border:none;background-image:url(./images/arrow-black-triangle-down.png);background-size:6px;background-repeat:no-repeat;background-position:center center;" ></button>';
	// 	r += '</div>';
	// r += '</div>';
	// r += '</form>';

	// r += '<div style="clear:both;" >Ranges:</div>';
	// r += '<div id="RANGE_LIST" ></div>';
	r += '<div style="padding-top:14px;" >Whiteboards:</div>';
	r += '<div id="WHITEBOARD_LIST" >';
	r += '</div>';
	r += '<div style="text-align:center;padding-top:5px;" >';
	r += '<button id="BTN_OPENWHITEBOARD" class="next_button" ';
		r += ' onclick="createWhiteboard()" >';
		r += 'next';
	r += '</button>';
	r += '</div>';
	r += '<div>';
		// r += '<div id="CALENDAR_LIST"   style="float:left;width:84px;" ></div>';
		// r += '<div id="CALENDAR_DETAIL" style="float:left;width:140px;" ></div>';
		r += '<div id="CALENDAR_LIST"   style="float:;position:relative;width:100%;height: 84px;overflow:scroll;" ></div>';
		r += '<div id="CALENDAR_DETAIL" style="float:;position:relative;width:100%;height:240px;overflow:scroll;" ></div>';
	r += '</div>';


	p.innerHTML = r;

	//	レンジリスト作成
	makeRangeList();



	// document.getElementById('RANGE_LIST').addEventListener('mousedown',
	// 	function(e) {
	// 		var o = e.target;
	// 		if ( o == document.getElementById('RANGE_LIST')) return;
	// 		while ( o.parentNode != document.getElementById('RANGE_LIST') ){
	// 			o = o.parentNode;
	// 		}
	// 		o.style.color			= 'white';
	// 		o.style.backgroundColor = 'royalblue';
	// 	}, false );
	document.getElementById('RANGE_LIST').addEventListener('click',
		function(e) {
			var o = e.target;
			if ( o == document.getElementById('RANGE_LIST')) return;
			while ( o.parentNode != document.getElementById('RANGE_LIST') ){
				o = o.parentNode;
			}
			for ( var i=0; i<this.childNodes.length; i++ ){
				var c = this.childNodes[i];
				if ( c.hasAttribute('selected') ){
					c.removeAttribute( 'selected' );
					c.style.color			= '';
					c.style.backgroundColor = '';
				}
			}
			o.style.color			= 'white';
			o.style.backgroundColor = 'royalblue';
			o.setAttribute( 'selected', 'true' );
			var range_id = o.getAttribute('range_id' );
			makeCalendar( range_id );
			makeWhiteboardList( range_id );
			guidedance_whiteboard_form.day.value = '';

		}, false );
	document.getElementById('WHITEBOARD_LIST').addEventListener('click',
	function(e) {
		var o = e.target;
		if ( o == document.getElementById('WHITEBOARD_LIST')) return;
		while ( o.parentNode != document.getElementById('WHITEBOARD_LIST') ){
			o = o.parentNode;
		}
		for ( var i=0; i<this.childNodes.length; i++ ){
			var c = this.childNodes[i];
			if ( c.hasAttribute('selected') ){
				c.removeAttribute( 'selected' );
				c.style.color			= '';
				c.style.backgroundColor = '';
			}
		}

		o.style.color			= 'white';
		o.style.backgroundColor = 'royalblue';
		o.setAttribute( 'selected', 'true' );
		guidedance_whiteboard_form.day.value = o.firstChild.innerText;
		// createWhiteboard();
	}, false );

	document.getElementById('CALENDAR_LIST').addEventListener('gesturestart',
	function(e){
		e.stopPropagation();	// スクロールジェスチャ抑制
	} );
	document.getElementById('CALENDAR_LIST').addEventListener('gestureend',
	function(e){
		e.stopPropagation();	// スクロールジェスチャ抑制
	} );
	document.getElementById('CALENDAR_LIST').addEventListener('click',
	function(e) {
		var o = e.target;
		if ( o == this ) return;
		while ( o.parentNode != document.getElementById('CALENDAR_LIST') ){
			o = o.parentNode;
		}
		for ( var i=0; i<this.childNodes.length; i++ ){
			var c = this.childNodes[i];
			if ( c.hasAttribute('selected') ){
				c.removeAttribute( 'selected' );
				c.style.color			= '';
				c.style.backgroundColor = '';
			}
		}

		o.style.color			= 'white';
		o.style.backgroundColor = 'royalblue';
		o.setAttribute( 'selected', 'true' );

		var sotd = o.getAttribute('sotd');
		var eotd = o.getAttribute('eotd');
		var p = document.getElementById('CALENDAR_DETAIL');
		makeWhiteboardListScope( p, sotd, eotd );
		// p.innerHTML = 'sotd:' + o.getAttribute('sotd') + ' eotd:' + o.getAttribute('eotd');
	}, false );


}

function makeCalendar( range_id ){
	var p = document.getElementById('CALENDAR_LIST');
	p.innerHTML = '';
	
	var monthname = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL','AUG','SEP','OCT', 'NOV','DEC']
	var ym = new Date( range_id + '/4/1' );
	// r += 'range_id:' + range_id + '<br/>';
	for ( var i=0; i<12; i++ ){
		var sotd = new Date( ym.getFullYear() + '/' + ( ym.getMonth() + 1 ) + '/' + ym.getDate() );
		sotd.setMonth( ym.getMonth() + i );
		var eotd = new Date( sotd.getFullYear() + '/' + ( sotd.getMonth() + 1 ) + '/' + sotd.getDate() );
		eotd.setMonth( eotd.getMonth() + 1 );
		eotd.setDate( eotd.getDate() - 1 );
		var c = document.createElement('DIV');
		c.setAttribute( 'sotd', sotd.getFullYear() + '/' + ( sotd.getMonth() + 1 ) + '/' + sotd.getDate() );
		c.setAttribute( 'eotd', eotd.getFullYear() + '/' + ( eotd.getMonth() + 1 ) + '/' + eotd.getDate() );
		c.style.width		= '76px';
		c.style.height		= '76px';
		c.style.position	= 'absolute';
		c.style.top			= '0px';
		c.style.left		= ( 84 * i ) + 'px';
		c.style.padding		= '2px';
		c.style.border		= '1px solid lightgrey';
		var r = '';
			r += '<div style="padding:2px;">'  + sotd.getFullYear() + '</div>';
			r += '<div style="font-size:30px;width:100%;text-align:center;font-weight:bold;" >'  + ( sotd.getMonth() + 1 ) + '</div>';
			r += '<div style="width:100%;text-align:right;" >'  + monthname[ sotd.getMonth() ] + '</div>';
		c.innerHTML = r;
		p.appendChild( c );
	}

}

//
//	ホワイトボードリスト生成処理
//
function makeWhiteboardListScope( p, sotd, eotd )
{
	p.innerHTML = '';

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				// var o = document.getElementById( 'WHITEBOARD_LIST' );
				p.innerText = 'access...';
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					var weekname = [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI','SAT'];
					// var o = document.getElementById('WHITEBOARD_LIST');
					p.innerText = '';
					var day = new Date( sotd );
					m = day.getMonth();
					while ( true){
						var o = document.createElement('DIV');
						o.classList.add( 'day_' + day.getDate() );
						o.style.width	= '76px';
						o.style.height	= '76px';
						o.style.padding = '2px';
						o.style.border	= '1px solid lightgrey';
						var r = '';
						r += '<div style="padding:2px;">&nbsp;</div>';
						r += '<div style="font-size:30px;width:100%;text-align:center;font-weight:bold;" >'  + day.getDate() + '</div>';
						r += '<div style="width:100%;text-align:right;" >'  + weekname[ day.getDay() ] + '</div>';
						o.innerHTML = r;
						p.appendChild( o );
						day.setDate( day.getDate() + 1 );
						if ( m != day.getMonth() ) break;

					}

					for ( var i=0; i<result.length; i++ ){
						// var o = document.createElement('DIV');
						// o.style.width	= '76px';
						// o.style.height	= '76px';
						// o.style.padding = '2px';
						// o.style.border	= '1px solid lightgrey';

						var day = new Date( result[i].day );
						var dd = p.getElementsByClassName( 'day_' + day.getDate() );
						if ( dd.length != 0 ){
							dd[0].style.backgroundImage 	= 'url(./images/document.png)';
							dd[0].style.backgroundSize		= '18px';
							dd[0].style.backgroundRepeat	= 'no-repeat';
							dd[0].style.backgroundPosition	= 'top 2px left 2px';
						}
						// var c_children		= Result.c_children;
						// var c_resv_children	= Result.c_resv_children;
						// var ymd = day.getFullYear() + '/' + ( '00' + (day.getMonth() + 1 ) ).slice(-2) + '/' + ( '00' + day.getDate() ).slice(-2);
						// var r = '';
						// r += '<div style="padding:2px;">&nbsp;</div>';
						// r += '<div style="font-size:30px;width:100%;text-align:center;font-weight:bold;" >'  + day.getDate() + '</div>';
						// r += '<div style="width:100%;text-align:right;" >'  + weekname[ day.getDay() ] + '</div>';
						// o.innerHTML = r;
						// p.appendChild( o );
					}
					//o.innerHTML = r;
				} else{
					p.innerText = xmlhttp.status;
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/whiteboardlist2", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'sotd=' + sotd + '&eotd=' + eotd );
	} catch ( e ) {
		oLog.log( null, 'makeWhiteboardListScope : ' + e );
		oLog.open( 3 );
		// alert( e );
	}

}


//
//		チルドレン
//
function workplaceChildren(){
	workplace_id = 'CHILDREN';
	var icon	= document.getElementById('WORKPLACE_ICON');
	var hdr		= document.getElementById('WORKPLACE_HDR');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');
	var children= document.getElementById('WORKPLACE_CHILDREN');
	var wpcm	= document.getElementById('WORKPLACE_CHILDREN_MAIN');
	var list	= document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST');

	//	TAB
	var tab = document.getElementById('TAB_OPAQUESHAFT');
	var current = document.getElementById('TAB_CURRENT');
	tab.style.visibility = 'visible';
	current.style.visibility = 'visible';
	current.innerText = 'children';

	if ( icon.style.height == '0px'){
		icon.style.height		= icon.getAttribute('orgHeight');
		hdr.style.height		= hdr.getAttribute('orgHeight');
	} else {
		icon.setAttribute('orgHeight', icon.style.height );
		icon.style.height		= '0px';
		hdr.style.height		= '0px';
	}

	resizeWorkplace();
	// var h = document.getElementById('BOTTOM_FRAME').offsetHeight;
	// console.log( 'h:' + children.offsetHeight );
	// children.style.height = ( h - 0 ) + 'px';
	// wpcm.style.height = ( h - 252 ) + 'px';
	wb.style.height = '0px';

	document.getElementById('WP_KEYWORD').value = '';
	list.innerHTML = '';

}

function todayWhiteboard(){
	
	var today = new Date();
	var y = today.getFullYear();
	var m = ('00' + (today.getMonth() + 1 ) ).slice(-2);
	var d = ('00' + today.getDate() ).slice(-2);
	var ymd = y + '/' + m + '/' + d;
	guidedance_whiteboard_form.day.value = ymd;
	createWhiteboard();
}

function selectChildren( e ){
	e.stopPropagation();
	var c = e.target;
	while ( true ){
		if ( c == this ){
			for ( var i=0; i<this.childNodes.length; i++ ){
				var o = this.childNodes[i];
				if ( o.classList.contains('left100')){
					o.classList.remove( 'left100');
				}
				if ( o.classList.contains('height320')){
					o.classList.remove( 'height320');
				}
			}
			return;
		}
		if ( c.classList.contains('WP_PALLETE_CHILD')) break;
		c = c.parentNode;
	}
	c.classList.toggle( 'left100' );
	if ( ! c.classList.contains( 'left100' )){
		if ( c.classList.contains( 'height320') )
			c.classList.remove('height320');
		return;
	} 
	
	c.setAttribute( 'selected', 'yes' );
	var o = document.createElement('DIV');
	o.classList.add('opChild');
	o.classList.add('vh-center');
	o.style.position 	= 'absolute';
	o.style.top			= '2px';
	o.style.left		= ( c.offsetWidth + 1 ) + 'px';
	o.style.width		= '100px';
	o.style.height		= c.offsetHeight + 'px';
	var oo = c.appendChild( o );
	var r = '';
	r += '<button class="workplace_edit_button"  >edit</delete>';
	r += '<button class="workplace_delete_button"  >purge</delete>';
	oo.innerHTML = r;
	oo.getElementsByClassName('workplace_edit_button')[0].addEventListener(
		'click', wp_editChildren );
	oo.getElementsByClassName('workplace_delete_button')[0].addEventListener(
		'click', wp_purgeChildren );

	var nodes = this.childNodes;
	console.log('nodes:' + nodes.length );
	for ( var i=0; i<nodes.length; i++ ){
		var o = nodes[i];
		if ( c != o){
			if ( o.classList.contains('left100')){
				o.classList.remove( 'left100');
			}
			if ( o.classList.contains( 'height320') )
				o.classList.remove('height320');
		}
	}

}

function selectChildrenTransitionEnd( e ){
	var c = e.target;
	while ( true ){
		if ( c == this ) return;
		if ( c.classList.contains('WP_PALLETE_CHILD')) break;
		c = c.parentNode;
	}
	if ( !c.classList.contains( 'left100' )){
		c.removeAttribute('selected');
		c.removeChild( c.getElementsByClassName( 'opChild')[0] );
	}

}

function wp_editChildren(e){
	e.stopPropagation();
	var c = e.target;
	while ( true ){
		if ( c.classList.contains('WP_PALLETE_CHILD')) break;
		c = c.parentNode;
	}
	c.classList.toggle('height320');
	// alert( c.getAttribute('child_id'));

}

function wp_purgeChildren(e){
	e.stopPropagation();
	alert();
}

//
//
function wp_find(){
	var wph = document.getElementById('WORKPLACE_HDR');
	wph.style.height = '0px';
	wph.style.padding = '0px';
}


//
//	リサイズ処理
//
function resizeWorkplace(){
	var h = document.getElementById('BOTTOM_FRAME').offsetHeight;
	// var sysmenu = document.getElementById('WORKPLACE_SYSMENU');

	var workplace	= document.getElementById('WORKPLACE_WHITEBOARD');
	var wpwh		= document.getElementById('WORKPLACE_WHITEBOARD_HDR').offsetHeight;
	var wpwm		= document.getElementById('WORKPLACE_WHITEBOARD_MAIN');
	var wlist		= document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST');

	var children	= document.getElementById('WORKPLACE_CHILDREN');
	var wpch		= document.getElementById('WORKPLACE_CHILDREN_HDR').offsetHeight;
	var wpcm		= document.getElementById('WORKPLACE_CHILDREN_MAIN');
	var clist		= document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST');
	console.log( 'resizeWorkplace' );

	switch ( workplace_id ){
		case 'WHITEBOARD':
			workplace.style.height = ( h - 0 ) + 'px';
			wpwm.style.height = ( h - wpwh ) + 'px';
			break;
		case 'CHILDREN':
			children.style.height = ( h - 0 ) + 'px';
			wpcm.style.height = ( h - wpch ) + 'px';	// offset 252
			break;
	}

}

//
//	チャイルドファインダ
//
function finder(){
    var wph = document.getElementById('WORKPLACE_HDR');
	wph.style.height = '0px';
	wph.style.padding = '0px';

	var keyword = document.getElementById('WP_KEYWORD').value;
	finderHelper( keyword );
	document.body.focus();	// タブレットでのキーボードを消去する
}
function finderHelper( keyword ){
	console.log( 'keyword:' + keyword );
	var list = document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST');
	list.innerHTML = '';

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
					list.innerHTML = 'access...'
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						
						var result = JSON.parse( xmlhttp.responseText );
						
						list.innerHTML = '';
						
						for ( var i=0; i<result.length; i++ ){
                            // var duration = (Math.floor(Math.random() * 1000 / 100 ) + " " ).slice( 1,2 ) + 's';
							var child_id    = result[i].child_id;
							var child_name  = result[i].child_name;
							var kana        = result[i].kana;
							var remark		= result[i].remark;
							if ( remark == null ) remark = '';
							var child_type  = result[i].child_type;
							var child_grade = result[i].child_grade;
							var range_id	= result[i].range_id;
							var imagefile	= result[i].imagefile;
							if ( imagefile == null ) imagefile = '';
							var c = document.createElement('DIV');
							c.setAttribute("child_id",    child_id );
							c.setAttribute("id",          "c_1");
							c.classList.add( "WP_PALLETE_CHILD" );
							c.classList.add( "offProfeel" );
							c.setAttribute('kana',        kana );
							c.setAttribute('child_type',  child_type );
							c.setAttribute('child_grade', child_grade );
                            // c.style.animationDuration   = duration;
							// c.style.float           = 'left';
							var cc = list.appendChild( c );
							var cc_width = cc.offsetWidth;


							r = '';
							r += '<div profeel="yes" class="child_header" style="" >';
								r += child_name + '&nbsp;&nbsp;' + child_grade + child_type;
								r += '<span style="color:' + arChildGradeColor[ child_grade ] + ';">●</span>';
							r += '</div>';
							r += '<div profeel="yes" style="float:left;width:' + cc_width + 'px;height:80px;overflow:hidden;" >';
								if ( imagefile != ''){
									r += '<div style="float:left;width:60px;height:60px;color:dimgrey;font-size:8px;margin:4px;padding:4px;overflow:hidden;border-radius:45%;background-image:url(./images/children/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
										r += '&nbsp;';
									r += '</div>';
								} else{
									r += '<div style="float:left;width:60px;height:60px;color:black;font-size:8px;opacity:0.3;margin:4px;padding:4px;overflow:hidden;border-radius:45%;background-image:url(./images/user-2.png);background-size:30px;background-position:center center;background-repeat:no-repeat;" >';
										r += '&nbsp';
									r += '</div>';
								}
								r += '<div style="float:right;width:100px;height:80px;" >';
									r += '<div style="padding:1px;" >' + kana + '</div>';
									r += '<div style="padding:1px;" >id/Range:' + child_id + '/' + range_id + '</div>';
								r += '</div>';
							r += '</div>';
							cc.innerHTML = r;
							
						}
					} else{
						console.log( null, 'finder:' + xmlhttp.status );
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/childfind", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		if ( keyword == '*' ) keyword = '%';
		xmlhttp.send( 'keyword=' + keyword );


}
