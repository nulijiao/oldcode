/**
 * Created by jiaoge on 2017/9/19.
 */

// var myScroll={};
(function (win,$,doc) {

//    利用构造函数
var position;
    var opts={
        scrollDIR:"y",
        scrollcontent:"",
        scrollbar:"",
        scrollslider:""
    }


    function Scroll(options) {
        this._init(options);
    }
    $.extend(Scroll.prototype,{
        //为其添加函数方法
        _init:function (options) {
            var that=this;
        that.option={
    scrollDIR:"y",
    scrollcontent:"",
    scrollbar:"",
    scrollslider:"",
            tab:[],
            wheelStep:20
           // 鼠标滚动一下的移动距离
           }

            $.extend(that.option,opts,options);
        for(var i=0;i<$("p").length;i++)
        {that.option.tab.push($("p").eq(i).position().top);}
            that.initDom();
        //    确定每个p相对于父亲元素的位置;
        },
        tabMove:function () {
            var that=this;
            $(".scroll-item").on("click",function () {
                $(this).addClass("active").siblings().removeClass("active");

                var index=$(this).index();
                console.log($("p").eq(index).position().top);
                that.$cont.scrollTop(that.option.tab[index]);
                //关于position函数不一定要求使用的元素定位而是寻找已经定位的父元素同理offset就是距离body的相对高度；
                // that.scrollTo($("p").eq(index).position().top);
                that.setSlider(that.option.tab[index]);
            });
        },
       initDom:function () {
           var that=this;

             this.$cont=$(that.option.scrollcontent);
             this.$scrollbar=$(that.option.scrollbar);
            this.$scrollslider=$(that.option.scrollslider);
             this.doc=$(doc);
this.initDrag();
          },
        initDrag:function () {

            var that=this;
  var sld=this.$scrollslider[0];

  if(sld)
  {
      that.tabMove();
      var dragStartPosition,rate,dragStartScrollPosition;

      //要记住滚动轮的位置然后继续
      this.$scrollslider.on("mousedown",function (e) {
          console.log("开始");
        e.preventDefault();
          dragStartPosition=e.pageY;
          dragStartScrollPosition=that.$cont[0].scrollTop;
      //    初始内容上移的高度属于DOM元素
console.log("1");
          rate=that.getContentMove()/that.getSliderMove();
      //计算出滚动比率
          that.doc.on("mousemove.scroll",function (e) {

                  that.mouseEvent(e, dragStartPosition,dragStartScrollPosition,rate);
              }

          );that.doc.on("mouseup",function (e) {
              console.log("结束");
              // if(e.target!=that.$scrollslider||e.target!=that.$scrollbar)
              // {
              //     that.doc.off("mousemove");
              //
              //
              // }});

              that.doc.off("mousemove");});



        //    在命名空间里面去掉
        });

/*
*疑问就是：为什么放在mousedown里面有mousemove和mouseup但是为什么单独放在外面就不在执行mousemove只要放在里面就执行，我的猜想是因为在mousedown时候就会触发调用这个mousemove事件即使你在mouseup的时候撤销了这个事件但是仍然会有下一次点击之时再次出发这个事件，然后新一轮的mouseup取消事件这就是为什么单独写不能被触发了可是和mousedown写在一起就可以触发？问问老师？
*
 */
      //  鼠标移动绑定在文档上,鼠标移动时间仍旧可以内容滚动


  }
   this.mousewheel();

        },
        //鼠标滚轮事件mousewheel或或是DOMMouseSCROLL火狐使用detail属性，其他浏览器使用wheeldelta属性返回鼠标滚轮的值负数表示向上火狐其他正数为上。火狐中值是3倍数其他浏览器是120倍数，滚轮值/滚动倍数就是滚动了几下，滚动几下*步长就是鼠标滚动时候的上移。
        mousewheel:function () {
        //    定义鼠标滚一下滚动距离
            var self = this;
            self.$cont.on("mousewheel DOMMouseScroll",
                function (e) {
                    e.preventDefault();
                    var oEv = e.originalEvent;
                        wheelRange = oEv.wheelDelta ? -oEv.wheelDelta / 120 : (oEv.detail || 0) / 3;
                    //判断究竟是哪一个值成立就采用哪一个属性值
                    self.scrollTo(self.$cont[0].scrollTop + wheelRange * self.option.wheelStep);
                });
        },

        mouseEvent:function (e,dragStartPosition,dragStartScrollPosition,rate) {
        console.log("正在移动");
        if(!dragStartPosition){
            console.log("请安住滑块")
            //    判断是否鼠标落在滑块上因为不执行按下滑块就会有
            return false;
        }
        position= dragStartScrollPosition+(e.pageY-dragStartPosition)*rate;

        this.scrollTo(position);
        return this;
        //              return self;
        //     滚动了多少
    },
        scrollTo:function (pos) {
            this.$cont.scrollTop(pos);
            this.setSlider(pos);
            return  this;
        //    链式调用的思想
        },
        getSliderMove:function () {
            return  this.$scrollbar.height()-this.$scrollslider.height();

        //    鼠标可移动距离等于轨道减去滑块的距离

        },
        //没有使用函数中的全局变量而是使用参数传递的方式否则鼠标滚动滚动条却不动，尽量减少全局变量的使用，应该使用参数传递的方式这样才是正确的。

        setSlider:function (pos) {
         if(!this.$scrollslider[0])
         {
             return;
         }
         var l=this.getSliderMove()*pos/this.getContentMove();
          if(35<this.$scrollslider.position().top<=this.getSliderMove())
          {this.$scrollslider[0].style.top=(l)+"px";}
            //防止拖动出下界限
          if(l>this.getSliderMove())
          {
              this.$scrollslider[0].style.top=(this.getSliderMove())+"px";
          }
            //防止拖动出上界限
          if(l<0)
          {
              this.$scrollslider[0].style.top=(0)+"px";

          }

        },
        getContentMove:function ()
        {
         var tencentHeight=this.$cont.height();
         //高度与真实高度的比较求差就是内容可以移动的距离
         var tencentScroll=this.$cont[0].scrollHeight;

         if(tencentHeight>tencentScroll)
         {
             return tencentHeight-tencentScroll;
         }
         else
             return tencentScroll-tencentHeight;
        }


    });


    win.scroll= Scroll;
//    用window全局的记住
    
})(window,jQuery,document);
new scroll({
    scrollDIR:"y",
    scrollcontent:".scroll-wrap",
    //滚动内容
    scrollbar:".scroll-bar",
    scrollslider:".scroll-slider"
});
//鼠标移动距离等于滑块移动距离
//scroll-wrap写成.scroll-cont就不执行原因是什么？
//　滚动条可移动范围 / 滚动条高度 = 内容高度 / 内容可视高度