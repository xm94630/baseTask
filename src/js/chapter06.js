/*******************************
* 第五章
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:递归
	 * 递归规则
	 * 1）函数：run
	 * 2）停止：n<=0
	 * 2）一步：l('跑了1步');
	 * 2）剩余：n-1；
	 * 虽然简单，但足以说明本质
	 */
	bee.caseF1 = function(){

		function run(n){
			if(n<=0){
				l("结束");
			}else{
				l('跑了1步');
				run(n-1);
			}
		}
		run(10);

	}




	return bee;
})(bee || {});

bee.caseF1();





















