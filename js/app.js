function unsplat(fun){
	return function(){
		return fun.call(null,_.toArray(arguments));
	};
}
var joinElement = unsplat(function(array){
	return array.join('-');
})

var text = joinElement('xixi','haha','lala');
console.log(text);