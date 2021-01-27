var thisjsUrl=getCurrAbsPath();
var leftBox=document.getElementById("Left");

var indexnav;
var audioControl;
getExCtrl(function(exCtrl){
    var IndexNav=exCtrl.IndexNav;
    var AudioControl=exCtrl.AudioControl;
    // var indexnav;
    indexnav=new IndexNav("leftIndex");
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
    
    audioControl=new AudioControl("leftBottom_audioControl");
    audioControl.addend(leftBox);
    audioControl.addItem(new DEF_MediaObj(rltToAbs("../../media/audio/03 - REDLINE Title.flac",thisjsUrl),"REDLINE TITLE"));
    audioControl.loadCue(rltToAbs("../../media/audio/银影侠ost.cue",thisjsUrl));
})