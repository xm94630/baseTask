/*******************************
* 第六章
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:递归
	 * 递归规则
	 * 1）函数：run
	 * 2）停止：n<=0
	 * 2）一步：l('跑了1步');
	 * 2）剩余：n-1；
	 * 虽然简单，但足以说明本质
	 */
	bee.caseF1 = function(){

		function run(n){
			if(n<=0){
				l("结束");
			}else{
				l('跑了1步');
				run(n-1);
			}
		}
		run(10);
	}

	/* 
	 * 研究案例2:console.log的诡异表现
	 * 这个实例在上次的时候是有问题的
	 * 而然今天打印出结果的时候又是好了，有点奇怪
	 */
	bee.caseF2 = function(){

		var a=1;
		l(a);
		a=2;
		l(a);

		//当出现问题的时候，这里两次输出的b，都是一样的
		//而且浏览器的控制台确实也给出了响应的提示
		var b=[];
		l(b);
		b.push(3);
		l(b);

		var c={};
		l(c);
		c.xxx='yyy';
		l(c);

		var d={dd:[]};
		l(d);
		l(d.dd);
		d.dd=[123];
		l(d);
		l(d.dd);
	}


	/* 
	 * 研究案例3:模拟事件绑定
	 * 这个模式还是很常见的，比如，动态作用域的模拟也是用的类似的
	 * 这个模式应该还会出现在“发布订阅模式”（node中的EventEmitter）
	 * 这里的‘fun1’本应该是回调函数，这里就用字符串简单的表示了
	 * 这个是我自己实现的，下面会有一个优化的版本
	 */
	bee.caseF3 = function(){
		var arr = {'click':['fun1','fun2'],'mousemove':['fun10']};
		function dealWith(k,v){
			arr[k] = arr[k]?arr[k]:[];
			for(var i=0;i<arr[k].length;i++){
				if(arr[k][i]==v) return;
			}
			arr[k].push(v);
		}
		dealWith('click','fun3');
		l(arr);
		dealWith('click','fun3');
		l(arr);
		dealWith('mouseup','fun8');
		l(arr);
	}

	/* 
	 * 研究案例4:模拟事件绑定（优化版本1）
	 */
	bee.caseF4 = function(){
		var arr = {'click':['fun1','fun2'],'mousemove':['fun10']};
		function dealWith(k,v){
			//这个版本用了stack这个局部变量来代替原来的arr[k]，提高变量读取效率。
			//另外原来的三目运算的表达式看上去为什么这么累赘...在早期的时候，我都是用if条件来处理的，用了三目表达式我还觉得有了进步，其实还有更好的||、&&也有此供功效
			arr[k] = arr[k] || [];
			var stack = arr[k];
			for(var i=0;i<stack.length;i++){
				if(stack[i]==v) return;
			}
			stack.push(v);
		}
		dealWith('click','fun3');
		l(arr);
		dealWith('click','fun3');
		l(arr);
		dealWith('mouseup','fun8');
		l(arr);
	}

	/* 
	 * 研究案例5:模拟事件绑定（优化版本2）
	 * 这里用闭包的形式进行配置
	 */
	bee.caseF5 = function(){
		var arr = {'click':['fun1','fun2'],'mousemove':['fun10']};

		function deal(operate){
			return function(k,v){
				arr[k] = arr[k] || [];
				var stack = arr[k];
				//更加灵活
				operate(stack,v);
				//如果stack为空了，就把键删除了
				stack.length || delete arr[k];
				return;
			}
		}

		function bind(stack,v){
			for(var i=0;i<stack.length;i++){
				if(stack[i]==v) return;
			}
			stack.push(v);
		}

		function unbind(stack,v){
			for(var i=0;i<stack.length;i++){
				if(stack[i]==v){
					//注意，这里用的是splice（从数组中添加删除）,会改变原数组，而slice（从数组中提取）不会
					stack.splice(i,1);
					return;
				}
			}

		}

		var bind = deal(bind);
		bind('click','fun3');
		l(arr);
		bind('click','fun3');
		l(arr);
		bind('mouseup','fun8');
		l(arr);

		var unbind = deal(unbind);
		unbind('click','fun3');
		unbind('click','fun2');
		unbind('click','fun1');
		l(arr);
	}

	/* 
	 * 研究案例6:BOSS 函数结构的相互转换
	 * 本例子涉及高阶函数之“部分应用”
	 * 例子中的变化非常灵活，其中可以看出apply的灵活之处，当然闭包也是少不了的
	 * 也可以看到arguments在其中被各种切割和拼接
	 */
	bee.caseF6 = function(){

		// 部分应用一个参数的函数
		// 能把 f(a,b,c) 的形式改变成 f(a)(b,c),当为f(a)时候，为期待两个参数的函数
		function partical1(fun,arg1){
			return function(/*args*/){
				var restArgs = Array.prototype.slice.apply(arguments,[0]);
				var args = [arg1].concat(restArgs);
				return fun.apply(fun,args);
			}
		}

		//本函数用 fun(f,a,b,c) 的形式代替常见的 f(a,b,c) 形式
		function fun(fn/*args*/){
			var restArgs = Array.prototype.slice.apply(arguments,[1]);
			return fn.apply(fn,restArgs);
		}

		//本函数是常见的计算全部参数之和
		var getSum = function(){
			var sum = 0;
			for(var i=0;i<arguments.length;i++){
				sum += arguments[i];
			}
			return sum;
		}

		//一下三种模式是一样的意思，但是根据需要变化，很是灵活
		l(getSum(11,22,33));
		l(fun(getSum,11,22,33));
		l(fun(partical1(getSum,11),22,33))
	}

	/* 
	 * 研究案例7:arguments拼接
	 * fun内部调用了getSum，对初始的参数做了变化
	 */
	bee.caseF7 = function(){

		//本函数是常见的计算全部参数之和
		var getSum = function(){
			var sum = 0;
			for(var i=0;i<arguments.length;i++){
				sum += arguments[i];
			}
			return sum;
		}
		//一个期待参数的函数，在内部使用的使用，还不知道怎么去用参数呢~
		function fun(/*args*/){
			//这个是参入的参数
			var thisArgs = Array.prototype.slice.apply(arguments,[0]);
			//真正使用的时候，其实只是一部分而已
			var args = thisArgs.concat([500,500]);
			return getSum.apply(getSum,args);
		}
		l(fun(1,2))
	}

	/* 
	 * 研究案例8:检测
	 */
	bee.caseF8 = function(){

		//构造函数调用检测
		function _classCallCheck(instance, Constructor) { 
			if (!(instance instanceof Constructor)) { 
				throw new TypeError("不能像函数一样直接调用构造函数"); 
			} 
		}
		function Fish() {
		    _classCallCheck(this, Fish);
		    this.name = '鲸鱼';
		};
		//直接这样子使用是会报错的
		//Fish()
		
		//使用new调用就好了
		var f = new Fish();
		l(f);
	}

	/* 
	 * 研究案例9:Object.create 
	 * 这个之前就研究过，写成印象笔记的日志了
	 * 现在需要添加到这里
	 */
	bee.caseF9 = function(){
		var obj1= Object.create({});
		var obj2= {};

		//可以看出，原型链的末端就是一个Object的空实例
		//用了Object.create构建的obj1，在原型链上比直接实例的obj2，要多出一个链节
		l(obj1.__proto__.__proto__);
		l(obj2.__proto__);

		//这里的构造函数都是Object
		l(obj1.constructor==Object);
		l(obj2.constructor==Object);
	}

	/* 
	 * 研究案例10:Object.create 和 原型继承的方法 是相通的
	 */
	bee.caseF10 = function(){
		function Fish (){
			this.a = 123;
		}

		var obj1= Object.create(new Fish());  //使用Fish的实例
		var obj2= {a:123};

		l(obj1.__proto__.__proto__);
		l(obj2.__proto__);

		l(obj1.constructor); //构造器使用是Fish
		l(obj2.constructor);

		function Fish (){
			this.a = 123;
		}

		l('');
		l('===>等效于');
		l('');

		function Jing (){}
		Jing.prototype = new Fish();

		var obj1= new Jing();  //使用Jing的实例
		var obj2= {a:123};

		l(obj1.__proto__.__proto__);
		l(obj2.__proto__);

		l(obj1.constructor); //构造器使用是Fish
		l(obj2.constructor);
	}

	/* 
	 * 研究案例11:封装一个和 Object.create 等效的函数 createObject
	 */
	bee.caseF11 = function(){
		function Fish (){
			this.a = 123;
		}
		function createObject(object){
			var Fun = function(){};
			Fun.prototype = object;
			return new Fun;
		}

		var obj1= createObject(new Fish());   //使用Fish的实例
		var obj2= Object.create(new Fish());  //使用Fish的实例

		l(obj1.__proto__);
		l(obj2.__proto__);

		l(obj1.__proto__.__proto__);
		l(obj2.__proto__.__proto__);

		l(obj1.constructor); //构造器使用是Fish
		l(obj2.constructor);
	}

	/* 
	 * 研究案例12:惊叹！对象还有这样子的写法！！
	 * 我学了那么多年的js，第一次知道这个。
	 */
	bee.caseF12 = function(){

		//第一种
		function say(){l('还可以这样子!!')}
		var fish = {say} //通过这个函数的引用名字，作为对象的键
		l(fish);
		l(fish.say);

		//第二种
		var width = 100;
		var getWidth = function(){
			return this.width;
		}
		var bigFish = {say,width,getWidth,aaa:'也支持这样子的混合写法...'}
		l(bigFish)
		l(bigFish.getWidth());

		
		//第三种
		//支持匿名函数，键值为'function'
		//当有多个匿名函数的时候，以最后的覆盖前面的！
		var obj = {function(){alert(1)},function(){alert(2)}};
		l(obj.function);


		//这样子确是不行的，只有变量是可以如此做
		/*var obj = {1,2,3,4}
		l(obj)*/
		
		//这样子写也是有问题的
		/*var obj = {function xxx(){}};
		l(obj);*/

		//这样子也是不行的
		/*function require(){
			var a=function(){}
			return a;
		}
		var x = {require()}*/
	}

	/* 
	 * 研究案例13: for in
	 * 有一次我看到这个模式的时候，突然晕菜了。不知道for in中的match是啥了。
	 */
	bee.caseF13 = function(){

		//这里是match的初始值
		var match = [null,'yy',null];
		var context = {html:'xxx',title:'hi'};
		//这里是for in中match和上面的初始值没有关系，这里的match是循环获取
		//context对象中的key值
		for ( match in context ) {
			//每次获取key值的时候，match的值都会得到更新
			l(match);
		}
		//最后match的值是“title”。
		l('===>');
		l(match);
	}

	/* 
	 * 研究案例14: 长的像数组的对象
	 */
	bee.caseF14 = function(){

		//这个对象用字符串形式的数字作为key,使用的时候很像数组。
		//但是并没有数组默认的length属性
		//当然数组的很多方法都是没有的，毕竟他不是数组。
		var fish ={
			0:'haha',
			1:'xixi'
		}
		l(fish);
		l(fish[0]);
		l(fish.length);

		//但是我们可以手动添加一个length的方法的
		//这样子看上去真的像个数组，但是log出来的时候，就有Object标示
		//而jquery的实例似乎也是这样子的对象，为何log出来有“[]”符号？感觉好像是数组，其实也是Object。
		//可以用 Object.prototype.toString.apply($('body')) 判断
		//jquery是如何做到的出现[]的呢？
		var fish2 ={
			0:'haha',
			1:'xixi',
			content:'xxx',
			length:2
		}
		l(fish2);
		l(fish2[0]);
		l(fish2.length);
	}

	/* 
	 * 研究案例13: for
	 * 再来一种不常用的写法
	 */
	bee.caseF13 = function(){
		var i = 0,
		    length = 10;
		//for中，第一部分的内容省略的写法，我自己写的时候没有尝试过
		for(;i<length;i++){
		}
	}

	/* 
	 * 研究案例14: random
	 */
	bee.caseF14 = function(){
		var r = Math.random();
		l(r);
		//仔细观察随机数的长度，常见范围为16-20之间，一般为18个。
		//这个长度的规则还不是很明确。
		l(r.toString().length);
		//这个是把随机数字，处理成字符串的方法
		l(r.toString().replace(/\D/g,''));
	}

	/*
	 * 研究案例15: 长的像对象的数组
	 */
	bee.caseF15 = function(){

		var fish =[77,88,99];
		l(fish);
		l(fish.length);

		var fish2 =[77,88,99];
		fish2.xixi = 'xixi';
		l(fish2);
		l(fish2.length); //这个不会变化

		//直接这样子写是不对的
		//var fish3 = [77,88,99,'xixi':'xixi'];
	}

	return bee;
})(bee || {});











