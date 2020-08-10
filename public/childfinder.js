
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
    o.setAttribute('id', 'FOLDER_FIND_WHITEBOARD');
    o.style.color           = 'gray';
    o.style.backgroundColor = 'transparent';
    o.style.fontSize        = '12px';
    o.style.borderBottom    = '1px solid lightgrey';
    o.style.padding         = '4px 4px 0px 0px';
    o.style.marginBottom    = '0px';
    o.style.clear           = 'both';
    o.innerHTML             = '<div style="float:reft;width:80px;color:red;background-color:;padding-left:4px;border-left:10px solid red;" >Whiteboard...</div>';
    var ffw = fcl.appendChild( o );
    ffw.addEventListener('click',
        function(e){
            var ffw2 = document.getElementById('FOLDER_FIND_WHITEBOARD2');
            switch ( ffw2.style.display ){
                case 'none':
                    ffw2.style.display = 'inline';
                    break;
                case 'inline':
                default:
                    ffw2.style.display = 'none';
                    break;
            }
        }, false );

    var oo = document.createElement('DIV');
    oo.setAttribute('id', 'FOLDER_FIND_WHITEBOARD2');
    oo.style.color          = 'gray';
    oo.style.backgroundColor = 'transparent';
    oo.style.fontSize        = '12px';
    oo.style.padding         = '4px 4px 0px 0px';
    oo.style.marginBottom    = '0px';
    oo.style.clear           = 'both';
    var ooo = fcl.appendChild( oo );
    findWhiteboardChild( ooo, keyword );

    //  childrenテーブル検索
    var o = document.createElement('DIV');
    o.setAttribute( 'id', 'FOLDER_FIND_CHILDREN_TABLE' );
    o.style.color           = 'gray';
    o.style.backgroundColor = 'transparent';
    o.style.fontSize        = '12px';
    o.style.borderBottom    = '1px solid lightgrey';
    o.style.padding         = '4px 4px 0px 0px';
    o.style.marginBottom    = '0px';
    o.style.clear           = 'both';
    o.innerHTML             = '<div style="float:reft;width:80px;color:red;background-color:;padding-left:4px;border-left:10px solid red;" >Children...</div>';
    var ffct = fcl.appendChild( o );
    ffct.addEventListener('click',
        function(e){
            var ffct2 = document.getElementById('FOLDER_FIND_CHILDREN_TABLE2');
            switch ( ffct2.style.display ){
                case 'none':
                    ffct2.style.display = 'inline';
                    break;
                case 'inline':
                default:
                    ffct2.style.display = 'none';
                    break;
            }
        }, false);

    var oo = document.createElement('DIV');
    oo.setAttribute('id', 'FOLDER_FIND_CHILDREN_TABLE2');
    oo.style.color           = 'gray';
    oo.style.backgroundColor = 'transparent';
    oo.style.fontSize        = '12px';
    oo.style.padding         = '4px 4px 0px 0px';
    oo.style.marginBottom    = '0px';
    oo.style.clear           = 'both';

    var ooo = fcl.appendChild( oo );
    findChildrenTable( ooo, keyword );

/*
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
                        c.style.padding         = '4px';
                        c.style.fontSize        = '12px';
                        c.style.width           = '100%';
                        c.style.height          = '24px';
                        c.style.backgroundColor = '';
                        // c.style.borderBottom    = '1px solid lightgray';
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
*/

}

//
//  CHILDRENテーブル内のチャイルドの検索
//
function findChildrenTable( parent, keyword ){
	var r = '';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				//var fcl = document.getElementById( 'FIND_CHILD_LST' );
				//if ( fcl != null ) fcl.innerText = 'access...';
				break;
			case 4://done
				if ( xmlhttp.status == 200 ){
                    var result = JSON.parse( xmlhttp.responseText );
                    
					//r += xmlhttp.responseText;
                    //var fcl = document.getElementById('FIND_CHILD_LST');
                    //if ( fcl == null ) return;
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
                        c.style.padding         = '4px';
                        c.style.fontSize        = '12px';
                        c.style.width           = '100%';
                        c.style.height          = '24px';
                        c.style.backgroundColor = '';
                        // c.style.borderBottom    = '1px solid lightgray';
                        //c.style.borderRight = arChildGrade[ oChild.child_grade ];
                        c.style.float           = 'left';
                        r = '';
                        r += '<div style="height:20px;padding-left:2px;">';
                            r += child_name;
                        r += '</div>';
                        c.innerHTML = r;
                        var cc = parent.appendChild( c );
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
             kana.indexOf(keyword.toLowerCase(), 0, keyword.length ) == 0 ||
             keyword == '%' || keyword == '*' ){
            var o = document.createElement('DIV');
            o.setAttribute( 'child_id', child_id );
            o.style.padding     = '4px';
            o.style.fontSize    = '12px';
            o.style.height      = '20px';

            var r = '';
            r += '<div style="float:left;"  >' + child_name + '</div>';
            if ( absent )
                r += '<div style="float:right;padding-left:8px;width:20px;background-image:url(./images/sleep-2.png);background-size:18px;background-position:center center;background-repeat:no-repeat;">&nbsp;</div>';
                else
                r += '<div style="float:right;padding-left:8px;width:20px;background-image:url(./images/godzilla.png);background-size:18px;background-position:center center;background-repeat:no-repeat;">&nbsp;</div>';
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
