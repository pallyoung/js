(function() {
	/**
	 *
	 *requireJs的配置文件
	 *
	 **/
	mush.config({
		baseUrl: '../../mush/test/module',
		paths: {
			log: "log",
			base: "base",
			select: "select",
			popup: "popup",
			zeptodefine: "zeptodefine",
			jquerydefine: "jquerydefine",
			zepto: "zepto",
			jquery: "jquery-1.7.2.min",

		},
		shim: {
			zepto: {
				exports: '$'
			},
			jquery: {
				exports: '$'
			}
		}
	});
	/*
	 *项目命名空间 存储静态变量和项目配置等信息，也是项目的入口函数
	 */
	var or = window.or = {
		page: {
			//登录
			"login": {
				"url": "login.html",//项目的html url
				"deps": "" //每个页面依赖的js
			},
			//身份验证
			"authentication": {
				"url": "authentication.html",
				"deps": ""
			},

			"customerreviews": {
				"url": "customer_reviews.html",
				"deps": ""
			},
			//身份验证
			"identityauthentication": {
				"url": "identity-authentication.html",
				"deps": ""
			},
			//抽奖
			"lottery": {
				"url": "Lottery.html",
				"deps": ""
			},
			//任务完成
			"missioncomplete": {
				"url": "mission-complete.html",
				"deps": ""
			},
			//我的业绩
			"myachievement": {
				"url": "my-achievement.html",
				"deps": ""
			},
			//我的任务
			"mytask": {
				"url": "my-task.html",
				"deps": ""
			},
			//个人中心
			"personalcenter": {
				"url": "personal-center.html",
				"deps": ""
			},
			"servicecontent": {
				"url": "service-content.html",
				"deps": ""
			},
			//欢迎页
			"welcome": {
				"url": "welcome.html",
				"deps": "welcome",
			},
			//抢单页面
			"pieorderinfo":{
				"url": "main.html",
				"deps": "",
			},
			//地图页面
			"map":{
				"url": "map.html",
				"deps": "",
			}
		},
		img: {

		} //图片资源路径
	}

	function getUrl() {
		var href = location.href,
			reg = /\/html\/([^\.]*\.html)/,
			page;
		if (reg.test(href)) {
			page = RegExp["$1"];
			return page;
		}
	}
	function loadPageDeps(url){
		if(!url){
			return
		}
		var	page=or.page,
			keys=Object.keys(page),
			key;
		for(var i=keys.length-1;i>=0;i--){
				key=keys[i];
				if(page[key].url===url){
					if(page[key].deps){
						require([page[key].deps]);
					}else{
						return false;
					}
				}
			}
	}
	loadPageDeps(getUrl());
	require(["http"],function($){
		window.$=$;
	})
})()