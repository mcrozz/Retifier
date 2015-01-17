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

import os, json, shutil, sys, re

tld = "====================================================="
silent = False

def p(m):
	print(m)

def rp(w, j, o):
	f = open(o, 'r')
	if os.path.exists(j):
		j = open(j, 'r').read()
	newlines = []
	for line in f.readlines():
			newlines.append(line.replace(w, j))
	f.close()
	with open(o, 'w') as f:
		for line in newlines:
			f.write(line)
	n = o.split("\\")
	if silent:
		p("	Replacing "+w+" at "+n[len(n)-1])

def pj(g):
	h = os.path.join(g[0], g[1])
	for f in g:
		if f != g[0] and f != g[1]:
			h = os.path.join(h, f)
	return h

def sc(c):
	with open('config.json', 'w') as o:
		json.dump(c, o, sort_keys=True, indent=4, separators=(',', ': '))

def cf():
	return json.load(open('config.json'))

def rf(f):
	return open(f, 'r').read();

def int(f):
	if os.path.exists(f):
		os.chmod(f, 436)
		shutil.rmtree(f)
		os.makedirs(f)
		p("	Folder cleared")
	else:
		os.makedirs(f)
		p("	Folder created")
	os.chmod(f, 436)

def ink(f):
	return raw_input(f)

def fw(f, t):
	c = open(f, 'w+')
	c.write(t)
	c.close()

def cp(f, t):
	tmp = open(f).read()
	nf = open(t, 'w+')
	nf.write(tmp)
	nf.close()

def minify(c):
	c = c.replace("\n", "")
	c = c.replace("\t", "")
	c = c.replace("    ", "")
	return c;

def build(b, s):
	if s:
		silent = True;
	config = cf()
	browser = b
	currDir = os.getcwd()
	dbDir = pj([currDir, browser, "debug"])
	p("     Build extension for "+browser)
	p("     Destination path: "+dbDir)
	p(tld)
	# Clear debug folder
	int(dbDir)
	# Create folders from config
	for f in config['Create']:
		os.makedirs(pj([dbDir, f]));
	# Copy without replacement
	for t in config['Copy']:
		shutil.copy2(pj([currDir, 'Code', t]), pj([dbDir, t]))
		if not silent:
			p("	Copy "+t);
	# Copy whatsNew.js
	shutil.copy2(pj([currDir, browser, 'app', 'js', 'whatsNew.js']), pj([dbDir, 'js', 'whatsNew.js']))
	# Copy background.html
	if config[browser]['CopyBackgound'] == 'true':
		shutil.copy2(pj([currDir, 'Code', 'background.html']), pj([dbDir, 'background.html']))
	fw(pj([dbDir, 'style.css']), minify(rf(pj([currDir, 'Code', 'css', 'style.css']))))
	# Replace FUNCTIONS_FIRST_START
	rp("{{FUNCTIONS_FIRST_START}}", rf(pj([currDir, browser, "app", "js", "FunctionsFirstStart.js"])), pj([dbDir, "js", "functions.js"]))
	# Replace INTERVAL_STORAGE_CHANGE
	rp("{{INTERVAL_STORAGE_CHANGE}}", rf(pj([currDir, browser, "app", "js", "IntervalStorageChange.js"])), pj([dbDir, "js", "functions.js"]))
	# Replace APP_VERSION_CURRENT
	rp("{{APP_VERSION_CURRENT}}", "v."+config[browser]['Ver'], pj([dbDir, "js", "functions.js"]))
	# Replace NOTIFY_USER_FUNCTION
	rp("{{NOTIFY_USER_FUNCTION}}", rf(pj([currDir, browser, "app", "js", "notifications.js"])), pj([dbDir, "js", "functions.js"]))
	# Replace LINK_REVIEW
	rp("{{LINK_REVIEW}}", config[browser]['Review'], pj([dbDir, "popup.js"]))
	# Replace IF_BACKGROUND_BEGIN
	rp("{{IF_BACKGROUND_BEGIN}}", config[browser]['IfBackA'], pj([dbDir, "js", "functions.js"]))
	# Replace CSS_FULL
	rp("{{CSS_FULL}}", minify(rf(pj([currDir, 'Code', 'css', 'full.css']))), pj([dbDir, 'popup.js']))
	# Replace CSS_MINI
	rp("{{CSS_MINI}}", minify(rf(pj([currDir, 'Code', 'css', 'mini.css']))), pj([dbDir, 'popup.js']))
	# Replace CSS_GRID
	rp("{{CSS_GRID}}", minify(rf(pj([currDir, 'Code', 'css', 'grid.css']))), pj([dbDir, 'popup.js']))
	if config[browser]['UpdateLocal'] == 'true':
		# Replace UPDATE_LOCAL_VAR_FUNC
		rp("{{UPDATE_LOCAL_VAR_FUNC}}", rf(pj([currDir, browser, 'app', 'js', 'updateLocalVar.js'])), pj([dbDir, "js", "functions.js"]))
		# Replace UPDATE_LOCAL_VAR_CALL
		rp("{{UPDATE_LOCAL_VAR_CALL}}", 'ch()', pj([dbDir, "js", "functions.js"]))
	else:
		# Replace UPDATE_LOCAL_VAR_FUNC
		rp("{{UPDATE_LOCAL_VAR_FUNC}}", '', pj([dbDir, "js", "functions.js"]))
		# Replace UPDATE_LOCAL_VAR_CALL
		rp("{{UPDATE_LOCAL_VAR_CALL}}", '', pj([dbDir, "js", "functions.js"]))
	# Replace IF_BACKGROUND_END
	rp("{{IF_BACKGROUND_END}}", config[browser]['IfBackB'], pj([dbDir, "js", "functions.js"]))
	# Insert/minify style.css
	fw(pj([dbDir, 'style.css']), minify(rf(pj([currDir, 'Code', 'css', 'style.css']))))
	# Replace PLATFORM
	rp("{{PLATFORM}}", config[browser]['Platform'], pj([dbDir, "js", "functions.js"]))
	rp("{{PLATFORM}}", config[browser]['Platform'], pj([dbDir, "style.css"]))
	# Replace INSERT_SCRIPTS_HERE
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
		scrBack = ''
		for g in config['ScriptsBack']:
			scrBack += '<script src="'+g+'"></script>\n'
		rp('{{INSERT_BACKGROUND_SCRIPTS}}', str(scrBack), pj([dbDir, 'background.html']))
	# Replace BADGE_ONLINE_COUNT
	rp("{{BADGE_ONLINE_COUNT}}", rf(pj([currDir, browser, "app", "js", "BadgeOnlineCount.js"])), pj([dbDir, "js", "functions.js"]))
	# Replace PARSE_COM_SRC
	if config[browser]['Parse'] == 'site':
		rp("{{PARSE_COM_SRC}}", "https://www.parsecdn.com/js/parse-1.2.18.min.js", pj([dbDir, 'js', 'functions.js']))
	else:
		rp("{{PARSE_COM_SRC}}", "./js/parse-1.2.18.min.js", pj([dbDir, 'js', 'functions.js']))
		p("	Copy parse.js")
		shutil.copy2(pj([currDir, 'Code', 'js', 'parse-1.2.18.min.js']), pj([dbDir, 'js', 'parse-1.2.18.min.js']))
	# Inserting config file 'n' replace version
	p("	Inserting "+config[browser]['Config'])
	shutil.copy2(pj([currDir, browser, 'app', config[browser]['Config']]), pj([dbDir, config[browser]['Config']]))
	# Inserting LICENSE_HEADER
	toR = [
		'style.css',
		'js\\functions.js',
		'js\\firstStart.js',
		'js\\whatsNew.js',
		'popup.js',
		'js\\insertFunc.js',
		'background.js']
	for itme in toR:
		rp("{{LICENSE_HEADER}}", rf(pj([currDir, 'Code', 'LICENSE_HEADER'])), pj([dbDir, itme]))
	# Inserting APP_VERSION
	rp('{{APP_VERSION_CURRENT}}', config[browser]['Ver'], pj([dbDir, config[browser]['Config']]))
	config[browser]['Build'] += 1
	sc(config)
	p(" [DONE]");