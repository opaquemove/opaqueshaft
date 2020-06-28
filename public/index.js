/**
 *	Author: MASATO.NAKANISHI
 *	Date:	20.June.2020
 */

var x, y;
window.onload = init;

function init()
{
	window.addEventListener("touchmove",
	 function( e ) { e.preventDefault(); }, { passive:false } );
}

function getCookie(){
	var c = document.cookie;
	alert("[" + c + "]");
}

function getConnection(){
	var r = "";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var o = document.getElementById('AREA');
			o.style.visibility = 'visible';
			r += "<pre>";
			r += xmlhttp.responseText;
			r += "</pre>";
			r += "<button onclick='clearArea();' >cancel</button>";
			o.innerHTML = r;
		}
	}
	try{
		xmlhttp.open("POST", "/Serverside/tm.WebBackend", true );

		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( "cmd=getconnection" );

		switch( xmlhttp.status){
			case 200:
				break;
		}

	} catch ( e ) { alert( e );}
}

function sign( cmd )
{
	var r = "";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var o = document.getElementById('AREA');
			o.style.visibility = 'visible';
			r += "<pre>";
			r += xmlhttp.responseText;
			r += "</pre>";
			r += "<br/>";
			r += "<button onclick='clearArea();' >cancel</button>";
			o.innerHTML = r;
		}
	}
	try{
		xmlhttp.open("POST", "/Serverside/tm.WebBackend", true );

		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		switch (cmd )
		{
			case "signin":
				var sign_id = sign_form.id.value;
				var sign_pwd = sign_form.pwd.value;
				xmlhttp.send( "cmd=" + cmd + "&acc=" + sign_id + "&pwd=" + sign_pwd );
				break;
			case "signout":
			case "signstatus":
			case "sign":
				xmlhttp.send( "cmd=" + cmd );
				break;
		}
		switch( xmlhttp.status){
			case 200:
				break;
		}

	} catch ( e ) { alert( e );}
}

function signForm()
{

	var r = "";
	r += "<form name='sign_form' >";
		r += "<table>";
		r += "<tr>";
		r += "<td>ID:</td><td><input type='text' id='id' name='id' /></td>";
		r += "</tr>";
		r += "<tr>";
		r += "<td>Password:</td><td><input type='password' name='pwd' /></td>";
		r += "<tr>";
		r += "</table>";
	r += "</form>";
	r += "<button onclick='sign(\"signin\");' >signin</button>";
	r += "<button onclick='clearArea();' >cancel</button>";
	var o = document.getElementById('AREA');
	o.innerHTML = r;
	o.style.visibility = 'visible';
	o = document.getElementById( 'id' );
	o.focus();
}

function clearArea(){
	var r = "";
	var o = document.getElementById('AREA');
	o.style.visibility = 'hidden';
	o.innerHTML = r;

}


function addChild(){
	var o = document.getElementById('AREA');
	o.style.visibility = 'hidden';

	var wb = document.getElementById('WHITEBOARD');
	var c = document.createElement("DIV");
	c.setAttribute("id", "c_1");
	c.setAttribute("class", "drag-and-drop");
	c.style.width = '120px';
	c.style.height = '30px';
	c.style.border = '1px solid gray';
	c.style.backgroundColor = 'white';
	var cc = wb.appendChild( c );
	cc.addEventListener( "mousedown", mDown, false );
	cc.addEventListener( "touchstart", mDown, false );

}

function mDown( e ) {

        //クラス名に .drag を追加
        this.classList.add("drag");

        //タッチデイベントとマウスのイベントの差異を吸収
        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //要素内の相対座標を取得
        x = event.pageX - this.offsetLeft;
        y = event.pageY - this.offsetTop;

        //ムーブイベントにコールバック
        document.body.addEventListener("mousemove", mMove, false);
        document.body.addEventListener("touchmove", mMove, false);	
}

function mMove( e ){

        //ドラッグしている要素を取得
        var drag = document.getElementsByClassName("drag")[0];

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
	var drag = document.getElementsByClassName("drag")[0];

	//ムーブベントハンドラの消去
	document.body.removeEventListener("mousemove", mMove, false);
	if ( !drag ) drag.removeEventListener("mouseup", mUp, false);
	document.body.removeEventListener("touchmove", mMove, false);
	if ( !drag ) drag.removeEventListener("touchend", mUp, false);

	//クラス名 .drag も消す
	if ( !drag ) drag.classList.remove("drag");
}


