import shutil, os, distutils.core, zipfile, subprocess;

def replaceSmth(what, onWhat, where):
	with open(where,'r') as f:
		newlines = []
		finded = 'false';
		for line in f.readlines():
			if line.find(what):
				finded = 'true';
			newlines.append(line.replace(what, onWhat));
	with open(where, 'w') as f:
		for line in newlines:
			f.write(line);
	f.close()
	return finded;

with open("version.config",'r') as f:
	config = []
	for line in f.readlines(): config.append(line);

name=config[0].replace('\n', '');
description=config[1].replace('\n', '');
site=config[2].replace('\n', '');
creator=config[3].replace('\n', '');
version=config[4].replace('\n', '');
build=config[5].replace('\n', '');
profile=config[6].replace('\n', '');

dirApp=os.path.join(os.getcwd(), "APP")
dirDebug=os.path.join(os.getcwd(), "debug")
dirDebugContent=os.path.join(dirDebug, 'chrome')
dirBuild=os.path.join(os.getcwd(), "build", version)
dirSrc=os.path.join(os.getcwd(), "src")
dirProfile=os.path.join(os.getcwd(), profile)

if not os.path.exists(dirProfile):
	print "Creating profile"
	os.makedirs(dirProfile)
	shutil.copy2(os.path.join(os.getcwd(), 'extensions.ini'), os.path.join(dirProfile, 'extensions.ini'))
	replaceSmth('{debugString}', '[ExtensionDirs] Extension0='+os.path.join(dirProfile, "extensions")+'\TwitchTVnotifier@mcrozz.net.xpi', os.path.join(dirProfile, 'extensions.ini'));
	cmd = '"C:/Program Files (x86)/Mozilla Firefox/Firefox.exe" -CreateProfile "'+profile+' '+dirProfile+'"'
	subprocess.call(cmd);

print "App ver. "+version+" (Build "+build+") profile: "+profile
print "==============================="
print "  [1]: Debug"
print "  [2]: Build"
print "  [X]: Exit"
print "==============================="

inkey = 0;

try:
	inkey = input("Your choose: ")
except Exception, e:
	inkey = 0;
os.chmod(dirApp, 436)

if inkey == 0:
    sys.exit();
elif inkey == 1:
	print "==========DEBUG MODE==========="
	print "Coping files..."
	if os.path.exists(dirDebug):
		os.chmod(dirDebug, 436)
		shutil.rmtree(dirDebug)
		os.makedirs(dirDebug)
		print "Folder cleared"
	else:
		os.makedirs(dirDebug)
		print "Folder created";
	os.chmod(dirDebug, 436)
	distutils.dir_util.copy_tree(dirSrc, dirDebug)
	distutils.dir_util.copy_tree(dirApp, dirDebugContent)
	print "Generate install.rdf"
	replaceSmth("{appversion}", version, os.path.join(dirDebug, "install.rdf"))
	replaceSmth("{appname}", name, os.path.join(dirDebug, "install.rdf"))
	replaceSmth("{appdescr}", description, os.path.join(dirDebug, "install.rdf"))
	replaceSmth("{appcreator}", creator, os.path.join(dirDebug, "install.rdf"))
	replaceSmth("{appurl}", site, os.path.join(dirDebug, "install.rdf"))
	print "Generate chrome.manifest"
	print "Packing extension in XPI file"
	with open("version.config",'w') as f:
		needLine = 0
		build = int(build) + 1
		for line in config:
			needLine+=1
			if needLine == 6:
				f.write(str(build)+'\n')
			else:
				f.write(line);
		f.close();
	target_dir = dirDebug
	zip = zipfile.ZipFile('TwitchTVnotifier@mcrozz.net.xpi', 'w', zipfile.ZIP_DEFLATED)
	rootlen = len(target_dir) + 1
	for base, dirs, files in os.walk(target_dir):
		for file in files:
			fn = os.path.join(base, file)
			zip.write(fn, fn[rootlen:]);
	zip.close()
	if os.path.exists(os.path.join(dirProfile, 'extensions')):
		os.remove(os.path.join(dirProfile, 'extensions'))
	else:
		os.makedirs(os.path.join(dirProfile, 'extensions'));
	shutil.move(os.path.join(os.getcwd(), 'TwitchTVnotifier@mcrozz.net.xpi'), os.path.join(dirProfile, 'extensions\\TwitchTVnotifier@mcrozz.net.xpi'))
	print 'Launching FireFox';
	subprocess.call('"C:/Program Files (x86)/Mozilla Firefox/Firefox.exe" -profile "'+dirProfile+'"');
elif inkey == 2:
	print "=============BUILD============="
	os.chmod(dirDebug, 436)
	print "Deleting current build if exists..."
	if not os.path.exists(dirBuild):
		os.makedirs(dirBuild)
		os.chmod(dirBuild, 436)
		print "Created new folder for debuggin'"
	else:
		shutil.rmtree(dirBuild)
		os.makedirs(dirBuild)
		os.chmod(dirBuild, 436);
	print "Coping files..."
	if distutils.dir_util.copy_tree(dirApp, dirBuild):
		print "Tree copied"
	else:
		print "Error";
	print "Replacing app version in manifest"
	if replaceSmth("{appver}", appver, os.path.join(dirBuild, "manifest.json")) == 'true': print "-Success"
	else: print "-Fail";
	with open("versions.config",'w') as f:
		needLine = 0
		Build = int(Build) + 1
		for line in config:
			needLine+=1
			if needLine == 2:
				f.write(str(Build))
			else:
				f.write(line);
		f.close();
else:
	print "Error - invalid input"