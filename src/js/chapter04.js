/*******************************
* 第三章
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

	return bee;
})(bee || {});



bee.caseD2();


















