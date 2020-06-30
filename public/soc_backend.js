var socket = io();

socket.on( 'getaccountlist', function ( msg ) {
	var r = "";
			var o = document.getElementById('AREA');
			o.style.visibility = 'visible';
			r += "<pre>";
			r += msg;
			r += "</pre>";
			r += "<button onclick='clearArea();' >OK</button>";
			o.innerHTML = r;

})