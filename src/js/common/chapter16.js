/*******************************
* 第十六章 原型继承、mixin模式、装饰者模式
* 这个三者其实关系还是比较紧密的，所以组合在一起处理
* 之前已经对原型继承有不少案例了，这里还是会回顾一些
********************************/

var bee = (function(bee){

    /* 
     * 研究案例1: 最简单的原型继承
     */
    bee.caseP1 = function(){
        
        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width){
            this.width = width;
        }
        Fish.prototype = new Animal(2);  //这里是Animal实例，Fish实例中含有父级的全部属性
        Fish.prototype.constructor = Fish;
        var f = new Fish(100);
        l(f);
    }


    /* 
     * 研究案例1_2: 变化
     */
    bee.caseP1_2 = function(){
        
        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width){
            this.width = width;
        }
        Fish.prototype = Animal.prototype;  //这里是Object实例，Fish实例中只含有父级“原型”上的全部属性（所以不包含age）
        Fish.prototype.constructor = Fish;
        var f = new Fish(100);
        l(f);
    }


    /* 
     * 研究案例1_3: 变化
     * 和1_2相比，多了mixin这部分，所以这里有age属性，并且是fish实例自己的，而不是来自父级。就是mixin的作用！
     */
    bee.caseP1_3 = function(){
        
        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width,age){
            Animal.call(this,age)           //mixin
            this.width = width;
        }
        Fish.prototype = Animal.prototype;  //这里是Object实例，Fish实例中只含有父级“原型”上的全部属性（所以不包含age）
        Fish.prototype.constructor = Fish;
        var f = new Fish(100,9);
        l(f);
    }


    /* 
     * 研究案例1_4: 标准原型继承 
     * 使用 Object.create + mixin 官方推荐
     */
    bee.caseP1_4 = function(){
        
        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width,age){
            Animal.call(this,age)           //mixin
            this.width = width;
        }
        Fish.prototype = Object.create(Animal.prototype);  //这样子和1_3已经非常类似了，只是在原型链上要多出 Animal实例 这个节点！
        Fish.prototype.constructor = Fish;
        var f = new Fish(100,9);
        l(f);
    }


    /* 
     * 研究案例1_5: 再变化 
     */
    bee.caseP1_5 = function(){
        
        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width,age){
            Animal.call(this,age)           //mixin
            this.width = width;
        }

        //继续使用 Object.create ，这里使用了new Animal(88)
        //然而，这个模式并不好，
        //1）观察log，比1_4又多了一个原型链节点！
        //2）既然已经有mixin了，age属性可以直接给出，完全没有必要去“new Animal(88)”一下，而且这个88的参数也显得有点多余。
        Fish.prototype = Object.create(new Animal(88));  
        Fish.prototype.constructor = Fish;
        var f = new Fish(100,9);
        l(f);
    }


    /* 
     * 研究案例2: Object.setPrototypeOf 改变实例原型链节点 ！
     */
    bee.caseP2 = function(){
        
        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width,age){
            Animal.call(this,age)           //mixin
            this.width = width;
        }

        var f = new Fish(100,9);
        Object.setPrototypeOf(f,Animal.prototype);
        f.constructor = Fish;
        l(f);

        //这个例子最接近 caseP1_3 案例中的写法：
        //Fish.prototype = Animal.prototype; 
        //Fish.prototype.constructor = Fish;
        //
        //区别是：一个是在构造之前处理原型。一个是在实例之后改变原型。
        //为何它没有成为最好的继承方式呢？
        //原因就在于：
        //“f.constructor = Fish;”这个！因为如果我每次实例之后，需要调整其构造函数，这个是非常蠢的做法...
    }


    /* 
     * 研究案例3: 
     */
    bee.caseP3 = function(){
        

    }()



    /* 
     * 研究案例1_6: 再变化 
     */
    /*bee.caseP1_6 = function(){
        
        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width,age){
            Animal.call(this,age)           //mixin
            this.width = width;
        }

        Object.setPrototype(Fish,);

        Fish.prototype = Object.create(new Animal(88));  
        Fish.prototype.constructor = Fish;
        var f = new Fish(100,9);
        l(f);
    }()*/




	return bee;
})(bee || {});







/*
function extend(Fun1,Fun2){
	Fun1 = function(){
		var args = Array.prototype.slice.call(arguments,0);
    Fun2.apply(this,args);
	};
	Fun1.prototype = Object.create(Fun2.prototype);
	Fun1.prototype.constructor = Fun1;
	Fun1.prototype.parent = Fun2;
	return Fun1;
}
function Animal(height,weight){
	this.height = height;
	this.weight = weight;
}
Animal.prototype.run = function(){
	l('running!');
}
var Fish;
var Fish = extend(Fish,Animal,fun);
var f = new Fish(100,200);
l(f.height)
l(f.weight)
f.run()
l(f.constructor)
*/



/*
function defclass(prototype) {
    var constructor = prototype.constructor;
    constructor.prototype = prototype;
    return constructor;
}

function extend(constructor, keys) {
    var prototype = Object.create(constructor.prototype);
    for (var key in keys) prototype[key] = keys[key];
    return defclass(prototype);
}

var BaseClass = defclass({
    constructor: function (name) {
        this.name = name;
    },
    doThing: function () {
        console.log(this.name + " BaseClass doThing");
    },
    reportThing: function () {
        console.log(this.name + " BaseClass reportThing");
    }
});

var SubClass = extend(BaseClass, {
    constructor: function (name) {
        BaseClass.call(this, name);
    },
    doThing: function () {
        console.log(this.name + " SubClass replacement doThing");
    },
    extraThing: function () {
        console.log(this.name + " SubClass extraThing");
    }
});



var x =   new BaseClass('xm')
l(x)
x.doThing()

*/


