/*******************************
* 第九章
* 正则表达式研究
* 这个是我的软肋啊，一定要搞定
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:正则对象 实例化
	 * 实例化方法有两种：
	 */
	bee.caseI1 = function(){

		var r1 = /abc/g ; 
		var r2 = new RegExp('abc','g') ; 
		var r3 = new RegExp(/abc/,'g') ; 
	}



	/*******************************
	* 正则对象的3个方法
	********************************/

	/* 
	 * 研究案例2:正则对象 方法：exec
	 */
	bee.caseI2 = function(){

		var r = /cde/;
		//var r = /(c)d(e)/;
		//var r = /CDE/;   //不匹配的时候，返回null
		//var r = /CDE/i;  //i：忽略大小写
		var arr = r.exec('abcdefg-abcdefg'); 
		l(arr);         //存放匹配结果的数组
		l(arr.length);  //匹配的个数
		l(arr[0]);      //匹配的那个字符串
		l(arr.index);   //开始匹配的索引起始位置
		l(arr.input);	//被匹配的字符串
	}

	/* 
	 * 研究案例3:正则对象 方法：exec
	 * 来个比上面例子复杂点的
	 */
	bee.caseI3 = function(){

		var r = /(c)d(e)/;
		var arr = r.exec('abcdefg-abcdefg'); 
		l(arr);         
		l(arr.length);  
		l(arr[0]);      
		l(arr[1]);      //子表达式匹配的文本（就是括号中的）
		l(arr[2]);      //子表达式匹配的文本（就是括号中的）
		l(arr.index);   
		l(arr.input);	

		//这里的字符串的match方法，得到和上面一样的结果。
		//（注意：仅当非全局正则对象）
		l('abcdefg-abcdefg'.match(/(c)d(e)/));
	}

	/* 
	 * 研究案例4:正则对象 方法：exec
	 * 继续加大难度
	 */
	bee.caseI4 = function(){

		var r = /cde/g;
		
		l(r.lastIndex);  //这里用到正则对象的一个属性，一开始为0
		var arr = r.exec('abcdefg-abcdefg'); 
		l(arr); 

		l(r.lastIndex);  //检索1次后，开始检索起始下标为5
		var arr = r.exec('abcdefg-abcdefg'); 
		l(arr); 

		l(r.lastIndex);  //检索2次后，开始检索起始下标为13
		var arr = r.exec('abcdefg-abcdefg'); 
		l(arr); 

		l(r.lastIndex);  //检索完毕，重置为0

		//这里的字符串的match方法
		//当为全局正则对象，获得数组包含，多次匹配的结果字符串的数组。
		l('abcdefg-abcdefg'.match(r));
		
		/*
		 * 重要事项：如果在一个字符串中完成了一次模式匹配之后要开始检索新的字符串，就必须手动地把 lastIndex 属性重置为 0。
		 * 提示：请注意，无论 RegExpObject 是否是全局模式，exec() 都会把完整的细节添加到它返回的数组中。
		 * 这就是 exec() 与 String.match() 的不同之处，后者在全局模式下返回的信息要少得多。
		 * 因此我们可以这么说，在循环中反复地调用 exec() 方法是唯一一种获得全局模式的完整模式匹配信息的方法。
		 */
	}

	/* 
	 * 研究案例5:正则对象 方法：exec
	 * 应用！
	 * 一个重要的循环模式！
	 */
	bee.caseI5 = function(){

		var r = /cde/g;
		var str = 'abcdefg-abcdefg';
		var arr; 

		while((arr=r.exec(str))!==null){
			console.log(arr);
			console.log(r.lastIndex);
		}
	}

	/* 
	 * 研究案例6:正则对象 方法：test
	 * 这个相比exec就简单多了！！
	 */
	bee.caseI6 = function(){

		var r = /cde/g;
		var str = 'abcdefg-abcdefg';
		l(r.test(str));

		//等价于
		l(r.exec(str)!==null); //看看exec方法多么灵活！
	}

	/* 
	 * 研究案例7:正则对象 方法：compile
	 * 这个方法，说是是用于改变或者重新编译正则。感觉好像没啥用。。
	 */
	bee.caseI7 = function(){

		var str = 'abcdefg-abcdefg';

		//开始不匹配
		var r = /xxx/;
		l(r.test(str));

		//重新编译之后，匹配
		r.compile(/cde/);  //感觉等效于：r = /cde/g;
		l(r.test(str));
	}
	/*
	 * 到目前为止，正则对象的3个方法全部学完！！
	 * 容易和字符串的那个几个和正则相关的方法混淆。这里有个好的办法来记忆：
	 * 字母数量在4个或者7个的是正则对象的，其他的是字符串对象的！
	 * 好记吧！
	 */



	 /*******************************
	 * 3个修饰符
	 ********************************/

	 /* 
	  * 研究案例8:正则 修饰符
	  * 超级简单
	  */
	 bee.caseI8 = function(){
	 	l(/abc/g);     //全局匹配，案例3和4的match方法就因为这个g标志，有不同结果。
	 	l(/abc/i);     //忽略大小写匹配，这个简单不说了
	 	l(/abc/m);     //多行匹配，这个目前还没有合适的例子，看到实际问题再增加吧。
	 }


	 /*******************************
	 * 正则对象的5个属性
	 ********************************/

	 /* 
	  * 研究案例9:正则对象 属性
	  * 超级简单
	  */
	 bee.caseI9 = function(){
	 	l(/abc/.source);      //获取字符串形式  
	 	l(/abc/g.global);     //是否有g标志
	 	l(/abc/i.ignoreCase); //是否有i标志
	 	l(/abc/m.multiline);  //是否有m标志
	 	l(/abc/.lastIndex);   //之前已经出现了，不在细说
	 }




	return bee;
})(bee || {});

//bee.caseI9();


