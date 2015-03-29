function send(msg, callback) {
	if (typeof callback === 'function')
		receive(msg, callback);
	else
		receive(msg);
}
