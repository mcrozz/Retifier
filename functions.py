"""
Copyright 2014-2015 Ivan 'MacRozz' Zarudny

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

def p(m):
	print(m)

def rp(w, j, o):
	f = open(o, 'r')
	newlines = []
	for line in f.readlines():
			newlines.append(line.replace(w, j))
	f.close()
	with open(o, 'w') as f:
		for line in newlines:
			f.write(line)
	n = o.split("\\")
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
	with open(f, 'r') as r:
		return r.read();

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
	return c.replace("\n", "").replace("\t", "").replace("    ", "");

def build(b, s):
	config = cf()
	browser = b
	currDir = os.getcwd()
	if browser == "Safari":
		dbDir = pj([currDir, browser, "debug.safariextension"])
	else:
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
		if not s:
			p("	Copy "+t);
	# Copy browser additionals
	if config[browser]['Add']:
		for adds in config[browser]['Add']:
			shutil.copy2(pj([currDir, browser, 'app', adds]), pj([dbDir, adds]))
	# Copy whatsNew.js
	shutil.copy2(pj([currDir, browser, 'app', 'js', 'whatsNew.js']), pj([dbDir, 'js', 'whatsNew.js']))
	# Copy background.html
	if config[browser]['CopyBackgound'] == 'true':
		shutil.copy2(pj([currDir, 'Code', 'background.html']), pj([dbDir, 'background.html']))
	# Replace INSERT_SCRIPTS_HERE
	scrpts = '<script src="./js/'+config['GlobalVar']['jQuery']+'"></script>\n'
	for y in config['Scripts']:
		if y == "background.js":
			# FIXIT: probably bug
			if config[browser]['CopyBackgound'] != 'true':
				scrpts += '<script src="'+y+'"></script>\n'
		else:
			scrpts += '<script src="'+y+'"></script>\n'
	rp("{{INSERT_SCRIPTS_HERE}}", str(scrpts), pj([dbDir, "popup.html"]))
	# Replace INSERT_BACKGROUND_SCRIPTS
	if config[browser]['CopyBackgound'] == 'true':
		scrBack = '<script src="./js/'+config['GlobalVar']['jQuery']+'"></script>\n'
		for g in config['ScriptsBack']:
			scrBack += '<script src="'+g+'"></script>\n'
		rp('{{INSERT_BACKGROUND_SCRIPTS}}', str(scrBack), pj([dbDir, 'background.html']))
	# Replace PARSE_COM_SRC
	if config[browser]['Parse'] == 'site':
		rp("{{PARSE_COM_SRC}}", "https://www.parsecdn.com/js/"+config['GlobalVar']['Parse'], pj([dbDir, 'js', 'functions.js']))
	else:
		rp("{{PARSE_COM_SRC}}", "./js/"+config['GlobalVar']['Parse'], pj([dbDir, 'js', 'functions.js']))
		p("	Copy parse.js")
		shutil.copy2(pj([currDir, 'Code', 'js', config['GlobalVar']['Parse']]), pj([dbDir, 'js', config['GlobalVar']['Parse']]))
	# Inserting config file 'n' replace version
	p("	Inserting "+config[browser]['Config'])
	shutil.copy2(pj([currDir, browser, 'app', config[browser]['Config']]), pj([dbDir, config[browser]['Config']]))
	# Replacing {{variables}}
	for h in config['Variables']:
		itm = config['Variables'][h]
		va = itm.split(" in ")
		outf = []
		"""
		* file()
		* var()
		* code()
		* deb()
		"""
		for i in va:
			if i.startswith('file'):
				outf.append(rf(pj([currDir, browser, i.replace('file(', '').replace(')', '')])))
			elif i.startswith('var'):
				outf.append(config[browser][i.replace('var(', '').replace(')', '')])
			elif i.startswith('code'):
				outf.append(rf(pj([currDir, 'Code', i.replace('code(', '').replace(')', '')])));
			elif i.startswith('deb'):
				outf.append(pj([dbDir, i.replace('deb(', '').replace(')', '')]));
		if len(outf) != 2:
			p("    > failed to detect variables")
			p("    [ERROR]")
			sys.exit(0);
		rp("{{"+h+"}}", outf[0], outf[1]);
	# Inserting app version
	rp("{{APP_VERSION_CURRENT}}", config[browser]['Ver'], pj([dbDir, config[browser]['Config']]))
	# Inserting LICENSE_HEADER
	toR = [
		'css\\style.css',
		'css\\full.css',
		'css\\grid.css',
		'css\\light.css',
		'js\\functions.js',
		'js\\firstStart.js',
		'js\\whatsNew.js',
		'popup.js',
		'js\\insertFunc.js',
		'background.js']
	for itme in toR:
		rp("{{LICENSE_HEADER}}", rf(pj([currDir, 'Code', 'LICENSE_HEADER'])), pj([dbDir, itme]))
	config[browser]['Build'] += 1
	sc(config)
	p(" [DONE]");
