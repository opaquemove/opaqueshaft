function initWorkplace(){
    document.getElementById('WP_KEYWORD').addEventListener(
		'keyup',
		function( e ){
			if ( e.key == 'Enter' )
            finder();
		}
	);
	// document.getElementById('BOTTOM_FRAME').addEventListener(
	// 	'resize', resizeWorkplace );
	// var bf = document.getElementById('BOTTOM_FRAME');
	// var observer = new MutationObserver( records => {
	// 	resizeWorkplace();
	// });
	// observer.observe( bf, { attributes: true });

}

function resizeWorkplace(){
	var h = document.getElementById('BOTTOM_FRAME').offsetHeight;
	var sysmenu = document.getElementById('WORKPLACE_SYSMENU');
	var wb		= document.getElementById('WORKPLACE_WHITEBOARD');
	var children= document.getElementById('WORKPLACE_CHILDREN');
	var wpcm	= document.getElementById('WORKPLACE_CHILDREN_MAIN');
	var list	= document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST');
	console.log( 'resizeWorkplace' );
	children.style.height = ( h - 0 ) + 'px';
	wpcm.style.height = ( h - 252 ) + 'px';

}

function finder(){
    var wph = document.getElementById('WORKPLACE_HDR');
	wph.style.height = '0px';
	wph.style.padding = '0px';

	var keyword = document.getElementById('WP_KEYWORD').value;
	finderHelper( keyword );
}
function finderHelper( keyword ){
	console.log( 'keyword:' + keyword );
	var list = document.getElementById('WORKPLACE_CHILDREN_MAIN_LIST');
	list.innerHTML = '';

	var r = '';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.addEventListener('readystatechange', 
		function (e){
			switch ( xmlhttp.readyState){
				case 1://opened
					break;
				case 2://header received
					break;
				case 3://loading
					list.innerHTML = 'access...'
					break;
				case 4://done
					console.log('status:' + xmlhttp.status );

					if ( xmlhttp.status == 200 ){
						
						var result = JSON.parse( xmlhttp.responseText );
						
						list.innerHTML = '';
						
						for ( var i=0; i<result.length; i++ ){
                            // var duration = (Math.floor(Math.random() * 1000 / 100 ) + " " ).slice( 1,2 ) + 's';
							var child_id    = result[i].child_id;
							var child_name  = result[i].child_name;
							var kana        = result[i].kana;
							var remark		= result[i].remark;
							if ( remark == null ) remark = '';
							var child_type  = result[i].child_type;
							var child_grade = result[i].child_grade;
							var range_id	= result[i].range_id;
							var imagefile	= result[i].imagefile;
							if ( imagefile == null ) imagefile = '';
							var c = document.createElement('DIV');
							c.setAttribute("child_id",    child_id );
							c.setAttribute("id",          "c_1");
							c.classList.add( "WP_PALLETE_CHILD" );
							c.classList.add( "offProfeel" );
							c.setAttribute('kana',        kana );
							c.setAttribute('child_type',  child_type );
							c.setAttribute('child_grade', child_grade );
                            // c.style.animationDuration   = duration;
							// c.style.float           = 'left';
							var cc = list.appendChild( c );
							var cc_width = cc.offsetWidth;


							r = '';
							r += '<div profeel="yes" class="child_header" style="" >';
								r += child_name + '&nbsp;&nbsp;' + child_grade + child_type;
								r += '<span style="color:' + arChildGradeColor[ child_grade ] + ';">●</span>';
							r += '</div>';
							r += '<div profeel="yes" style="float:left;width:' + cc_width + 'px;height:80px;overflow:hidden;" >';
								if ( imagefile != ''){
									r += '<div style="float:left;width:60px;height:60px;color:dimgrey;font-size:8px;margin:4px;padding:4px;overflow:hidden;border-radius:45%;background-image:url(./images/children/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
										r += '&nbsp;';
									r += '</div>';
								} else{
									r += '<div style="float:left;width:60px;height:60px;color:black;font-size:8px;opacity:0.3;margin:4px;padding:4px;overflow:hidden;border-radius:45%;background-image:url(./images/user-2.png);background-size:30px;background-position:center center;background-repeat:no-repeat;" >';
										r += '&nbsp';
									r += '</div>';
								}
								r += '<div style="float:right;width:100px;height:80px;" >';
									r += '<div style="padding:1px;" >' + kana + '</div>';
									r += '<div style="padding:1px;" >id/Range:' + child_id + '/' + range_id + '</div>';
								r += '</div>';
							r += '</div>';
							cc.innerHTML = r;
							
						}
					} else{
						console.log( null, 'finder:' + xmlhttp.status );
					}
					break;
			}

		}, false );

		xmlhttp.open("POST", "/accounts/childfind", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		if ( keyword == '*' ) keyword = '%';
		xmlhttp.send( 'keyword=' + keyword );


}
