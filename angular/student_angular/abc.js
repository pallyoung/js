if(getCurrentStudent()==null){
	createCurrentStudent();
}

window.onload = function(){
	window.next=function(){
		saveStudent();
		window.location="abc2.html";
	}
}

  