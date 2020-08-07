
//
//  チャイルドファインダー
//
function childFinder( e ){
    var tk = document.getElementById('TXT_KEYWORD');
    var keyword = tk.value;
    var p = document.getElementById('CHILD_FINDER');
    var fa = document.getElementById('FINDER_AREA');
    if ( keyword  != '' ){
        if ( fa == null )   //  表示エリアなし
        {
            var o = document.createElement('DIV');
            o.setAttribute( 'id', 'FINDER_AREA');
            var m = p.appendChild( o );
            var r = '';
            r += '<div style="height:19px;padding:2px;border-bottom:1px solid lightgrey;" >';
            //    r += 'keyword:<span id="HOGE" ></span>';
                r += '<div style="float:left;width:19px;height:19px;background-image:url(./images/recycle.png);background-size:16px;background-repeat:no-repeat;background-position:center center;" ></div>';
            r += '</div>';
            r += '<div id="FIND_CHILD_LST" ></div>';
            m.innerHTML = r;
            fitting();
        }
    } else {
        if ( fa != null )   //  表示エリアあれば削除
        {
            p.removeChild( fa );
            return;
        }
    }
    // if ( fa != null ){
    //     var hoge = document.getElementById('HOGE');
    //     if ( hoge == null ) return;
    //     hoge.innerText = keyword;
    // }

    var fcl = document.getElementById( 'FIND_CHILD_LST' );
    fcl.innerHTML = '';

    //  WHITEBOARD内を検索
    var o = document.createElement('DIV');
    o.style.color           = 'gray';
    o.style.backgroundColor = 'transparent';
    o.style.fontSize        = '10px';
    o.style.borderBottom    = '1px solid lightgrey';
    o.style.padding         = '2px 2px 0px 0px';
    o.style.marginBottom    = '0px';
    o.style.clear           = 'both';
    o.innerHTML             = '<div style="float:reft;width:80px;color:snow;background-color:red;" >Whiteboard...</div>';
    fcl.appendChild( o );

    findWhiteboardChild( fcl, keyword );

    //  childrenテーブル検索
    var o = document.createElement('DIV');
    o.style.color           = 'gray';
    o.style.backgroundColor = 'transparent';
    o.style.fontSize        = '10px';
    o.style.borderBottom    = '1px solid lightgrey';
    o.style.padding         = '2px 2px 0px 0px';
    o.style.marginBottom    = '0px';
    o.style.clear           = 'both';
    o.innerHTML             = '<div style="float:reft;width:80px;color:snow;background-color:red;" >Children...</div>';
    fcl.appendChild( o );

	r = '';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				var fcl = document.getElementById( 'FIND_CHILD_LST' );
				//if ( fcl != null ) fcl.innerText = 'access...';
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
                    var result = JSON.parse( xmlhttp.responseText );
                    
					//r += xmlhttp.responseText;
                    var fcl = document.getElementById('FIND_CHILD_LST');
                    if ( fcl == null ) return;
					//fcl.innerHTML = '';
					for ( var i=0; i<result.length; i++ ){
                        var child_id = result[i].child_id;
                        var child_name = result[i].child_name;
                        var c = document.createElement('DIV');
                        c.setAttribute("child",     "yes");
                        c.setAttribute("child_id",  child_id );
                        c.setAttribute("id",        "c_1");
                        //c.setAttribute("class",     "PALLETE_CHILD");
                        c.setAttribute("draggable", "true");
                        c.style.clear           = 'both';
                        c.style.width           = '100%';
                        c.style.height          = '24px';
                        c.style.backgroundColor = '';
                        c.style.borderBottom    = '1px solid lightgray';
                        //c.style.borderRight = arChildGrade[ oChild.child_grade ];
                        c.style.float           = 'left';
                        r = '';
                        r += '<div style="height:20px;font-size:12px;padding-left:2px;">';
                            r += child_name;
                        r += '</div>';
                        c.innerHTML = r;
                        var cc = fcl.appendChild( c );
                        cc.addEventListener('dragstart',
                        function(e) {
                            dndOffsetX = e.offsetX;
                            dndOffsetY = e.offsetY;
                            console.log( e.dataTransfer );
                            console.log('offsetY:' + dndOffsetY + ' OffsetX:' + dndOffsetX );
                            e.dataTransfer.setData('text', e.target.getAttribute( 'child_id' ) );
                        } );
                                                                            
					}
					//o.innerHTML = r;
				} else{
					document.getElementById('HISTORY_LST').innerText = xmlhttp.status;
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/childfind", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'keyword=' + keyword );

	} catch ( e ) { alert( e );}

}

//
//
//
function findWhiteboardChild( parent, keyword ){
    var children = document.getElementById('WHITEBOARD').childNodes;
    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        var child_name  = c.getElementsByClassName('CHILD_NAME')[0].innerText;
        //child_name      = child_name.toLowerCase();
        var kana        = ( c.getAttribute('kana') != null )? c.getAttribute('kana') : '';
    
        if ( child_name.toLowerCase().indexOf( keyword.toLowerCase(), 0, keyword.length ) == 0 ||
             kana.indexOf(keyword.toLowerCase(), 0, keyword.length ) == 0  ){
            var o = document.createElement('DIV');
            o.innerText = child_name;
            parent.appendChild( o );
        }
    }
}

//
//	チャイルドファインダー
//
// function childFinder(){

// 	var r = '';
// 	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
// 		r += 'child finder';
// 	r += '</div>';
// 	r += '<div id="CF_HDR"  style="margin:1px auto;font-size:12px;width:400px;height:20px;border:1px solid lightgrey;">';
// 	r += '</div>';
//     r += '<div id="CF_MAIN" style="clear:both;margin:1px auto;font-size:14px;width:400px;height:200px;border:1px solid lightgrey;">';
//         r += '<div id="CF_MENU" style="float:left;width:80px;height:100%;border-right:1px solid lightgrey;" >';
//             r += '<div style="width:42px;height:42px;background-image:url(./images/dry-clean.png);background-size:38px;background-position:center center;background-repeat:no-repeat;" >あ</div>'
//         r += '</div>';
//         r += '<div id="CF_LIST" style="float:left;width:317px;height:100%;padding-left:2px;" >list</div>';
// 	r += '</div>';

// 	openModalDialog( "child finder", r, 'NOBUTTON', null );
	
// }
