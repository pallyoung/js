(function() {
	/**
	 *conform  to the amd specification
	 *
	 **/
	var VERSION = "0.1";
	var op 			=	Object.prototype,
		tostring	=	op.toString,
		hasOwn 		=	op.hasOwnProperty,
		ap      	= 	Array.prototype,
        apsp 		= 	ap.splice;

    var waitForId=null;
  	
  	/**
  	* a object to store the path of modules
  	**/
   	var paths={},baseUrl='';
   	/**
   	*store the user configuration
   	**/

    var config={
    	baseUrl:baseUrl,
    	paths:paths
    };

     /**
    *use to store the modules which has been defined
    *id:{
		status:0,
		// 0 for unload ,
		// 1 for complete load ,
		// 2 for factory has been resolved,
		// 4 for error
		factory:function,
		export:object,
		dependencies:[]
    }
    **/
    var modules={};
    /**
    *a queue of require business,
    * when the business is ended, it will be shift
    *{
		dependencies:[],
		factory:function
    }
    **/
    var queue=[];

    /**
    *a function performs no operation
    **/
    function noop() {}

    /**
    *make a shallow copy of source
    **/
	function extend(dst, source) {
		for (var o in source) {
			if (hasOwn.call(source,o)) {
				dst[o] = source[o];
			}
		}
	} 

	/**
	* check the value is undefinded or not
	**/
	function isUndefined(value) {
		return typeof value === 'undefined';
	}

	/**
	* check the value is definded or not
	**/
	function isDefined(value) {
		return typeof value !== 'undefined';
	}

	/**
	* check the value is function or not
	**/
	function isFunction(value) {
		return tostring.call(value) === '[object Function]';
	}

	function isString(value){
		return tostring.call(value) === '[object String]';
	}

	/**
	* check the value is array or not
	**/
	function isArray(value) {
		return tostring.call(value) === '[object Array]';
	}


	/**
	* get all of  scripts  that the document has
	**/
	function scripts() {
		return document.getElementsByTagName('script');
	}

	function getExtensionName(value){
		var extensionNameReg=/\.([^\.]*)$/
		return extensionNameReg.test(value)&&RegExp.$1;
	}

	function absURL(url){
		var a = document.createElement("a");
		a.href = url;
		return a.href;
	}


	function checkQueue(id){
		if(queue.length===0){
			return
		}
		var dependencies;
		var module,index;
		for(var i=0,l=queue.length;i<l;i++){
			dependencies=queue[i].dependencies;			
			if((index=dependencies.indexOf(id))!==-1){
				dependencies[index]=resolveFactory(id);
				for(var j=0,k=dependencies.length;j<k;j++){
					if(isString(dependencies[i])){
						return;
					}
				}
				queue[i].factory.apply(null,dependencies);
				queue.splice(i,1);
				return;

			}			
			// if there is one of the dependencies not loaded, do nothing
		}
	}

	function setQueue(dependencies,factory){
		queue.push({
			dependencies:dependencies,
			factory:factory
		});
	}
	/**
	*get the detail information of a module
	*if it is not exist, it will be create;
	**/
	function getModule(id){
		if(!modules[id]){
			modules[id]={
				status:0,
				factory:noop,
				export:null,
				dependencies:[]
			}				
		}
		return modules[id];
	}

	function setModule(id,dependencies,factory){
		if(id!==null){
			modules[id]={
				status:1,
				factory:factory,
				dependencies:dependencies,
				export:null
			}
		}else{
			needId(dependencies,factory);
		}
	}

	function needId(dependencies,factory){
		waitForId={
			dependencies:dependencies,
			factory:factory
		}
	}

	function loadScript(id,url){
		var script=document.createElement("script");
		script.type="text/javascript";
		script.onload=onScriptLoad;
		script.id=id;
		script.src=url;
		document.head.appendChild(script);
	}

	function onScriptLoad(evt){
		var target=evt.target;
		target.onload=null;
		if(waitForId===null){
			modules[target.id].status=1;
		}else{
			modules[target.id]={
				status:1,
				factory:waitForId.factory,
				dependencies:waitForId.dependencies,
				export:null
			}
			waitForId=null;
		}		
		checkQueue(target.id);
	}

	/**
	*if the script has't been loaded, load it
	*else do nothing
	**/
	function toLoadScript(id){
		var module=getModule(id);
		if(module["status"]===0){
			loadScript(id,getPath(id));
		}	
	}

	function resolveFactory(id){
		if(modules[id]&&modules[id]["status"]===1){
			modules[id]["status"]=2;
			modules[id]["export"]=modules[id]["factory"].call(null);
			return modules[id]["export"];
		}
	}
	function getPath(id){
		if(paths[id]){
			id=paths[id];
		}
		id=baseUrl+(id.indexOf('\.')===0?id:"\/"+id);
		return getExtensionName(id)!=="js"?id+".js":id;

	}

	function define(id, dependencies, factory) {
		(typeof id === 'string')||(factory=dependencies,dependencies=id,id=null);
		(isArray(dependencies))||(factory=dependencies,dependencies=[]);
		for(var i=dependencies.length-1;i>=0;i--){	
			toLoadScript(dependencies[i]);					
		}
		setModule(id,dependencies,factory);
	}

	function require(dependencies,factory) {
		//if there are no dependencies
		if(!isArray(dependencies)&&isFunction(dependencies)){
			return dependencies.call(null);
		}
		factory=factory||noop;
		setQueue(dependencies,factory);
		for(var i=0,l=dependencies.length;i<l;i++){
			toLoadScript(dependencies[i]);			
		}		
	}
	function setConfig(source) {
		if(typeof source==="object"){
			extend(config,source);
			baseUrl=config.baseUrl;
			paths=config.paths;

		}
	}
	  var mush = window.mush = {
		config:setConfig
	}
	require([document.querySelector("[data-main]").getAttribute("data-main")]);
	window.require=require;
	window.define=define;
})()