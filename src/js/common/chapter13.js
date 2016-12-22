/*******************************
* 第十二章
********************************/

var bee = (function(bee){

	//研究案例1: webComponent
	bee.caseM1 = function(){

		var proto = Object.create(HTMLElement.prototype, {
		  attachedCallback: {
		    value: function() {
		      var mountPoint = document.createElement('span');
		      this.createShadowRoot().appendChild(mountPoint);
		      mountPoint.innerHTML = ('我是 webComponent 形式渲染的便签');
		    }
		  }
		});
		document.registerElement('my-xxx', {prototype: proto});

		var fish = Object.create(HTMLElement.prototype, {
		  attachedCallback: {
		    value: function() {
		      var mountPoint = document.createElement('div');
		      this.createShadowRoot().appendChild(mountPoint);
		      mountPoint.innerHTML = ('我是一条小鱼哦');
		    }
		  }
		});
		document.registerElement('my-fish', {prototype: fish});
	}


	//案例2: 巧妙利用数组做映射
	bee.caseM2 = function(){
		let months = ['1月份', '2月份', '3月份', '4月份', '5月份', '6月份',
					  '7月份','8月份', '9月份', '10月份', '11月份', '12月份'];
		var m = months[new Date().getMonth()];
		l(m);
	}




	return bee;
})(bee || {});

//bee.caseM1();




















