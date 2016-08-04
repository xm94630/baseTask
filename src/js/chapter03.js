/*******************************
* 第三章
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:worker
	 * worker也是异步的，和ajax、setTime系列是同样的道理
	 */
	bee.caseC1 = function(){

		var worker =new Worker("../js/morejs/worker.js");
		worker.postMessage("这是后来输出的文字");  		
		worker.onmessage =function(e){   
	        console.log(e.data);
		}
		l('先输出这个文字')

	}

	/* 
	 * 研究案例2:worker可以提交的数据
	 * 支持下面7种数据，注释的是不可以传递的
	 * 函数是不可以传递的，对象可以，不过对象中包含函数的形式也是不可以的-
	 */
	bee.caseC1 = function(){

		var worker =new Worker("../js/morejs/worker.js");
		worker.postMessage('文本');  		
		worker.postMessage({a:'啦啦'});  		
		//worker.postMessage({a:function(){}});  		
		worker.postMessage([1,2,3]);  		
		worker.postMessage(document.getElementById('xxx'));  		
		worker.postMessage(/abc/);  		
		worker.postMessage(123);  		
		worker.postMessage(undefined);  		
		//worker.postMessage(function(){});  		
		//worker.postMessage(this);  		
		//worker.postMessage(window);  		
		//worker.postMessage(document);  		
		//worker.postMessage(document.getElementsByTagName('body'));
		worker.onmessage =function(e){   
	        console.log('可以支持传递的数据类型（不含dom对象等）：'+Object.prototype.toString.call(e.data));
		}

	}

	/* 
	 * 研究案例3:worker
	 */
	bee.caseC3 = function(){

		var worker =new Worker("../js/morejs/worker.js");
		worker.postMessage("啦啦");  		
		//这个写法和worker.onmessage是一致的
		worker.addEventListener('message',function(e){   
	        console.log(e.data);
		})
	}

	/* 
	 * 研究案例4:in
	 * 这个可以判断是否为一个对象的属性
	 * 还支持原型上的属性呢
	 */
	bee.caseC4 = function(){
		var obj = {
			aaa:123
		}
		l('aaa' in obj)
		l('toString' in obj)
	}

	/* 
	 * 研究案例5:定时器
	 * 定时器使用的时候回返回一个句柄，其实就是一个整数，从1开始，每次增加一个定时器就返回中值就加1
	 * 我们也可以通过这个值来取消定时器
	 */
	bee.caseC5 = function(){

		var c = setTimeout(function(){l('取消调用');fun(d)},1000);
		var d = setInterval(function(){l('调用了')},200);
		l(c);
		l(d);
		function fun(holder){
			clearTimeout(holder);
		}

	}

	/* 
	 * 研究案例6:定时器
	 * 这个例子其实还是很有难度的，原因在于fun是一个异步递归的执行，而且是一个0秒之后就要递归的！
	 * 我开始觉得，这样子的话岂不是xxx的改变永远也不会发生，因为异步递归永远会占用着堆栈。
	 * 其实并不是这样子的：
	 * 异步递归确实会比xxx改变先跑起来，毕竟人家0秒之后就要触发的，不过一旦执行回调的时候，里面的代码执行总是要花时间的
	 * 所以执行一段时间之后，花去的时间总会越来越多，这个时候，xxx改变的那个计时器一直在运行，总有一刻的时候，它的计时器也变成了0
	 * 同样是0秒之后执行，排在序列前面的回调总会优先执行，这个时候xxx改变的回调触发了！！
	 * 紧接着，fun的递归回调也马上执行，发现xxx值改变了，于是结束了递归！
	 *
	 * 一定要记住，这种异步递归是一种反模式，消耗的内存是很大的
	 */
	bee.caseC6 = function(){

     	var xxx=0;
		setTimeout(function(){l('我是第1个异步调用，只有在1秒后才能执行');xxx=1;},1000);

		function fun(){
			if(xxx!=1){
				setTimeout(function(){
					l('等待中...');
					fun();
				},0);
			}else{
				l('异步递归结束，之前一直在等待xxx值的改变')
			}
		}

		fun();


	}
	

	return bee;
})(bee || {});




bee.caseC6();



