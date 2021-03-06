/*
 * このスクリプトはBODYタグで処理すること
 * 出ないとsocketの初期化がうまくいかない
*/

var socket = io();

const arChildGrade = ['','4px solid lightcoral', '4px solid lightgreen', '4px solid lightblue','4px solid lightcyan','4px solid lightyellow','4px solid lightseagreen'];
const arChildGradeColor = ['','lightcoral', 'lightgreen', 'lightblue', 'lightcyan', 'lightyellow','lightseagreen'];

/*
socket.on( 'getaccountlist', function ( msg ) {
    var r = "";
    var accs = eval( msg );
    var o = document.getElementById('AREA');
    o.style.visibility = 'visible';
//    r += "<pre>";
    for (var i=0; i<accs.length; i++) {
        r += accs[i].acc_id + '<br/>'; 
    }
    //r += msg;
    r += '<br/>length:' + accs.length;
//    r += "</pre>";
    r += "<div>";
    r += "<button onclick='clearArea();' >OK</button>";
    r += "</div>";
    o.innerHTML = r;

})
*/

//
//  アカウントリストを取得するsocket.io
//
function getAccountList(){
    socket.emit( 'cmd', 'getaccountlist' );
}

//
//  socket receiving
//
socket.on( 'sync', function( data ){
    console.log('socket.data:' + data );

    // var pac = eval( '(' + data + ')' );
    var children = JSON.parse( data );
    // console.log('socket.cmd:'  + pac.cmd );
    // console.log('socket.data:' + pac.data );

    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        if ( dayWhiteboard != c.day ) continue;

        var sc = scanWhiteboardChild( c.child_id );
        if ( sc != null ){
            var p = sc.parentNode;
            p.removeChild( sc );
        }
        console.log('sync:child_id:' + c.child_id );
        var cc = addChild( c.coordi_top + '%', c.coordi_left + '%',
            c.child_id, c.child_name, c.kana,
            c.child_type, c.child_grade, c.imagefile, c.remark, c.escort, ( c.absent == 1 )?true : false, false );
        if ( c.checkout != '' && c.checkout != null )
            checkoutChild( cc, c.acc_id, c.checkout, c.direction );
    }
    showWhiteboardChildCount();
    // oLog.log( null, 'delete child : ' + i + ' children.' );
    // oLog.open( 3 );
    updateFlg   = true;

    return;
})


//
//  socket sending
//
function exchange(){
    var json_children = getJSONChildren();
    socket.emit( 'sync', JSON.stringify( json_children ) );
    // socket.emit( 'sync', '{ "data":{(' + JSON.stringify( json_children ) + ')} }' );
    return;

}


/*
function loadChildrenForm(){
	var r = "";
	
	r += "<div style='width:400px;height:100%;margin:10px auto;background-color:white;overflow:hidden;' >";
		r += "<div id='OPAQUESHAFT_LOGINTITLE' >";
		r += "&nbsp;&nbsp;OpaqueShaft";
		r += "</div>"; 
		r += "<div style='height:40px;padding-top:20px;text-align:center;font-size:20px;' >Load children...</div>";
		r += "<div id='LOADCHILDREN_STATUS' style='height:20px;text-align:center;' >status</div>";
			r += "<div style='text-align:center;' >";
				r += "<button style='width:208px;' type='button' tabindex=3 onclick='loadChildren()' >load</button>";
				r += "<button type='button' tabindex=4 onclick='clearArea();' >cancel</button>";
			r += "</div>";
	r += "</div>";
	var o = document.getElementById('AREA');
	o.innerHTML = r;
	o.style.visibility = 'visible';
	o = document.getElementById( 'id' ); 
}
*/

//
//  チャイルドローディング(socket.ioベース)
//
// function loadChildren(){
// 	socket.emit( 'cmd', 'getchildrenlist' );
// }

//
//  ホワイトボードの全チャイルドを削除
//
function clearWhiteboard(){
    var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
		r += 'clear whiteboard';
	r += '</div>';

    r += '<div style="margin:0 auto;width:60%;text-align:center;padding-top:4px;">';
        r += '<button id="" type="button" class="accept_button" ';
        // r += ' style="font-size:24px;width:80px;height:80px;border:none;background-color:transparent;background-image:url(./images/check-3.png);background-size:24px;background-position:center center;background-repeat:no-repeat;" ';
        r += ' onclick="clearWhiteboardHelper();closeModalDialog();"   >';
            r += 'clear';
        r += '</button>';

        r += '<button id="" type="button" class="cancel_button" ';
        // r += ' style="font-size:20px;width:80px;height:80px;border:none;background-color:transparent;background-image:url(./images/cancel-2.png);background-position:center center;background-size:24px;background-repeat:no-repeat;" ';
        r += ' onclick="closeModalDialog();" >';
            r += 'cancel';
        r += '</button>'
    r += '</div>';

    openModalDialog( 'clear whiteboard', r, 'NOBUTTON', null, null );
    // openModalDialog( 'clear whiteboard', r, 'OK_CANCEL',
    //     function(){
    //         clearWhiteboardHelper();
    //         closeModalDialog();
    //     } , null );

}

function clearWhiteboardHelper(){
    deleteWhiteboardChildren();
    updateFlg   = true;
    oLog.log( null, 'all child on whiteboard was cleared.' );
    oLog.open( 3 );
    showWhiteboardChildCount();
}

//
//  ホワイトボード内のチルドレンを全削除
//
function deleteWhiteboardChildren(){
    var wb = document.getElementById('WHITEBOARD');
    while ( wb.firstChild){
        wb.removeChild( wb.firstChild );
    }
    var wb = document.getElementById('WHITEBOARD_CHECKOUT');
    while ( wb.firstChild){
        wb.removeChild( wb.firstChild );
    }

}
//
//  レポーティング
//
function reportWhiteboard(){

    // すでに開いていればクローズ
    if ( oReportDlg.opened() ){
        oReportDlg.close();
        return;
    }
    if ( oTile.opened('menu'))
        oTile.close('menu');

    var t = '';
	t += '<div style="font-size:24px;text-align:center;padding-top:12px;padding-bottom:12px;" >';
		t += 'report  ' + dayWhiteboard;
    t += '</div>';

    var r = '';
    r += '<div style="width:97%;height:;font-size:16px;clear:both;margin:0 auto;" >';
        r += 'Summary:'
    r += '</div>';
    r += '<div id="REPORT_SUMMARY" style="width:97%;height:;font-size:16px;background-color:white;clear:both;margin:0 auto;" >';
    r += '</div>';

    r += '<div style="width:97%;height:;font-size:16px;clear:both;margin:0 auto;" >';
        r += 'Detail:'
    r += '</div>';
    r += '<div id="REPORT_HDR"  style="width:97%;height:20px;padding:1px;font-size:12px;clear:both;color:red;background-color:lightgray;margin:0 auto;border:1px solid lightgrey;" >';
        r += '<div style="float:left;" >Name</div>';
        r += '<div style="float:right;width:25px;height:100%;padding:1px;border-left:1px solid white;" >Dir</div>';
        r += '<div style="float:right;width:40px;height:100%;padding:1px;border-left:1px solid white;" >Out</div>';
        r += '<div style="float:right;width:40px;height:100%;padding:1px;border-left:1px solid white;" >Est</div>';
        r += '<div style="float:right;width:40px;height:100%;padding:1px;border-left:1px solid white;" >In</div>';
        r += '<div style="float:right;width:40px;height:100%;padding:1px;border-left:1px solid white;" >Escort</div>';
        r += '<div style="float:right;width:30px;height:100%;padding:1px;border-left:1px solid white;" >Type</div>';
        r += '<div style="float:right;width:40px;height:100%;padding:1px;border-left:1px solid white;" >Grade</div>';
        r += '<div style="float:right;width:120px;height:100%;padding:1px;border-left:1px solid white;" >Remark</div>';
    r += '</div>';
    r += '<div id="REPORT_LIST" style="width:97%;height:;font-size:12px;clear:both;margin:0 auto;border:1px solid white;overflow:scroll;" >';
    r += '</div>';

    var f = '';
    f += '<div style="margin:0 auto;width:100%;height:100%;text-align:center;">';
        f += '<button id="" type="button" class="accept_button" ';
        // f += ' style="font-size:24px;width:42px;height:100%;border:none;background-color:transparent;background-image:url(./images/check-3.png);background-size:18px;background-position:center center;background-repeat:no-repeat;" ';
        f += ' onclick="oReportDlg.close();"   >';
            f += 'close';
        f += '</button>';
    f += '</div>';


    // openModalDialog( 'report ' + dayWhiteboard, r, 'NORMAL', null, 'MAX' );
    oReportDlg.setHandle( t );
    oReportDlg.setFooter( f );
    oReportDlg.set( r );
    oReportDlg.open();
    reportWhiteboardSummary();
    reportWhiteboardDetail();
}

//
//  タイル表示制御
//
function showTile(){

    if ( oTile.opened( 'menu' ))    oTile.close( 'menu' );
        else{
            if ( oNav.opened() ) oNav.close();    
            oTile.open( 'menu' );
        }

}


//
//レポーティングサマリー
//
function reportWhiteboardSummary(){
    var r = '';
    var c_all_children  = 0;
    var c_checkout      = 0;
    var c_escort        = 0;
    var c_children      = 0;
    var wb  = document.getElementById('WHITEBOARD');
    var wbe = document.getElementById('WHITEBOARD_CHECKOUT');
    
    c_children = wb.childNodes.length;
    for ( var i=0; i<wb.childNodes.length; i++ ){
        c_all_children++;
        var c = wb.childNodes[i];
        if ( c.hasAttribute('checkout'))    c_checkout++;
        // if ( c.hasAttribute('escort'))      c_escort++;
    }
    c_children = wbe.childNodes.length;
    for ( var i=0; i<wbe.childNodes.length; i++ ){
        c_all_children++;
        var c = wbe.childNodes[i];
        if ( c.hasAttribute('checkout'))    c_checkout++;
        if ( c.hasAttribute('escort'))      c_escort++;
    }
    
    var c_absent = countAbsentWhiteboard();
    r += '<div style="float:left;padding-left:10px;" >children:'   + c_all_children + '</div>';
    r += '<div style="float:left;padding-left:10px;" >checkout:'   + c_checkout + '</div>';
    r += '<div style="float:left;padding-left:10px;" >no checkout:'   + ( c_all_children - c_checkout ) + '</div>';
    r += '<div style="float:left;padding-left:10px;" >escort:'     + c_escort   + '</div>';
    r += '<div style="float:left;padding-left:10px;" >no escort:'  + ( c_all_children - c_escort ) + '</div>';
    r += '<div style="float:left;padding-left:10px;" >absent:'     + c_absent + '</div>';

    r += '';

    var summary_area = document.getElementById('REPORT_SUMMARY');
    summary_area.innerHTML  = r;

    if ( c_children != 0 ) var progress_ratio =  Math.floor( ( c_checkout / c_all_children ) * 100 );
    else			var progress_ratio = 0;

    var d = document.createElement('DIV');
    d.setAttribute( 'class', 'vh-center');
    d.style.position		= 'relative';
    d.style.float           = 'right';
    d.style.width			= '64px';
    d.style.height			= '64px';
    d.style.backgroundColor	= 'white';
    // d.style.border			= '1px solid lightgrey';
    var ccl = summary_area.appendChild( d );
    var cp = new CircleProgress( ccl, 64, 64, progress_ratio, 'rgb(255, 123, 0)', 22 );
    cp.play();


}

//
//  ホワイトボード上のアブセントオブジェクト数を取得する
//
function countAbsentWhiteboard(){
    var wbc = document.getElementById('WHITEBOARD_CHECKOUT');
    var cnt = 0;
    for ( var i=0; i<wbc.childNodes.length; i++ ){
        var c = wbc.childNodes[i];
        if ( c.hasAttribute('absent'))
            cnt++;
    }
    return cnt;
}

//
//  レポーティング詳細
//
function reportWhiteboardDetail(){
    var lst_area = document.getElementById('REPORT_LIST');
    // var wb = document.getElementById('WHITEBOARD');
    for ( var i=0; i<12; i++ ){
        // var c = wb.childNodes[i];
        var o = document.createElement('DIV');
        o.setAttribute('class', 'hour_frame');
        o.innerHTML             = '<div class="hour_tab" >' + ( '00' + ( i + 8 ) ).slice(-2) + ':00' + '</div>';
        lst_area.appendChild( o );
        var children = getChildrenByHour( i + 8 );
        for ( var j=0; j<children.length; j++ ){
            if ( children[j].hasAttribute('absent')) continue;

            var cc = document.createElement('DIV');
            var child_id    = children[j].getAttribute('child_id');
            var child_name  = children[j].getElementsByClassName('CHILD_NAME')[0].innerText;
            var child_type  = children[j].getAttribute('child_type');
            var child_grade = children[j].getAttribute('child_grade');
            var imagefile   = children[j].getAttribute('imagefile');
                imagefile   = ( imagefile != null )? imagefile : '';
            var checkin     = children[j].getAttribute('checkin');
            var estimate    = children[j].getElementsByClassName('ESTIMATE_TIME')[0].innerText;
            var checkout    = children[j].getAttribute('checkout');
                checkout    = ( checkout != null )? checkout : '---';
            var direction   = '';
            switch ( children[j].getAttribute('direction') ){
                case 'left':
                    direction += '<img width="10px" src="./images/prev.png" />';
                    break;
                case 'right':
                    direction += '<img width="10px" src="./images/next.png" />';
                    break;
                default:
                    direction += '&nbsp;';
                    break;
            }
            var escort      = '';
            switch ( children[j].hasAttribute('escort') ){
                case true:
                    escort += '<img width="16px" src="./images/family.png" />';
                    break;
                case false:
                    escort += '<img width="12px" src="./images/user-2.png" />';
                    break;
            }
            var remark      = ( children[j].hasAttribute('remark') )?
                                decodeURIComponent( children[j].getAttribute('remark') ) : '';
            var r = '';
            r += '<div style="clear:both;font-size:12px;padding:0px;" >';
                if ( imagefile != '' && imagefile != null ){
                    r += '<div style="float:left;clear:both;width:28px;height:28px;overflow:hidden;border-radius:45%;background-image:url(./images/children/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
                    r += '</div>';
                }else {
                    r += '<div style="float:left;clear:both;width:28px;height:28px;overflow:hidden;border-radius:45%;" >';
                    r += '</div>';
                }
            
                r += '<div style="float:left;"  >';
                    if ( checkout != '---' ) r += '<img width="10px" src="./images/check-3.png" />';
                    r += child_name;
                r += '</div>';
                r += '<div style="float:right;width:26px;" >' + direction   + '</div>';
                r += '<div style="float:right;width:41px;" >' + checkout    + '</div>';
                r += '<div style="float:right;width:41px;" >' + estimate    + '</div>';
                r += '<div style="float:right;width:41px;" >' + checkin     + '</div>';
                r += '<div style="float:right;width:41px;" class="vh-center">' + escort      + '</div>';
                r += '<div style="float:right;width:31px;" >' + child_type  + '</div>';
                r += '<div style="float:right;width:41px;" >' + child_grade + '</div>';
                r += '<div style="float:right;width:121px;overflow:hidden;" >' + remark + '</div>';
            r += '</div>';
            cc.style.height = '30px';
            cc.innerHTML    = r;
            var ccc = lst_area.appendChild( cc );
            ccc.setAttribute('child_id', child_id );
        }
    }

    // アブセント（欠席者）リスト
    var o = document.createElement('DIV');
    o.setAttribute('class', 'hour_frame');
    // o.style.color           = 'gray';
    // o.style.backgroundColor = 'transparent';
    // o.style.borderBottom    = '1px solid lightgrey';
    // o.style.padding         = '2px 2px 0px 0px';
    // o.style.marginBottom    = '0px';
    // o.style.clear           = 'both';
    o.innerHTML             = '<div class="hour_tab" >Absent</div>';
    lst_area.appendChild( o );
    var wba = document.getElementById('WHITEBOARD_CHECKOUT');
    for ( var i=0; i<wba.childNodes.length; i++ ){
        var c = wba.childNodes[i];
        if ( !c.hasAttribute('absent')) continue;
        var child_id    = c.getAttribute('child_id');

        var cc = document.createElement('DIV');
        var child_name  = c.getElementsByClassName('CHILD_NAME')[0].innerText;
        var child_type  = c.getAttribute('child_type');
        var child_grade = c.getAttribute('child_grade');
        var imagefile   = c.getAttribute('imagefile');
            imagefile   = ( imagefile != null )? imagefile : '';
        var checkin     = c.getAttribute('checkin');
        var estimate    = c.getElementsByClassName('ESTIMATE_TIME')[0].innerText;
        var checkout    = c.getAttribute('checkout');
            checkout    = ( checkout != null )? checkout : '---';
        var direction   = c.getAttribute('direction');
            direction   = ( direction != null )? direction : '---';
        var escort      = ( c.hasAttribute('escort') )?'yes':'no';
        var remark      = ( c.hasAttribute('remark') )?
                            decodeURIComponent( c.getAttribute('remark') ) : '';
        var r = '';
        r += '<div child_id="' + child_id + '" style="clear:both;font-size:12px;padding:2px;" >';
            if ( imagefile != '' && imagefile != null ){
                r += '<div style="float:left;clear:both;width:28px;height:28px;overflow:hidden;border-radius:45%;background-image:url(./images/children/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
                r += '</div>';
            }else {
                r += '<div style="float:left;clear:both;width:28px;height:28px;overflow:hidden;border-radius:45%;" >';
                r += '</div>';
            }
            r += '<div style="float:left;"  >' + child_name + '</div>';
            r += '<div style="float:right;width:26px;" >' + direction   + '</div>';
            r += '<div style="float:right;width:41px;" >' + checkout    + '</div>';
            r += '<div style="float:right;width:41px;" >' + estimate    + '</div>';
            r += '<div style="float:right;width:41px;" >' + checkin     + '</div>';
            r += '<div style="float:right;width:41px;" >' + escort      + '</div>';
            r += '<div style="float:right;width:31px;" >' + child_type  + '</div>';
            r += '<div style="float:right;width:41px;" >' + child_grade + '</div>';
            r += '<div style="float:right;width:121px;" >' + remark     + '</div>';
        r += '</div>';
        // cc.style.backgroundColor = 'orange';
        cc.style.height = '30px';
        cc.innerHTML    = r;
        var ccc = lst_area.appendChild( cc );
        ccc.setAttribute('child_id', child_id );
    }

    lst_area.addEventListener( 'click', selectReportChild );

}

//
//  レポート内のチャイルドをクリック
//
function selectReportChild( e ){
    var c = scanChild( e.target );
    if ( c == null ){
        return;
    } 
    
    var cid = c.getAttribute( 'child_id');

    var cc = scanWhiteboardChild( cid );
    if ( cc == null ) { console.log( 'child_id:' + cid + ':null');return;}

    var estimate   = cc.getElementsByClassName('ESTIMATE_TIME')[0].innerText;
    var h = estimate.substr(0, 2 );
    var wbf = document.getElementById('WHITEBOARD_FRAME');
    wbf.scrollTop = ( h - 8 ) * pixelPerHour;

    oReportDlg.close();
    new winker( cc, 7, 'wink_on' ).play();


}


//
//  指定したアブセントチャイルドリストをアテンド（出席）にする
//
// function attendChild(){
//     var lst_area = document.getElementById('ABSENT_LIST');
//     var attend_list = [];
//     for ( var i=0; i<lst_area.childNodes.length; i++ ){
//         var c = lst_area.childNodes[i];
//         if ( c.hasAttribute('marked')){
//             attend_list.push( c.getAttribute('child_id') );
//         }
//     }
//     console.log( 'attend_lst:' + attend_list );
//     for ( var i=0; i<attend_list.length; i++ ){
//         var c = scanAbsentChild( attend_list[i] );
//         if ( c != null )
//             attendChildHelper( c );
//     }
//     closeModalDialog();
//     showWhiteboardChildCount();
// }

//
//  アブセントチャイルドからchild_idを指定して検索する
//
function scanAbsentChild( child_id ){
    var wbco = document.getElementById('WHITEBOARD_CHECKOUT');
    for ( var i=0; i<wbco.childNodes.length; i++ ){
        c = wbco.childNodes[i];
        if ( c.hasAttribute('absent')){
            if ( c.getAttribute('child_id') == child_id )
                return c;
        }
    }
    return null;
}
//
//  指定したアブセントチャイルドをアテンド（出席）に変更する
//
function attendChildHelper( c ){
    var wb = document.getElementById('WHITEBOARD');
    // c.style.backgroundColor  = '';
    c.style.backgroundImage     = '';
    c.style.backgroundSize      = '';
    c.style.backgroundPosition  = '';
    c.style.backgroundRepeat    = '';
    c.style.borderColor         = '';
    c.style.transformOrigin     = '';
    c.style.transform           = '';
    c.removeAttribute('absent');

    console.log( 'attend before left:' + c.style.left );
    var cc = wb.appendChild( c );
    console.log( 'attend before after:' + cc.style.left );
    updateFlg   = true;

}

//
//  一番やはく帰宅するチャイルドの時間帯を取得
//
function getEarlyChildHour(){

    for ( var i=0; i<12; i++ ){
        var children = getChildrenByHour( i + 8 );
        if ( children.length > 0 ) return ( i + 8 );
    }
    return 0;
}
//
//  指定した時間帯のチャイルドリストを取得する
//
function getChildrenByHour( h ){
    var h_children = [];
    var i = 0;
    var children = document.getElementById('WHITEBOARD').childNodes;
    for ( var j=0; j<children.length; j++ ){
        var c = children[j];
        var s = ( h - 8 ) * pixelPerHour;
        var e = s + pixelPerHour - 1;
        if ( c.offsetTop >= s && c.offsetTop <= e )
             h_children[i++] = c;  
    }
    children = document.getElementById('WHITEBOARD_CHECKOUT').childNodes;
    for ( var j=0; j<children.length; j++ ){
        var c = children[j];
        var s = ( h - 8 ) * pixelPerHour;
        var e = s + pixelPerHour - 1;
        if ( c.offsetTop >= s && c.offsetTop <= e )
             h_children[i++] = c;  
    }
    return h_children;

}

//
//  WHITEBOARDにチャイルド(240x60)を実体化
//  WHITEBOARD_CHECKOUTには実体化はできない
//
function addChild( top, left, child_id, child_name, kana, child_type, child_grade, imagefile, remark, escort, absent, mark ){
    var now = new Date();
    var h = ( '00' + now.getHours() ).slice(-2);
    var m = ( '00' + now.getMinutes() ).slice(-2);
    var checkin_time = h + ':' + m;
    
    var wb = null;
    wb = document.getElementById('WHITEBOARD');

    var c = document.createElement("DIV");
	c.setAttribute("id",          "c_1");
    c.setAttribute("class",       "CHILD drag-and-drop");
    // c.setAttribute("child",       "yes");
    c.setAttribute('child_id',    child_id ) ;
    c.setAttribute('kana',        kana );
    c.setAttribute('checkin',     checkin_time );
    c.setAttribute('child_type',  child_type );
    c.setAttribute('child_grade', child_grade );
    c.setAttribute('imagefile',     ( imagefile == null )? '' : imagefile );
    if ( remark == null ) remark = '';
    c.setAttribute('remark', encodeURIComponent( remark ) );

    console.log('before addChild(top,left)=' + top + ',' + left );

    c.style.position    = 'absolute';
    if ( top === '' || top  == null ) top = pixelPerHour * ( 12 - 8 );
    if ( left == '' || left == null ) left = 42; 

    console.log('before2 addChild(top,left)=' + top + ',' + left );

    // c.style.top         = top + 'px';
    if ( ( top + '' ).indexOf( '%', 0 ) > -1 )
        c.style.top     = top;
        else
        c.style.top     = top + 'px';


    if ( ( left + '' ).indexOf( '%', 0 ) > -1 )
        c.style.left    = left;
        else
        c.style.left    = left + 'px';
    // c.style.borderRight = arChildGrade[ child_grade ];

    console.log('addChild(top,left)=' + c.style.top + ',' + c.style.left );

    var r = '';
 //   r += '<div style="width:4px;height:100%;float:left;background-color:' + arChildGradeColor[child_grade] + ';" ></div>';
    r += '<div style="padding:2px;" >';
        r += '<div style="width:100%;height:18px;font-size:12px;" >';
            r += '<div class="CHILD_NAME"    style="width:77%;height:18px;float:left;overflow:hidden;text-overflow:ellipsis;" >' + child_name + '</div>';
            r += '<div class="ESTIMATE_TIME" style="height:18px;padding-left:0px;float:right;text-align:right;" >';
            // r += hm;
            r += '</div>';
        r += '</div>';
        r += '<div>';
            if ( imagefile != '' && imagefile != null ){
                r += '<div style="float:left;width:28px;height:28px;overflow:hidden;border-radius:45%;background-image:url(./images/children/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
                r += '</div>';
            }
            r += '<div class="TYPE_GRADE vh-center"  style="font-weight:bold;height:20px;float:right;font-size:12px;text-align:right;" >';
                r += child_grade + child_type;
                // r += '<span style="color:' + arChildGradeColor[ child_grade ] + ';" >●</span>'
            r += '</div>';
            r += '<div class="DIRECTION_FLG"         style="height:20px;padding-left:2px;float:right;width:17px;" >&nbsp;';
            r += '</div>';
            r += '<div class="CHECKOUT_FLG"          style="height:20px;padding-left:2px;float:right;width:17px;" >&nbsp;';
            r += '</div>';
            r += '<div class="ESCORT_FLG"            style="height:20px;padding-left:2px;float:right;width:17px;" >&nbsp;';
            r += '</div>';
        r += '</div>';
    r += '</div>';

    c.innerHTML = r;
    //
    //  WHITEBOARDに追加
    //
    var cc = wb.appendChild( c );
    var et = cc.getElementsByClassName('ESTIMATE_TIME')[0];
    var hm    = coordinateToTime( cc.offsetTop, cc.offsetLeft );
    et.innerText    = hm;

    // var escort = coordinateToEscort( cc.offsetTop, cc.offsetLeft );
    // エスコート処理
    if ( escort ){
        // var wbe = document.getElementById('WHITEBOARD_XXX');
        // cc = wbe.appendChild( cc );
        cc.setAttribute('escort', 'yes' );
        setEscortHelper( cc, 'ON' );
    }

    //  アブセント処理・表現
    if ( absent ){
        absentChildHelper( cc );
    } 

    if ( mark )
        markChild( cc );
    var touchdevice = ( 'ontouchend' in document );
    if ( touchdevice )  cc.addEventListener( "touchstart", mDown, false );
        else            cc.addEventListener( "mousedown",  mDown, false );
        
    updateFlg   = true;
    return cc;

}

//
//  管理用・パレット用チャイルドを実体化
//
function addChildManage( oParent, oChild ){

    var c = document.createElement("DIV");
    // c.setAttribute("child",     "yes");
	c.setAttribute("id",          "c_1");
    c.setAttribute("child_id",    oChild.child_id );
    c.setAttribute("class",       "PALLETE_CHILD");
    c.setAttribute('kana',        oChild.kana );
    c.setAttribute('child_type',  oChild.child_type );
    c.setAttribute('child_grade', oChild.child_grade );
    c.setAttribute("draggable",   "true");
    // c.style.position    = 'relative';
//    c.style.height      = '30px';
    c.style.clear       = 'both';
    // c.style.borderBottom= '1px solid lightgrey';
    // c.style.borderRight = arChildGrade[ oChild.child_grade ];
    c.style.float       ='left';
    var r = '';
    r += '<div class="CHILD_NAME" style="float:left;height:20px;font-size:12px;padding-left:2px;">';
        r += oChild.child_name;
    r += '</div>';
    r += '<div style="float:right;font-size:12px;text-align:right;padding-top:2px;" >';
        r += oChild.child_type;
        r += '<span style="color:' + arChildGradeColor[ oChild.child_grade ] + ';">●</span>';
    r += '</div>';

	c.innerHTML = r;
    var cc = oParent.appendChild( c );
	cc.addEventListener('dragstart',
		function(e) {
            dndOffsetX = e.offsetX;
            dndOffsetY = e.offsetY;
            console.log( e.dataTransfer );
            console.log('offsetY:' + dndOffsetY + ' OffsetX:' + dndOffsetX );
			e.dataTransfer.setData('text', e.target.getAttribute( 'child_id' ) );
		} );

}

//
//  チャイルドプロパティ(SINGLE base)
//
function propertyWhiteboardChild( c ){
    var children = getMarkedChild();
    if ( children.length != 1 ) return;

    var c = children[0];
    var id = c.getAttribute('child_id');
    console.log( id );

    var child_name  = c.getElementsByClassName('CHILD_NAME')[0].innerText;
    var child_grade = c.getAttribute('child_grade');
    var child_type  = c.getAttribute('child_type');
    var checkin     = c.getAttribute('checkin');
    var checkout    = ( c.hasAttribute('checkout') )? c.getAttribute('checkout') : '---';
    var direction   = ( c.hasAttribute('direction') )? c.getAttribute('direction') : '---';
    var estimate    = c.getElementsByClassName('ESTIMATE_TIME')[0].innerText;
    var escort      = ( c.hasAttribute('escort') )? 'yes':'no';
    var remark      = ( c.hasAttribute('remark') )? decodeURIComponent( c.getAttribute('remark') ) : '';

    var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:12px;padding-bottom:12px;" >';
		r += 'Property of whiteboard child';
	r += '</div>';

    r += '<div style="width:400px;height:;margin:10px auto;" >';
        r += '<div style="font-size:16px;border-bottom:1px solid lightgrey;" >';
        r += child_name + '&nbsp;' + child_grade + child_type;
        r += '</div>';
        r += '<div style="display:flex;" >';
            r += '<div style="padding:4px;" >checkin time:'  + checkin   + '</div>';
            r += '<div style="padding:4px;" >estimate time:' + estimate  + '</div>';
            r += '<div style="padding:4px;" >checkout time:' + checkout  + '</div>';
            r += '<div style="padding:4px;" >direction:'     + direction + '</div>';
            r += '<div style="padding:4px;" >escort:'        + escort    + '</div>';
        r += '</div>';

        r += '<div style="clear:both;font-size:16px;" >';
            r += 'Remark:'
        r += '</div>';
        r += '<div style="width:100%;height:60px;" >';
            r += '<form name="childProp" onsubmit="return false;" >';
                r += '<textarea name="remark" style="width:100%;height:100%;" >' + remark + '</textarea>';
            r += '</form>';
        r += '</div>';

        r += '<div style="clear:both;font-size:16px;" >';
            r += 'Histories:'
        r += '</div>';
        r += '<div id="HISTORY_HDR" style="clear:both;color:red;height:16px;background-color:lightgrey;border:1px solid lightgrey;" >';
            r += '<div style="float:left;width:80px;text-align:center;border-right:1px solid gray;" >Day</div>';
            r += '<div style="float:left;width:60px;text-align:center;border-right:1px solid gray;" >checkin</div>';
            r += '<div style="float:left;width:60px;text-align:center;border-right:1px solid gray;" >estimate</div>';
            r += '<div style="float:left;width:60px;text-align:center;border-right:1px solid gray;" >checkout</div>';
            r += '<div style="float:left;width:60px;text-align:center;border-right:1px solid gray;" >direction</div>';
            r += '<div style="float:left;width:30px;text-align:center;" >escort</div>';
        r += '</div>';

        r += '<div id="HISTORY_LST" style="height:100px;font-size:10px;border:1px solid lightgrey;" >';
        r += '</div>';
/*
        r += "<div style='padding-top:60px;border-top:1px solid lightgrey;' >";
            r += "<button type='button' style='width:260px;font-size:24px;' ";
            r += " onclick='checkoutClearChild(propChild);closeModalDialog();' >";
                r += "<img width='32px' src='./images/close.png' />checkout clear";
            r += "</button>";
            r += "&nbsp;";
            r += "<button type='button' style='width:260px;font-size:24px;' ";
            r += " onclick='checkoutChild(propChild, null, null, null );closeModalDialog();'   >";
                r += "<img width='32px' src='./images/check.png' />checkout";
            r += "</button>";
        r += "</div>";
*/
        r += "</div>";
        openModalDialog( 'Property of child', r, 'OK_CANCEL',
            function(){
                updateChildRemark();
                closeModalDialog();
            } , null );

    propertyWhiteboardChildHelper( id );

}

//
//
//
// function updateChildRemark(){
//     var children = getMarkedChild();
//     if ( children.length != 1 ) return;
//     var c = children[0];
//     var remark = childProp.remark.value;
//     c.setAttribute( 'remark', encodeURIComponent( remark ) );

// }
function updateChildRemark( child_id ){
    var c = scanWhiteboardChild( child_id );
    if ( c == null ) return;
    var remark = document.forms[ 'childProp_' + child_id ].remark.value;
    // var remark = document.getElementById('child_remark_' + child_id ).value;
    c.setAttribute( 'remark', encodeURIComponent( remark ) );
    console.log( 'childProp_' + child_id + '.remark:' + remark );

}

//
//  チャイルドの利用履歴をリストアップする
//
function propertyWhiteboardChildHelper( child_id ){

	var r = "";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		switch ( xmlhttp.readyState){
			case 1://opened
			case 2://header received
			case 3://loading
				var o = document.getElementById( 'HISTORY_LST_' + child_id );
				o.innerText = 'access...';
				break;
			case 4://done
				r = '';
				if ( xmlhttp.status == 200 ){
                    var result = JSON.parse( xmlhttp.responseText );
                    
					//r += xmlhttp.responseText;
					var o = document.getElementById('HISTORY_LST_' + child_id );
					o.innerText = '';
					for ( var i=0; i<result.length; i++ ){
                        // addChildManage( o, result[i] );
                        var wday = new Date( result[i].day );
                        var hmd =
                            wday.getFullYear() + '/' + ( '00' + ( wday.getMonth() + 1 ) ).slice(-2) + '/' + 
                            ( '00' + wday.getDate() ).slice(-2);
                        var checkin     = result[i].checkin;
                        var estimate    = result[i].estimate;
                        var checkout    = result[i].checkout;
                        var direction   = result[i].direction;
                        if ( direction == '' || direction == null ) direction = '---';
                        var escort      = result[i].escort;
                        r += '<div style="clear:both;height:20px;border-bottom:1px solid lightgrey;" >';
                            r += '<div style="float:left;width:60px;text-align:center;" >' + hmd       + '</div>';
                            // r += '<div style="float:left;width:60px;text-align:center;" >' + checkin   + '</div>';
                            r += '<div style="float:left;width:50px;text-align:center;" >' + estimate  + '</div>';
                            // r += '<div style="float:left;width:60px;text-align:center;" >' + checkout  + '</div>';
                            // r += '<div style="float:left;width:60px;text-align:center;" >' + direction + '</div>';
                            r += '<div style="float:left;width:30px;text-align:center;" >' + escort    + '</div>';

                        r += '</div>';
					}
					o.innerHTML = r;
				} else{
					document.getElementById('HISTORY_LST_' + child_id ).innerText = xmlhttp.status;
				}
				break;
		}
	}
	try{
		xmlhttp.open("POST", "/accounts/resultlist", true );
		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xmlhttp.send( 'child_id=' + child_id );

	} catch ( e ) { alert( e );}

}

//
//  チャイルドプロパティ（マルチフレックス版）
//
function propertyChildren(){
    var children = getMarkedChild();
    if ( children == null || children.length == 0 ) return;

    var frame = document.createElement('DIV');
    frame.style.position            = 'absolute';
    frame.style.top                 = '0px';
    frame.style.left                = '0px';
    frame.style.width               = '100%';
    frame.style.height              = 'calc(100% - 0px)';
    frame.style.paddingTop          = '0px';
    frame.style.overflow            = 'scroll';
    frame.style.display             = 'flex';
    frame.style.flexWrap            = 'wrap';
    frame.style.justifyContent      = 'center';
    frame.style.alignItems          = 'center';
    frame.style.background          = 'rgba(0,0,0,0.5)';
    frame.style.backgroundImage     = 'url(./images/cancel-2.png)';
    frame.style.backgroundSize      = '42px';
    frame.style.backgroundPosition  = 'top 4px right 4px';
    frame.style.backgroundRepeat    = 'no-repeat';

    // frame.style.filter          = 'blur(4px)';
    //frame.style.opacity         = 0.5;
    frame.style.zIndex              = 70000;

    // var oFrame = document.body.appendChild( frame );
    var oFrame = document.getElementById('LAYER').appendChild( frame );
    oFrame.addEventListener( 'click',
        function(e){
            if ( this == e.target )
                // document.body.removeChild( this );
                this.parentNode.removeChild( this );
        }, false );

    for ( var i=0; i<children.length; i++ ){
        var c = children[i];

        var id = c.getAttribute('child_id');    
        var child_name  = c.getElementsByClassName('CHILD_NAME')[0].innerText;
        var child_grade = c.getAttribute('child_grade');
        var child_type  = c.getAttribute('child_type');
        var checkin     = c.getAttribute('checkin');
        var checkout    = ( c.hasAttribute('checkout') )? c.getAttribute('checkout') : '---';
        var direction   = ( c.hasAttribute('direction') )? c.getAttribute('direction') : '---';
        var estimate    = c.getElementsByClassName('ESTIMATE_TIME')[0].innerText;
        var escort      = ( c.hasAttribute('escort') )? 'yes':'no';
        var remark      = ( c.hasAttribute('remark') )? decodeURIComponent( c.getAttribute('remark') ) : '';
        var imagefile   = c.getAttribute('imagefile');
    

        var o = document.createElement('DIV');
        o.style.width           = '172px';
        o.style.height          = '352px';
        o.style.margin          = '1px';
        o.style.padding         = '4px';
        o.style.borderRadius    = '8px';
        o.style.backgroundColor = 'white';
        o.style.border          = '1px solid black';
        o.style.color           = 'dimgray';
        o.style.fontSize        = '12px';
    

        var r = '';
        r += '<div style="width:100%;height:;" >';
            r += '<div style="width:100%;height:20px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:16px;font-weight:bold;border-bottom:1px solid lightgrey;" >';
            r += child_name + '&nbsp;' + child_grade + child_type;
            r += '</div>';
            r += '<div style="clear:both;width:100%;overflow:hidden;display:inline;" >';
                if ( imagefile != '' ){
                    r += '<div style="float:left;width:50px;height:50px;overflow:hidden;border-radius:45%;background-image:url(./images/children/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
                    r += '</div>';
                }
                r += '<div style="float:right;" >';
                    r += '<div style="padding:1px;" >checkin:'  + checkin   + '</div>';
                    r += '<div style="padding:1px;" >estimate:' + estimate  + '</div>';
                    r += '<div style="padding:1px;" >checkout:' + checkout  + '</div>';
                    r += '<div style="padding:1px;" >direction:'     + direction + '</div>';
                    r += '<div style="padding:1px;" >escort:'        + escort    + '</div>';
                r += '</div>';
            r += '</div>';

            r += '<div style="clear:both;font-size:14px;width:100%;border-bottom:1px solid lightgrey;" >';
                r += 'Remark:'
            r += '</div>';
            r += '<div style="width:97%;height:38px;padding-top:2px;" >';
                r += '<form name="childProp_' + id + '" onsubmit="return false;" >';
                    r += '<textarea id="child_remark_' + id + '" name="remark" style="width:97%;height:100%;" >' + remark + '</textarea>';
                r += '</form>';
            r += '</div>';

            r += '<div style="width:100%;padding-top:1px;text-align:center;" >';
                if ( checkout != '---' )
				    r += '<button type="button" style="background-color:transparent;border:none;"  ><img width="20px;" src="/images/check-3.png" ></button>';
                switch ( direction ){
                    case 'left':
                        r += '<button type="button" style="background-color:transparent;border:none;"  ><img width="20px;" src="/images/arrow-left.png" ></button>';
                        break;
                    case 'right':
                        r += '<button type="button" style="background-color:transparent;border:none;"  ><img width="20px;" src="/images/arrow-right.png" ></button>';
                        break;
                }
                if ( escort == 'yes' )
				    r += '<button type="button" style="background-color:transparent;border:none;"  ><img width="20px;" src="/images/family.png" ></button>';
                    else
                    r += '<button type="button" style="background-color:transparent;border:none;"  ><img width="20px;" src="/images/user-2.png" ></button>';
			r += "</div>";

            r += '<div style="clear:both;font-size:14px;" >';
                r += 'Histories:'
            r += '</div>';
            r += '<div id="HISTORY_HDR" style="clear:both;color:red;height:16px;background-color:lightgrey;border:1px solid lightgrey;" >';
                r += '<div style="float:left;width:60px;text-align:center;border-right:1px solid gray;" >Day</div>';
                // r += '<div style="float:left;width:60px;text-align:center;border-right:1px solid gray;" >checkin</div>';
                r += '<div style="float:left;width:50px;text-align:center;border-right:1px solid gray;" >estimate</div>';
                // r += '<div style="float:left;width:60px;text-align:center;border-right:1px solid gray;" >checkout</div>';
                // r += '<div style="float:left;width:60px;text-align:center;border-right:1px solid gray;" >direction</div>';
                r += '<div style="float:left;width:30px;text-align:center;" >escort</div>';
            r += '</div>';

            r += '<div id="HISTORY_LST_' + id + '" style="height:80px;font-size:10px;border:1px solid lightgrey;" >';
            r += '</div>';

			r += '<div style="width:100%;padding-top:4px;text-align:center;" >';
				r += '<button type="button" id="BTN_UPDATE_CHILD_REMARK_' + id + '" class="accept_button" ';
                // r += ' style="background-color:transparent;border:none;" ';
                r += '>update';
                r += '</button>';
			r += "</div>";

        r += '</div>';

        o.innerHTML             = r;
        oFrame.appendChild( o );
        document.getElementById('BTN_UPDATE_CHILD_REMARK_' + id ).addEventListener(
            'click', function(e){
                updateChildRemark( id );
                oLog.log( null, 'update child.' );
                oLog.open( 3 );
            }, false );
        propertyWhiteboardChildHelper( id );

    }

}

//
//  チャイルドの削除（マーク用ラッパー）
//
// function deleteWhiteboardMarkChild(){
//     var children = getMarkedChild();
//     if ( children.length == 0 ) return;
//     deleteWhiteboardChild();
// }

//
//  チャイルドの削除
//  
function deleteWhiteboardChild(){

    var children = getMarkedChild();
    // var children = document.getElementById( curWhiteboard).childNodes;
    
    if ( ( children.length ) == 0){
        console.log('deleteWhiteboardChild:none' );
        return;
    }

    var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
		r += 'delete child';
	r += '</div>';
    r += '<div id="CHILD_LST" style="margin:0 auto;width:80%;height:150px;font-size:14px;border:1px solid lightgrey;">';
	r += '</div>';
	r += '<div style="margin:0 auto;width:80%;text-align:center;padding-top:4px;">';
        r += '<button id="BTN_DELETEWHITEBOARDCHILD" type="button" class="accept_button" ';
        // r += ' style="font-size:24px;width:80px;height:80px;border:none;background-color:transparent;background-image:url(./images/check-3.png);background-size:24px;background-position:center center;background-repeat:no-repeat;" ';
        r += ' onclick="deleteWhiteboardChildHelper();"   >';
            r += 'delete';
        r += '</button>';

        r += '<button id="" type="button" class="cancel_button" ';
        // r += ' style="font-size:20px;width:80px;height:80px;border:none;background-color:transparent;background-image:url(./images/cancel-2.png);background-position:center center;background-size:24px;background-repeat:no-repeat;" ';
        r += ' onclick="closeModalDialog();" >';
            r += 'cancel';
        r += '</button>'
    r += '</div>';
    openModalDialog( 'delete child', r, 'NOBUTTON',
        null, 'DELETE' );
    // openModalDialog( 'delete child', r, 'OK_CANCEL',
    //     function(){
    //         deleteWhiteboardChildHelper();
    //         closeModalDialog();
    //     }, 'DELETE' );
    // document.getElementById('BTN_DELETEWHITEBOARDCHILD').focus();
    makeDeleteChildList();
 
}

function makeDeleteChildList(){
    var children = getMarkedChild();
    var lst = document.getElementById('CHILD_LST');
    
    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        var o = document.createElement('DIV');
        o.style.borderBottom    = '1px solid lightgrey';
        o.style.padding         = '2px';
        o.style.height          = '20px';
        o.innerText = c.getElementsByClassName('CHILD_NAME')[0].innerText;
        lst.appendChild( o );
    }
}
//
//  チャイルドを削除（シングル）
//
// function deleteWhiteboardChildSingleHelper(){
//     console.log('deleteWhiteboardMarkChildHelper' );
//     closeModalDialog();
//     propChild.parentNode.removeChild( propChild );
//     propChild = null;
//     showWhiteboardChildCount();
// }

//
//  マークしているチャイルドを削除（非表示処理）
//
function deleteWhiteboardChildHelper(){
    // console.log('deleteWhiteboardChildHelper' );
    closeModalDialog();
    // var p = document.getElementById( 'WHITEBOARD');
    // var c = p.firstChild;
    // var i=0;
    // while( c ){
    //     if ( isMarkedChild( c ) ) {
    //         i++;
    //         p.removeChild( c );
    //         c = p.firstChild;
    //     } else {
    //         c = c.nextSibling;
    //     }
    // }

    var children = getMarkedChild();
    i = 0;
    for ( var j=0; j<children.length; j++ ){
        var p = children[j].parentNode;
        p.removeChild( children[j] );
        i++;
    }

    showWhiteboardChildCount();
    oLog.log( null, 'delete child : ' + i + ' children.' );
    oLog.open( 3 );
    // console.log('delete child:' + i );
    updateFlg   = true;
}

//
//  マークしたチャイルドのコレクション取得
//
function getMarkedChild(){
    var children = [];
    var index = 0;
    var p = document.getElementById( 'WHITEBOARD' );
    var c = p.firstChild;
    while( c ){
        if ( isMarkedChild( c ) )
            // children[index++] = c;
            children.push( c );
        c = c.nextSibling;
    }
    p = document.getElementById( 'WHITEBOARD_CHECKOUT' );
    c = p.firstChild;
    while( c ){
        if ( isMarkedChild( c ) )
            // children[index++] = c;
            children.push( c );
        c = c.nextSibling;
    }

    console.log( 'mark child:' + children.length );
    return children;
}

//
//  エスコートエリアでマークしたチャイルドのコレクション取得
//
function getMarkedEscortChild(){
    var children = [];
    var index = 0;
    var p = document.getElementById( 'WHITEBOARD_CHECKOUT');
    var c = p.firstChild;
    while( c ){
        if ( isMarkedChild( c ) )
            children[index++] = c;
        c = c.nextSibling;
    }
    console.log( 'mark child:' + index );
    return children;
}

//
//  指定したチャイルドがマークされているかをチェック
//
function isMarkedChild( c ){
    return c.hasAttribute( 'marked' );
}

//
//  WHITEBOARDから指定したchild_idを持つチャイルドを検索する
//
function scanWhiteboardChild( child_id ){
    var children = document.getElementById('WHITEBOARD').childNodes;
    for ( var i=0; i<children.length; i++){
        var c = children[i];
        if ( c.hasAttribute('child_id') ){
            if ( child_id == c.getAttribute('child_id') ){
                return c;
            }
        }
    }
    children = document.getElementById('WHITEBOARD_CHECKOUT').childNodes;
    for ( var i=0; i<children.length; i++){
        var c = children[i];
        if ( c.hasAttribute('child_id') ){
            if ( child_id == c.getAttribute('child_id') ){
                return c;
            }
        }
    }

    return null;
}
//
//  ダブルクリックしたノードからChildノードをバブルアップ検索('child_id'を持つかどうか)
//
function scanChild( o ) {
    while ( true ) {
        var tn = o.tagName;
        if ( tn.toLowerCase() == "body" ) return null;
        // if ( o.getAttribute("child") == "yes" ) return o;
        if ( o.hasAttribute("child_id") ) return o;
        o = o.parentNode;
    }
}

//
//  チャイルドのマーク
//
function markChild( c ) {
    if ( c == null ) return;
    c.setAttribute('marked', 'MARKED' );
    // c.style.backgroundColor = '#DDDDDD';
    // c.style.color           = 'gray';
    c.classList.add("marked");

    // commonProc();
}

//
//  チャイルドのマーク解除
//
function unmarkChild( c ) {
    if ( c == null ) return;
    c.removeAttribute('marked');
    // c.style.backgroundColor = '';
    // c.style.color           = '';
    c.classList.remove("marked");

    // コンテキストメニューの削除
    var cMenu = c.lastChild;
    if ( cMenu.hasAttribute('cmenu'))
        c.removeChild(cMenu);
    // commonProc();
}

//  コンテキストメニューが表示されているかをチェック
// function existContextMenu( c ){
//     var cMenu = c.lastChild;
//     return ( cMenu.hasAttribute('cmenu') );

// }

//
//  コンテキストメニューが複数表示されないように他のメニューは削除する
//
// function clearOtherContextMenu( c ){
//     var wb = document.getElementById('WHITEBOARD');
//     for ( var i=0; i<wb.childNodes.length; i++ ){
//         var o = wb.childNodes[i];
//         if ( c != o && o.lastChild.hasAttribute('cmenu') ){
//             o.removeChild( o.lastChild );
//         }
//     }    
// }

//
//  ホワイトボードのチャイルド数をステータス表示
//
function showWhiteboardChildCount(){
    var wb  = document.getElementById('WHITEBOARD').childNodes;
    var wbe = document.getElementById('WHITEBOARD_CHECKOUT').childNodes;
    // var wcc = document.getElementById('ID_WHITEBOARD_CHILD_COUNT');
    var cci = document.getElementById('C_CHECKIN');
    var cco = document.getElementById('C_CHECKOUT');
    // wcc.innerText = wb.length + wbe.length;
    var c_checkout = showWhiteboardChildCountCheckout();

    cci.innerText = wb.length;
    cco.innerText = wbe.length;
    showWhiteboardChildCountAbsent();

    var ratio = 0;
    if ( ( wb.length + wbe.length )  != 0)
        ratio =  Math.floor( c_checkout / ( wb.length + wbe.length ) * 100 );

    console.log( 'maketoolbarcheckoutprogress:' + ratio );
    makeToolbarCheckoutProgress( ratio );
}

//
//  ホワイトボードのチェックアウトしたチャイルド数をステータス表示
//
function showWhiteboardChildCountCheckout(){
    // var wccc = document.getElementById('ID_WHITEBOARD_CHILD_COUNT_CHECKOUT');

    var cnt = 0;
    var children  = document.getElementById('WHITEBOARD').childNodes;
    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        if ( c.hasAttribute('checkout')) cnt++;
    }
    children  = document.getElementById('WHITEBOARD_CHECKOUT').childNodes;
    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        if ( c.hasAttribute('checkout')) cnt++;
    }

    // wccc.innerText = cnt;
    return cnt;
}

//
//  ホワイトボード内のアブセント（欠席）チャイルド数を表示
//
function showWhiteboardChildCountAbsent(){
    // var wcca = document.getElementById('ID_WHITEBOARD_CHILD_COUNT_ABSENT');
    // var c = countAbsentWhiteboard();
    // wcca.innerText = c;

}
//
//  ホワイトボード内の最後尾のチャイルド取得
//
function latestWhiteboardChild(){
    var children = document.getElementById('WHITEBOARD').childNodes;
    if ( children        == null ) return null;
    if ( children.length == 0 ) return null;
    return children[children.length-1];
}

//
//  マークしているチャイルドのエスコートを反転
//  alone -> escort, escort -> alone
//
function escortChild(){
    var children = getMarkedChild();
    if ( children.length == 0 ) return;

    var wb  = document.getElementById('WHITEBOARD');
    var wbe = document.getElementById('WHITEBOARD_CHECKOUT');
    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        // switch ( curWhiteboard ){
        //     case 'WHITEBOARD':      //  WHITEBOARD -> WHITEBOARD_CHECKOUT
        //         // var cc = wbe.appendChild( c );
        //         var cc = c;
        //         cc.setAttribute('escort', 'yes');
        //         setEscortHelper( cc, 'ON' );
        //         break;
        //     case 'WHITEBOARD_CHECKOUT':   // WHITEBOARD_CHECKOUT -> WHITEBOARD
        //         // var cc = wb.appendChild( c );
        //         var cc = c;
        //         cc.removeAttribute('escort');
        //         setEscortHelper( cc, 'OFF' );
        //         break;
        // }
        if ( c.hasAttribute('escort') ){
            c.removeAttribute('escort');
            setEscortHelper( c, 'OFF' );
        } else {
            c.setAttribute('escort', 'yes');
            setEscortHelper( c, 'ON' );
        }
        unmarkChild( c );
    }


}

//
//  マークしているチャイルドのエスコート処理
//  alone -> escort
//
function escortWhiteboardChild(){
    var children = getMarkedChild();
    if ( children.length == 0 ) return;
    
    var wbe = document.getElementById('WHITEBOARD_XXX');
    
    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        // var cc = wbe.appendChild( c );
        var cc = c;
        unmarkChild( cc );
        cc.setAttribute('escort', 'yes');
        setEscortHelper( cc, 'ON' );
    }
}
//
//  マークしているチャイルドのエスコート解除処理
//  alone -> escort
//
function unEscortWhiteboardChild(){
    var children = getMarkedEscortChild();
    if ( children.length == 0 ) return;
    
    var wb = document.getElementById('WHITEBOARD');
    
    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        var cc = wbe.appendChild( c );
        unmarkChild( cc );
        cc.removeAttribute('escort');
        setEscortHelper( cc, 'OFF' );
    }
}


//
//  エスコート表示処理
//
function setEscortHelper( c, flag ){
    var escort_flg = c.getElementsByClassName('ESCORT_FLG');
    var escort = escort_flg[0];
    switch ( flag ){
        case 'ON':
            escort.style.backgroundImage = 'url(./images/family.png)';
            escort.style.backgroundPosition = 'center center';
            escort.style.backgroundRepeat = 'no-repeat';
            escort.style.backgroundSize   = '18px';
            break;
        case 'OFF':
        default:
            escort.style.backgroundImage = '';
            escort.style.backgroundPosition = '';
            escort.style.backgroundRepeat = '';
            escort.style.backgroundSize   = '';
            break;
    }
    updateFlg   = true;
}
//
//  Childをチェックアウト（帰宅）
//
function checkoutChild( c, operator, co_time, direction ){
    if ( c == null ) return;
    var checkout_time = null;
    if ( co_time == '' || co_time == null ){
        var now = new Date();
        var h = ( '00' + now.getHours() ).slice(-2);
        var m = ( '00' + now.getMinutes() ).slice(-2);
        checkout_time = h + ':' + m;
    } else {
        checkout_time = co_time.substr( 0, 5 );
    }
    if ( direction == '' || direction == null ) direction = '---';
    if ( operator  == '' || operator == null  ) operator  = acc_id; 
    c.setAttribute('checkout', checkout_time );
    c.setAttribute('direction', direction );
    c.setAttribute('operator',  operator );
    c.style.borderColor = 'limegreen';
    // console.log( c.getAttribute('child_id') );
    // document.getElementById( 'CHECKOUT_' + c.getAttribute('child_id') ).innerText =
    //     'checkout:' + checkout_time;
    var cf = c.getElementsByClassName('CHECKOUT_FLG')[0];
    cf.style.backgroundImage    = 'url(./images/check-3.png)';
    cf.style.backgroundPosition = 'center center';
    cf.style.backgroundRepeat   = 'no-repeat';
    cf.style.backgroundSize     = '14px';

    var df = c.getElementsByClassName('DIRECTION_FLG')[0];
    switch ( direction ){
        case 'left':
            df.style.backgroundImage    = 'url(./images/arrow-left.png)';
            df.style.backgroundPosition = 'center center';
            df.style.backgroundRepeat   = 'no-repeat';
            df.style.backgroundSize     = '14px';
            break;
        case 'right':
            df.style.backgroundImage    = 'url(./images/arrow-right.png)';
            df.style.backgroundPosition = 'center center';
            df.style.backgroundRepeat   = 'no-repeat';
            df.style.backgroundSize     = '14px';
            break;
        default:
            break;
    }

    // c.style.transformOrigin     = 'top left';
    // c.style.transform           = 'rotate(-45deg)';

    updateFlg   = true;

    //WHITEBOARD_CHECKOUTへ移動
    var wbc = document.getElementById('WHITEBOARD_CHECKOUT');
    var cc = wbc.appendChild( c );

    showWhiteboardChildCountCheckout();
    
}

//
//  チャイルドをチェックアウト(マーク用ラッパー)
//
// function checkoutWhiteboardMarkChild(){
//     var children = getMarkedChild();
//     if ( children.length == 0 ) return;
//     checkoutWhiteboardChild();
// }


//
//  チャイルドをチェックアウト
//
function checkoutWhiteboardChild(){

    var children = getMarkedChild();
    if ( children.length == 0 ) return;

    var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:12px;padding-bottom:12px;" >';
		r += 'checkout child';
    r += '</div>';
    r += '<div style="clear:both;margin:0 auto;width:90%;height:18px;font-size:12px;color:red;background-color:lightgrey;border:1px solid lightgrey;" >';
        r += '<div style="float:left;" >Name</div>';
        r += '<div style="float:right;width:34px;border-left:1px solid grey;" >Right</div>';
        r += '<div style="float:right;width:34px;border-left:1px solid grey;" >Left</div>';
        r += '<div style="float:right;width:58px;border-left:1px solid grey;" >Check</div>';
    r += '</div>';
    r += '<form name="directions" onsubmit="return false;" >';
    r += '<div id="ID_MARKEDCHILDREN_LIST" style="clear:both;margin:0 auto;width:90%;height:150px;border:1px solid lightgrey;overflow:scroll;" >';
    r += '</div>';
    r += '</form>';
	r += '<div style="clear:both;margin:0 auto;width:90%;text-align:center;margin:0 auto;padding-top:8px;">';
        r += '<button id="BTN_CLEARWHITEBOARD" type="button" class="accept_button" ';
        // r += 'style="font-size:20px;width:80px;height:80px;border:none;background-color:transparent;background-image:url(./images/check-3.png);background-position:center center;background-size:24px;background-repeat:no-repeat;" ';
        r += 'onclick="checkoutWhiteboardChildHelper();closeModalDialog();" >';
            r += 'checkout';
        r += '</button>';
        r += '<button id="" type="button" class="cancel_button" ';
        // r += 'style="font-size:20px;width:80px;height:80px;border:none;background-color:transparent;background-image:url(./images/cancel-2.png);background-position:center center;background-size:24px;background-repeat:no-repeat;" ';
        r += 'onclick="closeModalDialog();" >';
            r += 'cancel';
        r += '</button>'
	r += '</div>';
    openModalDialog( 'checkout child', r, 'NOBUTTON', null, 'CHECK' );
    var imcl = document.getElementById('ID_MARKEDCHILDREN_LIST');
    // var children = getMarkedChild();
    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        var id          = c.getAttribute('child_id');
        var child_name  = c.getElementsByClassName('CHILD_NAME')[0].innerText;
        var estimate    = c.getElementsByClassName('ESTIMATE_TIME')[0].innerText;
        var checkout    = c.hasAttribute('checkout');
        var o = document.createElement('DIV');
        o.style.width = '100%';
        o.style.height = '30px';
        o.style.clear = "both";
        o.style.borderBottom = '1px solid lightgrey';
        r = '';
        r += '<div style="float:left;width:150px;font-size:14px;padding-left:4px;" >' + child_name + '</div>';
        r += '<div style="float:right;width:26px;padding:4px;" >';
            r += '<input type="radio" id="child_' +  id + '_right" name="child_' + id + '" value="right" >';
            r += '<label for="child_' + id + '_right" style="display:block;width:24px;height:18px;" ><img width="8px" src="./images/next.png" /></label>';
        r += '</div>';
        r += '<div style="float:right;width:26px;padding:4px;" >';
            r += '<input type="radio" id="child_' + id + '_left"   name="child_' + id + '" value="left" >';
            r += '<label for="child_'+ id + '_left"   style="display:block;width:24px;height:18px;" ><img width="8px" src="./images/prev.png" /></label>';
        r += '</div>';
        r += '<div style="float:right;width:50px;padding:4px;" >';
            r += estimate;
        r += '</div>';


        o.innerHTML = r;
        imcl.appendChild( o );
    }
}

//
//  チェックアウトヘルパーラッパー
//
// function checkoutWhiteboardChildSingleHelper(){
//     checkoutWhiteboardChildHelper( 'SINGLE' );
// }

//
//  チェックアウトヘルパーラッパー
//
// function checkoutWhiteboardChildMarkHelper(){
//     checkoutWhiteboardChildHelper();
// }


//
//  チャイルドをチェックアウト（ヘルパー）
//
function checkoutWhiteboardChildHelper(){
    var children = getMarkedChild();
    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        var id = c.getAttribute('child_id')
        //alert( '[' + document.forms['directions'].elements['child_' + id].value + ']' );
        var direction = document.forms['directions'].elements['child_' + id].value;
        checkoutChild( children[i], null, null, direction );
        unmarkChild( children[i] );
    }

    commonProc();

}

//
//  チャイルドをチェックアウトクリア(シングル用ラッパー)
//
// function checkoutClearWhiteboardSingleChild(){
//     checkoutClearWhiteboardChild('SINGLE');
// }
//
//  チャイルドをチェックアウトクリア(マーク用ラッパー)
//
// function checkoutClearWhiteboardMarkChild(){
//     var children = getMarkedChild();
//     if ( children.length == 0 ) return;
//     checkoutClearWhiteboardChild();
// }


//
//
//
// function checkclearWhiteboardChild( proc_mode ){
//     switch ( proc_mode ){
//         case 'SINGLE':
//             checkclearChild(propChild);
//             break;
//         case 'MARK':
//             break;
//     }
// }

//
//  チャイルドをチェックアウトクリア
//
function checkoutClearWhiteboardChild(){

    var children = getMarkedChild();
    if ( children.length == 0 ) return;

    var r = '';
	r += '<div style="font-size:24px;text-align:center;padding-top:12px;padding-bottom:12px;" >';
		r += 'checkout clear child';
    r += '</div>';
    r += '<div id="ID_MARKEDCHILDREN_LIST" style="margin:0 auto;width:90%;height:180px;border:1px solid lightgrey;overflow:scroll;" >';
    r += '</div>';
	r += '<div style="margin:0 auto;width:90%;text-align:center;padding-top:4px;">';
        r += '<button id="BTN_CLEARWHITEBOARD" type="button" class="accept_button" ';
        // r +=  'style="width:80px;height:80px;font-size:12px;border:none;background-color:transparent;background-image:url(./images/check-3.png);background-position:center center;background-size:24px;background-repeat:no-repeat;" ';
        r +=  'onclick="checkoutClearWhiteboardChildHelper();closeModalDialog();" >';
            r += 'clear';
        r += '</button>';
        r += '<button id="" type="button" class="cancel_button" ';
        // r += 'style="font-size:20px;width:80px;height:80px;border:none;background-color:transparent;background-image:url(./images/cancel-2.png);background-position:center center;background-size:24px;background-repeat:no-repeat;" ';
        r += 'onclick="closeModalDialog();" >';
            r += 'cancel';
        r += '</button>'
	r += '</div>';

    openModalDialog( 'checkout clear child', r, 'NOBUTTON',
        null, 'CHECK' );
    // openModalDialog( 'checkout clear children', r, 'OK_CANCEL',
    // function(){
    //     checkoutClearWhiteboardChildHelper();
    //     closeModalDialog();
    // }, 'CHECK' );
    var imcl = document.getElementById('ID_MARKEDCHILDREN_LIST');
    // var children = getMarkedChild();
    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        var id = c.getAttribute('child_id');
        var child_name  = c.getElementsByClassName('CHILD_NAME')[0].innerText;

        var o = document.createElement('DIV');
        o.style.width       = '100%';
        o.style.height      = '30px';
        o.style.clear       = "both";
        o.style.padding     = '2px';
        o.style.borderBottom = '1px solid lightgrey';
        r = '';
        r += '<div style="float:left;width:150px;font-size:14px;" >' + child_name + '</div>';

        o.innerHTML = r;
        imcl.appendChild( o );
    }
}


//
//  Childをチェックアウトクリア（帰宅解除）:single
//
// function checkoutClearWhiteboardChildSingleHelper(){
//     if ( ! propChild ) return;
//     checkoutClearChild( propChild );
//     showWhiteboardChildCountCheckout();
// }

//
//  Childをチェッククリア（帰宅解除）:mark
//
function checkoutClearWhiteboardChildHelper(){

    var children = getMarkedChild();
    for ( var i=0; i<children.length; i++ ){
        checkoutClearChild( children[i] );
        var child_name = children[i].getElementsByClassName('CHILD_NAME')[0].innerText;
        oLog.log( null, child_name + ' : チェックアウトクリア.' );
        unmarkChild( children[i] );
    }
    oLog.open( 3 );
    showWhiteboardChildCount();

}

//
//  指定したチャイルドのチェックアウトクリア処理
//
function checkoutClearChild( c ){
    if ( c == null ) return;
    c.removeAttribute( 'checkout' );
    c.removeAttribute( 'direction' );
    c.style.borderColor = '';
    // document.getElementById( 'CHECKOUT_' + c.getAttribute('child_id') ).innerText = 'checkout:';
    var cf = c.getElementsByClassName('CHECKOUT_FLG')[0];
    cf.style.backgroundImage    = '';
    cf.style.backgroundPosition = '';
    cf.style.backgroundRepeat   = '';
    cf.style.backgroundSize     = '';
    var df = c.getElementsByClassName('DIRECTION_FLG')[0];
    df.style.backgroundImage    = '';
    df.style.backgroundPosition = '';
    df.style.backgroundRepeat   = '';
    df.style.backgroundSize     = '';

    // c.style.transformOrigin     = 'top left';
    // c.style.transform           = 'rotate(0deg)';

    //WHITEBOARDへ移動
    var wb = document.getElementById('WHITEBOARD');
    var cc = wb.appendChild( c );

    updateFlg   = true;


}

//
//  マークしたチャイルドをアブセント（欠席）する処理（UI)
//
function absentWhiteboardChild(){
    absentChild();
}

//
//  マークしたチャイルドをアブセント（欠席）処理
//
function absentChild(){
    var children = getMarkedChild();
    for ( var i=0; i<children.length; i++ ){
        var c = children[i];
        unmarkChild( c );
        if ( c.hasAttribute('absent')){
            attendChildHelper( c );
        } else {
            absentChildHelper( c );   
        }
        // abs.appendChild( c );
        updateFlg   = true;
    }
    showWhiteboardChildCount();
}

//
//  アブセント処理
//
function absentChildHelper( c ){

    var abs = document.getElementById('WHITEBOARD_CHECKOUT');
    
    c.style.backgroundImage     = 'url(./images/remove.png)';
    c.style.backgroundSize      = '10px';
    c.style.backgroundPosition  = 'right 2px bottom 2px';
    c.style.backgroundRepeat    = 'no-repeat';
    c.style.transformOrigin     = 'top left';
    c.style.transform           = 'rotate(-45deg)';
    c.style.borderColor         = 'limegreen';

    c.setAttribute('absent', 'yes');

    abs.appendChild( c );

    // if ( c.hasAttribute('absent')){
    //     console.log('attend');
    //     c.style.backgroundColor = '';
    //     c.removeAttribute('absent');
    // } else {
    //     console.log('absent');
    //     c.style.backgroundColor = 'lightgrey';
    //     c.setAttribute('absent', 'yes');
    // }

}

//
//  パレットタイムセレクタを表示
//
function showTimelineSelector(){
    if ( ! palleteTimeSelector.opened() )
        palleteTimeSelector.open();
        else
        palleteTimeSelector.close();
} 
//
//  タイムラインにチャイルドを移動
//
function moveTimelineWhiteboardChild( timeline ){

}

//
//  タイムラインのチャイルドをチェックアウト
//
function checkoutTimelineWhiteboardChild( timeline ){

}

//
//  アカウントプロパティ
//
function accountProperty(){

    var oAcc = getAccount( isSignId() );
    var r = '';
	// r += '<div style="font-size:24px;text-align:center;padding-top:24px;padding-bottom:24px;" >';
	// 	r += 'Account property';
    // r += '</div>';
    r += "<div style='width:80%;margin:0 auto;'  >";
        r += "<form name='sign_form' onsubmit='return false;' >";
            r += "<table align='center' width='100%' >";
            r += "<tr>";
            r += "<td>Account ID:</td>";
            r += "</tr>";
            r += "<tr>";
            r += "<td><input style='width:100%;background-color:lightgrey;border:1px solid lightgrey;border-radius:3px;' type='text' id='acc_id' name='id' tabindex=1 readonly value='" + acc_id + "'/></td>";
            r += "</tr>";
            r += "<tr>";
            r += "<td>Account Name:</td>";
            r += "</tr>";
            r += "<tr>";
            r += "<td><input style='width:100%;height:18px;background-color:lightgrey;border:1px solid lightgrey;border-radius:3px;' type='text' name='acc_name' tabindex=2 readonly value='" + oAcc.acc_name + "' /></td>";
            r += "</tr>";
            r += "<tr>";
            r += "<td><div style='width:64px;height:64px;border-radius:50%;background-image:url(./images/accounts/" + acc_id + ".jpeg);background-size:cover;background-position:center center;background-repeat:no-repeat;' ></div></td>";
            r += "</tr>";
            r += "</table>";
        r += "</form>";

        r += '<div style="width:100%;text-align:center;padding-top:5px;" >';
            r += '<button type="button" id="" class="accept_button" ';
                r += ' onclick="closeModalDialog();" >';
                r += 'close';
            r += '</button>';
        r += '</div>';

    r += "</div>";

    openModalDialog( 'Account property', r, 'NOBUTTON', null, 'ACCOUNT' );

}



