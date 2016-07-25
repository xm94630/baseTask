//这里都是一些js中比较绕的知识点
var bee = (function(bee){

	/* 
	 * 研究案例1:call、this
	 * 这里第3、4、5中情况是一致的
	 * 言外之意就是3、4中，call方法是无效的，为什么呢？因为call仅影响的是函数中的this
	 * 3、4中，call前面那坨东西中已经不存在this了。
	 * 【说明】
	 * 该案例灵感来自于《函数式变编程》P50页中的_.bind
	 * 那个时候，我以为_.bind函数改造了原来的函数，其实是没有的，只是消耗(书中说是锁定，是一样的意思)了this
	 */
	bee.case01 = function(){
		var obj1 = {a:111}
		var obj2 = {a:222}
		function fun (){return this;}
		function bind (myFun,obj){
			return function(){
				return myFun.call(obj)
			}
		}

	    var r1 = fun();
		var r2 = fun.call(obj1);
		var r3 = (function(){
			return fun.call(obj2);
		}).call(obj1);
		var r4 = bind(fun,obj2).call(obj1);
		var r5 = bind(fun,obj2)();

		l('第1种情况中，this指代的是：');
		l(r1);
		l('第2种情况中，this指代的是：');
		l(r2);
		l('第3种情况中，this指代的是：');
		l(r3);
		l('第4种情况中，this指代的是：');
		l(r4);
		l('第5种情况中，this指代的是：');
		l(r5);
	}


	/* 
	 * 研究案例2:this
	 * 这中情况只需要用一句话来总结就行了:
	 * 如果函数是以方法调用的，则函数中的this指代那个对象，否则就是全局变量，一般是window对象
	 * r2中的那个匿名函数不是以方法调用的，所以this指代的就会window对象
	 */
	bee.case02 = function(){

		var obj1 = {
			fun: function(){
				return this;
			}
		}
		var obj2 = {
			fun: function(){
				return (function(){return this;})();
			}
		}
		var r1 = obj1.fun();
		var r2 = obj2.fun();
		l(r1)
		l(r2)

	}


	/* 
	 * 研究案例3:闭包
	 * 因为有闭包的存在，不能简单地通过log两个函数来比较是否功能相同
	 * 下面的fun1和fun3通过log、tostring处理后显示完全一样
	 * 然偶调用的时候结果完全不同！
	 */
	bee.case03 = function(){

		var n = 123;
		var fun1 = function(){return n;};
		var fun2 = function(){
			var n = 222;
			return function(){return n;};
		}
		var fun3 = fun2();

		l(fun1);
		l(fun3);
		l(fun1());
		l(fun3());
		l(fun1.toString());
		l(fun3.toString());
		l(fun1.toString()===fun3.toString());

	}


	/* 
	 * 研究案例4:函数对象
	 * 本案例中，可以看到函数对象的很多特性
	 * 1）直接log处函数，基本上是它的toString状态
	 * 2）只有作为函数方法的时候log出来，才把它显示为对象，所以要查看全局函数，可以log(window),然后找到该方法。
	 * 3）arguments、caller、length、name为4个函数对象属性，并不被for循环输出。
	 * 4）自己为函数对象添加的属性，会在for in循环中输出
	 * 5）可以使用函数对象继承自原型的方法，如：toString
	 */
	bee.case04 = function(){

		var fun1 = function(){}
		var obj  = {
			fun2:function(){}
		}
		l(fun1)
		l(obj)

		l(obj.fun2.arguments)
		l(obj.fun2.caller)
		l(obj.fun2.length)
		l(obj.fun2.name)

		obj.fun2.xxx=123;
		l('获取函数对象中的属性:')
		for(var key in obj.fun2){
			l(key)
		}
		l(obj.fun2.toString)
	}


	/* 
	 * 研究案例5:_.bindAll
	 * 本案例研究的是《函数式编程》P50页中提到的函数_.bindAll
	 * 对比上下两种情况，下面的绑定生了效
	 * _.bindAll函数调用的时候并没有返回一个新的函数，可见一定是直接修改了第一个参数
	 * 直接输出两者fun函数发现是一样的，至少在表面上是的
	 * 要真正的观察fun的不同，必须输出外层的对象，发现func函数对象确实被改动了
	 * fun函数对象的name属性变成了“bound fun”，这个带空格的写法很奇特，因为函数的名字不可能带空格
	 * fun函数对象还有[[bound fun]]、[[BoundThis]]、[[BoundArgs]]这样的写法
	 * 百度了下发现和原生的bind实现有关系，其中诡异的写法也就原生的能做到了
	 * 可见_.bindAll函数可以用bind来实现封装的
	 */
	bee.case05 = function(){

		var obj1 = {
			appName:'大鱼一条',
			fun:function(){return this.appName;}
		}
		var a = obj1.fun;
		l(a())


		var obj2 = {
			appName:'大鱼一条',
			fun:function (){return this.appName;}
		}
		_.bindAll(obj2,'fun')
		var b = obj2.fun;
		l(b())

		l(obj1.fun);
		l(obj2.fun);

		l(obj1);
		l(obj2);
	}


	/* 
	 * 研究案例6:原生bind
	 * 没有bind之前，call可以改变this
	 * bind之后，call就无效了，和直接调用是一样的
	 * 案例1中也有call无效的概念，也许bing实现的原理就是案例1中所言的道理
	 */
	bee.case06 = function(){
		var obj={
			myName:'111',
			xxx:function(){return this.myName;}
		};
		var obj2={myName:'222'};

		l(obj.xxx.call(obj2))
		obj.xxx = obj.xxx.bind(obj);
		l(obj.xxx.call(obj2));
		l(obj.xxx());
	}


	/* 
	 * 研究案例7:原生bind
	 * 看看bind的第1个参数之后的其他参数，作为新函数默认传入的参数
	 * 于是真正函数调用的唯一参数“cc”其实是第三个参数了
	 */
	bee.case07 = function(){
		var func = function( a,b,c ) {
		    return a+b+c
		}
		myFunc = func.bind( null, 'aa','bb' );
		console.log( myFunc('cc') );
	}


	/* 
	 * 研究案例8:自己写一个类似于_.bind的简单例子
	 * myBind利用原生的bing很好实现
	 */
	bee.case08 = function(){
		var obj2 = {
			appName:'大鱼一条',
			fun:function (){return this.appName;}
		}
		function myBind(myFunc,AttrName){
			myFunc[AttrName] = myFunc[AttrName].bind(myFunc);
		}

		var b = obj2.fun;
		l(b());
		l(b.call({appName:'用call可以改变this'}));

		myBind(obj2,'fun')
		var b = obj2.fun;
		l(b());
		l(b.call({appName:'用call可以改变this'}));
	}


	/* 
	 * 研究案例9:自己写一个类似于_.bind的简单例子
	 * 这里不用bind的情况下也实现了上案例8的功能
	 * 由此可见，underscore的_.bindAll,基本上就是用这里提到的方法实现的
	 * 当然我这里是简答的实现，是原理级的
	 * 刚才看了_.bindAll源码，正如我所言
	 */
	bee.case09 = function(){

		var obj2 = {
			appName:'大鱼一条',
			fun:function (){return this.appName;}
		}
		function myBind(myFunc,AttrName){

			//不要写成注释中的那样，堆栈会溢出
			/*myFunc[AttrName] = function(){
				return myFunc[AttrName].call(myFunc);
			}*/

			//正确使用
			//这里的操作，说白了就是把obj2.fun改造了，把原来的this用闭包代替了
			var fun = myFunc[AttrName];
			myFunc[AttrName] = function(){
				return fun.call(myFunc);
			}
		}

		var b = obj2.fun;
		l(b());
		l(b.call({appName:'用call可以改变this'}));

		myBind(obj2,'fun')
		var b = obj2.fun;
		l(b());
		l(b.call({appName:'用call可以改变this'}));
	}


	/* 
	 * 研究案例10:函数把自己返回
	 * 把自身返回的效果，可以用作链式调用法
	 * 返回自身的行为，比普通函数更加复杂
	 */
	bee.case10 = function(){

		function fun(){
			return fun;
		}
		l(fun()()()==fun);

	}


	/* 
	 * 研究案例11:函数改变自身的效果
	 * 这样子的函数很有混淆性，因为他在运行时，改变了自身
	 * 所以我们从词法角度去看原函数时候，不是很明了
	 */
	bee.case11 = function(){

		var fun = function(){
			fun = function(){
				return 123;
			}
		}
		l(fun);
		fun();
		l(fun);

	}


	/* 
	 * 研究案例12:函数调用自身
	 * 这其实是递归实现原理，如果没有终止条件，就会进入死循环，如下代码
	 */
	bee.case12 = function(){

		function fun(){
			fun();
		}
		fun();

	}


	/* 
	 * 研究案例13:被函数作用域屏蔽的值
	 * 通常，没有var声明的变量是全局的，然而下面情况并不是
	 * 函数fun中的“a=a;”其实是函数的参数中的a，外层的a因为和fun函数同名，所以被屏蔽了。
	 * 第二种情况就没有
	 */
	bee.case13 = function(){

		var a = 123;
		function fun(a){
			a = a;
			return a;
		}
		l(fun(222));
		l(a);

		var b = 'aaa';
		function fun2(a){
			b = a;
			return a;
		}
		l(fun2('bbb'));
		l(b);

	}


	/* 
	 * 研究案例14:案例11的扩展，同时也是对案例09中内存溢出的那种情况的解释
	 * 第一种情况，把obj.fun寄存到xxx是正确的操作
	 * 第二种看上去很像第一种，其实不然
	 * “obj2.fun=...”的操作会立即生效，导致“obj2.fun()“会马上执行，于是变成了函数自身调用，死循环一个
	 * 因此呢，要解决第二种问题，其实第一种寄存的方案就是其解决方案呢
	 */
	bee.case14 = function(){

		var obj = {
			fun:function (){return 123;}
		}
		var xxx = obj.fun;
		obj.fun = function(){
			return xxx();
		}
		l(obj.fun());

		var obj2 = {
			fun:function (){return 123;}
		}
		obj2.fun = function(){
			return obj2.fun();
		}
		l(obj2.fun());

	}




	return bee;
})(bee || {});

//bee.case14();














