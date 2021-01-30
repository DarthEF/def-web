var indexjsUrl=getCurrAbsPath();
var pageType=location.hash.split("/")[1];

var leftBox=document.getElementById("Left");
var main={};
var mainBox=document.getElementById("Main");

var pageCtrl,exCtrl;

var indexnav;
var audioControl;
function getEXCtrlCallback(ctrlList){
    exCtrl=ctrlList;
    getPageCtrl(getPageCtrlCallback,exCtrl);
    indexnav=new exCtrl.IndexNav("leftIndex");
    indexnav.data={
        d1List:[
            {
                url:"./index",
                text:"Index",
                title:"Index",
                // child:[]
            },{
                url:"./blog",
                text:"blog",
                title:"Darth's web log",
                child:[
                    {
                        url:"./blog/code",
                        text:"code",
                        title:"code notbook"
                    },{
                        url:"./blog/food",
                        text:"food",
                        title:"eat food"
                    }
                ]
            }
        ]
    };
    indexnav.addend(leftBox);
    
    audioControl=new exCtrl.AudioControl("leftBottom_audioControl");
    audioControl.addend(leftBox);
    audioControl.addItem(new DEF_MediaObj(rltToAbs("../media/audio/03 - REDLINE Title.flac",indexjsUrl),"REDLINE TITLE"));
    audioControl.loadCue(rltToAbs("../media/audio/银影侠ost.cue",indexjsUrl));
}

function getPageCtrlCallback(ctrlList){
    pageCtrl=ctrlList;
    renderPage(pageType);
}
/**
 * 渲染界面
 * 必须在控件加载完成后运行
 * @param {String} pageType 界面的类型
 */
function renderPage(pageType){
    switch(pageType){
        case "bbs" :
            
        break;
        case "home" :
        default:
            main.contentCtrl=new pageCtrl.home();
            main.contentCtrl.addend(mainBox);
            main.contentCtrl.renderString();
        break;
    }
}
getExCtrl(getEXCtrlCallback);