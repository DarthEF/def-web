/*!
 * Basics.js 应该在所有脚本之前载入
 */


/**
 * [judgeOs UA & 内核 判断]
 * @return {[type]} [description]
 */
function judgeOs() {
    var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        // 平板
        isFireFox = ua.indexOf("Mozilla") != -1,
        isTabvar = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tabvar)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTabvar,
        isPc = !isPhone && !isAndroid && !isSymbian,
        isAndroid = ua.indexOf("Android") != -1,
        isAndroid = ua.indexOf("Android") != -1,
        isIE = ua.indexOf("Trident") != -1,
        isWebkit = ua.indexOf("isWebkit") != -1,
        isMozilla = ua.indexOf("Mozilla") != -1;
    return {
        isTabvar: isTabvar,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc,
        isFireFox: isFireFox,
        isWebkit: isWebkit,
        isIE: isIE
    };
}
/*判断客户端的浏览器UA ed.  资料参考HTML5学堂*/


//旧版本浏览器兼容Object.keys函数   form https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = (function () {
      var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
          dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
          ],
          dontEnumsLength = dontEnums.length;
  
      return function (obj) {
        if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');
  
        var result = [];
  
        for (var prop in obj) {
          if (hasOwnProperty.call(obj, prop)) result.push(prop);
        }
  
        if (hasDontEnumBug) {
          for (var i=0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
          }
        }
        return result;
      }
    })()
};

/**MD5散列算法 form https://baike.baidu.com/item/MD5/212708?fr=aladdin
 * @param {String} string 需要加密的字符串
*/
function md5(string) {
    function md5_RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function md5_AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
    function md5_F(x, y, z) {
        return (x & y) | ((~x) & z);
    }
    function md5_G(x, y, z) {
        return (x & z) | (y & (~z));
    }
    function md5_H(x, y, z) {
        return (x ^ y ^ z);
    }
    function md5_I(x, y, z) {
        return (y ^ (x | (~z)));
    }
    function md5_FF(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_GG(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_HH(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_II(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    function md5_WordToHex(lValue) {
        var WordToHexValue = "",
        WordToHexValue_temp = "",
        lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };
    function md5_Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22;
    var S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20;
    var S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23;
    var S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;
    string = md5_Utf8Encode(string);
    x = md5_ConvertToWordArray(string);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = md5_AddUnsigned(a, AA);
        b = md5_AddUnsigned(b, BB);
        c = md5_AddUnsigned(c, CC);
        d = md5_AddUnsigned(d, DD);
    }
    return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
}

/**贝塞尔曲线*/
//该贝塞尔曲线来自:https://www.cnblogs.com/yanan-boke/p/8875571.html
function UnitBezier(p1x,p1y,p2x,p2y) {
    this.cx = 3.0 * p1x;
    this.bx = 3.0 * (p2x - p1x) - this.cx;
    this.ax = 1.0 - this.cx -this.bx;    
    this.cy = 3.0 * p1y;
    this.by = 3.0 * (p2y - p1y) - this.cy;
    this.ay = 1.0 - this.cy - this.by;
}
UnitBezier.prototype = {
    sampleCurveX : function(t) {
        return ((this.ax * t + this.bx) * t + this.cx) * t;
    },
    sampleCurveY : function(t) {  
        return ((this.ay * t + this.by) * t + this.cy) * t;
    },
    ReBezier : function(p1x,p1y,p2x,p2y){
        this.cx = 3.0 * p1x;
        this.bx = 3.0 * (p2x - p1x) - this.cx;
        this.ax = 1.0 - this.cx -this.bx;    
        this.cy = 3.0 * p1y;
        this.by = 3.0 * (p2y - p1y) - this.cy;
        this.ay = 1.0 - this.cy - this.by;
    }
}

//以上是网上找的
/*----------------------------------分割线-------------------------------------*/
//以下是Darth_Eternalfaith 自己写的
/** 阻止事件冒泡 */
function stopPropagation(e){e.stopPropagation();}

/** 阻止默认事件发生 */
function stopEvent(e){
    if (e&&e.preventDefault)e.preventDefault(); //阻止默认浏览器动作(W3C)
    else window.event.returnValue = false; //IE中阻止函数器默认动作的方式
    return false;
}

/** stopPropagation & Event 阻止冒泡和默认事件 */
function stopPE(e){
    e.stopPropagation();
    if (e&&e.preventDefault)e.preventDefault(); //阻止默认浏览器动作(W3C)
    else window.event.returnValue = false; //IE中阻止函数器默认动作的方式
    return false;
}

/**判断是否能支持某些input的type
*/
function inputSupportsTypeF(){
    function selectInputSupportsType(type){
        if(!document.createElement) return false;
        var input = document.createElement('input');
        input.setAttribute('type',type);
        return !(input.type=='text' && type!='text');
    }
    return {
        number:selectInputSupportsType("number"),   //数字输入框
        range:selectInputSupportsType("range"),     //滑动条
        color:selectInputSupportsType("color"),     //颜色板
        search:selectInputSupportsType("search"),   //搜索
        url:selectInputSupportsType("url"),         //url
        email:selectInputSupportsType("email"),     //e-mail
        //时间选择 op
        date:selectInputSupportsType("date"),       
        month:selectInputSupportsType("month"),
        week:selectInputSupportsType("week"),
        time:selectInputSupportsType("time"),
        datetime:selectInputSupportsType("datetime"),
        datetimeLocal:selectInputSupportsType("datetime-local")
        //时间选择 ed
    }
    //要用再加
}

/**让控件仅接受数字
 * function(e){if(!inputNumber(e))return 0}
 * @param {Event} e 
 */
function inputNumber(){
    var event=event||e||window.event;
    if(!(event.keyCode>47&&event.keyCode<58)){
        event.stopPropagation();
        if (event&&event.preventDefault){event.preventDefault(); return 0;}//W3C
        else{window.event.returnValue = false; return 0;} //IE
    }
    else return 1;
}

/** 用 rad 表示的 1deg */
var deg=Math.PI/180;

//兼容open
if(this.Element&&Element.prototype.attachEvent){
    Element.prototype.addEventListener=Element.prototype.attachEvent;
}
//兼容end

//功能open
/**
 * 获取当前运行脚本的地址
 * @returns {String}
 */
function getCurrAbsPath(){
    if(document.currentScript){
        return document.currentScript.src;
    }
    else{
        var a = {}, stack;
        try{
            a.b();
        }
        catch(e){
            stack = e.stack || e.sourceURL || e.stacktrace; 
        }
        var rExtractUri = /(?:http|https|file):\/\/.*?\/.+?.js/, 
        absPath = rExtractUri.exec(stack);
        return absPath[0] || '';
    }
}
/**
 * 把相对地址转换成绝对地址
 * @param {String} _fileURL 
 */
function rltToAbs(_fileURL,rootURL){
    var fileURL,fileURL_Root;
    if(rootURL){
        fileURL_Root=rootURL; 
    }
    else if(fileURL_Root=getCurrAbsPath());
    else{
        fileURL_Root=this.location.href;
    }
    if(_fileURL.indexOf("://")!=-1){
        // 这个是绝对路径
        fileURL=_fileURL;
    }
    else{
        // 相对路径
        var urlspc=1;
        var i;
        var tempUrl="";
        for(i=0;i<_fileURL.length;i+=3){
            if(_fileURL[i]=='.'&&_fileURL[i+1]=='.'&&_fileURL[i+2]=='/'){
                ++urlspc;
            }
            else{
                for(var j=i;j<_fileURL.length;++j){
                    if(_fileURL[j]!='/'&&_fileURL[j]!='.'){
                        tempUrl=_fileURL.slice(j);
                        break;
                    }
                }
                break;
            }
        }
        for(i=fileURL_Root.length-1;(i>=0)&&(urlspc);--i){
            if(fileURL_Root[i]=='/'){
                --urlspc;
            }
        }
        fileURL=fileURL_Root.slice(0,i+2)+tempUrl;
    }
    return fileURL;
}
/**对比两个列表项是否相同
 * @param {Array}   a1       要进行比较的数组
 * @param {Array}   a2       要进行比较的数组
 * @return {Boolean}    返回是否相同
*/
function arrayEqual(a1,a2){
    if(a1.length!=a2.length)return false;
    var i=a1.length;
    for(--i;i>=0;--i){
        if(a1[i]!=a2[i])return false;
    }
    return true;
}
/**
 * NodeList 转换为 Array
 * @param {NodeList} nodelist 
 * @returns {Array<Node>} 保留引用的链接
 */
function nodeListToArray(nodelist){
    var array=null;
    try{
        array=Array.prototype.slice.call(nodelist,0);//非ie浏览器  ie8-将NodeList实现为COM对象，不能用这种方式检测
    }catch(ex){//ie8-
        var i=nodelist.length-1;
        array=new Array(i+1);
        for(;i<nodelist.length;i++){
            array.push(nodelist[0]);
        }
    }
    return array;
}
/**对比两个列表项是否相同(不区分项的类型和顺序)
 * @param {Array}   a1       要进行比较的数组
 * @param {Array}   a2       要进行比较的数组
 * @return {Boolean}    返回是否相同
 * 本来是给KeyNotbook用的 
*/
function arrayCmp(a1,a2){
    if(a1&&a2){
        if(a1.length!=a2.length)
            return false;
        var ALength=a1.length;
        var flags=Array(ALength)
        for(var i=ALength-1;i>=0;--i){
            for(var j=ALength-1;j>=0;--j){
                if(a1[i]==a2[j]){
                    flags[i]=true;
                }
            }
        }
        for(var i=ALength-1;i>=0;--i){
            if(!flags[i])return false;
        }
        return true;
    }
}

/**
 * 创建重载函数
 * @param   {Function} defaultFnc 当没有和实参对应的重载时默认执行的函数
 * @return  {Function} 函数
 * 用 .addOverload 添加重载
 */
function createOlFnc(defaultFnc){
    var OverloadFunction=(function(){
        return function(){
            var i=arguments.length-1,j,flag=false;
            for(i=OverloadFunction.ols.length-1;i>=0;--i){
                if(arguments.length==OverloadFunction.ols[i].parameterType.length){
                    flag=true;
                    for(j=arguments.length-1;flag&&j>=0;--j){
                        flag=(arguments[j].constructor==OverloadFunction.ols[i].parameterType[j]||arguments[j] instanceof OverloadFunction.ols[i].parameterType[j]);
                    }
                    if(flag)break;
                }
            }
            if(flag){
                return OverloadFunction.ols[i].fnc.apply(this,arguments);
            }
            else{
                return OverloadFunction.defaultFnc.apply(this,arguments);
            }
        }
    })();
    OverloadFunction.ols=[];
    OverloadFunction.defaultFnc=defaultFnc;
    OverloadFunction.addOverload=createOlFnc.addOverload;
    return OverloadFunction;
}
/**
 * 添加一个重载
 * @param {Array} parameterType   形参的类型
 * @param {Function}    fnc             执行的函数
 * @param {String}      codeComments    函数的注释
*/
createOlFnc.addOverload=function(parameterType,fnc,codeComments){
    this.ols.push({parameterType:parameterType,fnc:fnc,codeComments:codeComments});
}

/**继承
 * @param {*} _basics   基类
 * @param {*} _derived  子类
 */
function inheritClass(_basics,_derived){
    // 创建一个没有实例方法的类
    var Super = function(){};
    Super.prototype = _basics.prototype;
    //将实例作为子类的原型
    _derived.prototype = new Super();
}
/**
 * 委托
 * 使用方法和重载类似
 * var new_delegate = createDelegate();
 * new_delegate.addAct(tgt,act);
 * new_delegate();
 */
function createDelegate(){
    var rtn=(function(){
        return function(){
            this.actList[i].act.apply(this.actList[i].tgt,arguments);
        }
    })();
    rtn.actList=[];
    /**添加一个委托 */
    rtn.prototype.addAct=function(tgt,act){
        this.actList.push({tgt:tgt,act:act});
    }
    /**移除一个委托 */
    rtn.prototype.removeAct=function(tgt,act){
        var i;
        for(i=this.actList.length-1;i>=0;--i){
            if(this.actList[i].tgt==tgt&&this.actList[i].act==act){
                this.actList.splice(i,1);
            }
        }
    }
}

/**为了防止服务器出错对部分字符进行编码
 * @param {String} str <>"'{}[] to &#ascii
 */
function codeToHtml(str){
    var regex=[],
        rStrL=[],
        enStr=str;
    regex.push(/</g);   rStrL.push("&#60;");
    regex.push(/>/g);   rStrL.push("&#62;");
    regex.push(/"/g);   rStrL.push("&#34;");
    regex.push(/'/g);   rStrL.push("&#39;");
    regex.push(/\{/g);  rStrL.push("&#123;");
    regex.push(/\}/g);  rStrL.push("&#125;");
    regex.push(/\[/g);  rStrL.push("&#91;");
    regex.push(/\]/g);  rStrL.push("&#93;");
    for(var i=regex.length-1;i>=0;--i){
        enStr=enStr.replace(regex[i],rStrL[i]);
    }
    return enStr;
}
//对部分转义的字符反转义
function htmlToCode(str){
    var regex=[],
        rStrL=[],
        enStr=str;
    regex.push(/&amp;/g);   rStrL.push("&");

    for(var i=regex.length-1;i>=0;--i){
        enStr=enStr.replace(regex[i],rStrL[i]);
    }
    return enStr;
}
/**
 * 模版字符串
 * @param {String} _str  字符串
 * @param {Object} then this 指针
 * @param {Array} argArray 实参
 * @returns {Object} {str:{String},hit:{Array<String>}}
 */
function templateStringRender(str,then,argArray){
    
    if(Object.keys(then).length){
        var temp=[],tempstr="",hit=[];
        var q,p;// q是左
        var headFlag=0,footFlag=0;
        for(p=0,q=0;str[p];++p){
            for(var i=0;i<templateStringRender.templateKeyStr.op.length;++i){
                if(!(headFlag=str[p+i]==templateStringRender.templateKeyStr.op[i])){break;}
            }
            
            if(headFlag){ // 检测到头
                temp.push(str.slice(q,p));
                q=p+2;
                while(1){
                    ++p;
                    for(var i=0;i<templateStringRender.templateKeyStr.ed.length;++i){
                        if(!(footFlag=str[p+i]==templateStringRender.templateKeyStr.ed[i])){break;}
                    }
                    if(footFlag){
                        tempstr=str.slice(q,p);
                        oldL=temp.join("").length;
                        temp.push((new Function(["tgt"],"return "+tempstr)).apply(then,argArray));
                        hit.push({expression:tempstr,value:temp[temp.length-1]});
                        q=p+1;
                        break;
                    }
                }
            }
        }
        temp.push(str.slice(q,p));
        return {str:temp.join(""),hit:hit};
    }
}

templateStringRender.templateKeyStr={op:"${",ed:"}"};

// 强化 对 dom 操作


/**获取所有后代元素*/
if(this.Element)
Element.prototype.getChildElement=function(){
    var chE=[];
    var _chE=this.children;
    for(var i=0;i<_chE.length;++i){
        chE.push(_chE[i])
        chE=chE.concat((_chE[i].getChildElement()));
    }
    return chE;
}

/**按键记录器key notbook*/
function KeyNotbook(){
    this.FElement;
    this.downingKeyCodes=[];
    this.keysdownF  =[];    //function
    this.keysdownFF =[];    //function flag
    this.keysupF={};
}
KeyNotbook.prototype={
    constructor:KeyNotbook,
    // 添加按键事件
    setDKeyFunc:function(keycode,func){
        if(!keycode||!func){
            return -1;
        }
        if(keycode.constructor==Number){
            this.keysdownFF.push([keycode]);
        }
        else if(keycode.constructor==Array){
            this.keysdownFF.push(keycode);
        }
        this.keysdownF.push(func);
    },

    // 移除按键事件
    removeDKeyFunc:function(_keycode,func){
        var keycode;
        if(!_keycode||!func){
            return -1;
        }
        if(_keycode.constructor==Number){
            keycode=[_keycode];
        }
        else if(_keycode.constructor==Array){
            keycode=_keycode;
        }
        for(var i=this.keysdownFF.length-1;i>=0;--i){
            if(arrayCmp(this.keysdownFF[i],keycode)){
                if(this.keysdownF[i]==func){
                    this.keysdownF.splice(i,1);
                    this.keysdownFF.splice(i,1);
                    break;
                }
            }
        }
    },

    /**按下新按键*/
    setKey:function(e){
        var flag=false;
        var i=0;
        var downingKALength=this.downingKeyCodes.length;
        if(downingKALength)
        for(var j=downingKALength-1;j>=0;--j){
            if(flag)break;
            flag=e.keyCode==this.downingKeyCodes[j];
            i++;
        }
        if(!flag){
            // 有新的按键按下
            this.downingKeyCodes[i]=e.keyCode;
            for(i=this.keysdownFF.length-1;i>=0;--i){
                if(arrayCmp(this.keysdownFF[i],this.downingKeyCodes)){
                    this.keysdownF[i].call(this.FElement,e);
                    return;
                }
            }
        }
        else{
            for(i=this.keysdownFF.length-1;i>=0;--i){
                if(arrayCmp(this.keysdownFF[i],this.downingKeyCodes)&&!this.keysdownF.keepFlag){
                    this.keysdownF[i].call(this.FElement,e);
                    return;
                }
            }
        }
    },

    /**抬起按键*/
    removeKey:function(e){
        var downingKALength=this.downingKeyCodes.length;
        if(downingKALength)
        for(var i=downingKALength-1;i>=0;--i){
            if(e.keyCode==this.downingKeyCodes[i]){
                this.downingKeyCodes.splice(i,1);
                if(this.keysupF[e.keyCode.toString()])this.keysupF[e.keyCode.toString()].call(this.FElement,e);
                return 0;
            }
        }
    },
    reNB:function(){
        this.downingKeyCodes=[];
    }
}

/**
 * 给element添加按键事件
 * @param {Document} _Element 添加事件的元素
 * @param {Boolean} _keepFlag 是否重复触发事件
 * @param {Number||Array} _keycode 按键的 keycode 如果是组合键 需要输入数组
 * @param {Function} _event 触发的事件
 * @param {Boolean} _type false=>down;true=>up
 */
function addKeyEvent(_Element,_keepFlag,_keycode,_event,_type){
    var thisKeyNotbook;
    if(!_Element.keyNotbook){
        _Element.keyNotbook=new KeyNotbook();
        thisKeyNotbook=_Element.keyNotbook;
        thisKeyNotbook.FElement=_Element;
        _Element.addEventListener("keydown" ,function(e){thisKeyNotbook.setKey(e)});
        _Element.addEventListener("keyup"   ,function(e){thisKeyNotbook.removeKey(e)});
        _Element.addEventListener("blur"    ,function(e){thisKeyNotbook.reNB()});
    }
    else{
        thisKeyNotbook=_Element.keyNotbook;
    }
    if(_type){
        thisKeyNotbook.keysupF[_keycode.toString()]=_event;
    }
    else{
        thisKeyNotbook.setDKeyFunc(_keycode,_event);
        thisKeyNotbook.keysdownF[thisKeyNotbook.keysdownF.length-1].keepFlag=_keepFlag;
    }
}

/**
 * 移除 element 上的 keyNotBook 的事件
 * @param {Document} _Element 
 * @param {Number||Array} _keycode 
 * @param {Function} _event 
 * @param {} _type false=>down;true=>up
 */
function removeKeyEvent(_Element,_keycode,_event,_type){
    if(_Element.keyNotbook){
        var thisKeyNotbook=_Element.keyNotbook;
        if(_type){
            delete thisKeyNotbook.keysupF[_keycode.toString()];
        }
        else{
            thisKeyNotbook.removeDKeyFunc(_keycode,_event);
        }
    }
}

/**
 * 给element添加resize事件, 没有 e 事件参数
 * @param {Element} _element 绑定的元素
 * @param {Function} _listener 触发的函数
 */
function addResizeEvent(_element,_listener){            
    if(_element.resizeMarkFlag){
        element.resizeListener.push(_listener);
    }
    else{
        _element.resizeListener=[_listener];
        var mark1 =document.createElement("div"),
            mark1C=document.createElement("div"),
            mark2C=document.createElement("div");
        var lowWidth=_element.offsetWidth||0;
        var lowHeight=_element.offsetHeight||0;
        var maxWidth=lowWidth*999,maxHeight=lowWidth*999;
        mark1.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;z-index=-10000;overflow:hidden;visibility:hidden;";

        mark1C.style.cssText="width:300%;height:300%;";
        mark2C.style.cssText=`width:${maxWidth}px;height:${maxHeight}px;`;
        
        var mark2=mark1.cloneNode(false);
        
        mark1.appendChild(mark1C);
        mark2.appendChild(mark2C);
        _element.appendChild(mark1);
        _element.appendChild(mark2);

        mark1.scrollTop=maxHeight;
        mark1.scrollLeft=maxWidth;

        mark1.markBrother=mark2;
        mark2.markBrother=mark1;

        function m_resize(){
            if(lowWidth!=_element.offsetWidth||lowHeight!=_element.offsetHeight){
                // console.log(2);
                lowWidth=_element.offsetWidth;
                lowHeight=_element.offsetHeight;
                for(var i=_element.resizeListener.length-1;i>=0;--i){
                    _element.resizeListener[i].call(_element);
                }
                if(maxWidth<lowWidth||maxHeight<lowWidth)
                maxWidth=lowWidth*100,maxHeight=lowWidth*100;
                mark2C.style.cssText=`width:${maxWidth}px;height:${maxHeight}px;`;
            }
        }
        function m_scroll(e){
            m_resize();
            this.markBrother.scrollTop=maxHeight;
            this.markBrother.scrollLeft=maxWidth;
        }
        mark1.onscroll=mark2.onscroll=m_scroll;
        _element.resizeMarkFlag=true;
        _element.resizeMark1=mark1;
        _element.resizeMark2=mark2;
    }
}
/**
 * 点击站内链接调用的函数, 另链接不跳转而是成为锚点链接
 */
function linkClick(e){
    var _event=e||event;
    if(this.host==window.location.host){
        // var hostchar=this.pathname.slice(this.pathname.indexOf('/')+1,this.pathname.slice(this.pathname.indexOf('/')+1).indexOf('/')+1);
        switch (_event.button){
            case 0:
                window.location.href='#/'+this.href.substr(this.href.indexOf(this.host)+(this.host.length)+1);
                if (_event&&_event.preventDefault)_event.preventDefault(); //阻止默认浏览器动作(W3C)
                else window.event.returnValue = false; //IE中阻止函数器默认动作的方式
                return false;
            break;
            case 1:
                window.open(this.getAttribute('href'));
            break;
            default:
                break;
            }
        }
}

/**
 * @param {Number} max 步进器的最大值
 * @param {Number} min 步进器的最小值
 * @param {Number} now 步进器的当前值
 */
function Stepper(max,min,now){
    this.max=max===undefined?Infinity:max;
    this.min=(min===undefined)?(0>this.max?this.max-1:0):(min);
    this.i=now||0;
}

Stepper.prototype={
    toString:function(){
        return this.i;
    },
    set:function(_i){
        this.i=_i;
        this.overflowHanding();
    },
    next:function(_l){
        var temp,l=_l===undefined?1:_l;
        this.i+=l;
        
        this.overflowHanding();

        return this.i;
    },
    overflowHanding:function(){
        if(this.max==this.min) return this.i;
        var temp;
        if(this.i<this.min){
            do{
                temp=this.i-this.min;
                this.i=this.max;
                this.i+=temp;
            }while(this.i<this.min);
        }
        else if(this.i>this.max){
            do{
                temp=this.i-this.max;
                this.i=this.min;
                this.i+=temp;
            }while(this.i>this.max);
        }
        return this.i;
    }
}

function download(url,name){
    var xhr=new XMLHttpRequest();
    xhr.open("Get",url);
    xhr.requestType="blob";
    xhr.send();
    xhr.onload=function(){
        var data=this.response;
        var tempA=document.createElement("a");
        var dataurl=URL.createObjectURL(data);
        console.log(dataurl);
        tempA.setAttribute("href",dataurl);
        tempA.setAttribute("download",name===undefined?"":name);
        tempA.click();
    }
}

/**
 * 存储 cue 格式为js的obj格式
 * 参考资料来自: https://tieba.baidu.com/p/6160083867
 */
function DEF_CUEOBJ(){
    this.performer="";
    this.songwriter="";
    this.title="";
    this.file="";
    this.fileType="";
    this.rem=[];
    this.track=[];
}
DEF_CUEOBJ.prototype={
    /**
     * 查找rem指令
     * @param {String} rem1 rem 的 第一个指令
     * @returns {Array<Array<String>>}
     */
    selectRem:function(rem1){
        var rtn=[];
        for(var i=this.rem.length-1;i>=0;--i){
            if(this.rem[i][1]&& this.rem[i][1]==rem1){
                rtn.push(this.rem[i]);
            }
        }
        return rtn;
    },
    setCommand:{
        // 在此处添加对cue格式的指令的处理
        // 由于我只需要处理音乐文件的 所以省略了很多指令
        /**
         * @param {Array<String>} _cl 指令的字符串数组
         */
        rem:function(_cl){
            this.rem.push(_cl);
        },
        file:function(_cl){
            this.file=_cl[1];
            this.fileType=_cl[2];
        },
        title:function(_cl){
            this.title=_cl[1];
        },
        performer:function(_cl){
            this.performer=_cl[1];
        },
        songwriter:function(){
            this.songwriter=_cl[1];
        },

        // track
        // 因为js的继承反射内容是复制这个对象的引用，所以即使是在子类追加也会追加到基类上，非常拉跨。   所以我把子类的反射的内容写在基类上了...
        
        index:function(_cl){
            var indexNub=parseInt(_cl[1]);
            var time=cue_timeToSecond(_cl[2]);
            var lastTrack;
            if(this.root.track.length-2>=0){
                lastTrack=this.root.track[this.root.track.length-2];
            }
            switch(indexNub){
                case 1:
                    this.op=time;
                    if(lastTrack&&(lastTrack.ed==undefined)){
                        lastTrack.ed=time;
                    }
                break;
                case 0:
                    lastTrack.ed=time;
                break;
                default:
                    this.indexList.push(time);
                break;
            }
        }
    }
}
function DEF_CUEOBJTrack(file,root,trackIndex){
    this.performer="";
    this.songwriter="";
    this.title="";
    this.ListIndex;
    this.rem=[];
    this.trackIndex=trackIndex;
    this.root=root;
    this.file=file;
    this.op;    //秒
    this.ed;
    this.indexList=[];
}
inheritClass(DEF_CUEOBJ,DEF_CUEOBJTrack);

DEF_CUEOBJTrack.prototype.getDuration=function(){
    return this.ed-this.op;
}

/**
 * 把cue的表示时间的格式转换成秒
 * @param {String} timeStr mm:ss:ff
 * @returns {Number}
 */
function cue_timeToSecond(timeStr){
    var temp=timeStr.split(':');
    
    return parseInt(temp[0])*60+parseInt(temp[1])+parseInt(temp[2])/75;
}

function loadCue(str){
    var p=0,q=0,isQuotes=false;
    var tempStr;
    var rtn=new DEF_CUEOBJ();
    var then=rtn;
    var CommandList=[];
    for(;p<str.length;++p){
        if(str[p]!=' '){
            for(q=p;(p<=str.length);++p){
                if(str[p]=='\"'){
                    isQuotes=!isQuotes;
                    if(isQuotes){
                        q=p+1;
                    }
                }
                if((str[p]==' ')&&(!isQuotes)){
                    // 记录指令
                    if(str[p-1]=='\"'){
                        tempStr=str.slice(q,p-1);
                    }else{
                        tempStr=str.slice(q,p);
                    }
                    CommandList.push(tempStr);
                    q=p+1;
                }
                else if((str[p]=="\n")||(str[p]=="\r")||(str.length==p)){
                    // 换行 进入下一条指令
                    if(str[p-1]=='\"'){
                        tempStr=str.slice(q,p-1);
                    }else{
                        tempStr=str.slice(q,p);
                    }
                    CommandList.push(tempStr);

                    if(CommandList[0].toLowerCase()=="track"){
                        then=new DEF_CUEOBJTrack(rtn.file,rtn,rtn.track.length);
                        rtn.track.push(then);
                    }
                    else{
                        if(then.setCommand[CommandList[0].toLowerCase()]){
                            then.setCommand[CommandList[0].toLowerCase()].call(then,CommandList);
                        }
                        else{
                            // 不支持这个指令
                        }
                    }

                    do{ ++p; } while((str[p+1]=="\n")||(str[p+1]=="\r"));
                    CommandList=[];
                    break;
                }
            }
        }
    }
    return rtn;
}

/** 
 * 查找图片文件
 * @param {String} _rootUrl 根目录
 * @param {Array<String>} _nameList 文件名列表
 * @param {Array<String>} _afertList 后缀名列表
 * @param {Function} callBack 搜索完成的回调函数 callBack({Array<String>}); 参数是搜索到的所有文件路径的列表
 */
function selectImg(_rootUrl,_nameList,_afertList,callBack){
    var temp=new Array(_afertList.length);
    var c=0,ctgt=_afertList.length*_nameList.length;
    var rtn=[];
    for(var i=temp.length-1;i>=0;--i){
        temp[i]=new Image();
        temp[i].onload=function(){
            rtn.push(this.src);
            c++;
            if(c>=ctgt){
                callBack(rtn);
            }
            else{
                this.n_index+=1;
                if(this.n_index>=_nameList.length)return;
                this.src=_rootUrl+_nameList[this.n_index]+this.n_afert;
            }
        }
        temp[i].onerror=function(e){
            c++;
            if(c>=ctgt){
                callBack(rtn);
            }
            else{
                this.n_index+=1;
                if(this.n_index>=_nameList.length)return;
                this.src=_rootUrl+_nameList[this.n_index]+this.n_afert;
            }
        }
        temp[i].n_index=0;
        temp[i].n_afert=_afertList[i];
        temp[i].src=_rootUrl+_nameList[temp[i].n_index]+temp[i].n_afert;
    }
    // callBack(rtn);
}

// selectImg("./img/",["1","2","3","4","5"],[".jpg",".jpeg",".png",".gif"],function(e){console.log(e)});