
function loadXMLDoc(method,src,async,postString,_AJAXObject){
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");//ie
    }
    xmlhttp.open(method,src,async);
    xmlhttp.send(postString);
    return xmlhttp;
}
function AJAXObject(method,src,async,callback){
    this.name;
    this.method=method!=null?method:null;
    this.src=src;
    this.async=async;
    this.callback=callback;
    this.ajaxText;
}

AJAXObject.prototype.realConn=function(postString){
    this.xmlhttp=loadXMLDoc(this.method,this.src,this.async,postString,this);
}