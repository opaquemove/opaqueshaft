/*
 * このスクリプトはBODYタグで処理すること
 * 出ないとsocketの初期化がうまくいかない
*/

var socket = io();

const arChildGrade = ['','4px solid lightcoral', '4px solid lightgreen', '4px solid lightblue'];
const arChildGradeColor = ['','lightcoral', 'lightgreen', 'lightblue'];

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
        addChild( i * 20, i * 20,
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

function clearWhiteboard(){
    var wb = document.getElementById('WHITEBOARD');
    while ( wb.firstChild)
        wb.removeChild( wb.firstChild );
}

//
//  WhiteBoardにチャイルドを実体化
//
function addChild( top, left, name, child_type, child_grade ){
	var o = document.getElementById('AREA');
	o.style.visibility = 'hidden';

	var wb = document.getElementById('WHITEBOARD');
    var c = document.createElement("DIV");
    c.setAttribute("child", "yes");
	c.setAttribute("id", "c_1");
    c.setAttribute("class", "CHILD drag-and-drop");
    c.style.position = 'absolute;'
	c.style.top = top + 'px';
    c.style.left = left + 'px';
//    c.style.borderLeft = arChildGrade[ child_grade ];
    var r = '';
    r += '<div style="width:4px;height:100%;float:left;background-color:' + arChildGradeColor[child_grade] + ';" ></div>';
    r += '<div style="width:110px;height:100%;float:left;padding-left:2px;" >';
        r += '<div style="font-size:12px;border-bottom:1px solid lightgray;" >' + name + '</div>';
        r += '<div style="font-size:10px;" >type:' + child_type + '&nbsp; Grade:' + child_grade + '</div>';
    r += '</div>';

	c.innerHTML = r;
    var cc = wb.appendChild( c );
    cc.addEventListener( 'dblclick',   propertyChild, false );
	cc.addEventListener( "mousedown",  mDown, false );
	cc.addEventListener( "touchstart", mDown, false );

}

//
//  管理用チャイルドを実体化
//
function addChildManage( oParent, oChild ){

    var c = document.createElement("DIV");
    c.setAttribute("child", "yes");
    c.setAttribute("child_id", oChild.child_id );
	c.setAttribute("id", "c_1");
    c.setAttribute("class", "CHILD");
    c.setAttribute("draggable", "true");
    c.style.width       = '97%';
    c.style.borderRight = arChildGrade[ oChild.child_grade ];
    var r = '';
    r += '<div style="font-size:10px;border-bottom:1px solid lightgray;" >' + oChild.child_name + '</div>';
    r += '<div style="font-size:9px;" >type:' + oChild.child_type + '&nbsp; Grade:' + oChild.child_grade + '</div>';

	c.innerHTML = r;
    var cc = oParent.appendChild( c );
	cc.addEventListener('dragstart',
		function(e) {
            console.log( e.dataTransfer );
			e.dataTransfer.setData('text', e.target.innerHTML );
		} );

}

//
//  チャイルドプロパティ
//
function propertyChild( e ){
    var c = scanChild( e.target );
    markChild( c );
    propChild = c;

	var r = "";
	r += "<div style='width:400px;height:100%;margin:10px auto;background-color:white;opacity:0.75;' >";
        r += "<div style='border-left:3px solid red;border-bottom:1px solid lightgrey;' >";
        r += c.innerText;
        r += "</div>";
        r += "<div>checkout time:" + c.getAttribute('checkout') + "</div>";
        r += "<div style='padding-top:60px;border-top:1px solid lightgrey;' >";
        r += "<button type='button' onclick='checkclearChild();' >check clear</button>";
        r += "<button type='button' onclick='checkoutChild();'   >check out</button>";
        r += "<button type='button' onclick='clearArea();'       >close</button>";
        r += "</div>";
    r += "</div>";
	var o = document.getElementById('AREA');
	o.innerHTML = r;
	o.style.visibility = 'visible';

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
function markChild( c ) {
    if ( c == null ) return;
    c.setAttribute('marked', 'MARKED' );
    c.style.backgroundColor = 'lightcoral';
    c.style.color           = 'snow';
}

function unmarkChild( c ) {
    if ( c == null ) return;
    c.removeAttribute('marked');
    c.style.backgroundColor = '';
    c.style.color           = '';
}

function countChild(){
	var wb = document.getElementById('WHITEBOARD');
    alert( wb.childNodes.length);
}

//
//  Childをチェックアウト（帰宅）
//
function checkoutChild(){
    if ( ! propChild ) return;
    var now = new Date();
    var h = ( '00' + now.getHours() ).slice(-2);
    var m = ( '00' + now.getMinutes() ).slice(-2);
    var s = ( '00' + now.getSeconds() ).slice(-2);
    var checkout_time = h + ':' + m + ':' + s;
    propChild.setAttribute('checkout', checkout_time );
    alert();
}

//
//  Childをチェックアウト（帰宅）
//
function checkclearChild(){
    if ( ! propChild ) return;
    propChild.removeAttribute('checkout' );
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
            r += "<form name='sign_form' >";
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

