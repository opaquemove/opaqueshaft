/*
 * このスクリプトはBODYタグで処理すること
 * 出ないとsocketの初期化がうまくいかない
*/

var socket = io();

const arChildGrade = ['','4px solid lightcoral', '4px solid lightgreen', '4px solid lightblue','4px solid lightcyan','4px solid lightyellow','4px solid lightseagreen'];
const arChildGradeColor = ['','lightcoral', 'lightgreen', 'lightblue', 'lightcyan', 'lightyellow','lightseagreen'];

socket.on( 'getaccountlist', function ( msg ) {
    var r = "";
    var accs = eval( msg );
    var o = document.getElementById('AREA');
    o.style.visibility = 'visible';
//    r += "<pre>";
    for (var i=0; i<accs.length; i++) {
        r += accs[i].acc_id + '<br/>'; 
    }
    //r += msg;
    r += '<br/>length:' + accs.length;
//    r += "</pre>";
    r += "<div>";
    r += "<button onclick='clearArea();' >OK</button>";
    r += "</div>";
    o.innerHTML = r;

})

function getAccountList(){
	socket.emit( 'cmd', 'getaccountlist' );
}

//
//  サーバからチャイルドリストを取得し、実体化
//
socket.on( 'getchildrenlist', function ( msg ) {
    var r = "";
    var children = eval( msg );
    var o = document.getElementById('AREA');
    o.style.visibility = 'visible';
    for (var i=0; i<children.length; i++) {
        r += children[i].child_name + '<br/>'; 
        addChild( i * 20, i * 20, 'OFF', children[i].child_id,
             children[i].child_name, children[i].child_type, children[i].child_grade );
    }
    r += '<br/>length:' + children.length;

    r += "<div>";
    r += "<button onclick='clearArea();' >OK</button>";
    r += "</div>";
    o.innerHTML = r;

})


function loadChildrenForm(){
	var r = "";
	
	r += "<div style='width:400px;height:100%;margin:10px auto;background-color:white;overflow:hidden;' >";
		r += "<div id='OPAQUESHAFT_LOGINTITLE' >";
		r += "&nbsp;&nbsp;OpaqueShaft";
		r += "</div>"; 
		r += "<div style='height:40px;padding-top:20px;text-align:center;font-size:20px;' >Load children...</div>";
		r += "<div id='LOADCHILDREN_STATUS' style='height:20px;text-align:center;' >status</div>";
			r += "<div style='text-align:center;' >";
				r += "<button style='width:208px;' type='button' tabindex=3 onclick='loadChildren()' >load</button>";
				r += "<button type='button' tabindex=4 onclick='clearArea();' >cancel</button>";
			r += "</div>";
	r += "</div>";
	var o = document.getElementById('AREA');
	o.innerHTML = r;
	o.style.visibility = 'visible';
	o = document.getElementById( 'id' ); 
}
//
//  チャイルドローディング
//
function loadChildren(){
	socket.emit( 'cmd', 'getchildrenlist' );
}

//
//  ホワイトボードの全チャイルドを削除
//
function clearWhiteboard(){
	var r = "";
    var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
		r += 'clear whiteboard';
	r += '</div>';
	r += '<div style="margin:0 auto;width:110px;">';
		r += '<button id="BTN_CLEARWHITEBOARD" type="button"  style="width:100px;height:20px;font-size:12px;" onclick="clearWhiteboardHelper();" >Clear</button>';
	r += '</div>';
    openModalDialog( r, 'NORMAL' );
    document.getElementById('BTN_CLEARWHITEBOARD').focus();

}
function clearWhiteboardHelper(){
    var wb = document.getElementById('WHITEBOARD');
    while ( wb.firstChild){
            wb.removeChild( wb.firstChild );
    }
    showWhiteboardChildCount();
}

//
//  WhiteBoardにチャイルド(200x60)を実体化
//
function addChild( top, left, escort, child_id, child_name, child_type, child_grade ){
	var o = document.getElementById('AREA');
	o.style.visibility = 'hidden';

	var wb = document.getElementById('WHITEBOARD');
    var c = document.createElement("DIV");
    c.setAttribute("child", "yes");
    c.setAttribute('child_id', child_id ) ;
	c.setAttribute("id", "c_1");
    c.setAttribute("class", "CHILD drag-and-drop");
    if ( escort == 'ON')
        c.setAttribute('escort', 'yes' );
    c.style.position    = 'absolute;'
	c.style.top         = top + 'px';
    c.style.left        = left + 'px';
    c.style.borderRight = arChildGrade[ child_grade ];

    var hm = coordinateToTime( top, left );
    var r = '';
 //   r += '<div style="width:4px;height:100%;float:left;background-color:' + arChildGradeColor[child_grade] + ';" ></div>';
    r += '<div style="height:47px;padding-left:2px;" >';
        r += '<div style="width:100%;height:30px;font-size:14px;border-bottom:1px solid lightgrey;" >';
            r += '<div style="height:20px;float:left;" >' + child_name + '</div>';
            r += '<div class="ESCORT_FLG" style="height:20px;padding-left:2px;float:right;width:18px;" >&nbsp;';
            r += '</div>';
            r += '<div class="CO_TIME" style="height:20px;padding-left:2px;float:right;text-align:right;" >';
                r += hm;
            r += '</div>';
            r += '<div style="float:right;text-align:right;" >';
            r += child_type + '' + child_grade;
            r += '</div>';
        r += '</div>';
        r += '<div id="CHECKOUT_' + child_id + '" style="clear:both;height:15px;text-align:right;font-size:10px;" >';
            r += '&nbsp;&nbsp;checkout:'
        r += '</div>';
    r += '</div>';
    r += '<div class="CHILD_TRAY" >tray</div>';
    r += '<div class="CHILD_KNOB" ></div>';

	c.innerHTML = r;
    var cc = wb.appendChild( c );
    setEscortHelper( cc, escort );
    cc.addEventListener( 'dblclick',   propertyWhiteboardChild, false );
	cc.addEventListener( "mousedown",  mDown, false );
    cc.addEventListener( "touchstart", mDown, false );
    cc.getElementsByClassName('CHILD_KNOB')[0].addEventListener('mousedown',
        (function(e){
            e.stopPropagation();
         //   e.target.style.backgroundColor = 'red';
            console.log( this.previousSibling.innerText );
            switch( this.previousSibling.style.display ){
                case '':
                case 'none':
                    this.previousSibling.style.display = 'inline';
                    this.style.backgroundImage = 'url(./images/arrow-up.png)';
                    break;
                default:
                    this.previousSibling.style.display = 'none';
                    this.style.backgroundImage = 'url(./images/arrow-down.png)';
                    break;
            }
        }).bind(cc.getElementsByClassName('CHILD_KNOB')[0]), false );

}

//
//  管理用・パレット用チャイルドを実体化
//
function addChildManage( oParent, oChild ){

    var c = document.createElement("DIV");
    c.setAttribute("child",     "yes");
    c.setAttribute("child_id",  oChild.child_id );
	c.setAttribute("id",        "c_1");
    c.setAttribute("class",     "PALLETE_CHILD");
    c.setAttribute("draggable", "true");
//    c.style.width       = '97%';
    c.style.height      = '40px';
    c.style.borderRight = arChildGrade[ oChild.child_grade ];
    var r = '';
    r += '<div style="height:20px;font-size:14px;padding-left:2px;border-bottom:1px solid lightgrey;">';
    r += oChild.child_name;
    r += '</div>';
    r += '<div style="font-size:10px;text-align:right;padding-top:2px;" >';
    r += 'type:' + oChild.child_type + '&nbsp; Grade:' + oChild.child_grade;
    r += '</div>';

	c.innerHTML = r;
    var cc = oParent.appendChild( c );
	cc.addEventListener('dragstart',
		function(e) {
            dndOffsetX = e.offsetX;
            dndOffsetY = e.offsetY;
            console.log( e.dataTransfer );
            console.log('offsetY:' + dndOffsetY + ' OffsetX:' + dndOffsetX );
			e.dataTransfer.setData('text', e.target.getAttribute( 'child_id' ) );
		} );

}

//
//  チャイルドプロパティ
//
function propertyWhiteboardChild( e ){
    var c = scanChild( e.target );
    if ( c == null ){
        alert('プロパティが見つかりません');
        return;
    }
    markChild( c );
    propChild = c;


    var id = c.getAttribute('child_id');
    console.log( id );
    var oChild = getChild( id );
	var r = "";
	r += "<div style='width:300px;height:100%;margin:10px auto;background-color:white;opacity:0.75;' >";
        r += "<div style='font-size:16px;border-bottom:1px solid lightgrey;' >";
        r += oChild.child_name;
        r += "</div>";
        r += "<div style='padding-top:10px;' >checkout time:" + c.getAttribute('checkout') + "</div>";
        r += "<div style='padding-top:60px;border-top:1px solid lightgrey;' >";
        r += "<button type='button' onclick='checkclearChild();' >checkout clear</button>";
        r += "&nbsp;<button type='button' onclick='checkoutChild();'   >checkout</button>";
        r += "</div>";
    r += "</div>";
    openModalDialog( r, 'NORMAL' );

//	var o = document.getElementById('AREA');
//	o.innerHTML = r;
//	o.style.visibility = 'visible';

}


//
//  マークしたチャイルドの削除
//
function deleteWhiteboardChild(){
    var p = document.getElementById( 'WHITEBOARD');
    var children = p.getElementsByClassName('CHILD');

    if ( children.length == 0) return;

    var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
		r += 'delete child';
	r += '</div>';
	r += '<div style="margin:0 auto;width:110px;">';
		r += '<button id="BTN_DELETEWHITEBOARDCHILD" type="button"  style="width:100px;height:20px;font-size:12px;" onclick="deleteWhiteboardChildHelper();" >Delete</button>';
	r += '</div>';
    openModalDialog( r, 'NOBUTTON' );
    document.getElementById('BTN_DELETEWHITEBOARDCHILD').focus();
 
}

//
//  マークしているチャイルドを削除（非表示処理）
//
function deleteWhiteboardChildHelper(){
    closeModalDialog();
    var p = document.getElementById( 'WHITEBOARD');
    var c = p.firstChild;
    while( c ){
        if ( c.getAttribute('marked') == 'MARKED'){
            p.removeChild( c );
            c = p.firstChild;
        } else {
            c = c.nextSibling;
        }
    }
    showWhiteboardChildCount();
}

//
//  マークしたチャイルドのコレクション取得
//
function getMarkedChild(){
    var children = [];
    var index = 0;
    var p = document.getElementById( 'WHITEBOARD');
    var c = p.firstChild;
    while( c ){
        if ( c.getAttribute('marked') == 'MARKED')
            children[index++] = c;
        c = c.nextSibling;
    }
    return children;

}

//
//  ダブルクリックしたノードからChildノードを検索
//
function scanChild( o ) {
    while ( true ) {
        var tn = o.tagName;
        if ( tn.toLowerCase() == "body" ) return null;
        if ( o.getAttribute("child") == "yes" ) return o;
        o = o.parentNode;
    }
}

//
//  チャイルドのマーク
//
function markChild( c ) {
    if ( c == null ) return;
    c.setAttribute('marked', 'MARKED' );
    c.style.backgroundColor = '#EEEEEE';
    c.style.color           = 'gray';
}

//
//  チャイルドのマーク解除
//
function unmarkChild( c ) {
    if ( c == null ) return;
    c.removeAttribute('marked');
    c.style.backgroundColor = '';
    c.style.color           = '';
    // コンテキストメニューの削除
    var cMenu = c.lastChild;
    if ( cMenu.hasAttribute('cmenu'))
        c.removeChild(cMenu);

}

//
//  ホワイトボードのチャイルド数をステータス表示
//
function showWhiteboardChildCount(){
    var wb  = document.getElementById('WHITEBOARD');
    var children = wb.getElementsByClassName('CHILD');
    var wcc = document.getElementById('ID_WHITEBOARD_CHILD_COUNT');
    wcc.innerText = children.length;
}

//
//  ホワイトボード内の最後尾のチャイルド取得
//
function latestWhiteboardChild(){
    var wb = document.getElementById('WHITEBOARD');
    var children = wb.getElementsByClassName('CHILD');
    if ( children == null ) return null;

    return children[children.length-1];
}

//
//  マークしているチャイルドをエスコート設定（お迎え）
//
function escortChild(){
    var children = getMarkedChild();
    if ( children.length == 0 ) return;
    for ( var i=0; i<children.length; i++){
        var c = children[i];
        if ( ! c.hasAttribute('escort') ){
            c.setAttribute('escort', 'yes');
            setEscortHelper( c, 'ON' );
            // c.firstChild.style.backgroundImage = 'url(./images/user.png)';
            // c.firstChild.style.backgroundPosition = 'right bottom';
            // c.firstChild.style.backgroundRepeat = 'no-repeat';
            // c.firstChild.style.backgroundSize   = '16px';
        }
    }
}

//
//  マークしているチャイルドをエスコート設定（お迎え）
//
function unescortChild(){
    var children = getMarkedChild();
    if ( children.length == 0 ) return;
    for ( var i=0; i<children.length; i++){
        var c = children[i];
        if ( c.hasAttribute('escort') ){
            c.removeAttribute('escort');
            setEscortHelper( c, 'OFF' );
            // c.firstChild.style.backgroundImage = '';
            // c.firstChild.style.backgroundPosition = '';
            // c.firstChild.style.backgroundRepeat = '';
            // c.firstChild.style.backgroundSize   = '';
        }
    }
}

//
//
//
function setEscortHelper( c, flag ){
    var escort_flg = c.getElementsByClassName('ESCORT_FLG');
    var escort = escort_flg[0];
    switch ( flag ){
        case 'ON':
            escort.style.backgroundImage = 'url(./images/user.png)';
            escort.style.backgroundPosition = 'center center';
            escort.style.backgroundRepeat = 'no-repeat';
            escort.style.backgroundSize   = '14px';
            break;
        case 'OFF':
        default:
            escort.style.backgroundImage = '';
            escort.style.backgroundPosition = '';
            escort.style.backgroundRepeat = '';
            escort.style.backgroundSize   = '';
            break;
    }
}
//
//  Childをチェックアウト（帰宅）
//
function checkoutChild(){
    if ( ! propChild ) return;
    var now = new Date();
    var h = ( '00' + now.getHours() ).slice(-2);
    var m = ( '00' + now.getMinutes() ).slice(-2);
    var checkout_time = h + ':' + m;
    propChild.setAttribute('checkout', checkout_time );
    console.log( propChild.getAttribute('child_id') );
    document.getElementById( 'CHECKOUT_' + propChild.getAttribute('child_id') ).innerText =
        'checkout:' + checkout_time;
    //propChild.style.opacity = 0.3;
    propChild.style.backgroundImage    = 'url(./images/check.png)';
    propChild.style.backgroundPosition = 'left bottom';
    propChild.style.backgroundRepeat   = 'no-repeat';
    propChild.style.backgroundSize     = '16px';
    
}

//
//  Childをチェッククリア（帰宅）
//
function checkclearChild(){
    if ( ! propChild ) return;
    propChild.removeAttribute('checkout' );
    document.getElementById( 'CHECKOUT_' + propChild.getAttribute('child_id') ).innerText = 'checkout:';
    //propChild.style.opacity = 1;
    propChild.style.backgroundImage    = '';
    propChild.style.backgroundPosition = '';
    propChild.style.backgroundRepeat   = '';
    propChild.style.backgroundSize     = '';

}


//
//  アカウントプロパティ
//
function propertyAccount(){
	var r = "";
	r += "<div style='width:400px;height:100%;margin:10px auto;background-color:white;opacity:0.75;overflow:hidden;' >";
        r += "<div id='OPAQUESHAFT_LOGINTITLE' >";
        r += "&nbsp;&nbsp;OpaqueShaft";
        r += "</div>"; 
        r += "<div style='height:40px;padding-top:20px;text-align:center;font-size:20px;' >Property of Account</div>";
        r += "<div style='border-left:3px solid red;border-bottom:1px solid lightgrey;' >";
        r += "";
        r += "</div>";
        r += "<div>";
            r += "<form name='sign_form' onsubmit='return false;' >";
                r += "<table align='center' >";
                r += "<tr>";
                r += "<td>Account ID:</td>";
                r += "</tr>";
                r += "<tr>";
                r += "<td><input style='width:200px;' type='text' id='acc_id' name='id' tabindex=1 /></td>";
                r += "</tr>";
                r += "<tr>";
                r += "<td>Account Name:</td>";
                r += "<tr>";
                r += "<tr>";
                r += "<td><input style='width:200px;height:18px;' type='text' name='pwd' tabindex=2 /></td>";
                r += "<tr>";
                r += "</table>";
            r += "</form>";
        r += "</div>";
        r += "<div style='padding-top:60px;border-top:1px solid lightgrey;' >";
        r += "<button type='button' onclick=''                   >ok</button>";
        r += "<button type='button' onclick='clearArea();'       >close</button>";
        r += "</div>";
    r += "</div>";
	var o = document.getElementById('AREA');
	o.innerHTML = r;
	o.style.visibility = 'visible';

}

