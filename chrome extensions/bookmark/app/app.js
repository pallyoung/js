(function(){
	function getBookmarkList(list){
		list.forEach(function(i,value){
			document.body.innerHTML+=value;
		})
	}
	chrome.bookmarks.getTree(getBookmarkList);
})()