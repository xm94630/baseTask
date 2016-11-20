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
		
		/* 
		 * 仔细想来这个的实现，有点难度，我不妨先把promise的搞定
		 * 因为这里的模式，其实就是promise的了。
		 * $.get('xxx').then(function(){xxxx})...
		 */
	}


	/* 
	 * 研究案例4: 同步异步代码的串行
	 * 上面的模式，我暂时没有想到解决的办法，我们可以来试一试下面模式：
	 * 仔细看，这不就是async插件处理的事情！
	 * 我之前还研究过，可是等到自己写的时候，发现十分困难！
	 * 如何包装才好？
	 * 本例子不再提供解决方案，请继续往下看
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
	 * 研究案例5: 同步异步代码的串行
	 * 我们知道 callback 是必不可少了，第十一章中第二个案例就给我很好的示范。
	 * 我再来自己尝试解决下，哪怕很蹩脚也行啊：
	 */
	bee.caseH5 = function(){

		function eat(callback){
			setTimeout(function(){
				l('吃小鱼！');
				callback()
			},1000);
		}
		function run(callback){
			l('开始跑！');
			callback();
		}

		//这个就可以实现目标，不过真的很蹩脚
		//底层的实现其实逃不出“回调”的处理呢！
		function serial(fn1,fn2){
			var cb = function(){
				fn2(function(){});
			}
			fn1(cb);
		}
		serial(eat,run);
	}


	/* 
	 * 研究案例6: 同步异步代码的串行
	 * 在案例5的基础上，多一个处理函数的时候，serial需要这样子处理：
	 */
	bee.caseH6 = function(){

		function eat(callback){
			setTimeout(function(){
				l('吃小鱼！');
				callback()
			},1000);
		}
		function run(callback){
			l('开始跑！');
			callback();
		}
		function eat2(callback){
			setTimeout(function(){
				l('吃大鱼！');
				callback()
			},500);
		}

		//这里是处理回调的地方，这样子写很死板，看看如何抽象呢？接着看案例7
		function serial(fn1,fn2,fn3){
			var cb2 = function(){
				fn3(function(){});
			}
			var cb = function(){
				fn2(cb2);
			}
			fn1(cb);
		}
		serial(eat,run,eat2);
	}

	/* 
	 * 研究案例7: 同步异步代码的串行
	 * 在案例6的基础上，能不能实现一个通用的实现呢？？
	 */
	bee.caseH7 = function(){

		function eat(callback){
			setTimeout(function(){
				l('吃小鱼！');
				callback(null)
			},1000);
		}
		function run(callback){
			l('开始跑！');
			callback(null);
		}
		function eat2(callback){
			setTimeout(function(){
				l('吃大鱼！');
				callback(null)
			},500);
		}

		//好歹还是写出来了，哈哈
		//这是个递归！要不是自己亲手写一写，还不知道有这样子的实现。
		function serial(){
			var i=0;
			//这个arguments是serial，在cb的匿名函数中使用的使用要用args，因为那个匿名函数自己也有arguments，这个和this用that替换是一样的道理。
			var args = arguments;
			var cb = function(err){
				if(err){
					throw new Error('有错误');
				}
				i++;
				var fun = args[i];
				if(fun) args[i](cb);
			}
			arguments[i](cb);
		}
		//serial(eat,run,eat2);
		//我们还可以试试更多的：
		serial(eat,run,eat2,eat);
	}


	/* 
	 * 研究案例8: promise
	 * 本来就个是放在案例2要实现的，结果搞不定，真是丢脸。
	 * 后来在实现完案例7之后，茅塞顿开，很快就搞定了这个。
	 */
	bee.caseH8 = function(){

		function promise(fn){

			//这是异步回调用要用的函数，期初就设定为一个啥也不做的函数。
			var myFun = function(){};

			var callback = function(data){
				myFun(data);
			};

			//异步方法的调用，在“对调”中呼起对myFun的使用
			fn(callback);

			var promiseObject = {
				then:function(dealFun){
					//这个是个同步的方法！在异步之前就配置好了，将来要回调的方法呢！
					myFun = dealFun;
				}
			}

			return promiseObject;
		}

		//核心实现全部依靠cb,这个和案例7的serial中的cb的作用几乎是一样一样的！！
		promise(function(cb){
			l('等待1秒...');
			setTimeout(function(){
				cb('xm94630');
			},1000);
		}).then(function(data){
			console.log('获取异步数据：'+ data);
		});
	}


	/* 
	 * 研究案例9: 案例3 解决方案一
	 * 这里用案例8中实现的promise的方法来解决。
	 */
	bee.caseH9 = function(){

		function promise(fn){
			var myFun = function(){};
			var callback = function(data){myFun(data);};
			var promiseObject = {then:function(dealFun){myFun = dealFun;}}
			fn(callback);
			return promiseObject;
		}

		var fish = {
			eat:function(cb){
				setTimeout(function(){
					l('吃小鱼！');
					cb('这条小鱼很鲜呢');
				},1000);
			},
			run:function(data){
				l('开始跑！');
				l('这里还可以传递数据呢，如果你想要的话:'+data);
			}
		}

		//需要声明的是，用promise实现的话，异步的eat就成为了run实现的依赖，只有eat成功了，run才能得以进行。
		//如果run是类似ajax的实现，那好需要有处理出错的情况。不过这里只是思路实现的示例，不是完整的实现。
		promise(fish.eat).then(fish.run);
		/*
		 * 用promise解决这个问题当然是妥妥的啦
		 * 不过呢，好像和我的初衷实现的结构不太一样哦，我希望这样实现：
		 * fish.eat().run();
		 * 上述到底有没有出路，我们再案例10里面实现下吧！
		 */
	}


	/* 
	 * 研究案例10: 案例3 解决方案二(无解的)
	 * 采用这样子的解决方案：fish.eat().run();是无解的
	 */
	bee.caseH10 = function(){

		var fish = {
			eat:function(){
				setTimeout(function(){
					l('吃小鱼！');
				},1000);
				return this;
			},
			run:function (){
				l('开始跑！');
				return this;
			}
		}
		fish.eat().run();

		/* 这个为何是无解的呢？
		 * 对于案例8的promise而言，他能够对eat、run方法进行包装。
		 * 而且eat和run函数本身并没有遭到破坏，最多在eat函数中嵌入了一个必要的cb回调（可成为一种规范，简单好记）。
		 * 另外被包装的是两个函数作为高阶函数传入，本身就灵活抽象，eat和run函数保持了很好的独立性。
		 *
		 * 这里的 fish.eat().run(); 写法，是站不住脚的：
		 * 这里的eat、run直接就是调用的形式了，没有像上面那样作为高阶存在（能被包装），没有被包装的余地。
		 * 同样，作为处理异步的极其重要的callback函数没有合适的切入口。
		 * 外层没有包装的余地，那么要处理异步同步的问题的逻辑必须放在eat、run本身中！
		 * 如此，eat、run本身就变复杂了，也不能把这部分逻辑抽出来。
		 *
		 * 所以，如果eat是异步的，run是同步的，那么run()必然是先行的，除非在run内部添加格外的处理逻辑，就像案例3那样。
		 * 但是和初衷矛盾。因此我认为这种模式是不能站住脚的。
		 * 如果有的话，我想早有人实现了吧。
		 * 我在观察观察。
		 */
	}

	/* 
	 * 研究案例11: noConflict 
	 * 插件防止冲突的逃生舱
	 * 这里展示的是覆盖的情况
	 */
	bee.caseH11 = function(){

		//这个整个就是一个插件
		;(function(window,undefined){
			//假设这个就是插件的内容
			var plugin = {name:'我是一个插件'};
			//插件挂载到全局
			if(typeof window =='object' && typeof window.document=='object'){
				window.plugin = plugin;
			}
		})(window);
		//全局中的那个插件
		l(plugin)
		//全局中有使用同名的，于是就发生了覆盖。
		plugin = 123;
		l(plugin)
	}

	/* 
	 * 研究案例12: noConflict 
	 * 插件防止冲突的逃生舱
	 * 这里的noConflict实现是我自己想的，所以...
	 * 可能还会有漏洞吧，所以我们还要参考$中noConflict的实现！
	 */
	bee.caseH12 = function(){

		//这个整个就是一个插件
		;(function(window,undefined){
			//假设这个就是插件的内容
			var plugin = {
				name:'我是一个插件',
				noConflict:function(){
					return plugin;
				}
			};
			//插件挂载到全局
			if(typeof window =='object' && typeof window.document=='object'){
				window.plugin = plugin;
			}
		})(window);
		//全局中的那个插件
		l(plugin)
		//使用了一个别名进行逃生
		var newP = plugin.noConflict();
		//这个时候全局中使用了plugin，也没有关系
		//我们的插件名字已经改成了newP
		plugin = 123;
		l(plugin)
		l(newP)
	}


	/* 
	 * 研究案例13: 【BOSS】jq 的 noConflict 
	 * 观察jq中的实现，确实比我的高明多了。逻辑更加的谨慎。
	 * 1）我上面的问题：如果把plugin插件部分整体移动到最后，
	 * 那么原来的plugin变量中的值就消失了。而在这里，被备份了
	 * 2）这里的if条件的使用，逻辑很严密。
	 */
	bee.caseH13 = function(){

		;(function(window,undefined){
			//这里记录了全局中原来的$,以备后用，这个是核心！
			_$ = window.$;
			var jQuery = {
				name:'我是一个插件',
				noConflict:function(){
					if(window.$===jQuery){
						//这个也是重要的实现
						//之前全局的$，被我们的$插件覆盖了，好在我们有个备份，
						//这个时候把备份的还给人家，完成了逃生。
						window.$ = _$;

						//外层的if是做什么的呢？来确保这个一开始的$确实是被我这个$插件覆盖了才进行逃生
						//你要是被别的插件或者变量修改了，我可不管。
					}
					return jQuery;
				}
			};
			if(typeof window =='object' && typeof window.document=='object'){
				window.$ = jQuery;
			}
		})(window);

	}



	return bee;
})(bee || {});


bee.caseH13()















