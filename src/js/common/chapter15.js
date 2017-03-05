/*******************************
* 第十四章 observer模式
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


	//研究案例6: 【BOSS】 星形拓扑借结构
	//即是信息的发布者，也是订阅者
	//这种模式我在项目中的需求中悟出来的，就是有一个互斥的实例。
	//要做到这个一点的话，实例之间一定能够相互通信才行！
	//于是实现了这个简单的模型
	bee.caseO6 = function(){

		//工厂的工厂，可以生成多个工厂实例，在一个工厂中能够维护一个 kingLists。
		function KingFactoryFactory(){
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
		var KingFactory = KingFactoryFactory();

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




/*var Observable ={
	create:function(fun){
		return {
			subscribe:function(cb){
				fun(cb);
			}
		}
	}
}

var myObservable = Observable.create(function(cb){
	cb('程咬金');
	setTimeout(() => cb('兰陵王'), 1000);
})
myObservable.subscribe(function(data){
	console.log('红方 => '+data);
});


var myObservable2 = Observable.create(function(cb){
	cb('荆轲');
	setTimeout(() => cb('后羿'), 500);
})
myObservable2.subscribe(function(data){
	console.log('蓝方 => '+data);
});

l('==== 同步代码 ====');*/






/*var observer = {
	fun:function(info){
		console.log(info);
	},
	next:function(x){
		this.fun(x);
	}
}
observer.next('你好');*/





