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
	//比较典型的就是jquery
	bee.caseN3 = function(){
		var obj = {
			fun1:function(){l('我是方法1');return this;},
			fun2:function(){l('我是方法2');return this;},
		}
		obj.fun1().fun2().fun1().fun1();
	}

	//研究案例3_2: 上例演变
	//这里对象方法中接受的是函数的时候，别有一番味道。
	bee.caseN3_2 = function(){
		var obj = {
			data:[10000,11,22],
			pipe:function(fn){
				//处理数据
				this.data = fn(this.data);
				return this;
			},
			tap:function(fn){
				fn(this.data);
				return this;
			}
		}
		function add100(data){
			return data.map(function(a){
				return a+100;
			})
		}
		function less1000(data){
			return data.filter(function(a){
				return a<1000;
			})
		}
		function log(data){
			console.log('现在的结果是:'+data);
		}
		obj.pipe(add100).tap(log).pipe(less1000).tap(log);

		//上例中的典型案例就是jquery，链式调用的方法传入的对象应该很少是函数的吧，而这里却都用了函数。
		//这里的obj其实是包装之后的数据对象，pipe中可以传入处理数据的方法。
		//tap和pipe的实现非常的类似。区别在于，只是利用值，而不会改变值。
		//这里把解决问题的过程分解为几个函数，是典型的函数式编程
		//函数式编程也分精妙与否，关键看 add100、less1000 这等函数是具有高度复用性，否者的话也是无用。
	}



	/*******************************
	* 一级 curry
	********************************/

	//研究案例4: 一级 curry 
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

	//研究案例4_2: 一级 curry 应用
	//这里是高阶函数的一个应用场景，而curry正好是来处理高阶函数的！
	//这里可以看到有没有curry的包装的结果是不一样的。
	//包装后的那个函数主要是在接受参数的时候，参数个数发生了变化。从原来的接受无限个的参数，变成了只接受一个。
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

	//研究案例4_3: 一级 curry 多参数
	//重构案例4
	//区别在于，案例4返回的函数的参数是一个，这里确是多个。
	//见案例4_4的运用，对比4_2就知道了。 
	bee.caseN4_3 = function(){
		function curry(fun){
			return function(){
				var args = Array.prototype.slice.call(arguments,0);
				return fun.apply(null,args);
			}
		}
		var fun = function(x){
			l('结果是：'+x);
		}
		curry(fun)(2);
	}

	//研究案例4_4: 一级 curry 多参数 应用
	bee.caseN4_4 = function(){
		function curry(fun){
			return function(){
				var args = Array.prototype.slice.call(arguments,0);
				return fun.apply(null,args);
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
		//这个时候结果是一样的，也在预料之中。
		gaojie(sum);
		gaojie(curry(sum));
	}


	//研究案例4_5: 同上
	//这里使用了bind 函数，来实现 curry。
	//bind的作用相当于return了一个函数。
	bee.caseN4_5 = function(){
		function curry(fun){
			return fun.bind(null)
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

	/*******************************
	* 二级 curry
	********************************/

	//研究案例5: 二级 curry 
	bee.caseN5 = function(){

		function curry(fun){
			return function(a){
				return function(b){
					return fun(a,b)
				};
			}
		}
		var fun = function(x,y){
			var sum = x+y;
			l('结果是：'+sum);
		}
		curry(fun)(2)(1000);
		//curry(fun)(2,1000)();
	}

	//研究案例5_2: 二级 curry 
	bee.caseN5_2 = function(){

		function curry(fun){
			return function(){
				var arr = Array.prototype.slice.call(arguments,0);
				arr.unshift(null);
				return fun.bind.apply(fun,arr);
			}
		}
		var fun = function(x,y){
			var sum = x+y;
			l('结果是：'+sum);
		}
		curry(fun)(2)(1000);
		curry(fun)(2,1000)();
	}


	return bee;
})(bee || {});

//bee.caseN5_2();
























