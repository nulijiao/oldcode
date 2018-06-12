/**
 * Created by jiaoge on 2017/10/23.
 */
"use strict";
/*加载图片成了一个单独的模块
*images加载图片的数组或者对象
*callback全部函数加载成功后执行
* timeout加载超时的时间，最长等待时间超过等待时间仍旧执行回调函数
* */
function loadImg(images,callback,timeout) {
//加载图片的计数器
    var count=0;
    //是否成功标志
    var success=true;
    //超时ID
    var timeoutId=0;
    //是否超时标志
    var isTimeout=false;
    //期待中的图片是对象就期望是{src:“”}或者是一个数组【{SRC：“”}{SRC：“”}】
    //或者就是一个数组
    /*首先应该是这个样子的每次都是先执行这个for循环把所有的图片都复制了SRC属性所以count是先进性自加操作的所以以至于加载完成一张图片执行回调函数以后就会自己减去1当减到0的时候就表示所有的都成功了*/
    for(var key in images)
    {
        if (!images.hasOwnProperty(key))
        {
            /*hasOwnProperty方法无法检查该对象的原型链中是否具有该属性，所以image.hasOwnProperty(key)拿到的只是对象构造函数中本身的成员，!image.hasOwnProperty(key)拿到的就是对象原型链上的属性，这时候执行continue就相当于过滤掉prototype上的属性了。
             */
            continue;
        }
      var  item=images[key];
        /*多用3个等于号来判断*/
       if(typeof(item)==="string")
       {/*为item赋值*/
           item=images[key]={
               src:item
           }
       }
       /*没有找到对应的src继续遍历*/
       if(!item||!item.src)
       {
           continue;
       }
           count++;
    //   满足计数器加1
        /*设置元素的id*/
        item.id="img"+key+getId();
       item.img=window[item.id]=new Image();
       /*加载图片图片用全局变量记住*/
       load(item);

    }//   真正加载图片函数
    /*count==0表示遍历完成也没有找到一个合适的图片只能调用回调函数，算是加载成功*/
    if (!count) {
        callback(success);
    } else if (timeout) {
        /*settimeout是间隔的时间间隔了这么久以后就会自动执行有一个自己的线程*/
        timeoutId = setTimeout(onTimeout, timeout);
    }
    /*超时函数*/

    function onTimeout() {
        isTimeout=true;
        callback(success);
    }
    function load(item) {
        var img=item.img;
       item.status="loading";
        /*要有函数状态是LP函数编程的思想*/
        item.img.onload=function () {
      success=success&true;
      item.status='loaded';
      over();
            //每张图片加载完成无论失败成功回调函数
        }
        /*图片加载成功函数*/
        item.img.onerror=function () {
            /*失败*/
            success=false;
            item.status='fail';
            over();
            //每张图片加载完成无论失败成功回调函数
        }
        /*图片加载失败函数*/
        item.img.src=item.src;        // SRC是会先执行就是表示向http进行请求，然后就会有真正的请求
//图片加载完成无论失败成功
        function over(){
            /*图片加载完成清理操作onload和onerror清理window记住的对象*/
    img.onload=img.onerror=null;
    try{
       delete window[item.id];
       /*try catch为了兼容低版本浏览器*/
    }
    catch(e){

         }
        // 调用回调函数    //每张图片加载计数器减1
            count=count-1;
    /*count初始是0一直没有++表示没有执行，因为在超时以后也要判断这个函数*/
/*所有图片加载完成而且没有超时清除定时器*/
    if(count==0&&!isTimeout)
    {
        clearTimeout(timeoutId);
      callback(success);
      /*判断图片都成功加载*/
    }



        }


    }

var _id=0;
/*形成闭包然后封装成一个define函数域*/
    function getId() {
        return ++_id;
    }


}

module.exports=loadImg;
//模块化编程暴露给外面的方法，外面就可以加载这个模块