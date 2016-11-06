/*******************************
* 第十章
* 正则表达式研究 实战
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:科学计数法
	 */
	bee.caseJ1 = function(){

		//有了上一个章节的铺垫，这个式子分析就简单多了
		//其实就是科学计数法的匹配
		var r = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/;  
		l(r.test('123'));
		l(r.test('+123'));
		l(r.test('-123'));
		l(r.test('+123.'));
		l(r.test('+123.123'));
		l(r.test('+123.123E100'));
		l(r.test('+123.123E-100'));
		l(r.test('+123.123e-100'));
		l(r.test('+123.123e-123'));
		l(r.test('+.123e-123'));
	}

	/* 
	 * 研究案例2:[\w\W]+ 
	 */
	bee.caseJ2 = function(){

		var r1 = /[\w]+/;
		var r2 = /[\W]+/;
		l(r1.exec('123abc'));    	
		l(r1.exec('.-'));    	
		l(r1.exec(' '));    	
		l(r1.exec('\n'));  
		l(r1.exec('你好'));  
		l('-------------------------');  
		l(r2.exec('123abc'));    	
		l(r2.exec('.-'));    	
		l(r2.exec(' '));    	
		l(r2.exec('\n'));   
		l(r2.exec('你好'));
		l('-------------------------');  
		//匹配任何字符	
		l(/[\w\W]+/.exec('你好，123abc-.?/n/t'));
		l(/[\s\S]+/.exec('你好，123abc-.?/n/t'));
	}

	/* 
	 * 研究案例3:jquery中用到的一个正则
	 * 这里就有[\w\W]+
	 */
	bee.caseJ3 = function(){

		var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
		l(rquickExpr.test('<div>'));    	//true
		l(rquickExpr.test('  <div>'));		//true
		l(rquickExpr.test('  <div>  '));	//true
		l(rquickExpr.test('<标签>'));	    //true
		l(rquickExpr.test('<<>'));	        //true
		l(rquickExpr.test('<<>>>>>'));	    //true
		l(rquickExpr.test('<div'));	        //false,没有关闭
		l(rquickExpr.test('<img src=a onerror=alert()>'));	//true        //false,没有关闭
		l('---------')
		l(rquickExpr.test('#'));	        //true
		l(rquickExpr.test('#123-abc'));	    //true
		l(rquickExpr.test('#123-abc.'));	//false，不包含点
	}

	/* 
	 * 研究案例4: \1、\2
	 * 这样子用于对对应括号的配对用的，用来保证一样的字符
	 */
	bee.caseJ4 = function(){

		var rsingleTag = /^(\w+)-\1/;
		l(rsingleTag.test('123-123'));             //true
		l(rsingleTag.test('xm94630-xm94630'));     //true
		var rsingleTag = /^(abc)(\w+)-\1/;
		l(rsingleTag.test('abc9-abc'));            //true
		var rsingleTag = /^(abc)(\w+)-\2/;
		l(rsingleTag.test('abc9-9'));              //true 
	}

	/* 
	 * 研究案例5:空标签
	 */
	bee.caseJ5 = function(){

		var rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
		l(rsingleTag.test('<div></div>'));     //true
		l(rsingleTag.test('<div ></div>'));    //true
		l(rsingleTag.test('< div></div>'));    //false,\w字母数组
		l(rsingleTag.test('<div></span>'));    //false
		l(rsingleTag.test('<div/>'));          //true
		l(rsingleTag.test('<div  />'));        //true
		l('---------')
		//true,下面这个其实是不合理的，但是这个正则也是允许的！
		l(rsingleTag.test('<div  /></div>'));  
	}

	return bee;
})(bee || {});


//bee.caseJ4();




