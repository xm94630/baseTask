/*******************************
* 第十五章 observer模式
*
* 注意，其实observer模式和发布订阅模式，都是很类似的。
* 所以在不同实现中，有的人，会把发布订阅模式中的“发布者”、”订阅者“这样子的说法，也用在 observer模式 中。
* 而observer模式中，其实对应的是“主体”、“观察者”。
*
* 所以在我下面的案例中，不区分这些概念。
* 总的来说：一个发，一个收。
* 
********************************/


var bee = (function(bee){

	//研究案例1:我认为，函数其实是一个最最简单的观察者模式。
	bee.caseO1 = function(){
		function fun(info){l('王者荣耀：'+info);}
		fun('敌人5秒钟后达到战场，请做好准备');
		//这里的“敌人...“文案，其实就发布的信息
		//fun函数就是那个观察者，这里也不存在发布者
		//所以一个普通的函数，你可以认为是一个观察者在等待信息，然后触发。
	}


	//研究案例2:简单的观察者模式
	//这里例子的基础原理其实还是案例1中的那个。
	//不同的是，这里一旦发布信息，有多个函数会被调用，并接受相同的讯息。
	bee.caseO2 = function(){
		var fun1 = function(info){l('程咬金收到信息：'+info);}
		var fun2 = function(info){l('兰陵王收到信息：'+info);}
		var king = {
			observers : [fun1,fun2],
			sendInfo  : function(info){
				this.observers.forEach(function(fun){
					fun(info);
				})
			}
		}
		king.sendInfo('准备团战！');
		l('20秒之后...')
		king.sendInfo('进攻敌方高地！');
	}


	//研究案例3:观察者模式 + 工厂
	bee.caseO3 = function(){
		var fun1 = function(info){l('程咬金收到信息：'+info);}
		var fun2 = function(info){l('兰陵王收到信息：'+info);}
		function kingFactory(){
			//顺便提一句，这里的observers为何放在这里，而不是一起放在return的对象之中
			//是因为如此 observers 是私有的。
			//return过去的话，这个 observers数组就可以直接访问和修改了。
			var observers=[];
			return {
				add:function(fun){
					observers.push(fun);
				},
				remove:function(fun){
					observers = observers.filter(function(one) {
						return fun!==one;
					});
				},
				sendInfo:function(info){
					observers.forEach(function(fun){
						fun(info);
					})
				}
			}
		}

		var king = kingFactory();
		king.add(fun1);
		king.add(fun2);
		king.sendInfo('进攻地方高地!');
		l('====>兰陵王退出');
		king.remove(fun2);
		king.sendInfo('防守我方高地!');
	}


	//研究案例4:观察者模式
	//上例中，是发布者在对观察者进行维护（增加、删除）
	//本例中，正好相反，是订阅者，自己主动来执行。（入帮、退帮）（如果比喻成加入黑社会的话）
	//
	//这里使用了 Function.prototype 这样子的扩展，不是很好的做法
	//另外 observers 也变成了透明的了，可以直接修改，没有上一种模式优秀。
	bee.caseO4 = function(){

		//这里的工厂，其实可以用构造函数来替换~
		/*function King(){this.observers=[];}
		King.prototype.sendInfo = function(info){
			this.observers.forEach(function(fun){
				fun(info);
			})
		};
		var king = new King();*/

		function kingFactory(){
			return {
				//顺便提一句：这里把observers放在return中，是以为后面需要访问。
				//如果处理成闭包，只有自己的方法才能访问了。
				observers:[],
				sendInfo:function(info){
					this.observers.forEach(function(fun){
						fun(info);
					})
				}
			}
		}
		var king = kingFactory();
		
		Function.prototype.subscribe = function(publisher){
			var fun = this;
			var bool = publisher.observers.some(function(fn){
				return fn === fun;
			});
			if(!bool) publisher.observers.push(fun);
		}
		Function.prototype.unsubscribe = function(publisher){
			var fun = this;
			//filter 对数组是不可变的。不要忘记写“publisher.observers = ”。
			publisher.observers = publisher.observers.filter(function(fn){
				return fn !== fun;
			});
		}
		var fun1 = function(info){l('程咬金收到信息：'+info);}
		var fun2 = function(info){l('兰陵王收到信息：'+info);}
		
		fun1.subscribe(king);
		fun2.subscribe(king);
		king.sendInfo('进攻地方高地!');
		l('====>兰陵王退出');
		fun2.unsubscribe(king);
		king.sendInfo('防守我方高地!');
	}


	//研究案例5: 发布订阅模式 （观察者 的特殊形式）
	bee.caseO5 = function(){

		//存储 信道和回调的数组
		var arr = [];
		
		//发布
		function publish(channel,data){
			if(arr[channel]){
				arr[channel].forEach(function(fun){
					fun(data);
				})
			}
		}
		//订阅
		function subscribe(channel,fun){
			if(!arr[channel]){
				arr[channel]=[];
			}
			arr[channel].push(fun);
			return [channel,fun];
		}
		//取消订阅
		function unsubscribe(holder){
			var channel = holder[0];
			var fun     = holder[1];
			if(arr[channel]){
				arr[channel] = arr[channel].filter(function(fn){
					return fun!==fn;
				})
			}
		}

		var fun1=function(info){
			l('程咬金收到消息:'+info);
		}
		var fun2=function(info){
			l('兰陵王收到消息:'+info);
		}

		var holder1 = subscribe('king/red',fun1);
		var holder2 = subscribe('king/red',fun2);
		publish('king/red','进攻敌方高地！');
		unsubscribe(holder2);
		l('==== 兰陵王 掉线 ====')
		publish('king/red','等人到齐团战!');

		//上例子中，发布的事件直接作用到全部的 observers 中。
		//这里，中间又做了一个层次的抽象。就是所谓的“频道”，如此一来：
		//一个频道中可以有多个观察者。
		//一个观察者可以去接受多个频道。
	}


	//研究案例6: 【BOSS】 星形拓扑结构
	//即是信息的发布者，也是订阅者
	//这种模式我在项目中的需求中悟出来的，就是有一个互斥的实例。
	//要做到这个一点的话，实例之间一定能够相互通信才行！
	//于是实现了这个简单的模型
	bee.caseO6 = function(){

		//工厂的工厂，可以生成多个工厂实例，在一个工厂中能够维护一个 kingLists。
		function KingGropFactory(){
			var kingLists = {};
			var id = 0;

			//这部分是实例生成的部分
			return function KingFactory(name,callback){
				id++;
				var king = {
					id:id,
					name:name||'无名'+id,
					doSomething:callback||function(){},
					getAllkings:function(){
						return kingLists;
					},
					//接收信息
					//具体操作是交了 doSomething，来自实例化时候的回调！
					getInfo:function(msg,fromId){
						this.doSomething(msg,kingLists[fromId],kingLists[this.id]);
					},
					//发送信息
					send:function(msg){
						for(var k in kingLists){
							if(kingLists[k]!==this)
								kingLists[k].getInfo(msg,this.id);
						}
					},
					//进入队列
					loginIn:function(){
						kingLists[this.id] = this;
					},
					//退出队列
					loginOut:function(){
						delete kingLists[this.id];
					}
				};
				kingLists[id] = king;
				return king;
			}
		}
		var KingFactory = KingGropFactory();

		var k1 = KingFactory('兰陵王',function(msg,from,my){
			l(my.name+' 接收到来自 '+ from.name+'的消息：'+msg);
		});
		var k2 = KingFactory('程咬金',function(msg,from,my){
			l(my.name+' 接收到来自 '+ from.name+'的消息：'+msg);
		});
		var k3 = KingFactory('孙悟空',function(msg,from,my){
			l(my.name+' 接收到来自 '+ from.name+'的消息：'+msg);
		});

		k2.send('大家都很给力哦！')
		l('=====')
		k1.send('等等我')
		l('=== 孙悟空退出 ===')
		k3.loginOut();
		k1.send('孙悟空退出了...一会举报')
		l('=== 孙悟空上线 ===')
		k3.loginIn();
		k3.send('不好意思，刚才接了个电话')	
	}

	//研究案例7:  星形拓扑结构 优化
	bee.caseO7 = function(){
		function KingGropFactory(){
			var kingLists = {};
			var id = 0;
			return function KingFactory(callback){
				id++;
				var king = {
					id:id,
					doSomething:callback||function(){},
					getAllkings:function(){
						return kingLists;
					},
					getInfo:function(msg,fromId){
						this.doSomething(msg,kingLists[fromId],kingLists[this.id]);
					},
					send:function(msg){
						for(var k in kingLists){
							if(parseInt(k)!==this.id)
								kingLists[k].getInfo(msg,this.id);
						}
					},
					loginIn:function(){
						kingLists[this.id] = this;
					},
					loginOut:function(){
						delete kingLists[this.id];
					},
					//新增一个扩展的方法
					//目的就是把，该模模式变得纯粹，可以复用。
					extend:function(obj){
						var that = this;
						//扩展中，原来的属性是不允许被覆盖的！这个很关键。
						//言外之意，如果Hero实例中，也有loginIn方法就无效了。
						//我觉的吧，这个设计有点问题，万一用户正好使用了loginIn，那就对他造成困扰了。
						//这个问题可以先放着。
						that = $.extend(true,that,obj);//true表示不允许覆盖
					}
				};
				kingLists[id] = king;
				return king;
			}
		}
		var KingFactory = KingGropFactory();

		var k1 = KingFactory(function(msg,from,my){
			l(my.name+' 接收到来自 '+ from.name+'的消息：'+msg);
		});
		var k2 = KingFactory(function(msg,from,my){
			l(my.name+' 接收到来自 '+ from.name+'的消息：'+msg);
		});
		var k3 = KingFactory(function(msg,from,my){
			l(my.name+' 接收到来自 '+ from.name+'的消息：'+msg);
		});

		//具体角色信息，抽离到这里。最后被extend扩展。
		function Hero(name){
			this.name = name;
		}

		k1.extend(new Hero('程咬金'));
		k2.extend(new Hero('兰陵王'));
		k3.extend(new Hero('孙悟空'));

		k1.send('进攻地方高地');
	}


	//研究案例8:  星形拓扑结构 应用 互斥的下拉框！
	//这个应用就是来自于实际!这里已经实现的比较完整了。
	bee.caseO8 = function(){
		
		$(function(){
			$('body').append([
				'<select node-type="s1">',
					'<option value="-1">请选择</option>',
					'<option value="11">11</option>',
					'<option value="22">22</option>',
					'<option value="33">33</option>',
					'<option value="44">44</option>',
				'</select>',
				'<select node-type="s2">',
					'<option value="-1">请选择</option>',
					'<option value="11">11</option>',
					'<option value="22">22</option>',
					'<option value="33">33</option>',
					'<option value="44">44</option>',
				'</select>',
				'<select node-type="s3">',
					'<option value="-1">请选择</option>',
					'<option value="11">11</option>',
					'<option value="22">22</option>',
					'<option value="33">33</option>',
					'<option value="44">44</option>',
				'</select>'
			].join(''));

			function KingGropFactory(){
				var kingLists = {};
				var id = 0;
				return function KingFactory(callback){
					id++;
					var king = {
						id:id,
						allInfo:[],
						doSomething:callback||function(){},
						getAllkings:function(){
							return kingLists;
						},
						getInfo:function(msg,fromId){
							this.doSomething(msg,kingLists[fromId],kingLists[this.id]);
						},
						send:function(msg){
							this.allInfo.push(msg);
							for(var k in kingLists){
								if(parseInt(k)!==this.id)
									kingLists[k].getInfo(msg,this.id);
							}
						},
						loginIn:function(){
							kingLists[this.id] = this;
						},
						loginOut:function(){
							delete kingLists[this.id];
						},
						extend:function(obj){
							var that = this;
							that = $.extend(true,that,obj);
						},
						//这个是新增的功能，发布信息的栈
						//某些场合的时候会用到
						getAllInfo:function(){
							return this.allInfo;
						},
						//这个是新增的功能，发布信息的栈，获取最顶层的元素
						getLastInfo:function(){
							return this.allInfo[this.allInfo.length-1];
						}
					};
					kingLists[id] = king;
					return king;
				}
			}
			var KingFactory = KingGropFactory();

			function dealWith(msg,from,my){

				//不处理为-1时候的信息响应
				if(msg=='-1')return;
				
				//一些log输出
				l(my.id+' 接收到来自 '+ from.id+'的消息：'+msg);

				//清楚原来的标记
				$(this).find('option[usedBy='+from.id+']').removeAttr('usedBy disabled');
				$(this).find('option').each(function(){
					if($(this).val()==msg){
						$(this).attr('disabled','disabled');
						//标记被谁占用
						$(this).attr('usedBy',from.id);
					}
				});
			}

			var k1 = KingFactory(dealWith);
			var k2 = KingFactory(dealWith);
			var k3 = KingFactory(dealWith);

			var s1 = $('[node-type="s1"]');
			var s2 = $('[node-type="s2"]');
			var s3 = $('[node-type="s3"]');

			k1.extend(s1);
			k2.extend(s2);
			k3.extend(s3);

			k1.on('change',function(){
				var v = $(this).val();
				k1.send(v);
				//l('['+k1.id+' 最新一次发送的数据是'+k1.getLastInfo()+']');
				//l('['+k1.id+' 全部发送的数据是'+k1.getAllInfo()+']');
			})
			k2.on('change',function(){
				var v = $(this).val();
				k2.send(v);
			})
			k3.on('change',function(){
				var v = $(this).val();
				k3.send(v);
			})
		});

		//其实这个问题还是扩展的：
		//1 如果这里的下拉框不是一开始的时候就有的，是动态添加的。那么动态添加的禁用选项就会使用到 getLastInfo 函数来知道兄弟们的选择情况。
		//2 再如果，把多个下拉最为一个组，组内互斥，组与组织之间没有任何关系。这种情况，KingGropFactory有帮助了。
		//所以目前的模型还是可以应对这两种的。
	}


	//研究案例9: 异步的观察者 最简单的例子
	bee.caseO9 = function(){
		//观察者
		function fun(info){l('王者荣耀：'+info);}
		//发布者（异步）
		setTimeout(function(){
			fun('敌人5秒钟后达到战场，请做好准备');
		},0);
	}


	//研究案例10: 异步的观察者 惰性
	//上例的变换
	bee.caseO10 = function(){
		//观察者 保持不变
		function fun(info){l('王者荣耀：'+info);}
		//发布者 
		//异步的发布信息的行为被一个容器函数包装了，于是这个异步行为，处于等待的状态。（”惰性“、”懒“相关的观念多数使用这样子的包装行为）
		function container(fun){
			setTimeout(function(){
				fun('敌人5秒钟后达到战场，请做好准备');
			},0);
		}
		//订阅行为
		function subscribe(dealWith){
			container(dealWith);
		}
		//只有在订阅行为发生的时候，即指定了具体的观察者，发布者的发布行为才开启。
		subscribe(fun);

		//本例子，虽然简单，但是蕴含一个极其重要的“惰性”的概念！
		//相比案例9而言：
		//案例9，发布者直接发布
		//案例10，发布者发布前，必须指定观察者。这种缓冲的行为，让用户使用接口的时候，更加的 flexible ！
		
		//为了证明灵活性，我们看下面的例子
		//非常方便的制定了例外一个订阅者（一旦指定了，分布者马上给他发布！）
		function fun2(info){l('全名超神：'+info);}
		subscribe(fun2);
	}


	//研究案例11: 异步的观察者 优化/封装
	//上例只是为了说明原理，并没有结构化的代码
	bee.caseO11 = function(){

		//封装到 Observable
		var Observable ={
			create:function(fun){
				return {
					subscribe:function(cb){
						fun(cb);
					}
				}
			}
		}

		//观察者
		function fun(data){
			console.log('红方 => '+data);
		}

		//发布行为 : 无论是同步的、异步的行为，都包装到一个函数中去。
		function container(cb){
			cb('程咬金');
			setTimeout(() => cb('兰陵王'), 1000);
		}

		//Observable.create 方法，相当于创建了一个发布者
		var myObservable = Observable.create(container);

		//发布者的选择订阅的函数，并触发“发布”行为
		myObservable.subscribe(fun);
	
	}


	//研究案例12: 异步的观察者 上例子的不同用法
	bee.caseO12 = function(){

		var Observable ={
			create:function(fun){
				return {
					subscribe:function(cb){
						fun(cb);
					}
				}
			}
		}

		function fun(data){
			console.log('红方 => '+data);
		}

		//原来的发布行为也可以一拆为二
		//发布行为1（同步）
		function container(cb){
			cb('程咬金');
		}
		//发布行为2（异步）
		function container2(cb){
			setTimeout(() => cb('兰陵王'), 1000);
		}

		//创建2个分布者
		var myObservable  = Observable.create(container);
		var myObservable2 = Observable.create(container2);

		//两个发布者可以指定相同或者不同的订阅者，这里使用的是相同的fun函数
		myObservable .subscribe(fun);
		myObservable2.subscribe(fun);

		l('=== 同步代码 ===')

	}


	//研究案例13: 和 Promise 区别
	bee.caseO13 = function(){

	}






	return bee;
})(bee || {});





/*
var myObservable = Rx.Observable.create(observer => {
  observer.next('foo');
  setTimeout(() => observer.next('bar'), 1000);
});
myObservable.subscribe(value => l('===>'+value));
*/



/*var xxx;

var Observable ={
	observer:{
		next:function(x){
			xxx(x)
		}
	},
	create:function(fun){

		var that = this;
		setTimeout(function(){
			fun(that.observer);
		},0);

		return {
			subscribe:function(cb){
				//cb('xxx')
				xxx =cb;
			}
		}


	}
}

var myObservable = Observable.create(function(obs){
	obs.next('程咬金');
	setTimeout(() => obs.next('兰陵王'), 1000);
})
myObservable.subscribe(function(data){
	console.log(data);
});

l(123)
*/



/*var xxx;

var Observable ={
	observer:{
		next:function(x){
			xxx(x)
		}
	},
	create:function(fun){

		var that = this;
		


		return {
			subscribe:function(cb){
				//cb('xxx')
				xxx =cb;

				fun(that.observer);
			}
		}


	}
}

var myObservable = Observable.create(function(obs){
	obs.next('程咬金');
	setTimeout(() => obs.next('兰陵王'), 1000);
})
myObservable.subscribe(function(data){
	console.log(data);
});

l(123)*/









/*var observer = {
	fun:function(info){
		console.log(info);
	},
	next:function(x){
		this.fun(x);
	}
}
observer.next('你好');*/




























