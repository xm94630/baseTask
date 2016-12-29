/*******************************
* 第十四章 
* 函数式编程
* 函数的几种使用形式
********************************/

var bee = (function(bee){

	//研究案例1: 最简单的开始 fun();
	bee.caseN1 = function(){
		var fun = function(a){l('最简答的开始:'+a);}
		fun(a);
	}

	//研究案例2: 对象的方法 obj.fun();
	bee.caseN2 = function(){
		var obj = {
			fun:function(){l('我是方法');}
		}
		obj.fun();
	}

	//研究案例3: 链式调用 obj.fun1().fun2();
	bee.caseN3 = function(){
		var obj = {
			fun1:function(){l('我是方法1');return this;},
			fun2:function(){l('我是方法2');return this;},
		}
		obj.fun1().fun2().fun1().fun1();
	}


	/*******************************
	* curry
	********************************/

	//研究案例4: curry 
	//一级curry:curry这个函数内容，只返回函数一次。
	//这里传入的是函数，返回的是函数。
	//起初写完这个案例的时候，我突然说不上来，这样子有什么好处。感觉把案例一中的绕了一下。
	//然后我马上想起了一个重要的特征。见下个案例
	bee.caseN4 = function(){
		function curry(fun){
			return function(a){
				return fun(a);
			}
		}
		var fun = function(x){
			l('结果是：'+x);
		}
		curry(fun)(2);
	}

	//研究案例4_2: curry 
	//这里是高阶函数的一个应用场景，而curry正好是来处理高阶函数的！
	bee.caseN4_2 = function(){
		function curry(fun){
			return function(a){
				return fun(a);
			}
		}

		var gaojie = function(fn){
			l(fn(5,4,3,2,1))
			return;
		}

		var sum = function(){
			var arr = Array.prototype.slice.call(arguments,0);
			var n=0 ;
			for(var i=0;i<arr.length;i++){
				n += arr[i];
			}
			return n;
		}


		gaojie(sum);
		gaojie(curry(sum));



	}




	return bee;
})(bee || {});

bee.caseN4_2();
