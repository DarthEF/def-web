/**
 * 获取控件
 * @param {Function} exCtrl_callBack xCtrl_callBack(Object) 控件生成完成后的回调, 会返回控件的集合作为实参
 */
function getExCtrl(exCtrl_callBack){
    getExCtrl.IndexNav;
    getExCtrl.AudioControl;
    if(!getExCtrl.i){
        var cssTag=document.createElement("link");
        cssTag.setAttribute("rel","stylesheet");
        cssTag.setAttribute("href",rltToAbs("./EXCtrl.css",getExCtrl.url));
        document.head.appendChild(cssTag);
        ++getExCtrl.i;
        var EXCtrl_BluePrintXml_request=new XMLHttpRequest();
        EXCtrl_BluePrintXml_request.open("get",rltToAbs("./EXCtrl.xml",getExCtrl.url));

        EXCtrl_BluePrintXml_request.onload=function(e){
            var BluePrintXmlList=this.response.split("<ctrl_tab/>");
            /**
             * 左侧的索引栏 
             */
            class IndexNav extends ExCtrl{
                callback(){
                    // console.log(this);
                }
            }
            IndexNav.prototype.bluePrint=DEF_VirtualElementList.xmlToVE(BluePrintXmlList[0]);
            getExCtrl.Class.IndexNav=IndexNav;

            /**
             * 音乐播放控制器;
             */
            class AudioControl extends ExCtrl{
                initialize(){
                    this.playType=0;
                    this.indexMap=[];
                    this.mapIndex=0;
                    this.playingIndex=-1;
                    this.duration=0;
                    this.paused=true;
                    if(!this.data.mediaList){
                        this.data.mediaList=[];
                    }
                    this.op = 0;
                }
                callback(){
                    if(this.data.mediaList&&this.data.mediaList.length){
                        this.setPlayingIndex(0);
                        this.data.mediaList=this.data.mediaList;
                        this.reIndexMap();
                    }
                    this.setMapIndex(0);
                }
                reRender_callback(){
                    if(this.playingIndex>=0)
                        this.elements["mediaItem-EX_for-mediaList-C"+(this.playingIndex+1)].classList.add("playing");
                }
                playTypes=[
                    "order",
                    "reverse",
                    "out-of-order"
                ]
                /**
                 * 读取媒体后 渲染轨道长度
                 * @param {Number} _index 当前播放的媒体的 index
                 */
                renderDuration(_index){
                    var audio=this.elements.audioTag,
                        index=_index==undefined?this.playingIndex:_index;
                    var mediaItem=this.data.mediaList[index];
                    if(this.playingIndex>=0){
                        this.duration=mediaItem.getDuration(audio);
                        this.op=mediaItem.op;
                    }
                    else{
                        this.duration=this.elements.audioTag;
                        this.op=0;
                    }
                    audio.currentTime=this.op;
                    if(!this.paused){
                        audio.play();
                    }
                    this.renderString();
                }
                /**
                 * 改变播放顺序的方式
                 * @param {Number} _type 0: 顺序; 1: 逆序; 2: 乱序;
                 */
                setPlayType(_type){
                    this.playType=_type%this.playTypes.length;
                    this.elements.playType.setAttribute("title",this.playTypes[this.playType]);
                    this.elements.playType.className="audioControl-button audioControl-playType iconSpritesSvg iconSpritesSvg-"+(this.playType<=1?"loop":"random")+" "+this.playTypes[this.playType];
                    this.reIndexMap();
                    return this.indexMap;
                }
                /**
                 * 新增一个媒体
                 * @param {String} _src     媒体对象
                 * @param {Number} _step    步进 用于切换当前播放的内容
                 * @returns {Number} 返回插入的目的地的下标
                 */
                addItem(media,_step){
                    var tgtIndex=(this.indexMap[this.mapIndex]==undefined?-1:this.indexMap[this.mapIndex])+1;
                    this.data.mediaList.splice(tgtIndex,0,media);
                    this.reIndexMap();
                    this.indexMap.splice(this.mapIndex+1,0,tgtIndex);
                    if(_step)this.setMapIndex(this.indexMapStep(_step));
                    this.setPlayType(this.playType);
                    if(this.playingIndex==-1){
                        this.setPlayingIndex(tgtIndex);
                        this.renderDuration()
                    }
                    this.reRender();
                    return tgtIndex;
                }
                /**
                 * 剔除一个列表项
                 * @param {Number} _index 列表项的下标
                 */
                removeItem(_index){
                    this.data.mediaList.splice(_index,1);
                    this.indexMap.splice(this.indexMap.indexOf(_index),1);
                    this.reRender();
                    this.setPlayType(this.playType);
                }
                /**
                 * 刷新 indexMap
                 * @param {Number} type 0:正向; 1逆向 2乱序
                 */
                reIndexMap(type){
                    var type=type||this.playTypes[this.playType];
                    if(this.data.mediaList.length!=this.indexMap.length){
                        this.indexMap=new Array(this.data.mediaList.length);
                    }
                    switch(type){
                        // 正向
                        case this.playTypes[0]:
                            for(var i=this.data.mediaList.length-1;i>=0;--i){
                                this.indexMap[i]=i;
                            }
                        break;
                        // 逆向
                        case this.playTypes[1]:
                            for(var i=this.data.mediaList.length-1,j=0;i>=0;--i,++j){
                                this.indexMap[i]=j;
                            }
                        break;
                        // 乱序
                        case this.playTypes[2]:
                            if(this.indexMap[1]==undefined);
                            for(var i=this.data.mediaList.length-1;i>=0;--i){
                                this.indexMap[i]=i;
                            }
                            
                            for(var i=this.data.mediaList.length-1;i>=0;--i){
                                var ti=parseInt(Math.random()*this.data.mediaList.length),temp=this.indexMap[0];
                                this.indexMap[0]=this.indexMap[ti];
                                this.indexMap[ti]=temp;
                            }
                            break;
                        }
                        this.mapIndex=this.indexMap.indexOf(this.playingIndex);
                }
                /**
                 * 设置当前的播放媒体的地址, 不影响 mediaList
                 * @param {String} _src 媒体的地址
                 */
                setTempPlaySrc(_src){
                    this.elements["audioTag"].innerHTML="<source src=\""+_src+"\"/>";
                    this.elements["audioTag"].load();
                    this.playingIndex=-2;
                }
                /**
                 * 步进 mapIndex 获取 indexMap 的值
                 * @param {Number} _step 前进 步数
                 */
                indexMapStep(_step){
                    var l=this.indexMap.length,
                    newindex=this.mapIndex+_step;
                    if(newindex<0)newindex=l-1;
                    else if(newindex>=l)newindex=0;
                    return newindex;
                }
                /**
                 * 播放上一个
                 */
                last(){
                    this.setMapIndex(this.indexMapStep(-1));
                }
                /**
                 * 播放下一个
                 */
                next(){
                    this.setMapIndex(this.indexMapStep(1));
                }
                /**
                 * 控件 切换当前播放列表的下标并渲染
                 * @param {Number} _index 
                 */
                setMapIndex(_index){
                    if(this.data.mediaList.length<=0)return;
                    this.mapIndex=_index;
                    this.setPlayingIndex(this.indexMap[_index]);
                }
                /** 
                 * 跳转到一个播放列表项
                 * @param {Number} _index 列表项的下标
                 */
                setPlayingIndex(_index){
                    if(this.data.mediaList.length<=0) return;
                    if(this.data.mediaList.length<=_index) return;
                    // this.elements["audioTag"].src=this.data.mediaList[_index].url;
                    // this.elements["audioTag"].src="";
                    var tempHTML=[],then=this;
                    if((!this.data.mediaList[this.playingIndex])||(this.data.mediaList[_index].urlList!=this.data.mediaList[this.playingIndex].urlList)){
                        for(var i=this.data.mediaList[_index].urlList.length-1;i>=0;--i){
                            tempHTML.push("<source src=\""+this.data.mediaList[_index].urlList[i]+"\"/>")
                        }
                        this.elements["audioTag"].innerHTML=tempHTML.join("");
                        this.mapIndex=this.indexMap.indexOf(_index);
                        this.elements["audioTag"].load();
                    }else{
                        this.elements.audioTag.currentTime=this.data.mediaList[_index].op;
                        this.renderDuration(_index);
                    }

                    if(this.elements["mediaItem-EX_for-mediaList-C"+(this.playingIndex+1)]){
                        this.elements["mediaItem-EX_for-mediaList-C"+(this.playingIndex+1)].className="audioControl-mediaItem";
                    }
                    this.playingIndex=parseInt(_index);
                    if(this.elements["mediaItem-EX_for-mediaList-C"+(this.playingIndex+1)]){
                        this.elements["mediaItem-EX_for-mediaList-C"+(this.playingIndex+1)].className="audioControl-mediaItem playing";
                    }
                    this.data.mediaList[this.playingIndex].mark.reCount();
                }
                /**
                 * 切换播放暂停
                 */
                playPause(){
                    var a=this.elements.audioTag,
                        b=this.elements.playPause;
                    this.paused=!this.paused;
                    if(!this.paused){
                        a.play();
                        b.classList.add("iconSpritesSvg-pause");
                        b.classList.remove("iconSpritesSvg-play");
                    }
                    else{
                        a.pause();
                        b.classList.add("iconSpritesSvg-play");
                        b.classList.remove("iconSpritesSvg-pause");
                    }
                }
                /**
                 * 打开/关闭 列表
                 */
                callList(){
                    var then=this;
                    this.data.mediaListBoxVis=!this.data.mediaListBoxVis;
                    function qCloseCallList(e){
                        var tgt=e.target;
                        var flag=true;
                        while(tgt.tagName!="HTML"){
                            if(tgt==then.elements.root){
                                flag=false;
                                break;
                            }
                            tgt=tgt.parentElement;
                        }
                        if(flag){
                            then.data.mediaListBoxVis=!then.data.mediaListBoxVis;
                            then.renderString();
                            this.removeEventListener("mousedown",qCloseCallList);
                        }
                    }
                    document.addEventListener("mousedown",qCloseCallList);
                    this.renderString();
                }
                
                /**
                 * 渲染当前位置
                 */
                currentTimeRender(){
                    var progress=parseInt(this.elements["audioTag"].currentTime/this.duration*2);
                    progress*=0.5;
                    if(this.playProgress!=progress){
                        this.playBarBtn.style.left=progress+"%";
                        this.playBarLow.style.width=progress+"%";
                        this.playProgress=progress;
                    }
                }
                /**
                 * 加载 cue 文件
                 * @param {String} url
                 */
                loadCue(url){
                    var eee,dd, d=new XMLHttpRequest();
                    var then=this;
                    d.open("get",url);
                    d.send();
                    d.onload=function(){
                        eee=loadCue(d.responseText);
                        // console.log(eee);
                        dd=cueObjToMediaObj(eee,url);
                        then.data.mediaList=then.data.mediaList.concat(dd);
                        then.reRender();
                        then.reIndexMap(then.playTypes[then.playType]);
                    }
                }

                volumeHand(e,tgt){
                    if(e.buttons){
                        var val=(Math.ceil(100-(e.layerY/tgt.offsetHeight)*100)*0.01);
                        if(val>1)       val=1;
                        else if(val<0)  val=0;
                        this.elements.audioTag.volume=val;
                    }
                }
                /**
                 * @param {Number} val volume 的值, 取值范围 0~1
                 */
                changVolume(_val){
                    var audio=this.elements.audioTag,val=_val;
                    if(val>1)       val=1;
                    else if(val<0)  val=0;
                    if(val!=audio.volume)audio.volume=val;
                    
                    if(audio.muted||audio.volume<=0){
                        this.elements.root.classList.add("ismuted");
                        this.elements.volumeBarBtn.style.top=(94-val*94)+"%";
                        this.elements.volumeBarPower.style.height="0";
                    }
                    else{
                        this.elements["root"].classList.remove("ismuted");
                        this.elements.volumeBarPower.style.height=(audio.volume*100)+"%";
                        this.elements.volumeBarBtn.style.top=(94-val*94)+"%";
                    }
                }
                wheelHand(e){
                    if(e.deltaY>0){
                        this.changVolume(this.elements.audioTag.volume-0.05);
                    }
                    else if(e.deltaY<0){
                        this.changVolume(this.elements.audioTag.volume+0.05);
                    }
                }
                /**
                 * 进度条上的控制
                 */
                currentTimeHand(e,tgt){
                    var tgtTimeP=(e.layerX-6)/(tgt.offsetWidth-12),tgtTime;
                    if(tgtTimeP>1)tgtTimeP=1;
                    else if(tgtTimeP<0)tgtTimeP=0;
                    tgtTime=this.duration*(tgtTimeP);
                    // console.log(tgtTime+","+e.layerX+","+tgt.offsetWidth)
                    this.elements.targetTimeMM.innerHTML=parseInt(tgtTime/60);
                    this.elements.targetTimeSS.innerHTML=parseInt(tgtTime%60);
                    this.elements.ctrlTimeBox.style.left=(tgtTimeP*94+3)+"%";
                    if(e.type=="mouseup"){
                        this.elements.audioTag.currentTime=this.op+tgtTime;
                    }
                }
                /**渲染 */
                renderCurrentTime(){
                    var tgtTime=this.getCurrentTime();
                    this.elements.currentTimeMM.innerHTML=parseInt(tgtTime/60);
                    this.elements.currentTimeSS.innerHTML=parseInt(tgtTime%60);
                    var tp=tgtTime/this.duration*100
                    
                    if(tp>=100){
                        this.next();
                        // this.elements.audioTag.pause();
                    }else{
                        this.elements.playBarBtn.style.left=tp+"%";
                        this.elements.playBarLow.style.width=tp+"%";
                        this.data.mediaList[this.playingIndex].mark.touchMarkByTime(this,tgtTime,3);
                    }
                }
                /**
                 * 获取当前播放进度
                 */
                getCurrentTime(){
                    return this.elements.audioTag.currentTime-this.op;
                }
                /**
                 * 修改播放进度
                 */
                setCurrentTime(val){
                    this.elements.audioTag.currentTime=val+this.op;
                }
            }
            AudioControl.prototype.bluePrint=DEF_VirtualElementList.xmlToVE(BluePrintXmlList[1]);
            getExCtrl.Class.AudioControl=AudioControl;

            /**
             * 图片轮播?
             */
            class ImgList extends ExCtrl{
                constructor(data){
                    super(data);
                    this.index=0;
                }
                /**
                 * 步进 index 
                 * @param {Number} _step 步长
                 * @returns {Number} 返回新的 index
                 */
                indexStep(_step){
                    var tgtIndex=_step+this.index;
                    return this.setIndex(tgtIndex);
                }
                /**
                 * 更改当前 index
                 * @param {Number} _index
                 */
                setIndex(_index){
                    var index=_index,
                        maxI=this.data.list.length;
                        
                    if(index>=maxI){
                        do{
                            index=index-maxI;
                        }while(index>=maxI)
                    }else if(index<0){
                        do{
                            index=maxI+index;
                        }while(index<0)
                    }
                    this.index=index;
                    this.renderString();
                    return this.index;
                }
            }
            ImgList.prototype.bluePrint=DEF_VirtualElementList.xmlToVE(BluePrintXmlList[2]);
            getExCtrl.Class.ImgList=ImgList;

            class ContentBox extends ExCtrl{
                constructor(data,typeset){
                    super(data);
                    this.index=0;
                    
                    if(typeset){
                        this.typeset=typeset;
                    }
                    else if(this.data.typeset){
                        this.typeset=this.data.typeset;
                    }
                }
                initialize(pnode,typeset){
                    if(this.typeset) return;
                    this.typeset={};
                    if(typeset){
                        this.typeset=typeset;
                    }
                    else if(this.data.typeset){
                        this.typeset=this.data.typeset;
                    }
                    else{
                        this.typeset={
                            img:[4,2]
                        }
                    }
                }
            }
            ContentBox.prototype.bluePrint=DEF_VirtualElementList.xmlToVE(BluePrintXmlList[3]);
            getExCtrl.Class.ContentBox=ContentBox;

            exCtrl_callBack(getExCtrl.Class);
        }

        EXCtrl_BluePrintXml_request.send();
    }
    else{
        exCtrl_callBack(getExCtrl.Class);
    }
}
getExCtrl.i=0;
getExCtrl.url=getCurrAbsPath();
getExCtrl.Class={};



/** 
 * 给我的 audio 控制器 用的数据对象
 */
class DEF_MediaObj{
    constructor(src,title){
        this.title="";
        this.cover=[];
        this.songwriter="";
        this.performer="";
        this.album="";

        this.op=0;
        this.ed=0;
        this.duration=0;
        this.mark=new DEF_MediaObjMarkList();

        this.urlList=[];
        if(src){
            this.title=src;
            this.urlList.push(src);
        }
        if(title){
            this.title=title;
        }
    }
    /**
     * 获取 "Artist" 编曲者 and 演唱者
     */
    getArtist(){
        return this.performer + "/" + this.songwriter;
    }
    /**
     * 克隆
     */
    clone(){
        var rtn=new DEF_MediaObj();
        Object.assign(rtn,this);
        return rtn;
    }
    copy(){
        var rtn=new DEF_MediaObj();
        var i=this.urlList.length;
        Object.assign(rtn,this);
        rtn.urlList=new Array(i);
        for(--i;i>=0;--i){
            rtn.urlList[i]=this.urlList[i];
        }
        rtn.mark=new DEF_MediaObjMarkList();
        for(i=0;i<this.mark.list;++i){
            rtn.mark.list[i]=this.mark.list[i].copy();
        }
        return rtn;
    }
}
/**
 * 获取当前轨道的长度
 * @param {Audio} audio 当前正在播放这个文件的 Audio 元素
 * @param {Function} _callback _callback({Number}Duration) 某些情况无法直接获取当前的长度，所以需要传入回调函数接收值
 * 3个重载 fnc(audio) 和 fnc(callback); 用 audio 的重载可以返回长度, 可以不用 callback
 */
DEF_MediaObj.prototype.getDuration=createOlFnc();
DEF_MediaObj.prototype.getDuration.addOverload([Function],
    function(_callback){
        var then=this;
        if(!this.ed){
            var tempAudio=new Audio(),tempHTML=[];
            for(var i=this.urlList.length;i>=0;--i){
                tempHTML.push("<source src=\""+this.urlList[i]+"\"/>");
            }
            tempAudio.innerHTML=tempHTML;
            if(!this.op){
                tempAudio.abort=function(e){
                    var d=this.duration;
                    _callBack(d);
                }
            }else{
                tempAudio.abort=function(e){
                    var d=this.duration-then.op;
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
);
DEF_MediaObj.prototype.getDuration.addOverload([Audio],
    function(audio){
        if(!this.ed){
            var d;
            if(!this.op){
                d=audio.duration;
            }else{
                d=audio.duration-this.op;
            }
        }else{
            var d=this.ed-this.op;
        }
        return d;
    }
);
DEF_MediaObj.prototype.getDuration.addOverload([Audio,Function],
    function(audio,_callback){
        var d=this.getDuration(audio);
        _callback(d);
        return d;
    }
);
/**
 * 给媒体做标记的列表 因为浏览器的 updata 事件触发 大概每秒触发四次，所以会有误差
 */
class DEF_MediaObjMarkList{
    /**
     * DEF_MediaObjMark 的列表
     * @param {Array<DEF_MediaObjMark>} DEF_MediaObjMarkArray DEF_MediaObjMark 的数组
     */
    constructor(DEF_MediaObjMarkArray){
        this.list=DEF_MediaObjMarkArray||[];
    }
    /**
     * 重置所有计数器
     */
    reCount(){
        for(var i=this.list.length-1;i>=0;--i){
            this.list[i].reCount();
        }
    }
    /**
     * 根据时刻触发标记, 如果有两个会被触发 将会触发靠后的
     * @param {Exctrl} mediaCtrl 媒体控件
     * @param {Number} time 时刻
     * @param {Number} afterTolerance 向后容差 在容差内的时刻也会触发
     */
    touchMarkByTime(mediaCtrl,time,afterTolerance){
        for(var i=this.list.length-1;i>=0;--i){
            if((this.list[i].time<=time)&&(this.list[i].time+afterTolerance>=time)){
                if(this.list[i].touch(mediaCtrl))return;
            }
        }
    }
}
/**
 * 给 DEF_MediaObj 的时间轴 做标记
 * @param {String} command 遭遇标记指令的
 * @param {Number} time 时刻
 * @param {Number} maxTouch 最大触发次数
 */
class DEF_MediaObjMark{
    /**
     * @param {String} command 遭遇标记指令的
     * @param {Number} time 时刻
     * @param {Number} maxTouch 最大触发次数
     */
    constructor(command,time,maxTouch){
        this.command=command;
        this.time=time||0;
        this.maxTouch=maxTouch||1;
        this.count=this.maxTouch;
    }
    copy(){
        var rtn=new DEF_MediaObjMark();
        Object.assign(rtn,this);
        return rtn;
    }
    /**
     * 重置计数器
     */
    reCount(){
        this.count=this.maxTouch;
    }
    /**
     * 触发标记
     * @param {ExCtrl} audioCtrl
     */
    touch(mediaCtrl){
        if(!this.count)return false;
        var action=this.commandList[this.command.split(' ')[0]];
        if(action instanceof Function)action.call(this,mediaCtrl);
        --this.count;
    }
    commandList={
        go(mediaCtrl){
            var tgtTime=parseFloat(this.command.split(' ')[1]);
            mediaCtrl.setCurrentTime(tgtTime);
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
    selectImg(_url.slice(0,_url.lastIndexOf('/')+1),["cover","front"],[".jpg",".jpeg",".png",".gif"],
    function(imgList){
        if(imgList.length>0){
            cover.push(...imgList);
        }else{
            var afterL=urlList[0].length,
                after=urlList[0][afterL-3]+urlList[0][afterL-2]+urlList[0][afterL-1];
            if(after=="mp3"){
                ID3.loadTags(urlList[0],function(){
                    var tags = ID3.getAllTags(urlList[0]);
                    var image = tags.picture;
                    if (image) {
                        var base64String = "";
                        for (var i = 0; i < image.data.length; i++) {
                            base64String += String.fromCharCode(image.data[i]);
                        }
                        var base64 = "data:" + image.format + ";base64," +
                                window.btoa(base64String);
                        cover.push(base64);
                    }
                },
                {tags: ["title","artist","album","picture"]});
            }
        }
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