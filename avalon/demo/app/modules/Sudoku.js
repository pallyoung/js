(function(){
	var sd=[0,0,4,0,0,0,5,0,0,
	 		0,3,0,0,0,0,0,7,0,
	 		7,0,0,4,6,5,0,0,3,
	 		0,0,8,2,0,1,9,0,0,
	 		0,0,5,0,0,0,8,0,0,
	 		0,0,7,5,0,8,3,0,0,
	 		6,0,0,8,9,3,0,0,1,
	 		0,5,0,0,0,0,0,3,0,
	 		0,0,3,0,0,0,2,0,0];
	if(avalon){
		window.sudoku=avalon.define({
			$id:"sudoku",
			template:[],
			version:1,
			checkAnswer:function(array){
				this.removeAttribute("disabled");
	 			var a=0;
	 			for(var i=0;i<9;i++){
	 				for(var l=0;l<9;l++){
	 					if(""+array[a*9+l]==""+array[i*9+l]&&a!=i){
	 						console.log("error");
	 						return;
	 					}
	 				}	 		
	 			}
		 	}
		});
		sudoku.template=sd;
	}
})()