/*******************************
* 第十三章 链式 
********************************/

var bee = (function(bee){

	//研究案例1: 链式 最简单的开始
	bee.caseM1 = function(){
		var obj = {
			fun1:function(){l(1);return this;},
			fun2:function(){l(2);return this;}
		}
		obj.fun1().fun2();
	}


	//研究案例2: 这里添加一些配置的数据吧
	bee.caseM2 = function(){

		var obj = {
			name:'程咬金',
			setName:function(name){
				this.name = name || this.name;
				return this;
			},
			getName:function(){
				return this.name;
			}
		}
		var n = obj.setName('兰陵王').getName();
		l(n);
		var n = obj.getName();
		l(n);

		//这个模式的特点是，每次引用obj的时候，都是同一个对象，我也不能在创建一个相同类型的对象。
		//在案例三中就用了闭包，有了新的特征！
	}


	//研究案例3: 这里，我们把之前的 obj对象 改成函数的形式
	//这样子会更加的灵活
	bee.caseM3 = function(){

		//创建一个王者
		function kingCreate(){
			var name = "程咬金";
			return {
				setName:function(n){
					name = n;
					return this;
				},
				getName:function(){
					return name;
				}
			}
		}

		var n1 = kingCreate().setName('兰陵王').getName();
		l(n1);
		var n2 = kingCreate().getName();  //因为闭包的作用，这里就不是那个兰陵王了，是程咬金
		l(n2);

		//比较案例2的用法：
		//var n = obj.setName('兰陵王').getName();
		//原来的对象，变成了这里的函数。这里的函数内部还有闭包的成分，显然比案例2的形式更加的高级。
	}


	//研究案例4: 把数据抽出来 
	bee.caseM4 = function(){

		//创建一个王者
		function kingCreate(name){
			var name = name||'程咬金';
			return {
				setName:function(n){
					name = n;
					return this;
				},
				getName:function(){
					return name;
				}
			}
		}

		var n1 = kingCreate().getName();
		l(n1);
		var n2 = kingCreate('兰陵王').getName();
		l(n2);
		var n3 = kingCreate('兰陵王').setName('甄姬').getName();
		l(n3);
	}


	//研究案例5: 现在我们把 kingCreate 挂在到一个对象上
	bee.caseM5 = function(){

		var king = {
			kingCreate : function(name){
				var name = name||'程咬金';
				return {
					setName:function(n){
						name = n;
						return this;
					},
					getName:function(){
						return name;
					}
				}
			}
		}

		//这种情况下，使用还是差不多的，结果也一样
		var n1 = king.kingCreate().getName();
		l(n1);
		var n2 = king.kingCreate('兰陵王').getName();
		l(n2);
		var n3 = king.kingCreate('兰陵王').setName('甄姬').getName();
		l(n3);

		//需要注意的是：链式调用在 kingCreate 之后才开始（才使用return this）,在getName函数终止（没有在return this了）。
		//对于 king 本身并没有可以链式的（至少我这里没有这样子做）
		//所以，getName 方法在king上还是没有的哦~ 使用下面的会报错：
		
		//var n4 = king.getName();
		//l(n4);

		//我这里的模式，其实是等价于 underscore 中的：
		//_.chain({}).cort().value();
		//_就好比我的king，chain是链式的开始，就好比我的kingCreate
		//value是链式的终止，就好比我的getName。

		//不同之处是，我的链式只是采用了比较简单的字符串的处理。
		//而他则是对数组和对象的高级操作！
	}

	//研究案例6: 在链式中 打入！（围棋的术语）
	//高阶函数大展身手！
	bee.caseM6 = function(){

		var king = {
			kingCreate : function(name){
				var name = name||'程咬金';
				return {
					setName:function(n){
						name = n;
						return this;
					},
					getName:function(){
						return name;
					},
					tap:function(fun){
						fun(name);
						return this;
					}
				}
			}
		}

		//通过tap就可以提取链中的数据
		king.kingCreate('兰陵王').setName('孙悟空').tap(function(n){
			l('我就是'+n);
		}).setName('甄姬').getName();
	}








	return bee;
})(bee || {});

//bee.caseM4();




















