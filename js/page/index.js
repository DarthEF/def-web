
// console.log(new Date()-opentime,window.performance.getEntries());
if(getCurrAbsPath()){
    
};
var leftBox=document.getElementById("Left");
var IndexNav=htmlToCtrl(document.getElementById("indexNavBluePrint").innerHTML,{
    callback:function(){
        console.log(this);
        this.elements[this.bluePrint.ves[0].ctrlID].onclick=function(e){
            var evtgt=e.target;
            var tempStr;
            // console.log(evtgt)
            if(evtgt.tagName=="A"){
                tempStr=evtgt.href;
                if(tempStr.indexOf(window.location.origin)==0){
                    stopEvent(e);
                    window.location=window.location.origin+"#"+(tempStr.slice(window.location.origin.length));
                    if(tempStr=evtgt.getAttribute("title")){
                        window.document.title=tempStr;
                    }
                }
            }
        }
    }
});
var indexnav=new IndexNav("leftIndex");
indexnav.data={
    a:"123",
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

var audioControl=htmlToCtrl(document.getElementById("audioControlBluePrint").innerHTML,{});

var audioControl=new audioControl("leftBottom_audioControl",{
    next:function(){
        
    }
});

audioControl.addend(leftBox);