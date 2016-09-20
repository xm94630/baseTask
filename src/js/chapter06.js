/*******************************
* 第五章
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:递归
	 * 递归规则
	 * 1）函数：run
	 * 2）停止：n<=0
	 * 2）一步：l('跑了1步');
	 * 2）剩余：n-1；
	 * 虽然简单，但足以说明本质
	 */
	bee.caseF1 = function(){

		function run(n){
			if(n<=0){
				l("结束");
			}else{
				l('跑了1步');
				run(n-1);
			}
		}
		run(10);
	}

	/* 
	 * 研究案例2:console.log的诡异表现
	 * 这个实例在上次的时候是有问题的
	 * 而然今天打印出结果的时候又是好了，有点奇怪
	 */
	bee.caseF2 = function(){

		var a=1;
		l(a);
		a=2;
		l(a);

		//当出现问题的时候，这里两次输出的b，都是一样的
		//而且浏览器的控制台确实也给出了响应的提示
		var b=[];
		l(b);
		b.push(3);
		l(b);

		var c={};
		l(c);
		c.xxx='yyy';
		l(c);

		var d={dd:[]};
		l(d);
		l(d.dd);
		d.dd=[123];
		l(d);
		l(d.dd);
	}


	/* 
	 * 研究案例3:模拟事件绑定
	 * 这个模式还是很常见的，比如，动态作用域的模拟也是用的类似的
	 * 这里的‘fun1’本应该是回调函数，这里就用字符串简单的表示了
	 * 这个是我自己实现的，下面会有一个优化的版本
	 */
	bee.caseF3 = function(){
		var arr = {'click':['fun1','fun2'],'mousemove':['fun10']};
		function dealWith(k,v){
			arr[k] = arr[k]?arr[k]:[];
			for(var i=0;i<arr[k].length;i++){
				if(arr[k][i]==v) return;
			}
			arr[k].push(v);
		}
		dealWith('click','fun3');
		l(arr);
		dealWith('click','fun3');
		l(arr);
		dealWith('mouseup','fun8');
		l(arr);
	}

	/* 
	 * 研究案例4:模拟事件绑定（优化版本1）
	 */
	bee.caseF4 = function(){
		var arr = {'click':['fun1','fun2'],'mousemove':['fun10']};
		function dealWith(k,v){
			//这个版本用了stack这个局部变量来代替原来的arr[k]，会好很多。
			//另外原来的三目运算的表达式看上去为什么这么累赘...在早期的时候，我都是用if条件来处理的，用了三目表达式我还觉得有了进步，其实还有更好的||、&&也有此供功效
			var stack = arr[k] || [];
			for(var i=0;i<stack.length;i++){
				if(stack[i]==v) return;
			}
			stack.push(v);
		}
		dealWith('click','fun3');
		l(arr);
		dealWith('click','fun3');
		l(arr);
		dealWith('mouseup','fun8');
		l(arr);
	}


	return bee;
})(bee || {});

bee.caseF4();














