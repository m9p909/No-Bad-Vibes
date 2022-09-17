//contentScript.js

var markup = document.documentElement.innerHTML;


/*
var checkbox = document.querySelector('input[type="checkbox"]');

	checkbox.addEventListener('change', function () {
		if (checkbox.checked) {
		  // do this
		  console.log('Checked');
		} else {
		  // do that
		  console.log('Not checked');
		}
	  });
*/
console.log("hiii");


(() => {
	let youtubeLeftControls, youtubePlayer;
	let currentVideo= "";

	console.log("hiii");
	chrome.runtime.lastError;
	chrome.runetime.onMessage.addListner((obj,sender,response) => {
		const {type,value,videoId} = obj;

		if (type == "NEW"){
			currentVideo = videoId;
			
		}
	});
})();

/*

let checkbox = document.querySelector('input[type="checkbox"]');


	
	//checkbox.addEventListener('DOMContentLoaded', function () {
		
	  
		checkbox.addEventListener('change', function () {
		  if (checkbox.checked) {
			// do this
			console.log('Checked');
		  } else {
			// do that
			console.log('Not checked');
		  }
		});
	  //});

*/