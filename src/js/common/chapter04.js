/*******************************
* 第四章 细碎知识点
* 原型、位操作
* js异常处理
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:数组为空时
	 */
	bee.caseD1 = function(){

		var arr =[];
		for(var i=0;i<arr.length;i++){
			l('我不会输出');
			l(fun('即使有没有定义的函数执行，也是不会报错的哦'));
		};

	}

	/* 
	 * 研究案例2:循环push同一个对象
	 */
	bee.caseD2 = function(){

		var obj = {a:123};
		var arr = [];
		for(var i=0;i<5;i++){
			arr.push(obj);
		};
		l(arr);
		arr[0].a=999;
		l(arr)

	}

	/* 
	 * 研究案例3:原型研究
	 * 这个主要是和案例4的对比
	 * 最大的区别在于，案例4只继承原型上的属性，案例3会继承实例全部的属性
	 * 其他差异比较小，可以观察两者的log结果
	 */
	bee.caseD3 = function(){

		function Animal(){}
		Animal.prototype.a=123;
		function Fish(){}
		Fish.prototype = new Animal();
		var fish = new Fish;
		l(fish);
	}

	/* 
	 * 研究案例4:原型研究
	 */
	bee.caseD4 = function(){

		function Animal(){}
		Animal.prototype.a=123;
		function Fish(){}
		Fish.prototype = Animal.prototype;
		var fish = new Fish;
		l(fish);

	}

	/* 
	 * 研究案例5:代码重用机制 mixin模式
	 * 这里 stateMachine（共享状态机） 模块起到了公用的作用
	 * 之所以它能过灵活的运用，关键在于 stateMachine 中 this的作用
	 */
	bee.caseD5 = function(){

		function extend(obj,obj2){
			for(var i in obj2){
				obj[i] = obj2[i];
			}
			return obj;
		}
		var obj1  = {a:123};
		var obj2  = {b:222};
		//共享模块
		var stateMachine = {
			fun:function(){
				return this;
			}
		}
		var newObj1 = extend(obj1,stateMachine);
		var newObj2 = extend(obj2,stateMachine);
		l(newObj1.fun());
		l(newObj2.fun());
	}

	/* 
	 * 研究案例6:声明
	 * 连续的声明顺序是从左边到右边
	 */
	bee.caseD6 = function(){
		var a = 111,b=222+a;
		l(b);
		var c = 1+d,d=2;
		l(c);
	}

	/* 
	 * 研究案例7:二进制
	 */
	bee.caseD7 = function(){
		//二进制转为十进制
		//用2进制解析 1010111，返回十进制的结果 87
		l(parseInt(1010111,2))
		l(parseInt('1010111',2))

		//十进制转为而二进制（字符串形式）
		var a = 87;
		a = a.toString(2);
		l(a);
	}

	/* 
	 * 研究案例8:二进制、位与操作
	 * 85等于二进制1010101
	 * 如果 a & 85 结果还是等于85
	 * 就表示 a 的1、3、5、7位都为1（87等于二进制1010111）
	 */
	bee.caseD8 = function(){
		var a = 87;
		l((a & 85) == 85);
	}

	/* 
	 * 研究案例9:“位或”运算
	 * 位操作的结果是十进制的哦
	 */
	bee.caseD9 = function(){
		var a = parseInt(1001,2);
		var b = parseInt(1110,2);
		l((a).toString(2));
		l((b).toString(2));
		l(a|b);
	}

	/* 
	 * 研究案例10:“位或”运算
	 * 位操作的结果是十进制的哦
	 */
	bee.caseD10 = function(){
		var a = parseInt(0x3,16);
		var b = parseInt(0x8,16);
		l((a).toString(2));
		l((b).toString(2));
		//结果为11，注意这个是十进制的数字。刚才误理解为二进制了，然后就傻了一会
		l(a|b);
	}

	/* 
	 * 研究案例11:强大的“位或”运算
	 */
	bee.caseD11 = function(){
		l((12.2).toString(2)) //看看12.2的二进制

		l(12.2|0)    //去掉了小数点后的内容
		l('12.2'|0)  //字符形式的数字也能处理
		l('ss'|0)    //这个最强大了，转化为0，若用parseInt("sss")的话，会返回NaN
		l(0.999|0)
		l((-1)|0)
		l([]|0)
		l({}|0)
		l({a:123}|0)
		l(0x3|0)
	}

	/* 
	 * 研究案例12: 混淆的同名
	 * obj.$ 方法中包含$函数（和方法同名）的调用，那么这个$到底是谁呢？
	 * 事实证明，不可能是obj.$的~
	 * 但是这样子的写法总是怪怪的，最好避免下吧。
	 */
	bee.caseD12 = function(){

		var $ = function(x){return x;}
		var obj = {
			$:function(){
				return $("xixi");
			}
		}
		l(obj.$());
	}

	/* 
	 * 研究案例13: arguments研究
	 */
	bee.caseD13 = function(){

		function fun(){
			l(arguments);
			l(typeof arguments);
			l(arguments instanceof Object);
			l(arguments instanceof Array);
			l(Object.prototype.toString.call(arguments));
			//arguments不是真实的数组，所以没有forEach这样子的数组方法
			/*arguments.forEach(function(i){
				l(i);
			})*/

			//转化为数组之后
			var arr = _.toArray(arguments);
			l(arr);
			l(arr instanceof Object);
			l(arr instanceof Array);
			arr.forEach(function(i){
				l(i);
			})

			return (function fish(a,b,c){
				return a+b+c;
			//}).apply(null,arguments);
			}).apply(null,arr);
		}
		l(fun(11,22,33));

		//获得arguments的引用，可以用来做什么呢？
		function fun2(){
			return arguments;
		}
		var thisArguments= fun2();
		l(thisArguments);
		l(Object.prototype.toString.call(thisArguments));

		//对于原生的数组方法concat而言，下面两种是一样的
		l([99,77,88].concat([123]));
		l([99,77,88].concat(123));
		//如果参数对象的话，就直接添加在末尾，同上面的第二种
		l([99,77,88].concat({a:'haha'}));
		//显然thisArguments这里被处理成对象了
		l([99,77,88].concat(thisArguments));
	}

	/* 
	 * 研究案例14: 数组拷贝
	 */
	bee.caseD14 = function(){

		var arr = [11,22,33];
		//这两种方式其实是一样的~
		var arrCopy1 = Array.prototype.slice.call(arr);
		var arrCopy2 = arr.slice();
		l(arr);
		l(arrCopy1);
		l(arrCopy2);
		l(arr == arrCopy1);
		l(arr == arrCopy2);
		l(arrCopy1 == arrCopy2);
	}

	/* 
	 * 研究案例15:NaN
	 */
	bee.caseD15 = function(){
		l(NaN);
		l(!NaN);
		l(!!NaN);
		if(NaN)l(111);
		if(!NaN)l(222);
		l(NaN==undefined);
		l(typeof NaN);
		l(NaN == NaN);
		l(NaN != NaN);
	}

	/* 
	 * 研究案例16:保证最小值
	 */
	bee.caseD16 = function(){
		var base =1;
		var v=4;
		l(Math.max(base,v));
		var v=-1;
		l(Math.max(base,v));
	}

	/*
	 * 研究案例17:数组方法——sort排序
	 */
	bee.caseD17 = function(){
		var lessThan = function(a,b){
			if(a<b){
				return true;
			}else{
				return false;
			}
		};
		var isEqual = function(a,b){
			if(a==b){
				return true;
			}else{
				return false;
			}
		};
		function comparator(fun){
			return function(a,b){
				if(fun(a,b))
				    return -1;
				//else if(!fun(a,b))
				else if(fun(b,a))
					return 1;
				else
					return 0;
			}
		};
		var arr = [1,-3,5,3,-9];
		l(arr.sort(comparator(lessThan)));

		//这里isEqual 和 comparator 组合就是有问题的
		//第一次获取1，和-3，因为不等，所以return 1,表示交换
		//这里都是不同的数字，所以每次都会进行交换
		//最后的结果成了“反序”
		var arr2 = [1,-3,5,3,-9];
		l(arr2.sort(comparator(isEqual)));

	}

	/* 
	 * 研究案例18:数组方法——sort排序
	 * 这个例子很简单，需要深入封装的话，可以参看_.sortBy的源码，非常优秀
	 */
	bee.caseD18 = function(){
		var arr = [{a:0},{a:-1},{a:1}]
		arr.sort(function(left,right){
			if(left.a>right.a)return 1;
			if(left.a<right.a)return -1;
			return 0;
		});
		l(arr)
	}

	/* 
	 * 研究案例19:apply
	 * apply 巧妙的化解“[]”结构。
	 */
	bee.caseD19 = function(){
		
		var arr1 = [99];
		var arr2 = [77];
		var arr3 = [88];
		var r = [99].concat([77],[88]);
		l(r);
		var r = [99].concat([77,88]);
		l(r);

		function cat(){
			var first = arguments[0];
			var rest = Array.prototype.slice.apply(arguments,[1]);
			
			//这样子是由问题的，因为rest中的结构是 [[77],[88]] 
			//return first.concat(rest);
			
			//这里灵活地运用了apply，将[[77],[88]]中外层的[]结构化解了，非常巧妙！
			return first.concat.apply(first,rest);

			//这里绑定对象不能为null
			//return first.concat.apply(null,rest);
			
			//这中写法也是可以的，只是这个first就没有用上了，被字符串“代理”了！
			//return first.concat.apply(['居然还可以这样子'],rest);
			
		}

		var r2 = cat(arr1,arr2,arr3);
		l(r2);
	}

	/* 
	 * 研究案例20:call
	 * 本来想用call随便写一个，改变函数参数调用结构的
	 * 然后写着写着就写出了下面的例子
	 * 最后发现，这个例子就是《函数式编程》中，那个unsplat函数
	 * 现在总算纯熟的掌握了
	 */
	bee.caseD20 = function(){
		
		function fun(arr){
			return arr.join('-');
		}

		function change(fn){
			return function(){
				
				//直接使用arguments，是不可以的，不是真正的数组
				//var arr = arguments;
				
				//拷贝生成一个真正的数组
				var arr = Array.prototype.slice.call(arguments,0);
				
				//注意这里call的用法很精妙
				return fn.call(null,arr);
			}
		}

		//原来的调用形式
		var r1 = fun([99,77,88]);
		l(r1);

		//被change改变完之后的函数的用法
		var r2 = change(fun)(99,77,88);
		l(r2);
	}

	/* 
	 * 研究案例21:apply
	 * 随便实现《函数式编程》中，那个splat函数（就是这里的change）
	 * 由此可见，call、apply可以非常灵活的改变参数的形式
	 */
	bee.caseD21 = function(){
		
		function fun(a,b,c){
			return a+b+c;
		}

		function change(fn){
			return function(){
				
				//这里直接用arguments，不数组也是可以的
				var arr = arguments;		

				//拷贝生成一个真正的数组
				//var arr = Array.prototype.slice.call(arguments,0);
				
				//注意这里apply的用法很精妙
				return fn.apply(null,arr[0]);
			}

			//这样子就更加精炼
			/*return function(arr){
				return fn.apply(null,arr);
			}*/
		}

		//原来的调用形式
		var r1 = fun(111,222,333);
		l(r1);

		//被change改变完之后的函数的用法
		var r2 = change(fun)([111,222,333]);
		l(r2);

	}

	/* 
	 * 研究案例22:apply
	 * 利用apply部分改变函数addBy的参数调用形式
	 * addBy(obj,key1,key2...)
	 * newAddBy(obj,[key1,key2...])
	 * 这个一种在高阶函数中最为常用的手段,在undersore、async的源码中多有出现
	 * 以前还不是很纯熟，掌握下面这种模式就可以一通百通。
	 */
	bee.caseD22 = function(){
		
		var obj={
			a:1,
			b:2,
			c:44,
			d:100
		};
		function addBy(obj){
			var rest = Array.prototype.slice.call(arguments,1);
			var sum = 0;
			rest.forEach(function(v,i){
				sum += obj[v];
			});
			return sum;
		}

		function change(fn){
			return function(obj,arr){
				var fist = obj;
				var rest = arr;
				var arr = [obj].concat(rest);
				return addBy.apply(null,arr);
			}
		}

		l(addBy(obj,'a','c','d'));
		l(change(addBy)(obj,['a','c','d']));
		l(change(addBy)(obj,['a','a','a','a']));

	}

	/*
	 * 研究案例23:元编程
	 * 感觉是不是和案例5中的mixin模式有共同之处呢
	 * 这里也是利用了this的作用
	 */
	bee.caseD23 = function(){

		function Fish(name){
			this.name = name;
		}
		function Whale(weight,name){
			
			//直接这样使用是不行的
			//Fish();
			//需要把Fish构造器绑定到当前this才可以哦
			Fish.call(this,name);
			this.weight = weight;
		}
		var whale = new Whale(126,'lala');
		l(whale);
	}

	/* 
	 * 研究案例24:模板中的变量渲染
	 */
	bee.caseD24 = function(){

		var obj = {
			name:'lala',
			desc:'貌美如花'
		}
		var tmpl = '{{name}}看上去20来岁的样子，长得{{desc}}';
		function randerTmpl(tmpl,obj){
			for(var i in obj){
				var reg = new RegExp('{{'+i+'}}','g');
				tmpl = tmpl.replace(reg,obj[i]);
			}
			return tmpl;
		}
		var r = randerTmpl(tmpl,obj);
		l(r);
	}

	/* 
	 * 研究案例25: 判断对象是否为对象自变量
	 * 自己来实现JQ的 isPlainObject 
	 */
	bee.caseD25 = function(){

		//这个是简化版本的，严谨方案可以参考jquery
		function isPlainObject(xxx){
			return Object.prototype.hasOwnProperty.call( xxx.constructor.prototype, "isPrototypeOf");
		}
		l(isPlainObject({a:213}))
		l(isPlainObject($('body')))

		//这个是个反例...
		//照理来说，这个也算是对象自变量了，但是因为prototype上的constructor 被修改了
		l(isPlainObject($.prototype))

		//不过jquery这个新版本的里面判断没有错误！
		//因为 它的实现和我研究的那个2.0.3不是一个版本
		//这里的版本的源码我看了 是用了 Object.getPrototypeOf 来获取原型
		//就没有问题了
		l($.isPlainObject($.prototype))
	}

	/* 
	 * 研究案例25_2: 判断对象是否为对象自变量
	 */
	bee.caseD25_2 = function(){

		function isPlainObject(xxx){
			//这里优化了下，用call感觉是很奇怪
			return xxx.constructor.prototype.hasOwnProperty("isPrototypeOf");
		}
		l(isPlainObject({a:213}))
		l(isPlainObject($('body')))
	}

	/* 
	 * 研究案例26: .constructor.prototype 和 __proto__ 的区别 【BOSS】
	 */
	bee.caseD26 = function(){

		//通过 hasOwnProperty 就可以检测jquery对象的继承层级
		//实例对象中的hasOwnProperty肯定不是实例自己的
		l('==>1')
		l($('body').hasOwnProperty('hasOwnProperty'))

		l('==>2')
		l($('body').__proto__===jQuery.prototype)
		//jQuery.prototype 就是一个对象自变量哦~ 但是任何对象自变量也会继承自Object中的原型（它才具备有hasOwnProperty方法）哦。
		l($('body').__proto__.hasOwnProperty('hasOwnProperty'))

		l('==>3')
		//这个时候就是Object上的原型对象了，必然有自己的属性“hasOwnProperty”
		l($('body').__proto__.__proto__===Object.prototype)
		l($('body').__proto__.__proto__.hasOwnProperty('hasOwnProperty'))


		l('==>4')
		//jquery实例的constructor是jQuery，这是内部制定好的。
		l($('body').constructor==jQuery)
		//那么这个其实就是指的jQuery构造函数的原型对象（就是有一堆方法的那个对象）
		l($('body').constructor.prototype)
		//所以这里是相等的，没有什么疑问吧
		//我以前就得出结论“.constructor.prototype 效果同 __proto__”，但是这个并不是完全对的，比如下面这个就不行：
		l($('body').constructor.prototype == $('body').__proto__)

		l('==>5')
		//按照上面的理论，应该是等效的啊！
		l( $('body').constructor.prototype.constructor.prototype == $('body').__proto__.__proto__);
		//不要着急，我们先来简化下：
		var thatPrototypeObject = jQuery.prototype;
		l( thatPrototypeObject.constructor.prototype == thatPrototypeObject.__proto__);  //标记为（1）
		//再来分别观察：
		//使用“.constructor.prototype”这种会进入一个死循环。。。
		l( thatPrototypeObject.constructor.prototype == jQuery.prototype);
		//利用上面这个，将（1）简化
		//到这里的时候，我们就可以知道，为什么返回的是false了。
		l( jQuery.prototype == jQuery.prototype.__proto__);

		/* 
		 * 小结
		 * 1.也就是说 $('body').constructor.prototype 之后，无论加多少个“.constructor.prototype” 结构都是一样的结果。进入了一个死循环。
		 * 这是因为，人为修改了constructor的指向，导致的。因为本来jQuery那个原型的constructor 应该是Object才对！
		 * 2.而__proto__ 这个呢！是不会因为后期修改而改变的，人家还是认为是那个Object!! 
		 * 这个就是使用 .constructor.prototype 和 __proto__ 的区别！
		 * 也就是说__proto__ 能够真正找到那个构造他的函数，而 .constructor.prototype 却不行！因为可以被修改！！！
		 */
		
		l('==>6')
		l(jQuery.prototype
			== jQuery.prototype.constructor.prototype.constructor.prototype.constructor.prototype.constructor.prototype)
		l(jQuery.prototype.__proto__==Object.prototype)
	}


	/* 
	 * 研究案例27: Object.getPrototypeOf
	 * 这个其实就是 谷歌浏览器支持的 __proto__ !!
	 * 我们用这个来代替上面的例子中的__proto__ 看看
	 */
	bee.caseD27 = function(){
		//完美！
		l( Object.getPrototypeOf(jQuery.prototype) == jQuery.prototype.__proto__);
	}

	/* 
	 * 研究案例28: 随机数字生成器 
	 * 这里只生成4位，如果要多位，就多调用本函数几次就好
	 * 比如下面这个就可以基于这个函数来生成：
	 * b5c2f892-365c-4bb0-2c03-70a43d955046
	 */
	bee.caseD28 = function(){
		function guidGenerator() {
	    	var n;
	    	
	    	//生成小数点后约17位的小数（0-1）。
	    	n = Math.random();
	    	l(n);
	    	
	    	//加1
	    	n = 1+n;
	    	l(n);
	    	
	    	//乘以十六进制的10000（值等同于十进制的 16*16*16*16=65536）
	    	//n原来是一个大于1的数，乘以这个10000之后的十六进制，比10000要大
	    	//这样子做的目的是，后来转成十六进制，一定是个五位数（方便提起其后四位）
	    	//另外记住，任何十六进制和十进制处理，最后都转化为十进制！
	    	//比如 0x10*10 的值就是 160。
	    	n = n*0x10000;
	    	l(n);
	    	
	    	//caseD11中已经有此说明：可以用来去掉小数点后面的位数！
	    	n = n|0;
	    	l(n);

	    	//转成5位数的十六进制
	    	n = n.toString(16);
	    	l(n);
	    	l(typeof n); //十六进制的一定是字符串格式的

	    	//从第一位开始截取，到最后，共4位随机十六进制字符串~ 完成
	    	n = n.substring(1);
	    	l(n);
	       	
	       	return n;
		}
		l(guidGenerator())

	}



	/**************************************************************
	* js异常处理
	***************************************************************/

	/* 
	 * 研究案例29: 未捕获异常 之 语法错误
	 */
	bee.caseD29 = function(){
		/*var fish = {
			age:1;
			name:'xx';
		}*/

		//语法错误，这种错误不同于运行时错误。错误马上回被抛出，即使是在未调用的函数中出现。
	}


	/* 
	 * 研究案例29_2: 未捕获异常 之 js运行时错误
	 * 运行时错误只有在运行的时候出现问题，才会出错。
	 */
	bee.caseD29_2 = function(){
		var xxx=  function (){
		    return JSON.parse(',')
		}
		var yyy = function(){
		    xxx();
		}
		yyy();

		//未捕获的运行时错误会被抛出，js环境生成一个有用的堆栈轨迹。
		//我们可以观察下这个案例中的堆栈轨迹。
		//
		//这个案例还是单页的js出错，如果涉及到跨js文件的，会稍微复杂点点。
	}


	/* 
	 * 研究案例30: catch捕获异常 之 语法错误
	 */
	bee.caseD30 = function(){
		
		/*try{
			, //这个是错误的语法
		}catch(e){
			l('语法有问题哦！')
		}*/

		//语法错误无法用catch捕获。
	}


	/* 
	 * 研究案例30_2: catch捕获异常 之 运行时错误
	 */
	bee.caseD30_2 = function(){
		
		try{
			JSON.parse(',')
		}catch(e){
			l(e)
			l(typeof e)
			l('错误被捕获');
		}

		//运行时错误被catch捕获。
		//需要注意的是，catch(e) 中的e是不能缺省的。
	}


	/* 
	 * 研究案例30_3: catch 是反模式
	 */
	bee.caseD30_3 = function(){

		try{
			throw 'xx';  //他会忽略掉错误之后的代码
			alert('这里的将不会被执行！');
		}catch(e){
			l('有报错');
		}
		l('结束啦~');
	}


	/* 
	 * 研究案例31: 异步错误
	 */
	bee.caseD31 = function(){
		var xxx=  function (){
		    return JSON.parse(',')
		}
		var yyy = function(){
			
		    //嵌套了几个异步的操作
			window.setTimeout(function(){
				window.setTimeout(function(){
					window.setTimeout(function(){
						xxx();
					},0)
				},0)
			},0)

		}
		yyy();

		//运行时错误中，有异步的内容的时候，抛出的堆栈是缺省的。
		//只有从当前异步的错误触发，往后的才能被捕获。
	}


	/* 
	 * 研究案例31_2: 异步错误 如何捕获？
	 */
	bee.caseD31_2 = function(){
		
		//对异步函数（window.setTimeout），进行捕获，是失败的。
		try{
			window.setTimeout(function(){
				JSON.parse(',')
			},0)
		}catch(e){
			l(e);
		}

		//还有在异步函数的回调中进行捕获才是可以的。
		window.setTimeout(function(){
			try{
				JSON.parse(',')
			}catch(e){
				l(e);
			}
		},0)

		//当然也不是所有的异步函数都是不能被捕获，也有特例。
		//比如下面这个node的代码中的 fs.watch 本身是一个异步的。
		//但是它也有同步的特性，比如第一个参数是不存在的文件，这个错误是同步的就能被捕获。
		/*var fs = require('fs');
		try{
			fs.watch('不存在的文件.js',function(){
			    console.log('错误被捕获！')
			})
		}catch(e){console.log('xxx')}*/

		//上面这些案例说明了，异步的函数的错误，通常只能在回调中进行处理。
		//所以，在node中，异步回调函数中的第一个参数是一个错误的对象。
	}


	/* 
	 * 研究案例31_3: 异步错误处理
	 */
	bee.caseD31_3 = function(){
		
		//上面caseD31_2说明了，异步的函数的错误，通常只能在回调中进行处理。
		//所以，在node中，异步回调函数中的第一个参数是一个错误的对象。
		//fs.readFile('xxx',function(err,data){})
		//那么，在浏览器端如何处理？
		
		function $get(a,failureFun){
			//模拟一个异步的错误
			setTimeout(function(){
				try{
					throw new Error('服务器没有响应');
				}catch(e){
					failureFun(e);
				}
			},0);
		}

		$get('/data',function(e){
			l('===>');
			l(e);
		});

		//接口变化
		/*$get('/data',{
			failure:function(e){
				l('===>');
				l(e);
			}
		});*/

		//客户端的处理，其实是没像node那样子的统一。这是模拟jquery.get的做法。
		//其实，其原理还是在异步函数的回调函数中处理错误。
		//
		//回调中抛出的错误，由调用回调的那个人来处理异常。
	}


	/* 
	 * 研究案例32: 忽略 未捕获的错误
	 */
	bee.caseD32 = function(){

		//注意，这个是一定要放在前面的。
		//另外，这个错误仅限于运行时错误，不包含语法错误。语法错误不能捕获，也不能忽略。
		window.onerror = function(err){
			l('这个错误会被忽略 ==> '+err)			
			return true;
		}
		JSON.parse(',');

		//window.onerror 除了可以忽略错误之外，还可以把错误的信息进行个性化的处理。
		//（比如发送错误数据到指定的服务器这样子的处理）
		//
		//在node中，也有 uncaughtException事件 和 Domain事件化对象 来处理全局异常处理。
	}


	/* 
	 * 研究案例33: 错误处理的最佳实践 —— throw
	 */
	bee.caseD33 = function(){
		//两者的用法几乎一样的
		throw '错啦！';
		//throw new Error('错啦！');

		//总结：关于错误的处理的最佳实践是什么？
		//答案只有一个，抛出（throw），不要使用try...catch!
		//抛出，也分成两种情况：
		//1）一种就是因为“未捕获”，而被浏览器自动抛出（就是我们常见的）。
		//2）一种是类似node中的异步操作中的回调函数，已经把错误对象捕获好了（没有捕获的时候为null）
		//  你要做的就是，判断是否为null，然后手动的抛出！！
	}




	return bee;
})(bee || {});


//bee.caseD27();








