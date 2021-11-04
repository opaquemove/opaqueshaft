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
		'click', birdsEyeView );
		
    document.getElementById('WP_KEYWORD').addEventListener(
		'keyup',
		function( e ){
			if ( e.key == 'Enter' )
            finder();
		}
	);
    document.getElementById('WP_ACCOUNT_ID').addEventListener(
		'keyup',
		function( e ){
			if ( e.key == 'Enter' )
            workplaceAccountHelper();
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


	document.getElementById('WORKPLACE_HDR').addEventListener(
		'click', function(e){
			switch( e.target.id ){
				case 'WP_WHITEBOARD':
					workplaceWhiteboard();
					break;
				case 'WP_CHILDREN':
					workplaceChildren();
					break;
				case 'WP_RANGE':
					workplaceRange();
					break;
				case 'WP_ACCOUNT':
					workplaceAccount();
					break;
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
	

	document.getElementById('WP_TEST').addEventListener(
		'click', rotateMenu );
	document.getElementById('WP_TEST').addEventListener(
		'transitionstart', openingRotation );
	document.getElementById('WP_TEST').addEventListener(
		'transitionend', closingRotation );
		
	document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST').addEventListener(
		'click', selectChildren );
	document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST').addEventListener(
		'transitionend', selectChildrenTransitionEnd );

	document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST').addEventListener(
		'click', selectAccount );
	document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST').addEventListener(
		'transitionend', selectAccountTransitionEnd );
			
	document.getElementById('WORKPLACE_RANGE_MAIN_LIST').addEventListener(
		'click', selectRange );
	document.getElementById('WORKPLACE_RANGE_MAIN_LIST').addEventListener(
		'transitionend', selectRangeTransitionEnd );
	

	makeRangeList( 'TAB_CURRENT2', 'V' );
	document.getElementById( 'TAB_CURRENT2' ).addEventListener(
		'click', selectCurrentRangeId, false );

	// document.getElementById('BOTTOM_FRAME').addEventListener(
	// 	'resize', resizeWorkplace );
	// var bf = document.getElementById('BOTTOM_FRAME');
	// var observer = new MutationObserver( records => {
	// 	resizeWorkplace();
	// });
	// observer.observe( bf, { attributes: true });

}

function birdsEyeView(){

	var bf = document.getElementById('BOTTOM_FRAME');
	bf.style.transition	= 'all 0.5s ease-in-out';
	bf.style.transform	= 'scale(0.7,0.7)';
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
	}
}

function signinMotion( e ){
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
		o.style.border			= '1px solid lightgrey';
		o.style.margin			= '4px';
		o.style.padding			= '4px 2px 0px 14px';
		o.style.overflow		= 'hidden';
		// o.style.opacity			= 0;
		o.style.transition		= 'all 0.5s ease-in-out';
		var r = '';
		r += '<form name="sign_form" onsubmit="return false;" >';
			// r += '<div style="font-size:10px;padding-top:2px;" >ID:</div>';
			r += '<div style="padding:2px 0px;" >';
				r += '<input style="font-size:12px;width:120px;outline:none;border:none;border-radius:14px;padding:2px 2px 2px 10px;background-color:#EDEDED;background-image:url(./images/user-2.png);background-size:10px;background-repeat:no-repeat;background-position:right 4px center;" type="text" id="acc_id" name="id" tabindex=1 autocomplete="off" placeholder="ID" />';
			r += '</div>';
			// r += '<div style="font-size:10px;padding-top:2px;" >Password:</div>';
			r += '<div style="padding:4px 0px;" >';
				r += '<input style="font-size:12px;width:120px;outline:none;border:none;border-radius:14px;padding:2px 2px 2px 10px;background-color:#EDEDED;background-image:url(./images/key.png);background-size:8px;background-repeat:no-repeat;background-position:right 4px center;" type="password" name="pwd" tabindex=2 autocomplete="off" placeholder="Password" />';
			r += '</div>';

			r += '<div class="operation" style="padding-top:4px;" >';
				r += '<button tabindex="3" type="button" class="workplace_commit_button" ';
				r += ' style="width:130px;height:24px;"  cmd="commit"  >sign in</button>';
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
	if ( e.target != this ) return;
	this.classList.toggle( 'signoutMotion' );
}
//transition start
function openingSignoutMotion( e ){
	var opt = this.getElementsByClassName('option');
	if ( opt.length == 0 ){		//	opening transition
		this.style.zIndex = 1;
		var o = document.createElement('DIV');
		o.classList.add('option');
		// o.classList.add('signMotionOff');
		o.style.position		='absolute';
		o.style.top				= '-5px';
		o.style.left			= ( this.offsetWidth + -4 ) + 'px';
		o.style.height			= '100%';
		o.style.width			= ( this.offsetWidth - 16 ) + 'px';
		o.style.height			= 'calc( 100% - 4px )';
		o.style.textAlign		= 'left';
		o.style.fontWeight		= 'normal';
		o.style.color			= 'gray';
		o.style.backgroundColor	= 'white';
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
	var opt = this.getElementsByClassName('option');
	if ( opt.length > 0 && ! this.classList.contains('signoutMotion')) {
		opt[0].parentNode.removeChild( opt[0] );
	}
}



function selectCurrentRangeId( e ){
	e.stopPropagation();
	var o = e.target;
	while( true ){
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
	}

	if ( getCurrentRangeId() == null ) return;
	switch ( workplace_id ){
		case 'WHITEBOARD':
			makeCalendar( getCurrentRangeId() );
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
	var ranges = document.getElementById('TAB_CURRENT2').childNodes;
	var range_id = null;
	for ( var i=0; i<ranges.length; i++ ){
		if ( ranges[i].hasAttribute('selected')){
			range_id = ranges[i].getAttribute('range_id');
			break;
		}
	}
	return range_id;
}


//	Left90 transsition start/end invoke
function rotateMenu(e){
	e.stopPropagation();
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
//		ワークプレイス（統合メニュー）を表示
//
function showWorkPlace(){

	closeModalDialog();

	//	OPAQUESHAFT_TITLE表示制御
	var opaqueshaft_title = document.getElementById('OPAQUESHAFT_TITLE');
	opaqueshaft_title.style.visibility = ( openWhiteboardFlg )? 'visible' : 'hidden';

	var bo		= document.getElementById('BOTTOM_OVERLAY');
	bo.style.visibility		= 'visible';

	var wp_test			= document.getElementById('WP_TEST');
	var wp_empty		= document.getElementById('WP_EMPTY');
	var wp_content		= document.getElementById('WP_CONTENT');
	var wp_signin		= document.getElementById('WP_SIGNIN');
	var wp_signout		= document.getElementById('WP_SIGNOUT');
	var wp_whiteboard	= document.getElementById('WP_WHITEBOARD');
	var wp_children		= document.getElementById('WP_CHILDREN');
	var wp_range		= document.getElementById('WP_RANGE');
	var wp_account		= document.getElementById('WP_ACCOUNT');

	if ( wp_signin.classList.contains('signinMotion'))
		wp_signin.classList.remove('signinMotion');
	if ( wp_signout.classList.contains('signoutMotion'))
		wp_signout.classList.remove('signoutMotion');

	if ( checkSign() ){
		// signed
		wp_signin.setAttribute( 'disabled', 'true' );
		wp_whiteboard.removeAttribute( 'disabled' );
		wp_children.removeAttribute( 'disabled' );
		wp_range.removeAttribute( 'disabled' );
		wp_account.removeAttribute( 'disabled' );
		wp_signout.removeAttribute( 'disabled' );
		wp_test.style.display			= 'inline';
		wp_empty.style.display			= 'inline';
		wp_content.style.display		= 'inline';
		wp_signin.style.visibility		= 'hidden';
		wp_signout.style.visibility		= 'visible';
		wp_whiteboard.style.visibility	= 'visible';
		wp_children.style.visibility	= 'visible';
		wp_range.style.visibility		= 'visible';
		wp_account.style.visibility		= 'visible';

		var opt = wp_signin.getElementsByClassName('option');
		if ( opt.length > 0 ){
			opt[0].parentNode.removeChild( opt[0] );
		}
	} else {
		// not sign
		wp_signin.removeAttribute( 'disabled' );
		wp_signout.setAttribute( 'disabled', 'true' );
		wp_whiteboard.setAttribute( 'disabled', 'true' );
		wp_children.setAttribute( 'disabled', 'true' );
		wp_range.setAttribute( 'disabled', 'true' );
		wp_account.setAttribute( 'disabled', 'true' );
		wp_test.style.display			= 'none';
		wp_empty.style.display			= 'none';
		wp_content.style.display		= 'none';
		wp_signin.style.visibility		= 'visible';
		wp_signout.style.visibility		= 'hidden';
		wp_whiteboard.style.visibility	= 'hidden';
		wp_children.style.visibility	= 'hidden';
		wp_range.style.visibility		= 'hidden';
		wp_account.style.visibility		= 'hidden';
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
	var range	= document.getElementById('WORKPLACE_RANGE');
	var account	= document.getElementById('WORKPLACE_ACCOUNT');
	var signin	= document.getElementById('WP_SIGNIN');
	var signout	= document.getElementById('WP_SIGNOUT');

	if ( icon.style.height == '0px'){
		icon.style.height = icon.getAttribute('orgHeight');
		hdr.style.height = hdr.getAttribute('orgHeight');
	} else {
		icon.setAttribute('orgHeight', icon.style.height );
	}

	wb.style.height			= '0px';
	children.style.height	= '0px';
	range.style.height		= '0px';
	account.style.height	= '0px';

	//	TAB
	var tab = document.getElementById('TAB_OPAQUESHAFT');
	var current  = document.getElementById('TAB_CURRENT');
	var plus	 = document.getElementById('TAB_PLUS');
	var find	 = document.getElementById('TAB_FIND');
	var current2 = document.getElementById('TAB_CURRENT2');
	tab.style.visibility		= 'hidden';
	current.style.visibility	= 'hidden';
	plus.style.visibility		= 'hidden';
	find.style.visibility		= 'hidden';
	current2.style.visibility	= 'hidden';

	if (signin.classList.contains('signinMotion'))
		signin.classList.remove('signinMotion');
	if (signout.classList.contains('signoutMotion'))
		signout.classList.remove('signoutMotion');

}

//
//	ホワイトボードメニュー
//
function workplaceWhiteboard(){
	workplace_id = 'WHITEBOARD';

	guidedance_whiteboard_form.day.value = '';

	var icon	= document.getElementById('WORKPLACE_ICON');
	var hdr		= document.getElementById('WORKPLACE_HDR');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');
	var children= document.getElementById('WORKPLACE_CHILDREN');
	var wpwm	= document.getElementById('WORKPLACE_WHITEBOARD_MAIN');
	var list	= document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST');

	//	TAB
	var tab = document.getElementById('TAB_OPAQUESHAFT');
	var current 	= document.getElementById('TAB_CURRENT');
	var plus		= document.getElementById('TAB_PLUS');
	var find		= document.getElementById('TAB_FIND');
	var current2 	= document.getElementById('TAB_CURRENT2');
	tab.style.visibility		= 'visible';
	current.style.visibility	= 'visible';
	current.innerText			= 'whiteboard';
	plus.style.visibility		= 'visible';
	find.style.visibility		= 'visible';
	current2.style.visibility	= 'visible';
	
	if ( icon.style.height == '0px'){
		icon.style.height	= icon.getAttribute('orgHeight');
		hdr.style.height	= hdr.getAttribute('orgHeight');
	} else {
		icon.setAttribute('orgHeight', icon.style.height );
		icon.style.height	= '0px';
		hdr.style.height	= '0px';
	}

	resizeWorkplace();
	// children.style.height = '0px';
	if ( !list.hasChildNodes() ) list.innerHTML = '';

	//	レンジリスト作成
	// makeRangeList( 'RANGE_LIST', 'H' );
	addWorkplaceWhiteboard();

}

//
//	ワークプレイスホワイトボード画面生成
//
function addWorkplaceWhiteboard(){
	var p = document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST');

	if ( p.hasChildNodes() ){
	// 	makeRangeList( 'RANGE_LIST', 'H' );
		return;
	}

	var r = '';
	// r += '<div id="CALENDAR_TOOLBAR" >';
	// 	r += '<button type="button" id="BTN_OPENWHITEBOARD" class="next_button"  ';
	// 		r += ' onclick="createWhiteboard()" >';
	// 		r += 'next';
	// 	r += '</button>';
	// r += '</div>';
	r += '<div id="CALENDAR_LIST"       style="float:;position:relative;width:calc(100% - 6px);height: 58px;background-color:#EDEDED;border:1px solid #EDEDED;border-radius:3px;padding:2px;overflow:scroll;" ></div>';
	r += '<div id="CALENDAR_DETAIL_HDR" style="font-size:12px;font-weight:bold;color:gray;" >DETAIL:</div>';
	r += '<div id="CALENDAR_DETAIL"     style="float:;position:relative;width:calc(100% - 6px);height:calc(100% - 150px);background-color:#EDEDED;border:1px solid #EDEDED;border-radius:3px;padding:2px;overflow:scroll;" ></div>';


	p.innerHTML = r;

	// var ct_height = document.getElementById('CALENDAR_TOOLBAR').offsetHeight;
	var cl_height = document.getElementById('CALENDAR_LIST').offsetHeight + 6;
	var cdh_height = document.getElementById('CALENDAR_DETAIL_HDR').offsetHeight + 4;
	var offset = cl_height + cdh_height;
	var calen_detail = document.getElementById('CALENDAR_DETAIL');
	calen_detail.style.height = 'calc(100% - ' + offset + 'px)';


	//	レンジリスト作成
	// makeRangeList( 'RANGE_LIST', 'H' );

	// document.getElementById('RANGE_LIST').addEventListener('click',
	// 	function(e) {
	// 		var o = e.target;
	// 		if ( o == document.getElementById('RANGE_LIST')) return;
	// 		while ( o.parentNode != document.getElementById('RANGE_LIST') ){
	// 			o = o.parentNode;
	// 		}
	// 		for ( var i=0; i<this.childNodes.length; i++ ){
	// 			var c = this.childNodes[i];
	// 			if ( c.hasAttribute('selected') ){
	// 				c.removeAttribute( 'selected' );
	// 				c.style.color			= '';
	// 				c.style.backgroundColor = '';
	// 			}
	// 		}
	// 		o.style.color			= 'white';
	// 		o.style.backgroundColor = 'royalblue';
	// 		o.setAttribute( 'selected', 'true' );
	// 		var range_id = o.getAttribute('range_id' );
	// 		makeCalendar( range_id );
	// 		// makeWhiteboardList( range_id );
	// 		guidedance_whiteboard_form.day.value = '';

	// 	}, false );

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
				c.classList.remove('selected');
				// c.style.color			= '';
				// c.style.backgroundColor = '';
			}
		}

		o.classList.add('selected');
		// o.style.color			= 'white';
		// o.style.backgroundColor = 'royalblue';
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
					if ( o.classList.contains('calendar_detail_invisible')){
						o.classList.remove('calendar_detail_invisible');
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
			if ( c.classList.contains('calendar_detail_invisible')){
				c.classList.remove('calendar_detail_invisible');
			}
		}

		if ( !o.hasAttribute( 'selected' ) ) o.setAttribute( 'selected', 'true' );
			else o.removeAttribute( 'selected' );
		o.style.animationName			= 'scale-in-out';
    	o.style.animationDuration		= '0.3s';
    	o.style.animationIterationCount = 1;

		//property area hidden
		var cdp = p.getElementsByClassName('calendar_detail_property');
		cdp[0].style.display = 'none';


		var day = o.getAttribute('day');
		guidedance_whiteboard_form.day.value = day;
		// var p = document.getElementById('CALENDAR_DETAIL');
	}, false );
	document.getElementById('CALENDAR_DETAIL').addEventListener('animationend',
	function (e){
		switch ( e.target.style.animationName ){
			case 'scale-in-out':
				e.target.style.animationName = '';	// old shift-frame
				e.target.style.animationDuration		= '0.3s';
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
					r += '<button type="button" class="workplace_edit_button"  >edit</button>';
					o.innerHTML				= r;
					e.target.appendChild( o ).getElementsByClassName('workplace_edit_button')[0].addEventListener('click', editWhiteboard, false);
				} else {
					e.target.classList.remove('right56');
					var ar = e.target.getElementsByClassName('edit');
					if ( ar.length > 0 )
					e.target.removeChild( ar[0] );
				}
				break;
			case 'shift-frame':
				e.target.style.animationName = '';
				e.target.style.animationDuration		= '0.6';
				e.target.style.animationIterationCount = 1;
				// if ( e.target.hasAttribute('selected')){
				// 	e.target.classList.add('right56');
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
				// 	e.target.classList.remove('right56');
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

function editWhiteboard(e){
	e.stopPropagation();

	var p = document.getElementById('CALENDAR_DETAIL');
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
	document.getElementById('CALENDAR_DETAIL').scrollTop = 0;

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
					if ( result.length > 0 ){		//	レコードが存在すれば
			
						for ( var i=0; i<result.length; i++ ){
							var c = result[i];
							var o = document.createElement('DIV');
							o.classList.add('calendar_list_children');
							o.classList.add('unselected');
							var r = '';
							r += '<div style="float:left;width:32px;height:100%;" class="vh-center" >';
								if ( c.imagefile != '' && c.imagefile != null ){
									r += '<div style="width:28px;height:28px;overflow:hidden;border-radius:45%;background-image:url(./images/children/' + c.imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
									r += '</div>';
								}else {
									r += '<div style="float:left;clear:both;width:28px;height:28px;overflow:hidden;border-radius:45%;" >';
									r += '</div>';
								}
							r += '</div>';
							r += '<div style="float:left;width:auto;height:100%;font-weight:bold;" >';
								r += '<div>' + c.child_name + '(' + c.kana + ')' + c.child_type + c.child_grade	+ '</div>';
								r += '<div>'   + c.estimate + ' / ' + c.checkout  	+ '</div>';
							r += '</div>';
	
							o.innerHTML = r;
							p.appendChild( o );
						}

					} else{							// レコードが存在しなければ
						// p.innerHTML 		= '';
						// p_absent.innerHTML	= '';
					}


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

function makeCalendar( range_id ){
	console.log( 'range_id:' + range_id );
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
		c.setAttribute( 'sotd', sotd.getFullYear() + '/' + ( '00' + ( sotd.getMonth() + 1 ) ).slice(-2) + '/' + sotd.getDate() );
		c.setAttribute( 'eotd', eotd.getFullYear() + '/' + ( '00' + ( eotd.getMonth() + 1 ) ).slice(-2) + '/' + eotd.getDate() );
		c.classList.add('unselected');
		c.style.width			= '48px';
		c.style.height			= '48px';
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

	var ym = new Date( range_id + '/4/1' );
	var sotd = new Date( ym.getFullYear() + '/' + ( ym.getMonth() + 1 ) + '/' + ym.getDate() );
	var eotd = new Date( sotd.getFullYear() + '/' + ( sotd.getMonth() + 1 ) + '/' + sotd.getDate() );
	eotd.setFullYear( eotd.getFullYear() + 1 );
	eotd.setDate( eotd.getDate() - 1 );
	console.log( 'sotd:' + getYYYYMMDD( sotd ) + ' eotd:' + getYYYYMMDD(eotd) );

	makeCalendarHelper( p, getYYYYMMDD(sotd), getYYYYMMDD(eotd) );

}

function makeCalendarHelper( p, sotd, eotd ){

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
					console.log( 'makeCalendarHelper:' + xmlhttp.status );
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/countresultbymonth", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'sotd=' + sotd + '&eotd=' + eotd );
	} catch ( e ) {
		oLog.log( null, 'makeCalendarHelper : ' + e );
		oLog.open( 3 );
		// alert( e );
	}

}

function getYYYYMMDD( d ){
	return d.getFullYear() + '/' + ( d.getMonth() + 1 ) + '/' + d.getDate();
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
					// var cnt = 0;
					while ( true){
						var o = document.createElement('DIV');
						o.classList.add('calendar_detail_visible');
						o.classList.add( 'day_' + day.getDate() );
						o.setAttribute( 'day', day.getFullYear() + '/' + ( day.getMonth() + 1 ) + '/' + day.getDate() );
						// o.style.top		= ( 57 * cnt )+ 'px';
						// o.style.left	= '0px';
						var r = '';
						r += '<div style="float:left;width:48px;height:48px;background-color:white;padding:2px;border:1px solid lightgrey;border-radius:3px;" >';
							// r += '<div style="padding:2px;">&nbsp;</div>';
							r += '<div style="font-size:16px;width:100%;text-align:center;font-weight:bold;" >'  + day.getDate() + '</div>';
							r += '<div style="font-size:10px;width:100%;text-align:center;" >'  + weekname[ day.getDay() ] + '</div>';
						r += '</div>';
						r += '<div class="detail" style="float:left;font-size:12px;width:calc(100% - 62px);height:48px;background-color:white;padding:2px;border:1px solid lightgrey;border-radius:3px;margin-left:2px;" >';
							r += '';
						r += '</div>';
						o.innerHTML = r;
						p.appendChild( o );
						day.setDate( day.getDate() + 1 );
						if ( m != day.getMonth() ) break;
						// cnt++;

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
							var description		= result[i].description;
							var detail = dd[0].getElementsByClassName( 'detail' )[0];
							detail.innerHTML = 'Description:' + description + '<br/>Children:' + c_children + '<br/>checkouts:' + c_checkout;
						}
					}

					//
					//	calendar detail property area
					//
					var o = document.createElement('DIV');
					o.classList.add('calendar_detail_property');
					var r = '';
					r += '<div  style="width:calc(100% - 2px);height:calc(100% - 60px);background-color:transparent;padding:1px;border:0px solid #EDEDED;border-radius:3px;overflow:scroll;" >';
						r += '';
					r += '</div>';
					o.innerHTML = r;
					p.appendChild( o ).addEventListener( 'click',
						function ( e ){
							e.stopPropagation();
						}
					);

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
	var tab 		= document.getElementById('TAB_OPAQUESHAFT');
	var current 	= document.getElementById('TAB_CURRENT');
	var plus 	 	= document.getElementById('TAB_PLUS');
	var find		= document.getElementById('TAB_FIND');
	var current2	= document.getElementById('TAB_CURRENT2');
	tab.style.visibility 		= 'visible';
	current.style.visibility 	= 'visible';
	current.innerText 			= 'children';
	plus.style.visibility		= 'visible';
	find.style.visibility		= 'visible';
	current2.style.visibility	= 'visible';

	if ( icon.style.height == '0px'){
		icon.style.height		= icon.getAttribute('orgHeight');
		hdr.style.height		= hdr.getAttribute('orgHeight');
	} else {
		icon.setAttribute('orgHeight', icon.style.height );
		icon.style.height		= '0px';
		hdr.style.height		= '0px';
	}

	resizeWorkplace();
	// wb.style.height = '0px';

	document.getElementById('WP_KEYWORD').value = '';
	list.innerHTML = '';

}

//
//		レンジ
//
function workplaceRange(){
	workplace_id = 'RANGE';
	var icon	= document.getElementById('WORKPLACE_ICON');
	var hdr		= document.getElementById('WORKPLACE_HDR');
	// var list	= document.getElementById('WORKPLACE_RANGE_MAIN_LIST');

	//	TAB
	var tab 		= document.getElementById('TAB_OPAQUESHAFT');
	var current 	= document.getElementById('TAB_CURRENT');
	var plus		= document.getElementById('TAB_PLUS');
	var find		= document.getElementById('TAB_FIND');
	var current2	= document.getElementById('TAB_CURRENT2');
	tab.style.visibility 		= 'visible';
	current.style.visibility 	= 'visible';
	current.innerText 			= 'range';
	plus.style.visibility		= 'visible';
	find.style.visibility		= 'visible';
	current2.style.visibility	= 'visible';

	if ( icon.style.height == '0px'){
		icon.style.height		= icon.getAttribute('orgHeight');
		hdr.style.height		= hdr.getAttribute('orgHeight');
	} else {
		icon.setAttribute('orgHeight', icon.style.height );
		icon.style.height		= '0px';
		hdr.style.height		= '0px';
	}

	resizeWorkplace();

	workplaceRangeHelper( );

	// list.addEventListener('click', selectRange, false );

}

function selectRange(e){
	var o = e.target;
	while( true ){
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
	var icon	= document.getElementById('WORKPLACE_ICON');
	var hdr		= document.getElementById('WORKPLACE_HDR');
	// var list	= document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST');

	//	TAB
	var tab 		= document.getElementById('TAB_OPAQUESHAFT');
	var current 	= document.getElementById('TAB_CURRENT');
	var plus		= document.getElementById('TAB_PLUS');
	var find		= document.getElementById('TAB_FIND');
	var current2	= document.getElementById('TAB_CURRENT2');
	tab.style.visibility 		= 'visible';
	current.style.visibility 	= 'visible';
	current.innerText 			= 'account';
	plus.style.visibility		= 'visible';
	find.style.visibility		= 'visible';
	current2.style.visibility	= 'visible';

	if ( icon.style.height == '0px'){
		icon.style.height		= icon.getAttribute('orgHeight');
		hdr.style.height		= hdr.getAttribute('orgHeight');
	} else {
		icon.setAttribute('orgHeight', icon.style.height );
		icon.style.height		= '0px';
		hdr.style.height		= '0px';
	}

	resizeWorkplace();
//	workplaceAccountHelper();

	// var list	= document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST');
	// list.addEventListener( 'click', selectAccount, false );

	
}

function selectAccount( e ){
	var o = e.target;
	while( true ){
		if ( o == this ){
			for ( var i=0; i<this.childNodes.length; i++ ){
				var c = this.childNodes[i];
				if ( c.hasAttribute('selected')){
					c.removeAttribute('selected');
					c.classList.remove('selected');
					c.classList.remove('left40');
					c.classList.remove('height360');
					wp_editAccount( c );
					// c.removeChild( c.getElementsByClassName('op')[0] );
				}	
			}
			return;
		} 
		if ( o.classList.contains('account')) break;
		o = o.parentNode;
	}

	for ( var i=0; i<this.childNodes.length; i++ ){
		var c = this.childNodes[i];
		if ( c == o ) continue;
		if ( c.hasAttribute('selected')){
			c.removeAttribute('selected');
			c.classList.remove('selected');
			c.classList.remove('left40');
			c.classList.remove('height360');
			wp_editAccount( c );
			// c.removeChild( c.getElementsByClassName('op')[0] );
		}	
	}

	if ( o.hasAttribute('selected')){
		o.removeAttribute('selected');
		o.classList.remove('selected');
		o.classList.remove('left40');
		o.classList.remove('height360');
		wp_editAccount( o );
		// o.removeChild( o.getElementsByClassName('op')[0] );
	} else{
		o.setAttribute('selected', 'true');
		o.classList.add('selected');
		o.classList.add('left40');			// LEFT40 Moving
		var op = document.createElement('DIV');
		op.classList.add('op');
		op.classList.add('delete_object');
		op.style.position			= 'absolute';
		op.style.top				= '0px';
		op.style.left				= ( o.offsetWidth + 2 ) + 'px';
		op.style.width				= '30px';
		op.style.height				= '38px';
		op.style.backgroundColor	= '';
		op.style.zIndex				= -1;
		op.style.transition			= 'width 0.5s ease-in-out';
		var r = '';
		r += '<button type="button" class="workplace_edit_button_small"   cmd="edit" ></button>';
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
			}
			var acc_id = this.parentNode.getAttribute('acc_id');
			switch ( cmd ){
				case 'edit':
					this.parentNode.classList.toggle('height360');
					wp_editAccount( this.parentNode );
					break;
				case 'delete':
					if ( o.innerText == 'Ok?' ){
						wp_deleteAccount( this.parentNode );
						break;
					}
					o.style.width = '100px';
					o.innerText = 'Ok?';
					break;
			}
			console.log( cmd + ' acc_id:' + acc_id );
			// deleteRange( this.parentNode, acc_id );
		}, false );
	}

}
function selectAccountTransitionEnd( e ){
	var c = e.target;
	while ( true ){
		if ( c == this ) return;
		if ( c.classList.contains('account')) break;
		c = c.parentNode;
	}
	if ( !c.classList.contains( 'left40' )){
		c.removeAttribute('selected');
		var op = c.getElementsByClassName( 'op');
		if ( op.length > 0)
			op[0].parentNode.removeChild( op[0] );
	}

}


function workplaceAccountHelper(){

	var p	= document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST');

	var keyword = document.getElementById( 'WP_ACCOUNT_ID' ).value;
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
						var range_id = result[i].range_id;
						var imagefile= result[i].imagefile;
						if ( imagefile == null || imagefile == '')
							imagefile = '';

						var o = document.createElement('DIV');
						o.classList.add( 'account' );
						o.classList.add( 'unselected' );
						o.setAttribute('acc_id', acc_id );
						o.style.textAlign = 'left';
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
							r += '<div style="padding:2px;font-weight:bold;font-size:18px;" >' + acc_name  + '</div>';
							r += '<div style="padding:2px;" >' + priv      + '</div>';
						r += '</div>';

						r += '<div class="appendix" style="float:none;width:auto;height:auto;padding-bottom:20px;display:none;" >';
							r += '<form onsubmit="return false;" >';
							// r += '<div>Profeel</div>';
							r += '<input type="hidden" name="acc_id" value="' + acc_id + '" />';
							r += '<div style="padding-top:4px;" >acc_name:</div>';
							r += '<div style="padding-top:4px;" >';
								r += '<input type="text" name="acc_name" maxlength="64" autocomplete="off" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;"  value="' + acc_name + '" />';
							r += '</div>';
							r += '<div style="padding-top:4px;" >range_id:</div>';
							r += '<div style="padding-top:4px;" >';
								r += '<input type="text" name="range_id" maxlength="64" autocomplete="off" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;"  value="' + range_id + '" />';
							r += '</div>';
					
							var privs = [ 'admin', 'editor', 'guest' ];
							r += '<div style="padding-top:4px;" >priveledge:</div>';
							r += '<div style="width:90%;height:30px;padding:3px;background-color:#EDEDED;border-radius:4px;display:flex;" >';
							for ( var j=0; j<privs.length; j++ ){
								var checked = ( priv == privs[j] ) ? ' checked ' : '';
								r += '<input type="radio" id="acc_priv_' + acc_id + '_' + j + '" name="acc_priv"  value="' + privs[j] + '"  ' + checked + '  />';
								r += '<label for="acc_priv_' + acc_id + '_' + j + '"  style="display:block;float:left;width:30px;height:21px;padding:5px 4px 1px 5px;" >' + privs[j] + '</label>';
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

						o.innerHTML		= r;
						var acc = p.appendChild( o )
						acc.getElementsByClassName('operation')[0].addEventListener(
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
									if ( acc.getAttribute( 'acc_id' )) break;
									acc = acc.parentNode;
								}
								switch ( x.getAttribute('cmd') ){
									case 'commit':
										if ( x.innerText == 'commit?' ){
											acc.classList.toggle('height360');
											wp_editAccount( acc );
											updateAccount( acc.getElementsByTagName( 'FORM')[0] );
											x.innerText = ' ';
											break;
										}
										x.innerText = 'commit?';
										break;
									case 'cancel':
										// if ( x.innerText == 'cancel?' ){
											acc.classList.toggle('height360');
											wp_editAccount( acc );
											// x.innerText = ' ';
											break;
										// }
										// x.innerText = 'cancel?';
										break;
								}
							}
						);

					}

					// bottom padding
					var c = document.createElement('DIV');
					c.classList.add( "account" );
					c.style.color				= 'red';
					c.style.fontSize 			= '12px';
					c.style.border				= 'none';
					c.style.backgroundImage		= 'url(./images/restriction.png)';
					c.style.backgroundSize		= '14px';
					c.style.backgroundRepeat 	= 'no-repeat';
					c.style.backgroundPosition	= 'top 40px  center';
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

function addAccount(){
	var p	= document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST');
	while ( p.firstChild ){
		p.removeChild( p.firstChild );
	}
	if ( p.getElementsByClassName('add_account').length > 0 ) return;
	var o = document.createElement('DIV');
	o.classList.add('add_account');
	o.style.textAlign	= 'left';
	var r = '';
	r += '<form name="accountForm" onsubmit="return false;" >';
		r += '<div>acc_id:</div>';
		r += '<div style="padding-top:4px;" >';
			r += '<input type="text" name="acc_id" maxlength="64" autocomplete="off" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;"  value="" />';
		r += '</div>';
		r += '<div style="padding-top:4px;" >acc_name:</div>';
		r += '<div style="padding-top:4px;" >';
			r += '<input type="text" name="acc_name" maxlength="64" autocomplete="off" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;"  value="" />';
		r += '</div>';
		var privs = [ 'admin', 'editor', 'guest' ];
		r += '<div style="padding-top:4px;" >priveledge:</div>';
		r += '<div style="width:90%;height:30px;padding:3px;background-color:#EDEDED;border-radius:4px;" >';
			for ( var j=0; j<privs.length; j++ ){
				r += '<input type="radio" id="acc_priv_' + j + '" name="acc_priv"  value="' + privs[j] + '"   />';
				r += '<label for="acc_priv_' + j + '"  style="display:block;float:left;width:30px;height:21px;padding:5px 4px 1px 5px;" >' + privs[j] + '</label>';
			}
		r += '</div>';
		r += '<div style="padding-top:4px;" >image file:</div>';
		r += '<div style="padding-top:4px;" >';
			r += '<input type="text" name="acc_imagefile" maxlength="64" autocomplete="off" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;"  value="" />';
		r += '</div>';

		r += '<div style="margin:0 auto;width:100%;text-align:center;padding-top:40px;">';
			r += '<button type="button" class="workplace_commit_button" cmd="commit" ></button>';
			r += '<button type="button" class="workplace_cancel_button" cmd="cancel" ></button>';
		r += '</div>';

	r += '</form>';
	o.innerHTML = r;

	p.prepend( o );
	var accept = p.getElementsByClassName('workplace_commit_button');
	accept[0].addEventListener('click',
		function(e){
			e.stopPropagation();
			if ( !acceptAddAccount() ) return;
			if ( this.innerText == 'Ok?'){
				acceptAddAccountHelper();
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

function acceptAddAccount(){
	var acc_id   		= accountForm.acc_id.value;
	var acc_name 		= accountForm.acc_name.value;
	var acc_priv 		= accountForm.acc_priv.value;
	var acc_imagefile	= accountForm.acc_imagefile.value;

	if ( acc_id == '' ){
		accountForm.acc_id.focus();
		oLog.log( null, 'acc_id を入力してください.' );
		oLog.open(3);
		return false;
	}
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

function acceptAddAccountHelper(){
	var acc_id   		= accountForm.acc_id.value;
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
								registAccount( acc_id, acc_name, acc_priv, acc_imagefile );
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

function registAccount( acc_id, acc_name, acc_priv, acc_imagefile ){
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
		xmlhttp.send( 'acc_id=' + acc_id + '&acc_name=' + acc_name + '&acc_priv=' + acc_priv + '&acc_imagefile=' + acc_imagefile );

}

function cancelAddAccount(){
	var p	= document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST');
	var accform = p.getElementsByClassName('add_account');
	if ( accform.length > 0 )
		accform[0].parentNode.removeChild( accform[0] );
}

function wp_editAccount( p ){
	console.log( 'wp_editAccount');
	var flg = p.classList.contains('height360');
	var apdxs = p.getElementsByClassName('appendix');
	for ( var i=0; i<apdxs.length; i++ ){
		apdxs[i].style.display = ( flg ) ? 'inline' : 'none';
		apdxs[i].getElementsByClassName( 'workplace_commit_button' )[0].innerText = '';
		apdxs[i].getElementsByClassName( 'workplace_cancel_button' )[0].innerText = '';
		if ( flg ) 	apdxs[i].addEventListener('click', function(e){ e.stopPropagation();}, false );
			else	apdxs[i].removeEventListener('click', function(e){ e.stopPropagation();}, false );
	}
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

function updateAccount( frm ){
	var acc_id 			= frm.acc_id.value;
	var acc_name		= frm.acc_name.value;
	var acc_priv		= frm.acc_priv.value;
	var acc_imagefile	= frm.acc_imagefile.value;
	var range_id		= frm.range_id.value;
	console.log( 'acc_id:'     + acc_id );
	console.log( 'acc_name:'   + acc_name );
	console.log( 'priveledge:' + acc_priv );
	console.log( 'imagefile:'  + acc_imagefile );
	console.log( 'range_id:'   + range_id );


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
		xmlhttp.send( 'acc_id=' + acc_id + '&acc_name=' + acc_name + '&acc_priv=' + acc_priv + '&acc_imagefile=' + acc_imagefile + '&range_id=' + range_id );

}

//
//	チルドレンをクリック
//
function selectChildren( e ){
	e.stopPropagation();
	var c = e.target;
	while ( true ){
		//	エリア外をクリックしたらリセットする.
		if ( c == this ){
			for ( var i=0; i<this.childNodes.length; i++ ){
				var o = this.childNodes[i];
				if ( o.classList.contains('right100')){
					o.classList.remove( 'right100');
				}
				if ( o.classList.contains('height320')){
					o.classList.remove( 'height320');
					var apdxs = o.getElementsByClassName('appendix');
					for ( var i=0; i<apdxs.length; i++ ){
						apdxs[i].style.display = 'none';
						apdxs[i].removeEventListener('click', function(e){ e.stopPropagation();}, false );
					}	
				}
			}
			return;
		}
		if ( c.classList.contains('WP_PALLETE_CHILD')) break;
		c = c.parentNode;
	}

	// 他のチャイルドのメニューを閉じる
	for ( var i=0; i<this.childNodes.length; i++ ){
		var o = this.childNodes[i];
		if ( c == o ) continue;
		if ( o.classList.contains('right100')){
			o.classList.remove( 'right100');
		}
		if ( o.classList.contains('height320')){
			o.classList.remove( 'height320');
			var apdxs = o.getElementsByClassName('appendix');
			for ( var i=0; i<apdxs.length; i++ ){
				apdxs[i].style.display = 'none';
				apdxs[i].removeEventListener('click', function(e){ e.stopPropagation();}, false );
			}
		}
		o.classList.toggle('hiding');
	}

	// c.style.position = 'absolute';
	// c.style.top	= c.offsetTop + 'px';
	// c.style.left	= c.offsetLeft + 'px';

	// メニューを開く
	c.classList.toggle( 'right100' );
	if ( ! c.classList.contains( 'right100' )){
		if ( c.classList.contains( 'height320') ){
			c.classList.remove('height320');
			var apdxs = c.getElementsByClassName('appendix');
			for ( var i=0; i<apdxs.length; i++ ){
				apdxs[i].style.display = 'none';
				apdxs[i].removeEventListener('click', function(e){ e.stopPropagation();}, false );
			}

		}
		return;
	} 
	
	console.log( 'top:' + c.offsetTop );
	c.setAttribute( 'selected', 'yes' );
	var o = document.createElement('DIV');
	o.classList.add('opChild');
	o.style.position 	= 'absolute';
	o.style.top			= c.offsetTop + 'px';	//'2px';
	o.style.left		= '2px';
	// o.style.left		= '-50px';
	o.style.height		= ( c.offsetHeight * 2 ) + 'px';
	// o.style.zIndex		= 1000;
	// o.style.border		= '1px solid red';
	var r = '';
	r += '<button type="button" class="workplace_edit_button_small"     cmd="edit"    ></button>';
	r += '<button type="button" class="workplace_delete_button_small"   cmd="delete"  ></button>';
	r += '<button type="button" class="workplace_history_button_small"  cmd="history" ></button>';
	o.innerHTML = r;
	// c.appendChild( o ).addEventListener('click',
	document.getElementById('WORKPLACE_CHILDREN_MAIN' ).appendChild(o).addEventListener('click',
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
				case 'edit':
					wp_editChildren();
					break;
				case 'delete':
					// wp_deleteChildren( o );
					if ( o.innerText == 'Ok?' ){
						wp_deleteChildren( o );
						break;
					}
					o.style.width = '100px';
					o.innerText = 'Ok?';
					break;
				case 'history':
					console.log('history');
					break;
			}

		}, false );

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
	if ( !c.classList.contains( 'right100' )){
		c.removeAttribute('selected');
		// var op = c.getElementsByClassName( 'opChild');
		var op = document.getElementById('WORKPLACE_CHILDREN_MAIN').getElementsByClassName( 'opChild');
		if ( op.length > 0)
			op[0].parentNode.removeChild( op[0] );
	}

}

function addChildren(){
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
	var r = '';
	r += '<form name="childrenForm" onsubmit="return false;" >';
		r += '<div style="width:100%;height:auto;padding:0px;text-align:left;" >';
			r += '<div style="width:100%;height:50px;font-size:14px;color:white;background-color:royalblue;" >';
				r += '<div style="padding:4px;" >';
				r += 'add child';
				r += '</div>';
			r += '</div>';
			r += '<div style="width:100%;height:;padding:4px 0px 4px 0px;" >';
				r += 'Kana:<br/>';
				r += '<input type="text" name="kana" autocomplete="off" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;"  value="" />';
			r += '</div>';
			r += '<div style="width:100%;height:;padding:4px 0px 4px 0px;" >';
				r += 'Name:<br/>';
				r += '<input type="text" name="child_name" autocomplete="off" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;" value="" />';
			r += '</div>';
			r += '<div style="clear:both;width:100%;padding:4px 0px 4px 0px;" >';
				r += 'Remark:<br/>';
				r += '<textarea name="remark" autocomplete="off" style="width:90%;height:40px;border:1px solid lightgrey;border-radius:4px;padding:4px;" autocomplete="off" ></textarea>';
			r += '</div>';
			r += '<div style="width:100%;height:;padding:4px 0px 4px 0px;" >';
				r += 'Imagefile:<br/>';
				r += '<input type="text" name="imagefile" autocomplete="off" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;" value="" />';
			r += '</div>';
			r += '<div  style="clear:both;width:100%;height:auto;text-align:left;padding:4px 0px 4px 0px;" >';
			r += '<div>Type:</div>';
			r += '<div style="width:72px;height:22px;padding:2px;text-align:center;background-color:#EDEDED;border-radius:4px;display:flex;" >';
				r += '<input type="radio" id="child_type_a" name="child_type" value="A" />';
				r += '<label for="child_type_a"  style="display:block;float:left;width:30px;height:14px;font-size:10px;padding:5px 4px 1px 5px;" >A</label>';
				r += '&nbsp;'
				r += '<input type="radio" id="child_type_b" name="child_type" value="B" />';
				r += '<label for="child_type_b"  style="display:block;float:left;width:30px;height:14px;font-size:10px;padding:5px 4px 1px 5px;" >B</label>';
			r += '</div>';
			r += '<div  style="clear:both;height:auto;text-align:left;padding:4px 0px 4px 0px;" >';
				var grades = [ ' ', ' ', ' ', ' ', ' ', ' ' ];
				r += '<div>Grade:</div>';
				r += '<div style="width:90%;height:22px;padding:2px;background-color:#EDEDED;border-radius:4px;display:flex;" >';
					for ( var g=0; g<grades.length; g++ ){
						r += '<input type="radio" id="child_grade_' + g + '" name="child_grade" ' + grades[g] + ' value="' + (g+1) + '" />';
						r += '<label for="child_grade_' + g + '"  style="display:block;float:left;width:30px;height:14px;padding:5px 4px 1px 5px;" >' + ( g+1 ) + '</label>';
					}
				r += '</div>';
			r += '</div>';
			r += '<div class="operation" style="padding:20px 1px 1px 1px;width:100%;" >';
				r += '<button type="button" class="workplace_commit_button" cmd="commit" ></button>';
				r += '<button type="button" class="workplace_cancel_button" cmd="cancel" ></button>';
			r += '</div>';
	
		r += '</div>';

	r += '</form>';

	o.innerHTML = r;

	p.prepend( o );
	var accept = p.getElementsByClassName('workplace_commit_button');
	accept[0].addEventListener('click',
		function(e){
			e.stopPropagation();
			if ( !acceptAddChildren() ) return;
			if ( this.innerText == 'Ok?'){
				acceptAddChildrenHelper();
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

function acceptAddChildren(){
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

function acceptAddChildrenHelper(){
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
	var lists = document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST').childNodes;
	
	var c = null;
	for ( var i=0; i<lists.length; i++ ){
		if ( lists[i].hasAttribute('selected')){
			c = lists[i];
			break;
		}
	}
	if ( c == null ) return;
	// while ( true ){
	// 	if ( c.classList.contains('WP_PALLETE_CHILD')) break;
	// 	c = c.parentNode;
	// }
	var m = document.getElementById( 'WORKPLACE_CHILDREN_MAIN');
	// m.scrollTop = c.offsetTop - 80;

	c.classList.remove('left100');
	c.classList.toggle('height320');
	var flg = c.classList.contains('height320');
	var apdxs = c.getElementsByClassName('appendix');
	for ( var i=0; i<apdxs.length; i++ ){
		apdxs[i].style.display = ( flg )?'inline':'none';
		if ( flg ) 	apdxs[i].addEventListener('click', function(e){ e.stopPropagation();}, false );
			else	apdxs[i].removeEventListener('click', function(e){ e.stopPropagation();}, false );
	}


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

	var range		= document.getElementById('WORKPLACE_RANGE');
	var wprh		= document.getElementById('WORKPLACE_RANGE_HDR').offsetHeight;
	var wprm		= document.getElementById('WORKPLACE_RANGE_MAIN');
	var rlist		= document.getElementById('WORKPLACE_RANGE_MAIN_LIST');

	var account		= document.getElementById('WORKPLACE_ACCOUNT');
	var wpah		= document.getElementById('WORKPLACE_ACCOUNT_HDR').offsetHeight;
	var wpam		= document.getElementById('WORKPLACE_ACCOUNT_MAIN');
	var alist		= document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST');

	console.log( 'resizeWorkplace' );

	switch ( workplace_id ){
		case 'WHITEBOARD':
			workplace.style.height	= ( h - 0 ) + 'px';
			wpwm.style.height 		= ( h - wpwh ) + 'px';
			break;
		case 'CHILDREN':
			children.style.height 	= ( h - 0 ) + 'px';
			wpcm.style.height 		= ( h - wpch ) + 'px';	// offset 252
			break;
		case 'RANGE':
			range.style.height 		= ( h - 0 ) + 'px';
			wprm.style.height 		= ( h - wprh ) + 'px';	// offset 252
			break;
		case 'ACCOUNT':
			account.style.height 	= ( h - 0 ) + 'px';
			wpam.style.height 		= ( h - wpah ) + 'px';	// offset 252
			break;
		}

}

//
//	チャイルドファインダ
//
function finder(){

	var range_id = null;
	range_id = getCurrentRangeId();

	// var ranges = document.getElementById('RANGE_LIST2').childNodes;
	// for ( var i=0; i<ranges.length; i++ ){
	// 	if ( ranges[i].hasAttribute('selected')) {
	// 		range_id = ranges[i].getAttribute('range_id');
	// 		break;
	// 	}
	// }

	if (range_id == null ){
		oLog.log( null, 'レンジを指定してください.');
		oLog.open(3);
		return;
	}


    var wph = document.getElementById('WORKPLACE_HDR');
	wph.style.height = '0px';
	wph.style.padding = '0px';

	var keyword = document.getElementById('WP_KEYWORD').value;
	finderHelper( keyword, range_id );
	document.body.focus();	// タブレットでのキーボードを消去する
}
function finderHelper( keyword, range_id ){
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
							var c = document.createElement('DIV');
							c.setAttribute("child_id",    child_id );
							c.setAttribute("id",          "c_1");
							c.classList.add( "WP_PALLETE_CHILD" );
							c.setAttribute('kana',        kana );
							c.setAttribute('child_type',  child_type );
							c.setAttribute('child_grade', child_grade );
							c.style.position	= 'relative';
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
									r += '<div style="padding:1px;font-size:10px;font-weight:bold;" >' + kana + '</div>';
									r += '<div class="child_header" style="" >';
										r += child_name + '&nbsp;&nbsp;' + child_grade + child_type;
										r += '<span style="color:' + arChildGradeColor[ child_grade ] + ';">●</span>';
									r += '</div>';
									r += '<div style="padding:1px;" >id:' + child_id + '</div>';
								r += '</div>';
							r += '</div>';

							r += '<div class="appendix" style="float:left;width:calc(100% - 6px);display:none;" >';
								r += '<form id="child_prop_' + child_id + '"  name="child_prop_' + child_id + '" onsubmit="return false;" >';
								// r += '<div style="width:100%;padding:4px 0px 4px 0px;font-size:14px;font-weight:bold;" >Profeel:</div>';
								r += '<div style="width:97%;height:auto;padding:1px;text-align:left;" >';
									r += '<div style="width:100%;height:;padding:4px 0px 4px 0px;" >';
										r += 'Kana:<br/>';
										r += '<input type="text" name="kana"  style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;"  value="' + kana        + '" />';
									r += '</div>';
									r += '<div style="width:100%;height:;padding:4px 0px 4px 0px;" >';
										r += 'Name:<br/>';
										r += '<input type="text" name="child_name" style="width:90%;border:1px solid lightgrey;border-radius:4px;padding:4px;" value="' + child_name  + '" />';
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
											default:
												var a = '  ';
												var b = ' checked ';
												break;
										}
										r += '<div>Type:</div>';
										r += '<div style="width:72px;height:22px;padding:2px;text-align:center;background-color:#EDEDED;border-radius:4px;display:flex;" >';
											r += '<input type="radio" id="child_type_a_' + child_id + '" name="child_type" value="A" ' + a + '/>';
											r += '<label for="child_type_a_' + child_id + '"  style="display:block;float:left;width:30px;height:14px;font-size:10px;padding:5px 4px 1px 5px;" >A</label>';
											r += '&nbsp;'
											r += '<input type="radio" id="child_type_b_' + child_id + '" name="child_type" value="B" ' + b + '/>';
											r += '<label for="child_type_b_' + child_id + '"  style="display:block;float:left;width:30px;height:14px;font-size:10px;padding:5px 4px 1px 5px;" >B</label>';
										r += '</div>';

										// r += '<img width="14px" src="./images/minus-3.png" />';
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
										r += '<input type="hidden" name="child_id" value="' + child_id + '" />';
									r += '</div>';
								r += '</div>';

								r += '<div class="operation" style="padding:20px 1px 1px 1px;width:100%;" >';
									r += '<button type="button" class="workplace_commit_button" cmd="commit" ></button>';
									r += '<button type="button" class="workplace_cancel_button" cmd="cancel" ></button>';
								r += '</div>';

								r += '</form>';
							r += '</div>';

							cc.innerHTML = r;

							cc.getElementsByClassName('operation')[0].addEventListener(
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
											break;
										case 'cancel':
											console.log( 'cancel:' + chd.getAttribute('child_id') );
											list.dispatchEvent( new Event( 'click') );
											break;
									}
								}
							);
	
							
						}

						// bottom padding
						var c = document.createElement('DIV');
						c.classList.add( "WP_PALLETE_CHILD" );
						c.style.position		= 'relative';
						c.style.top				= '-1000px';
						c.style.color			= 'red';
						c.style.fontSize 		= '12px';
						c.style.border			= 'none';
						c.style.backgroundImage	= 'url(./images/restriction.png)';
						c.style.backgroundSize	= '14px';
						c.style.backgroundRepeat = 'no-repeat';
						c.style.backgroundPosition	= 'top 40px  center';
						c.style.display				= 'flex';
						c.style.justifyContent		= 'center';

						c.style.pointerEvents = 'none';
						c.style.height = ( list.parentNode.offsetHeight - 20 ) + 'px';
						if ( xmlhttp.status == 200 ){
							var r = '';
							r += '<div style="width:40px;height:32px;padding-top:8px;color:white;background-color:limegreen;font-size:20px;" >';
							r += '+' + result.length;
							r += '</div>';
							c.innerHTML = r;
						}

						var cc = list.appendChild( c );

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
