/*demo.js*/
/*
router config
*/
angular.module('myApp', ['ui.router']);

for (var i = 1; i <= 10; i++) {
	void

	function(i) {
		angular.module('myApp')
			.controller("testCtrl" + i, function($scope) {
				$scope.name = "testCtrl" + i;
				$scope.url = "test" + i;
			})
	}(i);

}

angular.module('myApp')
	.config(function($stateProvider, $urlRouterProvider) {
	/*	for (var i = 1; i <= 10; i++) {
			void
			function(i) {
				$stateProvider.state("test" + i, {
					url: "/test" + i,
				});
			}(i);

		}*/
		window.$stateProvider=$stateProvider;
	})
	.run(function($rootScope, $state) {
		$rootScope.$on("$stateChangeStart", function(evt, to, toP, from, fromP) {
			
			

		});
		$rootScope.$on("$locationChangeSuccess", function() {

		});
	});