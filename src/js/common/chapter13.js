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
			},
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
				},
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
				},
			}
		}

		var n1 = kingCreate().getName();
		l(n1);
		var n2 = kingCreate('兰陵王').getName();
		l(n2);
		var n3 = kingCreate('兰陵王').setName('甄姬').getName();
		l(n3);
	}






	return bee;
})(bee || {});

//bee.caseM4();




















