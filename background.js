setInterval(function () { if (localStorage['JustReload'] == "1") {location.reload();localStorage['JustReload'] = null }}, 1000);
try {
	if (JSON.parse(localStorage['Code']).Background.code != "//code") {
		eval(JSON.parse(localStorage['Code']).Background.code)
	} else {
		setTimeout(function(){location.reload()},3000);
	}
} catch(err) {
	console.error(err.message);
}