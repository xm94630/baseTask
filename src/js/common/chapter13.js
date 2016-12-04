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
		document.registerElement('my-fish', {prototype: proto});
	}



	return bee;
})(bee || {});

bee.caseM1();




















