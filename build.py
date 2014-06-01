# Copyright 2014 Ivan 'MacRozz' Zarudny
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# 	http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os, json, shutil, sys;

os.system('title Builder for TwitchTV Notifier')
tld = "====================================================="
if sys.platform == 'win32':
	clr = 'cls'
else:
	clr = 'clear'

def rp(w, j, o):
	with open(o,'r') as f:
		newlines = [];
		for line in f.readlines():
			newlines.append(line.replace(w, j));
	with open(o, 'w') as f:
		for line in newlines: f.write(line);
	f.close();

def pj(f, s):
	return os.path.join(f, s);

def sc(c):
	with open('config.json', 'w') as o:
		json.dump(c, o);

def cf():
	return json.load(open('config.json'));

def rf(f):
	with open(f, 'r') as o:
		return o.read();

def int(f):
	if os.path.exists(f):
		os.chmod(f, 436)
		shutil.rmtree(f)
		os.makedirs(f)
		print "	Folder cleared"
	else:
		os.makedirs(f)
		print "	Folder created";
	os.chmod(f, 436);

def ink(f):
	try:
		return input(f)
	except SyntaxError as e:
		return "ENTER"
	except Exception, e:
		return e;

def build(b):
	config = cf()
	browser = b
	currDir = os.getcwd()
	dbDir = pj(currDir, browser+"\\debug")
	print "     Build extension for "+browser
	print tld
	# Clear debug folder
	int(dbDir)
	# Create folders from config
	for f in config['Create']:
		os.makedirs(pj(dbDir, f));
	# Copy without replacement
	for t in config['Copy']:
		shutil.copy2(pj(currDir, 'Code\\'+t), pj(dbDir, t))
		print "	Copy "+t;
	# Copy music
	print "	Copy music"
	for d in config['Music']:
		ftc = d+'.'+config[browser]['Music']
		shutil.copy2(pj(currDir, "Code\\music\\"+ftc), pj(dbDir, "music\\"+ftc));
	# Copy whatsNew.js
	shutil.copy2(pj(currDir, browser+'\\app\\js\\whatsNew.js'), pj(dbDir, 'js\\whatsNew.js'));
	# Copy background.html
	if config[browser]['CopyBackgound'] == 'true':
		shutil.copy2(pj(currDir, 'Code\\background.html'), pj(dbDir, 'background.html'));
	# Replace FUNCTIONS_FIRST_START
	print "	Replace FUNCTIONS_FIRST_START on FunctionsFirstStart.js"
	rp("{{FUNCTIONS_FIRST_START}}", rf(pj(currDir, browser+"\\app\\js\\FunctionsFirstStart.js")), pj(dbDir, "js\\functions.js"))
	# Replace INTERVAL_STORAGE_CHANGE
	print "	Replace INTERVAL_STORAGE_CHANGE on IntervalStorageChange.js"
	rp("{{INTERVAL_STORAGE_CHANGE}}", rf(pj(currDir, browser+"\\app\\js\\IntervalStorageChange.js")), pj(dbDir, "js\\functions.js"))
	# Replace APP_VERSION_CURRENT
	print "	Replace APP_VERSION_CURRENT on "+config[browser]['Ver']
	rp("{{APP_VERSION_CURRENT}}", "v."+config[browser]['Ver'], pj(dbDir, "js\\functions.js"))
	# Replace NOTIFY_USER_FUNCTION
	print "	Replace NOTIFY_USER_FUNCTION on notifications.js"
	rp("{{NOTIFY_USER_FUNCTION}}", rf(pj(currDir, browser+"\\app\\js\\notifications.js")), pj(dbDir, "js\\functions.js"))
	# Replace CSS_COMPILER
	print "	Replace CSS_COMPILER on CSScompiler.js"
	rp("{{CSS_COMPILER}}", rf(pj(currDir, browser+"\\app\\js\\CSScompiler.js")), pj(dbDir, "popup.js"))
	# Replace LINK_REVIEW
	print "	Replace LINK_REVIEW on <link>"
	rp("{{LINK_REVIEW}}", config[browser]['Review'], pj(dbDir, "popup.js"))
	# Replace IF_BACKGROUND_BEGIN
	print "	Replace IF_BACKGROUND_BEGIN on "+config[browser]['IfBackA']
	rp("{{IF_BACKGROUND_BEGIN}}", config[browser]['IfBackA'], pj(dbDir, "js\\functions.js"))
	# Replace IF_BACKGROUND_END
	print "	Replace IF_BACKGROUND_END on "+config[browser]['IfBackB']
	rp("{{IF_BACKGROUND_END}}", config[browser]['IfBackB'], pj(dbDir, "js\\functions.js"))
	# Replace Platform
	print "	Replace PLATFORM on "+config[browser]['Platform']
	rp("{{PLATFORM}}", config[browser]['Platform'], pj(dbDir, "js\\functions.js"))
	rp("{{PLATFORM}}", config[browser]['Platform'], pj(dbDir, "style.css"))
	# Replace INSERT_SCRIPTS_HERE
	print "	Replace INSERT_SCRIPTS_HERE on JS_scripts"
	scrpts = ''
	for y in config['Scripts']:
		if y == "background.js":
			if config[browser]['CopyBackgound'] != 'true':
				scrpts += '<script src="'+y+'"></script>\n';
		else:
			scrpts += '<script src="'+y+'"></script>\n';
	rp("{{INSERT_SCRIPTS_HERE}}", str(scrpts), pj(dbDir, "popup.html"))
	# Replace INSERT_BACKGROUND_SCRIPTS
	if config[browser]['CopyBackgound'] == 'true':
		print "	Replace INSERT_BACKGROUND_SCRIPTS on JS_scripts"
		scrBack = ''
		for g in config['ScriptsBack']:
			scrBack += '<script src="'+g+'"></script>\n'
		rp('{{INSERT_BACKGROUND_SCRIPTS}}', str(scrBack), pj(dbDir, 'background.html'))
	# Replace BADGE_ONLINE_COUNT
	print "	Replace BADGE_ONLINE_COUNT on BadgeOnlineCount.js"
	rp("{{BADGE_ONLINE_COUNT}}", rf(pj(currDir, browser+"\\app\\js\\BadgeOnlineCount.js")), pj(dbDir, "js\\functions.js"))
	# Inserting config file 'n' replace version
	print "	Inserting "+config[browser]['Config']
	shutil.copy2(pj(currDir, browser+'\\app\\'+config[browser]['Config']), pj(dbDir, config[browser]['Config']))
	rp('{{APP_VERSION_CURRENT}}', config[browser]['Ver'], pj(dbDir, config[browser]['Config']))
	config[browser]['Build'] += 1
	sc(config)
	ink('[DONE]');

def loopbuild(b):
	while True:
		c = cf()
		v = c[b]['Ver']
		bl = str(c[b]['Build'])
		os.system(clr)
		print tld
		print "            TwitchTV Notifier for "+b
		print "           Version: "+v+" ("+bl+" build)"
		print tld
		print "    Press [ENTER] for build, Type [X] for exit"
		k = ink('>>> ')
		print tld
		if k == 'ENTER':
			build(b)
		else:
			return returnt();

def returnt():
	print "         Back to main menu?"
	print "    [Y]es"
	print "    [N]o"
	k = ink('>>> ')
	if k == 'Y':
		init()
	else:
		exit();

def init():
	os.system(clr)
	print tld
	print "   Welcome to build script for TwitchTV Notifier"
	print tld
	print "    [1]: Chrome"
	print "    [2]: Opera"
	print "    [3]: Firefox"
	print "    [4]: Safari"
	print "    [X]: Exit"
	print tld
	inkey = ink(">>> ")
	if inkey == 1:
		loopbuild('Chrome')
	elif inkey == 2:
		loopbuild('Opera')
	elif inkey == 3:
		loopbuild('Firefox')
	elif inkey == 4:
		loopbuild('Safari')
	elif inkey == 'x' or inkey == 'X' or inkey == 0:
		exit();

init()