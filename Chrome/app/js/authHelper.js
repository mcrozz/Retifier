function sendToken(tkn) {
	console.debug(tkn);
	if (typeof chrome.runtime.sendMessage !== 'undefined') {
		// Google Chrome
		chrome.runtime.sendMessage("mmemeoejijknklekkdacacimmkmmokbn", tkn);
		// Google Chrome Debug
		chrome.runtime.sendMessage("kjodiibbffbehnhdmddkjlajemalogoc", tkn);
	}
}

function getToken() {
	try {
		if (document.location.hash.split('&')[0].split('=')[1] === undefined)
			throw Error();
		sendToken({
			code: 'token',
			token: document.location.hash.split('&')[0].split('=')[1]
		});
		// document.write('<a style="color:green">Success authification</a>')
	} catch(e) {
		// document.write('<a style="color:red">Auth failed</a>');
		sendToken({code:"error"});
	}
}

console.log(document.readyState);
console.log("Successfuly attached");
document.addEventListener('DOMContentLoaded', setTimeout(getToken, 1500));