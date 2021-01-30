function getPageCtrl(exCtrl_callBack,_exCtrl){
    getPageCtrl.test1;
    if(!getPageCtrl.i){
        getPageCtrl.i+=1;
        
        var EXCtrl_BluePrintXml_request=new XMLHttpRequest();
        EXCtrl_BluePrintXml_request.open("get",rltToAbs("./page.xml",getPageCtrl.url));

        EXCtrl_BluePrintXml_request.onload=function(e){
            var BluePrintXmlList=this.response.split("<ctrl_tab/>");
            getPageCtrl.home=ExCtrl.xmlToCtrl(BluePrintXmlList[0],{
                childCtrlType:_exCtrl
            });
            getPageCtrl.select=ExCtrl.xmlToCtrl(BluePrintXmlList[1],{
                childCtrlType:_exCtrl
            });
            getPageCtrl.bbsPage=ExCtrl.xmlToCtrl(BluePrintXmlList[2],{
                childCtrlType:_exCtrl
            });
            getPageCtrl.blogPage=ExCtrl.xmlToCtrl(BluePrintXmlList[3],{
                childCtrlType:_exCtrl
            });
            exCtrl_callBack({
                home    :getPageCtrl.home,
                select  :getPageCtrl.select,
                bbsPage :getPageCtrl.bbsPage,
                blogPage:getPageCtrl.blogPage,
            });
        }
        EXCtrl_BluePrintXml_request.send();
    }
}
getPageCtrl.i=0;
getPageCtrl.url=getCurrAbsPath();