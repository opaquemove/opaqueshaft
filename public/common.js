
// サインインID
var acc_id = null;

var neverCloseDialog = false;

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
//	アカウント情報を取得
//
function getAccount( id ){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/accounts/property", false );
	xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xmlhttp.send( 'acc=' + id );
	if ( xmlhttp.status == 200 ){
		//alert( xmlhttp.responseText );
		var result = JSON.parse( xmlhttp.responseText );
		return ( result != null )? result:null;	
	} else return null;

}

//
//  モーダルダイアログを準備
//
function initModalDialog(){

    var r = '';
	r += '<div id="MODAL_OVERLAY" class="not_select vh-center" >';
		r += '<div id="MODAL_MESSAGE_FRAME" >';
			r += '<div id="MODAL_MESSAGE_HEADER" >';
				r += '<div id="OPAQUESHAFT_DIALOG_TITLE">';
					r += '&nbsp;OpaqueShaft';
                r += '</div>';
                r += '<div id="MODAL_TITLE" >';
                r += '</div>';
            r += '</div>';
            r += '<div id="MODAL_MESSAGE" >';
            r += '</div>';
            r += '<div id="MODAL_MESSAGE_FOOTER" >';
            r += '</div>';
        r += '</div>';
    r += '</div>';

    var o = document.createElement('DIV');
    o.innerHTML = r;
    document.body.appendChild( o );

}

//
//	モーダルダイアログをオープン
//
function openModalDialog( title, r , option, proc, dialog_size ){
	// タイムセレクタを非表示
	try { palleteTimeSelector.close(); } catch(e){;}
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
		case 'CHECK':
			mframe.style.width	= '370px';
			mm.style.height		= '440px';
			mo.style.opacity	= 1;
			break;
		case 'DELETE':
			mframe.style.width	= '300px';
			mm.style.height		= '327px';
			mo.style.opacity	= 1;
			break;
		case 'ACCOUNT':
			mframe.style.width	= '300px';
			mframe.style.height	= '';
			mm.style.height		= '327px';
			mo.style.opacity	= 1;
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
				// closeModalDialog();
			}, false );
	} else{
		if ( document.getElementById('MDL_OK') != null ){
			document.getElementById('MDL_OK').addEventListener( 'click',
				function(e){
					closeModalDialog();
				}, false );
		}
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
