var IndexNav,AudioControl;
var thisjsUrl=getCurrAbsPath();
var indexnav;

var leftBox=document.getElementById("Left");

var audioControl;

var EXCtrl_BluePrintXml_request=new XMLHttpRequest();
EXCtrl_BluePrintXml_request.open("get",rltToAbs("./EXCtrl.xml"));

EXCtrl_BluePrintXml_request.onload=function(e){
    var BluePrintXmlList=this.response.split("<ctrl_tab/>");
    /**
     * 左侧的索引栏 
     */
    IndexNav=xmlToCtrl(BluePrintXmlList[0],{
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

    /**
     * 左侧的音乐播放控制器;
     */
    AudioControl=xmlToCtrl(BluePrintXmlList[1],{
        /**
         * 控件 初始化函数
         */
        initialize:function(){
            this.medioList=[];
            this.playType=0;
            this.indexMap=[];
            this.mapIndex=0;
            this.playingIndex=0;

            this.p_OP = 0;
            this.p_ED = 0;
        },
        /**
         * 控件 初始化完成的回调函数
         */
        callback:function(){
            var that=this;
            var mes=this.elements;
            if(this.data.medioList&&this.data.medioList.length){
                mes.audioTag.src=this.data.medioList[0].url;
                this.medioList=this.data.medioList;
                this.reIndexMap(this.playTypes[this.playType]);
            }
            this.setMapIndex(0);
        },
        playTypes:[
            "order",
            "reverse",
            "out-of-order"
        ],
        /**
         * 改变播放顺序的方式
         * @param {Number} _type 0: 顺序; 1: 逆序; 2: 乱序;
         */
        setPlayType:function(_type){
            this.playType=_type%this.playTypes.length;
            this.elements.playType.setAttribute("title",this.playTypes[this.playType]);
            this.elements.playType.className="audioControl-button audioControl-playType "+this.playTypes[this.playType];
            this.reIndexMap(this.playTypes[this.playType]);
            return this.indexMap;
        },
        /**
         * 新增一个媒体
         * @param {String} _src     媒体地址
         * @param {Number} _step    步进 用于切换当前播放的内容
         * @returns {Number} 返回插入的目的地的下标
         */
        addItem:function(_src,_step){
            var tgtIndex=(this.indexMap[this.mapIndex]==undefined?-1:this.indexMap[this.mapIndex])+1;
            this.medioList.splice(tgtIndex,0,_src);
            for(var i=this.indexMap.length-1;i>=0;--i){
                if(this.indexMap[i]>=tgtIndex){
                    this.indexMap[i]+=1;
                }
            }
            this.indexMap.splice(this.mapIndex+1,0,tgtIndex);
            if(_step)this.setMapIndex(this.indexMapStep(_step));
            return tgtIndex;
        },
        /**
         * 剔除一个列表项
         * @param {Number} _index 列表项的下标
         */
        removeItem:function(_index){
            this.medioList.splice(_index,1);
            this.indexMap.splice(this.indexMap.indexOf(_index),1);
            this.medioList.splice(_index,1);
            var elementkeys=Object.keys(this.elements);
            for(var i=elementkeys.length-1;i>=0;--i){
                if(elementkeys[i].indexOf("EX_for-medioList-C"+(_index+1))!=-1){
                    // 删除元素
                    this.elements[elementkeys[i]].remove();
                    delete this.elements[elementkeys[i]];
                }
            }
        },
        /**
         * 刷新 indexMap
         * @param {Number} type 0:正向; 1逆向 2乱序
         */
        reIndexMap:function(type){
            if(this.medioList.length!=this.indexMap.length){
                this.indexMap=new Array(this.medioList.length);
            }
            switch(type){
                // 正向
                case this.playTypes[0]:
                    for(var i=this.medioList.length-1;i>=0;--i){
                        this.indexMap[i]=i;
                    }
                break;
                // 逆向
                case this.playTypes[1]:
                    for(var i=this.medioList.length-1,j=0;i>=0;--i,++j){
                        this.indexMap[i]=j;
                    }
                break;
                // 乱序
                case this.playTypes[2]:
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
                this.mapIndex=this.indexMap.indexOf(this.playingIndex);
        },
        /**
         * 设置当前的播放媒体的地址, 不影响 medioList
         * @param {String} _src 媒体的地址
         */
        setTempPlaySrc:function(_src){
            var temp=this.elements["audioTag"].paused;
            this.elements["audioTag"].src=_src;
            if(!temp)this.elements["audioTag"].play();
        },
        /**
         * 控件 切换当前播放列表的下标并渲染
         * @param {Number} _index 
         */
        setMapIndex:function(_index){
            if(this.medioList.length<=0)return;
            this.mapIndex=_index;
            this.setPlayingIndex(this.indexMap[_index]);

        },
        /** 
         * 跳转到一个播放列表项
         * @param {Number} _index 列表项的下标
         */
        setPlayingIndex:function(_index){
            if(this.medioList.length<=0)return;
            this.elements["medioItem-EX_for-medioList-C"+(this.playingIndex+1)].className="audioControl-medioItem";
            this.playingIndex=parseInt(_index);
            this.elements["medioItem-EX_for-medioList-C"+(this.playingIndex+1)].className="audioControl-medioItem playing";
            this.setTempPlaySrc(this.medioList[_index].url);
            this.mapIndex=this.indexMap.indexOf(_index);
        },
        /**
         * 步进 mapIndex 获取 indexMap 的值
         * @param {Number} _step 前进 步数
         */
        indexMapStep:function(_step){
            var l=this.indexMap.length,
            newindex=this.mapIndex+_step;
            if(newindex<0)newindex=l-1;
            else if(newindex>=l)newindex=0;
            return newindex;
        },
        /**
         * 播放上一个
         */
        last:function(){
            this.setMapIndex(this.indexMapStep(-1));
        },
        /**
         * 播放下一个
         */
        next:function(){
            this.setMapIndex(this.indexMapStep(1));
        },
        /**
         * 切换播放暂停
         */
        playPause:function(){
            var a=this.elements.audioTag,
                b=this.elements.playPause;

            if(a.paused){
                a.play();
                b.classList.add("pause");
                b.classList.remove("play");
            }
            else{
                a.pause();
                b.classList.add("play");
                b.classList.remove("pause");
            }
        },
        /**
         * 打开/关闭 列表
         */
        callList:function(){
            this.medioListBoxVis=!this.medioListBoxVis;
            // console.log(this.medioListBoxVis,this.elements["medioListBox"])
            this.renderString();
        },
        currentTimeRender:function(){

        },
        // 渲染音量大小 onvolumechange
        volumeRender:function(){
            var audio=this.elements.audioTag;
            var volume=audio.volume;
            if(audio.muted||audio.volume<=0){
                this.elements.root.classList.add("ismuted");
                this.elements.volumeBarBtn.style.bottom="0";
                this.elements.volumeBarPower.style.height="0";
            }
            else{
                this.elements["root"].classList.remove("ismuted");
                this.elements.volumeBarBtn.style.bottom=(volume*100)+"%";
                this.elements.volumeBarPower.style.height=(volume*100)+"%";
            }
        }
    });

    // var indexnav;
    indexnav=new IndexNav("leftIndex");
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

    audioControl=new AudioControl("leftBottom_audioControl");
    // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs
    audioControl.data={
        medioList:[
            {
                title:"Blue sky",
                url:rltToAbs("../../medio/audio/Blue sky.ogg",thisjsUrl)
            },
            {
                title:"dededon",
                url:rltToAbs("../../medio/video/dededon.mp4",thisjsUrl)
            },
            {
                title:"大势至菩萨心咒",
                url:rltToAbs("../../medio/audio/般禅梵唱妙音组 - 大势至菩萨心咒.mp3",thisjsUrl)
            },
            {
                title:"银影侠ost",
                url:rltToAbs("../../medio/audio/银影侠ost.mp3",thisjsUrl)
            },
            {
                title:"REDLINE Title.flac",
                url:rltToAbs("../../medio/audio/03 - REDLINE Title.flac",thisjsUrl)
            }
        ]
    }
    audioControl.addend(leftBox);
}

EXCtrl_BluePrintXml_request.send();

