/**
 * 获取控件
 * @param {Function} exCtrl_callBack xCtrl_callBack(Object) 控件生成完成后的回调, 会返回控件的集合作为实参
 */
function getExCtrl(exCtrl_callBack){
    getExCtrl.IndexNav;
    getExCtrl.AudioControl;
    if(!getExCtrl.i){
        ++getExCtrl.i;
        var EXCtrl_BluePrintXml_request=new XMLHttpRequest();
        EXCtrl_BluePrintXml_request.open("get",rltToAbs("./EXCtrl.xml"));

        EXCtrl_BluePrintXml_request.onload=function(e){
            var BluePrintXmlList=this.response.split("<ctrl_tab/>");
            /**
             * 左侧的索引栏 
             */
            getExCtrl.IndexNav=xmlToCtrl(BluePrintXmlList[0],{
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
            getExCtrl.AudioControl=xmlToCtrl(BluePrintXmlList[1],{
                initialize:function(){
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
                },
                callback:function(){
                    if(this.data.mediaList&&this.data.mediaList.length){
                        this.setPlayingIndex(0);
                        this.data.mediaList=this.data.mediaList;
                        this.reIndexMap();
                    }
                    this.setMapIndex(0);
                },
                reRender_callback:function(){
                    if(this.playingIndex>=0)
                        this.elements["mediaItem-EX_for-mediaList-C"+(this.playingIndex+1)].classList.add("playing");
                },
                playTypes:[
                    "order",
                    "reverse",
                    "out-of-order"
                ],
                /**
                 * 读取媒体后 渲染轨道长度
                 * @param {Number} _index 当前播放的媒体的 index
                 */
                renderDuration:function(_index){
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
                },
                /**
                 * 改变播放顺序的方式
                 * @param {Number} _type 0: 顺序; 1: 逆序; 2: 乱序;
                 */
                setPlayType:function(_type){
                    this.playType=_type%this.playTypes.length;
                    this.elements.playType.setAttribute("title",this.playTypes[this.playType]);
                    this.elements.playType.className="audioControl-button audioControl-playType "+this.playTypes[this.playType];
                    this.reIndexMap();
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
                },
                /**
                 * 剔除一个列表项
                 * @param {Number} _index 列表项的下标
                 */
                removeItem:function(_index){
                    this.data.mediaList.splice(_index,1);
                    this.indexMap.splice(this.indexMap.indexOf(_index),1);
                    this.reRender();
                    this.setPlayType(this.playType);
                },
                /**
                 * 刷新 indexMap
                 * @param {Number} type 0:正向; 1逆向 2乱序
                 */
                reIndexMap:function(type){
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
                },
                /**
                 * 设置当前的播放媒体的地址, 不影响 mediaList
                 * @param {String} _src 媒体的地址
                 */
                setTempPlaySrc:function(_src){
                    this.elements["audioTag"].innerHTML="<source src=\""+_src+"\"/>";
                    this.elements["audioTag"].load();
                    this.playingIndex=-2;
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
                 * 控件 切换当前播放列表的下标并渲染
                 * @param {Number} _index 
                 */
                setMapIndex:function(_index){
                    if(this.data.mediaList.length<=0)return;
                    this.mapIndex=_index;
                    this.setPlayingIndex(this.indexMap[_index]);
                },
                /** 
                 * 跳转到一个播放列表项
                 * @param {Number} _index 列表项的下标
                 */
                setPlayingIndex:function(_index){
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
                },
                /**
                 * 切换播放暂停
                 */
                playPause:function(){
                    var a=this.elements.audioTag,
                        b=this.elements.playPause;
                    this.paused=!this.paused;
                    if(!this.paused){
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
                    this.data.mediaListBoxVis=!this.data.mediaListBoxVis;
                    // console.log(this.data.mediaListBoxVis,this.elements["mediaListBox"])
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
                 * 加载 cue 文件
                 * @param {String} url
                 */
                loadCue:function(url){
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
                },

                volumeHand:function(e,tgt){
                    if(e.buttons){
                        var val=(Math.ceil(100-(e.layerY/tgt.offsetHeight)*100)*0.01);
                        if(val>1)       val=1;
                        else if(val<0)  val=0;
                        this.elements.audioTag.volume=val;
                    }
                },
                /**
                 * @param {Number} val volume 的值, 取值范围 0~1
                 */
                changVolume:function(_val){
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
                },
                wheelHand:function(e){
                    if(e.deltaY>0){
                        this.changVolume(this.elements.audioTag.volume-0.05);
                    }
                    else if(e.deltaY<0){
                        this.changVolume(this.elements.audioTag.volume+0.05);
                    }
                },
                /**
                 * 进度条上的控制
                 */
                currentTimeHand:function(e,tgt){
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
                },
                /**渲染 */
                renderCurrentTime:function(){
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
                    }
                },
                /**
                 * 获取当前播放进度
                 */
                getCurrentTime:function(){
                    return this.elements.audioTag.currentTime-this.op;
                },
                /**
                 * 修改播放进度
                 */
                setCurrentTime:function(val){
                    this.elements.audioTag.currentTime=val+this.op;
                }
            });
            exCtrl_callBack({IndexNav:getExCtrl.IndexNav,AudioControl:getExCtrl.AudioControl});
        }

        EXCtrl_BluePrintXml_request.send();
    }
    else{
        exCtrl_callBack({IndexNav:getExCtrl.IndexNav,AudioControl:getExCtrl.AudioControl});
    }
}
getExCtrl.i=0;
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
        this.mark=[];
        this.duration=0;

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
}
/**
 * 获取当前轨道的长度
 * @param {Audio} audio 当前正在播放这个文件的 Audio 元素
 * @param {Function} _callback _callback({Number}Duration) 某些情况无法直接获取当前的长度，所以需要传入回调函数接收值
 * 2个重载 fnc(audio) 和 fnc(callback); 用 audio 的重载可以返回长度, 可以不用 callback
 */
DEF_MediaObj.prototype.getDuration=createOlFnc();
DEF_MediaObj.prototype.getDuration.addOverload(
    [Function],
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
DEF_MediaObj.prototype.getDuration.addOverload(
    [Audio],
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
DEF_MediaObj.prototype.getDuration.addOverload(
    [Audio,Function],
    function(audio,_callback){
        var d=this.getDuration(audio);
        _callback(d);
        return d;
    }
);
/**
 * 
 */
class DEF_MediaObjMack{
    constructor(command,time,maxTouch){
        this.command=command;
        this.time=time;
        this.maxTouch=maxTouch;
    }
    ontouch(){
        // var commandClip=
    }
    commandList={
        go:function(){

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