window.onload = init;
window.onresize = fitting;
window.onorientationchange = fitting;


var w_whiteboard    = null;
var w_child			= null;

var oReserve		= null;
var oLog			= null;

var cur_range_id	= 0;
var edit_month		= null;


const arChildGrade = ['','4px solid lightcoral', '4px solid lightgreen', '4px solid lightblue','4px solid lightcyan','4px solid lightyellow','4px solid lightseagreen'];
const arChildGradeColor = ['','lightcoral', 'lightgreen', 'lightblue', 'lightcyan', 'lightyellow','lightseagreen'];

function init(){
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

    var w = document.body.clientWidth;
	var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;

	//	編集月を初期化
	edit_month = new Date();
	edit_month = new Date( edit_month.getFullYear() + '/' + ( edit_month.getMonth() + 1 ) + '/1' );

	//	ログエリアの初期化
	oLog = new messageLog();

	//	リザーブセレクタ初期化
	oReserve = new reserveSelector();

	//モーダルダイアログ初期化
	initModalDialog();

	document.getElementById('ADD_CHILD').addEventListener( 'click',
		function(e){
			newChildForm();
		}, false );

	var sm = document.getElementById('SCHEDULE_MONTH');
	sm.innerText = edit_month.getFullYear() + '/' + ( edit_month.getMonth() + 1);
	var sm_prev = document.getElementById('SCHEDULE_MONTH_PREV');
	sm_prev.addEventListener('click',
		function(e){
			var dy = new Date( document.getElementById('SCHEDULE_MONTH').innerText + '/1' );
			dy.setMonth( dy.getMonth() - 1 );
			document.getElementById('SCHEDULE_MONTH').innerText =
				dy.getFullYear() + '/' + (dy.getMonth()+1 );
			var fd = document.getElementById('FINDER_DETAIL');
			if ( fd.style.display == 'inline' ) details();
		}, false );
	var sm_next = document.getElementById('SCHEDULE_MONTH_NEXT');
	sm_next.addEventListener('click',
		function(e){
			var dy = new Date( document.getElementById('SCHEDULE_MONTH').innerText + '/1' );
			dy.setMonth( dy.getMonth() + 1 );
			document.getElementById('SCHEDULE_MONTH').innerText =
				dy.getFullYear() + '/' + (dy.getMonth() + 1 );
			var fd = document.getElementById('FINDER_DETAIL');
			if ( fd.style.display == 'inline' ) details();
			}, false );
	
	fitting();
	
	child_form.keyword.focus();
	document.getElementById('ID_KEYWORD').addEventListener( 'keyup', finder, false );
	document.getElementById('BTN_FIND_CHILDREN' ).addEventListener('click',
		function(e){
			var keyword = child_form.keyword.value;	
			finderHelper( keyword );
		}, false );

	document.getElementById('FINDER_AREA').addEventListener( evtStart, locateFinder, false );
	document.getElementById('FINDER_AREA').addEventListener( evtMove, locateFinder, false );
	document.getElementById('FINDER_AREA').addEventListener( evtEnd, locateFinder, false );

	document.getElementById('FINDER_DETAIL').addEventListener( evtStart, locateFinderDetail, false );
	document.getElementById('FINDER_DETAIL').addEventListener( evtMove,  locateFinderDetail, false );
	document.getElementById('FINDER_DETAIL').addEventListener( evtEnd,   locateFinderDetail, false );

	document.getElementById('BTN_PREV_CHILDREN').addEventListener( 'click',
		function(e){
			var p = document.getElementById('FINDER_AREA');
			prevChildren( p );
		}, false );
	
	oLog.log( null, 'initialized.');
	oLog.open( 2 );


	// signin
	if ( ! checkSign() ){
		ctlToolbar();
		oLog.log( null, 'not signin.');
		oLog.open( 3 );
	}else{
		ctlToolbar();
		var ss = document.getElementById('SIGNIN_STATUS');
		ss.innerText = isSignId();
		var oAcc = getAccount( isSignId() );
		var rs = document.getElementById('RANGE_STATUS');
		rs.innerText = oAcc.range_id;
		cur_range_id = oAcc.range_id;
		rs.addEventListener( 'click', scheduler, false );
	}

}


//
//	サインイン・アウト時のUIデザイン
//
function ctlToolbar(){
	if ( checkSign() ) {
		ctlToolbarHelper( 'visible' );
	} else {
		ctlToolbarHelper( 'hidden' );
		signForm();
	}
}

function ctlToolbarHelper( flg ){
	console.log( flg );
	var header 			= document.getElementById('HEADER');
	var toolbar			= document.getElementById('TOOLBAR');
	var finder_frame	= document.getElementById('FINDER_FRAME');
	var finder			= document.getElementById('FINDER_AREA');

	header.style.visibility				= flg;
	toolbar.style.visibility			= flg;
	finder_frame.style.visibility		= flg;
	finder.style.visibility				= flg;
}

//
//	サインインフォーム
//
function signForm()
{
	
	var r = "";	
	r += "<div style='width:350px;height:;margin:10px auto;background-color:white;overflow:hidden;' >";
		r += "<div style='height:40px;padding-top:20px;text-align:center;font-size:20px;' >Sign in to your account</div>";
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

	neverCloseDialog = true;
	openModalDialog( null, r, 'NOBUTTON', null, 'SIGNIN' );
	o = document.getElementById( 'acc_id' );
	o.focus();
	
}
//
//	サイン処理
//
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
								// procedure
								neverCloseDialog = false;
								closeModalDialog();
								ctlToolbar();

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
	} catch ( e ) {
		oLog.log( null, 'sign:e:' + e );
		oLog.open( 3 );
	}
}



var lf_moved	= false;
function locateFinder( e ){
	switch ( e.type ){
		case 'touchstart':
		case 'mousedown':
			lf_moved = false;
			break;
		case 'mousemove':
		case 'touchmove':
			lf_moved = true;
			break;
		case 'touchend':
		case 'mouseup':
			var c = scanChild( e.target );
			if ( c != null ){
				if ( c.hasAttribute('selected')){

					//	プロフィールエリア内なら
					if ( isProfeel( e.target )){
						c.classList.remove('selected');
						c.classList.remove( 'onProfeel' );
						c.classList.add( 'offProfeel' );
						c.removeAttribute('selected');
						c.style.height = '';
						var appx = c.getElementsByClassName('appendix');
						for ( var i=0; i<appx.length; i++ ){
							appx[i].style.display = 'none';
						}

					}
				} else{
					if ( ! lf_moved ){
						c.classList.add( 'selected' );
						c.classList.remove( 'offProfeel' );
						c.classList.add( 'onProfeel' );
						c.setAttribute( 'selected', 'yes' );
						c.style.height = '596px';
						var appx = c.getElementsByClassName('appendix');
						for ( var i=0; i<appx.length; i++ ){
							appx[i].style.display = 'inline';
						}
						var result_lst  = c.getElementsByClassName('RESULT_LST')[0];
						var reserve_lst = c.getElementsByClassName('RESERVE_LST')[0];
						var child_id = c.getAttribute('child_id');
						var ym = edit_month.getFullYear() + '/' + ( edit_month.getMonth() + 1 );
						makeResultList( child_id, result_lst );
						makeReserveList( ym, child_id, reserve_lst );
	
						// 他のチャイルドを非表示
						// var children = this.childNodes;
						// for ( var i=0; i<children.length; i++ ){
						// 	if ( c!= children[i] )
						// 		children[i].style.display = 'none';
						// }
					}
				}
			}

			break;
	}
}

function locateFinderDetail( e ){
	switch ( e.type ){
		case 'touchstart':
		case 'mousedown':
			break;
		case 'mousemove':
		case 'touchmove':
			break;
		case 'touchend':
		case 'mouseup':
			var u = scanUnit( e.target );
			console.log('u:' + u );
			if ( u != null ){
				if ( u.hasAttribute('selected')){
					u.classList.remove( 'selected2' );
					u.removeAttribute( 'selected', 'yes' );
				} else{
					u.classList.add( 'selected2' );
					u.setAttribute( 'selected', 'yes' );
				}
			}
			break;
	}
}


function prevChildren( p ){
	oReserve.close();
	if ( !p.hasChildNodes ) return;
	var children = p.childNodes;

	for ( var i=0; i<children.length; i++ ){
		var c = children[i];
		if ( c.hasAttribute('selected')){
			c.classList.remove('selected');
			c.removeAttribute('selected');
			c.style.height = '';
		}
		var appx = c.getElementsByClassName('appendix');
		for ( var j=0; j<appx.length; j++){
			appx[j].style.display = 'none';
		}
		c.style.display = 'inline'
	}

}

function scanUnit( o ) {
    while ( true ) {
        var tn = o.tagName;
        if ( tn.toLowerCase() == "body" ) return null;
        // if ( o.getAttribute("child") == "yes" ) return o;
        if ( o.hasAttribute( 'schedule_unit' ) ) return o;
        o = o.parentNode;
    }
}

function scanChild( o ) {
    while ( true ) {
        var tn = o.tagName;
        if ( tn.toLowerCase() == "body" ) return null;
        // if ( o.getAttribute("child") == "yes" ) return o;
        if ( o.hasAttribute("child_id") ) return o;
        o = o.parentNode;
    }
}

function isProfeel( o ) {
    while ( true ) {
        var tn = o.tagName;
        if ( tn.toLowerCase() == "body" ) return false;
		if ( o.hasAttribute("profeel") ) return true;
        o = o.parentNode;
    }
}

function fitting(){
	var w = document.body.clientWidth;
	var h = ( document.body.clientHeight > window.innerHeight )?window.innerHeight : document.body.clientHeight;
	var screen_ratio = Math.floor( w / h * 100 ) / 100;
	console.log( 'screen ratio:' + screen_ratio );
}

function finder( e ){
	var keyword = child_form.keyword.value;
	
	if ( e.keyCode == 13 ) finderHelper( keyword );
}
function finderHelper( keyword ){
	console.log( 'keyword:' + keyword );
	var fa = document.getElementById('FINDER_AREA');
	var fd = document.getElementById('FINDER_DETAIL');
	fd.innerText = '';
	fa.innerText = keyword;

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
					fa.innerText = 'access...'
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						
						var result = JSON.parse( xmlhttp.responseText );
						
						fa.innerText = '';
						
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
							c.classList.add( "PALLETE_CHILD" );
							c.classList.add( "offProfeel" );
							c.setAttribute('kana',        kana );
							c.setAttribute('child_type',  child_type );
							c.setAttribute('child_grade', child_grade );
							// c.style.margin	        = '1px';
							// c.style.padding			= '2px';
							c.style.float           = 'left';
							var cc = fa.appendChild( c );
							var cc_width = cc.offsetWidth;


							r = '';
							r += '<div profeel="yes" style="float:left;width:' + cc_width + 'px;height:140px;overflow:hidden;" >';
								if ( imagefile != ''){
									r += '<div style="float:left;width:60px;height:60px;color:dimgrey;font-size:8px;margin:4px;padding:4px;overflow:hidden;border-radius:45%;background-image:url(./images/children/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
										r += '&nbsp;';
									r += '</div>';
								} else{
									r += '<div style="float:left;width:60px;height:60px;color:black;font-size:8px;opacity:0.3;margin:4px;padding:4px;overflow:hidden;border-radius:45%;background-image:url(./images/user-2.png);background-size:30px;background-position:center center;background-repeat:no-repeat;" >';
										r += '&nbsp';
									r += '</div>';
								}
								r += '<div style="float:right;width:94px;height:168px;" >';
									r += '<div class="CHILD_NAME" style="font-size:16px;padding-left:2px;">';
										r += child_name;
									r += '</div>';
									r += '<div style="font-size:14px;text-align:right;padding-top:2px;" >';
										r += child_grade + child_type;
										r += '<span style="color:' + arChildGradeColor[ child_grade ] + ';">●</span>';
									r += '</div>';
									r += '<div style="padding:1px;" >' + kana + '</div>';
									r += '<div style="padding:1px;" >id/Range:' + child_id + '/' + range_id + '</div>';
								r += '</div>';
							r += '</div>';


							r += '<div class="appendix" style="float:left;width:' + cc_width + 'px;display:none;" >';
								r += '<form id="child_prop_' + child_id + '"  name="child_prop_' + child_id + '" onsubmit="return false;" >';
								r += '<div style="width:100%;padding:4px 0px 4px 0px;font-size:14px;font-weight:bold;" >Profeel:</div>';
								r += '<div style="width:97%;height:180px;padding:1px;" >';
									r += '<div style="width:100%;height:24px;padding:4px 0px 2px 0px;" >';
										r += '<input type="text" name="kana"  style="width:98%;"  value="' + kana        + '" />';
									r += '</div>';
									r += '<div style="width:100%;height:24px;padding:2px 0px 2px 0px;" >';
										r += '<input type="text" name="child_name" style="width:98%;" value="' + child_name  + '" />';
									r += '</div>';
									r += '<div style="clear:both;width:100%;" >';
										r += '<textarea name="remark" style="width:90%;" autocomplete="off" >' + remark + '</textarea>';
									r += '</div>';
									r += '<div class="vh-center" style="clear:both;width:100%;text-align:center;" >';
										// r += '<input type="text" name="child_type"  value="' + child_type  + '" /><br/>';
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
										r += '<input type="radio" id="child_type_a_' + child_id + '" name="child_type" value="A" ' + a + '/>';
										r += '<label for="child_type_a_' + child_id + '"  style="display:block;float:left;width:15px;height:21px;font-size:10px;background-image:url(./images/dry-clean.png);background-position:center center;background-size:20px;background-repeat:no-repeat;padding:8px 4px 1px 5px;" >A</label>';
										r += '&nbsp;'
										r += '<input type="radio" id="child_type_b_' + child_id + '" name="child_type" value="B" ' + b + '/>';
										r += '<label for="child_type_b_' + child_id + '"  style="display:block;float:left;width:15px;height:21px;font-size:10px;background-image:url(./images/dry-clean.png);background-position:center center;background-size:20px;background-repeat:no-repeat;padding:8px 4px 1px 5px;" >B</label>';

										r += '<img width="14px" src="./images/minus-3.png" />';

										var grades = [ ' ', ' ', ' ', ' ', ' ', ' ' ];
										grades[ child_grade - 1 ] = ' checked ';
										for ( var g=0; g<grades.length; g++ ){
											r += '<input type="radio" id="child_grade_' + child_id + '_' + g + '" name="child_grade" ' + grades[g] + ' value="' + (g+1) + '" />';
											r += '<label for="child_grade_' + child_id + '_' + g + '"  style="display:block;float:left;width:12px;height:21px;background-image:url(./images/dry-clean.png);background-position:center center;background-size:20px;background-repeat:no-repeat;padding:7px 4px 2px 8px;" >' + ( g+1 ) + '</label>';
										}
	
									r += '</div>';
									r += '<div style="clear:both;width:100%;" >';
										r += '<input type="hidden" name="child_id" value="' + child_id + '" />';
									r += '</div>';
								r += '</div>';
							r += '</div>';
							
							r += '<div class="appendix" style="float:left;width:' + cc_width + 'px;display:none;" >';
								r += '<div                    style="padding:1px;font-size:14px;font-weight:bold;" >Result:</div>';
								r += '<div class="RESULT_HDR" style="padding:1px;width:250px;height:18px;background-color:#EDEDED;border:1px solid lightgrey;" >';
										r += '<div class="day_data" >Day</div>';
										r += '<div class="estimate_data" >Est</div>';
										r += '<div class="remark_data" >Remark</div>';
								r += '</div>';
								r += '<div class="RESULT_LST" style="padding:1px;width:250px;height:84px;border:1px solid lightgrey;overflow:scroll;" ></div>';
							r += '</div>';


							r += '<div class="appendix" style="float:left;width:97%;display:none;" >';
								r += '<div                     style="padding:1px;font-size:14px;font-weight:bold;" >';
									r += 'Reserve:';
								r += '</div>';
								r += '<div class="RESERVE_HDR" edit_month="' + edit_month.getFullYear() + '/' + (edit_month.getMonth()+1) + '" style="padding:1px;width:99%;height:18px;background-color:#EDEDED;border:1px solid lightgrey;" >';
									r += '<div class="day_data"  >Day</div>';
									r += '<div class="sott_data" >Sott</div>';
									r += '<div class="eott_data" >Eott</div>';
									r += '<div class="B_RELOAD_RESERVE" style="pointer-events:auto;float:right;width:18px;height:18px;background-image:url(./images/recycle.png);background-size:10px;background-position:center center;background-repeat:no-repeat;" >&nbsp;</div>';
									r += '<div class="next_month"    style="float:right;width:18px;height:18px;background-image:url(./images/next.png);background-size:10px;background-position:center center;background-repeat:no-repeat;" >&nbsp;</div>';
									r += '<div class="prev_month"    style="float:right;width:18px;height:18px;background-image:url(./images/prev.png);background-size:10px;background-position:center center;background-repeat:no-repeat;" >&nbsp;</div>';
									r += '<div class="reserve_month" >' + edit_month.getFullYear() + '/' + (edit_month.getMonth()+1) + '</div>';
								r += '</div>';
								r += '<div class="RESERVE_LST" style="padding:1px;width:99%;height:84px;border:1px solid lightgrey;overflow:scroll;" ></div>';
							r += '</div>';

							r += '<div class="appendix vh-center" style="padding:10px 1px 1px 1px;width:100%;display:none;" >';
								r += '<button class="BTN_COMMIT_CHILD" style="border:none;background-color:transparent;" >';
									r += '<img width="24px" src="./images/check-3.png" />';
								r += '</button>';
								r += '<button class="BTN_CANCEL_CHILD" style="border:none;background-color:transparent;" >';
									r += '<img   width="24px" src="./images/cancel-2.png" />';
								r += '</button>';
								r += '<button class="BTN_EXPAND_CHILD" style="border:none;background-color:transparent;" >';
									r += '<img   width="24px" src="./images/arrow-right.png" />';
								r += '</button>';
							r += '</div>';
							r += '</form>';
							// r += '</div>';

							cc.innerHTML = r;
					

							var brs = cc.getElementsByClassName('B_RELOAD_RESERVE' )[0];
							brs.addEventListener('click', 
								function(e){
									console.log('reload reserve');
									var sc 			= scanChild( e.target );
									var cid 		= sc.getAttribute('child_id');
									var reserve_lst = sc.getElementsByClassName('RESERVE_LST')[0];
									var ym 			= this.parentNode.getAttribute('edit_month')[0];
									makeReserveList( ym, cid, reserve_lst );
								}, false );
							var prev_month = cc.getElementsByClassName('prev_month')[0];
							prev_month.addEventListener( 'click', function(e){
									var sc 			= scanChild( e.target );
									var cid 		= sc.getAttribute('child_id');
									var reserve_lst = sc.getElementsByClassName('RESERVE_LST')[0];
									var ym 			= this.parentNode.getAttribute('edit_month');
									var oEm 		= new Date( ym + '/1' );
									oEm.setMonth( oEm.getMonth() - 1 );
									this.parentNode.setAttribute('edit_month', oEm.getFullYear() + '/' + ( oEm.getMonth()+1 ) );
									sc.getElementsByClassName('reserve_month')[0].innerText =
										this.parentNode.getAttribute( 'edit_month' );
									makeReserveList( this.parentNode.getAttribute( 'edit_month' ), cid, reserve_lst );

								}, false );
							var next_month = cc.getElementsByClassName('next_month')[0];
							next_month.addEventListener( 'click', function(e){
									var sc 			= scanChild( e.target );
									var cid 		= sc.getAttribute('child_id');
									var reserve_lst = sc.getElementsByClassName('RESERVE_LST')[0];
									var ym 			= this.parentNode.getAttribute('edit_month');
									var oEm = new Date( ym + '/1' );
									oEm.setMonth( oEm.getMonth() + 1 );
									this.parentNode.setAttribute('edit_month', oEm.getFullYear() + '/' + ( oEm.getMonth()+1 ) );
									sc.getElementsByClassName('reserve_month')[0].innerText =
										this.parentNode.getAttribute( 'edit_month' );
									makeReserveList( this.parentNode.getAttribute( 'edit_month' ), cid, reserve_lst );

								}, false );
	
							var bcomc = cc.getElementsByClassName('BTN_COMMIT_CHILD')[0];
							bcomc.addEventListener( 'click', function(e){
									var cid = scanChild( e.target ).getAttribute('child_id');
									var f = document.forms['child_prop_' + cid ];
									var child_id 	= f.child_id.value;
									var child_name 	= f.child_name.value;
									var kana		= f.kana.value;
									var remark		= encodeURIComponent( f.remark.value );
									var child_grade = f.child_grade.value;
									var child_type	= f.child_type.value;
									updateChild( child_id, child_name, kana, remark, child_grade, child_type );
									var p = document.getElementById('FINDER_AREA');
									prevChildren( p );
								}, false );
							var bcanc = cc.getElementsByClassName('BTN_CANCEL_CHILD')[0];
							bcanc.addEventListener( 'click', function(e){
									// var p = document.getElementById('FINDER_AREA');
									// prevChildren( p );
									var sc = scanChild( e.target );
									var appx = sc.getElementsByClassName('appendix');
									for ( var j=0; j<appx.length; j++){
										appx[j].style.display = 'none';
									}
									sc.classList.remove('selected');
									sc.removeAttribute('selected');						
									sc.style.height = '';
							
								}, false );
							var bcanc = cc.getElementsByClassName('BTN_EXPAND_CHILD')[0];
							bcanc.addEventListener( 'click', function(e){
									var sc = scanChild( e.target );
									if ( sc.style.height == '170px' ){
										sc.style.height	= '';
										// sc.style.height	= '';
									} else {
										sc.style.width	= ( sc.offsetWidth * 3 ) + 'px';
										// sc.style.height	= '170px';
									}
								}, false );
							//	reserve list 選択処理
							var reserve_lst = cc.getElementsByClassName('RESERVE_LST')[0];
							reserve_lst.addEventListener('click', function(e){
								var o = e.target;
								while ( ! o.hasAttribute('day')){
									console.log('tagName:' + o.tagName);
									if ( o.tagName == 'BODY') return;
									o = o.parentNode;
								}
								if ( o.hasAttribute('day')){
									console.log('day:' + o.getAttribute('day') );
									if ( o.hasAttribute('selected')){
										deselectLine( o );
										oReserve.close();
										// o.removeAttribute('selected');
										// o.classList.remove('selected2');
									} else{
										deselectAllLine( this );
										o.setAttribute('selected', 'yes' );
										o.classList.add('selected2');
										if ( o.hasAttribute('selected' ) ) oReserve.open( o.parentNode );
											else							oReserve.close();
									}
								}					
							}, false );
							
							
						}
					} else{
						console.log( null, 'findChildrenTable:' + xmlhttp.status );
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/childfind", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		if ( keyword == '*' ) keyword = '%';
		xmlhttp.send( 'keyword=' + keyword );


}

//
//	リザルト（履歴）リスト取得
//
function makeResultList( child_id, p ){

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
//	リザルト（履歴）リスト取得
//
function makeReserveList( ym, child_id, p ){

	var range_id = cur_range_id;
	oReserve.close();

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
						var am_resv = new Map();
						for ( var i=0; i<result.length; i++ ){
							var rs = result[i];
							var d = new Date( rs.day );
							var ymd = d.getFullYear() + '/' + ( d.getMonth()+1 ) + '/' + d.getDate();
							am_resv.set( ymd, { 'sott' : rs.sott.substr(0,5), 'eott' : rs.eott.substr(0,5) } );
						}
						makeReserveListHelper( ym, child_id, p, am_resv );
					}
				break;
			}
		}, false );

		xmlhttp.open("POST", "/accounts/reserveget", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'child_id=' + child_id + '&range_id=' + range_id );

}

function makeReserveListHelper( ym, child_id, p, am_resv ){

	console.log( am_resv );
	//	対象月を取得
	var today = new Date( ym + '/1' );
	var sotd   = new Date( today.getFullYear() + '/' + ( today.getMonth() + 1 ) + '/' + 1 );
	var curDay = new Date( today.getFullYear() + '/' + ( today.getMonth() + 1 ) + '/' + 1 );
	var curMon = sotd.getMonth();

	var r = '';
	while ( curMon == curDay.getMonth() ){
		var d = curDay.getFullYear() + '/' + ( curDay.getMonth() + 1 ) + '/' + curDay.getDate();
		var sott = '';
		var eott = '';
		if ( am_resv.has( d ) ){
			var resv = am_resv.get( d );
			sott = resv.sott;
			eott = resv.eott;
		}
		r += '<div day="' + d + '" style="clear:both;width:100%;height:18px;border-bottom:1px solid lightgrey;" >';
			r += '<div class="day_data"   >' + d    + '</div>';
			r += '<div class="sott_data"  >' + sott + '</div>';
			r += '<div class="eott_data"  >' + eott + '</div>';
		r += '</div>';
		curDay.setDate( curDay.getDate() + 1 );
	}
	p.innerHTML = r;

}
//	行選択
function selectLine( o ){
	o.setAttribute('selected', 'yes' );
	o.classList.add('selected2');
}
//	行選択解除
function deselectLine( o ){
	o.removeAttribute('selected');
	o.classList.remove('selected2');
}
//	全行選択解除
function deselectAllLine( f ){
	var rows = f.childNodes;
	for ( var i=0; i<rows.length; i++ )
		if ( rows[i].hasAttribute('selected') )deselectLine( rows[i] );
}

//
//	チャイルド更新
//
function updateChild( child_id, child_name, kana, remark, child_grade, child_type ){

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

	// var child_id 	= f.child_id.value;
	// var child_name 	= f.child_name.value;
	// var kana		= f.kana.value;
	// var remark		= encodeURIComponent( f.remark.value );
	// var child_grade = f.child_grade.value;
	// var child_type	= f.child_type.value;

	console.log( 'child update: ' + child_id +',' + child_name);

	xmlhttp.open("POST", "/accounts/childupdate", true );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'child_id=' + child_id + '&child_name=' + child_name + '&kana=' + kana + '&remark=' + remark + '&child_grade=' + child_grade + '&child_type=' + child_type );

}

//
//	チャイルド作成フォーム
//
function newChildForm(){
	var r = '';
	r += makeChildForm();
	openModalDialog( null, r, 'OK_CANCEL', newChildSend, null );
	childprop_form.kana.focus();
}

//
//	チャイルドフォームの生成
//
function makeChildForm( ){
	var id  			= null;
	var kana			= '';
	var child_name 		= '';
	var child_type  	= 'A';
	var child_grade 	= '1';
	var range_id		= cur_range_id;
	var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >Child</div>';
	r += '<div style="margin:0 auto;width:180px;">';
		r += '<form name="childprop_form" onsubmit="return false;" >';
		r += '<div>kana:</div>';
		r += '<div><input type="text" id="f_kana"       name="kana"        value="' + kana  + '" autocomplete="off" /></div>';
		r += '<div>name:</div>';
		r += '<div><input type="text" id="f_child_name" name="child_name"  value="' + child_name  + '" autocomplete="off" /></div>';
		r += '<div>type/grade:</div>';
		// r += '<div><input type="text" name="child_type"  value="' + type  + '" /></div>';
		// r += '<div>grade:</div>';
		// r += '<div><input type="text" name="child_grade" value="' + grade + '" /></div>';

		r += '<div class="vh-center" style="clear:both;width:100%;text-align:center;" >';
		switch ( child_type ){
			case 'A':
				var a = ' checked ';
				var b = ' ';
				break;
			default:
				var a = '  ';
				var b = ' checked ';
				break;
		}
		r += '<input type="radio" id="child_type_a" name="child_type" value="A" ' + a + '/>';
		r += '<label for="child_type_a"  style="display:block;float:left;width:15px;height:21px;font-size:10px;background-image:url(./images/dry-clean.png);background-position:center center;background-size:20px;background-repeat:no-repeat;padding:8px 4px 1px 5px;" >A</label>';
		r += '&nbsp;'
		r += '<input type="radio" id="child_type_b" name="child_type" value="B" ' + b + '/>';
		r += '<label for="child_type_b"  style="display:block;float:left;width:15px;height:21px;font-size:10px;background-image:url(./images/dry-clean.png);background-position:center center;background-size:20px;background-repeat:no-repeat;padding:8px 4px 1px 5px;" >B</label>';

		r += '<img width="14px" src="./images/minus-3.png" />';

		var grades = [ ' ', ' ', ' ', ' ', ' ', ' ' ];
		grades[ child_grade - 1 ] = ' checked ';
		for ( var g=0; g<grades.length; g++ ){
			r += '<input type="radio" id="child_grade_' + g + '" name="child_grade" ' + grades[g] + ' value="' + (g+1) + '" />';
			r += '<label for="child_grade_' + g + '"  style="display:block;float:left;width:12px;height:21px;background-image:url(./images/dry-clean.png);background-position:center center;background-size:20px;background-repeat:no-repeat;padding:7px 4px 2px 8px;" >' + ( g+1 ) + '</label>';
		}

	r += '</div>';

		r += '<div>remark:</div>';
		r += '<div><textarea name="remark" resize="none"  ></textarea></div>';
		r += '<div>range:</div>';
		r += '<div><input type="text" name="range_id"    value="' + range_id + '" readonly /></div>';
		r += '</form>';
		// r += '<div style="padding-top:10px;" >';
		// 	r += "<button type='button' onclick='newChildSend()' >next...</button>";
		// r += '</div>';	
	r += '</div>';
	return r;

}

//
//	チャイルド情報を送信
//
function newChildSend(){
	var kana        = childprop_form.kana.value;
	var child_name  = childprop_form.child_name.value;
	if ( kana =='' ){
		oLog.log( null, 'カナを入力してください.' );
		oLog.open( 3 );
		return;
	} ;
	if ( child_name =='' ){
		oLog.log( null, '名前を入力してください.' );
		oLog.open( 3 );
		return;
	} ;

	if ( newChildSendHelper() ){
		oLog.log( null, 'add child : SUCCESS' );
		closeModalDialog();
	} else{
		oLog.log( null, 'add child : FAILED' );
	}
	oLog.open( 3 );
}

//
//	チャイルドの登録（REST)
//
function newChildSendHelper(){
	var kana  		= childprop_form.kana.value;
	var child_name  = childprop_form.child_name.value;
	var child_grade = childprop_form.child_grade.value;
	var child_type  = childprop_form.child_type.value;
	var remark		= encodeURIComponent( childprop_form.remark.value );
	var range_id	= childprop_form.range_id.value;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/childadd", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'child_name=' + child_name + '&kana=' +  kana + '&remark=' + remark + '&child_grade=' + child_grade + '&child_type=' + child_type + '&range_id=' + range_id );
	if ( xmlhttp.status == 200 ){
		var result = JSON.parse( xmlhttp.responseText );
		if ( result == null ) return false;
		return ( result.status == 'SUCCESS' );
	} else return false;

}

function reserveSelector(){
	this.overlay				= null;
	this.frame1					= null;		//	sott用エリア
	this.frame2					= null;		//	eott用エリア
	this.resv_lst				= null;		//	予約リストオブジェクト
	this.sott					= 0;		//	開始時刻
	this.eott					= 0;		//	終了時刻
	this.tool					= null;

	var ol = document.createElement('DIV');
	ol.classList.add('vh-center');
	ol.style.position			= 'absolute';
	ol.style.pointerEvents		= 'none';
	ol.style.top				= '0px';
	ol.style.left				= '0px';
	ol.style.width				= '100%';
	ol.style.height				= '100%';
	ol.style.margin				= '0px';
	ol.style.padding			= '0px';
	ol.style.color				= 'gray';
	ol.backgroundColor			= 'transparent';
	ol.style.visibility			= 'hidden';
	ol.style.zIndex				= 100;
	this.overlay				= document.body.appendChild( ol );

	var fm = document.createElement('DIV');
	fm.classList.add( 'not_select' );
	fm.setAttribute( 'selector', 'sott' );
	fm.style.pointerEvents		= 'all';
	fm.style.width				= '128px';
	fm.style.height				= '286px';
	fm.style.backgroundColor	= 'white';
	fm.style.marginRight		= '1px';
	fm.style.borderRadius		= '4px';
	this.makeButton( 'start time', fm );
	this.frame1 = this.overlay.appendChild( fm );

	fm = document.createElement('DIV');
	fm.classList.add( 'not_select' );
	fm.setAttribute( 'selector', 'eott' );
	fm.style.pointerEvents		= 'all';
	fm.style.width				= '128px';
	fm.style.height				= '286px';
	fm.style.backgroundColor	= 'white';
	fm.style.borderRadius		= '4px';
	this.makeButton( 'end time', fm );
	this.frame2 = this.overlay.appendChild( fm );

	var tool = document.createElement('DIV');
	tool.classList.add( 'not_select' );
	tool.style.pointerEvents		= 'all';
	tool.style.width				= '32px';
	tool.style.height				= '286px';
	tool.style.marginLeft			= '1px';
	tool.style.backgroundColor		= 'transparent';
	tool.innerHTML = this.makeToolbar();
	this.tool = this.overlay.appendChild( tool );

	this.tool.getElementsByClassName('cancel_reservation')[0].addEventListener('click',
		( function(e){
			this.close();
		} ).bind( this ), false );
	this.tool.getElementsByClassName('commit_reservation')[0].addEventListener('click',
		( function(e){
			this.commit();
		} ).bind( this ), false );
	this.tool.getElementsByClassName('reset_reservation')[0].addEventListener('click',
		( function(e){
			this.reset();
		} ).bind( this ), false );
	this.tool.getElementsByClassName('delete_reservation')[0].addEventListener('click',
		( function(e){
			this.delete();
		} ).bind( this ), false );

	this.overlay.addEventListener( 'click',
		( function(e){
			if ( e.target == this.overlay) this.close();
		} ).bind( this ), false );

	this.frame1.addEventListener( 'click', ( this.selection ).bind( this ), false );
	this.frame2.addEventListener( 'click', ( this.selection ).bind( this ), false );

	// this.frame1.getElementsByClassName('settime')[0].addEventListener( 'click', ( this.setTime ).bind( this ), false );
	// this.frame2.getElementsByClassName('settime')[0].addEventListener( 'click', ( this.setTime ).bind( this ), false );

	this.close();

}

reserveSelector.prototype = {
	makeToolbar : function(){
		var r = '';
		r += '<div class="cancel_reservation" style="width:32px;height:32px;border-radius:4px;background-color:white;background-image:url(./images/cancel-2.png);background-size:14px;background-position:center center;background-repeat:no-repeat;" ></div>';
		r += '<div class="commit_reservation" style="width:32px;height:32px;border-radius:4px;background-color:white;background-image:url(./images/check-3.png);background-size:14px;background-position:center center;background-repeat:no-repeat;" ></div>';
		r += '<div class="reset_reservation"  style="width:32px;height:32px;border-radius:4px;background-color:white;background-image:url(./images/eraser.png);background-size:14px;background-position:center center;background-repeat:no-repeat;" ></div>';
		r += '<div class="delete_reservation" style="width:32px;height:32px;border-radius:4px;background-color:white;background-image:url(./images/minus-2.png);background-size:14px;background-position:center center;background-repeat:no-repeat;" ></div>';
		return r;
	},
	makeButton : function( hdr, p ){
		var r = '';
		r += '<div style="width:100%;height:30px;padding-top:12px;text-align:center;font-size:18px;font-weight:boldl;border-bottom:1px solid lightgrey;" >';
			r += hdr + '&nbsp;' +'<span class="specific_time" ></span>';
		r += '</div>';
		for ( var h=8; h<=19; h++ ){
			r += '<div h="' + h + '" class="vh-center" style="float:left;width:32px;height:32px;background-image:url(./images/dry-clean.png);background-size:20px;background-position:center center;background-repeat:no-repeat;border-radius:45%;" >' + h + '</div>';
		}
		r += '<div style="clear:both;text-align:center;" >';
			r += '…'
		r += '</div>';
		for ( var m=0; m<=55; m+=5 ){
			r += '<div m="' + m + '" class="vh-center" style="float:left;width:32px;height:32px;background-image:url(./images/dry-clean.png);background-size:20px;background-position:center center;background-repeat:no-repeat;border-radius:45%;" >' + ( '00' + m ).slice(-2) + '</div>';
		}
		// r += '<div class="vh-center" style="clear:both;width:100%;height:30px;padding-top:2px;text-align:center;font-size:18px;font-weight:boldl;border-top:1px solid lightgrey;" >';
		// 	r += '<button class="settime" vh-center" style="width:32px;height:32px;background-color:transparent;border:none;" >';
		// 		r += '<img width="20px" src="./images/check-3.png" />';
		// 	r += '</button>';
		// r += '</div>';
		p.innerHTML = r;
	},
	selection : function( e ){
		var selector = e.target;
		while ( !selector.hasAttribute('selector')) {
			selector = selector.parentNode;
		}

		if ( e.target.hasAttribute( 'h' )) {
			var lst = selector.childNodes;
			for ( var i=0; i<lst.length; i++ ){
				var o = lst[i];
				if ( o.hasAttribute('h')){
					o.style.backgroundColor	= '';
					o.removeAttribute('selected');
				}
			}
			if ( e.target.hasAttribute('selected')) {
				e.target.style.backgroundColor	= '';
				e.target.removeAttribute('selected');
			} else{
				e.target.style.backgroundColor	= 'lightgrey';
				e.target.setAttribute( 'selected', 'yes' );
			}
		}
		if ( e.target.hasAttribute( 'm' )){
			var lst = selector.childNodes;
			for ( var i=0; i<lst.length; i++ ){
				var o = lst[i];
				if ( o.hasAttribute('m')){
					o.style.backgroundColor	= '';
					o.removeAttribute('selected');
				}
			}
			if ( e.target.hasAttribute('selected')) {
				e.target.style.backgroundColor	= '';
				e.target.removeAttribute('selected');
			} else{
				e.target.style.backgroundColor	= 'lightgrey';
				e.target.setAttribute( 'selected', 'yes' );
			}
		}
		var hm = this.getTime( selector );
		selector.getElementsByClassName('specific_time')[0].innerText = hm;
		switch ( selector.getAttribute( 'selector' )){
			case 'sott':
				this.sott = hm;
				break;
			case 'eott':
				this.eott = hm;
				break;
			}
	},
	getTime : function( selector ){
		var hm = 0;
		var btns = selector.childNodes;
		for ( var i=0; i<btns.length; i++ ){
			var o = btns[i];
			if ( o.hasAttribute('selected' ) ){
				if ( o.hasAttribute( 'h' ) )
					hm += parseInt( o.getAttribute('h') ) * 100;
				if ( o.hasAttribute( 'm' ) )
					hm += parseInt( o.getAttribute('m') );
			}
		}
		return hm;

	},
	reset : function(){
		var btns = this.frame1.childNodes;
		for ( var i=0; i<btns.length; i++ ){
			var o = btns[i];
			if ( o.hasAttribute('selected' ) ){
				o.removeAttribute('selected');
				o.style.backgroundColor	= '';
			}
		}
		btns = this.frame2.childNodes;
		for ( var i=0; i<btns.length; i++ ){
			var o = btns[i];
			if ( o.hasAttribute('selected' ) ){
				o.removeAttribute('selected');
				o.style.backgroundColor	= '';
			}
		}
		this.sott	= 0;
		this.eott	= 0;
		this.frame1.getElementsByClassName('specific_time')[0].innerText = '';
		this.frame2.getElementsByClassName('specific_time')[0].innerText = '';

	},
	delete : function(){
		// child_id 取得
		var c = null;
		// var children = document.getElementById('FINDER_AREA').childNodes;
		// for ( var i=0; i<children.length; i++ ){
		// 	c = children[i];
		// 	if ( c.hasAttribute('selected') ) break;
		// }
		c = this.resv_lst;
		while ( ! c.hasAttribute('child_id') ){
			c = c.parentNode;
			if ( c.tagName == 'BODY') return;
		}

		if ( c == null ) return;
		var child_id = c.getAttribute('child_id');
		console.log( 'child_id:' + child_id );

		// リザベーションを取得
		var days = this.resv_lst.childNodes;
		var lst = [];
		for ( var i=0; i<days.length; i++ ){
			var d = days[i];
			if ( d.hasAttribute( 'day' ) && d.hasAttribute( 'selected' )) lst.push( d );
		}

		lst[0].removeAttribute('sott' );
		lst[0].getElementsByClassName('sott_data')[0].innerText = '';
		lst[0].removeAttribute('eott' );
		lst[0].getElementsByClassName('eott_data')[0].innerText = '';
		this.close();
		this.reset();
		this.deleteHelper( lst[0].getAttribute( 'day' ), child_id );

	},
	deleteHelper : function( day, child_id ){
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
						if ( xmlhttp.status == 200 ){
							var result = JSON.parse( xmlhttp.responseText );
							oLog.log( null, result.message );
							oLog.open( 2 );
						}
						break;
				}
			}, false );
		xmlhttp.open("POST", "/accounts/reservedelete", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'day=' + day + '&child_id=' + child_id );
	},
	commit : function(){
		// child_id 取得
		var c = null;
		// var children = document.getElementById('FINDER_AREA').childNodes;
		// for ( var i=0; i<children.length; i++ ){
		// 	c = children[i];
		// 	if ( c.hasAttribute('selected') ) break;
		// }

		c = this.resv_lst;
		while ( ! c.hasAttribute('child_id') ){
			c = c.parentNode;
			if ( c.tagName == 'BODY') return;
		}
		if ( c == null ) return;
		var child_id = c.getAttribute('child_id');
		console.log( 'child_id:' + child_id );

		// リザベーションを取得
		var days = this.resv_lst.childNodes;
		var lst = [];
		for ( var i=0; i<days.length; i++ ){
			var d = days[i];
			if ( d.hasAttribute( 'day' ) && d.hasAttribute( 'selected' )) lst.push( d );
		}
		if ( lst.length == 0 ){
			console.log( 'not select reserve' );
			return;
		}

		// タイムをリザベーションに設定
		if ( this.sott >= 800 && this.eott >= 800 ){
			lst[0].setAttribute('sott', this.sott );
			lst[0].getElementsByClassName('sott_data')[0].innerText = this.sott;
			lst[0].setAttribute('eott', this.eott );
			lst[0].getElementsByClassName('eott_data')[0].innerText = this.eott;
			this.close();
			this.commitHelper( lst[0].getAttribute( 'day' ), this.sott, this.eott, child_id );
		}else{
			oLog.log( null, '時間設定が不十分です.' );
			oLog.open( 3 );
		}
	},
	commitHelper : function( day, sott, eott, child_id ){
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
						if ( xmlhttp.status == 200 ){
							var result = JSON.parse( xmlhttp.responseText );
							oLog.log( null, result.message );
							oLog.open(3);
						}
						break;
				}
			}, false );
		
		console.log( 'day=' + day + '&sott=' + sott + '&eott=' + eott + '&child_id=' + child_id );
		xmlhttp.open("POST", "/accounts/reserveadd", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'day=' + day + '&sott=' + sott + '&eott=' + eott + '&child_id=' + child_id );
	
	},
	open : function( resv_lst ){
		this.resv_lst = resv_lst;
		this.overlay.style.visibility 	= 'visible'; 
		this.frame1.style.visibility 	= 'visible'; 
		this.frame2.style.visibility 	= 'visible'; 
	},
	close : function(){
		this.overlay.style.visibility 	= 'hidden'; 
		this.frame1.style.visibility 	= 'hidden'; 
		this.frame2.style.visibility 	= 'hidden'; 
	}
};

//
//	スケジューラ関連
//
function scheduler( e ){
	var fd = document.getElementById('FINDER_DETAIL')
	var fa = document.getElementById('FINDER_AREA');
	var dr = document.getElementById('DAY_RULER');
	var w = document.body.clientWidth;

	switch ( fd.style.display ){
		case 'inline':
			fa.style.width			= '';
			fa.style.display		= '';
			fa.style.flexWrap		= '';
			fa.style.flexDirection	= '';
			fd.style.width			= '';
			fd.style.left			= '';
			fd.style.display		= '';
			dr.innerHTML			= '';
			break;
		default:
			fa.style.width			= '186px';
			// fa.style.display		= 'flex';
			// fa.style.flexWrap		= 'nowrap';
			// fa.style.flexDirection	= 'column';
			fd.style.width			= ( w - fa.offsetWidth ) + 'px';
			fd.style.left			= '186px';
			fd.style.display		= 'inline';
			dr.style.width			= ( w - fa.offsetWidth ) + 'px';

			details();
			break;
	}
	
}

function details(){
	var fd = document.getElementById('FINDER_DETAIL')
	var fa = document.getElementById('FINDER_AREA');

	makeRuler();

	while ( fd.firstChild ){
		fd.removeChild( fd.firstChild );
	}

	var children = fa.childNodes;
	var week = ['Su','Mo','Tu','We','Th','Fr','Sa'];
	for ( var i=0; i<children.length; i++){
		var c = children[i];
		var o = document.createElement( 'DIV' );
		o.classList.add( 'schedule_detail');
		o.setAttribute( 'child_id', c.getAttribute('child_id') );
		var d = fd.appendChild( o );
		var sm = document.getElementById('SCHEDULE_MONTH').innerText + '/1';
		var dy = new Date( sm ) ;
		var m = dy.getMonth();
		while ( m == dy.getMonth() ){
			var dd = document.createElement('DIV');
			dd.classList.add('schedule_unit');
			if ( dy.getDay() == 1 )
				dd.style.borderLeft = '2px solid lightgrey';
			dd.setAttribute('schedule_unit', 'yes' );
			dd.innerHTML			= dy.getDate() + '<br/>' + week[dy.getDay()];
			if ( dy.getDay() == 0 || dy.getDay() == 6 )
				dd.innerHTML			+= '<div style="width:100%;height:4px;background-color:red;" >&nbsp;</div>';
			d.appendChild( dd );
			dy.setDate( dy.getDate() + 1 );
		}
	}
	reserveList();
	resultList();

}

function makeRuler(){
	var week = ['S','M','T','W','T','F','S'];

	var ruler = document.getElementById('DAY_RULER');
	ruler.innerHTML = '';
	var sm = document.getElementById('SCHEDULE_MONTH').innerText + '/1';
	var dy = new Date( sm );
	var m = dy.getMonth();
	while ( m == dy.getMonth() ){
		var dd = document.createElement('DIV');
		dd.classList.add('schedule_unit');
		if ( dy.getDay() == 1 )
			dd.style.borderLeft = '2px solid lightgrey';
		dd.innerHTML			= week[dy.getDay()] + '&nbsp;' + dy.getDate();
		ruler.appendChild( dd );
		dy.setDate( dy.getDate() + 1 );
	}

}
//
//	リザーブ情報をレンダリング
//
function reserveList(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
				break;
			case 2://header received
				break;
			case 3://loading
				oLog.log( null, 'reserve list...' );
				oLog.open( 3 );
				break;
			case 4://done
				r = '';
				if ( xmlhttp.status == 200 ){
					var results = JSON.parse( xmlhttp.responseText );
					oLog.log( null, 'reserve list loaded.');
					oLog.open(2);
					renderingSchedule( results, 'reserves' );
			} else{
					alert( xmlhttp.status );
				}
				break;
		}
	}

	try{
		var range_id = cur_range_id;
		var sm = document.getElementById('SCHEDULE_MONTH').innerText + '/1';
		var dy = new Date( sm );
		var dy2 = new Date( sm );
		dy2.setMonth( dy2.getMonth() + 1 );
		dy2.setDate( dy2.getDate() - 1 );
		var sotd = dy.getFullYear() + '/' + ( dy.getMonth()+1 ) + '/1';
		var eotd = dy2.getFullYear() + '/' + ( dy2.getMonth()+1 ) + '/' + dy2.getDate();

		xmlhttp.open("POST", "/accounts/reservelist", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( "range_id=" + range_id + '&sotd=' + sotd + '&eotd=' + eotd );
	} catch ( e ) {
		oLog.log( null, 'reserve list:e:' + e );
		oLog.open( 3 );
	}

}

//
//	リザルト情報をレンダリング
//
function resultList(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
				break;
			case 2://header received
				break;
			case 3://loading
				oLog.log( null, 'result list...' );
				oLog.open( 3 );
				break;
			case 4://done
				r = '';
				if ( xmlhttp.status == 200 ){
					var results = JSON.parse( xmlhttp.responseText );
					oLog.log( null, 'result list loaded.');
					oLog.open(2);
					renderingSchedule( results, 'results' );
			} else{
					alert( xmlhttp.status );
				}
				break;
		}
	}

	try{
		var range_id = cur_range_id;
		var sm = document.getElementById('SCHEDULE_MONTH').innerText + '/1';
		var dy = new Date( sm );
		var dy2 = new Date( sm );
		dy2.setMonth( dy2.getMonth() + 1 );
		dy2.setDate( dy2.getDate() - 1 );
		var sotd = dy.getFullYear() + '/' + ( dy.getMonth()+1 ) + '/1';
		var eotd = dy2.getFullYear() + '/' + ( dy2.getMonth()+1 ) + '/' + dy2.getDate();

		xmlhttp.open("POST", "/accounts/resultlist2", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( "range_id=" + range_id + '&sotd=' + sotd + '&eotd=' + eotd );
	} catch ( e ) {
		oLog.log( null, 'reserve list:e:' + e );
		oLog.open( 3 );
	}

}


function renderingSchedule( results, data_type ){
	for ( var i=0; i<results.length; i++ ){
		var rs = results[i];
		var child_id = rs.child_id;
		var s = scanScheduleDetail( child_id );
		if ( s == null ) continue;
		var day = new Date( rs.day );
		var dy = day.getDate() - 1;
		var o = document.createElement('DIV');
		switch ( data_type ){
			case 'reserves':				//	リザーブ情報
				o.classList.add('schedule_reserve_unit');
				var r = '';
				r += '<div style="text-align:center;" >' + rs.sott.substr(0,5).replace(':','') + '</div>';
				r += '<div style="text-align:center;" >' + rs.eott.substr(0,5).replace(':','') + '</div>';
				o.innerHTML = r;
				break;
			case 'results':					//	リザルト情報
				o.classList.add('schedule_result_unit');
				var r = '';
				switch ( rs.checkout ){
					case null:
					case 'null':
					case '':
						r += '<div>' + rs.estimate.substr(0,5).replace(':','') + '</div>';
						break;
					default:
						r += '<div>';
						r += '<img width="9px" src="./images/checked-symbol.png" />';
						r += rs.estimate.substr(0,5).replace(':','') + '</div>';
						break;
				}
				// r += '<div>' + rs.checkout + '</div>';
				switch ( rs.escort ){
					case '0':
					case 0:
						r += '<div><img width="10px" src="./images/user-2.png" /></div>';
						break;
					default:
						r += '<div><img width="10px" src="./images/family.png" /></div>';
						break;
				}
				switch ( rs.direction ){
					case 'left':
						r += '<div><img width="10px" src="./images/prev.png" /></div>';
						break;
					case 'right':
						r += '<div><img width="10px" src="./images/next.png" /></div>';
						break;
				}
				o.innerHTML = r;
			break;
		}
		s.childNodes[dy].appendChild( o );

		// s.childNodes[dy].innerHTML += '●';

	}
}

function scanScheduleDetail( child_id ){
	var fd = document.getElementById('FINDER_DETAIL');
	var scheds = fd.childNodes;
	for ( var i=0; i<scheds.length; i++ ){
		var s = scheds[i];
		if ( child_id == s.getAttribute('child_id' ) ) return s;
	}
	return null;
}