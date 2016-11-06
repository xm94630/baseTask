/*******************************
* 第八章
* 这里研究集中常见的模式
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:jquery Deffer
	 * 我只有大概的实现思路，没有具体的细节
	 */
	bee.caseH1 = function(){

		function Deffer(){
			return new Deffer.prototype.init;
		}
		Deffer.prototype ={
			init:function(){
				this.arr = [];
			},
			done:function(fun){
				this.arr.push(fun);
			},
			resolve:function(){
				var callback = this.arr[0]?this.arr[0]:function(){
					l('没有什么要处理的');
				};
				return callback();
			}
		}
		Deffer.prototype.init.prototype = Deffer.prototype;

		var dfd = Deffer();
		dfd.done(function(){
			l(2);
		});
		window.setTimeout(function(){
			l(1);
			dfd.resolve();
		},1000);
	}


	/* 
	 * 研究案例2: 异步同步
	 * 这里目的是实现一个先异步后同步的链式操作
	 * 下面的操作是有误的，同步代码先得到执行，然后是异步的
	 */
	bee.caseH2 = function(){

		var fish = {
			eat:function(){
				setTimeout(function(){
					l('吃小鱼！');
				},1000);
				return this;
			},
			run:function(){
				l('开始跑！');
				return this;
			}
		}
		fish.eat().run();
	}


	/* 
	 * 研究案例3: 异步同步
	 * 这个是对案例2的解决方案。
	 * 这时候，无论eat中的行为是同步的还是异步的，都是支持的。
	 * 但是观察代码发现其实是把处理run的逻辑放到了eat的回调中。
	 * 这个时候，就算我最后不调用run方法，在eat中也被调用了，这是有问题的。
	 */
	bee.caseH3 = function(){

		var fish = {
			full:false,
			eat:function(){
				var that = this;
				setTimeout(function(){
					l('吃小鱼！');
					that.full = true;
					that.run();		
					that.full = false;
				},1000);
				return that;
			},
			run:function(){
				if(fish.full){
					l('开始跑！');
					return this;
				}
			}
		}
		fish.eat().run();
		//下面这样子的调用形式也会在内部调用run,这显然不是我们想要的。
		//fish.eat();
	}


	/* 
	 * 研究案例4: 同步异步代码的串行
	 * 上面的模式，我暂时没有想到解决的办法，我们可以来试一试下面模式：
	 * 仔细看，这不就是async插件处理的事情！
	 * 我之前还研究过，可是等到自己写的时候，发现十分困难！
	 * 如何包装才好？
	 */
	bee.caseH4 = function(){

		function eat(){
			setTimeout(function(){
				l('吃小鱼！');
			},1000);
		}
		function run(){
			l('开始跑！');
		}
		//这个是串行的方法，支持同步和异步的代码！如何实现呢？
		function serial(fn1,fn2){
			//这里该如何处理呢？？?
			//.....
		}
		serial(eat,run);
	}


	/* 
	 * 研究案例99: promise
	 * 自己的实现思路，到时候和好的比较。
	 * 实现的思路是：
	 * 首先是用promise对象去包装一个异步的函数，然后再then方法中得到回调。
	 */
	bee.caseH99 = function(){

		function promise(fn){

			fn(function(data){

				l(data)
			});

			var result = 123;

			var promiseObject = {
				then:function(dealWith){
					dealWith(result);
				}
			}

			return promiseObject;
		}


		promise(function(cb){
			setTimeout(function(){
				var data = 'xm94630';
				console.log('一秒之后回去数据');
				cb(data);
			},1000);
		}).then(function(data){
			console.log('异步得到的数据是：');
			console.log(data);
		})
	}





	return bee;
})(bee || {});


bee.caseH4();





















