//
//  spotlight表示制御
//
function ctlSpotlight(){
    if ( oSpotlight.opened() )      oSpotlight.close();
        else                        oSpotlight.open();
}

function spotlight( resize ){
    this.overlay    = null;
    this.frame      = null;
    this.header     = null;
    this.main       = null;
    this.keyword    = null;
    this.folder1    = null;
    this.folder2    = null;
    this.resize     = resize;
    // this.stLeft     = 0;
    // this.edLeft     = 0;
}
spotlight.prototype = {
    play : function(){
        var r = '';
        console.log('childfinder start');
        
        var o = document.createElement('DIV');
        o.setAttribute( 'id', 'CHILDFINDER_OVERLAY' );
        o.setAttribute( 'class', 'not_select' );
        o.style.visibility  = 'hidden';
        this.overlay = document.body.appendChild( o );
    
        var o2 = document.createElement('DIV');
        o2.setAttribute( 'id',    'CHILDFINDER_FRAME' );
        o2.setAttribute( 'class', 'not_select' );
        o2.style.visibility  = 'hidden';
        this.frame = this.overlay.appendChild( o2 );
    
        var o3 = document.createElement('DIV');
        o3.setAttribute( 'id',    'CHILDFINDER_HEADER' );
        o3.setAttribute( 'class', 'not_select' );
        r = '';
        r += '<div id="BTN_ALIGN_SPOTLIGHT" style="float:left;width:42px;height:42px;background-image:url(./images/searching.png);background-size:16px;background-repeat:no-repeat;background-position:center center;" ></div>';
        r += '<div style="float:left;padding:10px 10px 10px 10px;" >';
            r += '<form onsubmit="return false;" >';
            r += '<input type="text" id="TXT_KEYWORD2" name="TXT_KEYWORD2" autocomplete="off" style="width:100px;font-size:16px;color:black;background-color:transparent;outline:none;" />';
            r += '</form>';
        r += '</div>';
        r += '<div id="BTN_CLOSE_SPOTLIGHT" style="float:right;width:32px;height:42px;background-image:url(./images/cancel-2.png);background-size:16px;background-repeat:no-repeat;background-position:center center;" ></div>';
        r += '<div id="BTN_LISTALL"         style="float:right;width:32px;height:42px;background-image:url(./images/list.png);background-size:16px;background-repeat:no-repeat;background-position:center center;" ></div>';
        r += '<div id="BTN_TIMESELECTOR"    style="float:right;width:32px;height:42px;background-image:url(./images/time.png);background-size:16px;background-repeat:no-repeat;background-position:center center;" ></div>';
        r += '<div id="BTN_CLEAR_LIST"      style="float:right;width:32px;height:42px;background-image:url(./images/eraser.png);background-size:16px;background-repeat:no-repeat;background-position:center center;" ></div>';
        r += '<div id="BTN_REFRESH_LIST"    style="float:right;width:32px;height:42px;background-image:url(./images/recycle.png);background-size:16px;background-repeat:no-repeat;background-position:center center;" ></div>';

        o3.innerHTML = r;
        this.header     = this.frame.appendChild( o3 );
        document.getElementById('BTN_ALIGN_SPOTLIGHT').addEventListener( 'click',
            ( function(e) {
                this.close();
            }).bind( this ), false );
        document.getElementById('BTN_TIMESELECTOR').addEventListener( 'click',
            ( function(e) {
                showTimelineSelector();
            }).bind( this ), false );
        document.getElementById('BTN_CLOSE_SPOTLIGHT').addEventListener( 'click',
            ( function(e) {
                this.close();
            }).bind( this ), false );
        document.getElementById('BTN_LISTALL').addEventListener( 'click',
            ( function(e) {
                this.keyword.value = '*';
                this.ctlMain();
            }).bind( this ), false );
        document.getElementById('BTN_REFRESH_LIST').addEventListener( 'click',
            ( function(e) {
                this.ctlMain();
            }).bind( this ), false );
        document.getElementById('BTN_CLEAR_LIST').addEventListener( 'click',
            ( function(e) {
                this.keyword.value = '';
                this.ctlMain();
            }).bind( this ), false );

        this.keyword    = document.getElementById('TXT_KEYWORD2');
        this.keyword.addEventListener( 'keyup',
            (function(e) {
                this.ctlMain();
            }).bind(this) , false );
    
        var o4 = document.createElement('DIV');         //  MAIN DIV
        o4.setAttribute( 'id',    'CHILDFINDER_MAIN' );
        o4.setAttribute( 'class', 'not_select' );
        this.main = this.frame.appendChild( o4 );
        this.main.addEventListener( 'click',
            (function(e){
                var c = scanChild( e.target );
                if ( c == null ){
                    for ( var i=0; i<this.folder2.childNodes.length; i++ ){
                        this.folder2.childNodes[i].style.backgroundColor = '';
                        this.folder2.childNodes[i].removeAttribute('selected');
                    }
                    return;
                }
                switch ( c.hasAttribute('selected') ){
                    case true:
                        c.style.backgroundColor = ''
                        c.removeAttribute( 'selected' );
                        break;
                    case false:
                        c.style.backgroundColor = 'lightgrey';
                        c.setAttribute( 'selected', 'yes' );
                        break;

                }
            }).bind( this ), false );
        this.resize();
        // fitting();
    
    
    },
    open : function(){
        console.log('open');
        this.overlay.style.visibility   = 'visible';
        this.frame.style.visibility     = 'visible';
        this.header.style.visibility    = 'visible';
        this.ctlMain();
        // this.keyword.focus();
        this.resize();

    },
    close : function(){
        console.log('close');
        this.overlay.style.visibility   = 'hidden';
        this.frame.style.visibility     = 'hidden';
        this.header.style.visibility    = 'hidden';
        this.main.style.visibility      = 'hidden';
        this.keyword.value              = '';           //キーワード削除
        this.main.innerHTML             = '';           // mainエリア内をクリア

    },
    opened : function(){
        console.log( this.overlay.style.visibility );
        return ( this.overlay.style.visibility != 'hidden' );
    },
    checkin : function( hm ){
        var cpc = this.folder2;
        var arHM = hm.split(':');
        
        var cursor	= 0;
        var top		= ( parseInt( arHM[0] ) - 8 ) * pixelPerHour;
        var left	= ( parseInt( arHM[1] ) );
        console.log( 'hm:' + hm );
        console.log( 'top:' + top + ' left:' + left );
    
        for ( var i=0; i<cpc.childNodes.length; i++ ){
            if ( cpc.childNodes[i].hasAttribute('selected') ){
                var id = cpc.childNodes[i].getAttribute('child_id');
                if ( alreadyExistChildOnWhiteboard( id ) ) continue;
                var oChild = getChild( id );
                if ( oChild != null ){
                    addChild( top + ( cursor * 20 ), left + ( cursor * 0 ), oChild.child_id, oChild.child_name, oChild.kana, oChild.child_type, oChild.child_grade );
                    cursor++;
                }
                cpc.childNodes[i].style.color = '';
                cpc.childNodes[i].style.backgroundColor = '';
                cpc.childNodes[i].removeAttribute('selected');
            }
        }
        showWhiteboardChildCount();
    
    },
    ctlMain : function(){
        var keyword = this.keyword.value;
        if ( this.keyword.value == '' ){
            this.header.style.borderRadius  = '4px';
            this.main.style.visibility    = 'hidden';
            return;
        } else{
            this.header.style.borderRadius  = '4px 4px 0px 0px';
            this.main.style.visibility    = 'visible';
        }
    
        if ( this.main.childNodes.length == 0){
            var o = document.createElement('DIV');
            o.setAttribute('id', 'FOLDER_FIND_WHITEBOARD');
            o.style.height             = '26px';
            o.style.color               = 'gray';
            o.style.backgroundColor     = 'transparent';
            o.style.fontSize            = '12px';
            o.style.borderBottom        = '1px solid lightgrey';
            o.style.padding             = '4px 4px 4px 4px';
            o.style.marginBottom        = '0px';
            o.style.clear               = 'both';
            var r = '';
            r += '<div style="float:left;width:80px;color:red;background-color:;padding-left:4px;border-left:10px solid red;" >Whiteboard...</div>';
            r += '<div id="BTN_FOLDER1" style="float:right;width:24px;background-image:url(./images/up-arrow.png);background-size:16px;background-position:center center;background-repeat:no-repeat;" >&nbsp;</div>';
            o.innerHTML = r;
            var ffw = this.main.appendChild( o );

            var oo = document.createElement('DIV');
            oo.setAttribute('id', 'FOLDER_FIND_WHITEBOARD2');
            oo.style.color              = 'gray';
            oo.style.backgroundColor    = 'transparent';
            oo.style.fontSize           = '12px';
            oo.style.padding            = '4px 4px 4px 4px';
            oo.style.marginBottom       = '0px';
            oo.style.clear              = 'both';
            oo.innerText                = 'dummy';
            this.folder1 = this.main.appendChild( oo );
            document.getElementById('BTN_FOLDER1').addEventListener('click',
                ( function(e){
                    console.log('hohoho');
                    var ffw2 = document.getElementById('FOLDER_FIND_WHITEBOARD2');
                    switch ( ffw2.style.display ){
                        case 'none':
                            ffw2.style.display = 'inline';
                            e.target.style.backgroundImage = 'url(./images/up-arrow.png)';
                            break;
                        case 'inline':
                        default:
                            ffw2.style.display = 'none';
                            e.target.style.backgroundImage = 'url(./images/down-arrow.png)';
                            break;
                    }
                } ).bind(this), false );
 
            o = document.createElement('DIV');
            o.setAttribute( 'id', 'FOLDER_FIND_CHILDREN_TABLE' );
            o.style.height              = '26px';
            o.style.color               = 'gray';
            o.style.backgroundColor     = 'transparent';
            o.style.fontSize            = '12px';
            o.style.borderBottom        = '1px solid lightgrey';
            o.style.padding             = '4px 4px 4px 4px';
            o.style.marginBottom        = '0px';
            o.style.clear               = 'both';
            r = '';
            r += '<div style="float:left;width:80px;color:red;background-color:;padding-left:4px;border-left:10px solid red;" >Children...</div>';
            r += '<div id="BTN_FOLDER2" style="float:right;width:24px;background-image:url(./images/up-arrow.png);background-size:16px;background-position:center center;background-repeat:no-repeat;" >&nbsp;</div>';
            o.innerHTML = r;
            var ffct = this.main.appendChild( o );

            oo = document.createElement('DIV');
            oo.setAttribute('id', 'FOLDER_FIND_CHILDREN_TABLE2');
            // oo.style.color           = 'gray';
            // oo.style.backgroundColor = 'transparent';
            // oo.style.fontSize        = '12px';
            // oo.style.padding         = '4px 4px 4px 4px';
            // oo.style.marginBottom    = '0px';
            // oo.style.clear           = 'both';
            oo.innerText = 'Dummy';        
            this.folder2 = this.main.appendChild( oo );
            document.getElementById('BTN_FOLDER2').addEventListener('click',
                ( function(e){
                    var ffct2 = document.getElementById('FOLDER_FIND_CHILDREN_TABLE2');
                    switch ( ffct2.style.display ){
                        case 'none':
                            ffct2.style.display = 'inline';
                            e.target.style.backgroundImage = 'url(./images/up-arrow.png)';
                            break;
                        case 'inline':
                        default:
                            ffct2.style.display = 'none';
                            e.target.style.backgroundImage = 'url(./images/down-arrow.png)';
                            break;
                    }
                } ).bind(this), false);
        }
        
    //  WHITEBOARD / WHITEBOARD_ABSENT内を検索
        this.folder1.innerText = '';
        this.findWhiteboardChild( this.folder1, this.keyword.value );
    //  childrenテーブル検索
        this.folder2.innerHTML  = '';
        this.findChildrenTable( this.folder2, this.keyword.value );

    },

    findWhiteboardChild : function ( parent, keyword ){
        var children = document.getElementById('WHITEBOARD').childNodes;
        this.findWhiteboardChildHelper( parent, keyword, children, false );
    
        var absents = document.getElementById('WHITEBOARD_ABSENT').childNodes;
        this.findWhiteboardChildHelper( parent, keyword, absents, true );
    
    },
    
    findWhiteboardChildHelper : function ( parent, keyword, children, absent ){
        for ( var i=0; i<children.length; i++ ){
            var c = children[i];
            var child_id    = c.getAttribute('child_id');
            var checkout    = c.hasAttribute('checkout');
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
                r += '<div style="float:left;"  >' + child_name;
                    r += '(' + c.style.top + ',' + c.style.left + ')';
                r += '</div>';
                if ( absent )
                    r += '<div style="float:right;padding-left:8px;width:20px;background-image:url(./images/sleep-2.png);background-size:16px;background-position:center center;background-repeat:no-repeat;">&nbsp;</div>';
                    else
                    r += '<div style="float:right;padding-left:8px;width:20px;background-image:url(./images/godzilla.png);background-size:16px;background-position:center center;background-repeat:no-repeat;">&nbsp;</div>';
                if ( checkout )
                    r += '<div style="float:right;padding-left:8px;width:20px;background-image:url(./images/check.png);background-size:14px;background-position:center center;background-repeat:no-repeat;">&nbsp;</div>';
                    else
                    r += '<div style="float:right;padding-left:8px;width:20px;">&nbsp;</div>';
                r += '<div style="float:right;" >' + estimate   + '</div>';
    
                o.innerHTML = r;
    
                var cc = parent.appendChild( o );
                cc.addEventListener( 'click', 
                    ( function (e){
                        var c = e.target;
                        while ( true ){
                            if ( c.hasAttribute('child_id') ) break;
                            c = c.parentNode;
                        }
                        var cid = c.getAttribute('child_id');
                        // alert( cid );
                        var cc = scanWhiteboardChild( cid );
                        if ( cc == null ) { console.log( 'child_id:' + cid + ':null');return;}
                        // alert( cc.innerHTML );
    
                        var child_name = cc.getElementsByClassName('CHILD_NAME')[0].innerText;
                        // alert( child_name );
                        var estimate   = cc.getElementsByClassName('ESTIMATE_TIME')[0].innerText;
                        var h = estimate.substr(0, 2 );
                        var wbf = document.getElementById('WHITEBOARD_FRAME');
                        wbf.scrollTop = ( h - 8 ) * pixelPerHour;
                        // var range = document.createRange();
                        // range.setStart( c, 0 );
                        // range.setEnd( c, 1 );
                        // var mark = document.createElement( 'mark' );
                        // range.surroundContents( mark );
                    }).bind(this), false );
            }
        }
    
    },

    findChildrenTable : function ( parent, keyword ){
        var r = '';
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener('readystatechange', 
            ( function (e){
                switch ( xmlhttp.readyState){
                    case 1://opened
                    case 2://header received
                    case 3://loading
                        //var fcl = document.getElementById( 'FIND_CHILD_LST' );
                        //if ( fcl != null ) fcl.innerText = 'access...';
                        this.folder2.innerText = 'access...'
                        break;
                    case 4://done
                        if ( xmlhttp.status == 200 ){
                            var result = JSON.parse( xmlhttp.responseText );
                            
                            //r += xmlhttp.responseText;
                            //var fcl = document.getElementById('FIND_CHILD_LST');
                            //if ( fcl == null ) return;
                            //fcl.innerHTML = '';
                            this.folder2.innerText = '';
                            for ( var i=0; i<result.length; i++ ){
                                var child_id    = result[i].child_id;
                                var child_name  = result[i].child_name;
                                var kana        = result[i].kana;
                                var child_type  = result[i].child_type;
                                var child_grade = result[i].child_grade;
                                var c = document.createElement('DIV');
                                // c.setAttribute("child",     "yes");
                                c.setAttribute("child_id",    child_id );
                                c.setAttribute("id",          "c_1");
                                c.setAttribute("class",       "PALLETE_CHILD");
                                c.setAttribute('kana',        kana );
                                c.setAttribute('child_type',  child_type );
                                c.setAttribute('child_grade', child_grade );
                                c.setAttribute("draggable",   "true");
                                c.style.marginTop       = '1px';
                                c.style.marginLeft      = '1px';
                                c.style.float           = 'left';
                                r = '';
                                r += '<div class="CHILD_NAME" style="float:left;font-size:12px;height:20px;padding-left:2px;">';
                                    r += child_name;
                                r += '</div>';
                                r += '<div style="float:right;font-size:12px;text-align:right;padding-top:2px;" >';
                                    r += child_type;
                                    r += '<span style="color:' + arChildGradeColor[ child_grade ] + ';">●</span>';
                                r += '</div>';
                        

                                c.innerHTML = r;
                                var cc = parent.appendChild( c );
                                cc.addEventListener('dragstart',
                                    ( function(e) {
                                        dndOffsetX = e.offsetX;
                                        dndOffsetY = e.offsetY;
                                        console.log( e.dataTransfer );
                                        console.log('offsetY:' + dndOffsetY + ' OffsetX:' + dndOffsetX );
                                        e.dataTransfer.setData('text', e.target.getAttribute( 'child_id' ) );
                                    }).bind(this), { passive : false } );  
                                // cc.addEventListener('touchstart',
                                //         ( function(e) {
                                //             e.preventDefault();
                                //             stLeft = e.touches[0].pageX;
                                //         }).bind(this), { passive : false } );
                                // cc.addEventListener('touchmove',
                                //     ( function(e) {
                                //         e.preventDefault();
                                //         this.edLeft = e.changedTouches[0].pageX;
                                //     }).bind(this), { passive : false } );
                                // cc.addEventListener('touchend',
                                //     ( function(e) {
                                //         if ( this.stLeft > this.edLeft + 30 )
                                //             console.log('Swiped');
                                //     }).bind(this), { passive : false } );
                            }
                            //o.innerHTML = r;
                        } else{
                            document.getElementById('HISTORY_LST').innerText = xmlhttp.status;
                        }
                        break;
                }
    
            } ).bind( this ), false );
/*
        xmlhttp.onreadystatechange = function() {
            switch ( xmlhttp.readyState){
                case 1://opened
                case 2://header received
                case 3://loading
                    //var fcl = document.getElementById( 'FIND_CHILD_LST' );
                    //if ( fcl != null ) fcl.innerText = 'access...';
                    //this.folder2.innerText = 'access...'
                    break;
                case 4://done
                    if ( xmlhttp.status == 200 ){
                        var result = JSON.parse( xmlhttp.responseText );
                        
                        //r += xmlhttp.responseText;
                        //var fcl = document.getElementById('FIND_CHILD_LST');
                        //if ( fcl == null ) return;
                        //fcl.innerHTML = '';
                        //this.folder2.innerText = '';
                        for ( var i=0; i<result.length; i++ ){
                            var child_id = result[i].child_id;
                            var child_name = result[i].child_name;
                            var c = document.createElement('DIV');
                            // c.setAttribute("child",     "yes");
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
                                ( function(e) {
                                    dndOffsetX = e.offsetX;
                                    dndOffsetY = e.offsetY;
                                    console.log( e.dataTransfer );
                                    console.log('offsetY:' + dndOffsetY + ' OffsetX:' + dndOffsetX );
                                    e.dataTransfer.setData('text', e.target.getAttribute( 'child_id' ) );
                                }).bind(this), false );                                                                                
                        }
                        //o.innerHTML = r;
                    } else{
                        document.getElementById('HISTORY_LST').innerText = xmlhttp.status;
                    }
                    break;
            }
        }
*/
        try{
            xmlhttp.open("POST", "/accounts/childfind", true );
            xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
            if ( keyword == '*' ) keyword = '%';
            xmlhttp.send( 'keyword=' + keyword );
    
        } catch ( e ) { alert( e );}
    
    }
        
};

//
//
//
// function childFinder( e ){

// }

// function childFinder3(e){
    
//     var cfm = document.getElementById('CHILDFINDER_MAIN');
//     var keyword = this.value;
//     if ( keyword == '' ){
//         cfm.style.visibility    = 'hidden';
//     } else{
//         cfm.style.visibility    = 'visible';

//     }

// }

//
//  チャイルドファインダー
//
// function childFinder0( e ){
//     var tk = document.getElementById('TXT_KEYWORD');
//     var keyword = tk.value;
//     var p = document.getElementById('CHILD_FINDER');
//     var fa = document.getElementById('FINDER_AREA');
//     if ( keyword  != '' ){
//         if ( fa == null )   //  表示エリアなし
//         {
//             var o = document.createElement('DIV');
//             o.setAttribute( 'id', 'FINDER_AREA');
//             var m = p.appendChild( o );
//             var r = '';
//             r += '<div style="height:19px;padding:2px;border-bottom:1px solid lightgrey;" >';
//             //    r += 'keyword:<span id="HOGE" ></span>';
//                 r += '<div style="float:left;width:19px;height:19px;background-image:url(./images/recycle.png);background-size:16px;background-repeat:no-repeat;background-position:center center;" ></div>';
//                 r += '<div id="BTN_CLOSE_FINDER_AREA" style="float:right;width:19px;height:19px;background-image:url(./images/cancel-2.png);background-size:16px;background-repeat:no-repeat;background-position:center center;" ></div>';
//             r += '</div>';
//             r += '<div id="FIND_CHILD_LST" ></div>';
//             m.innerHTML = r;
//             new Button( 'BTN_CLOSE_FINDER_AREA', closeChildFinder ).play();
//             fitting();
//         }
//     } else {
//         if ( fa != null )   //  表示エリアあれば削除
//         {
//             closeChildFinder();
//             return;
//         }
//     }

//     var fcl = document.getElementById( 'FIND_CHILD_LST' );
//     fcl.innerHTML = '';

//     //  WHITEBOARD / WHITEBOARD_ABSENT内を検索
//     var o = document.createElement('DIV');
//     o.setAttribute('id', 'FOLDER_FIND_WHITEBOARD');
//     o.style.color           = 'gray';
//     o.style.backgroundColor = 'transparent';
//     o.style.fontSize        = '12px';
//     o.style.borderBottom    = '1px solid lightgrey';
//     o.style.padding         = '4px 4px 0px 0px';
//     o.style.marginBottom    = '0px';
//     o.style.clear           = 'both';
//     o.innerHTML             = '<div style="float:reft;width:80px;color:red;background-color:;padding-left:4px;border-left:10px solid red;" >Whiteboard...</div>';
//     var ffw = fcl.appendChild( o );
//     ffw.addEventListener('click',
//         function(e){
//             var ffw2 = document.getElementById('FOLDER_FIND_WHITEBOARD2');
//             switch ( ffw2.style.display ){
//                 case 'none':
//                     ffw2.style.display = 'inline';
//                     break;
//                 case 'inline':
//                 default:
//                     ffw2.style.display = 'none';
//                     break;
//             }
//         }, false );

//     var oo = document.createElement('DIV');
//     oo.setAttribute('id', 'FOLDER_FIND_WHITEBOARD2');
//     oo.style.color          = 'gray';
//     oo.style.backgroundColor = 'transparent';
//     oo.style.fontSize        = '12px';
//     oo.style.padding         = '4px 4px 0px 0px';
//     oo.style.marginBottom    = '0px';
//     oo.style.clear           = 'both';
//     var ooo = fcl.appendChild( oo );
//     findWhiteboardChild( ooo, keyword );

//     //  childrenテーブル検索
//     var o = document.createElement('DIV');
//     o.setAttribute( 'id', 'FOLDER_FIND_CHILDREN_TABLE' );
//     o.style.color           = 'gray';
//     o.style.backgroundColor = 'transparent';
//     o.style.fontSize        = '12px';
//     o.style.borderBottom    = '1px solid lightgrey';
//     o.style.padding         = '4px 4px 0px 0px';
//     o.style.marginBottom    = '0px';
//     o.style.clear           = 'both';
//     o.innerHTML             = '<div style="float:reft;width:80px;color:red;background-color:;padding-left:4px;border-left:10px solid red;" >Children...</div>';
//     var ffct = fcl.appendChild( o );
//     ffct.addEventListener('click',
//         function(e){
//             var ffct2 = document.getElementById('FOLDER_FIND_CHILDREN_TABLE2');
//             switch ( ffct2.style.display ){
//                 case 'none':
//                     ffct2.style.display = 'inline';
//                     break;
//                 case 'inline':
//                 default:
//                     ffct2.style.display = 'none';
//                     break;
//             }
//         }, false);

//     var oo = document.createElement('DIV');
//     oo.setAttribute('id', 'FOLDER_FIND_CHILDREN_TABLE2');
//     oo.style.color           = 'gray';
//     oo.style.backgroundColor = 'transparent';
//     oo.style.fontSize        = '12px';
//     oo.style.padding         = '4px 4px 0px 0px';
//     oo.style.marginBottom    = '0px';
//     oo.style.clear           = 'both';

//     var ooo = fcl.appendChild( oo );
//     findChildrenTable( ooo, keyword );


// }

//
//  CHILDRENテーブル内のチャイルドの検索
//
// function findChildrenTable( parent, keyword ){
// 	var r = '';
// 	var xmlhttp = new XMLHttpRequest();
// 	xmlhttp.onreadystatechange = function() {
// 		switch ( xmlhttp.readyState){
// 			case 1://opened
// 			case 2://header received
// 			case 3://loading
// 				//var fcl = document.getElementById( 'FIND_CHILD_LST' );
// 				//if ( fcl != null ) fcl.innerText = 'access...';
// 				break;
// 			case 4://done
// 				if ( xmlhttp.status == 200 ){
//                     var result = JSON.parse( xmlhttp.responseText );
                    
// 					//r += xmlhttp.responseText;
//                     //var fcl = document.getElementById('FIND_CHILD_LST');
//                     //if ( fcl == null ) return;
// 					//fcl.innerHTML = '';
// 					for ( var i=0; i<result.length; i++ ){
//                         var child_id = result[i].child_id;
//                         var child_name = result[i].child_name;
//                         var c = document.createElement('DIV');
//                         c.setAttribute("child",     "yes");
//                         c.setAttribute("child_id",  child_id );
//                         c.setAttribute("id",        "c_1");
//                         //c.setAttribute("class",     "PALLETE_CHILD");
//                         c.setAttribute("draggable", "true");
//                         c.style.clear           = 'both';
//                         c.style.padding         = '4px';
//                         c.style.fontSize        = '12px';
//                         c.style.width           = '100%';
//                         c.style.height          = '24px';
//                         c.style.backgroundColor = '';
//                         // c.style.borderBottom    = '1px solid lightgray';
//                         //c.style.borderRight = arChildGrade[ oChild.child_grade ];
//                         c.style.float           = 'left';
//                         r = '';
//                         r += '<div style="height:20px;padding-left:2px;">';
//                             r += child_name;
//                         r += '</div>';
//                         c.innerHTML = r;
//                         var cc = parent.appendChild( c );
//                         cc.addEventListener('dragstart',
//                         function(e) {
//                             dndOffsetX = e.offsetX;
//                             dndOffsetY = e.offsetY;
//                             console.log( e.dataTransfer );
//                             console.log('offsetY:' + dndOffsetY + ' OffsetX:' + dndOffsetX );
//                             e.dataTransfer.setData('text', e.target.getAttribute( 'child_id' ) );
//                         } );
                                                                            
// 					}
// 					//o.innerHTML = r;
// 				} else{
// 					document.getElementById('HISTORY_LST').innerText = xmlhttp.status;
// 				}
// 				break;
// 		}
// 	}
// 	try{
// 		xmlhttp.open("POST", "/accounts/childfind", true );
// 		xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
// 		xmlhttp.send( 'keyword=' + keyword );

// 	} catch ( e ) { alert( e );}

// }

//
//  WHITEBOARD内のチャイルドの検索
//
// function findWhiteboardChild( parent, keyword ){
//     var children = document.getElementById('WHITEBOARD').childNodes;
//     findWhiteboardChildHelper( parent, keyword, children, false );

//     var absents = document.getElementById('WHITEBOARD_ABSENT').childNodes;
//     findWhiteboardChildHelper( parent, keyword, absents, true );

// }

// function findWhiteboardChildHelper( parent, keyword, children, absent ){
//     for ( var i=0; i<children.length; i++ ){
//         var c = children[i];
//         var child_id    = c.getAttribute('child_id');
//         var checkout    = c.hasAttribute('checkout');
//         var child_name  = c.getElementsByClassName('CHILD_NAME')[0].innerText;
//         var estimate    = c.getElementsByClassName('ESTIMATE_TIME')[0].innerText
//         //child_name      = child_name.toLowerCase();
//         var kana        = ( c.getAttribute('kana') != null )? c.getAttribute('kana') : '';
    
//         if ( child_name.toLowerCase().indexOf( keyword.toLowerCase(), 0, keyword.length ) == 0 ||
//              kana.indexOf(keyword.toLowerCase(), 0, keyword.length ) == 0 ||
//              keyword == '%' || keyword == '*' ){
//             var o = document.createElement('DIV');
//             o.setAttribute( 'child_id', child_id );
//             o.style.padding     = '4px';
//             o.style.fontSize    = '12px';
//             o.style.height      = '20px';

//             var r = '';
//             r += '<div style="float:left;"  >' + child_name + '</div>';
//             if ( absent )
//                 r += '<div style="float:right;padding-left:8px;width:20px;background-image:url(./images/sleep-2.png);background-size:16px;background-position:center center;background-repeat:no-repeat;">&nbsp;</div>';
//                 else
//                 r += '<div style="float:right;padding-left:8px;width:20px;background-image:url(./images/godzilla.png);background-size:16px;background-position:center center;background-repeat:no-repeat;">&nbsp;</div>';
//             if ( checkout )
//                 r += '<div style="float:right;padding-left:8px;width:20px;background-image:url(./images/check.png);background-size:14px;background-position:center center;background-repeat:no-repeat;">&nbsp;</div>';
//                 else
//                 r += '<div style="float:right;padding-left:8px;width:20px;">&nbsp;</div>';
//             r += '<div style="float:right;" >' + estimate   + '</div>';

//             o.innerHTML = r;

//             var cc = parent.appendChild( o );
//             cc.addEventListener( 'click', 
//                 function (e){
//                     var c = e.target;
//                     while ( true ){
//                         if ( c.hasAttribute('child_id') ) break;
//                         c = c.parentNode;
//                     }
//                     //alert( c.getAttribute('child_id'));
//                     var c = scanWhiteboardChild( child_id );
//                     if ( c == null ) { console.log( 'child_id:' + child_id + ':null');return;}

//                     var child_name = c.firstChild.innerText;
//                     var h = estimate.substr(0, 2 );
//                     var wbf = document.getElementById('WHITEBOARD_FRAME');
//                     wbf.scrollTop = ( h - 8 ) * pixelPerHour;
//                     // var range = document.createRange();
//                     // range.setStart( c, 0 );
//                     // range.setEnd( c, 1 );
//                     // var mark = document.createElement( 'mark' );
//                     // range.surroundContents( mark );
//                 } );
//         }
//     }

// }

//
//  チャイルドファインダーをクローズ
//
// function closeChildFinder(){
//     document.getElementById('TXT_KEYWORD').value = '';
//     var p = document.getElementById('CHILD_FINDER');
//     var fa = document.getElementById('FINDER_AREA');
//     if ( fa != null )
//         p.removeChild( fa );                 

// }

