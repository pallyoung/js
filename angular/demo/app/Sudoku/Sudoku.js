//function(){
	var sd=[0,0,4,0,0,0,5,0,0,
	 		0,3,0,0,0,0,0,7,0,
	 		7,0,0,4,6,5,0,0,3,
	 		0,0,8,2,0,1,9,0,0,
	 		0,0,5,0,0,0,8,0,0,
	 		0,0,7,5,0,8,3,0,0,
	 		6,0,0,8,9,3,0,0,1,
	 		0,5,0,0,0,0,0,3,0,
	 		0,0,3,0,0,0,2,0,0];
	var myapp=angular.module("myapp",[]);
	myapp.controller("sudoku",function($scope){
		$scope.version=1;
	})
		//sudoku.template=sd;
//()