$(document).ready(function () {
///start
	


	var dropZone = document.getElementById("drop-zone");
	var msgConteiner = document.querySelector("#drop-zone .text");
	
	var eventClear = function (e) {
		e.stopPropagation();
		e.preventDefault();
	}
	
	dropZone.addEventListener("dragenter", eventClear, false);
	dropZone.addEventListener("dragover", eventClear, false);
	
	dropZone.addEventListener("drop", function (e) {
			if(!e.dataTransfer.files) return;
			e.stopPropagation();
			e.preventDefault();

			sendFile(e.dataTransfer.files[0]);
		}, false);
	
	document.getElementById("file").addEventListener("change", function (e) {
			sendFile(e.target.files[0]);
		}, false);
	
	
	var statChange = function (e) {
		if (e.target.readyState == 4) {
			if (e.target.status == 200) {
				msgConteiner.innerHTML = "Загрузка успешно завершена!";
				dropZone.classList.remove("error");
				dropZone.classList.add("success");
				
				$("div").html(this.responseText);
			} else {
				msgConteiner.innerHTML = "Произошла ошибка!";
				dropZone.classList.remove("success");
				dropZone.classList.add("error");
			}
		}
	}
	
	var showProgress = function(e) {
		if (e.lengthComputable) {
			var percent = Math.floor((e.loaded / e.total) * 100);
			msgConteiner.innerHTML = "Загрузка... ("+ percent +"%)";
		}
	};
	
	var sendFile = function(file) {
		dropZone.classList.remove("success");
		dropZone.classList.remove("error");
		
		var re = /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)$/i;
		if (!re.exec(file.name)) {
			msgConteiner.innerHTML = "Недопустимый формат файла!";
			dropZone.classList.remove("success");
			dropZone.classList.add("error");
		}
		else {
			var fd = new FormData();
			fd.append("upfile", file);
			
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "./upload.php", true);
			
			xhr.upload.onprogress = showProgress;
			xhr.onreadystatechange = statChange;
			
			xhr.send(fd);
		}
	}
	

///end
});
