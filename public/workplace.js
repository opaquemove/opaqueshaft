function initWorkplace(){

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
	document.getElementById('WORKPLACE_ICON').addEventListener(
		'click', workplaceReset );
	
    document.getElementById('WP_KEYWORD').addEventListener(
		'keyup',
		function( e ){
			if ( e.key == 'Enter' )
            finder();
		}
	);

	document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST').addEventListener(
		'click', selectChildren );

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
	var wp_open		= document.getElementById('WP_OPENWHITEBOARD');
	var wp_whiteboard	= document.getElementById('WP_WHITEBOARD');
	var wp_children		= document.getElementById('WP_CHILDREN');
	var wp_setting		= document.getElementById('WP_SETTING');

	if ( checkSign() ){
		// signed
		wp_signin.setAttribute( 'disabled', 'true' );
		wp_whiteboard.removeAttribute( 'disabled' );
		wp_children.removeAttribute( 'disabled' );
		wp_setting.removeAttribute( 'disabled' );
		wp_open.removeAttribute( 'disabled' );
		wp_siginout.removeAttribute( 'disabled' );
		wp_signin.style.display		= 'none';
		wp_siginout.style.display	= 'inline';
		wp_whiteboard.style.display	= 'inline';
		wp_children.style.display	= 'inline';
		wp_setting.style.display	= 'inline';
		wp_open.style.display		= 'inline';
		// wp_signin.style.opacity		= 0.3;
		// wp_siginout.style.opacity	= 1;
		// wp_whiteboard.style.opacity	= 1;
		// wp_children.style.opacity	= 1;
		// wp_setting.style.opacity	= 1;
		// wp_open.style.opacity		= 1;
	} else {
		// not sign
		wp_signin.removeAttribute( 'disabled' );
		wp_siginout.setAttribute( 'disabled', 'true' );
		wp_whiteboard.setAttribute( 'disabled', 'true' );
		wp_children.setAttribute( 'disabled', 'true' );
		wp_setting.setAttribute( 'disabled', 'true' );
		wp_open.setAttribute( 'disabled', 'true' );
		wp_signin.style.display		= 'inline';
		wp_siginout.style.display	= 'none';
		wp_whiteboard.style.display	= 'none';
		wp_children.style.display	= 'none';
		wp_setting.style.display	= 'none';
		wp_open.style.display		= 'none';
		// wp_signin.style.opacity		= 1;
		// wp_siginout.style.opacity	= 0.3;
		// wp_whiteboard.style.opacity	= 0.3;
		// wp_children.style.opacity	= 0.3;
		// wp_setting.style.opacity	= 0.3;
		// wp_open.style.opacity		= 0.3;
	}

	resizeWorkplace();

}

function workplaceReset(){
	var sysmenu = document.getElementById('WORKPLACE_SYSMENU');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');
	var children= document.getElementById('WORKPLACE_CHILDREN');

	if ( sysmenu.style.height == '0px'){
		sysmenu.style.height = sysmenu.getAttribute('orgHeight');
		sysmenu.style.padding = sysmenu.getAttribute('orgPadding');	
	} else {
		sysmenu.setAttribute('orgHeight', sysmenu.style.height );
		sysmenu.setAttribute('orgPadding', sysmenu.style.padding );
		sysmenu.style.height = '0px';
		sysmenu.style.padding = '0px';
	}

	wb.style.height = '0px';
	children.style.height = '0px';

}

function workplaceWhiteboard(){
	var sysmenu = document.getElementById('WORKPLACE_SYSMENU');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');
	var children= document.getElementById('WORKPLACE_CHILDREN');

	if ( sysmenu.style.height == '0px'){
		sysmenu.style.height = sysmenu.getAttribute('orgHeight');
		sysmenu.style.padding = sysmenu.getAttribute('orgPadding');	
	} else {
		sysmenu.setAttribute('orgHeight', sysmenu.style.height );
		sysmenu.setAttribute('orgPadding', sysmenu.style.padding );
		sysmenu.style.height = '0px';
		sysmenu.style.padding = '0px';
	}

	wb.style.height = '196px';
	children.style.height = '0px';

}

//
//		ワークプレイス
//
function workplaceChildren(){
	var sysmenu = document.getElementById('WORKPLACE_SYSMENU');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');
	var children= document.getElementById('WORKPLACE_CHILDREN');
	var wpcm	= document.getElementById('WORKPLACE_CHILDREN_MAIN');
	var list	= document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST');


	if ( sysmenu.style.height == '0px'){
		sysmenu.style.height = sysmenu.getAttribute('orgHeight');
		sysmenu.style.padding = sysmenu.getAttribute('orgPadding');	
	} else {
		sysmenu.setAttribute('orgHeight', sysmenu.style.height );
		sysmenu.setAttribute('orgPadding', sysmenu.style.padding );
		sysmenu.style.height = '0px';
		sysmenu.style.padding = '0px';
	}

	resizeWorkplace();
	// var h = document.getElementById('BOTTOM_FRAME').offsetHeight;
	// console.log( 'h:' + children.offsetHeight );
	// children.style.height = ( h - 0 ) + 'px';
	// wpcm.style.height = ( h - 252 ) + 'px';
	wb.style.height = '0px';

	list.innerHTML = '';

}

function selectChildren( e ){
	var c = e.target;
	while ( true ){
		if ( c == this ) return;
		if ( c.classList.contains('WP_PALLETE_CHILD')) break;
		c = c.parentNode;
	}
	c.classList.toggle( 'left100' );
	if ( c.classList.contains( 'left100' )){
		if ( c.getElementsByClassName( 'opChild').length != 0 ) return;
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
		r += '<button class="workplace_delete_button" onclick="alert()" >delete</delete>';
		oo.innerHTML = r;
	} else {
		// c.removeChild( c.getElementsByClassName( 'opChild')[0] );
	}

}
//
//
function wp_find(){
	var wph = document.getElementById('WORKPLACE_HDR');
	wph.style.height = '0px';
	wph.style.padding = '0px';
}
function closeWorkplaceWhiteboard(){
	workplaceReset();
	var wph = document.getElementById('WORKPLACE_HDR');
	wph.style.height = '';
	wph.style.padding = '';
}
function closeWorkplaceChildren(){
	workplaceReset();
	var wph = document.getElementById('WORKPLACE_HDR');
	wph.style.height = '';
	wph.style.padding = '';
}

//
//	リサイズ処理
//
function resizeWorkplace(){
	var h = document.getElementById('BOTTOM_FRAME').offsetHeight;
	var sysmenu = document.getElementById('WORKPLACE_SYSMENU');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');
	var children= document.getElementById('WORKPLACE_CHILDREN');
	var chr		= document.getElementById('WORKPLACE_CHILDREN_HDR').offsetHeight;
	var chr2	= document.getElementById('WORKPLACE_CHILDREN_HDR2').offsetHeight;
	var wpcm	= document.getElementById('WORKPLACE_CHILDREN_MAIN');
	var list	= document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST');
	console.log( 'resizeWorkplace' );
	// if ( children.offsetHeight != 0 && wb.offsetHeight != 0 ){
		children.style.height = ( h - 0 ) + 'px';
	// }
	wpcm.style.height = ( h - ( chr + chr2 ) ) + 'px';	// offset 252

}

function finder(){
    var wph = document.getElementById('WORKPLACE_HDR');
	wph.style.height = '0px';
	wph.style.padding = '0px';

	var keyword = document.getElementById('WP_KEYWORD').value;
	finderHelper( keyword );
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
