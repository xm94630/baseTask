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
     * onclick 是属性的形式，给他多次赋值的话，就会被覆盖。
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
     * 上例要正确的运行，只能这样子处理。
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

        //这样子写的话，总归不是很美观，addEventListener 可以来优化
    }


    /* 
     * 研究案例6: ele.addEventListener VS ele.onclick  
     */
    bee.caseR6 = function(){

        window.onload = function() {
            var ele = document.getElementById('myBtn');
            ele.addEventListener('click',fun1);
            ele.addEventListener('click',fun2);
            function fun1(){
                l(111)
                l(this)
            }
            function fun2(){
                l(222)
                l(this)
            }
        }

        //addEventListener 就高级多了，允许绑定多个事件！
        //它属于“分布式事件”的处理方式。说白了，就是发布订阅模式。（发布订阅模式也可能是“分布式事件”的处理方式之一）
        //在发布订阅模式中，多个订阅者可以绑定同一个“信道”，比如这里的“click”。
        //
        //这里的是this是谁呢？关键看 fun1 函数在 addEventListener 中如何被使用的。
        //addEventListener是系统默认的函数，不方便看源码了。不过从结果中，我们就可以知道，它被绑定到ele上了 ~
    }


    /* 
     * 研究案例7: ele.addEventListener VS ele.onclick  
     * 这个案例说明，两者都可以绑定行为，而且他们之前不会相互干涉和覆盖。
     */
    bee.caseR7 = function(){

        window.onload = function() {
            var ele = document.getElementById('myBtn');
            ele.addEventListener('click',fun1);
            ele.addEventListener('click',fun1);
            ele.addEventListener('click',fun2);
            function fun1(){
                l(111)
                l(this)
            }
            function fun2(){
                l(222)
                l(this)
            }
            ele.onclick = function(){
                l(333)
                l(this)
            }
        }

        //那么原理是什么呢？
        //我认为，addEventListener 和 onclick 都是纯js中 独立的事件处理器系统。
        //当浏览器中有一个事件产生的时候，都会自动去调度这些处理器。
    }


    /* 
     * 研究案例8: addEventListener 和 onclick 原理（模拟）
     */
    bee.caseR8 = function(){

        ele = {
            onclick : function(){},
            addEventListener : function(name,fun){
                if(!this.handler[name]){
                    this.handler[name] = [];
                }
                this.handler[name].push(fun);
            },
            handler:{},
            emiter:function(name){
                this.handler[name].forEach(function(fn){
                    fn();
                }); 
            }
        };

        //事件绑定1
        ele.onclick = function(e){l('onclick!');}
        //事件绑定2
        ele.addEventListener('click',function(){l('addEventListener_1!')})
        ele.addEventListener('click',function(){l('addEventListener_2!')})

        //事件触发
        //这个我们是手动触发的。对于浏览器的事件而言，浏览器在事件发生的时候，就会自动去调用。
        l('==>');
        window.setTimeout(function(){
            ele.onclick();
            ele.emiter('click');
        },1000);

        //这个只是一个实现机制的模拟，和真实实现肯定是不一样的，但是也能说明其原理。
        //事件绑定的两种方法中，第一种是直接改变了方法的内容，第二种是调用其方法。
        //从调用角度看，第一种对应的是“直接调用”，所以多次对 onclick 进行赋值的时候，以最后一次为准。
        //第二种对应的是“调用了其他的函数”，比如这里的emiter。
        //
        //我也可以改变 addEventListener 这个函数！ 但是对用用户来说，它的实现就是个黑盒子。你不知道它内部的发布订阅系统的实现逻辑。
        //比如把变量存到那个地方。
    }


    /* 
     * 研究案例9: 【BOSS】解决之前一直困扰我的一个重要问题！
     * 这里将发布订阅模式和js的事件系统（其中addEventListener也是一个发布订阅模式）进行了结合。
     * 发布订阅模式，其实是很简单的，我很久之前就已经明白这个道理。
     * 当时，唯独让我困惑的是 jquery 的 triger:
     * $ele.triger('click');
     * 我一直想，为何能手动的触发click的事件呢？我一直怀疑，但是 triger 确实做到了。另一方面，
     * 点击事件，确实也能触发回调。
     *
     * 到底是怎么回事呢？
     *
     * 如今，我才知道了原理：其实针对于浏览器的那种默认的事件（如click）,事件分发系统做了两手的准备，
     * 一方面把回调放到 handler 中存储，另外用原生的 addEventListener 进行了代理！！
     * 所以，emiter可以手动触发。而鼠标的点击事件，就可以触发addEventListener中的回调！
     */
    bee.caseR9 = function(){

        //用发布订阅者模式实现的 事件分发系统
        var Emiter = {
            on : function(name,fun){
                if(!this.handler[name]){
                    this.handler[name] = [];
                }
                this.handler[name].push(fun);

                //重点原理：
                //如果是事件的名字是浏览器中的默认的事件，比如这里的click，需要使用默认的 addEventListener
                if(name="click"){
                    //相当于用 addEventListener 来代理 on：
                    this.addEventListener(name,fun);
                }
            },
            handler:{},
            emiter:function(name){
                this.handler[name].forEach(function(fn){
                    fn();
                }); 
            }
        };

        window.onload = function() {
            var ele = document.getElementById('myBtn');
            ele = $.extend(ele,Emiter);
            ele.on('click',function(){l('1')})
            ele.on('click',function(){l('2')})
            ele.emiter('click')
        }
    }

    





})(bee || {});





































