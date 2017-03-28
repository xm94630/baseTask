/*******************************
* 第十八章 事件
********************************/

var bee = (function(bee){


    /* 
     * 研究案例1: 最简单的事件
     * onload的事件是由浏览器自己触发的
     */
    bee.caseR1 = function(){
        window.onload = function(){
            l('页面加载完毕');
        }
    }


    /* 
     * 研究案例2:点击事件
     * 点击事件的触发是由用户手动触发的
     */
    bee.caseR2 = function(){
        window.onload = function(){
            var ele = document.getElementById('myBtn');
            ele.onclick = fun;
            function fun(){
                l(this==ele)
            }
        }

        //这里的问题是this，指代的是谁？
        //这个结论我们很久之前就有了，就是看这个函数被如何使用的：
        //我们看 fun 赋给了 ele.onclick，事件的触发，相当ele.onclick()，所以是方法的形式进行调用的。
        //那么 this 就是这个对象——ele。
    }


    /* 
     * 研究案例3:点击事件 变化
     */
    bee.caseR3 = function(){
        window.onload = function(){
            var ele = document.getElementById('myBtn');
            ele.onclick = function(){
                fun();

                //可以这样子修正fun中的this
                //fun.call(this);
            };
            function fun(){
                l(this==ele)
            }
        }

        //这里的问题是this，指代的是谁？
        //这个时候，函数是被直接调用的，this就是全局对象~
    }


    /* 
     * 研究案例4:一个元素中绑定多个处理事件 [错误案例]
     */
    bee.caseR4 = function(){

        window.onload = function() {
            var ele = document.getElementById('myBtn');
            ele.onclick = fun1;
            ele.onclick = fun2;
            function fun1(){
                l(111)
            }
            function fun2(){
                l(222)
            }
        };

        //这样子并不能绑定多个处理函数！其实是，后者覆盖了全部。
    }


    /* 
     * 研究案例5:一个元素中绑定多个处理事件 [正确案例]
     */
    bee.caseR5 = function(){

        window.onload = function() {
            
            var ele = document.getElementById('myBtn');
            ele.onclick = function(){
                fun1.call(this);
                fun2.call(this);
            }
            function fun1(){
                l(111)
                l(this)
            }
            function fun2(){
                l(222)
                l(this)
            }
        }
    }












})(bee || {});





































