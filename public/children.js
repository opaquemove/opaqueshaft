window.onload = init;
window.onresize = fitting;

var w_whiteboard    = null;
var w_child			= null;

var oReserve		= null;
var oLog			= null;

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

	//	ログエリアの初期化
	oLog = new messageLog();

	//	リザーブセレクタ初期化
	oReserve = new reserveSelector();

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

	document.getElementById('BTN_PREV_CHILDREN').addEventListener( 'click',
		function(e){
			var p = document.getElementById('FINDER_AREA');
			prevChildren( p );
		}, false );
	
	oLog.log( null, 'initialized.');
	oLog.open( 2 );
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
					// c.classList.remove('selected');
					// c.removeAttribute('selected');
					// c.getElementsByClassName('appendix')[0].style.display = 'none';
					// c.style.height = '';
					// var children = this.childNodes;
					// for ( var i=0; i<children.length; i++ ){
					// 	if ( c!= children[i] )
					// 		children[i].style.display = 'inline'
					// }
				} else{
					if ( ! lf_moved ){
						c.classList.add( 'selected' );
						c.setAttribute( 'selected', 'yes' );
						c.style.height = '600px';
						var appx = c.getElementsByClassName('appendix');
						for ( var i=0; i<appx.length; i++ ){
							appx[i].style.display = 'inline';
						}
						var result_lst  = c.getElementsByClassName('RESULT_LST')[0];
						var reserve_lst = c.getElementsByClassName('RESERVE_LST')[0];
						var child_id = c.getAttribute('child_id');
						makeResultList( child_id, result_lst );
						makeReserveList( child_id, reserve_lst );
	
						var children = this.childNodes;
						for ( var i=0; i<children.length; i++ ){
							if ( c!= children[i] )
								children[i].style.display = 'none'
						}
					}
				}
			}

			break;
	}
}

function prevChildren( p ){
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

function scanChild( o ) {
    while ( true ) {
        var tn = o.tagName;
        if ( tn.toLowerCase() == "body" ) return null;
        // if ( o.getAttribute("child") == "yes" ) return o;
        if ( o.hasAttribute("child_id") ) return o;
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
					//var fcl = document.getElementById( 'FIND_CHILD_LST' );
					//if ( fcl != null ) fcl.innerText = 'access...';
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
							c.setAttribute("class",       "PALLETE_CHILD");
							c.setAttribute('kana',        kana );
							c.setAttribute('child_type',  child_type );
							c.setAttribute('child_grade', child_grade );
							// c.setAttribute("draggable",   "true");
							c.style.margin	        = '1px';
							c.style.padding			= '2px';
							c.style.float           = 'left';
							var cc = fa.appendChild( c );
							var cc_width = cc.offsetWidth;

							r = '';
							r += '<div style="float:left;width:' + cc_width + 'px;height:86px;overflow:hidden;" >';
								if ( imagefile != ''){
									r += '<div style="float:left;width:70px;height:70px;color:dimgrey;font-size:8px;margin:4px;padding:4px;overflow:hidden;border-radius:45%;background-image:url(./images/children/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
										r += '&nbsp;';
									r += '</div>';
								} else{
									r += '<div style="float:left;width:70px;height:70px;color:black;font-size:8px;opacity:0.3;margin:4px;padding:4px;overflow:hidden;border-radius:45%;background-image:url(./images/user-2.png);background-size:30px;background-position:center center;background-repeat:no-repeat;" >';
										r += '&nbsp';
									r += '</div>';
								}
								r += '<div style="float:right;width:168px;height:168px;" >';
									r += '<div class="CHILD_NAME" style="font-size:16px;padding-left:2px;">';
										r += child_name;
									r += '</div>';
									// r += '<div style="padding:1px;text-align:right;" >ID:' + child_id + '</div>';
									r += '<div style="font-size:14px;text-align:right;padding-top:2px;" >';
										r += child_grade + child_type;
										r += '<span style="color:' + arChildGradeColor[ child_grade ] + ';">●</span>';
									r += '</div>';
									r += '<div style="padding:1px;" >' + kana + '</div>';
									r += '<div style="padding:1px;" >id/Range:' + child_id + '/' + range_id + '</div>';
								r += '</div>';
							r += '</div>';
							// r += '<div style="clear:both;" >';
							// 	r += '<div style="padding:1px;" >Type:' + child_type + '</div>';
							// 	r += '<div style="padding:1px;" >Grade:' + child_grade + '</div>';
							// r += '</div>';
							r += '<div class="appendix" style="float:left;width:' + cc_width + 'px;display:none;" >';
								r += '<form id="child_prop_' + child_id + '"  name="child_prop_' + child_id + '" onsubmit="return false;" >';
								r += '<div style="width:100%;padding:4px 0px 4px 0px;font-size:14px;font-weight:bold;border-bottom:1px solid lightgrey;" >Property:</div>';
								r += '<div style="width:97%;height:180px;padding:1px;" >';
									r += '<div style="width:100%;height:24px;padding:4px 0px 2px 0px;" >';
										r += '<input type="text" name="kana"  style="width:100%;"  value="' + kana        + '" />';
									r += '</div>';
									r += '<div style="width:100%;height:24px;padding:2px 0px 2px 0px;" >';
										r += '<input type="text" name="child_name" style="width:100%;" value="' + child_name  + '" />';
									r += '</div>';
									r += '<div style="clear:both;width:100%;" >';
										r += '<textarea name="remark" style="width:98%;" autocomplete="off" >' + remark + '</textarea>';
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
										// r += '<input type="text" name="child_grade0" value="' + child_grade + '" />';
	
									r += '</div>';
									// r += '<div style="clear:both;width:100%;" >';
									// r += '</div>';
									r += '<div style="clear:both;width:100%;" >';
										r += '<input type="hidden" name="child_id" value="' + child_id + '" />';
									r += '</div>';
								r += '</div>';
							r += '</div>';
							
							r += '<div class="appendix" style="float:left;width:' + cc_width + 'px;display:none;" >';
								r += '<div                    style="padding:1px;font-size:14px;font-weight:bold;" >Result:</div>';
								r += '<div class="RESULT_HDR" style="padding:1px;width:250px;height:14px;background-color:#EDEDED;border:1px solid lightgrey;" >';
										r += '<div class="day_data" >Day</div>';
										r += '<div class="estimate_data" >Est</div>';
										r += '<div class="remark_data" >Remark</div>';
								r += '</div>';
								r += '<div class="RESULT_LST" style="padding:1px;width:250px;height:84px;border:1px solid lightgrey;overflow:scroll;" ></div>';
							r += '</div>';

							r += '<div class="appendix" style="float:left;width:97%;display:none;" >';
								r += '<div                     style="padding:1px;font-size:14px;font-weight:bold;" >Reserve:</div>';
								r += '<div class="RESERVE_HDR" style="padding:1px;width:97%;height:14px;background-color:#EDEDED;border:1px solid lightgrey;" >';
									r += '<div class="day_data"  >Day</div>';
									r += '<div class="sott_data" >Sott</div>';
									r += '<div class="eott_data" >Eott</div>';
								r += '</div>';
								r += '<div class="RESERVE_LST" style="padding:1px;width:97%;height:84px;border:1px solid lightgrey;overflow:scroll;" ></div>';
							r += '</div>';

								// r += '<div                    style="padding:1px;font-size:17px;font-weight:bold;" >Reservation:</div>';
								// r += '<div class="RESERV_LST" style="padding:1px;height:84px;border:1px solid lightgrey;" ></div>';
							r += '<div style="padding:10px 1px 1px 1px;width:100%;text-align:center;" >';
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
							var bcomc = cc.getElementsByClassName('BTN_COMMIT_CHILD')[0];
							bcomc.addEventListener( 'click', function(e){
									var cid = scanChild( e.target ).getAttribute('child_id');
									var f = document.forms['child_prop_' + cid ];
									updateChild( f );
								}, false );
							var bcanc = cc.getElementsByClassName('BTN_CANCEL_CHILD')[0];
							bcanc.addEventListener( 'click', function(e){
									var p = document.getElementById('FINDER_AREA');
									prevChildren( p );
								}, false );
							var bcanc = cc.getElementsByClassName('BTN_EXPAND_CHILD')[0];
							bcanc.addEventListener( 'click', function(e){
									var sc = scanChild( e.target );
									if ( sc.style.height == '170px' ){
										sc.style.height	= '';
										// sc.style.height	= '';
									} else {
										sc.style.width	= sc.offsetWidth * 3 + 'px';
										// sc.style.height	= '170px';
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
function makeReserveList( child_id, p ){
	var today = new Date();
	var sotd   = new Date( today.getFullYear() + '/' + ( today.getMonth() + 1 ) + '/' + 1 );
	var curDay = new Date( today.getFullYear() + '/' + ( today.getMonth() + 1 ) + '/' + 1 );
	var curMon = sotd.getMonth();

	var r = '';
	while ( curMon == curDay.getMonth() ){
		var d = curDay.getFullYear() + '/' + ( curDay.getMonth() + 1 ) + '/' + curDay.getDate();
		r += '<div day="' + d + '" style="clear:both;width:100%;height:16px;border-bottom:1px solid lightgrey;" >';
			r += '<div class="day_data"   >' + d + '</div>';
			r += '<div class="sott_data"  ></div>';
			r += '<div class="eott_data"  ></div>';
		r += '</div>';
		curDay.setDate( curDay.getDate() + 1 );
	}
	p.innerHTML = r;
	p.addEventListener('click',
		function(e){
			var o = e.target;
			while ( ! o.hasAttribute('day')){
				o = o.parentNode;
			}
			if ( o.hasAttribute('day')){
				console.log('day:' + o.getAttribute('day') );
				if ( o.hasAttribute('selected')){
					o.removeAttribute('selected');
					o.classList.remove('selected2');
				} else{
					var daylst = this.childNodes;
					for ( var i=0; i<daylst.length; i++ ){
						if ( daylst[i].hasAttribute('selected')){
							daylst[i].removeAttribute('selected');
							daylst[i].classList.remove('selected2');
						}
					}
					o.setAttribute('selected', 'yes' );
					o.classList.add('selected2');
					oReserve.open( o.parentNode );
				}
			}
		}, false );


}

//
//	チャイルド更新
//
function updateChild( f ){

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

		var child_id 	= f.child_id.value;
		var child_name 	= f.child_name.value;
		var kana		= f.kana.value;
		var remark		= encodeURIComponent( f.remark.value );
		var child_grade = f.child_grade.value;
		var child_type	= f.child_type.value;
		// var child_type2	= f.child_type2.value;

		console.log( 'child update: ' + child_id +',' + child_name);
		// console.log('child_type2:' + child_type2 );

		xmlhttp.open("POST", "/accounts/childupdate", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'child_id=' + child_id + '&child_name=' + child_name + '&kana=' + kana + '&remark=' + remark + '&child_grade=' + child_grade + '&child_type=' + child_type );

}

//
//	チャイルド作成フォーム
//
function newChildForm(){
	var r = '';
	r += makeChildForm( null );
	openModalDialog( null, r, 'NOBUTTON', null, null );
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
	oLog.log( null, 'newChildSend : ' + result );
	// alert( result );
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

function reserveSelector(){
	this.overlay				= null;
	this.frame1					= null;		//	sott用エリア
	this.frame2					= null;		//	eott用エリア
	this.resv_lst				= null;		//	予約リストオブジェクト
	this.sott					= null;		//	開始時刻
	this.eott					= null;		//	終了時刻

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

	// var selection = function(e){
	// };

	// var setTime = function(e){
	// };

	this.overlay.addEventListener( 'click',
		( function(e){
			if ( e.target == this.overlay) this.close();
		} ).bind( this ), false );

	this.frame1.addEventListener( 'click', ( this.selection ).bind( this ), false );
	this.frame2.addEventListener( 'click', ( this.selection ).bind( this ), false );

	this.frame1.getElementsByClassName('settime')[0].addEventListener( 'click', ( this.setTime ).bind( this ), false );
	this.frame2.getElementsByClassName('settime')[0].addEventListener( 'click', ( this.setTime ).bind( this ), false );

	this.close();

}

reserveSelector.prototype = {
	makeButton : function( hdr, p ){
		var r = '';
		r += '<div style="width:100%;height:30px;padding-top:12px;text-align:center;font-size:18px;font-weight:boldl;border-bottom:1px solid lightgrey;" >' + hdr + '</div>';
		for ( var h=8; h<=19; h++ ){
			r += '<div h="' + h + '" class="vh-center" style="float:left;width:32px;height:32px;background-image:url(./images/dry-clean.png);background-size:20px;background-position:center center;background-repeat:no-repeat;border-radius:45%;" >' + h + '</div>';
		}
		r += '<div style="clear:both;text-align:center;" >';
			r += '…'
		r += '</div>';
		for ( var m=0; m<=55; m+=5 ){
			r += '<div m="' + m + '" class="vh-center" style="float:left;width:32px;height:32px;background-image:url(./images/dry-clean.png);background-size:20px;background-position:center center;background-repeat:no-repeat;border-radius:45%;" >' + ( '00' + m ).slice(-2) + '</div>';
		}
		r += '<div class="vh-center" style="clear:both;width:100%;height:30px;padding-top:2px;text-align:center;font-size:18px;font-weight:boldl;border-top:1px solid lightgrey;" >';
			r += '<button class="settime" vh-center" style="width:32px;height:32px;background-color:transparent;border:none;" >';
				r += '<img width="20px" src="./images/check-3.png" />';
			r += '</button>';
		r += '</div>';
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
		switch ( selector.getAttribute( 'selector' )){
			case 'sott':
				this.sott = hm;
				break;
			case 'eott':
				this.eott = hm;
				break;
			}
	},
	setTime : function( e ){
		var selector = e.target;
		while ( !selector.hasAttribute('selector')) {
			selector = selector.parentNode;
		}
		var children = document.getElementById('FINDER_AREA').childNodes;
		var c = null;
		for ( var i=0; i<children.length; i++ ){
			c = children[i];
			if ( c.hasAttribute('selected') ) break;
		}
		if ( c == null ) return;
		console.log( 'child_id:' + c.getAttribute('child_id') );

		var days = this.resv_lst.childNodes;
		var lst = [];
		for ( var i=0; i<days.length; i++ ){
			var d = days[i];
			if ( d.hasAttribute( 'day' ) && d.hasAttribute( 'selected' )) lst.push( d );
		}
		
		var hm = 0;
		hm = this.getTime( selector );
		console.log( 'hm:' + hm );
		console.log( 'days:' + lst[0].getAttribute( 'day' ) );
		switch ( selector.getAttribute('selector')){
			case 'sott':
				lst[0].getElementsByClassName('sott_data')[0].innerText = hm;
				break;
			case 'eott':
				lst[0].getElementsByClassName('eott_data')[0].innerText = hm;
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

