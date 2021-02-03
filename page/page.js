function getPageCtrl(exCtrl_callBack,_exCtrl){
    getPageCtrl.test1;
    if(!getPageCtrl.i){
        getPageCtrl.i+=1;
        var cssTag=document.createElement("link");
        cssTag.setAttribute("rel","stylesheet");
        cssTag.setAttribute("href",rltToAbs("./page.css",getPageCtrl.url));
        document.head.appendChild(cssTag);
        
        var EXCtrl_BluePrintXml_request=new XMLHttpRequest();
        EXCtrl_BluePrintXml_request.open("get",rltToAbs("./page.xml",getPageCtrl.url));

        EXCtrl_BluePrintXml_request.onload=function(e){
            var BluePrintXmlList=this.response.split("<ctrl_tab/>");

            class PageCtrlBase extends ExCtrl{
                constructor(data){
                    super(data);
                }
                callback(){
                    addResizeEvent.reResize(this.elements.root);
                }
                childCtrlType=_exCtrl;
            }
            class PageHome extends PageCtrlBase{
                constructor(data){
                    super(data);
                }
            }
            class Select extends PageCtrlBase{
                constructor(data){
                    super(data);
                }
            }
            class BBsPage extends PageCtrlBase{
                constructor(data){
                    super(data);
                }
            }
            class BlogPage extends PageCtrlBase{
                constructor(data){
                    super(data);
                }
            }
            PageHome.prototype.bluePrint=DEF_VirtualElementList.xmlToVE(BluePrintXmlList[0]);
            Select.prototype.bluePrint=DEF_VirtualElementList.xmlToVE(BluePrintXmlList[1]);
            BBsPage.prototype.bluePrint=DEF_VirtualElementList.xmlToVE(BluePrintXmlList[2]);
            BlogPage.prototype.bluePrint=DEF_VirtualElementList.xmlToVE(BluePrintXmlList[3]);
            getPageCtrl.home    =PageHome;
            getPageCtrl.select  =Select;
            getPageCtrl.bbsPage =BBsPage;
            getPageCtrl.blogPage=BlogPage;
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