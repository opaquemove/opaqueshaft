/**
 *	Author: MASATO.NAKANISHI
 *	Date:	20.June.2020
 */


window.onload = init;

function init()
{
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
	c.style.width = '40px';
	c.style.height = '20px';
	c.style.border = '1px solid gray';
	c.style.backgroundColor = 'white';
	wb.appendChild( c );


}


