var IndexNav,AudioControl;


var leftBox=document.getElementById("Left");

var audioControl;

var EXCtrl_BluePrintXml_request=new XMLHttpRequest();
EXCtrl_BluePrintXml_request.open("get",rltToAbs("./EXCtrl.xml"));

EXCtrl_BluePrintXml_request.onload=function(e){
    var BluePrintXmlList=this.response.split("<ctrl_tab/>");
    /**
     * 左侧的索引栏 
     */
    IndexNav=htmlToCtrl(BluePrintXmlList[0],{
        callback:function(){
            // console.log(this);
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

    /**
     * 左侧的音乐播放器;
     */
    AudioControl=htmlToCtrl(BluePrintXmlList[1],{
        /**
         * 控件 初始化函数
         */
        initialize:function(){
            this.medioList=[];
            this.playType=0;
            this.indexMap=[];
            this.mapIndex=0;
        },
        /**
         * 控件 初始化完成的回调函数
         */
        callback:function(){
            console.log("cnm");
        },
        /**
         * 新增一个媒体
         * @param {String} _src     媒体地址
         * @param {Number} _step    步进 用于切换当前播放的内容
         * @returns {Number} 返回插入的目的地的下标
         */
        setPlaySrc:function(_src,_step){
            var tgtIndex=(this.indexMap[this.mapIndex]==undefined?-1:this.indexMap[this.mapIndex])+1;
            this.medioList.splice(tgtIndex,0,_src);
            for(var i=this.indexMap.length-1;i>=0;--i){
                if(this.indexMap[i]>=tgtIndex){
                    this.indexMap[i]+=1;
                }
            }
            this.indexMap.splice(this.mapIndex+1,0,tgtIndex);
            if(_step)this.setPlayingIndex(this.indexMapStep(_step));
            return tgtIndex;
        },
        /**
         * 刷新 indexMap
         */
        reIndexMap:function(type){
            if(this.medioList.length!=this.indexMap.length){
                this.indexMap=new Array(this.medioList.length);
            }
            switch(type){
                // 正向
                case 0:
                    for(var i=this.medioList.length-1;i>=0;--i){
                        this.indexMap[i]=i;
                    }
                break;
                // 逆向
                case 1:
                    for(var i=this.medioList.length-1,j=0;i>=0;--i,++j){
                        this.indexMap[i]=j;
                    }
                break;
                // 乱序
                case 2:
                    if(this.indexMap[1]==undefined);
                    for(var i=this.medioList.length-1;i>=0;--i){
                        this.indexMap[i]=i;
                    }
                    
                    for(var i=this.medioList.length-1;i>=0;--i){
                        var ti=parseInt(Math.random()*this.medioList.length),temp=this.indexMap[0];
                        this.indexMap[0]=this.indexMap[ti];
                        this.indexMap[ti]=temp;
                    }
                break;

            }
        },
        /**
         * 设置当前的播放媒体的地址, 不影响 medioList
         * @param {String} _src 媒体的地址
         */
        setTempPlaySrc:function(_src){
            this.elements["audioTag"].src=_src;
            this.elements["audioTag"].play();
        },
        /**
         * 控件 切换当前播放列表的下标并渲染
         * @param {Number} _index 
         */
        setPlayingIndex:function(_index){
            if(this.medioList.length<=0)return;
            this.setTempPlaySrc(this.indexMap[_index]);
        },
        /**
         * 步进 mapIndex 获取 indexMap 的值
         * @param {Number} _step 前进 步数
         */
        indexMapStep:function(_step){
            var l=this.indexMap.length;
            this.mapIndex+=_step;
            if(this.mapIndex<0)this.mapIndex=l;
            if(this.mapIndex>=l)this.mapIndex=0;
            return this.mapIndex;
        },
        /**
         * 播放上一个
         */
        last:function(){
            this.setPlayingIndex(this.indexMapStep(-1));
        },
        /**
         * 播放下一个
         */
        next:function(){
            this.setPlayingIndex(this.indexMapStep(1));
        }
    });

    audioControl=new AudioControl("leftBottom_audioControl");

    audioControl.addend(leftBox);
}

EXCtrl_BluePrintXml_request.send();

