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

	return bee;
})(bee || {});









