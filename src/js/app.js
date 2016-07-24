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
	return bee;
})(bee || {});

//bee.case01();







