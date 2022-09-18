window.addEventListener("load",() => {

	var checkbox = document.getElementById("switch");
	var markup = document.documentElement.innerHTML;

	checkbox.addEventListener('change', function () {
	if (checkbox.checked) {
		// do thiss
		console.log('Checked');
	} else {
		// do that
		console.log('Not checked');
	}
	});
});

