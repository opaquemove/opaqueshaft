//
//  spotlight表示制御
//
function ctlSpotlight(){
    if ( oSpotlight.opened() ) {
        oSpotlight.close();
        oTile.close('childfinder');
    } else{
        oSpotlight.open();
        oTile.open('childfinder');
    } 
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

        this.frame.addEventListener('gesturestart', function(e){
            console.log('gesturestart');
            e.preventDefault();
            var icc = document.getElementById('ID_CHILD_COORDINATE');
            icc.innerText = 'gesturestart';
        
        }, { passive : false });
        this.frame.addEventListener('gesturechange', function(e){
            console.log('gesturechange');
            e.preventDefault();
            var icc = document.getElementById('ID_CHILD_COORDINATE');
            icc.innerText = 'gesturechange';
        
        }, { passive : false });
        this.frame.addEventListener('gestureend', function(e){
            console.log('gestureend');
            e.preventDefault();
            var icc = document.getElementById('ID_CHILD_COORDINATE');
            icc.innerText = 'gestureend';
        
        }, { passive : false });
    
        var o3 = document.createElement('DIV');
        o3.setAttribute( 'id',    'CHILDFINDER_HEADER' );
        o3.setAttribute( 'class', 'not_select' );
        r = '';
        r += '<div style="width:100%;height:42px;" >';
            r += '<div id="BTN_ALIGN_SPOTLIGHT"   style="float:left;width:24px;height:42px;background-color:rgb(255, 123, 0);background-image:url(./images/searching.png);background-size:12px;background-repeat:no-repeat;background-position:center center;" ></div>';
            r += '<div id="BTN_FINDMODE"          style="float:left;width:24px;height:42px;background-color:;overflow:hidden;" >';
                r += '<div id="ID_FINDMODE_STATUS" style="width:48px;height:100%;transition:0.3s ease-in-out;" >';
                    r += '<div style="display:block;float:left;width:50%;height:100%;writing-mode:vertical-lr;" >white</div>';
                    r += '<div style="display:block;float:left;width:50%;height:100%;writing-mode:vertical-lr;" >cloud</div>';
                r += '</div>';
            r += '</div>';
            // r += '<div id="BTN_CLOSE_SPOTLIGHT"   style="float:right;width:26px;height:42px;background-image:url(./images/cancel-2.png);background-size:12px;background-repeat:no-repeat;background-position:center center;" >close</div>';
            r += '<div id="BTN_TIMESELECTOR"      style="float:right;width:26px;height:42px;background-image:url(./images/time.png);background-size:12px;background-repeat:no-repeat;background-position:center center;" >time</div>';
            // r += '<div id="BTN_CHILD_PROPERTY"    style="float:right;width:26px;height:42px;background-image:url(./images/hexagon.png);background-size:12px;background-repeat:no-repeat;background-position:center center;" ></div>';
            r += '<div id="BTN_CLEAR_LIST"        style="float:right;width:26px;height:42px;background-image:url(./images/eraser.png);background-size:12px;background-repeat:no-repeat;background-position:center center;" >clear</div>';
            r += '<div id="BTN_REFRESH_LIST"      style="float:right;width:26px;height:42px;background-image:url(./images/recycle.png);background-size:12px;background-repeat:no-repeat;background-position:center center;" >refrsh</div>';
        r += '</div>';
        r += '<div style="width:100%;height:42px;" >';
            r += '<form onsubmit="return false;" >';
            r += '<div id="BTN_FIND_OPTION" style="float:right;width:20px;height:42px;background-image:url(./images/arrow-black-triangle-down.png);background-size:6px;background-repeat:no-repeat;background-position:center center;" ></div>';
            r += '<div id="BTN_LISTALL"     style="float:right;width:20px;height:42px;background-image:url(./images/list.png);background-size:12px;background-repeat:no-repeat;background-position:center center;" >all</div>';
            // r += '<div id="BTN_FIND"        style="float:right;width:20px;height:42px;background-image:url(./images/right-arrow-black-triangle.png);background-size:10px;background-repeat:no-repeat;background-position:center center;" >';
            // r += '</div>';
            r += '<div id=""  style="float:left;width:32px;height:42px;background-color:transparent;background-image:url(./images/searching.png);background-size:12px;background-repeat:no-repeat;background-position:center center;" ></div>';
            r += '<div        style="float:left;padding:10px 3px 10px 0px;" >';
                r += '<input type="text" id="TXT_KEYWORD2" name="TXT_KEYWORD2" autocomplete="off" style="width:36px;font-size:16px;color:black;background-color:transparent;outline:none;" />';
            r += '</div>';
            r += '</form>';
        r += '</div>';

        o3.innerHTML = r;
        this.header     = this.frame.appendChild( o3 );
        document.getElementById('BTN_FINDMODE').addEventListener('click',
            (
              function(e){
                var ifs = document.getElementById('ID_FINDMODE_STATUS');
                ifs.classList.toggle('mode_right50per');
              }
            ).bind( this ), false );
        document.getElementById('BTN_TIMESELECTOR').addEventListener( 'click',
            ( function(e) {
                showTimelineSelector();
            }).bind( this ), false );
        document.getElementById('BTN_ALIGN_SPOTLIGHT').addEventListener( 'click',
            ( function(e) {
                this.close();
                oTile.close('childfinder');
            }).bind( this ), false );
        // document.getElementById('BTN_CLOSE_SPOTLIGHT').addEventListener( 'click',
        // ( function(e) {
        //     this.close();
        // }).bind( this ), false );
        // document.getElementById('BTN_FIND').addEventListener( 'click',
        //     ( function(e) {
        //         this.keyword.value = '';
        //         this.ctlMain();
        //     }).bind( this ), false );
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
                        // this.folder2.childNodes[i].style.backgroundColor = '';
                        this.folder2.childNodes[i].classList.remove( 'selected' );
                        this.folder2.childNodes[i].removeAttribute('selected');
                        // this.folder2.childNodes[i].classList.remove('mode_scalex50per');
                    }
                    return;
                }
                switch ( c.hasAttribute('selected') ){
                    case true:
                        // c.style.backgroundColor = '';
                        c.classList.remove( 'selected' );
                        c.removeAttribute( 'selected' );
                        // c.classList.remove('mode_scalex50per');

                        break;
                    case false:
                        // c.style.backgroundColor = 'lightgrey';
                        c.classList.add( 'selected' );
                        c.setAttribute( 'selected', 'yes' );
                        // c.classList.add( 'mode_scalex50per' );
                        var tbar = document.getElementById('ID_TIMELINE_BAR_AREA');
                        new winker( tbar, 7, 'wink_blue_on' ).play();
                        console.log('winker:' + tbar);
                        break;

                }
            }).bind( this ), false );
        this.resize();
        // fitting();
    
    
    },
    open : function(){
        this.overlay.style.visibility   = 'visible';
        this.frame.style.visibility     = 'visible';
        this.header.style.visibility    = 'visible';
        this.keyword.value              = '*';           
        this.ctlMain();
        // this.keyword.focus();
        this.resize();
        var imne = document.getElementById('ID_MODE_CHECKIN');
        imne.dispatchEvent( new Event('click') );
    
    },
    close : function(){
        this.overlay.style.visibility   = 'hidden';
        this.frame.style.visibility     = 'hidden';
        this.header.style.visibility    = 'hidden';
        this.main.style.visibility      = 'hidden';
        this.keyword.value              = '';           //キーワード削除
        this.main.innerHTML             = '';           // mainエリア内をクリア
        this.folder1                    = null;
        this.folder2                    = null;

    },
    opened : function(){
        console.log( this.overlay.style.visibility );
        return ( this.overlay.style.visibility != 'hidden' );
    },
    existSelectedChild : function(){
        if ( this.folder2 == null ) return false;
        var children = this.folder2.childNodes;
        for ( var i=0; i<children.length; i++ ){
            var c = children[i];
            if ( c.hasAttribute('selected')) return true;
        }
        return false;
    },
    checkin : function( hm ){
        var cpc = this.folder2;
        if ( cpc == null ) return;
        var arHM = hm.split(':');
        
        var cursor	= 0;
        var top		= ( parseInt( arHM[0] ) - 8 ) * pixelPerHour;
        var left	= ( parseInt( arHM[1] ) );
        console.log( 'hm:' + hm );
        console.log( 'top:' + top + ' left:' + left );
    
        for ( var i=0; i<cpc.childNodes.length; i++ ){
            var c = cpc.childNodes[i];
            if ( c.hasAttribute('selected') ){
                var child_id = c.getAttribute('child_id');
                if ( alreadyExistChildOnWhiteboard( child_id ) ){
                    c.classList.remove('selected');
                    c.removeAttribute('selected');
                    continue;
                }
                var child_name  = c.getElementsByClassName('CHILD_NAME')[0].innerText;
                var kana        = c.getAttribute('kana');
                var child_type  = c.getAttribute('child_type');
                var child_grade = c.getAttribute('child_grade');
                addChild( top + ( cursor * 20 ), left + ( cursor * 0 ), child_id, child_name, kana, child_type, child_grade, null, null, false, false, true );

                oLog.log( null, 'addChild');
                oLog.open(3);
                cursor++;
                // }
                c.classList.remove('selected');
                c.removeAttribute('selected');
            }
        }
        showWhiteboardChildCount();
    
    },
    ctlMain : function(){
        var keyword = this.keyword.value;
        if ( this.keyword.value == '' ){
            this.header.style.borderRadius  = '0px';
            this.main.style.visibility    = 'hidden';
            return;
        } else{
            this.header.style.borderRadius  = '0px 0px 0px 0px';
            this.main.style.visibility    = 'visible';
        }
    
        if ( this.main.childNodes.length == 0){
            var o = document.createElement('DIV');
            o.setAttribute('id', 'FOLDER_FIND_WHITEBOARD');
            o.style.height              = '29px';
            o.style.color               = 'gray';
            o.style.backgroundColor     = 'rgb(241, 241, 241)';
            o.style.fontSize            = '12px';
            o.style.borderBottom        = '1px solid lightgrey';
            o.style.padding             = '2px';
            o.style.marginBottom        = '0px';
            o.style.clear               = 'both';
            var r = '';
            r += '<div id="BTN_FOLDER1" style="float:left;width:24px;height:32px;background-image:url(./images/arrow-black-triangle-up.png);background-size:6px;background-position:center center;background-repeat:no-repeat;" >&nbsp;</div>';
            r += '<div                  style="float:left;width:80px;color:darkgrey;background-color:padding-left:4px;padding-top:8px;" >Whiteboard...</div>';
            o.innerHTML = r;
            var ffw = this.main.appendChild( o );

            var oo = document.createElement('DIV');
            oo.setAttribute('id', 'FOLDER_FIND_WHITEBOARD2');   //  明細リストエリア
            oo.innerText                = 'dummy';
            this.folder1 = this.main.appendChild( oo );
            document.getElementById('FOLDER_FIND_WHITEBOARD').addEventListener('click',
                ( function(e){
                    console.log('hohoho');
                    var ffw2 = document.getElementById('FOLDER_FIND_WHITEBOARD2');
                    var bf1 = document.getElementById('BTN_FOLDER1');
                    switch ( ffw2.style.display ){
                        case 'none':
                            ffw2.style.display = 'inline';
                            bf1.style.backgroundImage = 'url(./images/arrow-black-triangle-up.png)';
                            break;
                        case 'inline':
                        default:
                            ffw2.style.display = 'none';
                            bf1.style.backgroundImage = 'url(./images/arrow-black-triangle-down.png)';
                            break;
                    }
                } ).bind(this), false );
 
            o = document.createElement('DIV');
            o.setAttribute( 'id', 'FOLDER_FIND_CHILDREN_TABLE' );
            o.style.height              = '29px';
            o.style.color               = 'gray';
            o.style.backgroundColor     = 'rgb(241, 241, 241)';
            o.style.fontSize            = '12px';
            o.style.borderBottom        = '1px solid lightgrey';
            o.style.padding             = '2px';
            o.style.marginBottom        = '0px';
            o.style.clear               = 'both';
            r = '';
            r += '<div id="BTN_FOLDER2" style="float:left;width:24px;height:32px;background-image:url(./images/arrow-black-triangle-up.png);background-size:6px;background-position:center center;background-repeat:no-repeat;" >&nbsp;</div>';
            r += '<div style="float:left;width:80px;color:darkgrey;background-color:rgb(241, 241, 241);padding-left:4px;padding-top:8px;" >Cloud...</div>';
            o.innerHTML = r;
            var ffct = this.main.appendChild( o );

            oo = document.createElement('DIV');
            oo.setAttribute('id', 'FOLDER_FIND_CHILDREN_TABLE2');
            oo.innerText = 'Dummy';        
            this.folder2 = this.main.appendChild( oo );
            document.getElementById('FOLDER_FIND_CHILDREN_TABLE').addEventListener('click',
                ( function(e){
                    var ffct2 = document.getElementById('FOLDER_FIND_CHILDREN_TABLE2');
                    var bf2 = document.getElementById('BTN_FOLDER2');
                    switch ( ffct2.style.display ){
                        case 'none':
                            ffct2.style.display = 'inline';
                            bf2.style.backgroundImage = 'url(./images/arrow-black-triangle-up.png)';
                            break;
                        case 'inline':
                        default:
                            ffct2.style.display = 'none';
                            bf2.style.backgroundImage = 'url(./images/arrow-black-triangle-down.png)';
                            break;
                    }
                } ).bind(this), false);
        }
        
    //  WHITEBOARD / WHITEBOARD_CHECKOUT内を検索
        this.folder1.innerText = '';
        this.findWhiteboardChild( this.folder1, this.keyword.value );
    //  childrenテーブル検索
        this.folder2.innerHTML  = '';
        this.findChildrenTable( this.folder2, this.keyword.value );


    },

    existWhiteboardChildByChildID : function ( id ){
        var children = document.getElementById('WHITEBOARD').childNodes;
        for ( var i=0; i<children.length; i++ ){
            if ( id == children[i].getAttribute('child_id')) return true;
        }
        var children = document.getElementById('WHITEBOARD_CHECKOUT').childNodes;
        for ( var i=0; i<children.length; i++ ){
            if ( id == children[i].getAttribute('child_id')) return true;
        }
        return false;
    },

    findWhiteboardChild : function ( parent, keyword ){
        // WHITEBOARD,WHITEBOARD_CHECKOUTを検索
        for ( var i=0; i<12; i++ ){
            var children = getChildrenByHour( i + 8 );
            this.findWhiteboardChildHelper( parent, keyword, children );
        }
            
    },
    
    //
    //  ホワイトボード上のチャイルドをリストアップ
    //
    findWhiteboardChildHelper : function ( parent, keyword, children ){
        for ( var i=0; i<children.length; i++ ){
            var c = children[i];
            var child_id    = c.getAttribute('child_id');
            var checkout    = c.hasAttribute('checkout');
            var absent      = c.hasAttribute('absent');
            var imagefile   = c.getAttribute('imagefile');
            var child_name  = c.getElementsByClassName('CHILD_NAME')[0].innerText;
            var estimate    = c.getElementsByClassName('ESTIMATE_TIME')[0].innerText
            //child_name      = child_name.toLowerCase();
            var kana        = ( c.getAttribute('kana') != null )? c.getAttribute('kana') : '';
        
            if ( child_name.toLowerCase().indexOf( keyword.toLowerCase(), 0, keyword.length ) == 0 ||
                 kana.indexOf(keyword.toLowerCase(), 0, keyword.length ) == 0 ||
                 estimate.indexOf( keyword, 0, keyword ) == 0 ||
                 keyword == '%' || keyword == '*' ){
                var o = document.createElement('DIV');
                o.setAttribute( 'child_id', child_id );
                o.setAttribute( 'class', 'PALLETE_CHILD' );
                // o.style.transition      = '0.3s ease-in-out';
                o.style.height          = '50px';
                o.style.float           = 'left';

                var r = '';
                r += '<div class="CHILD_NAME" style=""  >' + child_name;
                    // r += '(' + c.style.top + ',' + c.style.left + ')';
                r += '</div>';
                if ( imagefile != '' && imagefile != null ){
                    r += '<div style="float:left;clear:left;width:30px;height:30px;overflow:hidden;border-radius:45%;background-image:url(./images/children/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
                    r += '</div>';
                }
                if ( absent )
                    r += '<div style="float:right;padding-left:8px;width:20px;background-image:url(./images/remove.png);background-size:12px;background-position:center center;background-repeat:no-repeat;">&nbsp;</div>';
                    else
                    r += '<div style="float:right;padding-left:8px;width:20px;background-image:url(./images/dry-clean.png);background-size:12px;background-position:center center;background-repeat:no-repeat;">&nbsp;</div>';
                if ( checkout )
                    r += '<div style="float:right;padding-left:8px;width:20px;background-image:url(./images/check-3.png);background-size:14px;background-position:center center;background-repeat:no-repeat;">&nbsp;</div>';
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
    
                        var child_name = cc.getElementsByClassName('CHILD_NAME')[0].innerText;
                        var estimate   = cc.getElementsByClassName('ESTIMATE_TIME')[0].innerText;
                        var h = estimate.substr(0, 2 );
                        var wbf = document.getElementById('WHITEBOARD_FRAME');
                        wbf.scrollTop = ( h - 8 ) * pixelPerHour;
                        if ( !c.hasAttribute('selected'))
                            new winker( cc, 7, 'wink_on' ).play();
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
                                var imagefile   = result[i].imagefile;
                                var c = document.createElement('DIV');
                                // c.setAttribute("child",     "yes");
                                c.setAttribute("child_id",    child_id );
                                c.setAttribute("id",          "c_1");
                                c.setAttribute("class",       "PALLETE_CHILD");
                                c.setAttribute('kana',        kana );
                                c.setAttribute('child_type',  child_type );
                                c.setAttribute('child_grade', child_grade );
                                // c.setAttribute("draggable",   "true");
                                // c.style.marginTop       = '1px';
                                // c.style.marginLeft      = '0px';
                                c.style.height          = '50px';
                                c.style.float           = 'left';
                                r = '';
                                r += '<div class="CHILD_NAME" style="float:left;font-size:12px;height:20px;padding-left:2px;">';
                                    r += child_name;
                                r += '</div>';
                                r += '<div style="float:right;font-size:12px;text-align:right;padding-top:2px;" >';
                                    r += child_type;
                                    r += '<span style="color:' + arChildGradeColor[ child_grade ] + ';">●</span>';
                                r += '</div>';
                                if ( imagefile != '' && imagefile != null ){
                                    r += '<div style="float:left;clear:left;width:30px;height:30px;overflow:hidden;border-radius:45%;background-image:url(./images/children/' + imagefile + ');background-size:cover;background-position:center center;background-repeat:no-repeat;" >';
                                    r += '</div>';
                                }
                                        

                                c.innerHTML = r;
                                var cc = parent.appendChild( c );
                                //  childテーブルで配置済のチャイルドに印をつける
                                if ( this.existWhiteboardChildByChildID( child_id )){
                                    cc.classList.add('already_checkin');
                                } else {
                                    //  ドラッグ設定
                                    cc.setAttribute("draggable",   "true");
                                    cc.addEventListener('dragstart',
                                        ( function(e) {
                                            dndOffsetX = e.offsetX;
                                            dndOffsetY = e.offsetY;
                                            // console.log( e.dataTransfer );
                                            // console.log('offsetY:' + dndOffsetY + ' OffsetX:' + dndOffsetX );
                                            e.dataTransfer.setData('text', e.target.getAttribute( 'child_id' ) );
                                            e.dataTransfer.setData('text2', e.target.getElementsByClassName('CHILD_NAME')[0].innerText );
                                        }).bind(this), { passive : false } );  
                                }

                            }
                        } else{
                            oLog.log( null, 'findChildrenTable:' + xmlhttp.status );
                        }
                        break;
                }
    
            } ).bind( this ), false );

        try{
            xmlhttp.open("POST", "/accounts/childfind", true );
            xmlhttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
            if ( keyword == '*' ) keyword = '%';
            xmlhttp.send( 'keyword=' + keyword );
    
        } catch ( e ) { alert( e );}
    
    }
        
};




