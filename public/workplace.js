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

//
//	ワークプレイスホワイトボード画面生成
//
function addWorkplaceWhiteboard(){
	var p = document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST');

	var r = '';
	r += '<div style="padding-top:5px;" >';
		r += '<button id="BTN_OPENWHITEBOARD" class="next_button"  ';
			r += ' onclick="createWhiteboard()" >';
			r += 'next';
		r += '</button>';
	r += '</div>';
	// r += '</div>';
	// r += '<div id="CALENDAR_LIST"   style="float:left;width:84px;" ></div>';
	// r += '<div id="CALENDAR_DETAIL" style="float:left;width:140px;" ></div>';
	r += '<div id="CALENDAR_LIST"   style="float:;position:relative;width:calc(100% - 4px);height: 58px;background-color:#EDEDED;border-radius:3px;padding:2px;overflow:scroll;" ></div>';
	r += '<div style="font-size:12px;font-weight:bold;color:gray;" >DETAIL:</div>';
	r += '<div id="CALENDAR_DETAIL" style="float:;position:relative;width:calc(100% - 4px);height:calc(100% - 120px);background-color:#EDEDED;border-radius:3px;padding:2px;overflow:scroll;" ></div>';


	p.innerHTML = r;

	//	レンジリスト作成
	makeRangeList();

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
			// makeWhiteboardList( range_id );
			guidedance_whiteboard_form.day.value = '';

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

	document.getElementById('CALENDAR_DETAIL').addEventListener('click',
	function(e) {

		var o = e.target;
		while ( true ){
			if ( o == this ){
				for ( var i=0; i<this.childNodes.length; i++ ){
					 var o = this.childNodes[i];
					 if ( o.hasAttribute('selected')){
						o.removeAttribute('selected');
						o.classList.remove('right56');
					}
				}
				return;
			}
			o = o.parentNode;
			if ( o.hasAttribute('day')) break;
		}
	
		for ( var i=0; i<this.childNodes.length; i++ ){
			var c = this.childNodes[i];
			if ( o != c && c.hasAttribute('selected') ){
				c.removeAttribute( 'selected' );
				c.classList.remove('right56');
			}
		}

		if ( !o.hasAttribute( 'selected' ) ) o.setAttribute( 'selected', 'true' );
			else o.removeAttribute( 'selected' );
		o.style.animationName			= 'scale-in-out';
    	o.style.animationDuration		= '0.3s';
    	o.style.animationIterationCount = 1;



		var day = o.getAttribute('day');
		guidedance_whiteboard_form.day.value = day;
		// var p = document.getElementById('CALENDAR_DETAIL');
	}, false );
	document.getElementById('CALENDAR_DETAIL').addEventListener('animationend',
	function (e){
		switch ( e.target.style.animationName ){
			case 'scale-in-out':
				e.target.style.animationName = 'shift-frame';
				e.target.style.animationDuration		= '0.3s';
				e.target.style.animationIterationCount = 1;
					break;
			case 'shift-frame':
				e.target.style.animationName = '';
				e.target.style.animationDuration		= '0.6';
				e.target.style.animationIterationCount = 1;
				if ( e.target.hasAttribute('selected')){
					e.target.classList.add('right56');
					var o = document.createElement('DIV');
					o.classList.add( 'edit' );
					o.style.position		= 'absolute';
					o.style.top				= '0px';
					o.style.left			= '-55px';
					o.style.width 			= '48px';
					o.style.height 			= '48px';
					o.style.backgroundColor = ':white';
					o.style.padding 		= '2px';
					o.style.border 			= '1px solid lightgrey';
					o.style.borderRadius	= '3px';
					var r = '';
					r += '<button class="workplace_edit_button" onclick="createWhiteboard()" >edit</button>';
					o.innerHTML				= r;
					e.target.appendChild( o );
				} else {
					e.target.classList.remove('right56');
					var ar = e.target.getElementsByClassName('edit');
					if ( ar.length > 0 )
					e.target.removeChild( ar[0] );
				}
				// e.target.classList.toggle( 'right56' );
				// if ( e.target.classList.contains('right56')){
				// 	var o = document.createElement('DIV');
				// 	o.classList.add( 'edit' );
				// 	o.style.position		= 'absolute';
				// 	o.style.top				= '0px';
				// 	o.style.left			= '-55px';
				// 	o.style.width 			= '48px';
				// 	o.style.height 			= '48px';
				// 	o.style.backgroundColor = ':white';
				// 	o.style.padding 		= '2px';
				// 	o.style.border 			= '1px solid lightgrey';
				// 	o.style.borderRadius	= '3px';
				// 	var r = '';
				// 	r += '<button class="workplace_edit_button" onclick="createWhiteboard()" >edit</button>';
				// 	o.innerHTML				= r;
				// 	e.target.appendChild( o );

				// } else {
				// 	var ar = e.target.getElementsByClassName('edit');
				// 	if ( ar.length > 0 )
				// 	e.target.removeChild( ar[0] );
				// }
				break;
		}
	}, false );
	document.getElementById('CALENDAR_DETAIL').addEventListener('transitionend',
	function (e){
		var c = e.target;
		while ( true ){
			if ( c == this ) return;
			if ( c.hasAttribute( 'day' ) ) break;
			c = c.parentNode;
		}
		if ( c.classList.contains( 'right56' )){
			// c.removeAttribute('selected');
			// c.removeChild( c.getElementsByClassName( 'opChild')[0] );
		}
	
	}, false );


}

function makeCalendar( range_id ){
	var p = document.getElementById('CALENDAR_LIST');
	p.innerHTML = '';
	document.getElementById('CALENDAR_DETAIL').innerHTML = '';
	
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
		c.style.width			= '48px';
		c.style.height			= '48px';
		c.style.backgroundColor	= 'white';
		c.style.position		= 'absolute';
		c.style.top				= '0px';
		c.style.left			= ( 55 * i ) + 'px';
		c.style.padding			= '2px';
		c.style.border			= '1px solid lightgrey';
		c.style.borderRadius	= '4px';
		c.style.margin			= '4px';
		var r = '';
			// r += '<div style="padding:1px;">&nbsp;</div>';
			r += '<div style="font-size:16px;width:100%;text-align:center;font-weight:bold;" >'  + ( sotd.getMonth() + 1 ) + '</div>';
			r += '<div style="font-size:10px;width:100%;text-align:center;" >'  + monthname[ sotd.getMonth() ] + '</div>';
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
						o.setAttribute( 'day', day.getFullYear() + '/' + ( day.getMonth() + 1 ) + '/' + day.getDate() );
						o.style.position		= 'relative';
						o.style.width			= '100%';
						o.style.height			= '54px';
						o.style.marginTop 		= '1px';
						o.style.marginBottom	= '1px';
						o.style.transition		= 'all 0.5s ease-in-out';
						var r = '';
						r += '<div style="float:left;width:48px;height:48px;background-color:white;padding:2px;border:1px solid lightgrey;border-radius:3px;" >';
							// r += '<div style="padding:2px;">&nbsp;</div>';
							r += '<div style="font-size:16px;width:100%;text-align:center;font-weight:bold;" >'  + day.getDate() + '</div>';
							r += '<div style="font-size:10px;width:100%;text-align:center;" >'  + weekname[ day.getDay() ] + '</div>';
						r += '</div>';
						r += '<div class="detail" style="float:left;font-size:12px;width:calc(100% - 64px);height:48px;background-color:white;padding:2px;border:1px solid lightgrey;border-radius:3px;margin-left:2px;" >';
							r += '';
						r += '</div>';
						o.innerHTML = r;
						p.appendChild( o );
						day.setDate( day.getDate() + 1 );
						if ( m != day.getMonth() ) break;

					}

					for ( var i=0; i<result.length; i++ ){

						var day = new Date( result[i].day );
						var dd = p.getElementsByClassName( 'day_' + day.getDate() );
						if ( dd.length != 0 ){
							dd[0].style.backgroundImage 	= 'url(./images/document.png)';
							dd[0].style.backgroundSize		= '18px';
							dd[0].style.backgroundRepeat	= 'no-repeat';
							dd[0].style.backgroundPosition	= 'top 2px left 2px';
							var c_children		= result[i].c_children;
							var c_checkout		= result[i].c_checkout;
							var detail = dd[0].getElementsByClassName( 'detail' )[0];
							detail.innerHTML = 'Children:' + c_children + ' checkouts:' + c_checkout;
						}
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
	r += '<button class="workplace_edit_button"  >edit</button>';
	r += '<button class="workplace_delete_button"  >purge</button>';
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
