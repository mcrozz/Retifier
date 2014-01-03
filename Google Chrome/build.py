import shutil, os, distutils.core, zipfile;

appver="1.3.4"
BackgroundJS="81"
PopupJS="87"
insertFuncJS="119"

debug1="/* << -- DELETE BEFORE RELEASE -- >>"
debug2="<< -- DELETE BEFORE RELEASE -- >> */"

dirApp=os.path.join(os.getcwd(), "APP")
dirDebug=os.path.join(os.getcwd(), "debug")
dirBuild=os.path.join(os.getcwd(), "build", appver)

def replaceSmth(what, onWhat, where):
	with open(where,'r') as f:
		newlines = []
		for line in f.readlines():
			newlines.append(line.replace(what, onWhat));
	with open(where, 'w') as f:
		for line in newlines:
			f.write(line);
	f.close();

print "==============================="
print "  [1]: Debug"
print "  [2]: Clear debug folder"
print "  [3]: Build"
print "==============================="
try:
	inkey = input("Your choose: ")
except Exception, e:
	inkey = 0


os.chmod(dirApp, 436)


if inkey == 1:
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
	distutils.dir_util.copy_tree(dirApp, dirDebug)
	print "Replacing app version in manifest"
	replaceSmth("{appver}", appver, os.path.join(dirDebug, "manifest.json"))
	print "Blocking update.js"
	replaceSmth("{debug1}", debug1, os.path.join(dirDebug, r"lib\updater.js"))
	replaceSmth("{debug2}", debug2, os.path.join(dirDebug, r"lib\updater.js"))
elif inkey == 2:
	print "======CLEAR DEBUG FOLDER======="
	if os.path.exists(dirDebug):
		os.chmod(dirDebug, 436)
		shutil.rmtree(dirDebug)
		os.makedirs(dirDebug)
		print "Folder cleared"
	else:
		os.makedirs(dirDebug)
		print "Folder created";
elif inkey == 3:
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
	shutil.move(os.path.join(dirBuild, "background.js"), os.path.join(dirBuild, "lib\Background_code"))
	shutil.move(os.path.join(dirBuild, "popup.js"), os.path.join(dirBuild, "lib\Popup_code"))
	shutil.move(os.path.join(dirBuild, "insertFunc.js"), os.path.join(dirBuild, "lib\insertFunc_code"))
	shutil.move(os.path.join(dirBuild, r"client\background.js"), dirBuild)
	shutil.move(os.path.join(dirBuild, r"client\popup.js"), dirBuild)
	shutil.move(os.path.join(dirBuild, r"client\insertFunc.js"), dirBuild)
	os.rmdir(os.path.join(dirBuild, "client"))
	print "Replacing app version in manifest"
	replaceSmth("{appver}", appver, os.path.join(dirDebug, "manifest.json"))
	print "Enable update.js"
	replaceSmth("{debug1}", " ", os.path.join(dirDebug, r"lib\updater.js"))
	replaceSmth("{debug2}", " ", os.path.join(dirDebug, r"lib\updater.js"))
	print "Insert JS versions"
	replaceSmth("{BackgroundJS}", BackgroundJS, os.path.join(dirDebug, r"lib\updater.js"))
	replaceSmth("{PopupJS}", PopupJS, os.path.join(dirDebug, r"lib\updater.js"))
	replaceSmth("{insertFuncJS}", insertFuncJS, os.path.join(dirDebug, r"lib\updater.js"))
else:
	print "Error - invalid input"