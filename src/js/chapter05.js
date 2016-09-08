/*******************************
* 第五章
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:this
	 * 属性中的this并不是指代 people
	 * 方法中的this才指 people
	 */
	bee.caseE1 = function(){

		l(this);
		var people={
			a:this   
		};
		l(people.a==this);
	}

	/* 
	 * 研究案例2:this
	 * this到底指代什么，只要看this所在的那个函数是如何被使用的
	 * 无非就四种：函数的方法、直接调用、new调用、call(apply)调用
	 * 下面的案例就展示了这4种情况
	 */
	bee.caseE2 = function(){

		l('==>1');
		l(this);
		function aaa(){
			l('==>2');
			l(this);
			new bbb();
		}
		function bbb(){
			l('==>3');
			l(this);
		}
		function ccc(){
			l('==>4');
			l(this);
		}
		aaa();
		ccc.call('我是文本');
	}

	/* 
	 * 研究案例3:this
	 * this的其他的用法
	 */
	bee.caseE3 = function(){

		var that = this;
		var arr = [this];
		l(that);
		l(arr[0]);

		l(this.toString());
		//+操作其实就是字符串的合并，默认也执行了this.toString()
		l(this+0);
		//除了+之外的运算，得到的结果为NaN
		l(this/0);
	}

	/* 
	 * 研究案例4:this.a 和 var a 
	 * 这里同时在fun函数中出现this.a和var a的情况，其实处理起来也是很简单的：
	 * this指代谁，就看函数如何使用，这里用了call，于是this指代的是obj对象
	 * var a还是作为还是的私有变量存在
	 */
	bee.caseE4 = function(){

		function fun(){
			this.a = 111;
			this.b = 222;
			var a = 'haha';
			return a;
		}

		var obj = {a:999};
		l(fun.call(obj));
		l(obj);
	}

	/* 
	 * 研究案例5: this.a 和 var a 
	 * 使用new调用的情况，上下文是一个新的{}，this指向这个新的对象
	 * 返回的也是这个处理后的对象
	 * 那个return的是个数字类型的就被忽视了（如果是对象就另当别论，见案例6）
	 */
	bee.caseE5 = function(){

		function fun(){
			this.a = 111;
			this.b = 222;
			var a = 'haha';
			return a;
		}

		var obj = {a:999};
		l(new fun());
	}

	/* 
	 * 研究案例6: this.a 和 var a 
	 * 那个return的是个对象类型，把新的实例给干掉了
	 */
	bee.caseE6 = function(){

		function fun(){
			this.a = 111;
			this.b = 222;
			var a = 'haha';
			return {
				'name':a
			};
		}

		var obj = {a:999};
		l(new fun());
	}

	/* 
	 * 研究案例7: 函数作用域
	 * 本例中，fun函数并没有定义a，却也能读取a的值
	 */
	bee.caseE7 = function(){

		var a = 1;
		function fun(){
			return a;
		}
		l(fun());
	}

	/* 
	 * 研究案例8: 函数作用域
	 * 本例中，fun函数并没有定义a，却也能读取a的值
	 * 结合案例9
	 */
	bee.caseE8 = function(){

		var a = 1;
		function fun(){
			return a;
		}
		l(fun());
	}

	/* 
	 * 研究案例9: 用this模拟函数作用域
	 * 结合案例8
	 */
	bee.caseE9 = function(){

		function fun(){
			return this.a;
		}
		l(fun.call({a:1}));
	}

	/* 
	 * 研究案例10: 函数作用域
	 * 本例中，fun函数定义了a，外层也有a，内部屏蔽了外层的a
	 */
	bee.caseE10 = function(){

		var a = 1;
		function fun(){
			var a = 2;
			return a;
		}
		l(fun());
	}

	/* 
	 * 研究案例11: 用this模拟函数作用域
	 * 这个基本上是用this来说明了案例10中函数作用域的原理
	 */
	bee.caseE11 = function(){

		function fun(){
			this.a = 2;
			return this.a;
		}
		l(fun.call({a:1}));
	}

	/* 
	 * 研究案例12: 变量屏蔽
	 */
	bee.caseE12 = function(){

		function fun(){
			var a = '我会被屏蔽';
			return function(){
				//只有声明，没有赋值，默认为undefined
				var a;
				l(a);
			}
		}
		fun()();
	}

	/* 
	 * 研究案例13: 泄漏的闭包
	 * 其实下面的这种情况可是标准的闭包
	 * return出去的a维持了对最外层的那个a的引用（根据作用域原理，再外层的都能捕获呢）
	 * 不过呢，这个距离有点遥远...
	 * 那个外层的a并没有被保护起来，可以随便被改动
	 * 这样子闭包的意义就不存在了
	 * 所以闭包要捕获的，一定是被立即执行的函数所保护的，比如注释处a才是合适的位置
	 */
	bee.caseE13 = function(){

		var a = 1000;
		function fun(){
			//把上面的a放在这里才是私有的哦
			//var a = 1000;
			return {
				v:a,
				add:function(){
					a++;
				},
				get:function(){
					return a;
				}

			}
		}
		var newFun = fun();
		newFun.add();
		l(newFun.get());
		newFun.add();
		newFun.add();
		l(newFun.get());
		//a还可以在这里直接修改，就比较坑人了
		a = 10;
		newFun.add();
		l(newFun.get());
	}
	
	/* 
	 * 研究案例14: 泄漏的闭包
	 * 本例子和案例12完全一个意思
	 * 然而这个例子就来源于《函数式编程》，58页的案例
	 * 说的就是我案例12的道理，现在有看到书这里，有了共鸣
	 * 说明我这部分已经掌握的很纯熟了，哈哈
	 */
	bee.caseE14 = function(){

		function fun(obj){
			return function(){
				return obj;
			}
		}
		var fish = {width:100};
		var newFun = fun(fish);
		l(newFun());
		fish.width = 200;
		l(newFun());
	}

	/* 
	 * 研究案例15: 前馈函数
	 * 本例子很简单，思想很重要
	 * pipe实现原来就来源于此
	 */
	bee.caseE15 = function(){

		var result=1;
		function fun(n){
			return 2*n;
		}
		while(result<1000){
			
			//之前把代码写成这样子了，结果页面就渲染不出来了，我以为是gulp中的依赖文件出问题了呢。
			//fun(result);
			result = fun(result);
		}
		l(result);
	}

	/* 
	 * 研究案例16: 使用函数，而不是值
	 * 本例子很简单，思想很重要
	 * 用实现2代替实现1
	 */
	bee.caseE16 = function(){

		//实现1
		function repeat(n,value){
			return _.map(_.range(n),function(){
				return value;
			});
		}
		l(repeat(3,"hello~"));

		//实现2
		function repeat2(n,fun){
			return _.map(_.range(n),fun);
		}
		l(repeat2(3,function(){
			return "hello~";
		}));
	}

	/* 
	 * 研究案例17: 默认值
	 * 这里直接设计defaults这个函数的时候，其实我自己也是蒙圈了
	 * 后来想想，如果从实现目标来反推，是不是就清晰多了
	 * 比如：defaults({a:123})({a:undefined},'a')
	 * 首先，它是个高阶函数，有两个‘()’,
	 * 第1对是，默认值的设置
	 * 第2对是，获取对象的某个属性
	 * 这样子的思路，再来设计defaults就明确多了
	 */
	bee.caseE17 = function(){

		//为函数添加默认参数
		function fnull(fun){
			var rest = Array.prototype.slice.call(arguments,1);
			return function(){
				var args = _.map(arguments,function(v,i){
					return v==null?rest[i]:v;
				});
				return fun.apply(null,args);
			}
		}
		function abc(a,b,c,d){
			return a+b+c+d;
		}
		var safe = fnull(abc,0,0,0,0);
		l(safe(undefined,9,null,91));

		//获取对象的默认值
		function defaults(obj){
			return function(o,k){
				var val = fnull(_.identity,obj[k]);
				return o && val(o[k]);
			}
		}
		l(defaults({a:123})({a:undefined},'a'));
	}



	return bee;
})(bee || {});


bee.caseE17();
























