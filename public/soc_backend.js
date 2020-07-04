/*
 * このスクリプトはBODYタグで処理すること
 * 出ないとsocketの初期化がうまくいかない
*/

var socket = io();

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

socket.on( 'getchildrenlist', function ( msg ) {
    var r = "";
    var children = eval( msg );
    var o = document.getElementById('AREA');
    o.style.visibility = 'visible';
    for (var i=0; i<children.length; i++) {
        r += children[i].child_name + '<br/>'; 
        addChild( i * 20, i * 20, children[i].child_name );
    }
    r += '<br/>length:' + children.length;

    r += "<div>";
    r += "<button onclick='clearArea();' >OK</button>";
    r += "</div>";
    o.innerHTML = r;

})


function loadChildren(){
	socket.emit( 'cmd', 'getchildrenlist' );
}

function clearWhiteboard(){
    var wb = document.getElementById('WHITEBOARD');
    while ( wb.firstChild)
        wb.removeChild( wb.firstChild );
}

function addChild( top, left, name ){
	var o = document.getElementById('AREA');
	o.style.visibility = 'hidden';

	var wb = document.getElementById('WHITEBOARD');
	var c = document.createElement("DIV");
	c.setAttribute("id", "c_1");
	c.setAttribute("class", "CHILD drag-and-drop");
	c.style.top = top + 'px';
	c.style.left = left + 'px';

	c.innerText = name;
	var cc = wb.appendChild( c );
	cc.addEventListener( "mousedown", mDown, false );
	cc.addEventListener( "touchstart", mDown, false );

}

function countChild(){
	var wb = document.getElementById('WHITEBOARD');
    alert( wb.childNodes.length);
}

