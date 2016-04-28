var stu = getCurrentStudent();
//绑定mode和view  通过html注入的信息获取view
  angular.module('docsBindExample', []).controller("getStuInfo",function($scope){
  console.log("控制器绑定mode和view");
  var updateStu=function(){
	$scope.stu = $.extend(stu,{getInfo:function(){return JSON.stringify(stu);}});
	//可以在绑定的对象中定义方法  在页面通过{{stu.getInfo()}}调用
  }
  updateStu();
  //监听对象中值的变化
   $scope.$watch(function(){return $scope.stu},function( newValue, oldValue ) {
    console.log('$scope.stu was updated! '+JSON.stringify(newValue));
  },true);
  //双向绑定循环调用会占用线程（不推荐）
  //setInterval(function() {
    //$scope.$apply(updateStu);
  //} );
	//没法做双向绑定的话 修改对象stu的属性值后 再调用此方法可以更新页面的值
	window.updatePage=function(){
		$scope.$apply(updateStu);
	}
  //可以在$scope中定义方法  在页面通过{{getStuInfo()}}调用
  $scope.getStuInfo=function(){
  return JSON.stringify(stu);
  }
  })
//绑定的另一种写法
//angular.module('docsBindExample', []).controller('getStuInfo', ['$scope', function($scope) {$scope.stu = stu;}]);
function saveStudent(){
	saveCurrentStudent(stu);
	return stu;
}
function getCurrentPageStudent(){
	return stu;
}