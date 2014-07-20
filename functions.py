"""
Copyright 2014 Ivan 'MacRozz' Zarudny

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

import os, json, shutil, sys

tld = "====================================================="

def rp(w, j, o):
	with open(o,'r') as f:
		newlines = []
		for line in f.readlines():
			newlines.append(line.replace(w, j))
	with open(o, 'w') as f:
		for line in newlines: f.write(line)
	f.close()

def pj(g):
	h = os.path.join(g[0], g[1])
	for f in g:
		if f != g[0] and f != g[1]:
			h = os.path.join(h, f)
	return h

def sc(c):
	with open('config.json', 'w') as o:
		json.dump(c, o)

def cf():
	return json.load(open('config.json'))

def rf(f):
	with open(f, 'r') as o:
		return o.read()

def int(f):
	if os.path.exists(f):
		os.chmod(f, 436)
		shutil.rmtree(f)
		os.makedirs(f)
		print "	Folder cleared"
	else:
		os.makedirs(f)
		print "	Folder created"
	os.chmod(f, 436)

def ink(f):
	return raw_input(f)

def build(b):
	config = cf()
	browser = b
	currDir = os.getcwd()
	dbDir = pj([currDir, browser, "debug"])
	print "     Build extension for "+browser
	print tld
	# Clear debug folder
	int(dbDir)
	# Create folders from config
	for f in config['Create']:
		os.makedirs(pj([dbDir, f]));
	# Copy without replacement
	for t in config['Copy']:
		shutil.copy2(pj([currDir, 'Code', t]), pj([dbDir, t]))
		print "	Copy "+t;
	# Copy whatsNew.js
	shutil.copy2(pj([currDir, browser, 'app', 'js', 'whatsNew.js']), pj([dbDir, 'js', 'whatsNew.js']))
	# Copy background.html
	if config[browser]['CopyBackgound'] == 'true':
		shutil.copy2(pj([currDir, 'Code', 'background.html']), pj([dbDir, 'background.html']))
	# Replace FUNCTIONS_FIRST_START
	print "	Replace FUNCTIONS_FIRST_START on FunctionsFirstStart.js"
	rp("{{FUNCTIONS_FIRST_START}}", rf(pj([currDir, browser, "app", "js", "FunctionsFirstStart.js"])), pj([dbDir, "js", "functions.js"]))
	# Replace INTERVAL_STORAGE_CHANGE
	print "	Replace INTERVAL_STORAGE_CHANGE on IntervalStorageChange.js"
	rp("{{INTERVAL_STORAGE_CHANGE}}", rf(pj([currDir, browser, "app", "js", "IntervalStorageChange.js"])), pj([dbDir, "js", "functions.js"]))
	# Replace APP_VERSION_CURRENT
	print "	Replace APP_VERSION_CURRENT on "+config[browser]['Ver']
	rp("{{APP_VERSION_CURRENT}}", "v."+config[browser]['Ver'], pj([dbDir, "js", "functions.js"]))
	# Replace NOTIFY_USER_FUNCTION
	print "	Replace NOTIFY_USER_FUNCTION on notifications.js"
	rp("{{NOTIFY_USER_FUNCTION}}", rf(pj([currDir, browser, "app", "js", "notifications.js"])), pj([dbDir, "js", "functions.js"]))
	# Replace CSS_COMPILER
	print "	Replace CSS_COMPILER on CSScompiler.js"
	rp("{{CSS_COMPILER}}", rf(pj([currDir, browser, "app", "js", "CSScompiler.js"])), pj([dbDir, "popup.js"]))
	# Replace LINK_REVIEW
	print "	Replace LINK_REVIEW on <link>"
	rp("{{LINK_REVIEW}}", config[browser]['Review'], pj([dbDir, "popup.js"]))
	# Replace IF_BACKGROUND_BEGIN
	print "	Replace IF_BACKGROUND_BEGIN on "+config[browser]['IfBackA']
	rp("{{IF_BACKGROUND_BEGIN}}", config[browser]['IfBackA'], pj([dbDir, "js", "functions.js"]))
	if config[browser]['UpdateLocal'] == 'true':
		# Replace UPDATE_LOCAL_VAR_FUNC
		print "	Replace UPDATE_LOCAL_VAR_FUNC on updateLocalVar.js"
		rp("{{UPDATE_LOCAL_VAR_FUNC}}", rf(pj([currDir, browser, 'app', 'js', 'updateLocalVar.js'])), pj([dbDir, "js", "functions.js"]))
		# Replace UPDATE_LOCAL_VAR_CALL
		print "	Replace UPDATE_LOCAL_VAR_CALL on ch()"
		rp("{{UPDATE_LOCAL_VAR_CALL}}", 'ch()', pj([dbDir, "js", "functions.js"]))
	else:
		# Replace UPDATE_LOCAL_VAR_FUNC
		print "	Replace UPDATE_LOCAL_VAR_FUNC on <nothing>"
		rp("{{UPDATE_LOCAL_VAR_FUNC}}", '', pj([dbDir, "js", "functions.js"]))
		# Replace UPDATE_LOCAL_VAR_CALL
		print "	Replace UPDATE_LOCAL_VAR_CALL on <nothing>"
		rp("{{UPDATE_LOCAL_VAR_CALL}}", '', pj([dbDir, "js", "functions.js"]))
	# Replace IF_BACKGROUND_END
	print "	Replace IF_BACKGROUND_END on "+config[browser]['IfBackB']
	rp("{{IF_BACKGROUND_END}}", config[browser]['IfBackB'], pj([dbDir, "js", "functions.js"]))
	# Replace Platform
	print "	Replace PLATFORM on "+config[browser]['Platform']
	rp("{{PLATFORM}}", config[browser]['Platform'], pj([dbDir, "js", "functions.js"]))
	rp("{{PLATFORM}}", config[browser]['Platform'], pj([dbDir, "style.css"]))
	# Replace INSERT_SCRIPTS_HERE
	print "	Replace INSERT_SCRIPTS_HERE on JS_scripts"
	scrpts = ''
	for y in config['Scripts']:
		if y == "background.js":
			if config[browser]['CopyBackgound'] != 'true':
				scrpts += '<script src="'+y+'"></script>\n'
		else:
			scrpts += '<script src="'+y+'"></script>\n'
	rp("{{INSERT_SCRIPTS_HERE}}", str(scrpts), pj([dbDir, "popup.html"]))
	# Replace INSERT_BACKGROUND_SCRIPTS
	if config[browser]['CopyBackgound'] == 'true':
		print "	Replace INSERT_BACKGROUND_SCRIPTS on JS_scripts"
		scrBack = ''
		for g in config['ScriptsBack']:
			scrBack += '<script src="'+g+'"></script>\n'
		rp('{{INSERT_BACKGROUND_SCRIPTS}}', str(scrBack), pj([dbDir, 'background.html']))
	# Replace BADGE_ONLINE_COUNT
	print "	Replace BADGE_ONLINE_COUNT on BadgeOnlineCount.js"
	rp("{{BADGE_ONLINE_COUNT}}", rf(pj([currDir, browser, "app", "js", "BadgeOnlineCount.js"])), pj([dbDir, "js", "functions.js"]))
	# Replace PARSE_COM_SRC
	if config[browser]['Parse'] == 'site':
		print "	Replace PARSE_COM_SRC on <site>"
		rp("{{PARSE_COM_SRC}}", "https://www.parsecdn.com/js/parse-1.2.18.min.js", pj([dbDir, 'js', 'functions.js']))
	else:
		print "	Replace PARSE_COM_SRC on <local_url>"
		rp("{{PARSE_COM_SRC}}", "./js/parse-1.2.18.min.js", pj([dbDir, 'js', 'functions.js']))
		print "	Copy parse.js"
		shutil.copy2(pj([currDir, 'Code', 'js', 'parse-1.2.18.min.js']), pj([dbDir, 'js', 'parse-1.2.18.min.js']))
	# Inserting config file 'n' replace version
	print "	Inserting "+config[browser]['Config']
	shutil.copy2(pj([currDir, browser, 'app', config[browser]['Config']]), pj([dbDir, config[browser]['Config']]))
	rp('{{APP_VERSION_CURRENT}}', config[browser]['Ver'], pj([dbDir, config[browser]['Config']]))
	config[browser]['Build'] += 1
	sc(config)