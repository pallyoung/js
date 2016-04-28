Student=function(){
this.name="";
this.sex="";
this.birthday="";
this.address="";
this.phone="";
}
createCurrentStudent = function() {
			localStorage.currentStudent=JSON.stringify(new Student());
			return localStorage.currentStudent;
}
getCurrentStudent = function() {
			if (!localStorage.currentStudent) {
				return null;
			}
			var data = JSON.parse(localStorage.currentStudent);
			return $.extend(new Student(), data);
}
saveCurrentStudent = function(stu) {
			localStorage.currentStudent=JSON.stringify($.extend(new Student(), stu));
			return localStorage.currentStudent;
}
deleteCurrentStudent = function(stu) {
			localStorage.remove(currentStudent);
			return localStorage.currentStudent;
}
  