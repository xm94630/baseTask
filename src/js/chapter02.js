/*******************************
* 第二章
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:函数表达式
	 * 这个案例执行会报错，因为return中的函数，也属于函数表达式
	 * 函数表达式的特征：
	 * 声明不会提前，这里的aaa只是函数标识符，只有在函数内部作用域识别
	 */
	bee.caseB1 = function(){

	    function fun(){
	    	aaa();
	    	return function aaa(){
	    		l(123);
	    	} 
	    }
	    fun();

	}

	/* 
	 * 研究案例3:函数表达式
	 * 这里再次验证了这个结论：
	 * aaa只是函数标识符，只有在函数内部作用域识别
	 */
	bee.caseB2 = function (){

	    function fun(){
	    	return function aaa(){
	    		l(aaa);
	    	}
	    }
	    fun()();

	}

	/* 
	 * 研究案例3:函数表达式
	 * 有报错
	 * 原理同案例1、2
	 * 这里的aaa只是函数标识符，只有在函数内部作用域识别
	 */
	bee.caseB3 = function(){

		var fun = function aaa(){
			l(aaa);
		}
		fun();
		l(aaa);

	}

	/* 
	 * 研究案例4:函数表达式
	 * 原理同上
	 * nnn是函数标识符，只有在函数内部作用域识别
	 * bee.caseB4调用的时候，log是生效的
	 */
	bee.caseB4 = function nnn(){

		l(nnn);

	}

	/* 
	 * 研究案例5:函数调用
	 * 这里是一个非常简单的一个函数，在没有被调用的时候，它什么也不是
	 * 第一次调用的时候，会创建一个函数对象
	 * 内部声明的变量a，在内存中分配空间
	 * 函数调用完毕，a就被销毁了，所以说函数中的局部变量的声明周期仅仅在函数内部（当然也有例外）
	 * 第二次调用的时候，是一样的，同样会声明一个变量，但是和上一个并不是同一个内存地址了，这点要明白
	 */
	bee.caseB5 = function (){

	    function fun(){
	    	var a = 123;
	    	return a;
	    }
	    l(fun());
	    l(fun());

	}

	/* 
	 * 研究案例6:函数调用
	 * 只要函数（bee.caseB5）不调用，nnn函数中的内容就算出错（这里fun没有定义）也没有关系（除非是语法错误）
	 * 再次验证：在没有被调用的时候，它什么也不是
	 */
	bee.caseB6 = function nnn(){

	    fun();

	}


	/*****************************************************
	 * 这个算是这次研究的最为重要的成果了
	 *****************************************************/
	/* 
	 * 研究案例7:引用
	 * 这个例子会为后面的讲解做铺垫，所以需要讲一下
	 * 看是很简答的问题，却非常容易错
	 * 给a赋值，值是对象，所以值引用
	 * b = a,表示的是b获取和a相同的引用，所以l(b===a)的结果是true
	 * 但是，不要以为两者全等了，a和b就是同一个东西，你我不分，融为一体了，错！
	 * 其实a还可以改变引用，去引用另一个对象
	 * 这个时候b还是引用的原来的，并不会因为和a全等了，也跟着a改姓了
	 */
	bee.caseB7 = function(){

		var a = {xxx:111};
		var b = a;
		l(b===a)
		a = {yyy:222};
		l(b);

	}

	/* 
	 * 研究案例8:
	 * 
	 */
	bee.caseB8 = function(){

		function fun(fn){
			l(fun==fn)
			fn = {};
			l(fun);
			l(fn);
		}
		fun(fun)

	}

	/* 
	 * 研究案例9:
	 * 
	 */
	bee.caseB9 = function(){
		l(bee)
		bee = {};
		l(bee)

	}




	return bee;
})(bee || {});



//bee.caseB5();

/*
bee.caseB7();
l('-->')
l(bee)*/





bee.caseB8()











/*var a = ({fun:function(){return this}}).fun();tj

var fun = ({fun:function(){return this}}).fun;
l(fun())*/



/*var a = function b(){l(b);}
l(a);
l(a());*/


//函数aaa所在作用域
//函数aaa体内作用域,函数体内的变量（比如bbb）对外部是不可见的。（也验证了上面的道理）
/*function aaa(){
	function bbb(){};
	bbb();
}*/





/*function a(){
	var x=100000;
	return {
		aaa:function(n){x=x+n},
		get:function(){return x}
	}
}
var b = a()
b.aaa(10)
b.aaa(50)
b.aaa(80)
l(b.get())*/



/*var bee2 = (function(bee2){
	bee2.aaa = function(){};
	bee2.bbb = function(){
		//bee2 = {}
		return bee2;
	}
	return bee2;
})(bee2||{})

l(bee2.bbb()===bee2);
l(bee2);*/






/*function fun(fun){
	l(fun==fun)
	fun = {};
	l(fun);
	l(fun);
}
fun(fun)
l(fun)*/















