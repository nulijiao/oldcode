/**
 * Created by jiaoge on 2017/10/24.
 */
"use strict";
//初始化三种状态
var STATUE_start=1;
//开始状态
var STATUE_stop=2;
//停止时候状态
var STATUE_init=0;
var intervals=1000/60;
/*
* requestAnimationFrame是一个“请求动画帧更新帧动画的接口
* 同样的，显示器16.7ms刷新间隔之前发生了其他绘制请求(setTimeout)，导致所有第三帧丢失，继而导致动画断续显示（堵车的感觉），这就是过度绘制带来的问题。不仅如此，这种计时器频率的降低也会对电池使用寿命造成负面影响，并会降低其他应用的性能。

 这也是为何setTimeout的定时器值推荐最小使用16.7ms的原因（16.7 = 1000 / 60, 即每秒60帧）。

 而我requestAnimationFrame就是为了这个而出现的。我所做的事情很简单，跟着浏览器的绘制走，如果浏览设备绘制间隔是16.7ms，那我就这个间隔绘制；如果浏览设备绘制间隔是10ms, 我就10ms绘制。这样就不会存在过度绘制的问题，动画不会掉帧，自然流畅的说~~

 内部是这么运作的：
 浏览器（如页面）每次要洗澡（重绘），就会通知我(requestAnimationFrame)：小丸子，我要洗澡了，你可以跟我一起洗哦！

 这是资源非常高效的一种利用方式。怎么讲呢？

 就算很多个小丸子要一起洗澡，浏览器只要通知一次就可以了。而setTimeout貌似是多个独立绘制。
 页面最小化了，或者被Tab切换关灯了。页面是不会洗澡的，自然，小丸子也不会洗澡的（没通知啊）。页面绘制全部停止，资源高效利用
* */
var requestAnimationFrame=(function () {
return  window.requestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.webkitRequestAnimationFrame||function (callback) {
    return setTimeout(callback,callback.interval||interval);

    };
/*当所有的都不支持这些属性只能使用settimeout函数了*/

})();
var  cancelAnimationFrame=(function (id) {
    return  window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.webkitCancelAnimationFrame||function (id) {
            return window.clearTimeout(id);

        };
    /*当所有的都不支持这些属性只能使用settimeout函数了*/

})();
/*
* 定义timeline的类*/
function Timeline() {
this.event=0;
    this.state=STATUE_init;
}
/*
* 时间轴上每一次回调的函数
* time是从动画开始到当前的时间，继承来实现的方法
* 不实现实例实现
* */
Timeline.prototype.onenterframe=function (time) {

},
    /*
       动画开始
    * 每一次回调的间隔时间
    * */
    Timeline.prototype.startPlay=function (interval) {
        if(this.state=STATUE_start)
        {
            return ;
        }

        this.state=STATUE_start;
        this.interval=interval||intervals;
        this.startTimeline(this,+new Date());
        /*
         requestanimationframe每间隔17毫秒的间隔，时间轴动画启动函数
         * 时间轴对象，开始时间*/


    },
    /*
       动画停止
     * 每一次回调的时间*/
    Timeline.prototype.stopPlay=function () {
if(this.state===STATUE_stop)
{
    return;

}
//更改状态
this.state=STATUE_stop;
if(this.starttime)
{
    //如果动画开始过，记录动画开始到现在所经历的时间
    this.during=new Date()-this.starttime;
//    记录动画持续时间
}
    },

    /*
    * 动画重新开始
    * */
Timeline.prototype.restartPlay=function () {
    if(this.state===STATUE_start)
    {
        return;

    }
    //更改状态
    if(!this.during||!this.interval)
    {
        return;
    }
    this.state=STATUE_start;
    this.starttimeline(this,+new Date()-this.during);
//    new Date()-this.during是开始的时间无缝连接动画从停止开始的
},
/*
 * 每一帧要执行*/
Timeline.prototype.starttimeline=function (timeline,starttime) {

    startTimeline(timeline,starttime);

    function   startTimeline(timeline,starttime) {
        timeline.starttime=starttime;
        nextTICK.interval=timeline.interval;
        //    记录上一次时间回调的时间戳
        var lastTick=+new Date();
        /*
         * 每一帧执行的函数可以让不是17毫秒的函数执行*/
        function nextTICK() {
            var now=+new Date();
            //用requestAnimationFrame定时执行
            timeline.event=requestAnimationFrame (nextTICK);
            //当前时间减去上一次回调的时间戳时间大于时间间隔表示这一次可以执行回调函数
            if(now-lastTick>timeline.interval)
            {
                timeline.onenterframe(now-starttime);
                lastTick=now;
                //  现在时间就是上一次的回调的时间点
            }
        }
        module.exports=Timeline;
    }

}





