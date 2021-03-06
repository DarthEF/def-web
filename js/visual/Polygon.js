/*!
 *  Polygon.js 
 *  这个文件依赖于 Vector2.js 和 Matrix2x2_mod.js
 *  用途主要是在 html canvas 
 */


/** 多边形
 * @param {Array<Vector2>} nodes 装着顶点的数组
 */
class Polygon{
    constructor(nodes){
        // 存放 Vector2 的列表 
        this.nodes=[];

        this.transformMatrix=new Matrix2x2T();

        this.min    =new Vector2();
        this.max    =new Vector2();

        if(nodes&&nodes.constructor==Array){
            this.pushNodes(nodes);
        }
    }
    copy(){
        var ret=new Polygon();
        if(this&&this.nodes){
            ret.nodes=[];
            ret.min=Vector2.prototype.copy.call(this.min);
            ret.max=Vector2.prototype.copy.call(this.max);
            ret.transformMatrix=Matrix2x2T.prototype.copy.call(this.transformMatrix);
            var l=this.nodes.length,i=0;
            for(;i<l;++i){
                ret.pushNode(this.nodes[i]);
            }
        }

        return ret;
    }
    /**
     * 刷新 最大xy 最小xy
     */
    reMinMax(){
        if(!this.nodes.length)return;
        this.max.x=this.nodes[0].x;
        this.max.y=this.nodes[0].y;
        this.min.x=this.nodes[0].x;
        this.min.y=this.nodes[0].y;
        for(var i=this.nodes.length-1;i>=0;--i){
                 if(this.nodes[i].x>this.max.x)this.max.x=this.nodes[i].x;
            else if(this.nodes[i].x<this.min.x)this.min.x=this.nodes[i].x;
                 if(this.nodes[i].y>this.max.y)this.max.y=this.nodes[i].y;
            else if(this.nodes[i].y<this.min.y)this.min.y=this.nodes[i].y;
        }
    }
    
    /**追加顶点
     * @param {Vector2} v       要追加的顶点
     */
    pushNode(v){
        this.nodes.push(Vector2.prototype.copy.call(v));
        if(this.nodes.length>1){
            if(v.x>this.max.x){
                this.max.x=v.x;
            }
            else if(v.x<this.min.x){
                this.min.x=v.x;
            }
            if(v.y>this.max.y){
                this.max.y=v.y;
            }
            else if(v.y<this.min.y){
                this.min.y=v.y;
            }
        }
        else{
            this.reMinMax();
        }
    }
    /**
     * 加入一组数组
     * @param {Array <Vector2>} nodes 装着顶点的数组
     */
    pushNodes(nodes){
        for(var i=0;i<nodes.length;++i){
            this.pushNode(nodes[i]);
        }
    }
    /**插入顶点
     * @param {Number} index    要插入的顶点的下标
     * @param {Vector2} v       要插入的顶点
     */
    insert(index,v){
        this.nodes.splice(index,0,v);
        if(this.nodes.length>1){
                 if(v.x>this.max.x)this.max.x=v.x;
            else if(v.y<this.min.x)this.min.x=v.x;
                 if(v.y>this.max.y)this.max.y=v.y;
            else if(v.y<this.min.y)this.min.y=v.y;
        }else{
            this.reMinMax();
        }
    }
    /**移除顶点
     * @param {Number} index 要删除的顶点的下标
     */
    remove(index){
        var tflag;
        if(
            this.nodes[index].x==this.max.x||this.nodes[index].y==this.min.x||
            this.nodes[index].x==this.max.y||this.nodes[index].y==this.min.y
            ){
                tflag=1;
            }
        this.nodes.splice(index,1);
        if(tflag)this.reMinMax();
    }
    /**移除所有顶点 */
    removeAll(){
        this.nodes=[];
    }
    /** 闭合路径 */
    seal(){
        if(!this.isClosed()){
            this.nodes.push(this.nodes[0].copy());
        }
    }
    /** 是否密封 */
    isClosed(){
        var l=this.nodes.length-1;
        return this.nodes[0].x==this.nodes[l].x&&this.nodes[0].y==this.nodes[l].y;
    }
    /**
     * 使用局部坐标系判断某点是否在内部, 
     * 也可以使用向量作为实参
     * @param {Number} x 局部坐标系中的坐标
     * @param {Number} y 局部坐标系中的坐标
     */
    isInside(x,y){
        // 如果图形不是密封的, 直接返回否
        if(!this.isClosed()) return false;

        var i,j,rtn=false,temp=0,tempK;
        i=this.nodes.length-1;
        if(this.nodes[i].x==x&&this.nodes[i].y==y) return true;
        for(;i>0;--i){
            j=i-1;
            if(this.nodes[i].x==x&&this.nodes[i].y==y) return true;//如果正好在顶点上直接算在内部
            else if((this.nodes[i].y>=y)!=(this.nodes[j].y>=y)){
                // 点的 y 坐标 在范围内
                tempK=((temp=this.nodes[j].y-this.nodes[i].y)?
                        (((this.nodes[j].x-this.nodes[i].x)*(y-this.nodes[i].y))/(temp)+this.nodes[i].x):
                        (this.nodes[i].x)
                    );
                if(x==tempK){
                    // 斜率相等, 点在边线上 直接算内部
                    return true;
                }
                else if(x>tempK){
                    // 射线穿过
                    rtn=!rtn;
                }
            }
        }
        return rtn;
    }
    /**
     * 平移
     * @param {Vector2} v
     */
    translate(v){
        var i;
        for(i=this.nodes.length-1;i>=0;--i){
            this.nodes[i].x+=v.x;
            this.nodes[i].y+=v.y;
        }
        this.min.x+=v.x;
        this.min.y+=v.y;
    }
    /** 
     * 创建矩形
     */
    static rect(x,y,width,height){
        var ret=new Polygon();
        ret.pushNode(new Vector2(x,y));
        ret.pushNode(new Vector2(x+width,y));
        ret.pushNode(new Vector2(x+width,y+height));
        ret.pushNode(new Vector2(x,y+height));
        ret.seal();
        return ret;
    }
    /**
     * 把弧形转换成多边形, 如果弧度的 绝对值 大于 2π 将作为圆形而不是弧形
     * @param {Number} r                半径
     * @param {Number} _accuracy         精度 最小为3, 表示弧形由个顶点构成
     * @param {Number} startAngle       开始的弧度(rad)
     * @param {Number} endAngle         结束的弧度(rad)
     * @param {Boolean} anticlockwise   逆时针或顺时针
     */
    static arc(r,_startAngle,_endAngle,_accuracy,anticlockwise){
        var rtn=new Polygon();
        var accuracy=_accuracy>=3?_accuracy:3,
            startAngle,endAngle,cyclesflag,
            stepLong,
            cycles=Math.PI*2,
            i,tempAngle;
        if(anticlockwise){
            // 逆时针
            startAngle=_endAngle;
            endAngle=_startAngle;
        }
        else{
            // 顺时针
            startAngle=_startAngle;
            endAngle=_endAngle;
        }
        if(endAngle-startAngle>=cycles||endAngle-startAngle<=-1*cycles){
            // 如果弧度 绝对值 大于 2π 将作为圆形而不是弧形
            stepLong=cycles/accuracy;
            cyclesflag=true;
        }
        else{
            stepLong=(endAngle-startAngle)/(accuracy-1);
        }
        for(i=accuracy-1;i>=0;--i){
            tempAngle=endAngle-i*stepLong;
            rtn.pushNode(new Vector2(Math.cos(tempAngle)*r,Math.sin(tempAngle)*r));
        }
        if(cyclesflag){
            rtn.seal();
        }
        return rtn;
    }
    
    /** 判断两条线段是否相交, 仅供 getImpactCount 使用 相撞时有两种结果
     * @param {Vector2} l1op    线段1的起点
     * @param {Vector2} l1ed    线段1的终点
     * @param {Vector2} l2op    线段2的起点
     * @param {Vector2} l2ed    线段2的终点
     * @return {Number} 返回 1 表示相交; 0 表示没有相交; -1 表示 l1 终点在 l2 上, 或者 l2 起点在 l1 上; 2 表示 l2 终点在 l1 上, 或者 l1 起点在 l2 上; 
     */
    static getIntersectFlag(l1op,l1ed,l2op,l2ed){
        var temp1=Vector2.dif(l1ed,l1op),
            t1o=Vector2.dif(l1ed,l2op),
            t1e=Vector2.dif(l1ed,l2ed);
        var temp2=Vector2.dif(l2ed,l2op),
            t2o=Vector2.dif(l2ed,l1op),
            t2e=Vector2.dif(l2ed,l1ed);
        // fx   x是线段号码 (1 or 2)
        // fx1 是起点的 flag, fx2 是终点的 flag
        var f11=Vector2.op(temp1,t1o),
            f12=Vector2.op(temp1,t1e);
        var f21=Vector2.op(temp2,t2o),
            f22=Vector2.op(temp2,t2e);
        
        if((f11==0)&&((f22>0)!=(f21>0))){
            // l1 起点在 l2 上
            return 2;
        }
        else if((f12==0)&&((f22>0)!=(f21>0))){
            // l1 终点在 l2 上
            return -1;
        }else if((f21==0)&&((f11>0)!=(f12>0))){
            // l2 起点在 l1 上
            return -1;
        }
        else if((f22==0)&&((f11>0)!=(f12>0))){
            // l2 终点在 l1 上
            return 2;
        }
        
        if((f11>0)!=(f12>0)&&(f22>0)!=(f21>0)){
            // 两线段相交
            return 1;
        }
        return 0;
    }
    /** 获取两个多边形的相交次数
     * @param   {Polygon}   _polygon1
     * @param   {Polygon}   _polygon2
     * @return  {Number}    相交的次数
     */
    static getImpactCount(_polygon1,_polygon2){
        // TODO: 当两个多边形的角碰到角的时候，会出现两次计算，会比预算结果多1
        if(_polygon1.minX>_polygon2.maxX||_polygon2.minX>_polygon1.maxX||_polygon1.minY>_polygon2.maxY||_polygon1.minY>_polygon1.maxY)return 0;
        var vl1=_polygon1.nodes,vl2=_polygon2.nodes;
        var i=vl1.length-1,j;
        var f=0;
        for(--i;i>=0;--i){
            for(j=vl2.length-2;j>=0;--j){
                f+=Polygon.getIntersectFlag(vl1[i],vl1[i+1],vl2[j],vl2[j+1]);
            }
        }
        return f;
    }
    /** 获取两个多边形是否相交
     * @param   {Polygon}   _polygon1
     * @param   {Polygon}   _polygon2
     * @return  {Boolean}   是否相交
     */
    static getImpactFlag(_polygon1,_polygon2){
        if(_polygon1.minX>_polygon2.maxX||_polygon2.minX>_polygon1.maxX||_polygon1.minY>_polygon2.maxY||_polygon1.minY>_polygon1.maxY)return false;
        var vl1=_polygon1.nodes,vl2=_polygon2.nodes;
        var i=vl1.length-1,j;
        for(--i;i>=0;--i){
            for(j=vl2.length-2;j>=0;--j){
                if(Polygon.getIntersectFlag(vl1[i],vl1[i+1],vl2[j],vl2[j+1]))
                return true;
            }
        }
        return false;
    }
    
    /**
     * 矩阵和多边形内部所有向量变换, 根据实参的顺序重载后乘对象
     * (p,m)行向量后乘矩阵
     * (m,p)矩阵后乘列向量
     * @param {Matrix2x2T} m 矩阵
     * @param {Polygon} p 多边形
     * @param {Boolean} translate_befroeOrAfter 先平移或后平移; 默认后平移
     * @returns {Polygon} 返回一个新的多边形
     */
    static linearMapping(p,m,translate_befroeOrAfter=false){
        return Polygon.EX_linearMapping(p,m,!!translate_befroeOrAfter);
    }
    static EX_linearMapping(p,m,translate_befroeOrAfter){}

}
Polygon.EX_linearMapping=createOlFnc();
Polygon.EX_linearMapping.addOverload([Polygon,Matrix2x2,Boolean],function(p,m,f){
    var i=0,
        rtn=new Polygon();
    for(;i<p.nodes.length;++i){
        rtn.pushNode(Vector2.linearMapping(p.nodes[i],m,f));
    }
    return rtn;
});
Polygon.EX_linearMapping.addOverload([Matrix2x2,Polygon,Boolean],function(m,p,f){
    var i=0,
        rtn=new Polygon();
    for(;i<p.nodes.length;++i){
        rtn.pushNode(Vector2.linearMapping(m,p.nodes[i],f));
    }
    return rtn;
});
