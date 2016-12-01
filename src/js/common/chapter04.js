/*******************************
* 第四章
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
	 * 最大的区别在于，本例中只继承原型上的属性，而下例中也会继承实例本身的属性
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
		//通过 hasOwnProperty 就可以检测jquery对象的继承层级
		l($('body').hasOwnProperty('hasOwnProperty'))
		l($('body').__proto__.hasOwnProperty('hasOwnProperty'))
		l($('body').__proto__.__proto__.hasOwnProperty('hasOwnProperty'))
	}





	return bee;
})(bee || {});


//bee.caseD25();



