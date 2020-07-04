/**
 *	Author: MASATO.NAKANISHI
 *	Date:	20.June.2020
 *	Reference: https://q-az.net/elements-drag-and-drop/
 */

var x, y;
var curChild = null;
var curChildZIndex = null;
window.onload = init;
window.onresize = fitWhiteboardFrame;


function init()
{
	var wb = document.getElementById('WHITEBOARD');
	wb.addEventListener("touchmove",
	 function( e ) { e.preventDefault(); }, { passive:false } );
	wb.addEventListener('selectstart', function(e){return false;})
	wb.addEventListener('click', function(e) { initArea();});
	fitWhiteboardFrame();
}

function initArea(){
	var o = document.getElementById('AREA');
	if ( o.style.visibility != 'hidden' )
		clearArea();
}

function clearArea(){
	var r = "";
	var o = document.getElementById('AREA');
	o.style.visibility = 'hidden';
	o.innerHTML = r;

}


function fitWhiteboardFrame(){
	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;
	var o = document.getElementById('WHITEBOARD_FRAME');
	//console.log( w + ',' + h );
	//o.style.width = ( w - 2 ) + 'px';
	o.style.height = ( h - 42 - 30 ) + 'px';
}

function getCookie(){
	var c = document.cookie;
	alert("[" + c + "]");
	alert( checkSign() );
}

function checkSign(){
	var c = document.cookie;
	return  ( c.indexOf( 'acc=') > -1 );
}


function postWebBackend(){
	var r = "";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var o = document.getElementById('AREA');
			o.style.visibility = 'visible';
			r += "<pre>";
			r += xmlhttp.responseText;
			r += "</pre>";
			r += "<button onclick='clearArea();' >OK</button>";
			o.innerHTML = r;
		}
	}
	try{
		xmlhttp.open("POST", "/webbackend", true );

		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( "cmd=signstatus" );

	} catch ( e ) { alert( e );}

}

function sign( cmd )
{
	var r = "";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		var o = document.getElementById('AREA');
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				r = "";
				r += "loading...";
				o.style.visibility = 'visible';
				o.innerHTML = r;
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
					o.style.visibility = 'visible';
					r = "";
					r += "<pre>";
					r += xmlhttp.responseText;
					r += "</pre>";
					r += "<br/>";
					r += "<button onclick='clearArea();' >OK</button>";
					o.innerHTML = r;
				}
				break;
		}
	}
	try{
//		xmlhttp.open("POST", "/webbackend", true );

		switch (cmd )
		{
			case "signin":
				var sign_id = sign_form.id.value;
				var sign_pwd = sign_form.pwd.value;
				xmlhttp.open("POST", "/accounts/signin", false );
				xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
				xmlhttp.send( "cmd=" + cmd + "&acc=" + sign_id + "&pwd=" + sign_pwd );
				break;
			case "signout":
				xmlhttp.open("POST", "/accounts/signout", false );
				xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
				xmlhttp.send( "cmd=" + cmd );
				break;
			case "signstatus":
			case "sign":
				xmlhttp.open("POST", "/accounts/signstatus", false );
				xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
				xmlhttp.send( "cmd=" + cmd );
				break;
		}

	} catch ( e ) { alert( e );}
}

function signForm()
{
	if ( checkSign()) {
		sign('signstatus');
		return;
	}
	var r = "";
	r += "<div style='width:400px;height:100%;margin:10px auto;background-color:white;' >";
		r += "<form name='sign_form' >";
			r += "<table>";
			r += "<tr>";
			r += "<td>ID:</td><td><input type='text' id='id' name='id' tabindex=1 /></td>";
			r += "</tr>";
			r += "<tr>";
			r += "<td>Password:</td><td><input type='password' name='pwd' tabindex=2 /></td>";
			r += "<tr>";
			r += "</table>";
			r += "<button type='button' tabindex=3 onclick='sign(\"signin\");' >signin</button>";
			r += "<button type='button' tabindex=4 onclick='clearArea();' >cancel</button>";
		r += "</form>";
	r += "</div>";
	var o = document.getElementById('AREA');
	o.innerHTML = r;
	o.style.visibility = 'visible';
	o = document.getElementById( 'id' );
	o.focus();
}




function mDown( e ) {

		curChild = this;
        //クラス名に .drag を追加
		curChild.classList.add("drag");
		curChildZIndex = curChild.style.zIndex;
		curChild.style.zIndex = 2001;
        //タッチデイベントとマウスのイベントの差異を吸収
        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //要素内の相対座標を取得
        x = event.pageX - curChild.offsetLeft;
        y = event.pageY - curChild.offsetTop;

        //ムーブイベントにコールバック
        document.body.addEventListener("mousemove", mMove, false);
        document.body.addEventListener("touchmove", mMove, false);	
}

function mMove( e ){

        //ドラッグしている要素を取得
		//var drag = document.getElementsByClassName("drag")[0];
//		var drag = e.target;
		var drag = curChild;

        //同様にマウスとタッチの差異を吸収
        if(e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //フリックしたときに画面を動かさないようにデフォルト動作を抑制
        e.preventDefault();

        //マウスが動いた場所に要素を動かす
        drag.style.top = event.pageY - y + "px";
        drag.style.left = event.pageX - x + "px";

        //マウスボタンが離されたとき、またはカーソルが外れたとき発火
        drag.addEventListener("mouseup", mUp, false);
        document.body.addEventListener("mouseleave", mUp, false);
        drag.addEventListener("touchend", mUp, false);
        document.body.addEventListener("touchleave", mUp, false);

}

function mUp( e ) {
	//var drag = document.getElementsByClassName("drag")[0];
	//var drag = e.target;
	var drag = curChild;
	//ムーブベントハンドラの消去
	document.body.removeEventListener("mousemove", mMove, false);
	if ( !drag ) drag.removeEventListener("mouseup", mUp, false);
	document.body.removeEventListener("touchmove", mMove, false);
	if ( !drag ) drag.removeEventListener("touchend", mUp, false);

	//クラス名 .drag も消す
	if ( !drag ) drag.classList.remove("drag");

	curChild.style.zIndex = curChildZIndex;

	curChild = null;
}


