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
    r += "<pre>";
    r += msg;
    r += 'length:' + accs.length;
    r += "</pre>";
    r += "<button onclick='clearArea();' >OK</button>";
    o.innerHTML = r;

})