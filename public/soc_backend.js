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
        addChild( i * 20, i * 20, children[i].child_id,
             children[i].child_name, children[i].child_type, children[i].child_grade );
    }
    r += '<br/>length:' + children.length;

    r += "<div>";
    r += "<button onclick='clearArea();' >OK</button>";
    r += "</div>";
    o.innerHTML = r;

})

/*
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
*/

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
function addChild( top, left, child_id, child_name, child_type, child_grade ){

	var wb = document.getElementById('WHITEBOARD');
    var c = document.createElement("DIV");
    c.setAttribute("child", "yes");
    c.setAttribute('child_id', child_id ) ;
	c.setAttribute("id", "c_1");
    c.setAttribute("class", "CHILD drag-and-drop");
    // if ( escort == 'ON')
    //     c.setAttribute('escort', 'yes' );
    c.style.position    = 'absolute;'
	c.style.top         = top + 'px';
    c.style.left        = left + 'px';
    c.style.borderRight = arChildGrade[ child_grade ];

    var hm = coordinateToTime( top, left );
    var escort = coordinateToEscort( top, left );
    if ( escort ){
        c.setAttribute('escort', 'yes' );
    }

    var r = '';
 //   r += '<div style="width:4px;height:100%;float:left;background-color:' + arChildGradeColor[child_grade] + ';" ></div>';
    r += '<div style="height:40px;padding-left:2px;" >';
        r += '<div style="width:100%;height:28px;font-size:14px;border-bottom:1px solid lightgrey;" >';
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
        r += '<div id="CHECKOUT_' + child_id + '" style="clear:both;height:12px;text-align:right;font-size:10px;" >';
            r += '&nbsp;&nbsp;checkout:'
        r += '</div>';
    r += '</div>';

	c.innerHTML = r;
    var cc = wb.appendChild( c );
    setEscortHelper( cc, (escort)?'ON':'OFF' );
	cc.addEventListener( "mousedown",  mDown, false );
    cc.addEventListener( "touchstart", mDown, false );

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
    c.style.position    = 'relative';
//    c.style.width       = '97%';
    c.style.height      = '30px';
    c.style.borderBottom= '1px solid lightgrey;'
    c.style.borderRight = arChildGrade[ oChild.child_grade ];
    var r = '';
    r += '<div style="float:left;height:20px;font-size:14px;padding-left:2px;">';
    r += oChild.child_name;
    r += '</div>';
    r += '<div style="float:right;font-size:14px;text-align:right;padding-top:2px;" >';
    r += oChild.child_type + oChild.child_grade;
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
//  チャイルドプロパティ(SINGLE base)
//
function propertyWhiteboardChild( c ){

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
        r += "<button type='button' style='width:260px;font-size:24px;' ";
        r += " onclick='checkoutClearChild(propChild);closeModalDialog();' >";
            r += "<img width='32px' src='./images/close.png' />checkout clear";
        r += "</button>";
        r += "&nbsp;";
        r += "<button type='button' style='width:260px;font-size:24px;' ";
        r += " onclick='checkoutChild(propChild);closeModalDialog();'   >";
            r += "<img width='32px' src='./images/check.png' />checkout";
        r += "</button>";
        r += "</div>";
    r += "</div>";
    openModalDialog( r, 'NORMAL' );

}

//
//  チャイルドの削除（マーク用ラッパー）
//
function deleteWhiteboardMarkChild(){
    deleteWhiteboardChild( 'MARK' );
}

//
//  チャイルドの削除
//  
function deleteWhiteboardChild( proc_mode ){

    var p = document.getElementById( 'WHITEBOARD');
    
    switch ( proc_mode ){
        case 'SINGLE':
            if ( propChild == null ) return;
            break;
        case 'MARK':
            var children = p.getElementsByClassName('CHILD');
            if ( children.length == 0){
                console.log('deleteWhiteboardChild:' + children.length);
                return;
            }
            break;
    }

    var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
		r += 'delete child';
	r += '</div>';
	r += '<div style="margin:0 auto;width:110px;">';
        r += '<button id="BTN_DELETEWHITEBOARDCHILD" type="button" ';
        r += ' style="width:100px;height:20px;font-size:12px;" ';
        switch( proc_mode ){
            case 'SINGLE':
                r += ' onclick="deleteWhiteboardChildSingleHelper();" >Delete</button>';
                break;
            case 'MARK':
                r += " onclick='deleteWhiteboardChildMarkHelper();' >Delete</button>";
                break;
        }
	r += '</div>';
    openModalDialog( r, 'NOBUTTON' );
    document.getElementById('BTN_DELETEWHITEBOARDCHILD').focus();
 
}

//
//  チャイルドを削除（シングル）
//
function deleteWhiteboardChildSingleHelper(){
    console.log('deleteWhiteboardMarkChildHelper' );
    closeModalDialog();
    propChild.parentNode.removeChild( propChild );
    propChild = null;
    showWhiteboardChildCount();
}

//
//  マークしているチャイルドを削除（非表示処理）
//
function deleteWhiteboardChildMarkHelper(){
    console.log('deleteWhiteboardMarkChildHelper' );
    closeModalDialog();
    var p = document.getElementById( 'WHITEBOARD');
    var c = p.firstChild;
    var i=0;
    while( c ){
        if ( c.getAttribute('marked') == 'MARKED'){
            i++;
            p.removeChild( c );
            c = p.firstChild;
        } else {
            c = c.nextSibling;
        }
    }
    showWhiteboardChildCount();
    console.log('delete child:' + i );
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

//  コンテキストメニューが表示されているかをチェック
function existContextMenu( c ){
    var cMenu = c.lastChild;
    return ( cMenu.hasAttribute('cmenu') );

}
//
//  コンテキストメニューが複数表示されないように他のメニューは削除する
//
function clearOtherContextMenu( c ){
    var wb = document.getElementById('WHITEBOARD');
    for ( var i=0; i<wb.childNodes.length; i++ ){
        var o = wb.childNodes[i];
        if ( c != o && o.lastChild.hasAttribute('cmenu') ){
            o.removeChild( o.lastChild );
        }
    }    
}

//
//  ホワイトボードのチャイルド数をステータス表示
//
function showWhiteboardChildCount(){
    var wb  = document.getElementById('WHITEBOARD');
    var children = wb.getElementsByClassName('CHILD');
    var wcc = document.getElementById('ID_WHITEBOARD_CHILD_COUNT');
    wcc.innerText = children.length;
    showWhiteboardChildCountCheckout();
}

//
//  ホワイトボードのチェックアウトしたチャイルド数をステータス表示
//
function showWhiteboardChildCountCheckout(){
    var wb  = document.getElementById('WHITEBOARD');
    var wccc = document.getElementById('ID_WHITEBOARD_CHILD_COUNT_CHECKOUT');
    var children = wb.childNodes.length;
    var c = 0;
    for ( var i=0; i<wb.childNodes.length; i++ ){
        var o = wb.childNodes[i];
        if ( o.hasAttribute('checkout')) c++;
    }
    wccc.innerText = c;
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
// function escortChild(){
//     var children = getMarkedChild();
//     if ( children.length == 0 ) return;
//     for ( var i=0; i<children.length; i++){
//         var c = children[i];
//         if ( ! c.hasAttribute('escort') ){
//             c.setAttribute('escort', 'yes');
//             setEscortHelper( c, 'ON' );
//         }
//     }
// }

//
//  マークしているチャイルドをエスコート設定（お迎え）
//
// function unescortChild(){
//     var children = getMarkedChild();
//     if ( children.length == 0 ) return;
//     for ( var i=0; i<children.length; i++){
//         var c = children[i];
//         if ( c.hasAttribute('escort') ){
//             c.removeAttribute('escort');
//             setEscortHelper( c, 'OFF' );
//         }
//     }
// }

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
function checkoutChild( c ){
    if ( c == null ) return;
    var now = new Date();
    var h = ( '00' + now.getHours() ).slice(-2);
    var m = ( '00' + now.getMinutes() ).slice(-2);
    var checkout_time = h + ':' + m;
    c.setAttribute('checkout', checkout_time );
    console.log( c.getAttribute('child_id') );
    document.getElementById( 'CHECKOUT_' + c.getAttribute('child_id') ).innerText =
        'checkout:' + checkout_time;
    //c.style.opacity = 0.3;
    c.style.backgroundImage    = 'url(./images/check.png)';
    c.style.backgroundPosition = 'left bottom';
    c.style.backgroundRepeat   = 'no-repeat';
    c.style.backgroundSize     = '16px';

    showWhiteboardChildCountCheckout();
    
}

//
//  チャイルドをチェックアウト(マーク用ラッパー)
//
function checkoutWhiteboardMarkChild(){
    checkoutWhiteboardChild('MARK');
}


//
//  チャイルドをチェックアウト
//
function checkoutWhiteboardChild( proc_mode ){
    var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
		r += 'checkout children';
    r += '</div>';
    r += '<div id="ID_MARKEDCHILDREN_LIST" style="margin:0 auto;width:70%;height:180px;border:1px solid lightgrey;overflow:scroll;" >';
    r += '</div>';
	r += '<div style="margin:0 auto;width:110px;margin:0 auto;">';
        r += '<button id="BTN_CLEARWHITEBOARD" type="button" ';
        r += 'style="width:100px;height:30px;font-size:12px;" ';
        switch ( proc_mode ){
            case 'SINGLE':
                r += 'onclick="checkoutWhiteboardChildSingleHelper();closeModalDialog();" >';
                break;
            case 'MARK':
                r += 'onclick="checkoutWhiteboardChildMarkHelper();closeModalDialog();" >';
                break;
        }
        r += '<img width="20px" src="./images/check.png" />Checkout</button>'
	r += '</div>';
    openModalDialog( r, 'NOBUTTON' );
    var imcl = document.getElementById('ID_MARKEDCHILDREN_LIST');
    switch ( proc_mode ){
        case 'SINGLE':
            var id = propChild.getAttribute('child_id');
            var oChild = getChild( id );
            var o = document.createElement('DIV');
            o.style.width = '100%';
            o.style.height = '40px';
            o.style.clear = "both";
            o.style.borderBottom = '1px solid lightgrey';
            r = '';
            r += '<div style="float:left;width:150px;font-size:14px;" >' + oChild.child_name + '</div>';
            r += '<div style="float:right;padding:4px;" ><img width="20px" src="./images/arrow-right.png" /></div>';
            r += '<div style="float:right;padding:4px;" ><img width="20px" src="./images/arrow-left.png" /></div>';
    
            o.innerHTML = r;
            imcl.appendChild( o );
        break;
        case 'MARK':
            var children = getMarkedChild();
            for ( var i=0; i<children.length; i++ ){
                var id = children[i].getAttribute('child_id');
                var oChild = getChild( id );
                var o = document.createElement('DIV');
                o.style.width = '100%';
                o.style.height = '40px';
                o.style.clear = "both";
                o.style.borderBottom = '1px solid lightgrey';
                r = '';
                r += '<div style="float:left;width:150px;font-size:14px;" >' + oChild.child_name + '</div>';
                r += '<div style="float:right;padding:4px;" ><img width="30px" src="./images/arrow-right.png" /></div>';
                r += '<div style="float:right;padding:4px;" ><img width="30px" src="./images/arrow-left.png" /></div>';
        
                o.innerHTML = r;
                imcl.appendChild( o );
            }
            break;
    }
}

//
//  チェックアウトヘルパーラッパー
//
function checkoutWhiteboardChildSingleHelper(){
    checkoutWhiteboardChildHelper( 'SINGLE' );
}

//
//  チェックアウトヘルパーラッパー
//
function checkoutWhiteboardChildMarkHelper(){
    checkoutWhiteboardChildHelper( 'MARK' );
}


//
//  チャイルドをチェックアウト（ヘルパー）
//
function checkoutWhiteboardChildHelper( proc_mode ){
    switch ( proc_mode ){
        case 'SINGLE':
            if ( propChild == null ) return;
            checkoutChild( propChild );
            break;
        case 'MARK':
            var children = getMarkedChild();
            for ( var i=0; i<children.length; i++ ){
                checkoutChild( children[i]);
            }
            break;
    }

}

//
//  チャイルドをチェックアウトクリア(シングル用ラッパー)
//
function checkoutClearWhiteboardSingleChild(){
    checkoutClearWhiteboardChild('SINGLE');
}
//
//  チャイルドをチェックアウトクリア(マーク用ラッパー)
//
function checkoutClearWhiteboardMarkChild(){
    checkoutClearWhiteboardChild('MARK');
}


//
//
//
// function checkclearWhiteboardChild( proc_mode ){
//     switch ( proc_mode ){
//         case 'SINGLE':
//             checkclearChild(propChild);
//             break;
//         case 'MARK':
//             break;
//     }
// }

//
//  チャイルドをチェックアウトクリア
//
function checkoutClearWhiteboardChild( proc_mode ){
    var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
		r += 'checkout clear children';
    r += '</div>';
    r += '<div id="ID_MARKEDCHILDREN_LIST" style="margin:0 auto;width:70%;height:180px;border:1px solid lightgrey;overflow:scroll;" >';
    r += '</div>';
	r += '<div style="margin:0 auto;width:110px;margin:0 auto;">';
        r += '<button id="BTN_CLEARWHITEBOARD" type="button" ';
        r += 'style="width:140px;height:30px;font-size:12px;" ';
        switch ( proc_mode ){
            case 'SINGLE':
                r += 'onclick="checkoutClearWhiteboardChildSingleHelper();closeModalDialog();" >';
                break;
            case 'MARK':
                r += 'onclick="checkoutClearWhiteboardChildMarkHelper();closeModalDialog();" >';
                break;
        }
        r += '<img width="24px" src="./images/close.png" />Checkout Clear</button>';
	r += '</div>';
    openModalDialog( r, 'NOBUTTON' );
    var imcl = document.getElementById('ID_MARKEDCHILDREN_LIST');
    switch ( proc_mode ){
        case 'SINGLE':
            var id = propChild.getAttribute('child_id');
            var oChild = getChild( id );
            var o = document.createElement('DIV');
            o.style.width = '100%';
            o.style.height = '40px';
            o.style.clear = "both";
            o.style.borderBottom = '1px solid lightgrey';
            r = '';
            r += '<div style="float:left;width:150px;font-size:14px;" >' + oChild.child_name + '</div>';
    
            o.innerHTML = r;
            imcl.appendChild( o );
        break;
        case 'MARK':
            var children = getMarkedChild();
            for ( var i=0; i<children.length; i++ ){
                var id = children[i].getAttribute('child_id');
                var oChild = getChild( id );
                var o = document.createElement('DIV');
                o.style.width = '100%';
                o.style.height = '40px';
                o.style.clear = "both";
                o.style.borderBottom = '1px solid lightgrey';
                r = '';
                r += '<div style="float:left;width:150px;font-size:14px;" >' + oChild.child_name + '</div>';
        
                o.innerHTML = r;
                imcl.appendChild( o );
            }
            break;
    }
}


//
//  Childをチェックアウトクリア（帰宅解除）:single
//
function checkoutClearWhiteboardChildSingleHelper(){
    if ( ! propChild ) return;
    checkoutClearChild( propChild );
    showWhiteboardChildCountCheckout();

}

//
//  Childをチェッククリア（帰宅解除）:mark
//
function checkoutClearWhiteboardChildMarkHelper(){

    var children = getMarkedChild();
    for ( var i=0; i<children.length; i++ ){
        checkoutClearChild( children[i] );
    }
    showWhiteboardChildCountCheckout();

}

//
//  指定したチャイルドのチェックアウトクリア処理
//
function checkoutClearChild( c ){
    if ( c == null ) return;
    c.removeAttribute('checkout' );
    document.getElementById( 'CHECKOUT_' + c.getAttribute('child_id') ).innerText = 'checkout:';
    c.style.backgroundImage    = '';
    c.style.backgroundPosition = '';
    c.style.backgroundRepeat   = '';
    c.style.backgroundSize     = '';

}

//
//  タイムラインにチャイルドを移動
//
function moveTimelineWhiteboardChild( timeline ){

}

//
//  タイムラインのチャイルドをチェックアウト
//
function checkoutTimelineWhiteboardChild( timeline ){

}

//
//  アカウントプロパティ
//
function propertyAccount(){

    var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
		r += 'Account property';
    r += '</div>';
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

    openModalDialog( r, 'NORMAL' );

}

