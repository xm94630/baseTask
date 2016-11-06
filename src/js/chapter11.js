/*******************************
* 第十一章
* async.js
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1: series方法
	 * 这个其实对第八章 bee.caseH4 的一个完美解决方案。
	 * 这里的callback扮演者极其重要的角色！
	 * 其实我在自己实现的时候，也有了这个思想的萌芽，但是还是不知道具体如何运用
	 * 另外，这里async.series传入参数结构更加的丰富，我想在内部应该更加好控制
	 */
	bee.caseK1 = function(){

		async.series({
		    one: function(callback) {
		        setTimeout(function() {
		        	l('1（异步）：一秒后出现');
		            callback(null);
		        }, 1000);
		    },
		    two: function(callback){
		        l('2（同步）：步骤1完毕，马上出现');
		        callback(null);
		    },
		    tree: function(callback) {
		        setTimeout(function() {
		        	l('3（异步）：步骤2完毕之后，再一秒后出现');
		            callback(null);
		        }, 1000);
		    },
		}, function(err, results) {});
	}


	/* 
	 * 研究案例2: series方法 重组代码
	 * 这里对案例的代码重新组合，为的是将结构调整的更加像第八章 bee.caseH4 中的实现
	 */
	bee.caseK2 = function(){

		var serial = async.series

		function eat(callback){
			setTimeout(function() {
				l('吃小鱼！');
			    callback(null);
			}, 1000);
		}
		function run(callback){
			l('开始跑！');
			//对于同步代码而言，这个好像不是必要的?
			//其实是必须的，如果后面还有别的函数，至少可以起到传递的作用！所以还是不能少
			callback(null);
		}

		serial({
		    one: eat,
		    two: run
		});
	}


	return bee;
})(bee || {});


//bee.caseK2();


