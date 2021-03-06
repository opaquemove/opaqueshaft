var workplace_id 	= null;
var cur_range_id 	= null;
var cur_month		= null;
var cur_sotd		= null;
var cur_eotd		= null;

function initWorkplace(){
	console.log('initWorkplace');

	if ( ! checkSign() ) workplace_id = 'AUTHENTICATION';

	//	カレントのレンジを設定
	var today = new Date();
	cur_range_id = today.getFullYear();
	if ( today.getMonth() >= 0 && today.getMonth() <= 2 )
		cur_range_id--;
	cur_month	= today.getMonth() + 1;


	// init WORKPLACE_HEADER
	initWorkplaceHeader();

	// init WORKPLACE_ADMIN_TOOLS
	initWorkplaceAdminTools();



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
		
    document.getElementById('WP_QUERY_ID').addEventListener(
		'keyup',
		function( e ){
			if ( e.key == 'Enter' )
            query( this );
			document.body.dispatchEvent( new Event('click'));
		}
	);


	document.getElementById('WORKPLACE_HDR').addEventListener(
		'click', function(e){
			switch( e.target.id ){
				case 'WORKPLACE_HDR':
				case 'WORKPLACE_SUMMARY':
					var signin = document.getElementById('WP_SIGNIN');
					var signout= document.getElementById('WP_SIGNOUT');
					if (signin.classList.contains('signinMotion'))
						signin.classList.remove('signinMotion');
					if (signout.classList.contains('signoutMotion'))
						signout.classList.remove('signoutMotion');
					break;
			}
		}, false );
	

	document.getElementById('WP_SIGNIN').addEventListener(
		'click', signinMotion );
	document.getElementById('WP_SIGNIN').addEventListener(
		'transitionstart', openingSigninMotion );
	document.getElementById('WP_SIGNIN').addEventListener(
		'transitionend', closingSigninMotion );

	document.getElementById('WP_SIGNOUT').addEventListener(
		'click', signoutMotion );
	document.getElementById('WP_SIGNOUT').addEventListener(
		'transitionstart', openingSignoutMotion );
	document.getElementById('WP_SIGNOUT').addEventListener(
		'transitionend', closingSignoutMotion );
	// document.getElementById('WAT_SIGNOUT').addEventListener(
	// 	'click', signoutMotion );
	// document.getElementById('WAT_SIGNOUT').addEventListener(
	// 	'transitionstart', openingSignoutMotion );
	// document.getElementById('WAT_SIGNOUT').addEventListener(
	// 	'transitionend', closingSignoutMotion );
	

	// document.getElementById('WP_TEST').addEventListener(
	// 	'click', rotateMenu );
	// document.getElementById('WP_TEST').addEventListener(
	// 	'transitionstart', openingRotation );
	// document.getElementById('WP_TEST').addEventListener(
	// 	'transitionend', closingRotation );
	document.getElementById('WAT_SIGNOUT').addEventListener(
		'click', rotateSignoutMenu );
	document.getElementById('WAT_SIGNOUT').addEventListener(
		'transitionstart', openingSignoutRotation );
	document.getElementById('WAT_SIGNOUT').addEventListener(
		'transitionend', closingSignoutRotation );

	
	document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST').addEventListener(
		'click', selectChildren );
	document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST').addEventListener(
		'animationend', selectChildrenMotionEnd );

	document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST').addEventListener(
		'click', selectAccount );
	document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST').addEventListener(
		'animationstart', selectAccountMotionStart );
	document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST').addEventListener(
		'animationend', selectAccountMotionEnd );
				
	document.getElementById('WORKPLACE_RANGE_MAIN_LIST').addEventListener(
		'click', selectRange );
	document.getElementById('WORKPLACE_RANGE_MAIN_LIST').addEventListener(
		'transitionend', selectRangeTransitionEnd );

	document.getElementById('WORKPLACE_IMAGEFILE_MAIN_LIST').addEventListener(
		'click', selectImagefile );
	document.getElementById('WORKPLACE_IMAGEFILE_MAIN_LIST').addEventListener(
		'animationstart', selectImagefileMotionStart );
	document.getElementById('WORKPLACE_IMAGEFILE_MAIN_LIST').addEventListener(
		'animationend', selectImagefileMotionEnd );
	
		
	// document.getElementById('WORKPLACE_IMAGEFILE_MAIN_LIST').addEventListener(
	// 	'click', selectImagefile );
	// document.getElementById('WORKPLACE_IMAGEFILE_MAIN_LIST').addEventListener(
	// 	'animationstart', selectImagefileMotionStart );
	// document.getElementById('WORKPLACE_IMAGEFILE_MAIN_LIST').addEventListener(
	// 	'animationend', selectImagefileMotionEnd );
	
	// レンジデータ生成
	// makeRangeList( 'TAB_CURRENT2', 'V' );
	// document.getElementById( 'TAB_CURRENT2' ).addEventListener(
	// 	'click', selectCurrentRangeId, false );

	initRangeSelector();

	document.getElementById('MONTH12').addEventListener(
		'click', selectCalendarMonth, false );

	document.getElementById('WORKPLACE_WHITEBOARD_HDR_CALENDAR').addEventListener(
		'click', selectCalendar, false );
	document.getElementById('WORKPLACE_WHITEBOARD_HDR_CALENDAR').addEventListener(
		'animationend', selectCalendarMotionEnd, false );
	
		
	document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST').addEventListener(
		'click', selectWhiteboard, false );
	document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST').addEventListener(
		'animationend', selectWhiteboardMotionEnd, false );
		
	showWorkPlace();

	// Rollup
	childrenRollup( document.getElementById('WP_ROLLUP') );
	whiteboardRollup( document.getElementById('WP_ROLLUP2') );

	//
	//file upload test
	//
	initFileUpload();
	//sign icon
	hoge();

	// resizeWorkplace();


}

function initRangeSelector(){

	document.getElementById('WPH_RANGE_ID').innerText = cur_range_id;
	document.getElementById('WPH_RANGE').addEventListener(
		'click', setRangeID, false );
	document.getElementById('WPH_RANGE').addEventListener(
		'mouseleave',
		function ( e ){
			var rs = this.getElementsByClassName('rangeSelector');
			if ( rs.length > 0 ){
				rs[0].parentNode.removeChild( rs[0] );
				return;
			}
		
		}
	)

}

function setRangeID( e ){
	e.stopPropagation();

	var o = e.target;

	var rs = this.getElementsByClassName('rangeSelector');
	if ( rs.length > 0 ){
		if ( o.hasAttribute('range_id')){
			console.log( 'range_id:' + o.getAttribute('range_id'));
			cur_range_id = o.getAttribute('range_id');
			document.getElementById('WPH_RANGE_ID').innerText = cur_range_id;
			rs[0].parentNode.removeChild( rs[0] );
			return;
		}

	}

	var f = document.createElement('DIV');
	f.classList.add( 'rangeSelector');
	f.style.position		= 'absolute';
	f.style.top				= this.offsetHeight + 'px';
	f.style.left			= '-2px';
	f.style.width			= this.offsetWidth + 'px';
	f.style.height			= 'auto';
	f.style.color			= 'dimgray';
	f.style.backgroundColor	= 'white';
	f.style.fontSize		= '11px';
	f.style.border			= '1px solid dimgray';
	f.style.textAlign		= 'center';	
	var p = this.appendChild( f );
	setRangeIDHelper( p );



}
function setRangeIDHelper( p ){
	p.innerHTML = '';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.addEventListener('readystatechange', 
		function (e){
			switch ( xmlhttp.readyState){
				case 1://opened
					break;
				case 2://header received
					break;
				case 3://loading
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						
						var results = JSON.parse( xmlhttp.responseText );
						for ( var i=0; i<results.length; i++ ){
							var o = document.createElement('DIV');
							o.classList.add( 'range_id' );
							o.setAttribute('range_id', results[i].range_id );
							o.style.padding			= '6px 0px';
							o.style.margin			= '2px 0px';
							if ( cur_range_id == results[i].range_id )
								o.classList.add('checked_lc');
							o.innerText = results[i].range_id;
							p.appendChild( o );
						}

					} else{
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/rangelist", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send(  );

}

function query( obj ){
	var keyword = obj.value;
	console.log( 'query keyword:' + keyword );

	switch ( workplace_id ){
		case 'CHILDREN':
			finder();
			break;
		case 'ACCOUNT':
			workplaceAccountHelper();
			break;
		case 'IMAGEFILE':
			workplaceImagefileHelper();
			break;
	}
	document.body.focus();
}


function initFileUpload(){

	// document.getElementById('imagefile').addEventListener(
	// 	'change', fileUpload, false );
}

//
//	reference: https://javascript.keicode.com/newjs/upload-files-with-xmlhttprequest.php
//
function fileUpload(e){
	var file_in = e.target;
	var ff = document.getElementById('fileForm');
	var fd = new FormData( ff );

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.upload.addEventListener('loadstart', (evt) => {
		console.log('loadstart');
	} );
	xmlhttp.upload.addEventListener('progress', (evt) => {
		console.log('progress');
		let percent = ( evt.loaded / evt.total * 100 ).toFixed(1);
		console.log(`load progress ${percent}%`)
	} );
	xmlhttp.upload.addEventListener('abort', (evt) => {
		console.log('abort');
	} );
	xmlhttp.upload.addEventListener('error', (evt) => {
		console.log('error');
	} );
	xmlhttp.upload.addEventListener('load', (evt) => {
		console.log('load');
	} );
	xmlhttp.upload.addEventListener('timeout', (evt) => {
		console.log('timeout');
	} );
	xmlhttp.upload.addEventListener('loadend', (evt) => {
		console.log('loadend');
	} );


	xmlhttp.open("POST", "/accounts/file_upload", true );
	xmlhttp.send( fd );


}

function initWorkplaceHeader(){

	document.getElementById('WORKPLACE_HEADER').addEventListener(
		'click', selectWorkplaceHeader, false );
	if ( checkSign()){
		selectWorkplaceHeaderHepler('admin');
	} else{

	}

}

function initWorkplaceAdminTools(){
	var wat = document.getElementById('WORKPLACE_ADMIN_TOOLS');
	wat.addEventListener( 'click', selectWorkplaceAdminTools, false );
}

function resetWorkplaceAdminTools(){
	selectWorkplaceAdminToolsHelper( null );
}

function selectWorkplaceAdminTools( e ){
	console.log('selectWorkplaceAdminTools');
	var o = e.target;
	while ( true ){
		if ( o == this ) return;
		if ( o.tagName == 'BODY') return;
		if ( o.hasAttribute('cmd')) break;
		o = o.parentNode;
	}

	selectWorkplaceAdminToolsHelper( o.getAttribute('cmd'));

}

function selectWorkplaceAdminToolsHelper( cmd ){
	var toolbar = {
		sign: 		document.getElementById('WAT_SIGN'),
		children:	document.getElementById('WAT_CHILDREN'),
		ranges:		document.getElementById('WAT_RANGES'),
		accounts:	document.getElementById('WAT_ACCOUNTS'),
		icons:		document.getElementById('WAT_ICONS'),
		signout:	document.getElementById('WAT_SIGNOUT')
	}

	// if ( o.hasAttribute( 'selected' ) ){
	// 	o.removeAttribute( 'selected' );
	// 	o.classList.remove( 'selectedmenu' );
	// } else {
	// 	o.setAttribute( 'selected', 'yes' );
	// 	o.classList.add( 'selectedmenu');
	// }

	Object.keys(toolbar).forEach( function(key){
		if ( toolbar[key].classList.contains('selectedmenu')){
			toolbar[key].classList.remove('selectedmenu');
		}
		toolbar[key].classList.add('deselectedmenu');
	});

	// if ( ! o.hasAttribute('selected')){
	// 	return;
	// } 

	switch ( cmd ){
		case 'sign':
			toolbar.sign.classList.add('selectedmenu');
			break;
		case 'children':
			toolbar.children.classList.add('selectedmenu');
			workplaceChildren();
			break;
		case 'ranges':
			toolbar.ranges.classList.add('selectedmenu');
			workplaceRange();
			break;
			case 'accounts':
			toolbar.accounts.classList.add('selectedmenu');
			workplaceAccount();
			break;
		case 'icons':
			toolbar.icons.classList.add('selectedmenu');
			workplaceImagefile();
			break;
		case 'signout':
			toolbar.signout.classList.add('selectedmenu');
			break;
	}

}

function selectWorkplaceHeader( e ){

	var o = e.target;
	while ( true ){
		if ( o.tagName == 'BODY') return;
		if ( o == this ) return;
		if ( o.hasAttribute('cmd')) break;
		o = o.parentNode;
	}

	selectWorkplaceHeaderHepler( o.getAttribute('cmd'));
}

function selectWorkplaceHeaderHepler( cmd ){
	var toolbar = {
		admin: 		document.getElementById('WPH_OPAQUESHAFT_ADMIN'),
		day:		document.getElementById('WPH_DAY')
		// sign:		document.getElementById('WPH_SIGNSTATUS')
		// children:	document.getElementById('WPH_CHILDREN'),
		// range:		document.getElementById('WPH_RANGE'),
		// account:	document.getElementById('WPH_ACCOUNT')
	}

	switch ( cmd ){
		case 'admin':
			Object.keys(toolbar).forEach( function(key){
				if ( toolbar[key].classList.contains('selectedmenu')){
					toolbar[key].classList.remove('selectedmenu');
				}
				toolbar[key].classList.add('deselectedmenu');
			});
			toolbar.admin.classList.add('selectedmenu');
			resetWorkplaceAdminTools();
			workplaceReset();
			break;
		case 'day':
			Object.keys(toolbar).forEach( function(key){
				if ( toolbar[key].classList.contains('selectedmenu'))
				toolbar[key].classList.remove('selectedmenu');
			});
			toolbar.day.classList.add('selectedmenu');
			workplaceWhiteboard();
			break;
	}

}

function hoge(){
	if ( !checkSign()) return;

	getAccountAction( isSignId(), 
		function(){
			switch( this.readyState ){
				case 1:
				case 2:
				case 3:
					break;
				case 4:
					if ( this.status == 200 ){
						var result = JSON.parse( this.responseText );
						var menu = document.getElementById('WPH_SIGN');
						var menu_info = document.getElementById('WPH_SIGN_INFO');
						var account_name	= result.acc_name;
						var imagefile 		= result.imagefile;

						menu_info.innerHTML = 'sign in:<br/>' + account_name;

						var o = document.createElement('DIV');
						o.classList.add('vh-center');
						o.style.position	= 'absolute';
						o.style.top			= '0px';
						o.style.left		= '0px';
						o.style.width		= '22px';
						o.style.height		= '22px';
						o.style.padding		= '18px 6px 1px 18px';
						var r = '';
						if ( imagefile != '' && imagefile != null )
							r += '<div style="width:100%;height:100%;border-radius:50%;background-image:url(./images/accounts/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" ></div>';
							else
							r += '<div style="width:100%;height:100%;border-radius:50%;background-image:url(./images/user-2.png);background-size:cover;background-position:center center;background-repeat:no-repeat;" ></div>';
						o.innerHTML = r;
						menu.innerHTML	= '';
						menu.appendChild( o );
					
					}
					break;
			}
		}
	);
}


function calendarGadget( parent_id, serial ){

	console.log('calendar id:' + parent_id );
	console.log('serial:' + serial );
	var calen = document.getElementById( parent_id );
	calen.innerHTML = '';

	var w = Math.floor( calen.offsetWidth / 7.2 );
	w	= Math.floor( w / calen.offsetWidth  * 100 );
	// var w_px = Math.floor( calen.offsetWidth * w );
	var h = Math.floor( calen.offsetWidth / 7.2 * 0.2 );

	console.log( 'calendarGadget w:' + w );
	console.log( 'calendarGadget h:' + h );

	var sotm = new Date();
	if ( serial != null ) {
			sotm.setTime( serial ); 
		}
	var sotd  = new Date( sotm.getFullYear() + '/' + ( sotm.getMonth() + 1 ) + '/1' );
	var current_month = sotd.getMonth();

	var prev = new Date( sotm.getFullYear() + '/' + ( sotm.getMonth() + 1) + '/1' );
	prev.setMonth( prev.getMonth() - 1 ); 
	var prev_ym = prev.getTime();
	var next = new Date( sotm.getFullYear() + '/' + ( sotm.getMonth() + 1) + '/1' );
	next.setMonth( next.getMonth() + 1 ); 
	var next_ym = next.getTime();

	var month = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
	var week  = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];	
	// var o = document.createElement('DIV');
	// o.style.width			= 'calc(100% - 0px)';
	// o.style.height			= '36px';
	// o.style.color			= 'dimgray';
	// o.style.backgroundColor	= 'white';
	// o.style.padding			= '6px 0px';
	// var r = '';
	// r += '<div style="float:left;padding-left:4px;" >' + month[ sotd.getMonth() ] + '.' + sotd.getFullYear() + '</div>';
	// r += '<div class="calen_next" style="float:right;padding:0px 4px;"  >&gt;</div>';
	// r += '<div class="calen_prev" style="float:right;padding:0px 4px;"  >&lt;</div>';
	// o.innerHTML			= r;
	// var calen2 = calen.appendChild( o );
	// calen2.getElementsByClassName('calen_prev')[0].addEventListener(
	// 	'click', function(){ calendarGadget( parent_id, prev_ym )}
	// );
	// calen2.getElementsByClassName('calen_next')[0].addEventListener(
	// 	'click', function(){ calendarGadget( parent_id, next_ym )}
	// );

	o = document.createElement('DIV');
	o.style.width			= '100%';
	o.style.height			= '24px';
	// o.style.clear			= 'both';
	o.style.color			= 'dimgray';
	o.style.backgroundColor	= 'white';
	o.style.fontSize		= '8px';
	o.style.fontWeight		= 'bold';
	o.style.display			= 'flex';
	o.style.justifyContent	= 'space-between';
	// o.style.border	= '1px solid lightgrey';
	r = '';
	for ( var i=0; i<week.length; i++ ){
		r += '<div class="calendar_day_border" style="text-align:center;width:' + w + '%;height:18px;background-color:white;padding-top:4px;margin:1px;" >' + week[i] + '</div>';
	}
	o.innerHTML		= r;
	// Week Header
	calen.appendChild( o );
	
	console.log( 'week num:' + sotd.getDay() );
	sotd.setDate  ( sotd.getDate() - sotd.getDay() );
	console.log( 'sotm:' + sotm.getFullYear() + '/' + ( sotm.getMonth() + 1 ) + '/' +  sotm.getDate());
	console.log( 'sotd:' + sotd.getFullYear() + '/' + ( sotd.getMonth() + 1 ) + '/' +  sotd.getDate());

	o = document.createElement('DIV');
	o.classList.add( 'calendar_frame');
	o.style.width			= '100%';
	o.style.height			= 'auto';
	var calen2 = calen.appendChild( o );

	// day list
	var oLine = null;
	while( true ){
		if ( oLine == null || sotd.getDay() == 0 ){
			var weekline = document.createElement('DIV');
			weekline.classList.add('weekline');
			weekline.style.width			= '100%';
			weekline.style.height			= 'auto';
			weekline.style.display			= 'flex';
			weekline.style.justifyContent	= 'space-between';
			oLine = calen2.appendChild( weekline );

		}
		var o = document.createElement('DIV');
		o.setAttribute( 'day', sotd.getFullYear() + '/' + ( sotd.getMonth() + 1 ) + '/' + sotd.getDate() );
		o.classList.add('unselected');
		o.classList.add('calendar_day_border');
		o.classList.add('day');
		o.style.width			= w + '%';
		o.style.height			= (h - 20) + 'px';
		o.style.padding			= '18px 0px';
		o.style.margin			= '1px';
		o.style.fontSize		= '12px';	//'120%';
		o.style.textAlign		= 'center';
		o.style.color			= ( sotd.getMonth() == current_month )? 'gray':'#DDDDDD';
		// o.style.backgroundColor	= 'white';
		if ( sotd.getMonth() == sotm.getMonth() )
			o.classList.add( 'calendar_day_'+ sotd.getDate() );

		o.innerHTML = ('00' + sotd.getDate() ).slice(-2);
		// calen2.appendChild( o );
		oLine.appendChild( o );
		sotd.setDate( sotd.getDate() + 1 );
		if ( sotd.getFullYear() + ('00' + sotd.getMonth() ).slice(-2) 
			 > sotm.getFullYear() + ('00' + sotm.getMonth() ).slice(-2) && sotd.getDay() == 0 )break;
		// if ( sotd.getDay() == 0){
		// 	var weekline = document.createElement('DIV');
		// 	weekline.style.width			= '100%';
		// 	weekline.style.height			= 'auto';
		// 	weekline.style.display			= 'flex';
		// 	weekline.style.justifyContent	= 'space-between';
		// 	oLine = calen2.appendChild( weekline );
		// }
	}

	// handle
	o = document.createElement('DIV');
	o.classList.add( 'calendar_handle');
	o.classList.add('vh-center');
	o.style.position		= 'absolute';
	o.style.top				= '0px';
	o.style.left			= '0px';
	o.style.width			= '18px';
	o.style.height			= '100%';
	var r = '';
	r += '<div class="calendar_handle_left" ></div>';
	o.innerHTML = r;
	calen.appendChild( o ).getElementsByClassName('calendar_handle_left')[0].addEventListener(
		'click', function(e){
			 e.preventDefault();
			var lists = document.getElementById('MONTH12').childNodes;
			var m = null;
			for ( var i=0; i<lists.length; i++ ){
				if ( lists[i].hasAttribute('selected') ){
					m = lists[i];
					break;
				}
			}
			m = m.previousSibling;
			if ( m != null )
				setCalendarMonth12( m.getAttribute('month') );
		}
	);

	o = document.createElement('DIV');
	o.classList.add( 'calendar_handle');
	o.classList.add('vh-center');
	o.style.position		= 'absolute';
	o.style.top				= '0px';
	o.style.left			= 'calc(100% - 18px)';
	o.style.width			= '18px';
	o.style.height			= '100%';
	var r = '';
	r += '<div class="calendar_handle_right" ></div>';
	o.innerHTML = r;
	calen.appendChild( o ).getElementsByClassName('calendar_handle_right')[0].addEventListener(
		'click', function(e){
			e.preventDefault();
			var lists = document.getElementById('MONTH12').childNodes;
			var m = null;
			for ( var i=0; i<lists.length; i++ ){
				if ( lists[i].hasAttribute('selected') ){
					m = lists[i];
					break;
				}
			}
			m = m.nextSibling;
			if ( m != null )
				setCalendarMonth12( m.getAttribute('month') );
		}
	);

}

//
//		ワークプレイス（統合メニュー）を表示.その後でresizeWorkPlaceを起動
//
function showWorkPlace(){

	closeModalDialog();


	//	OPAQUESHAFT_TITLE表示制御(WHITEBOARD DESIGN切り替えボタン)
	var opaqueshaft_title = document.getElementById('OPAQUESHAFT_TITLE');
	opaqueshaft_title.style.visibility = ( openWhiteboardFlg )? 'visible' : 'hidden';

	var bo		= document.getElementById('BOTTOM_OVERLAY');
	bo.style.visibility		= 'visible';

	var wph				= document.getElementById('WORKPLACE_HEADER');
	var wpat			= document.getElementById('WORKPLACE_ADMIN_TOOLS');
	var wp_signin		= document.getElementById('WP_SIGNIN');
	var wp_signout		= document.getElementById('WP_SIGNOUT');
	var wp_rollup		= document.getElementById('WP_ROLLUP');
	var wp_rollup2		= document.getElementById('WP_ROLLUP2');

	if ( wp_signin.classList.contains('signinMotion'))
		wp_signin.classList.remove('signinMotion');
	if ( wp_signout.classList.contains('signoutMotion'))
		wp_signout.classList.remove('signoutMotion');

	var bo = document.getElementById('BOTTOM_OVERLAY');
	var bf = document.getElementById('BOTTOM_FRAME');

	if ( checkSign() ){
		// signed
		wph.style.visibility			= 'visible';
		if ( workplace_id == null || workplace_id == 'DASHBOARD')
			wpat.style.visibility			= 'visible';
		bf.style.width					= '100%';
		bf.style.overflow				= 'auto';
		wp_signin.setAttribute( 'disabled', 'true' );
		wp_signout.removeAttribute( 'disabled' );
		// wp_test.style.display			= 'inline';
		// wp_empty.style.display			= 'inline';
		// wp_content.style.display		= 'inline';
		wp_signin.style.visibility		= 'hidden';
		wp_signout.style.visibility		= 'visible';
		wp_rollup.style.visibility		= 'visible';
		wp_rollup2.style.visibility		= 'visible';

		var opt = wp_signin.getElementsByClassName('option');
		if ( opt.length > 0 ){
			opt[0].parentNode.removeChild( opt[0] );
		}

		// selectWorkplaceHeaderHepler('admin');
		hoge();

	} else {
		// not sign
		wph.style.visibility			= 'hidden';
		wpat.style.visibility			= 'hidden';
		bf.style.width					= '100%';
		bf.style.overflow				= 'hidden';
		wp_signin.removeAttribute( 'disabled' );
		wp_signout.setAttribute( 'disabled', 'true' );
		// wp_test.style.display			= 'none';
		// wp_empty.style.display			= 'none';
		// wp_content.style.display		= 'none';
		wp_signin.style.visibility		= 'visible';
		wp_signout.style.visibility		= 'hidden';
		wp_rollup.style.visibility		= 'hidden';
		wp_rollup2.style.visibility		= 'hidden';
	}

	resizeWorkplace();

}

//
//	リサイズ処理
//
function resizeWorkplace(){
	var w = document.getElementById('BOTTOM_OVERLAY').offsetWidth;
	var h = document.getElementById('BOTTOM_FRAME').offsetHeight;
	var wph_height	= document.getElementById( 'WORKPLACE_HEADER').offsetHeight;

	var auth		= document.getElementById('WORKPLACE_AUTHENTICATION');
	var dash		= document.getElementById('WORKPLACE_DASHBOARD');


	var wb			= document.getElementById('WORKPLACE_WHITEBOARD');
	var wpwh		= document.getElementById('WORKPLACE_WHITEBOARD_HDR').offsetHeight;
	var wpwm		= document.getElementById('WORKPLACE_WHITEBOARD_MAIN');

	var children	= document.getElementById('WORKPLACE_CHILDREN');
	// var wpch		= document.getElementById('WORKPLACE_CHILDREN_HDR').offsetHeight;
	var wpcm		= document.getElementById('WORKPLACE_CHILDREN_MAIN');

	var range		= document.getElementById('WORKPLACE_RANGE');
	var wprh		= document.getElementById('WORKPLACE_RANGE_HDR').offsetHeight;
	var wprm		= document.getElementById('WORKPLACE_RANGE_MAIN');

	var account		= document.getElementById('WORKPLACE_ACCOUNT');
	// var wpah		= document.getElementById('WORKPLACE_ACCOUNT_HDR').offsetHeight;
	var wpam		= document.getElementById('WORKPLACE_ACCOUNT_MAIN');

	var imagefile	= document.getElementById('WORKPLACE_IMAGEFILE');
	// var wpih		= document.getElementById('WORKPLACE_IMAGEFILE_HDR').offsetHeight;
	var wpim		= document.getElementById('WORKPLACE_IMAGEFILE_MAIN');

	console.log( 'wph_height:' + wph_height );
	console.log( 'resizeWorkplace' );
	console.log( 'bottom overlay width:' + w );

	// 各ワークプレイスの座標を初期化（マイナス座標に設定）
	dash.style.width				= ( w - 144 ) + 'px';
	dash.style.top					= ( -h ) + 'px';
	dash.style.left					= '0px';
	dash.style.height				= 'calc(100% - ' + wph_height + 'px)';
	dash.style.paddingTop			= wph_height + 'px';

	wb.style.width					= ( w - 0 ) + 'px';
	wb.style.top					= ( -h )     + 'px';
	wb.style.left					= '0px';

	children.style.width			= ( w - 0 - 144 ) + 'px';
	children.style.top				= ( -h )     + 'px';
	children.style.left				= '0px';

	range.style.width				= ( w - 0 - 144 ) + 'px';
	range.style.top					= ( -h )     + 'px';
	range.style.left				= '0px';
 
	account.style.width				= ( w - 0 - 144 ) + 'px';
	account.style.top				= ( -h ) + 'px';
	account.style.left				= '0px';

	imagefile.style.width			= ( w - 0 - 144 ) + 'px';
	imagefile.style.top				= ( -h ) + 'px';
	imagefile.style.left			= '0px';


	switch ( workplace_id ){
		case null:
		case 'DASHBOARD':
			dash.style.top			= '0px';
			break;
		case 'AUTHENTICATION':
			auth.style.top			= '0px';
			break;
		case 'WHITEBOARD':
			wb.style.top			= '0px';
			wb.style.height			= ( h - wph_height ) + 'px';
			wpwm.style.height 		= ( h - wph_height - wpwh ) + 'px';
			break;
		case 'CHILDREN':
			children.style.top		= '0px';
			children.style.height 	= ( h - wph_height ) + 'px';
			// wpcm.style.height 		= ( h - wph_height - wpch ) + 'px';
			wpcm.style.height		= '100%';
			break;
		case 'RANGE':
			range.style.top			= '0px';
			range.style.height 		= ( h - wph_height ) + 'px';
			wprm.style.height 		= ( h - wph_height - wprh ) + 'px';	// offset 252
			break;
		case 'ACCOUNT':
			account.style.top		= '0px';
			account.style.height 	= ( h - wph_height ) + 'px';
			// wpam.style.height 		= ( h - wph_height - wpah  ) + 'px';
			wpam.style.height		= '100%';
			break;
		case 'IMAGEFILE':
			imagefile.style.top		= '0px';
			imagefile.style.height 	= ( h - wph_height ) + 'px';
			// wpim.style.height 		= ( h - wph_height - wpih ) + 'px';
			wpim.style.height		= '100%';
			break;
		}

}

function refreshTab(){
	var bf = document.getElementById('BOTTOM_FRAME');
	bf.style.transform	= ( bf.style.transform == 'scale(0.7,0.7)') ? '' :'scale(0.7,0.7)';

	switch( workplace_id ){
		case 'WHITEBOARD':
			// workplaceWhiteboard();
			break;
		case 'CHILDREN':
			// workplaceChildren();
			break;
		case 'RANGE':
			// workplaceRange();
			break;
		case 'ACCOUNT':
			// workplaceAccount();
			break;
	}
}

function addObject(){
	console.log('addObject');
	switch ( workplace_id ){
		case 'WHITEBOARD':
			createWhiteboard();
			break;
		case 'CHILDREN':
			addChildren();
			break;
		case 'RANGE':
			addRange();
			break;
		case 'ACCOUNT':
			addAccount();
			break;
		case 'IMAGEFILE':
			addImagefile();
			break;
	}
}
function findObject(){
	switch ( workplace_id ){
		case 'WHITEBOARD':
			
			break;
		case 'CHILDREN':
			finder();
			break;
		case 'RANGE':
			
			break;
		case 'ACCOUNT':
			workplaceAccountHelper();
			break;
		case 'IMAGEFILE':
			workplaceImagefileHelper();
			break;
	}
}

function signinMotion( e ){
	console.log( 'signinMotion');
	e.stopPropagation();
	if ( e.target != this ) return;
	this.classList.toggle( 'signinMotion' );
}
//transition start
function openingSigninMotion( e ){
	var opt = this.getElementsByClassName('option');
	if ( opt.length == 0 ){		//	opening transition
		this.style.zIndex = 1;
		var o = document.createElement('DIV');
		o.classList.add('option');
		// o.classList.add('signinMotionOff');
		o.style.position		='absolute';
		o.style.top				= '-5px';
		o.style.left			= ( this.offsetWidth + -4 ) + 'px';
		o.style.height			= '100%';
		o.style.width			= '164px';
		o.style.height			= 'calc( 100% - 4px )';
		o.style.textAlign		= 'left';
		o.style.fontWeight		= 'normal';
		o.style.color			= 'gray';
		o.style.backgroundColor	= 'white';
		o.style.border			= '1px solid #EDEDED';
		o.style.margin			= '4px';
		o.style.padding			= '4px 2px 0px 14px';
		o.style.overflow		= 'hidden';
		// o.style.opacity			= 0;
		o.style.transition		= 'all 0.5s ease-in-out';
		var r = '';
		r += '<form name="sign_form" onsubmit="return false;" >';
			// r += '<div style="font-size:10px;padding-top:2px;" >ID:</div>';
			r += '<div style="padding:2px 0px;" >';
				r += '<input style="font-size:12px;width:120px;outline:none;border:none;border-radius:14px;padding:8px 8px 8px 10px;background-color:#EDEDED;background-image:url(./images/user-2.png);background-size:10px;background-repeat:no-repeat;background-position:right 4px center;" type="text" id="acc_id" name="id" tabindex=1 autocomplete="off" placeholder="ID" />';
			r += '</div>';
			// r += '<div style="font-size:10px;padding-top:2px;" >Password:</div>';
			r += '<div style="padding:4px 0px;" >';
				r += '<input style="font-size:12px;width:120px;outline:none;border:none;border-radius:14px;padding:8px 8px 8px 10px;background-color:#EDEDED;background-image:url(./images/key.png);background-size:8px;background-repeat:no-repeat;background-position:right 4px center;" type="password" name="pwd" tabindex=2 autocomplete="off" placeholder="Password" />';
			r += '</div>';

			r += '<div class="operation" style="padding-top:8px;" >';
				r += '<button tabindex="3" type="button" class="workplace_commit_button" ';
				r += ' style="width:130px;height:32px;font-size:14px;padding:8px;"  cmd="commit"  >sign in</button>';
			r += '</div>';

		r += '</form>';
		o.innerHTML = r;

		var oo = this.appendChild( o );
		sign_form.id.focus();
		sign_form.id.addEventListener(
			'keyup', function( e ){
				if ( e.key == 'Enter' )
					sign();
			  }, false );
		sign_form.pwd.addEventListener(
		'keyup', function( e ){
			if ( e.key == 'Enter' )
				sign();
			}, false );
		oo.getElementsByClassName('workplace_commit_button')[0].addEventListener(
			'click', function(e){
				sign();

			}, false );
	} else {	// closing animation
		if ( this == e.target ){
			opt[0].style.left = '-5px';
			opt[0].style.opacity = 0;
		}
	}
}
//transition end
function closingSigninMotion( e ){
	var opt = this.getElementsByClassName('option');
	if ( opt.length > 0 && ! this.classList.contains('signinMotion')) {
		opt[0].parentNode.removeChild( opt[0] );
		// sign_form.id.value 		= '';
		// sign_form.pwd.value		= '';
	}
}

function signoutMotion( e ){
	e.stopPropagation();
	// if ( e.target != this ) return;
	this.classList.toggle( 'signoutMotion' );
}
//transition start
function openingSignoutMotion( e ){
	e.stopPropagation();
	var opt = this.getElementsByClassName('option');
	if ( opt.length == 0 ){		//	opening transition
		// this.style.zIndex = 1;
		var o = document.createElement('DIV');
		o.classList.add('option');
		o.style.position		= 'absolute';
		o.style.top				= '-5px';
		o.style.left			= ( this.offsetWidth + -4 ) + 'px';
		o.style.height			= '100%';
		o.style.width			= ( this.offsetWidth - 16 ) + 'px';
		o.style.height			= 'calc( 100% - 4px )';
		o.style.textAlign		= 'left';
		o.style.fontWeight		= 'normal';
		o.style.color			= 'gray';
		o.style.backgroundColor	= 'red';
		o.style.border			= '1px solid white';
		o.style.margin			= '4px';
		o.style.padding			= '4px 2px 0px 14px';
		o.style.overflow		= 'hidden';
		// o.style.opacity			= 0;
		o.style.transition		= 'all 0.5s ease-in-out';
		var r = '';
		r += '<button type="button" style="color:red;" class="workplace_commit_button" >sign out?</button>';
		o.innerHTML = r;

		var oo = this.appendChild( o );
		oo.getElementsByClassName( 'workplace_commit_button' )[0].addEventListener(
			'click', function (e){
				e.stopPropagation();
				signout();
			}, false );

	} else {	// closing animation
		if ( this == e.target ){
			opt[0].style.left = '-5px';
			opt[0].style.opacity = 0;
		}
	}
}
//transition end
function closingSignoutMotion( e ){
	e.stopPropagation();
	var opt = this.getElementsByClassName('option');
	if ( opt.length > 0 && ! this.classList.contains('signoutMotion')) {
		opt[0].parentNode.removeChild( opt[0] );
	}
}



function selectCurrentRangeId( e ){
	e.stopPropagation();
	var o = e.target;
	while( true ){
		if ( o.tagName == 'BODY' ) return;
		if ( o == this ) return;
		if ( o.hasAttribute( 'range_id' ) ) break;
		o = o.parentNode;
	}
	var ranges = this.childNodes;
	for ( var i=0; i<ranges.length; i++ ){
		if ( o == ranges[i] ) continue;
		if ( ranges[i].hasAttribute( 'selected' ) ){
			ranges[i].removeAttribute('selected');
			ranges[i].classList.remove('selected');
		}
	}

	if ( o.hasAttribute( 'selected' )){
		// o.removeAttribute( 'selected' );
		// o.classList.remove( 'selected' );
	} else {
		o.setAttribute( 'selected', 'yes' );
		o.classList.add( 'selected' );
		cur_range_id = o.getAttribute('range_id');
	}

	if ( getCurrentRangeId() == null ) return;
	switch ( workplace_id ){
		case 'WHITEBOARD':
			makeCalendarMonth12( getCurrentRangeId() );
			guidedance_whiteboard_form.day.value = '';
			break;
		case 'CHILDREN':
			break;
		case 'RANGE':
			break;
		case 'ACCOUNT':
			break;
	}

}

function getCurrentRangeId(){
	return cur_range_id;
	// var ranges = document.getElementById('TAB_CURRENT2').childNodes;
	// var range_id = null;
	// for ( var i=0; i<ranges.length; i++ ){
	// 	if ( ranges[i].hasAttribute('selected')){
	// 		range_id = ranges[i].getAttribute('range_id');
	// 		break;
	// 	}
	// }
	// return range_id;
}

function rotateSignoutMenu(e){
	// e.stopPropagation();
	this.classList.toggle( 'rotate1' );
	console.log( this.classList.contains('rotate1') );
}
function openingSignoutRotation(e){
	var opt = this.getElementsByClassName('option');
	if ( opt.length == 0 ){		//	opening transition
		this.style.zIndex = 1;
		var o = document.createElement('DIV');
		o.classList.add('option');
		o.style.position		='absolute';
		o.style.top				= '-5px';
		o.style.left			= '-5px';
		o.style.height			= '100%';
		o.style.width			= 'calc( 100% - 4px )';
		o.style.height			= 'calc( 100% - 4px )';
		o.style.color			= 'white';
		o.style.backgroundColor	= 'red';
		o.style.border			= '1px solid lightgrey';
		o.style.margin			= '4px';
		o.style.padding			= '2px';
		o.style.overflow		= 'hidden';
		o.style.opacity			= 0;
		o.style.transition		= 'all 0.5s ease-in-out';
		var r = '';
		r += '<div style="float:right;padding:4px;height:84px;writing-mode:vertical-lr" cmd="proceed" >sign out?</div>';
		o.innerHTML = r;

		var oo = this.appendChild( o );
		oo.addEventListener( 'click',
			function ( e ){
				var c = e.target;
				while ( true ){
					if ( c.tagName == 'BODY' ) return;
					if ( c.hasAttribute('cmd')) break;
					c = c.parentNode;
				}
				console.log( c.getAttribute('cmd'));
				switch ( c.getAttribute('cmd')){
					case 'proceed':
						signout();
						break;
				}

			}
		, false);

		setTimeout(() => {
			oo.style.left = 'calc(-100% - 7px)';
			oo.style.opacity = 1;
		}, 50 );
	} else {	// closing animation
		if ( this == e.target ){
			opt[0].style.left = '-5px';
			opt[0].style.opacity = 0;
			// this.style.zIndex = '';
			// opt[0].parentNode.removeChild( opt[0]);
		}
	}
	
}
function closingSignoutRotation(e){
	var opt = this.getElementsByClassName('option');
	if ( opt.length > 0 ){
		console.log( 'offsetLeft' + opt[0].offsetLeft );
		if ( opt[00].offsetLeft >= -5 ){
			this.style.zIndex = '';
			opt[0].style.left = '';
			opt[0].style.opacity = 0;
			opt[0].parentNode.removeChild( opt[0]);
		}

	}
}



//	Left90 transsition start/end invoke
function rotateMenu(e){
	// e.stopPropagation();
	this.classList.toggle( 'rotate1' );
	console.log( this.classList.contains('rotate1') );
}
// Left90 transition process in transition opening
function openingRotation(e){
	var opt = this.getElementsByClassName('option');
	if ( opt.length == 0 ){		//	opening transition
		this.style.zIndex = 1;
		var o = document.createElement('DIV');
		o.classList.add('option');
		o.style.position		='absolute';
		o.style.top				= '-5px';
		o.style.left			= '-5px';
		o.style.height			= '100%';
		o.style.width			= 'calc( 100% - 4px )';
		o.style.height			= 'calc( 100% - 4px )';
		o.style.color			= 'white';
		o.style.backgroundColor	= 'red';
		o.style.border			= '1px solid lightgrey';
		o.style.margin			= '4px';
		o.style.padding			= '2px';
		o.style.overflow		= 'hidden';
		o.style.opacity			= 0;
		o.style.transition		= 'all 0.5s ease-in-out';
		var r = '';
		r += '<div style="float:right;padding:4px;writing-mode:vertical-lr" cmd="log" >log history...</div>';
		r += '<div style="float:right;padding:4px;writing-mode:vertical-lr" cmd="profeel" >profeel...</div>';
		o.innerHTML = r;

		var oo = this.appendChild( o );
		oo.addEventListener( 'click',
			function ( e ){
				var c = e.target;
				while ( true ){
					if ( c == this ) return;
					if ( c.hasAttribute('cmd')) break;
					c = c.parentNode;
				}
				console.log( c.getAttribute('cmd'));
				switch ( c.getAttribute('cmd')){
					case 'log':
						// e.stopPropagation();
						oLog.showHistory(10);
						break;
					case 'profeel':
						accountProperty();
						break;
					default:
						break;
				}

			}
		, false);

		setTimeout(() => {
			oo.style.left = 'calc(-100% - 7px)';
			oo.style.opacity = 1;
		}, 50 );
	} else {	// closing animation
		if ( this == e.target ){
			opt[0].style.left = '-5px';
			opt[0].style.opacity = 0;
			// this.style.zIndex = '';
			// opt[0].parentNode.removeChild( opt[0]);
		}
	}
	
}

// Left90 transition process in transition closing
function closingRotation(e){
	var opt = this.getElementsByClassName('option');
	if ( opt.length > 0 ){
		console.log( 'offsetLeft' + opt[0].offsetLeft );
		if ( opt[00].offsetLeft >= -5 ){
			this.style.zIndex = '';
			opt[0].style.left = '';
			opt[0].style.opacity = 0;
			opt[0].parentNode.removeChild( opt[0]);
		}

	}
}


//
//	ワークプレイス ダッシュボード
//
function workplaceReset(){
	workplace_id = 'DASHBOARD';

	var wpat	= document.getElementById('WORKPLACE_ADMIN_TOOLS')
	var dash	= document.getElementById('WORKPLACE_DASHBOARD');
	var signin	= document.getElementById('WP_SIGNIN');
	var signout	= document.getElementById('WP_SIGNOUT');

	wpat.style.visibility	= 'visible';

	var bf= document.getElementById('BOTTOM_FRAME');


	dash.style.display		= 'inline';
	dash.style.top			= '0px';
	dash.style.transition	= 'all 0.4s ease-in-out';

	//	HEADER
	var wph_range 	= document.getElementById('WPH_RANGE');
	var wph_add	 	= document.getElementById('WPH_ADD');
	var wph_query 	= document.getElementById('WPH_QUERY');
	wph_range.style.visibility		= 'hidden';
	wph_add.style.visibility		= 'hidden';
	wph_query.style.visibility		= 'hidden';


	//	TAB
	// var option	 	= document.getElementById('MONTH12');
	// option.style.visibility		= 'hidden';

	if (signin.classList.contains('signinMotion'))
		signin.classList.remove('signinMotion');
	if (signout.classList.contains('signoutMotion'))
		signout.classList.remove('signoutMotion');

	// showWorkPlace();
	resizeWorkplace();
}



//
//	ホワイトボードメニュー
//
function workplaceWhiteboard(){
	workplace_id = 'WHITEBOARD';

	guidedance_whiteboard_form.day.value = '';

	var wpat	= document.getElementById('WORKPLACE_ADMIN_TOOLS');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');

	wpat.style.visibility		= 'hidden';

	var w = document.getElementById('BOTTOM_OVERLAY').offsetWidth;
	var bf= document.getElementById('BOTTOM_FRAME');
	// bf.style.transform	= 'translateX(' + (-w) + 'px)';
	// bf.style.left		= '100%';
	wb.style.top		= '0px';
	wb.style.transition	= 'all 0.4s ease-in-out';
	// wb.style.transform	= 'rotate(-30deg)';
	// wb.style.transformOrigin = 'top left';

	// bf.style.transform	= 'translateY(' + (-48) + 'px)';
	// wb.style.visibility	= 'visible';

	//	HEADER
	var wph_range 	= document.getElementById('WPH_RANGE');
	var wph_add	 	= document.getElementById('WPH_ADD');
	var wph_query 	= document.getElementById('WPH_QUERY');
	wph_range.style.visibility		= 'visible';
	wph_add.style.visibility		= 'visible';
	wph_query.style.visibility		= 'visible';


	//	TAB
	// var option		= document.getElementById('MONTH12');
	// option.style.visibility		= 'visible';
	
	// children.style.height = '0px';
	// if ( !list.hasChildNodes() ) list.innerHTML = '';
	
	var today = new Date();
	var sotd  = today.getFullYear() + '/' + ( today.getMonth() + 1 ) + '/1';
	makeWhiteboardListScope( sotd );
	makeCalendarMonth12( getCurrentRangeId() );
	setCalendarMonth12( cur_month );
	
	guidedance_whiteboard_form.day.value = '';
	resizeWorkplace();

}

function selectCalendarMonth( e ){
	var o = e.target;
	if ( o == this ) return;
	while ( true ){
		if ( o.tagName == 'BODY') return;
		if ( o.hasAttribute('month')) break;
		o = o.parentNode;
	} 

	setCalendarMonth12( o.getAttribute('month') );
}

function selectCalendar(e){
	e.stopPropagation();
	var o = e.target;
	while ( true ){
		if ( o == null ) return;
		if ( o == this ){
			var days = this.getElementsByClassName('day');
			for ( var i=0; i<days.length; i++ ){
				var c = days[i];
				if ( c.hasAttribute('selected')){
					c.removeAttribute('selected');
					c.classList.remove('selected');
					c.style.animationName	 		= 'scale-in-out';
					c.style.animationDuration		= '0.3s';
					c.style.animationIterationCount = 1;		
				}	
			}
			showCalendarMonthSummary();
			return;
		}
		if ( o.hasAttribute('day') ) break;
		o = o.parentNode;
	}

	//	すでに他のカレンダーをセレクトしていたらリセット
	var calen = this.getElementsByClassName( 'calendar_frame' )[0];

	console.log( 'days:' + calen.childNodes.length );
	var days = this.getElementsByClassName('day');
	for ( var i=0; i<days.length; i++ ){
		var c = days[i];
		if ( c == o ) continue;
		if ( c.hasAttribute('selected')){
			c.removeAttribute('selected');
			c.classList.remove('selected');
			c.style.animationName	 		= 'scale-in-out';
			c.style.animationDuration		= '0.3s';
			c.style.animationIterationCount = 1;

		}	
	}

	//	対象アカウントがセレクトされているかどうかで処理を振り分け
	var p = document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST');
	if ( o.hasAttribute('selected')){
		//	セレクト解除処理
		o.removeAttribute('selected');
		o.classList.remove('selected');
		// p.innerHTML = '';
		showCalendarMonthSummary();

		//	対象外のweeklineを表示復帰
		var cur_weekline = o.parentNode;
		var weeklines = this.getElementsByClassName('weekline');
		for ( var i=0; i<weeklines.length; i++ ){
			weeklines[i].style.display	= 'flex';
		}
		//	ハンドラを表示復帰
		this.getElementsByClassName( 'calendar_handle_left' )[0].style.display = '';
		this.getElementsByClassName( 'calendar_handle_right' )[0].style.display = '';


	} else{
		//	セレクト処理
		o.setAttribute('selected', 'true');
		o.classList.add('selected');
		console.log( 'day:' + o.getAttribute('day'));
		guidedance_whiteboard_form.day.value = o.getAttribute('day');

		//	対象外のweeklineを非表示
		var cur_weekline = o.parentNode;
		var weeklines = this.getElementsByClassName('weekline');
		for ( var i=0; i<weeklines.length; i++ ){
			if ( cur_weekline != weeklines[i] ){
				weeklines[i].style.display	= 'none';
			}
		}
		//	ハンドラを非表示
		this.getElementsByClassName( 'calendar_handle_left' )[0].style.display = 'none';
		this.getElementsByClassName( 'calendar_handle_right' )[0].style.display = 'none';

		listChildren( p, o.getAttribute('day'));
		resizeWorkplace();
		// flipWhiteboardToolBar();
	}
	//	対象のアニメーション処理
	o.style.animationName			= 'scale-in-out';
	o.style.animationDuration		= '0.3s';
	o.style.animationIterationCount = 1;
	

}
function selectCalendarMotionEnd(e){
	console.log('motion end');
	var c = e.target;
	c.style.animationName	= '';

	// while ( true ){
	// 	if ( c == this ) return;
	// 	if ( c.tagName == 'BODY' ) return;
	// 	c = c.parentNode;
	// }

	// if ( !c.hasAttribute( 'selected' )){
	// 	flipWhiteboardToolBar();			// toolbar close
	// }

}

function showCalendarMonthSummary(){
	var p = document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST');

	var delta	  = [ 0, 1, 1, 1, 0, 0, 0,  0,  0,  0, 0, 0, 0 ];

	var r = '';
	r += '<div style="margin:1px;padding:4px;background-color:white;" >';
	r += 'Summary:' +  ( cur_range_id + delta[ cur_month ] ) + '.' + cur_month;
	r += '</div>';

	r += '<div class="statistics" style="margin:1px;padding:4px;background-color:white;font-size:12px;" >';
	r += '</div>';

	r += '<div style="margin:1px;padding:4px;background-color:white;height:120px;font-size:8px;" >';
		r += makeCalendarMonthGraphTemplate();
	r += '</div>';

	r += '<div class="estimates" style="margin:1px;padding:4px;background-color:white;height:60px;font-size:8px;display:flex;align-items:flex-end;" >';
		r += makeEstimeteGraphTemplate();
	r += '</div>';

	p.innerHTML = r;

	var timeline 	= p.getElementsByClassName('timeline')[0];
	var statis		= p.getElementsByClassName('statistics')[0];
	setCalendarMonthGraphTemplate( timeline, statis );

}

function makeCalendarMonthGraphTemplate(){
	var delta	  = [ 0, 1, 1, 1, 0, 0, 0,  0,  0,  0, 0, 0, 0 ];

	var r = '';
	r += '<div class="timeline" style="width:100%;height:100%;display:flex;align-items:flex-end;" >';
		var sotd = new Date( ( cur_range_id + delta[ cur_month ] ) + '/' + cur_month + '/1' );
		var m = sotd.getMonth();
		while ( m == sotd.getMonth() ){
			r += '<div style="margin:0px 1px;padding:2px;text-align:center;width:calc( 100% / 31 );height:14px;background-color:#EDEDED;" >';
				r += sotd.getDate();
			r += '</div>';
			sotd.setDate( sotd.getDate() + 1 );
		}
	r += '</div>';
	return r;
}
function makeEstimeteGraphTemplate(){
	var r = '';
	for ( var i=0; i<11; i++ ){
		r += '<div style="margin:0px 1px;padding:2px;text-align:center;width:calc( 100% / 12 );height:14px;background-color:#EDEDED;" >';
			r += ( i + 9 );
		r += '</div>';
	}
	return r;
}

function setCalendarMonthGraphTemplate( timeline, statis ){
	console.log('setCalendarMonthGraphTemplate');
	var delta	  = [ 0, 1, 1, 1, 0, 0, 0,  0,  0,  0, 0, 0, 0 ];
	var estimates = [ 0,0,0,0,0,0,0,0,0,0,0,0];

	var d = new Date( ( cur_range_id + delta[ cur_month ] ) + '/' + cur_month + '/1' );
	var sotd = getYYYYMMDD( d );
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					var sum_children = 0;
					var cnt_opendays = result.length;
					for ( var i=0; i<result.length; i++ ){
						var day = new Date( result[i].day );
						console.log( day, result.c_children );
						var o = timeline.childNodes[ day.getDate() - 1 ];
						o.style.borderTop	= result[i].c_children + 'px solid orange';
						sum_children += parseInt( result[i].c_children );
					}

					var r = '';
					r += '<div>';
						r += 'all children: ' + sum_children;
					r += '</div>';
					r += '<div>';
						r += 'service days: ' + cnt_opendays;
					r += '</div>';
					r += '<div>';
						r += 'average children per day: ' + ( sum_children / cnt_opendays );
					r += '</div>';
					r += '<div>';
						r += 'escort rate: ';
					r += '</div>';
					r += '<div>';
						r += 'type(A/B) rate: ';
					r += '</div>';
					statis.innerHTML = r;

				} else{
					oLog.log( null, xmlhttp.status );
					oLog.open(3);
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/whiteboardlist2", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'sotd=' + sotd  );
	} catch ( e ) {
		oLog.log( null, 'makeWhiteboardListScope : ' + e );
		oLog.open( 3 );
		// alert( e );
	}
}
function selectWhiteboard(e){
	var p = document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST');
	console.log('selectWhiteboard');
	var o = e.target;
	while ( true ){
		if ( o == this ){
			// console.log( o );
			// エリア外をアクセスしたらリセット
			for ( var i=0; i<this.childNodes.length; i++ ){
				 var o = this.childNodes[i];
				 if ( o.hasAttribute('selected')){
					o.removeAttribute('selected');
					o.classList.remove('selected');
					o.style.animationName	 		= 'scale-in-out';
					o.style.animationDuration		= '0.3s';
					o.style.animationIterationCount = 1;
					// c.classList.remove('height360');
					o.getElementsByClassName('container')[0].innerHTML = '';
					o.getElementsByClassName('container')[0].display = 'none';
				}
				if ( o.classList.contains('calendar_detail_invisible')){
					o.classList.remove('calendar_detail_invisible');
				}
			}
			console.log('return');
			return;
		}
		if ( o.hasAttribute('day')) break;
		o = o.parentNode;
	}


	//	すでに他のアカウントをセレクトしていたらリセット
	for ( var i=0; i<this.childNodes.length; i++ ){
		var c = this.childNodes[i];
		if ( c == o ) continue;
		if ( c.hasAttribute('selected')){
			c.removeAttribute('selected');
			c.classList.remove('selected');
			c.style.animationName	 		= 'scale-in-out';
			c.style.animationDuration		= '0.3s';
			c.style.animationIterationCount = 1;

			// c.classList.remove('height360');
			c.getElementsByClassName('container')[0].innerHTML = '';
			c.getElementsByClassName('container')[0].display = 'none';
		}	
		if ( c.classList.contains('calendar_detail_invisible')){
			c.classList.remove('calendar_detail_invisible');
		}
	}

	//	対象アカウントがセレクトされているかどうかで処理を振り分け
	if ( o.hasAttribute('selected')){
		//	セレクト解除処理
		o.removeAttribute('selected');
		o.classList.remove('selected');
		// o.classList.remove('height360');
		o.getElementsByClassName('container')[0].innerHTML = '';
		o.getElementsByClassName('container')[0].display = 'none';

		// wp_editAccount( o );
	} else{
		//	セレクト処理
		o.setAttribute('selected', 'true');
		o.classList.add('selected');
		flipWhiteboardToolBar();
	}
	//	対象のアニメーション処理
	o.style.animationName			= 'scale-in-out';
	o.style.animationDuration		= '0.3s';
	o.style.animationIterationCount = 1;

	//property area hidden
	// var cdp = p.getElementsByClassName('calendar_detail_property');
	// cdp[0].style.display = 'none';

	var day = o.getAttribute('day');
	guidedance_whiteboard_form.day.value = day;

}

function selectWhiteboardMotionEnd(e){
	console.log('motion end');
	var c = e.target;
	c.style.animationName	= '';

	while ( true ){
		if ( c == this ) return;
		if ( c.classList.contains('calendar_detail_visible')) break;
		c = c.parentNode;
	}

	if ( !c.hasAttribute( 'selected' )){
		flipWhiteboardToolBar();			// toolbar close
	}

}

function flipWhiteboardToolBar(){
	console.log('flipWhiteboardToolBar');
	var wtb = document.getElementById('WHITEBOARD_CONTEXT_TOOLBAR');
	if ( wtb != null ){
		wtb.parentNode.removeChild( wtb );
		console.log('flipWhiteboardToolBar off');
		return;
	}
	var p = document.getElementById('WORKPLACE_WHITEBOARD');
	var o = document.createElement('DIV');
	o.id					= 'WHITEBOARD_CONTEXT_TOOLBAR';
	o.style.position		= 'absolute';
	o.style.top				= 'calc(100% - 76px - 48px)';
	o.style.left			= '0px';
	o.style.width			= '100%';
	o.style.height			= '64px';
	o.style.margin			= '0 auto';
	o.style.zIndex			= 65000;

	var r = '';
	r += '<div style="margin:0 auto;width:190px;height:40px;padding:4px;background-color:#EDEDED;border-radius:8px;" >';
		r += '<button type="button" class="workplace_edit_button"     cmd="edit"    ></button>';
		r += '<button type="button" class="workplace_delete_button"   cmd="delete"    ></button>';
	r += '</div>';
	o.innerHTML = r;
	var tb = p.appendChild( o );
	tb.style.animationName			= 'scale-in-out';
	tb.style.animationDuration		= '0.3s';
	tb.style.animationIterationCount = 1;

	console.log('flipWhiteboardToolBar on');

	tb.addEventListener('click',
		function(e){
			e.stopPropagation();
			var o = e.target;
			var cmd = '';
			while(true){
				if ( o == this ) return;
				if ( o.hasAttribute('cmd')){
					cmd = o.getAttribute('cmd');
					break;
				}
			}
			
			// var days = document.getElementById('CALENDAR_DETAIL').childNodes;
			var days = document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST').childNodes;
			var day_id = null;
			var c = null;
			for ( var i=0; i<days.length; i++ ){
				if ( days[i].hasAttribute('selected')){
					day_id  = days[i].getAttribute('day');
					c		= days[i];
					break;
				}
			}
			if ( day_id == null ) return;
			console.log('day_id:' + day_id );
			console.log('cmd:' + cmd );
			switch ( cmd ){
				case 'edit':
					if ( c.classList.contains('height360')){
						c.classList.remove('height360');
						c.getElementsByClassName('container')[0].innerHTML = '';
						c.getElementsByClassName('container')[0].style.display = 'none';			
					} else {
						console.log('add height360');
						c.classList.add('height360');
						// c.style.height = '360px';
						c.getElementsByClassName('container')[0].innerHTML = 'hogehoge';
						c.getElementsByClassName('container')[0].style.display = 'inline';	
						console.log( c );		
						// wp_editWhiteboard( c );
					}

					break;
				case 'delete':
					if ( o.innerText == 'Ok?' ){
						// wp_deleteAccount( c );
						o.style.width	= '';
						o.innerText 	= '';
						break;
					}
					o.style.width	= '100px';
					o.innerText		= 'Ok?';
					break;
			}
			// console.log( cmd + ' acc_id:' + acc_id );
		}, false );

}

function editWhiteboard(e){
	e.stopPropagation();
	
	// var p = document.getElementById('CALENDAR_DETAIL');
	var p = document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST');
	var o = null;
	var details = p.childNodes;
	for ( var i=0; i<details.length; i++){
		var c = details[i];
		if ( !c.hasAttribute('day')) continue;
		if ( c.hasAttribute('selected')){
			c.style.left	= '10px';
			day = c.getAttribute( 'day' );
			// c.classList.toggle('calendar_detail_visible_set');
		}
		else{
			// c.classList.remove('calendar_detail_visible');
			c.classList.toggle('calendar_detail_invisible');
		}
	}
	
	var cdp = p.getElementsByClassName('calendar_detail_property');
	console.log( 'cdp length: ' + cdp.length );
	cdp[0].style.display = 'inline';

	listChildren( cdp[0].firstChild, day );
	cdp[0].firstChild.addEventListener( 'click',
		function (e){
			e.stopPropagation();
			var c = e.target;
			while ( true ){
				if ( c == this ){
					for ( var i=0; i<this.childNodes.length; i++ ){
						var o = this.childNodes[i];
						if ( o.hasAttribute('selected')){
							o.classList.remove('selected');
							o.removeAttribute('selected');	
						}
					}		
					return;
				}
				if ( c.classList.contains('calendar_list_children')) break;
				c = c.parentNode;
			}

			for ( var i=0; i<this.childNodes.length; i++ ){
				var o = this.childNodes[i];
				if ( c == o ) continue;
				if ( o.hasAttribute('selected')){
					o.classList.remove('selected');
					o.removeAttribute('selected');	
				}
			}

			if ( c.hasAttribute( 'selected' )){
				c.classList.remove('selected');
				c.removeAttribute('selected');
			} else {
				c.classList.add('selected');
				c.setAttribute('selected', 'yes');
			}

		}, false );
		
	// document.getElementById('CALENDAR_DETAIL').scrollTop = 0;
	document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST').scrollTop = 0;

}

function listChildren( p, day ){

	p.innerHTML = '';

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
				break;
			case 2://header received
				break;
			case 3://loading
				// oLog.log( null, 'access Whiteboard children...' );
				// oLog.open( 3 );
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );

					var o = null;
					//	ヘッダー
					o = document.createElement('DIV');
					o.style.padding 	= '4px';
					o.style.fontSize	= '18px';
					o.style.fontWeight	= 'bold';
					o.innerHTML = 'Summary day : ' + day;
					p.appendChild( o );


					//	お迎え時間帯のグラフを生成.
					o = document.createElement('DIV');
					o.classList.add( 'estimates_graph' );
					o.innerHTML = makeEstimeteGraphTemplate();
					var oEst = p.appendChild( o );

					var estimates = {
						'9':	0, '10':0, '11':0, '12':0, '13':0, '14':0, '15':0, '16':0,
						'17':0, '18':0, '19':0
					}

					if ( result.length > 0 ){		//	レコードが存在すれば
			
						for ( var i=0; i<result.length; i++ ){
							var r = '';
							var c = result[i];
							var o = document.createElement('DIV');
							var checkout = getHHMM( ( c.checkout == null )?null : ( new Date ( day + ' ' + c.checkout ) ) );
							var estimate = getHHMM( new Date( day + ' ' + c.estimate ));
							var direction= c.direction;
							o.classList.add('calendar_list_children');
							o.classList.add('unselected');
							if ( checkout != null )
								o.classList.add('checked');
							r += '<div style="float:left;width:48px;height:100%;" class="vh-center" >';
								if ( c.imagefile != '' && c.imagefile != null ){
									r += '<div style="width:28px;height:28px;overflow:hidden;border-radius:50%;background-image:url(./images/children/' + c.imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
									r += '</div>';
								}else {
									r += '<div style="float:left;clear:both;width:28px;height:28px;overflow:hidden;border-radius:50%;" >';
									r += '</div>';
								}
							r += '</div>';
							r += '<div style="float:left;width:auto;height:100%;padding:22px 0px 0px 12px;font-weight:;" >';
								r += '<div>' + c.child_name	+ '</div>';
							r += '</div>';
							r += '<div style="float:right;width:64px;height:100%;padding:22px 0px 0px 12px;font-weight:;" >';
								r += '<div>'   + checkout + '(' + direction + ')' + '</div>';
							r += '</div>';
							r += '<div style="float:right;width:64px;height:100%;padding:22px 0px 0px 12px;font-weight:;" >';
								r += '<div>'   + estimate + '</div>';
							r += '</div>';
							r += '<div style="float:right;width:auto;height:100%;padding:22px 0px 0px 12px;font-weight:;" >';
								r += '<div>'   + c.child_grade + c.child_type  	+ '</div>';
							r += '</div>';
							r += '<div style="float:right;width:12px;height:100%;font-weight:;" >';
								if ( c.escort == 0 )
									r += '<div class="no_escort" style="width:100%;height:100%;" ></div>';
									else
									r += '<div class="escort"    style="width:100%;height:100%;" ></div>';
							r += '</div>';
	
							o.innerHTML = r;
							p.appendChild( o );

							estimates[ c.estimate.split(':')[0]]++;
						}

						for ( var key in estimates ){
							var o = oEst.childNodes[ parseInt( key ) - 9 ];
							o.style.borderTop = estimates[ key ] + 'px solid orange';
						}

					} else{							// レコードが存在しなければ
						// p.innerHTML 		= '';
						// p_absent.innerHTML	= '';
					}

					// footer
					var c = document.createElement('DIV');
					c.classList.add( "calendar_list_children" );
					c.style.fontSize 			= '12px';
					c.style.border				= 'none';
					c.style.color				= 'dimgray';
					c.style.backgroundColor		= 'white';
					c.style.backgroundImage		= 'url(./images/restriction.png)';
					c.style.backgroundSize		= '14px';
					c.style.backgroundRepeat 	= 'no-repeat';
					c.style.backgroundPosition	= 'top 140px  center';
					c.style.display				= 'flex';
					c.style.justifyContent		= 'center';

					c.style.pointerEvents = 'none';
					c.style.height = ( p.parentNode.offsetHeight - 20 ) + 'px';
					// c.innerHTML = 'bottom margin';
					var r = '';
					r += '<div style="width:40px;height:32px;padding-top:8px;font-size:16px;color:white;background-color:limegreen;" >';
					r += '+' + result.length;
					r += '</div>';
					c.innerHTML = r;
					var cc = p.appendChild( c );



				} else{
					oLog.log( null, 'listChildren:' + xmlhttp.status );
					oLog.open( 3 );
				} 
				break;
		}
	};

	xmlhttp.open("POST", "/accounts/resultwhiteboard", true );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'day=' + day );


}

function setCalendarMonth12( month  ){
	var calen = document.getElementById('MONTH12');
	for ( var i=0; i<calen.childNodes.length; i++ ){
		var c = calen.childNodes[i];
		if ( c.getAttribute('month') == month ){
			o = c;
		}
		if ( c.hasAttribute('selected') ){
			c.removeAttribute( 'selected' );
			c.classList.remove('selected');
		}
	}

	o.classList.add('selected');
	o.setAttribute( 'selected', 'true' );
	
	var sotd = o.getAttribute('sotd');

	cur_month 	= o.getAttribute( 'month' );
	cur_sotd	= sotd;
	// var p = document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST');
	makeWhiteboardListScope( sotd );
	showCalendarMonthSummary();

}

function makeCalendarMonth12( range_id ){
	console.log( 'range_id:' + range_id );
	var p = document.getElementById('MONTH12');
	if ( p == null ){
		console.log('MONTH12 is not found.');
		return;
	}
	p.innerHTML = '';
	
	// document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST').innerHTML = '';
	
	var delta	  = [ 0, 0, 0, 0, 0, 0,  0,  0,  0, 1, 1, 1 ];
	var monthid   = [ 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3 ];
	var monthname = [ 'APR', 'MAY', 'JUN', 'JUL','AUG','SEP','OCT', 'NOV','DEC', 'JAN', 'FEB', 'MAR' ];
	var ym = new Date( range_id + '/4/1' );


	for ( var i=0; i<12; i++ ){
		var sotd = ( range_id + delta[i] ) + '/' + monthid[i] + '/1';
		var c = document.createElement('DIV');
		c.setAttribute( 'month', monthid[i] );
		c.setAttribute( 'sotd', sotd );			// MM/1
		c.classList.add('unselected');
		c.classList.add('month_box');
		var r = '';
		r += '<div style="font-size:14px;width:100%;text-align:center;font-weight:bold;" >'  + monthid[i] + '</div>';
		r += '<div style="font-size:10px;width:100%;text-align:center;" >'  + monthname[ i ] + '</div>';
		c.innerHTML = r;
		var cc = p.appendChild( c );

		// if ( cc.getAttribute( 'month') == cur_month ){
		// 	cc.classList.add('selected');
		// 	cc.setAttribute( 'selected', 'true' );	
		// }
	}


	var sotd = new Date( ym.getFullYear() + '/' + ( ym.getMonth() + 1 ) + '/' + ym.getDate() );
	var eotd = new Date( sotd.getFullYear() + '/' + ( sotd.getMonth() + 1 ) + '/' + sotd.getDate() );
	eotd.setFullYear( eotd.getFullYear() + 1 );
	eotd.setDate( eotd.getDate() - 1 );
	console.log( 'sotd:' + getYYYYMMDD( sotd ) + ' eotd:' + getYYYYMMDD(eotd) );

	makeCalendarMonth12Helper( p, getYYYYMMDD(sotd), getYYYYMMDD(eotd) );

}

function makeCalendarMonth12Helper( p, sotd, eotd ){

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				// p.innerText = 'access...';
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );
					console.log( result );

					for ( var i=0; i<result.length; i++ ){
						var o = result[i];
						console.log( 'ym:', o.ym );
						console.log( 'days:' + o.days );
						for ( var j=0; j<p.childNodes.length; j++ ){
							var calen = p.childNodes[j];
							if ( calen.getAttribute('sotd').indexOf( o.ym ) > -1 ){
								calen.classList.add('checked');
							}
						}
					}
					//o.innerHTML = r;
				} else{
					console.log( 'makeCalendarMonth12Helper:' + xmlhttp.status );
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/countresultbymonth", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'sotd=' + sotd + '&eotd=' + eotd );
	} catch ( e ) {
		oLog.log( null, 'makeCalendarMonth12Helper : ' + e );
		oLog.open( 3 );
		// alert( e );
	}

}

function getYYYYMMDD( d ){
	return d.getFullYear() + '/' + ( d.getMonth() + 1 ) + '/' + d.getDate();
}
function getHHMM( d ){
	if ( d == null )
		return '--:--';
		else 
		return ('00' + d.getHours() ).slice(-2) + ':' + ( '00' + d.getMinutes() ).slice(-2);
}
//
//	ホワイトボードリスト生成処理
//
function makeWhiteboardListScope( sotd )
{

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
					var result = JSON.parse( xmlhttp.responseText );

					calendarGadget('WORKPLACE_WHITEBOARD_HDR_CALENDAR', new Date( sotd ).getTime() );

					var day = new Date( sotd );
					m = day.getMonth();

					var ca = document.getElementById('WORKPLACE_WHITEBOARD_HDR_CALENDAR');
					for ( var i=0; i<result.length; i++ ){
						var day = new Date( result[i].day );
						dd = ca.getElementsByClassName('calendar_day_' + day.getDate() );
						if ( dd.length != 0 ){
							dd[0].style.fontWeight			= 'bold';
							dd[0].style.backgroundImage 	= 'url(./images/checked-symbol.png)';
							dd[0].style.backgroundSize		= '10px';
							dd[0].style.backgroundRepeat	= 'no-repeat';
							dd[0].style.backgroundPosition	= 'right 4px bottom 4px';
						}
					}

				} else{
					oLog.log( null, xmlhttp.status );
					oLog.open(3);
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/whiteboardlist2", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'sotd=' + sotd  );
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
	var wpat		= document.getElementById('WORKPLACE_ADMIN_TOOLS');
	var children	= document.getElementById('WORKPLACE_CHILDREN');
	var lists		= document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST');

	// wpat.style.visibility		= 'hidden';

	var w = document.getElementById('BOTTOM_OVERLAY').offsetWidth;
	var bf= document.getElementById('BOTTOM_FRAME');
	children.style.top			= '0px';
	children.style.transition	= 'all 0.4s ease-in-out';

	//	HEADER
	var wph_range 	= document.getElementById('WPH_RANGE');
	var wph_add	 	= document.getElementById('WPH_ADD');
	var wph_query 	= document.getElementById('WPH_QUERY');
	wph_range.style.visibility		= 'visible';
	wph_add.style.visibility		= 'visible';
	wph_query.style.visibility		= 'visible';

	//	TAB

	resizeWorkplace();

	if ( lists.innerText == '' ){
		findObject();
	}

}

//
//		レンジ
//
function workplaceRange(){
	workplace_id = 'RANGE';
	var wpat			= document.getElementById('WORKPLACE_ADMIN_TOOLS');
	var range			= document.getElementById('WORKPLACE_RANGE');
	// var list			= document.getElementById('WORKPLACE_RANGE_MAIN_LIST');

	// wpat.style.visibility	= 'hidden';

	var w = document.getElementById('BOTTOM_OVERLAY').offsetWidth;
	var bf= document.getElementById('BOTTOM_FRAME');
	range.style.top			= '0px';

	//	HEADER
	var wph_range 	= document.getElementById('WPH_RANGE');
	var wph_add	 	= document.getElementById('WPH_ADD');
	var wph_query 	= document.getElementById('WPH_QUERY');
	wph_range.style.visibility		= 'visible';
	wph_add.style.visibility		= 'visible';
	wph_query.style.visibility		= 'visible';

	//	TAB
	// var option		= document.getElementById('MONTH12');
	// option.style.visibility		= 'visible';

	resizeWorkplace();

	workplaceRangeHelper( );

}

function selectRange(e){
	var o = e.target;
	while( true ){
		if ( o.tagName == 'BODY' ) return;
		if ( o == this ){
			for ( var i=0; i<this.childNodes.length; i++ ){
				var c = this.childNodes[i];
				if ( c.hasAttribute('selected')){
					c.removeAttribute('selected');
					// c.classList.remove('selected');
					c.classList.remove('left40');
					// c.removeChild( c.getElementsByClassName('op')[0] );
				}	
			}
			return;
		} 
		if ( o.classList.contains('range')) break;
		o = o.parentNode;
	}

	for ( var i=0; i<this.childNodes.length; i++ ){
		var c = this.childNodes[i];
		if ( c == o ) continue;
		if ( c.hasAttribute('selected')){
			c.removeAttribute('selected');
			// c.classList.remove('selected');
			c.classList.remove('left40');
			// c.removeChild( c.getElementsByClassName('op')[0] );
		}	
	}

	if ( o.hasAttribute('selected')){
		o.removeAttribute('selected');
		// o.classList.remove('selected');
		o.classList.remove('left40');
		// o.removeChild( o.getElementsByClassName('op')[0] );
	} else{
		o.setAttribute('selected', 'true');
		// o.classList.add('selected');
		o.classList.add('left40');
		var op = document.createElement('DIV');
		op.classList.add('op');
		op.classList.add('delete_object');
		op.style.position			= 'absolute';
		op.style.top				= '0px';
		op.style.left				= ( o.offsetWidth + 2 ) + 'px';
		op.style.width				= '30px';
		op.style.height				= '38px';
		op.style.backgroundColor	= '';
		var r = '';
		r += '<button type="button" class="workplace_delete_button_small" cmd="delete" ></button>';
		op.innerHTML = r;
		o.appendChild( op ).addEventListener('click',
			function(e){
				e.stopPropagation();
				var o = e.target;
				var cmd = '';
				while(true){
					if ( o == this ) return;
					if ( o.hasAttribute('cmd')){
						cmd = o.getAttribute('cmd');
						break;
					}
					o = o.parentNode;
				}
				switch ( cmd ){
					case 'delete':
						var range_id = this.parentNode.getAttribute('range_id');
						console.log('delete range_id:' + range_id );
						if ( o.innerText == 'Ok?' ){
							deleteRange( this.parentNode, range_id );
							break;
						}
						// o.style.width = '100px';
						o.innerText = 'Ok?';

						break;
				}

				// e.stopPropagation();
				// var range_id = this.parentNode.getAttribute('range_id');
				// console.log('delete range_id:' + range_id );
				// deleteRange( this.parentNode, range_id );
			}, false );
	}
}
function selectRangeTransitionEnd( e ){
	var c = e.target;
	while ( true ){
		if ( c == this ) return;
		if ( c.classList.contains('range')) break;
		c = c.parentNode;
	}
	if ( !c.classList.contains( 'left40' )){
		c.removeAttribute('selected');
		var op = c.getElementsByClassName( 'op');
		if ( op.length > 0)
			op[0].parentNode.removeChild( op[0] );
	}

}

function workplaceRangeHelper(){

	var p	= document.getElementById('WORKPLACE_RANGE_MAIN_LIST');

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
					p.innerText = '';

					for ( var i=0; i<result.length; i++ ){
						var o = document.createElement('DIV');
						o.classList.add( 'range' );
						o.classList.add( 'unselected' );
						o.setAttribute('range_id', result[i].range_id );
						o.innerHTML				= result[i].range_id;
						p.appendChild( o );

					}

				} else{
					p.innerText = xmlhttp.status;
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/rangelist", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send(  );
	} catch ( e ) {
		oLog.log( null, 'workplaceRangeHelper : ' + e );
		oLog.open( 3 );
	}
}
//
//
//
function addRange(  ){
	var range_id = document.getElementById('WP_RANGE_ID').value;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
					console.log('addRange success');
					workplaceRangeHelper();
				} else{
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/rangeadd", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'range_id=' + range_id );
	} catch ( e ) {
		oLog.log( null, 'deleteRange : ' + e );
		oLog.open( 3 );
	}
}
//
//
//
function deleteRange( obj, range_id ){

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
					obj.parentNode.removeChild( obj );
					console.log('deleteRange success');
				} else{
					// p.innerText = xmlhttp.status;
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/rangedelete", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'range_id=' + range_id );
	} catch ( e ) {
		oLog.log( null, 'deleteRange : ' + e );
		oLog.open( 3 );
	}
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


//
//		アカウント
//
function workplaceAccount(){
	workplace_id = 'ACCOUNT';

	var wpat			= document.getElementById('WORKPLACE_ADMIN_TOOLS');
	var hdr				= document.getElementById('WORKPLACE_HDR');
	var account			= document.getElementById('WORKPLACE_ACCOUNT');
	var lists			= document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST');

	// wpat.style.visibility	= 'hidden';

	var w = document.getElementById('BOTTOM_OVERLAY').offsetWidth;
	var bf= document.getElementById('BOTTOM_FRAME');
	// bf.style.transform	= 'translateX(' + ( -w * 4 ) + 'px)';
	// bf.style.left		= '400%';
	account.style.top		= '0px';

	//	HEADER
	var wph_range 	= document.getElementById('WPH_RANGE');
	var wph_add	 	= document.getElementById('WPH_ADD');
	var wph_query 	= document.getElementById('WPH_QUERY');
	wph_range.style.visibility		= 'visible';
	wph_add.style.visibility		= 'visible';
	wph_query.style.visibility		= 'visible';

	//	TAB
	// var option		= document.getElementById('MONTH12');
	// option.style.visibility		= 'visible';

	// if ( icon.style.height == '0px'){
	// 	menu.style.display		= 'inline';
	// } else {
	// 	menu.style.display		= 'none';
	// }

	resizeWorkplace();

	if ( lists.innerText == '' )
		findObject();

//	workplaceAccountHelper();

	// var list	= document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST');
	// list.addEventListener( 'click', selectAccount, false );

	
}

function selectAccount( e ){
	var o = e.target;
	while( true ){
		if ( o.tagName == 'BODY' ) return;
		if ( o == this ){
			// エリア外をアクセスしたらリセット
			for ( var i=0; i<this.childNodes.length; i++ ){
				var c = this.childNodes[i];
				if ( c.hasAttribute('selected')){
					c.removeAttribute('selected');
					c.classList.remove('selected');
					c.style.animationName	 		= 'scale-in-out';
					c.style.animationDuration		= '0.3s';
					c.style.animationIterationCount = 1;
					c.classList.remove('height360');
					c.getElementsByClassName('container')[0].innerHTML = '';
					c.getElementsByClassName('container')[0].display = 'none';
					// wp_editAccount( c );
				}	
			}
			return;
		} 
		if ( o.classList.contains('account')) break;
		o = o.parentNode;
	}

	//	すでに他のアカウントをセレクトしていたらリセット
	for ( var i=0; i<this.childNodes.length; i++ ){
		var c = this.childNodes[i];
		if ( c == o ) continue;
		if ( c.hasAttribute('selected')){
			c.removeAttribute('selected');
			c.classList.remove('selected');
			c.style.animationName	 		= 'scale-in-out';
			c.style.animationDuration		= '0.3s';
			c.style.animationIterationCount = 1;

			// c.classList.remove('left40');
			c.classList.remove('height360');
			c.getElementsByClassName('container')[0].innerHTML = '';
			c.getElementsByClassName('container')[0].display = 'none';
			// wp_editAccount( c );
		}	
	}

	//	対象アカウントがセレクトされているかどうかで処理を振り分け
	if ( o.hasAttribute('selected')){
		//	セレクト解除処理
		o.removeAttribute('selected');
		o.classList.remove('selected');
		o.classList.remove('height360');
		o.getElementsByClassName('container')[0].innerHTML = '';
		o.getElementsByClassName('container')[0].display = 'none';

		// wp_editAccount( o );
	} else{
		//	セレクト処理
		o.setAttribute('selected', 'true');
		o.classList.add('selected');
		flipAccountToolBar();
	}
	//	対象のアニメーション処理
	o.style.animationName	 		= 'scale-in-out';
	o.style.animationDuration		= '0.3s';
	o.style.animationIterationCount = 1;

}

function flipAccountToolBar(){

	var atb = document.getElementById('ACCOUNT_TOOLBAR');
	if ( atb != null ){
		atb.parentNode.removeChild( atb );
		return;
	}
	var p = document.getElementById('WORKPLACE_ACCOUNT');
	var o = document.createElement('DIV');
	o.id				= 'ACCOUNT_TOOLBAR';
	o.style.position	= 'absolute';
	o.style.top			= 'calc(100% - 76px - 48px)';
	o.style.left		= '0px';
	o.style.width		= '100%';
	o.style.height		= '64px';
	o.style.margin		= '0 auto';
	o.style.zIndex		= 65000;

	var r = '';
	r += '<div style="margin:0 auto;width:190px;height:40px;padding:4px;background-color:#EDEDED;border-radius:8px;" >';
		r += '<button type="button" class="workplace_edit_button"     cmd="edit"    ></button>';
		r += '<button type="button" class="workplace_delete_button"   cmd="delete"    ></button>';
	r += '</div>';
	o.innerHTML = r;
	var tb = p.appendChild( o );
	tb.style.animationName			= 'scale-in-out';
	tb.style.animationDuration		= '0.3s';
	tb.style.animationIterationCount = 1;

	tb.addEventListener('click',
	function(e){
		e.stopPropagation();
		var o = e.target;
		var cmd = '';
		while(true){
			if ( o == this ) return;
			if ( o.hasAttribute('cmd')){
				cmd = o.getAttribute('cmd');
				break;
			}
		}
		// var acc_id = this.parentNode.getAttribute('acc_id');
		var accounts = document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST').childNodes;
		var acc_id = null;
		var c = null;
		for ( var i=0; i<accounts.length; i++ ){
			if ( accounts[i].hasAttribute('selected')){
				acc_id  = accounts[i].getAttribute('acc_id');
				c		= accounts[i];
				break;
			}
		}
		if ( acc_id == null ) return;

		switch ( cmd ){
			case 'edit':
				if ( c.classList.contains('height360')){
					c.classList.remove('height360');
					c.getElementsByClassName('container')[0].innerHTML = '';
					c.getElementsByClassName('container')[0].display = 'none';			
				} else {
					c.classList.add('height360');
					wp_editAccount( c );
				}

				// c.classList.toggle('height360');
				// wp_editAccount( c );
				break;
			case 'delete':
				if ( o.innerText == 'Ok?' ){
					wp_deleteAccount( c );
					break;
				}
				o.style.width = '100px';
				o.innerText = 'Ok?';
				break;
		}
		console.log( cmd + ' acc_id:' + acc_id );
	}, false );

}

function selectAccountMotionStart( e ){
	console.log('motion start');
}
function selectAccountMotionEnd( e ){
	console.log('motion end');
	var c = e.target;
	c.style.animationName	= '';

	while ( true ){
		if ( c == this ) return;
		if ( c.classList.contains('account')) break;
		c = c.parentNode;
	}

	if ( !c.hasAttribute( 'selected' )){
		flipAccountToolBar();			// toolbar close
	}

}


function workplaceAccountHelper(){

	//	if close TOOLBAR
	var atb = document.getElementById('ACCOUNT_TOOLBAR');
	if ( atb != null ){
		atb.parentNode.removeChild( atb );
	}
	
	var p	= document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST');

	// var keyword = document.getElementById( 'WP_ACCOUNT_ID' ).value;
	var keyword = document.getElementById( 'WP_QUERY_ID' ).value;
	if ( keyword == '' )
		keyword = '%';

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
					p.innerText = '';

					for ( var i=0; i<result.length; i++ ){
						var acc_id = result[i].acc_id;
						var acc_name = result[i].acc_name;
						var priv	 = result[i].priv;
						var imagefile= result[i].imagefile;
						if ( imagefile == null || imagefile == '')
							imagefile = '';

						var o = document.createElement('DIV');
						o.classList.add( 'account' );
						o.classList.add( 'unselected' );
						o.setAttribute('acc_id', 	acc_id );
						o.setAttribute('acc_name',	acc_name );
						o.setAttribute('priv', 		priv );
						o.setAttribute('imagefile',	imagefile );
						o.style.textAlign = 'left';
						o.style.top			= ( Math.floor( Math.random() * 2000 ) - 1000 ) + 'px';
						o.style.left		= ( Math.floor( Math.random() * 2000 ) - 1000 ) + 'px';

						var r = '';
						r += '<div style="float:left;width:80px;height:80px;" class="vh-center" >';
							if ( imagefile != '' ){
								r += '<div style="width:42px;height:42px;border-radius:50%;background-image:url(./images/accounts/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
								r += '</div>';
							} else {
								r += '<div style="width:42px;height:42px;border-radius:50%;background-image:url(./images/user-2.png);background-size:14px;background-position:center center;background-repeat:no-repeat;" >';
								r += '</div>';
							}
						r += '</div>';
						r += '<div style="float:left;width:calc(100% - 80px);height:80px;"  >';
							r += '<div style="padding:2px;font-weight:bold;" >' + acc_id + '</div>';
							r += '<div class="acc_name" style="padding:2px;font-weight:bold;font-size:18px;" >' + acc_name  + '</div>';
							r += '<div class="acc_priv" style="padding:2px;" >' + priv      + '</div>';
						r += '</div>';

						r += '<div class="container" style="height:0px;background-color:white;display:none;overflow:visible;" ></div>';

						o.innerHTML		= r;
						var acc = p.appendChild( o )

					}

					// bottom padding footer
					var c = document.createElement('DIV');
					c.classList.add( "account" );
					c.style.color				= 'red';
					c.style.fontSize 			= '12px';
					c.style.border				= 'none';
					c.style.color				= 'dimgray';
					c.style.backgroundColor		= 'white';
					c.style.backgroundImage		= 'url(./images/restriction.png)';
					c.style.backgroundSize		= '14px';
					c.style.backgroundRepeat 	= 'no-repeat';
					c.style.backgroundPosition	= 'top 140px  center';
					c.style.display				= 'flex';
					c.style.justifyContent		= 'center';

					c.style.pointerEvents = 'none';
					c.style.height = ( p.parentNode.offsetHeight - 20 ) + 'px';
					// c.innerHTML = 'bottom margin';
					var r = '';
					r += '<div style="width:40px;height:32px;padding-top:8px;font-size:16px;color:white;background-color:limegreen;" >';
					r += '+' + result.length;
					r += '</div>';
					c.innerHTML = r;
					var cc = p.appendChild( c );
					
					setTimeout(() => {
						var accounts = document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST').childNodes;
						for ( var i=0; i<accounts.length; i++ ){
							accounts[i].style.top = '0px';
							accounts[i].style.left = '0px';
						}
					}, 50 );


				} else{
					p.innerText = xmlhttp.status;
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/list", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'keyword=' + keyword );
	} catch ( e ) {
		oLog.log( null, 'workplaceAccountHelper : ' + e );
		oLog.open( 3 );
	}

}

function makeAccountEditTag( acc_id, acc_name, priv, imagefile ){
	var r = '';
	r += '<div class="appendix" style="float:none;width:100%;height:calc(100% - 40px);background-color:white;padding:20px 0px;display:none;" >';
		r += '<form name="accountForm" onsubmit="return false;" >';
		if ( acc_id == null || acc_id == '' ){
			r += '<div>acc_id:</div>';
			r += '<div style="padding-top:4px;" >';
				r += '<input type="text" name="acc_id" maxlength="64" autocomplete="off" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;"  value="" />';
			r += '</div>';	
		}else{
			r += '<input type="hidden" name="acc_id" value="' + acc_id + '" />';
		}
		r += '<div style="padding-top:4px;" >acc_name:</div>';
		r += '<div style="padding-top:4px;" >';
			r += '<input type="text" name="acc_name" maxlength="64" autocomplete="off" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;"  value="' + acc_name + '" />';
		r += '</div>';
		r += '<div style="padding-top:4px;" >password:</div>';
		r += '<div style="padding-top:4px;" >';
			r += '<input type="password" name="acc_pwd" maxlength="64" autocomplete="off" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;"  value="" />';
		r += '</div>';

		var privs = [ 'admin', 'editor', 'guest' ];
		r += '<div style="padding-top:4px;" >priveledge:</div>';
		r += '<div style="width:90%;height:30px;padding:3px;background-color:#EDEDED;border-radius:4px;display:flex;" >';
		for ( var j=0; j<privs.length; j++ ){
			var checked = ( priv == privs[j] ) ? ' checked ' : '';
			r += '<input type="radio" id="acc_priv_' + privs[j] + '" name="acc_priv"  value="' + privs[j] + '"  ' + checked + '  />';
			r += '<label for="acc_priv_' + privs[j] + '"  style="display:block;float:left;width:30px;height:21px;padding:5px 4px 1px 5px;" >' + privs[j] + '</label>';
		}
		r += '</div>';
		r += '<div style="padding-top:4px;" >image file:</div>';
		r += '<div style="padding-top:4px;" >';
			r += '<input type="text" name="acc_imagefile" maxlength="64" autocomplete="off" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;"  value="' + imagefile + '" />';
		r += '</div>';

		r += '<div class="operation" style="padding-top:4px;" >';
			r += '<button type="button" class="workplace_commit_button" cmd="commit" >&nbsp;</button>';
			r += '<button type="button" class="workplace_cancel_button" cmd="cancel" >&nbsp;</button>';
		r += '</div>';

		r += '</form>';
	r += '</div>';
	return r;
}

function addAccount(){
	//	if close TOOLBAR
	var atb = document.getElementById('ACCOUNT_TOOLBAR');
	if ( atb != null ){
		atb.parentNode.removeChild( atb );
	}

	//	リストしているアカウントを削除
	var p	= document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST');
	while ( p.firstChild ){
		p.removeChild( p.firstChild );
	}
	if ( p.getElementsByClassName('add_account').length > 0 ) return;
	var o = document.createElement('DIV');
	o.classList.add('add_account');
	o.style.textAlign	= 'left';

	var r = '';
	r += '<div style="width:100%;height:40px;color:white;background-color:royalblue;" >';
		r += '<div style="padding:4px;" >アカウントを作成します.</div>';
	r += '</div>';
	r += makeAccountEditTag( null, '', '', '' );
	o.innerHTML = r;

	// p.prepend( o );
	p.appendChild( o ).getElementsByClassName('appendix')[0].style.display = 'inline';

	var accept = p.getElementsByClassName('workplace_commit_button');
	accept[0].addEventListener('click',
		function(e){
			e.stopPropagation();
			if ( !confirmAccount( 'ADD' ) ) return;
			if ( this.innerText == 'Ok?'){
				addAccountHelper();
			} else {
				this.innerText = 'Ok?';
			}
		}, false );
	var cancel = p.getElementsByClassName('workplace_cancel_button');
	cancel[0].addEventListener('click',
		function(e){
			e.stopPropagation();
			cancelAddAccount();
		}, false );
	
}

function confirmAccount( op ){
	var acc_id   		= accountForm.acc_id.value;
	var acc_pwd   		= accountForm.acc_pwd.value;
	var acc_name 		= accountForm.acc_name.value;
	var acc_priv 		= accountForm.acc_priv.value;
	var acc_imagefile	= accountForm.acc_imagefile.value;

	//	個別対応
	switch ( op ){
		case 'ADD':
			if ( acc_id == '' ){
				accountForm.acc_id.focus();
				oLog.log( null, 'acc_id を入力してください.' );
				oLog.open(3);
				return false;
			}
			if ( acc_pwd == '' ){
				accountForm.acc_id.focus();
				oLog.log( null, 'password を入力してください.' );
				oLog.open(3);
				return false;
			}
			break;
		case 'UPDATE':
			break;
	}
	// 共通処理
	if ( acc_name == '' ){
		accountForm.acc_name.focus();
		oLog.log( null, 'acc_name を入力してください.' );
		oLog.open(3);
		return false;
	}
	if ( acc_priv == '' ){
		accountForm.acc_priv[0].focus();
		oLog.log( null, 'priveledge を入力してください.' );
		oLog.open(3);
		return false;
	}

	return true;

}

function addAccountHelper(){
	var acc_id   		= accountForm.acc_id.value;
	var acc_pwd			= accountForm.acc_pwd.value;
	var acc_name 		= accountForm.acc_name.value;
	var acc_priv 		= accountForm.acc_priv.value;
	var acc_imagefile	= accountForm.acc_imagefile.value;

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
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						
						var result = JSON.parse( xmlhttp.responseText );
						console.log( result );
						switch ( result.status ){
							case 'EXIST':
								oLog.log( null, 'acc_id はすでに登録されています.' );
								oLog.open(5);
								break;
							case 'FAILED':
								oLog.log( null, 'acc_id がnull あるいは空白.' );
								oLog.open(5);
								break;
							case 'NOENTRY':
								registAccount( acc_id, acc_pwd, acc_name, acc_priv, acc_imagefile );
								break;
							}						


					} else{
						console.log( null, 'checkAcc_id:' + xmlhttp.status );
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/existaccount", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'acc_id=' + acc_id );


}

function registAccount( acc_id, acc_pwd, acc_name, acc_priv, acc_imagefile ){
	console.log('registAccount');
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
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						
						var result = JSON.parse( xmlhttp.responseText );
						console.log( result );
						switch ( result.status ){
							case 'SUCCESS':
								oLog.log(null, 'アカウントを登録しました.' );
								workplaceAccountHelper();
								oLog.open(3);
								break;
							case 'FAILED':
								oLog.log(null, 'アカウントの登録に失敗しました.' );
								oLog.open(3);
								break;
						}						

					} else{
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/registaccount", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'acc_id=' + acc_id + '&acc_pwd=' + acc_pwd + '&acc_name=' + acc_name + '&acc_priv=' + acc_priv + '&acc_imagefile=' + acc_imagefile );

}

function cancelAddAccount(){
	var p	= document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST');
	var accform = p.getElementsByClassName('add_account');
	if ( accform.length > 0 )
		accform[0].parentNode.removeChild( accform[0] );
}

function wp_editAccount( p_old ){
	console.log( 'wp_editAccount');

	// セレクトしているアカウントを検索
	var lists = document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST').childNodes;
	var c = null;
	for ( var i=0; i<lists.length; i++ ){
		if ( lists[i].hasAttribute('selected')){
			c = lists[i];
			break;
		}
	}
	if ( c == null ) return;

	var container = null;
	container = c.getElementsByClassName( 'container' )[0];

	container.style.display	= 'inline';
	if ( container.getElementsByClassName('accountEdit').length > 0 ) return;
	container.addEventListener('click',function(e){e.stopPropagation();}, false);

	var m = document.getElementById( 'WORKPLACE_ACCOUNT_MAIN');

	var o = document.createElement('DIV');
	o.classList.add('accountEdit');
	o.style.textAlign	= 'left';
	var p = container.appendChild( o );

	var acc_id 		= c.getAttribute( 'acc_id' );
	var acc_name	= c.getAttribute( 'acc_name' );
	var priv		= c.getAttribute( 'priv' );
	var imagefile	= c.getAttribute( 'imagefile' );

	p.innerHTML		= makeAccountEditTag( acc_id, acc_name, priv, imagefile );
	// p.innerHTML = makeChildrenEditTag( child_id, kana, child_name, remark, child_type, child_grade, imagefile );
	p.getElementsByClassName('appendix')[0].style.display	= 'inline';

	p.getElementsByClassName('operation')[0].addEventListener(
		'click',
		function ( e ){
			var x = e.target;
			while ( true ){
				if ( x == this ) return;
				if ( x.hasAttribute('cmd')) break;
				x = x.parentNode;
			}
			var acc = x;
			while ( true ){
				if ( acc.hasAttribute( 'acc_id' )) break;
				acc = acc.parentNode;
			}
			switch ( x.getAttribute('cmd') ){
				case 'commit':
					console.log( 'commit:' + acc.getAttribute('acc_id') );
					if ( !confirmAccount('UPDATE') ) return;
					if ( x.innerText == 'Ok?'){
						x.innerText = '';
						updateAccount();
						acc.setAttribute( 'acc_name', 		accountForm.acc_name.value );
						acc.setAttribute( 'priv', 			accountForm.acc_priv.value );
						acc.setAttribute( 'imagefile', 		accountForm.acc_imagefile.value );
						acc.getElementsByClassName('acc_name')[0].innerHTML =
							accountForm.acc_name.value;
						acc.getElementsByClassName('acc_priv')[0].innerHTML =
							accountForm.acc_priv.value; 

					} else {
						x.innerText = 'Ok?';
					}
					break;
				case 'cancel':
					console.log( 'cancel:' + acc.getAttribute('acc_id') );
					acc.classList.remove('height360');
					acc.getElementsByClassName('container')[0].innerHTML = '';
					acc.getElementsByClassName('container')[0].display = 'none';

					break;
			}
		}
	);



	// var flg = p.classList.contains('height360');
	// var apdxs = p.getElementsByClassName('appendix');
	// for ( var i=0; i<apdxs.length; i++ ){
	// 	apdxs[i].style.display = ( flg ) ? 'inline' : 'none';
	// 	apdxs[i].getElementsByClassName( 'workplace_commit_button' )[0].innerText = '';
	// 	apdxs[i].getElementsByClassName( 'workplace_cancel_button' )[0].innerText = '';
	// 	if ( flg ) 	apdxs[i].addEventListener('click', function(e){ e.stopPropagation();}, false );
	// 		else	apdxs[i].removeEventListener('click', function(e){ e.stopPropagation();}, false );
	// }

}
function wp_deleteAccount( p ){
	p.parentNode.removeChild( p );
	var acc_id = p.getAttribute('acc_id');

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.addEventListener('readystatechange', 
		function (e){
			switch ( xmlhttp.readyState){
				case 1://opened
					break;
				case 2://header received
					break;
				case 3://loading
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						
						var result = JSON.parse( xmlhttp.responseText );
						console.log( result );
						switch ( result.status ){
							case 'SUCCESS':
								oLog.log(null, 'アカウントを削除しました.' );
								oLog.open(3);
								break;
							case 'FAILED':
								oLog.log(null, 'アカウントの削除に失敗しました.' );
								oLog.open(3);
								break;
						}						

					} else{
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/deleteaccount", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'acc_id=' + acc_id );


}

function updateAccount(){
	var acc_id 			= accountForm.acc_id.value;
	var acc_pwd			= accountForm.acc_pwd.value;
	var acc_name		= accountForm.acc_name.value;
	var acc_priv		= accountForm.acc_priv.value;
	var acc_imagefile	= accountForm.acc_imagefile.value;
	console.log( 'acc_id:'     + acc_id );
	console.log( 'acc_pwd:'    + acc_pwd );
	console.log( 'acc_name:'   + acc_name );
	console.log( 'priveledge:' + acc_priv );
	console.log( 'imagefile:'  + acc_imagefile );

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.addEventListener('readystatechange', 
		function (e){
			switch ( xmlhttp.readyState){
				case 1://opened
					break;
				case 2://header received
					break;
				case 3://loading
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						
						var result = JSON.parse( xmlhttp.responseText );
						console.log( result );
						switch ( result.status ){
							case 'SUCCESS':
								oLog.log(null, 'アカウントを更新しました.' );
								oLog.open(3);
								break;
							case 'FAILED':
								oLog.log(null, 'アカウントの更新に失敗しました.' );
								oLog.open(3);
								break;
						}						

					} else{
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/updateaccount", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'acc_id=' + acc_id + '&acc_pwd=' + acc_pwd + '&acc_name=' + acc_name + '&acc_priv=' + acc_priv + '&acc_imagefile=' + acc_imagefile );

}

//
//	チルドレンをクリック
//
function selectChildren( e ){
	e.stopPropagation();
	var c = e.target;
	while( true ){
		if ( c.tagName == 'BODY' ) return;
		if ( c == this ){
			// エリア外をアクセスしたらリセット
			for ( var i=0; i<this.childNodes.length; i++ ){
				var o = this.childNodes[i];
				if ( o.hasAttribute('selected')){
					o.removeAttribute('selected');
					o.classList.remove('selected');
					o.style.animationName	 		= 'scale-in-out';
					o.style.animationDuration		= '0.3s';
					o.style.animationIterationCount = 1;
					o.classList.remove('editChildrenFrame');
					o.getElementsByClassName('container')[0].innerHTML = '';
					o.getElementsByClassName('container')[0].display = 'none';
				}	
			}
			return;
		} 
		if ( c.classList.contains('WP_PALLETE_CHILD')) break;
		c = c.parentNode;
	}


	//	すでに他のチャイルドをセレクトしていたらリセット
	for ( var i=0; i<this.childNodes.length; i++ ){
		var o = this.childNodes[i];
		if ( c == o ) continue;
		if ( o.hasAttribute('selected')){
			o.removeAttribute('selected');
			o.classList.remove('selected');
			o.style.animationName	 		= 'scale-in-out';
			o.style.animationDuration		= '0.3s';
			o.style.animationIterationCount = 1;
			o.classList.remove('editChildrenFrame');	
			o.getElementsByClassName('container')[0].innerHTML = '';
			o.getElementsByClassName('container')[0].display = 'none';
		}	
	}


	// 他のチャイルドのメニューを閉じる
	for ( var i=0; i<this.childNodes.length; i++ ){
		var o = this.childNodes[i];
		if ( c == o ) continue;
		if ( o.classList.contains('WP_PALLETE_CHILDREN'))
			o.classList.toggle('hiding');
	}

	// if ( !c.hasAttribute( 'selected' )){
	// 	c.setAttribute( 'selected', 'yes' );
	// 	c.classList.add('right100');
	// } else {
	// 	c.classList.remove('right100');
	// 	return;
	// }

	//	対象チャイルドがセレクトされているかどうかで処理を振り分け
	if ( c.hasAttribute('selected')){
		//	セレクト解除処理
		c.removeAttribute('selected');
		c.classList.remove('selected');
		c.classList.remove('editChildrenFrame');
		c.getElementsByClassName('container')[0].innerHTML = '';
		c.getElementsByClassName('container')[0].display = 'none';
	} else{
		//	セレクト処理
		c.setAttribute('selected', 'true');
		c.classList.add('selected');
		flipChildrenToolBar();
	}
	//	対象のアニメーション処理
	c.style.animationName	 		= 'scale-in-out';
	c.style.animationDuration		= '0.3s';
	c.style.animationIterationCount = 1;

}

function flipChildrenToolBar(){

	var ctb = document.getElementById('CHILDREN_TOOLBAR');
	if ( ctb != null ){
		ctb.parentNode.removeChild( ctb );
		return;
	}
	var p = document.getElementById('WORKPLACE_CHILDREN');
	var o = document.createElement('DIV');
	o.id					= 'CHILDREN_TOOLBAR';
	o.style.pointerEvents	= 'none';
	o.style.position		= 'absolute';
	o.style.top				= 'calc(100% - 76px - 48px)';
	o.style.left			= '0px';
	o.style.width			= '100%';
	o.style.height			= '64px';
	o.style.margin			= '0 auto';
	o.style.zIndex			= 65000;

	var r = '';
	r += '<div style="pointer-events:auto;margin:0 auto;width:190px;height:40px;padding:4px;background-color:#EDEDED;border-radius:8px;" >';
		r += '<button type="button" class="workplace_edit_button"     cmd="edit"    ></button>';
		r += '<button type="button" class="workplace_history_button"  cmd="history" ></button>';	
		r += '<button type="button" class="workplace_delete_button"   cmd="delete"  ></button>';
	r += '</div>';
	o.innerHTML = r;
	var tb = p.appendChild( o );
	tb.style.animationName			= 'scale-in-out';
	tb.style.animationDuration		= '0.3s';
	tb.style.animationIterationCount = 1;

	tb.addEventListener('click',
	function(e){
		e.stopPropagation();
		var o = e.target;
		var cmd = '';
		while(true){
			if ( o == this ) return;
			if ( o.hasAttribute('cmd')){
				cmd = o.getAttribute('cmd');
				break;
			}
		}

		var children = document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST').childNodes;
		var child_id = null;
		var c = null;
		for ( var i=0; i<children.length; i++ ){
			if ( children[i].hasAttribute('selected')){
				child_id  = children[i].getAttribute('child_id');
				c		= children[i];
				break;
			}
		}
		if ( child_id == null ) return;

		switch ( cmd ){
			case 'edit':
				if ( c.classList.contains('editChildrenFrame')){
					c.classList.remove('editChildrenFrame');
					c.getElementsByClassName('container')[0].innerHTML = '';
					c.getElementsByClassName('container')[0].display = 'none';			
				} else {
					c.classList.add('editChildrenFrame');
					wp_editChildren();
				}
				break;
			case 'delete':
				if ( o.innerText == 'Ok?' ){
					wp_deleteChildren( c );
					o.style.width = '';
					o.innerText = '';
						break;
				}
				o.style.width = '100px';
				o.innerText = 'Ok?';
				break;
			case 'history':
				if ( c.classList.contains('editChildrenFrame')){
					c.classList.remove('editChildrenFrame');
					c.getElementsByClassName('container')[0].innerHTML = '';
					c.getElementsByClassName('container')[0].display = 'none';			
				} else {
					c.classList.add('editChildrenFrame');
					showChildrenHistory();
				}
				break;
		}

	}, false );

}

function selectChildrenMotionEnd( e ){
	console.log('motion end');
	var c = e.target;
	c.style.animationName	= '';

	while ( true ){
		if ( c == this ) return;
		if ( c.classList.contains('WP_PALLETE_CHILD')) break;
		c = c.parentNode;
	}

	if ( !c.hasAttribute( 'selected' )){
		flipChildrenToolBar();			// toolbar close
	}
	
}

function addChildren(){

	var range_id = null;
	range_id = getCurrentRangeId();

	if (range_id == null ){
		oLog.log( null, 'レンジを指定してください.');
		oLog.open(3);
		return;
	}
	console.log( 'range_id:' + range_id );

	var ctb = document.getElementById('CHILDREN_TOOLBAR');
	if ( ctb != null ){
		ctb.parentNode.removeChild( ctb );
	}

	var p	= document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST');
	while ( p.firstChild){
        p.removeChild( p.firstChild );
    }

	if ( p.getElementsByClassName('add_children').length > 0 ){
		return;
	}
	var o = document.createElement('DIV');
	o.classList.add('add_children');
	o.style.textAlign	= 'left';
	o.style.top			= ( Math.floor( Math.random() * 2000 ) - 1000 ) + 'px';
	o.style.left		= ( Math.floor( Math.random() * 2000 ) - 1000 ) + 'px';

	var r = '';
	r += '<div style="width:100%;height:50px;font-size:14px;color:white;background-color:royalblue;" >';
		r += '<div style="padding:4px;" >';
		r += 'add child';
		r += '</div>';
	r += '</div>';

	r += makeChildrenEditTag( null, '', '', '', '', '', '' );

	o.innerHTML = r;

	// p.prepend( o );
	var container = p.appendChild( o );
	container.getElementsByClassName( 'appendix' )[0].style.display = 'inline';


	setTimeout(() => {
		var children = document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST').childNodes;
		for ( var i=0; i<children.length; i++ ){
			children[i].style.top = '0px';
			children[i].style.left = '0px';
		}
	}, 50 );

	var accept = p.getElementsByClassName('workplace_commit_button');
	accept[0].addEventListener('click',
		function(e){
			e.stopPropagation();
			if ( !confirmChildren('ADD') ) return;
			if ( this.innerText == 'Ok?'){
				addChildrenHelper();
			} else {
				this.innerText = 'Ok?';
			}
		}, false );
	var cancel = p.getElementsByClassName('workplace_cancel_button');
	cancel[0].addEventListener('click',
		function(e){
			e.stopPropagation();
			cancelAddChildren();
		}, false );
	
}

function confirmChildren( op ){
	var kana	   		= childrenForm.kana.value;
	var child_name 		= childrenForm.child_name.value;
	// var remark	 		= childrenForm.remark.value;
	// var imagefile		= childrenForm.imagefile.value;
	var child_type		= childrenForm.child_type.value;
	var child_grade		= childrenForm.child_grade.value;

	if ( kana == '' ){
		childrenForm.kana.focus();
		oLog.log( null, 'Kana を入力してください.' );
		oLog.open(3);
		return false;
	}
	if ( child_name == '' ){
		childrenForm.child_name.focus();
		oLog.log( null, 'Name を入力してください.' );
		oLog.open(3);
		return false;
	}
	// if ( remark == '' ){
	// 	childrenForm.remark.focus();
	// 	oLog.log( null, 'Remark を入力してください.' );
	// 	oLog.open(3);
	// 	return false;
	// }
	// if ( imagefile == '' ){
	// 	childrenForm.imagefile.focus();
	// 	oLog.log( null, 'Imagefile を入力してください.' );
	// 	oLog.open(3);
	// 	return false;
	// }
	if ( child_type == '' ){
		childrenForm.child_type[0].focus();
		oLog.log( null, 'Type を入力してください.' );
		oLog.open(3);
		return false;
	}
	if ( child_grade == '' ){
		childrenForm.child_grade[0].focus();
		oLog.log( null, 'Grade を入力してください.' );
		oLog.open(3);
		return false;
	}

	return true;

}

function addChildrenHelper(){
	var kana	   		= childrenForm.kana.value;
	var child_name 		= childrenForm.child_name.value;
	var remark	 		= childrenForm.remark.value;
	var imagefile		= childrenForm.imagefile.value;
	var child_type		= childrenForm.child_type.value;
	var child_grade		= childrenForm.child_grade.value;
	var range_id		= getCurrentRangeId();

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
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						
						var result = JSON.parse( xmlhttp.responseText );
						console.log( result );
						switch ( result.status ){
							case 'SUCCESS':
								// workplaceChildren();
								oLog.log( null, '登録しました.' );
								oLog.open(5);
								//	登録画面を消去
								var p	= document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST');
								while ( p.firstChild){
									p.removeChild( p.firstChild );
								}
							
								break;
							case 'FAILED':
								oLog.log( null, '登録に失敗しました.' );
								oLog.open(5);
								break;
							}						


					} else{
						console.log( null, 'checkAcc_id:' + xmlhttp.status );
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/childadd", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'kana=' + kana + '&child_name=' + child_name + '&child_type=' + child_type + '&child_grade=' + child_grade + '&remark=' + remark + '&imagefile=' + imagefile + '&range_id=' + range_id );


}

function cancelAddChildren(){
	var p	= document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST');
	var chdform = p.getElementsByClassName('add_children');
	if ( chdform.length > 0 )
		chdform[0].parentNode.removeChild( chdform[0] );
}
	


function wp_editChildren(){

	// セレクトしているチルドレンを検索
	var lists = document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST').childNodes;
	var c = null;
	for ( var i=0; i<lists.length; i++ ){
		if ( lists[i].hasAttribute('selected')){
			c = lists[i];
			break;
		}
	}
	if ( c == null ) return;

	var container = null;
	container = c.getElementsByClassName( 'container' )[0];

	container.style.display	= 'inline';
	if ( container.getElementsByClassName('childrenEdit').length > 0 ) return;
	container.addEventListener('click',function(e){e.stopPropagation();}, false);

	var m = document.getElementById( 'WORKPLACE_CHILDREN_MAIN');
	// m.scrollTop = c.offsetTop - 80;

	// var coa = null;
	// if ( document.getElementById('WORKPLACE_CHILDREN_MAIN').getElementsByClassName('childrenOptionArea').length == 0 ){
	// 	var o = document.createElement('DIV');
	// 	o.classList.add('childrenOptionArea');
	// 	o.setAttribute('child_id', c.getAttribute('child_id'));
	// 	o.style.position	= 'absolute';
	// 	o.style.top			= ( c.offsetTop + c.offsetHeight + 0 ) + 'px';
	// 	o.style.left		= ( c.offsetLeft ) + 'px'; //'-2px';
	// 	o.style.textAlign	= 'left';
	// 	coa = document.getElementById('WORKPLACE_CHILDREN_MAIN').appendChild( o );	

	// 	coa.addEventListener('click',function(e){e.stopPropagation();}, false);
	// } else {
	// 	coa = document.getElementById('WORKPLACE_CHILDREN_MAIN').getElementsByClassName('childrenOptionArea')[0];
	// }


	var o = document.createElement('DIV');
	o.classList.add('childrenEdit');
	// o.style.top			= ( c.offsetHeight + 0 ) + 'px';
	// o.style.left		= '-2px';
	o.style.textAlign	= 'left';
	var p = container.appendChild( o );

	var child_id 	= c.getAttribute( 'child_id' );
	var kana		= c.getAttribute( 'kana' );
	var child_name	= c.getAttribute( 'child_name' );
	var remark		= c.getAttribute( 'remark' );
	var child_type	= c.getAttribute( 'child_type' );
	var child_grade	= c.getAttribute( 'child_grade' );
	var imagefile	= c.getAttribute( 'imagefile' );

	p.innerHTML = makeChildrenEditTag( child_id, kana, child_name, remark, child_type, child_grade, imagefile );
	p.getElementsByClassName('appendix')[0].style.display	= 'inline';

	p.getElementsByClassName('operation')[0].addEventListener(
		'click',
		function ( e ){
			var x = e.target;
			while ( true ){
				if ( x == this ) return;
				if ( x.hasAttribute('cmd')) break;
				x = x.parentNode;
			}
			var chd = x;
			while ( true ){
				if ( chd.hasAttribute( 'child_id' )) break;
				chd = chd.parentNode;
			}
			switch ( x.getAttribute('cmd') ){
				case 'commit':
					console.log( 'commit:' + chd.getAttribute('child_id') );
					if ( !confirmChildren('UPDATE') ) return;
					if ( x.innerText == 'Ok?'){
						x.innerText = '';
						updateChild();
						chd.setAttribute( 'kana', 			childrenForm.kana.value );
						chd.setAttribute( 'child_name', 	childrenForm.child_name.value );
						chd.setAttribute( 'remark', 		childrenForm.remark.value );
						chd.setAttribute( 'child_type', 	childrenForm.child_type.value );
						chd.setAttribute( 'child_grade',	childrenForm.child_grade.value );
						chd.setAttribute( 'imagefile', 		childrenForm.imagefile.value );
						chd.getElementsByClassName('child_kana')[0].innerHTML =
							childrenForm.kana.value;
						// console.log('kana:' + childrenForm.kana.value);
						chd.getElementsByClassName('child_header')[0].innerHTML =
							childrenForm.child_name.value  + '&nbsp;&nbsp;' + 
							childrenForm.child_grade.value + childrenForm.child_type.value +
							'<span style="color:' + arChildGradeColor[ childrenForm.child_grade.value ] + ';">●</span>';

					} else {
						x.innerText = 'Ok?';
					}
					break;
				case 'cancel':
					console.log( 'cancel:' + chd.getAttribute('child_id') );
					chd.classList.remove('height360');
					chd.getElementsByClassName('container')[0].innerHTML = '';
					chd.getElementsByClassName('container')[0].display = 'none';

					break;
			}
		}
	);

}

//
//	チャイルド更新
//
function updateChild(){
	var child_id		= childrenForm.child_id.value;
	var kana	   		= childrenForm.kana.value;
	var child_name 		= childrenForm.child_name.value;
	var remark	 		= childrenForm.remark.value;
	var imagefile		= childrenForm.imagefile.value;
	var child_type		= childrenForm.child_type.value;
	var child_grade		= childrenForm.child_grade.value;
	// var range_id		= getCurrentRangeId();

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
					// p.innerText = 'access...'
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );
					if ( xmlhttp.status == 200 ){
						var result = JSON.parse( xmlhttp.responseText );
						console.log( xmlhttp.responseText );
						oLog.log( null, '更新しました. update child:' + result.message)
						oLog.open(2);
					}
				break;
			}
		}, false );

	console.log( 'child update: ' + child_id +',' + child_name);

	xmlhttp.open("POST", "/accounts/childupdate", true );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'child_id=' + child_id + '&child_name=' + child_name + '&kana=' + kana + '&remark=' + remark + '&child_grade=' + child_grade + '&child_type=' + child_type + '&imagefile=' + imagefile );

}


function wp_deleteChildren( c ){
	var o = c;
	while ( true ){
		if ( o.classList.contains('WP_PALLETE_CHILD')) break;
		o = o.parentNode;
	}
	var child_id = o.getAttribute('child_id');

	o.parentNode.removeChild( o );
	console.log( 'delete childid:' + child_id );

	wp_deleteChildrenHelper( child_id );

}

function wp_deleteChildrenHelper( child_id ){

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.addEventListener('readystatechange', 
		function (e){
			switch ( xmlhttp.readyState){
				case 1://opened
					break;
				case 2://header received
					break;
				case 3://loading
					// list.innerHTML = 'access...'
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						var result = JSON.parse( xmlhttp.responseText );
						oLog.log( null, 'チャイルドを削除しました.' );
						oLog.open(3);
						flipChildrenToolBar();
												
					} else{
						console.log( null, 'deletechild:' + xmlhttp.status );
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/childdelete", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'child_id=' + child_id );

}


function showChildrenHistory(){

	// 選択しているチャイルドを検索
	var lists = document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST').childNodes;	
	var c = null;
	for ( var i=0; i<lists.length; i++ ){
		if ( lists[i].hasAttribute('selected')){
			c = lists[i];
			break;
		}
	}
	if ( c == null ) return;

	var container = null;
	container = c.getElementsByClassName( 'container' )[0];

	container.style.display	= 'inline';
	container.innerHTML		= '';
	// if ( coa.getElementsByClassName('childrenHistory').length > 0 ) return;


	var o = document.createElement('DIV');
	o.classList.add('childrenHistory');
	var p = container.appendChild( o );
	var child_id = c.getAttribute('child_id');
	showChildrenHistoryHelper( p, child_id );

}
function showChildrenHistoryHelper( p, child_id ){
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
							var day 		= new Date(res.day);
							var checkout	= new Date(res.checkout);
							var estimate 	= res.estimate;
							var remark		= res.remark;
							var ymd = day.getFullYear() + '/' + (day.getMonth()+1) + '/' + day.getDate();
							var o = document.createElement('DIV');
							o.style.clear	= 'both';
							o.style.width	= '100%';
							o.style.height	= '16px';
							o.style.padding	= '4px 0px';
							r = '';
							r += '<div class="day_data" >';
								if ( checkout != null )
									r += '<img width="10px" src="./images/checked-symbol.png" />';
								r += ymd;
							r += '</div>';
							r += '<div class="estimate_data" >' + estimate.substr(0,5) + '</div>';
							r += '<div class="remark_data" >'   + remark + '</div>';
							o.innerHTML = r;
							p.appendChild( o );
							console.log( 'remark:' + remark );
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
//	チャイルドファインダ
//
function finder(){

	var range_id = null;
	range_id = getCurrentRangeId();

	if (range_id == null ){
		oLog.log( null, 'レンジを指定してください.');
		oLog.open(3);
		return;
	}


	// var keyword = document.getElementById('WP_KEYWORD').value;
	var keyword = document.getElementById('WP_QUERY_ID').value;
	finderHelper( keyword, range_id );
	document.body.focus();	// タブレットでのキーボードを消去する
}
function finderHelper( keyword, range_id ){

	var ctb = document.getElementById('CHILDREN_TOOLBAR');
	if ( ctb != null ){
		ctb.parentNode.removeChild( ctb );
	}

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
							var n_result	= result[i].n_result;

							var c = document.createElement('DIV');
							c.setAttribute("child_id",    child_id );
							c.setAttribute("id",          "c_1");
							c.classList.add( "WP_PALLETE_CHILD" );
							c.classList.add('unselected');
							c.setAttribute('kana',        kana );
							c.setAttribute('child_name',  child_name );
							c.setAttribute('child_type',  child_type );
							c.setAttribute('child_grade', child_grade );
							c.setAttribute('imagefile',   imagefile );
							c.setAttribute('remark',      remark );
							// c.style.position	= 'relative';
							c.style.top			= ( Math.floor( Math.random() * 2000 ) - 1000 ) + 'px';
							c.style.left		= ( Math.floor( Math.random() * 2000 ) - 1000 ) + 'px';

							var cc = list.appendChild( c );
							var cc_width = cc.offsetWidth;


							r = '';
							r += '<div profeel="yes" style="width:' + cc_width + 'px;height:80px;overflow:hidden;" >';
								if ( imagefile != ''){
									r += '<div style="float:left;width:30px;height:30px;color:dimgrey;font-size:8px;margin-top:18px;margin-left:10px;padding:4px;overflow:hidden;border-radius:50%;background-image:url(./images/children/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
										r += '&nbsp;';
									r += '</div>';
								} else{
									r += '<div style="float:left;width:30px;height:30px;color:black;font-size:8px;opacity:0.3;margin-top:18px;margin-left:10px;padding:4px;overflow:hidden;border-radius:50%;background-image:url(./images/user-2.png);background-size:30px;background-position:center center;background-repeat:no-repeat;" >';
										r += '&nbsp';
									r += '</div>';
								}
								r += '<div style="float:left;width:auto;height:80px;text-align:left;padding-left:12px;" >';
									r += '<div class="child_kana"   style="padding-top:12px;font-size:10px;font-weight:bold;" >' + kana + '</div>';
									r += '<div class="child_header" style="" >';
										r += child_name + '&nbsp;&nbsp;' + child_grade + child_type;
										r += '<span style="color:' + arChildGradeColor[ child_grade ] + ';">●</span>';
									r += '</div>';
									r += '<div style="padding:1px;" >id:' + child_id + '</div>';
								r += '</div>';
								r += '<div class="vh-center" style="float:right;width:42px;height:100%;padding-right:8px;font-size:14px;" >';
									r += '<div style="width:30px;height:23px;padding-top:7px;color:white;background-color:limegreen;" >+' + n_result + '</div>';
								r += '</div>';
							r += '</div>';

							r += '<div class="container" style="height:0px;background-color:white;display:none;overflow:visible;" ></div>';

							cc.innerHTML = r;
							
						}

						// bottom padding footer
						var c = document.createElement('DIV');
						c.classList.add( "WP_PALLETE_CHILD" );
						c.style.position			= 'relative';
						c.style.top					= '-1000px';
						c.style.color				= 'red';
						c.style.backgroundColor		= 'white';
						c.style.fontSize 			= '12px';
						c.style.border				= 'none';
						c.style.backgroundImage		= 'url(./images/restriction.png)';
						c.style.backgroundSize		= '14px';
						c.style.backgroundRepeat 	= 'no-repeat';
						c.style.backgroundPosition	= 'top 140px  center';
						c.style.display				= 'flex';
						c.style.justifyContent		= 'center';

						c.style.pointerEvents = 'none';
						c.style.height = ( list.parentNode.offsetHeight - 20 ) + 'px';
						if ( xmlhttp.status == 200 ){
							var r = '';
							r += '<div                 style="width:40px;height:32px;padding-top:8px;color:white;background-color:limegreen;font-size:20px;" >';
							r += '+' + result.length;
							r += '</div>';
							r += '<div class="N_CHILDREN" style="width:40px;height:32px;padding-top:8px;color:white;background-color:lightpink;font-size:20px;" >';
							r += '';
							r += '</div>';
							c.innerHTML = r;
						}

						var cc = list.appendChild( c );

						finderHelperStatis( cc.getElementsByClassName('N_CHILDREN')[0], range_id );

						setTimeout(() => {
							var children = document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST').childNodes;
							for ( var i=0; i<children.length; i++ ){
								children[i].style.top = '0px';
								children[i].style.left = '0px';
							}
						}, 50 );
				

					} else{
						console.log( null, 'finder:' + xmlhttp.status );
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/childfind", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		if ( keyword == '*' ) keyword = '%';
		xmlhttp.send( 'keyword=' + keyword + '&range_id=' + range_id );


}

function makeChildrenEditTag( child_id, kana, child_name, remark, child_type, child_grade, imagefile ){

	var r = '';
	r += '<div class="appendix" style="float:left;width:calc(100% - 6px);display:none;" >';
		r += '<form id="childrenForm"  name="childrenForm" onsubmit="return false;" >';
		r += '<div style="width:97%;height:auto;padding:1px;text-align:left;" >';
			r += '<div style="width:100%;height:;padding:4px 0px 4px 0px;" >';
				r += 'Kana:<br/>';
				r += '<input type="text" name="kana"  style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;" autocomplete="off" value="' + kana        + '" />';
			r += '</div>';
			r += '<div style="width:100%;height:;padding:4px 0px 4px 0px;" >';
				r += 'Name:<br/>';
				r += '<input type="text" name="child_name" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;" autocomplete="off" value="' + child_name  + '" />';
			r += '</div>';
			r += '<div style="clear:both;width:100%;padding:4px 0px 4px 0px;" >';
				r += 'Remark:<br/>';
				r += '<textarea name="remark" style="width:90%;height:40px;border:1px solid lightgrey;border-radius:4px;padding:4px;" autocomplete="off" >' + remark + '</textarea>';
			r += '</div>';
			r += '<div style="width:100%;height:;padding:4px 0px 4px 0px;" >';
				r += 'Imagefile:<br/>';
				r += '<input type="text" name="imagefile" autocomplete="off" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;" value="' + imagefile + '" />';
			r += '</div>';

			r += '<div  style="clear:both;width:100%;height:auto;text-align:left;padding:4px 0px 4px 0px;" >';
				switch ( child_type){
					case 'A':
						var a = ' checked ';
						var b = ' ';
						break;
					case 'B':
						var a = '  ';
						var b = ' checked ';
						break;
				}
				r += '<div>Type:</div>';
				r += '<div style="width:72px;height:22px;padding:2px;text-align:center;background-color:#EDEDED;border-radius:4px;display:flex;" >';
					r += '<input type="radio" id="child_type_a" name="child_type" value="A" ' + a + '/>';
					r += '<label for="child_type_a"  style="display:block;float:left;width:30px;height:14px;font-size:10px;padding:5px 4px 1px 5px;" >A</label>';
					r += '&nbsp;'
					r += '<input type="radio" id="child_type_b" name="child_type" value="B" ' + b + '/>';
					r += '<label for="child_type_b"  style="display:block;float:left;width:30px;height:14px;font-size:10px;padding:5px 4px 1px 5px;" >B</label>';
				r += '</div>';

			r += '</div>';

			r += '<div  style="clear:both;height:auto;text-align:left;padding:4px 0px 4px 0px;" >';

				var grades = [ ' ', ' ', ' ', ' ', ' ', ' ' ];
				grades[ child_grade - 1 ] = ' checked ';
				r += '<div>Grade:</div>';
				r += '<div style="width:90%;height:22px;padding:2px;background-color:#EDEDED;border-radius:4px;display:flex;" >';
					for ( var g=0; g<grades.length; g++ ){
						r += '<input type="radio" id="child_grade_' + child_id + '_' + g + '" name="child_grade" ' + grades[g] + ' value="' + (g+1) + '" />';
						r += '<label for="child_grade_' + child_id + '_' + g + '"  style="display:block;float:left;width:30px;height:14px;padding:5px 4px 1px 5px;" >' + ( g+1 ) + '</label>';
					}
				r += '</div>';

			r += '</div>';

			r += '<div style="clear:both;width:100%;" >';
				if ( child_id != null ){
					r += '<input type="hidden" name="child_id" value="' + child_id + '" />';
				}
			r += '</div>';
		r += '</div>';

		r += '<div class="operation" style="padding:20px 1px 1px 1px;width:100%;" >';
			r += '<button type="button" class="workplace_commit_button" cmd="commit" ></button>';
			r += '<button type="button" class="workplace_cancel_button" cmd="cancel" ></button>';
		r += '</div>';

		r += '</form>';
	r += '</div>';

	return r;

}
function finderHelperStatis( p, range_id ){

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
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						
						var result = JSON.parse( xmlhttp.responseText );
						
						p.innerHTML = '+' + result[0].n_children;

					} else{
						console.log( null, 'finder:' + xmlhttp.status );
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/childstatis", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'range_id=' + range_id );
	
}

function childrenRollup( p ){
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
					p.innerHTML = 'access';
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						
						var results = JSON.parse( xmlhttp.responseText );
						p.innerHTML = childrenRollupHelper( results );
					} else{
						console.log( null, 'childrenRollup:' + xmlhttp.status );
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/childrollup", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( );

}

function childrenRollupHelper( results ){
	var r = '';

	var grades = [0,0,0,0,0,0];

	r += '<div style="font-weight:bold;" >Children Rollup</div>';
	for ( var i=0; i<results.length; i++ ){
		var o = results[i];
		var range_id    = ( o.range_id    == null )?'&nbsp;':o.range_id;
		var cnt			= o.cnt;
		var child_grade = ( o.child_grade == null )?'&nbsp;':o.child_grade;
		var child_type  = ( o.child_type  == null )?'&nbsp;':o.child_type;
		var summary 	= ( o.range_id == null || o.child_type == null || o.child_grade == null)?
			'1px solid lightgrey':'1px solid white'; 

		r += '<div style="clear:both;width:100%;height:20px;border-bottom:' + summary + ';" >';
			r += '<div style="float:left;width:60px;height:auto;" >' 		+ range_id    + '</div>';
			r += '<div style="float:left;width:20px;height:auto;" >' 		+ child_grade + '</div>';
			r += '<div style="float:left;width:20px;height:auto;" >' 		+ child_type  + '</div>';
			r += '<div style="float:left;width:60px;height:auto;text-align:right;" >' + cnt  + '</div>';
			switch ( child_grade ){
				case '&nbsp;':
					r += '<div style="float:left;width:' + ( cnt * 2 ) + 'px;height:auto;background-color:orange;" >&nbsp;</div>';
					break;
				default:
					r += '<div style="float:left;width:' + ( cnt * 2 ) + 'px;height:auto;background-color:' + arChildGradeColor[ child_grade ] + ';" >&nbsp;</div>';
					break;
			}
			if ( range_id != '&nbsp;' && child_grade != '&nbsp;' && child_type == '&nbsp;')
				grades[ child_grade - 1 ] += cnt;

		r += '</div>';

		
	}
	r += '<div style="clear:both;width:100%;height:20px;border:1px solid lightgrey;" >';
		for ( var i=0; i<grades.length; i++ ){
			r += '<div style="float:left;width:' + ( grades[i] * 2 ) + 'px;height:auto;background-color:' + arChildGradeColor[ i+1 ] + ';" >&nbsp;</div>';
		}
	r += '</div>';
	console.log(grades );
	return r;
}


function whiteboardRollup( p ){
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
					p.innerHTML = 'access';
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						
						var results = JSON.parse( xmlhttp.responseText );
						p.innerHTML = whiteboardRollupHelper( results );
					} else{
						console.log( null, 'whiteboardRollup:' + xmlhttp.status );
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/whiteboardlistall", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( );

}

function whiteboardRollupHelper( results ){
	var r = '';

	r += '<div style="font-weight:bold;" >Whiteboard Rollup</div>';
	r += '<div style="width:100%;height:100%;" >';
	for ( var i=0; i<results.length; i++ ){
		var o = results[i];
		var day = new Date( o.day );
		var day2 = day.getFullYear() + '/' + ( day.getMonth() + 1 ) + '/' + day.getDate();
		var c_children = ( o.c_children );
		var margin		= 100 - ( c_children * 2 );
		r += '<div style="float:left;width:24px;height:100%;margin:1px;" >';
			r += '<div style="width:100%;height:' + ( c_children * 2 ) + 'px;margin-top:' + ( margin ) + 'px;background-color:orange;" >&nbsp;</div>';			
			r += '<div style="writing-mode:vertical-lr;" >';
				r += day2 + '(' + c_children + ')';
			r += '</div>';
		r += '</div>';
		console.log( c_children , margin );
	}
	r += '</div>';
	return r;

}

//
//		アカウント
//
function workplaceImagefile(){
	workplace_id = 'IMAGEFILE';

	var wpat			= document.getElementById('WORKPLACE_ADMIN_TOOLS');
	var imagefile		= document.getElementById('WORKPLACE_IMAGEFILE');
	var lists			= document.getElementById('WORKPLACE_IMAGEFILE_MAIN_LIST');

	// wpat.style.visibility	= 'hidden';

	var w = document.getElementById('BOTTOM_OVERLAY').offsetWidth;
	var bf= document.getElementById('BOTTOM_FRAME');
	imagefile.style.top		= '0px';

	//	HEADER
	var wph_range 	= document.getElementById('WPH_RANGE');
	var wph_add	 	= document.getElementById('WPH_ADD');
	var wph_query 	= document.getElementById('WPH_QUERY');
	wph_range.style.visibility		= 'visible';
	wph_add.style.visibility		= 'visible';
	wph_query.style.visibility		= 'visible';

	//	TAB
	// var option		= document.getElementById('MONTH12');
	// option.style.visibility		= 'visible';

	resizeWorkplace();

	if ( lists.innerText == '' )
		findObject();
	
}

function workplaceImagefileHelper(){

	//	if close TOOLBAR
	var itb = document.getElementById('IMAGEFILE_TOOLBAR');
	if ( itb != null ){
		itb.parentNode.removeChild( itb );
	}
	
	// var keyword = document.getElementById( 'WP_IMAGEFILE_ID' ).value;
	var keyword = document.getElementById( 'WP_QUERY_ID' ).value;
	if ( keyword == '' )
		keyword = '%';

	var list = document.getElementById('WORKPLACE_IMAGEFILE_MAIN_LIST');
	
	iconMgrHelper( list, keyword );
}

function addImagefile(){
	var p = document.getElementById('WORKPLACE_IMAGEFILE_MAIN_LIST');
	p.innerHTML = '';

	var o = document.createElement('DIV');
	o.style.width	= '100%';
	o.style.height	= '48px';
	o.style.backgroundColor	= 'white';

	var r = '';
	r += '<div style="padding:4px;margin:2px;" >';
	r += 'FILE:';
	r += '<form method="post" id="fileForm" name="fileForm" onsubmit="return false;"  >';
	r += '<input type="file" id="imagefile" name="imagefile" ';
	r += 'style="pointer-events: all;height:100%;font-size:10px;opacity:1;"/>';
	r += '</form>';
	r += '</div>';

	o.innerHTML = r;
	p.appendChild( o );

	document.getElementById('imagefile').addEventListener(
		'change', fileUpload, false );


}

// function iconMgr(){
// 	var wat = document.getElementById('WORKPLACE_ADMIN_TOOLS');
// 	var wai = document.getElementById('WORKPLACE_ADMIN_ICONS');
// 	if ( wai.offsetLeft < 0 ){
// 		wai.style.left	= wat.offsetWidth + 'px';
// 		iconMgrHelper( wai.getElementsByClassName('list')[0] );

// 	} else {
// 		wai.style.left	= '';

// 	}
// }

function iconMgrHelper( p, keyword ){
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
					p.innerHTML = 'access';
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						p.innerHTML = '';
						// var o = document.createElement('DIV');
						// o.style.width		= '100%';
						// o.style.height		= '100%';
						// o.style.display		= 'flex';
						// o.style.flexWrap	= 'wrap';
						// var pp = p.appendChild( o );
						
						var results = JSON.parse( xmlhttp.responseText );
						for ( var i=0; i<results.length; i++ ){
							var imagefile_id	= results[i].imagefile_id;
							var filename		= results[i].filename;
							var o = document.createElement('DIV');
							o.classList.add( 'imagefile' );
							o.classList.add( 'unselectedImage' );
							o.setAttribute('imagefile_id', imagefile_id );
							o.setAttribute('order', filename );
							// o.style.top					= ( Math.floor( Math.random() * 2000 ) - 1000 ) + 'px';
							// o.style.left				= ( Math.floor( Math.random() * 2000 ) - 1000 ) + 'px';
							o.style.backgroundImage		= 'url(/accounts/imagefile?imagefile_id=' + imagefile_id + ')';

							o.innerText					= filename;
							p.appendChild( o );

						}

						// bottom padding footer
						var c = document.createElement('DIV');
						c.classList.add( "imagefile" );
						c.style.color				= 'red';
						c.style.fontSize 			= '12px';
						c.style.border				= 'none';
						c.style.color				= 'dimgray';
						c.style.backgroundColor		= 'white';
						c.style.backgroundImage		= 'url(./images/restriction.png)';
						c.style.backgroundSize		= '14px';
						c.style.backgroundRepeat 	= 'no-repeat';
						c.style.backgroundPosition	= 'top 140px  center';
						c.style.display				= 'flex';
						c.style.justifyContent		= 'center';

						c.style.pointerEvents 		= 'none';
						c.style.width				= '100%';
						c.style.height = ( p.parentNode.offsetHeight - 20 ) + 'px';
						// c.innerHTML = 'bottom margin';
						var r = '';
						r += '<div style="width:40px;height:32px;padding-top:8px;font-size:16px;color:white;background-color:limegreen;" >';
						r += '+' + results.length;
						r += '</div>';
						c.innerHTML = r;
						var cc = p.appendChild( c );
					
						// setTimeout(() => {
						// 	var images = document.getElementById('WORKPLACE_IMAGEFILE_MAIN_LIST').childNodes;
						// 	for ( var i=0; i<images.length; i++ ){
						// 		images[i].style.top 	= '0px';
						// 		images[i].style.left	= '0px';
						// 	}
						// }, 50 );

					} else{
						console.log( null, 'iconMgrHelper:' + xmlhttp.status );
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/imagefilelist", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'keyword=' + keyword );

}

function selectImagefile( e ){
	var o = e.target;
	while( true ){
		if ( o.tagName == 'BODY' ) return;
		if ( o == this ){
			// エリア外をアクセスしたらリセット
			for ( var i=0; i<this.childNodes.length; i++ ){
				var c = this.childNodes[i];
				if ( c.hasAttribute('selected')){
					c.removeAttribute('selected');
					c.classList.remove('selectedImage');
					c.style.animationName	 		= 'scale-in-out';
					c.style.animationDuration		= '0.3s';
					c.style.animationIterationCount = 1;
				}	
			}
			return;
		} 
		if ( o.classList.contains('imagefile')) break;
		o = o.parentNode;
	}

	//	すでに他のイメージファイルをセレクトしていたらリセット
	for ( var i=0; i<this.childNodes.length; i++ ){
		var c = this.childNodes[i];
		if ( c == o ) continue;
		if ( c.hasAttribute('selected')){
			c.removeAttribute('selected');
			c.classList.remove('selectedImage');
			c.style.animationName	 		= 'scale-in-out';
			c.style.animationDuration		= '0.3s';
			c.style.animationIterationCount = 1;
		}	
	}

	//	対象イメージファイルがセレクトされているかどうかで処理を振り分け
	if ( o.hasAttribute('selected')){
		//	セレクト解除処理
		o.removeAttribute('selected');
		o.classList.remove('selectedImage');
	} else{
		//	セレクト処理
		console.log( 'imagefile_id:' + o.getAttribute('imagefile_id'));
		o.setAttribute('selected', 'true');
		o.classList.add('selectedImage');
		flipImagefileToolBar();
	}
	//	対象のアニメーション処理
	o.style.animationName	 		= 'scale-in-out';
	o.style.animationDuration		= '0.3s';
	o.style.animationIterationCount = 1;
}
function selectImagefileMotionStart( e ){
	console.log('motion start');
}
function selectImagefileMotionEnd( e ){
	console.log('motion end');
	var c = e.target;
	c.style.animationName	= '';

	while ( true ){
		if ( c.tagName == 'BODY' ) return;
		if ( c.classList.contains('imagefile')) break;
		c = c.parentNode;
	}

	if ( !c.hasAttribute( 'selected' )){
		flipImagefileToolBar();			// toolbar close
	}
}

function flipImagefileToolBar(){

	var itb = document.getElementById('IMAGEFILE_TOOLBAR');
	if ( itb != null ){
		itb.parentNode.removeChild( itb );
		return;
	}
	var p = document.getElementById('WORKPLACE_IMAGEFILE');
	var o = document.createElement('DIV');
	o.id					= 'IMAGEFILE_TOOLBAR';
	o.style.position		= 'absolute';
	o.style.top				= 'calc(100% - 76px - 48px)';
	o.style.left			= '0px';
	o.style.width			= '100%';
	o.style.height			= '64px';
	// o.style.paddingBottom	= '12px';
	o.style.margin			= '0 auto';
	o.style.zIndex			= 65000;

	var r = '';
	r += '<div style="margin:0 auto;width:140px;height:40px;padding:4px;background-color:#EDEDED;border:1px solid lightgrey;border-radius:8px;" >';
		r += '<button type="button" class="workplace_delete_button"   cmd="delete"    ></button>';
	r += '</div>';
	o.innerHTML = r;
	var tb = p.appendChild( o );
	tb.style.animationName			= 'scale-in-out';
	tb.style.animationDuration		= '0.3s';
	tb.style.animationIterationCount = 1;

	tb.addEventListener('click',
	function(e){
		e.stopPropagation();
		var o = e.target;
		var cmd = '';
		while(true){
			// if ( o == this ) return;
			if ( o.tagName == 'BODY' ) return;
			if ( o.hasAttribute('cmd')){
				cmd = o.getAttribute('cmd');
				break;
			}
		}
		// var acc_id = this.parentNode.getAttribute('acc_id');
		var imagefiles = document.getElementById('WORKPLACE_IMAGEFILE_MAIN_LIST').childNodes;
		var imagefile_id = null;
		var c = null;
		for ( var i=0; i<imagefiles.length; i++ ){
			if ( imagefiles[i].hasAttribute('selected')){
				imagefile_id 	= imagefiles[i].getAttribute('imagefile_id');
				c				= imagefiles[i];
				break;
			}
		}
		if ( imagefile_id == null ) return;

		switch ( cmd ){
			case 'delete':
				if ( o.innerText == 'Ok?' ){
					wp_deleteImagefile( c );
					o.style.width = '';
					o.innerText = '';
					break;
				}
				o.style.width = '100px';
				o.innerText = 'Ok?';
				break;
		}
		console.log( cmd + ' imagefile_id:' + imagefile_id );
	}, false );

}

function wp_deleteImagefile( p ){
	p.parentNode.removeChild( p );
	var imagefile_id = p.getAttribute('imagefile_id');

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.addEventListener('readystatechange', 
		function (e){
			switch ( xmlhttp.readyState){
				case 1://opened
					break;
				case 2://header received
					break;
				case 3://loading
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						
						var result = JSON.parse( xmlhttp.responseText );
						console.log( result );
						switch ( result.status ){
							case 'SUCCESS':
								oLog.log(null, 'イメージファイルを削除しました.' );
								oLog.open(3);
								break;
							case 'FAILED':
								oLog.log(null, 'イメージファイルの削除に失敗しました.' );
								oLog.open(3);
								break;
						}						

					} else{
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/imagefiledelete", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'imagefile_id=' + imagefile_id );


}
