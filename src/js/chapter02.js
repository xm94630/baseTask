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
	 * 研究案例2:函数表达式
	 * 这里再次验证了这个结论：
	 * aaa只是函数标识符，只有在函数内部作用域识别
	 */
	bee.caseB2 = function nnn(){

	    function fun(){
	    	return function aaa(){
	    		l(aaa);
	    	}
	    }
	    fun()();

	}








	return bee;
})(bee || {});

bee.caseB2();




















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





/*
var xxx=0;
function a(){
	var xxx=1;
	function b(){
		xxx=2;
	}
	b();
}
a();
l(xxx)*/


/*var i=0;
function a(){
	var i=1;
	function b(){
		for(i=0;i<10;i++);
	}
	b();
}
a();
l(i)*/

