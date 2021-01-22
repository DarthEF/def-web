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
            this.mediaList=[];
            this.playType=0;
            this.indexMap=[];
            this.mapIndex=0;
            this.playingIndex=0;
            this.duration=0;

            this.p_OP = 0;
            this.p_ED = 0;
        },
        /**
         * 控件 初始化完成的回调函数
         */
        callback:function(){
            var that=this;
            var mes=this.elements;
            if(this.data.mediaList&&this.data.mediaList.length){
                this.setPlayingIndex(0);
                this.mediaList=this.data.mediaList;
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
         * @param {String} _src     媒体对象
         * @param {Number} _step    步进 用于切换当前播放的内容
         * @returns {Number} 返回插入的目的地的下标
         */
        addItem:function(media,_step){
            var tgtIndex=(this.indexMap[this.mapIndex]==undefined?-1:this.indexMap[this.mapIndex])+1;
            this.mediaList.splice(tgtIndex,0,_src);
            for(var i=this.indexMap.length-1;i>=0;--i){
                if(this.indexMap[i]>=tgtIndex){
                    this.indexMap[i]+=1;
                }
            }
            this.indexMap.splice(this.mapIndex+1,0,tgtIndex);
            if(_step)this.setMapIndex(this.indexMapStep(_step));
            this.setPlayType(this.playType);
            return tgtIndex;
        },
        /**
         * 剔除一个列表项
         * @param {Number} _index 列表项的下标
         */
        removeItem:function(_index){
            this.mediaList.splice(_index,1);
            this.indexMap.splice(this.indexMap.indexOf(_index),1);
            var elementkeys=Object.keys(this.elements);
            this.reRender();
            this.setPlayType(this.playType);
            
            if(this.playingIndex>_index){
                this.elements["mediaItem-EX_for-mediaList-C"+(this.playingIndex)].classList.add("playing");
                this.playingIndex-=1;
            }
            else if(this.playingIndex<_index){
                this.elements["mediaItem-EX_for-mediaList-C"+(this.playingIndex+1)].classList.add("playing");
            }
        },
        /**
         * 刷新 indexMap
         * @param {Number} type 0:正向; 1逆向 2乱序
         */
        reIndexMap:function(type){
            if(this.mediaList.length!=this.indexMap.length){
                this.indexMap=new Array(this.mediaList.length);
            }
            switch(type){
                // 正向
                case this.playTypes[0]:
                    for(var i=this.mediaList.length-1;i>=0;--i){
                        this.indexMap[i]=i;
                    }
                break;
                // 逆向
                case this.playTypes[1]:
                    for(var i=this.mediaList.length-1,j=0;i>=0;--i,++j){
                        this.indexMap[i]=j;
                    }
                break;
                // 乱序
                case this.playTypes[2]:
                    if(this.indexMap[1]==undefined);
                    for(var i=this.mediaList.length-1;i>=0;--i){
                        this.indexMap[i]=i;
                    }
                    
                    for(var i=this.mediaList.length-1;i>=0;--i){
                        var ti=parseInt(Math.random()*this.mediaList.length),temp=this.indexMap[0];
                        this.indexMap[0]=this.indexMap[ti];
                        this.indexMap[ti]=temp;
                    }
                    break;
                    
                }
                this.mapIndex=this.indexMap.indexOf(this.playingIndex);
        },
        /**
         * 设置当前的播放媒体的地址, 不影响 mediaList
         * @param {String} _src 媒体的地址
         */
        setTempPlaySrc:function(_src){
            var temp=this.elements["audioTag"].paused,then=this;
            // this.elements["audioTag"].src="";
            this.elements["audioTag"].innerHTML="<source src=\""+_src+"\"/>";
            function setDuration(e){
                then.duration=this.duration;
                console.log(this.duration);
                this.removeEventListener("canplay",setDuration);
                if(!temp)this.play();
            }
            this.elements["audioTag"].load();
            if(!temp)this.play();
            this.elements["audioTag"].addEventListener("load",setDuration);
        },
        /**
         * 控件 切换当前播放列表的下标并渲染
         * @param {Number} _index 
         */
        setMapIndex:function(_index){
            if(this.mediaList.length<=0)return;
            this.mapIndex=_index;
            this.setPlayingIndex(this.indexMap[_index]);

        },
        /** 
         * 跳转到一个播放列表项
         * @param {Number} _index 列表项的下标
         */
        setPlayingIndex:function(_index){
            if(this.mediaList.length<=0)return;
            
            // this.elements["audioTag"].src=this.mediaList[_index].url;
            // this.elements["audioTag"].src="";
            var tempHTML=[],temp=this.elements["audioTag"].paused;
            if(this.mediaList[_index].urlList!=this.mediaList[this.playingIndex].urlList){
                for(var i=this.mediaList[_index].urlList.length-1;i>=0;--i){
                    tempHTML.push("<source src=\""+this.mediaList[_index].urlList[i]+"\"/>")
                }

                this.elements["audioTag"].innerHTML=tempHTML.join("");
                this.elements["audioTag"].addEventListener("load",function(){console.log("1")});
                this.elements["audioTag"].load();
                if(!temp)this.elements["audioTag"].play();
                this.mapIndex=this.indexMap.indexOf(_index);
            }

            if(this.elements["mediaItem-EX_for-mediaList-C"+(this.playingIndex+1)]){
                this.elements["mediaItem-EX_for-mediaList-C"+(this.playingIndex+1)].className="audioControl-mediaItem";
            }
            this.playingIndex=parseInt(_index);
            this.elements["mediaItem-EX_for-mediaList-C"+(this.playingIndex+1)].className="audioControl-mediaItem playing";
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
            this.mediaListBoxVis=!this.mediaListBoxVis;
            // console.log(this.mediaListBoxVis,this.elements["mediaListBox"])
            this.renderString();
        },
        
        /**
         * 渲染当前位置
         */
        currentTimeRender:function(){
            var progress=parseInt(this.elements["audioTag"].currentTime/this.duration*2);
            progress*=0.5;
            if(this.playProgress!=progress){
                this.playBarBtn.style.left=progress+"%";
                this.playBarLow.style.width=progress+"%";
                this.playProgress=progress;
            }
        },
        /** 
         * 渲染音量大小 onvolumechange
         */
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
        mediaList:[
            {
                title:"Blue sky",
                urlList:[
                    rltToAbs("../../media/audio/Blue sky.ogg",thisjsUrl)
                ]
            },
            {
                title:"dededon",
                urlList:[
                    rltToAbs("../../media/video/dededon.mp4",thisjsUrl)
                ]
            },
            {
                title:"大势至菩萨心咒",
                urlList:[
                    rltToAbs("../../media/audio/般禅梵唱妙音组 - 大势至菩萨心咒.mp3",thisjsUrl)
                ]
            },
            {
                title:"银影侠ost",
                urlList:[
                    rltToAbs("../../media/audio/银影侠ost.mp3",thisjsUrl)
                ]
            },
            {
                title:"REDLINE Title.flac",
                urlList:[
                    rltToAbs("../../media/audio/03 - REDLINE Title.flac",thisjsUrl)
                ]
            }
        ]
    }
    audioControl.addend(leftBox);
}

EXCtrl_BluePrintXml_request.send();

/** 
 * 给我的 audio 控制器 用的数据对象
 */
class DEF_MediaObj{
    constructor(){
        this.title="";
        this.cover=[];
        this.songwriter="";
        this.performer="";
        this.album="";

        this.op=0;
        this.ed=0;
        this.mark=[];
        this.duration=0;

        this.urlList=[];
    }
    /**
     * 获取 "Artist" 编曲者 and 演唱者
     */
    getArtist(){
        return this.performer + "/" + this.songwriter;
    }
    /**
     * 获取当前轨道的长度
     * @param {Function} _callback _callback({Number}Duration) 某些情况无法直接知道当前的长度，所以需要传入回调函数接收值
     */
    getDuration(_callback){
        if(!this.ed){
            var tempAudio=new Audio(),tempHTML=[];
            for(var i=this.urlList.length;i>=0;--i){
                tempHTML.push("<source src=\""+this.urlList[i]+"\"/>");
            }
            tempAudio.innerHTML=tempHTML;
            if(!this.op){
                tempAudio.onload=function(e){
                    var d=this.duration;
                    _callBack(d);
                }
            }else{
                tempAudio.onload=function(e){
                    var d=this.duration-this.op;
                    _callBack(d);
                }
            }
            tempAudio.load();
        }else{
            var d=this.ed-this.op;
            _callback(d);
            return d;
        }
    }
}

/**
 * @param {DEF_CUEOBJ} _cueobj
 * @param {String} _url 为了找到轨道文件, 需要提供 cue 的路径
 * @return {Array<DEF_MediaObj>} 返回 DEF_MediaObj 数组
 */
function cueObjToMediaObj(_cueobj,_url){
    var rtn=[],urlList=[rltToAbs(_cueobj.file,_url)];
    var tempObj;
    var cover=[];
    selectImg(_url,["cover","front"],[".jpg",".jpeg",".png",".gif"],function(imgList){
        cover.push(...imgList);
    });
    for(var i=0;i<_cueobj.track.length;++i){
        tempObj=new DEF_MediaObj();
        tempObj.urlList=urlList;
        tempObj.title=_cueobj.track[i].title;
        tempObj.album=_cueobj.title;
        tempObj.songwriter=_cueobj.track[i].songwriter||_cueobj.songwriter;
        tempObj.performer=_cueobj.track[i].performer||_cueobj.performer;
        tempObj.cover=cover;
        tempObj.op=_cueobj.track[i].op;
        tempObj.ed=_cueobj.track[i].ed;

        rtn.push(tempObj);
    }
    return rtn;
}

// var eee,dd, d=new XMLHttpRequest();
// d.open("get","./media/audio/pft.cue");
// d.send();
// d.onload=function(){
//     eee=loadCue(d.responseText);
//     console.log(eee);
//     dd=cueObjToMediaObj(eee,"./media/audio/pft.cue");
// }


// todo: 音量控制; 进度条(当前播放时刻)控制; cue_obj to DEF_MediaObj
