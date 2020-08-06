
//
//  チャイルドファインダー
//
function childFinder( e ){
    var tk = document.getElementById('TXT_KEYWORD');
    var keyword = tk.value;
    var fa = document.getElementById('FINDER_AREA');
    var p = document.getElementById('CHILD_FINDER');
    if ( keyword  != '' ){
        if ( fa == null )
        {
            var o = document.createElement('DIV');
            o.setAttribute( 'id', 'FINDER_AREA');
            o.style.position		= 'relative';
            o.style.padding			= '2px';
            o.style.top             = '12px';
            o.style.left            = '-84px';
            o.style.width           = '220px';
            o.style.height          = '140px';
            o.style.color			= ' gray';
            o.style.backgroundColor = '#EEEEEE';
            o.style.textAlign		='left';
            o.style.fontSize		= '14px';
            o.style.zIndex			= 50000;
            var m = p.appendChild( o );
            var r = '';
            r += '<div>keyword:<span id="HOGE" ></span></div>';

            m.innerHTML = r;
        }
    } else {
        if ( fa != null )
        {
            p.removeChild( fa );
        }
    }
    if ( fa != null ){
        var hoge = document.getElementById('HOGE');
        hoge.innerText = keyword;
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
