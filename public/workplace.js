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
	

	makeRangeList( 'TAB_CURRENT2', 'V' );
	document.getElementById( 'TAB_CURRENT2' ).addEventListener(
		'click', selectCurrentRangeId, false );

	document.getElementById('WORKPLACE_BIRDSEYEVIEW').addEventListener(
		'click', function( e ){
			var view = e.target;
			while ( true ){
				if ( this == view ) return;
				if ( view.hasAttribute('view')) break;
				view = view.parentNode;
			}
			
			switch( view.getAttribute('view')){
				case 'menu':
					// workplaceReset();
					birdsEyeView();
					break;
				case 'whiteboard':
					workplaceWhiteboard();
					break;
				case 'children':
					workplaceChildren();
					break;
				case 'range':
					workplaceRange();
					break;
				case 'account':
					workplaceAccount();
					break;	
				}

		}, false );
	
	// document.getElementById('BOTTOM_FRAME').addEventListener(
	// 	'resize', resizeWorkplace );
	// var bf = document.getElementById('BOTTOM_FRAME');
	// var observer = new MutationObserver( records => {
	// 	resizeWorkplace();
	// });
	// observer.observe( bf, { attributes: true });

}

function birdsEyeView(){

	var bf 		= document.getElementById('BOTTOM_FRAME');
	var menu 	= document.getElementById('WORKPLACE_MENU');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');
	var children= document.getElementById('WORKPLACE_CHILDREN');
	var range	= document.getElementById('WORKPLACE_RANGE');
	var account	= document.getElementById('WORKPLACE_ACCOUNT');
	console.log( 'transform:' + bf.style.transform);
	if ( bf.hasAttribute('birdseye')){
		bf.style.transition			= 'all 0.5s ease-in-out';
		bf.style.perspective		= 'none';
		menu.style.transform		= '';
		menu.style.visibility		= 'visible';
		wb.style.transform			= '';
		wb.style.visibility			= 'hidden';
		children.style.transform	= '';
		children.style.visibility	= 'hidden';
		range.style.transform		= '';
		range.style.visibility		= 'hidden';
		account.style.transform		= '';
		account.style.visibility	= 'hidden';
		bf.removeAttribute('birdseye');
	} else{
		bf.style.transition	= 'all 0.5s ease-in-out';
		bf.style.perspective		= '20000px';
		// bf.style.transform		= 'scale(0.7,0.7) translateX(-800px)';
		// perspective
		menu.style.transition		= 'all 0.5s ease-in-out';
		menu.style.transform		= 'perspective(400px) rotateX(-10deg) scale(0.8,0.8)';
		menu.style.visibility		= 'visible';

		wb.style.transition			= 'all 0.5s ease-in-out';
		wb.style.transform			= 'perspective(500px) translateY(-0px) rotateX(-14deg) scale(0.8,0.8)';
		wb.style.visibility			= 'visible';
		children.style.transition	= 'all 0.5s ease-in-out';
		children.style.transform	= 'perspective(600px) translateY(-0px) rotateX(-18deg) scale(0.8,0.8)';
		children.style.visibility	= 'visible';
		range.style.transition		= 'all 0.5s ease-in-out';
		range.style.transform		= 'perspective(700px) translateY(-0px) rotateX(-22deg) scale(0.8,0.8)';
		range.style.visibility		= 'visible';
		account.style.transition	= 'all 0.5s ease-in-out';
		account.style.transform		= 'perspective(800px) translateY(-00px) rotateX(-26deg) scale(0.8,0.8)';
		account.style.visibility	= 'visible';
		bf.setAttribute('birdseye','yes');
	}

	// bf.classList.toggle('transitionWorkplace');
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

	var bo = document.getElementById('BOTTOM_OVERLAY');
	var bf = document.getElementById('BOTTOM_FRAME');

	if ( checkSign() ){
		// signed
		bo.style.overflow	= 'scroll';
		bf.style.width		= '500%';
		bf.style.overflow	= 'auto';
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
		bo.style.overflow	= 'hidden';
		bf.style.width		= '100%';
		bf.style.overflow	= 'hidden';
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
	var menu	= document.getElementById('WORKPLACE_MENU');
	var icon	= document.getElementById('WORKPLACE_ICON');
	var hdr		= document.getElementById('WORKPLACE_HDR');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');
	var children= document.getElementById('WORKPLACE_CHILDREN');
	var range	= document.getElementById('WORKPLACE_RANGE');
	var account	= document.getElementById('WORKPLACE_ACCOUNT');
	var signin	= document.getElementById('WP_SIGNIN');
	var signout	= document.getElementById('WP_SIGNOUT');

	var w = document.getElementById('BOTTOM_OVERLAY').offsetWidth;
	var bf= document.getElementById('BOTTOM_FRAME');
	bf.style.transform	= 'translateX(0px)';


	if ( icon.style.height == '0px'){
		menu.style.display	= 'inline';
	} else {
		// icon.setAttribute('orgHeight', icon.style.height );
		menu.style.display	= 'none';
	}

	menu.style.display		= 'inline';
	// wb.style.height			= '0px';
	// children.style.height	= '0px';
	// range.style.height		= '0px';
	// account.style.height	= '0px';

	//	TAB
	var tab = document.getElementById('TAB_OPAQUESHAFT');
	var plus	 = document.getElementById('TAB_PLUS');
	var find	 = document.getElementById('TAB_FIND');
	var current2 = document.getElementById('TAB_CURRENT2');
	var option	 = document.getElementById('TAB_OPTION');
	tab.style.visibility		= 'hidden';
	plus.style.visibility		= 'hidden';
	find.style.visibility		= 'hidden';
	current2.style.visibility	= 'hidden';
	option.style.visibility		= 'hidden';

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

	var menu	= document.getElementById('WORKPLACE_MENU');
	var icon	= document.getElementById('WORKPLACE_ICON');
	var hdr		= document.getElementById('WORKPLACE_HDR');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');
	var children= document.getElementById('WORKPLACE_CHILDREN');
	var wpwm	= document.getElementById('WORKPLACE_WHITEBOARD_MAIN');
	var list	= document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST');

	var w = document.getElementById('BOTTOM_OVERLAY').offsetWidth;
	var bf= document.getElementById('BOTTOM_FRAME');
	bf.style.transform	= 'translateX(' + (-w) + 'px)';
	// bf.style.transform	= 'translateY(' + (-48) + 'px)';
	// wb.style.visibility	= 'visible';

	//	TAB
	var tab = document.getElementById('TAB_OPAQUESHAFT');
	// var current 	= document.getElementById('TAB_CURRENT');
	var plus		= document.getElementById('TAB_PLUS');
	var find		= document.getElementById('TAB_FIND');
	var current2 	= document.getElementById('TAB_CURRENT2');
	var option		= document.getElementById('TAB_OPTION');
	tab.style.visibility		= 'visible';
	plus.style.visibility		= 'visible';
	find.style.visibility		= 'visible';
	current2.style.visibility	= 'visible';
	option.style.visibility		= 'visible';
	
	if ( icon.style.height == '0px'){
		// icon.style.height	= icon.getAttribute('orgHeight');
		// hdr.style.height	= hdr.getAttribute('orgHeight');
		menu.style.display	= 'inline';
	} else {
		icon.setAttribute('orgHeight', icon.style.height );
		// icon.style.height	= '0px';
		// hdr.style.height	= '0px';
		menu.style.display	= 'none';
	}

	resizeWorkplace();
	// children.style.height = '0px';
	if ( !list.hasChildNodes() ) list.innerHTML = '';

	workplaceWhiteboardHelper();

}

//
//	ワークプレイスホワイトボード画面生成
//
function workplaceWhiteboardHelper(){
	var p = document.getElementById('WORKPLACE_WHITEBOARD_MAIN_LIST');

	if ( p.hasChildNodes() ){
	// 	makeRangeList( 'RANGE_LIST', 'H' );
		return;
	}

	var r = '';
	r += '<div id="CALENDAR_DETAIL"  ></div>';

	p.innerHTML = r;

	// var ct_height = document.getElementById('CALENDAR_TOOLBAR').offsetHeight;
	// var cl_height = document.getElementById('CALENDAR_LIST').offsetHeight + 6;
	// var cdh_height = document.getElementById('CALENDAR_DETAIL_HDR').offsetHeight + 4;
	var offset = 0 ;
	var calen_detail = document.getElementById('CALENDAR_DETAIL');
	calen_detail.style.height = 'calc(100% - ' + offset + 'px)';


	// document.getElementById('CALENDAR_LIST').addEventListener('gesturestart',
	// function(e){
	// 	e.stopPropagation();	// スクロールジェスチャ抑制
	// } );
	// document.getElementById('CALENDAR_LIST').addEventListener('gestureend',
	// function(e){
	// 	e.stopPropagation();	// スクロールジェスチャ抑制
	// } );
	document.getElementById('TAB_OPTION').addEventListener('click',
	function(e) {
		var o = e.target;
		if ( o == this ) return;
		while ( o.parentNode != document.getElementById('TAB_OPTION') ){
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
	var p = document.getElementById('TAB_OPTION');
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
		c.classList.add('month_box');
		// c.style.top				= '0px';
		// c.style.left			= ( 40 * i ) + 'px';
		var r = '';
			// r += '<div style="padding:1px;">&nbsp;</div>';
			r += '<div style="font-size:14px;width:100%;text-align:center;font-weight:bold;" >'  + ( sotd.getMonth() + 1 ) + '</div>';
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
	var menu	= document.getElementById('WORKPLACE_MENU');
	var icon	= document.getElementById('WORKPLACE_ICON');
	var hdr		= document.getElementById('WORKPLACE_HDR');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');
	var children= document.getElementById('WORKPLACE_CHILDREN');
	var wpcm	= document.getElementById('WORKPLACE_CHILDREN_MAIN');
	var list	= document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST');

	var w = document.getElementById('BOTTOM_OVERLAY').offsetWidth;
	var bf= document.getElementById('BOTTOM_FRAME');
	bf.style.transform	= 'translateX(' + ( -w * 2 ) + 'px)';


	//	TAB
	var tab 		= document.getElementById('TAB_OPAQUESHAFT');
	// var current 	= document.getElementById('TAB_CURRENT');
	var plus 	 	= document.getElementById('TAB_PLUS');
	var find		= document.getElementById('TAB_FIND');
	var current2	= document.getElementById('TAB_CURRENT2');
	var option		= document.getElementById('TAB_OPTION');
	tab.style.visibility 		= 'visible';
	plus.style.visibility		= 'visible';
	find.style.visibility		= 'visible';
	current2.style.visibility	= 'visible';
	option.style.visibility		= 'visible';

	if ( icon.style.height == '0px'){
		// icon.style.height		= icon.getAttribute('orgHeight');
		// hdr.style.height		= hdr.getAttribute('orgHeight');
		menu.style.display		= 'inline';
	} else {
		// icon.setAttribute('orgHeight', icon.style.height );
		// icon.style.height		= '0px';
		// hdr.style.height		= '0px';
		menu.style.display		= 'none';
	}

	resizeWorkplace();

	// document.getElementById('WP_KEYWORD').value = '';
	// list.innerHTML = '';

}

//
//		レンジ
//
function workplaceRange(){
	workplace_id = 'RANGE';
	var menu	= document.getElementById('WORKPLACE_MENU');
	var icon	= document.getElementById('WORKPLACE_ICON');
	var hdr		= document.getElementById('WORKPLACE_HDR');
	// var list	= document.getElementById('WORKPLACE_RANGE_MAIN_LIST');

	var w = document.getElementById('BOTTOM_OVERLAY').offsetWidth;
	var bf= document.getElementById('BOTTOM_FRAME');
	bf.style.transform	= 'translateX(' + ( -w * 3 ) + 'px)';

	//	TAB
	var tab 		= document.getElementById('TAB_OPAQUESHAFT');
	// var current 	= document.getElementById('TAB_CURRENT');
	var plus		= document.getElementById('TAB_PLUS');
	var find		= document.getElementById('TAB_FIND');
	var current2	= document.getElementById('TAB_CURRENT2');
	var option		= document.getElementById('TAB_OPTION');
	tab.style.visibility 		= 'visible';
	plus.style.visibility		= 'visible';
	find.style.visibility		= 'visible';
	current2.style.visibility	= 'visible';
	option.style.visibility		= 'visible';

	if ( icon.style.height == '0px'){
		// icon.style.height		= icon.getAttribute('orgHeight');
		// hdr.style.height		= hdr.getAttribute('orgHeight');
		menu.style.display		= 'inline';
	} else {
		// icon.setAttribute('orgHeight', icon.style.height );
		// icon.style.height		= '0px';
		// hdr.style.height		= '0px';
		menu.style.display		= 'none';
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
	var menu	= document.getElementById('WORKPLACE_MENU');
	var icon	= document.getElementById('WORKPLACE_ICON');
	var hdr		= document.getElementById('WORKPLACE_HDR');
	// var list	= document.getElementById('WORKPLACE_ACCOUNT_MAIN_LIST');

	var w = document.getElementById('BOTTOM_OVERLAY').offsetWidth;
	var bf= document.getElementById('BOTTOM_FRAME');
	bf.style.transform	= 'translateX(' + ( -w * 4 ) + 'px)';

	//	TAB
	var tab 		= document.getElementById('TAB_OPAQUESHAFT');
	// var current 	= document.getElementById('TAB_CURRENT');
	var plus		= document.getElementById('TAB_PLUS');
	var find		= document.getElementById('TAB_FIND');
	var current2	= document.getElementById('TAB_CURRENT2');
	var option		= document.getElementById('TAB_OPTION');
	tab.style.visibility 		= 'visible';
	plus.style.visibility		= 'visible';
	find.style.visibility		= 'visible';
	current2.style.visibility	= 'visible';
	option.style.visibility		= 'visible';

	if ( icon.style.height == '0px'){
		// icon.style.height		= icon.getAttribute('orgHeight');
		// hdr.style.height		= hdr.getAttribute('orgHeight');
		menu.style.display		= 'inline';
	} else {
		// icon.setAttribute('orgHeight', icon.style.height );
		// icon.style.height		= '0px';
		// hdr.style.height		= '0px';
		menu.style.display		= 'none';
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
			
					wp_editAccountArea( c );
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
	
			wp_editAccountArea( c );
		}	
	}

	//	対象アカウントがセレクトされているかどうかで処理を振り分け
	if ( o.hasAttribute('selected')){
		//	セレクト解除処理
		o.removeAttribute('selected');
		o.classList.remove('selected');
		o.classList.remove('height360');
		// o.style.animationName	 		= 'scale-in-out';
		// o.style.animationDuration		= '0.3s';
		// o.style.animationIterationCount = 1;
		wp_editAccountArea( o );
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
	o.style.top			= 'calc(100% - 76px)';
	o.style.left		= '0px';
	o.style.width		= '100%';
	o.style.height		= '64px';
	o.style.paddintBottom	= '12px';
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
				c.classList.toggle('height360');
				wp_editAccountArea( c );
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
						var imagefile= result[i].imagefile;
						if ( imagefile == null || imagefile == '')
							imagefile = '';

						var o = document.createElement('DIV');
						o.classList.add( 'account' );
						o.classList.add( 'unselected' );
						o.setAttribute('acc_id', acc_id );
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
							r += '<div style="padding:2px;font-weight:bold;font-size:18px;" >' + acc_name  + '</div>';
							r += '<div style="padding:2px;" >' + priv      + '</div>';
						r += '</div>';

						r += makeAccountEditTag( acc_id, acc_name, priv, imagefile );

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
											wp_editAccountArea( acc );
											updateAccount( acc.getElementsByTagName( 'FORM')[0] );
											x.innerText = ' ';
											break;
										}
										x.innerText = 'commit?';
										break;
									case 'cancel':
										// if ( x.innerText == 'cancel?' ){
											acc.classList.toggle('height360');
											wp_editAccountArea( acc );
											// x.innerText = ' ';
											break;
										// }
										// x.innerText = 'cancel?';
										break;
								}
							}
						);

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

function wp_editAccountArea( p ){
	console.log( 'wp_editAccountArea');
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
	while( true ){
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
					o.classList.remove('height360');
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
			o.classList.remove('height360');	
			o.getElementsByClassName('container')[0].innerHTML = '';
			o.getElementsByClassName('container')[0].display = 'none';
	// wp_editAccountArea( c );
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
		c.classList.remove('height360');
		c.getElementsByClassName('container')[0].innerHTML = '';
		c.getElementsByClassName('container')[0].display = 'none';
// wp_editAccountArea( o );
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
	o.style.position		= 'absolute';
	o.style.top				= 'calc(100% - 76px)';
	o.style.left			= '0px';
	o.style.width			= '100%';
	o.style.height			= '64px';
	o.style.paddintBottom	= '12px';
	o.style.margin			= '0 auto';
	o.style.zIndex			= 65000;

	var r = '';
	r += '<div style="margin:0 auto;width:190px;height:40px;padding:4px;background-color:#EDEDED;border-radius:8px;" >';
		r += '<button type="button" class="workplace_edit_button"     cmd="edit"    ></button>';
		r += '<button type="button" class="workplace_delete_button"   cmd="delete"  ></button>';
		r += '<button type="button" class="workplace_history_button"  cmd="history" ></button>';	
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
				if ( c.classList.contains('height360')){
					c.classList.remove('height360');
					c.getElementsByClassName('container')[0].innerHTML = '';
					c.getElementsByClassName('container')[0].display = 'none';			
				} else {
					c.classList.add('height360');
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
				if ( c.classList.contains('height360')){
					c.classList.remove('height360');
					c.getElementsByClassName('container')[0].innerHTML = '';
					c.getElementsByClassName('container')[0].display = 'none';			
				} else {
					c.classList.add('height360');
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
	var id = 'container';	//	childrenOptionArea
	container = c.getElementsByClassName( id )[0];

	container.style.display	= 'inline';
	if ( container.getElementsByClassName('childrenEdit').length > 0 ) return;

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

	container.addEventListener('click',function(e){e.stopPropagation();}, false);

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
					if ( !acceptAddChildren() ) return;
					if ( x.innerText == 'Ok?'){
						updateChildren();
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
					// p.innerText = 'access...'
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );
					if ( xmlhttp.status == 200 ){
						var result = JSON.parse( xmlhttp.responseText );
						console.log( xmlhttp.responseText );
						oLog.log( null, 'update child:' + result.message)
						oLog.open(2);
					}
				break;
			}
		}, false );

	console.log( 'child update: ' + child_id +',' + child_name);

	xmlhttp.open("POST", "/accounts/childupdate", true );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'child_id=' + child_id + '&child_name=' + child_name + '&kana=' + kana + '&remark=' + remark + '&child_grade=' + child_grade + '&child_type=' + child_type );

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

	var coa = null;
	var id = 'container';	//	childrenOptionArea
	coa = c.getElementsByClassName( id )[0];

	coa.style.display	= 'inline';
	if ( coa.getElementsByClassName('childrenHistory').length > 0 ) return;

	var o = document.createElement('DIV');
	o.classList.add('childrenHistory');
	var p = coa.appendChild( o );
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
//	リサイズ処理
//
function resizeWorkplace(){
	var w = document.getElementById('BOTTOM_OVERLAY').offsetWidth;
	var h = document.getElementById('BOTTOM_FRAME').offsetHeight;
	// var sysmenu = document.getElementById('WORKPLACE_SYSMENU');

	var menu		= document.getElementById('WORKPLACE_MENU');
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
	console.log( 'bottom overlay width:' + w );

	menu.style.width				= ( w ) + 'px';
	menu.style.left					= '0px';
	workplace.style.width			= ( w - 48 ) + 'px';
	// workplace.style.top				= ( 48 * 1 ) + 'px';
	workplace.style.left			= ( w *  1 ) + 'px';
	children.style.width			= ( w - 48 ) + 'px';
	// children.style.top				= ( 48 * 2 ) + 'px';
	children.style.left				= ( w *  2 ) + 'px';
	range.style.width				= ( w - 48 ) + 'px';
	// range.style.top					= ( 48 * 3 ) + 'px';
	range.style.left				= ( w *  3 ) + 'px';
	account.style.width				= ( w - 48 ) + 'px';
	// account.style.top				= ( 48 * 4 ) + 'px';
	account.style.left				= ( w *  4 ) + 'px';

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

	if (range_id == null ){
		oLog.log( null, 'レンジを指定してください.');
		oLog.open(3);
		return;
	}


    // var wph = document.getElementById('WORKPLACE_HDR');
	// wph.style.height = '0px';
	// wph.style.padding = '0px';

	var keyword = document.getElementById('WP_KEYWORD').value;
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
									r += '<div style="padding:1px;font-size:10px;font-weight:bold;" >' + kana + '</div>';
									r += '<div class="child_header" style="" >';
										r += child_name + '&nbsp;&nbsp;' + child_grade + child_type;
										r += '<span style="color:' + arChildGradeColor[ child_grade ] + ';">●</span>';
									r += '</div>';
									r += '<div style="padding:1px;" >id:' + child_id + '</div>';
								r += '</div>';
								r += '<div class="vh-center" style="float:right;width:42px;height:100%;padding-right:8px;font-size:18px;" >';
									r += '<div style="width:30px;height:30px;color:white;background-color:limegreen;" >+' + n_result + '</div>';
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
