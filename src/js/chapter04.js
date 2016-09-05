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
	 * 研究案例12:
	 */
	bee.caseD12 = function(){
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
	 * 研究案例13:元编程
	 * 感觉是不是和案例5中的mixin模式有共同之处呢
	 * 这里也是利用了this的作用
	 */
	bee.caseD13 = function(){

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
	 * 研究案例14:模板中的变量渲染
	 */
	bee.caseD14 = function(){

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



	return bee;
})(bee || {});


bee.caseD14();






























