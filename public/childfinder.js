
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
                r += '<div id="BTN_CLOSE_FINDER_AREA" style="float:right;width:19px;height:19px;background-image:url(./images/cancel-2.png);background-size:16px;background-repeat:no-repeat;background-position:center center;" ></div>';
            r += '</div>';
            r += '<div id="FIND_CHILD_LST" ></div>';
            m.innerHTML = r;
            new Button( 'BTN_CLOSE_FINDER_AREA', closeChildFinder ).play();
            fitting();
        }
    } else {
        if ( fa != null )   //  表示エリアあれば削除
        {
            closeChildFinder();
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

    //  WHITEBOARD / WHITEBOARD_ABSENT内を検索
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
                        c.style.fontSize        = '12px';
                        c.style.width           = '100%';
                        c.style.height          = '24px';
                        c.style.backgroundColor = '';
                        c.style.borderBottom    = '1px solid lightgray';
                        //c.style.borderRight = arChildGrade[ oChild.child_grade ];
                        c.style.float           = 'left';
                        r = '';
                        r += '<div style="height:20px;padding-left:2px;">';
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
//  WHITEBOARD内のチャイルドの検索
//
function findWhiteboardChild( parent, keyword ){
    var children = document.getElementById('WHITEBOARD').childNodes;
    findWhiteboardChildHelper( parent, keyword, children, false );

    var absents = document.getElementById('WHITEBOARD_ABSENT').childNodes;
    findWhiteboardChildHelper( parent, keyword, absents, true );
/*
    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        var child_id = c.getAttribute('child_id');
        var child_name  = c.getElementsByClassName('CHILD_NAME')[0].innerText;
        var estimate    = c.getElementsByClassName('ESTIMATE_TIME')[0].innerText
        //child_name      = child_name.toLowerCase();
        var kana        = ( c.getAttribute('kana') != null )? c.getAttribute('kana') : '';
    
        if ( child_name.toLowerCase().indexOf( keyword.toLowerCase(), 0, keyword.length ) == 0 ||
             kana.indexOf(keyword.toLowerCase(), 0, keyword.length ) == 0  ){
            var o = document.createElement('DIV');
            o.setAttribute( 'child_id', child_id );
            o.style.fontSize    = '12px';
            o.style.height      = '20px';

            var r = '';
            r += '<div style="float:left;"  >' + child_name + '</div>';
            r += '<div style="float:right;" >' + estimate   + '</div>';
            o.innerHTML = r;

            var cc = parent.appendChild( o );
            cc.addEventListener( 'click', 
                function (e){
                    var c = e.target;
                    while ( true ){
                        if ( c.hasAttribute('child_id') ) break;
                        c = c.parentNode;
                    }
                    //alert( c.getAttribute('child_id'));
                    var c = scanWhiteboardChild( child_id );
                    if ( c == null ) { console.log( 'child_id:' + child_id + ':null');return;}

                    var child_name = c.firstChild.innerText;
                    var h = estimate.substr(0, 2 );
                    var wbf = document.getElementById('WHITEBOARD_FRAME');
                    wbf.scrollTop = ( h - 8 ) * 400;
                    // var range = document.createRange();
                    // range.setStart( c, 0 );
                    // range.setEnd( c, 1 );
                    // var mark = document.createElement( 'mark' );
                    // range.surroundContents( mark );
                } );
        }
    }
*/

}

function findWhiteboardChildHelper( parent, keyword, children, absent ){
    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        var child_id = c.getAttribute('child_id');
        var child_name  = c.getElementsByClassName('CHILD_NAME')[0].innerText;
        var estimate    = c.getElementsByClassName('ESTIMATE_TIME')[0].innerText
        //child_name      = child_name.toLowerCase();
        var kana        = ( c.getAttribute('kana') != null )? c.getAttribute('kana') : '';
    
        if ( child_name.toLowerCase().indexOf( keyword.toLowerCase(), 0, keyword.length ) == 0 ||
             kana.indexOf(keyword.toLowerCase(), 0, keyword.length ) == 0  ){
            var o = document.createElement('DIV');
            o.setAttribute( 'child_id', child_id );
            o.style.fontSize    = '12px';
            o.style.height      = '20px';

            var r = '';
            r += '<div style="float:left;"  >' + child_name + '</div>';
            if ( absent )
                r += '<div style="float:right;width:20px;background-image:url(./images/sleep-2.png);background-size:18px;background-position:center center;background-repeat:no-repeat;">&nbsp;</div>';
                else
                r += '<div style="float:right;width:20px;background-image:url(./images/godzilla.png);background-size:18px;background-position:center center;background-repeat:no-repeat;">&nbsp;</div>';
            r += '<div style="float:right;" >' + estimate   + '</div>';

            o.innerHTML = r;

            var cc = parent.appendChild( o );
            cc.addEventListener( 'click', 
                function (e){
                    var c = e.target;
                    while ( true ){
                        if ( c.hasAttribute('child_id') ) break;
                        c = c.parentNode;
                    }
                    //alert( c.getAttribute('child_id'));
                    var c = scanWhiteboardChild( child_id );
                    if ( c == null ) { console.log( 'child_id:' + child_id + ':null');return;}

                    var child_name = c.firstChild.innerText;
                    var h = estimate.substr(0, 2 );
                    var wbf = document.getElementById('WHITEBOARD_FRAME');
                    wbf.scrollTop = ( h - 8 ) * 400;
                    // var range = document.createRange();
                    // range.setStart( c, 0 );
                    // range.setEnd( c, 1 );
                    // var mark = document.createElement( 'mark' );
                    // range.surroundContents( mark );
                } );
        }
    }

}

//
//  チャイルドファインダーをクローズ
//
function closeChildFinder(){
    document.getElementById('TXT_KEYWORD').value = '';
    var p = document.getElementById('CHILD_FINDER');
    var fa = document.getElementById('FINDER_AREA');
    if ( fa != null )
        p.removeChild( fa );                 

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
