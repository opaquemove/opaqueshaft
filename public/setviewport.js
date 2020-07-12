var getDevice = function(){
    var ua = navigator.userAgent;
    if ( ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0
      || ua.indexOf('Android') > 0 || ua.indexOf('Mobile')){
          return 'smartphone';
      } else if( ua.indexOf('iPad') > 0 || ua.indexOf('Android')>0 ){
          return 'tablet';
      } else {return 'other';}
};

switch ( getDevice() ){
    case 'smartphone':
    case 'other':
        document.write('<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">');
        break;
    case 'tablet':
        document.write('<meta name="viewport" content="width=1280">');
        break;
}