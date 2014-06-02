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

from functions import *

if os.path.exists(os.path.join(os.getcwd(), 'publisher.py')):
	from publisher import *
	ENABLE_PUBLISHER = True

os.system('title Builder for TwitchTV Notifier')
tld = "====================================================="
if sys.platform == 'win32':
	clr = 'cls'
else:
	clr = 'clear'

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
		print ">  Press [ENTER] for build"
		print ">  Type [2] for changing version"
		if ENABLE_PUBLISHER:
			print ">  Type [1] for publishing"
		print ">  Type [0] for exit"
		k = ink('>>> ')
		print tld
		if k == '':
			build(b)
			ink('[DONE]')
		elif k == '1' and ENABLE_PUBLISHER:
			publish_app(b)
			ink('Press any key to continue');
		elif k == '2':
			print "Change version from "+v
			g = ink('>>> ')
			c[b]['Ver'] = g
			sc(c)
		else:
			return returnt()

def returnt():
	print "         Back to main menu?"
	print "    [1] Yes"
	print "    [0] No"
	k = ink('>>> ')
	if k == '1':
		init()
	else:
		exit()

def init():
	os.system(clr)
	print tld
	print "   Welcome to build script for TwitchTV Notifier"
	print tld
	print "    [1]: Chrome"
	print "    [2]: Opera"
	print "    [3]: Firefox"
	print "    [4]: Safari"
	print "    [0]: Exit"
	print tld
	inkey = ink(">>> ")
	if inkey == '1':
		loopbuild('Chrome')
	elif inkey == '2':
		loopbuild('Opera')
	elif inkey == '3':
		loopbuild('Firefox')
	elif inkey == '4':
		loopbuild('Safari')
	else:
		exit()

init()