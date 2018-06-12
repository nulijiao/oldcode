/**
 * Created by jiaoge on 2017/10/23.
 */
"use strict";
var STATUE_start=1;
//开始状态
var STATUE_stop=2;
//停止时候状态
var STATUE_init=0;

//初始化状态
/*任务类型同步*/
var Task_sy=0;
/*任务类型异步*/
var Task_asy=0;
//三种状态
/*
* callback执行函数*/
function next(callback) {
    callback&&callback();
}
var loadImages=require('./defineImage');
var Timeline=require('./timeline');
/*接收另一个模块的预加载图片模块*/
function Animation() {
    this.taskQueen=[];
    //任务函数的队列规定了执行函数的顺序
    this.index=0;
    this.timeline=new Timeline();
    this.state=STATUE_init;
    

}
var type;
/*预加载图片，参数图片数组*/
Animation.prototype.loadImage=function (imageList) {

var taskFn=function (next,time) {
    loadImages(imageList.slice(),next,time);

}
type=Task_sy;
/*把函数添加到任务队列中type是任务类型*/
   return this._add(taskFn,type);
//   返回了当前的this可以使用链式调用
},
/*动画产生原理：利用settimeout改变图片的position来产生动画是一个异步的因为settimeout，DOM对象，位置数组，图片*/
Animation.prototype.changePosition=function (dom,positions,imgUrl) {
var len=positions.length;
var taskFn;
var type;
var that=this;
if(len){
    //该函数切换背景图片位置
    taskFn=function(next,time){
     if(imgUrl){
         dom.style.backgroundImage="url("+imgUrl+")"
     }
     //回去当前背景图片位置索引
     var index=Math.min(time/that.interval|1,len-1);
     //当前时间/间隔是第几个，索引不能超过位置的长度
     var position=positions[index].split(" ");
    // 判断这是第几帧同时找到了背景图片的XY坐标

        dom.style.backgroundPosition=position[0]+"px"+position[1]+"px";
    //成功设置背景图片的位置
    //   帧动画结束
        if(index===len-1){
            next();
        }

    }

    type=Task_asy;
//    异步加载方式
}else{
    taskFn=next;
    type=Task_sy;
//    同步方法不存在长度时候



}
this.add(taskFn,type);
// 添加到任务队列里面



},
/*
* 通过定时器改变图片的src实现帧动画也是异步settimeout参数是图片的的数组和dom对象*/
Animation.prototype.changeImageURL=function (dom,imgList) {
var len=imgList.length;
var that=this;
if(len){
   var taskFn=function (next,time) {
       //找到当前图片的索引time从开始到结束的时间
       var index=Math.min(time/that.interval|1,len-1);
       dom.src=imgList[index];
       //改变此时的背景图片，因为每一帧对应的图片是不一样的imglist里面定义了每一帧用的图片src
       if(index===len-1)
       {
           //执行完毕调用下一个动画
           next();
       }
   }
    type=Task_asy;
//   有图片异步方法
}else{
    taskFn=next;
    type=Task_sy;
//    同步方法不存在长度时候
}
this.add(taskFn,type);
//添加到任务队列里面


},
/*
* 参数是自定义帧动画的函数，异步定时执行任务*/
Animation.prototype.enterFrame=function (taskFn) {

return this._add(taskFn,Task_asy);
//添加异步函数到任务队列





},
    /*
    * 增加一个同步任务，上一个任务完成后才执行。参数是回调函数*/
    Animation.prototype.then=function (callback) {

       var taskFn=function (next) {
           callback();
           //执行下一个
           next();
       }

       //因为是同步所以先执行回调函数自己的部分以后再调用执行他的下一个任务就是next方法
       // 添加到任务队列中
       this._add(taskFn,Task_asy);




    },
    /*定义多久执行异步定时任务间隔，参数时间*/
    Animation.prototype.start=function (interval) {
if(this.state=STATUE_start)
{
    return this;
}
/*任务链中无任务*/
if(!this.taskQueen){
    return this;
}
   this.state=STATUE_start;
   this.interval=interval;
    this._runTask();

    },
    /*
    * 执行任务是一个私有方法
    * 每一次都会取出任务队列里面的下一个任务来执行*/
    Animation.prototype._runTask=function (){
        /*不等于是！==*/
        if(!this.taskQueen||this.state!==STATUE_start)
        {
            return;
        }
        /*
        *任务执行结束,释放资源
         */


        if(this.index===this.taskQueen.length)
        {
            this.RealeaseURL();
            return;
        }
var task=this.taskQueen[this.index];
        if(task.type=== Task_sy)
        { this._sys(task);}
        //同步方法

        else  { this._asy(task);}
    //    异步方法

    },
/*
 * 同步任务方法*/
Animation.prototype._sys=function (task) {
    var taskFn=task.taskFn;
    var that=this;
    var next=function (task) {
        /*切换到下一个任务*/
        that.next(task);
    }
    taskFn(next);





},
    /*
    * /*切换到下一个任务,同时当亲任务需要等待先等待*/

    Animation.prototype.next=function (task)

    { var that=this;

        this.index++;
      task.wait?setTimeout(function () {
      that._runTask();
      //_runTask()就是执行任务函数
      //当前任务
      },task.wait):this._runTask();
// next是找到下一个函数但是最终执行仍旧调用runtask
    //   串起来任务链

    },
    /*
     * 异步任务方法，是定时完成*/
    Animation.prototype._asy=function (task) {
/*settimeout是不准确的是不连贯的设置时间越长越不准确，所以利用时间轴来使得timeout更加准确，设置timeline类*/
  var that=this;
  //定义每一帧回调函数从time是动画开始时间到当前执行的时间
  var enterFrame=function (time) {
      var taskFn=task.taskFn;
      var next=function () {
          //    停止当前任务
          that.timeline.stopPlay();
      //    执行下一个任务
          that.next(task);
      }
 //     执行下一个函数
       taskFn(next,time);
  }

          this.timeline.onenterframe=enterFrame;
          this.timeline.startPlay(this.interval);
    },
    /*同步任务：
    * 添加一个同步任务回到初始状态在执行
    * 参数值执行的次数*/
    Animation.prototype.repeat=function (times) {
        var that = this;
        var taskFn = function () {
            if (times === undefined) {
                // 没有传值认为无限
                that.index--;
                //因为index是在任务队列中去上一个上一个执行以后又到了这一个，就又循环到上一个在自己再上一个反复循环
                //每次到自己就回到上一个再到自己反复循环
                that._runTask();
            } else {
                if (times) {
                    times--;
                    //每反复一次就减循环次数直到次数变成0，就结束。
                    that.index--;
                    //每次到自己就回到上一个再到自己反复循环
                    that._runTask();
                }
                else {
                    var task=that.taskQueen[that.index]
                    //    times是0达到次数跳转下一个任务
                    that.next(task);
                }


            }

        }
        this._add(taskFn,Task_sy);
        // 把此函数添加到任务队列中等待执行
    }
    /*
    * w无限循环动画*/
    Animation.prototype.repeatAll=function (dom,imgList) {

return this.repeat();
    //调用反复执行不传入参数，参数就是undefined



    },
/*
* 任务执行等待时间
**/
    Animation.prototype.wait=function (time) {
       if(this.taskQueen&&this.taskQueen.length>0)
       {
       //    表示任务队列中存在任务，然后需要我们执行每个任务时候需要等待时间
         this.taskQueen[this.taskQueen.length-1].wait=time;
    //     因为每增加一个任务对象就会+1这样就是从第一个任务添加以后就是length=1但是对应的索引就是0所以通过这样的方法为里面的函数执行添加了一个等待方法
    //任务对象{有函数wait和同步异步类型）
    }
    return this;


    },
    /*
    * 异步动画终止
    *
    * */
    Animation.prototype.stop=function () {
if(this.state===STATUE_start)
{this.state=STATUE_stop;
    this.timeline.stopPlay();
    return this;
}
    //否则就是停止状态
        return this;
    },
    /*
    * 动画重新开始
    *
    * */
    Animation.prototype.restart=function () {
        if(this.state===STATUE_stop)
        {this.state=STATUE_start;
            this.timeline.restartPlay();
            return this;
        }
        //否则就是开始状态或者
        return this;



    },
    /*
    * 释放资源*/
    Animation.prototype.RealeaseURL=function () {
        if(this.state!==STATUE_init)
        //判断是否是初始化什么也没有
        {this.state=STATUE_init;
           this.taskQueen=null;
            this.timeline.stopPlay();
            this.timeline=null;
            return this;
        }
        //否则就是初始状态
        return this;
    },
    /*
    * 添加一个任务到任务队列taskFn是一个函数与自己的函数类型变成对象添加到taskQueen数组里面*/
Animation.prototype._add=function (taskFn,type) {
     this.taskQueen.push({taskFn:taskFn,
     type:type});
   return this;
//为了链式调用


};
module.exports=function () {
    return new Animation();
}