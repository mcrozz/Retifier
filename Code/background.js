{{LICENSE_HEADER}}
if (localStorage.FirstLaunch === 'true') {
	localStorage.Following = 0;
	local.set('Status.update', 7);
	badge(' Hi ');
} else {
	badge(0);
	local.set('Status.online', 0);
	if (local.Game.list.length == undefined)
		local.set('Games', []);
	if (local.Game.list.length > 50) {
		local.set('Games', [])
	}
	if ($.inArray("object Object", localStorage.FollowingList) != -1) {
		localStorage.FollowingList = "{}";
		localStorage.Following = 0;
		send('refresh');
	}
	if (typeof local.FollowingList.length === 'undefined' && local.Following !== 0)
		local.set('Following', 0);
	$.each(local.FollowingList, function(i,v) {
		if (local.FollowingList.length === 0)
			return false;

		var j = {Stream: false}, k = local.FollowingList[i];
		if (typeof k.Notify === 'undefined')
			j.Notify = true;
		if (typeof k.d_name !== 'undefined')
			j.Name = k.d_name;

		local.following.set(i, j);
	});
}

try {
	ga('set', 'appVersion', local.App_Version.Ver);
	ga('send', 'event', 'version', local.App_Version.Ver, 'ver');
}catch(e){};

var bck = {
	online: {
		data: [],
		get: function() {
			return this.data;
		},
		add: function(n) {
			this.data.push(n.toLowerCase());
			local.set('Status.online', this.data.length);
			badge(this.data.length);
		},
		del: function(n) {
			var n = n.toLowerCase();
			this.data = this.data.filter(function(v) { return v !== n; });
			local.set('Status.online', this.data.length);
			badge(this.data.length);
		},
		is: function(n) {
			return (this.data.indexOf(n.toLowerCase()))!==-1;
		}
	},
	promise: {
		inWork: false, // is getList or getOnline in work?
		after: null, // call it after ending
		done: function() {
			// Script done
			bck.promise.inWork = false;
			var t = bck.promise.after;
			bck.promise.after = null;

			if (local.Status.update !== 5)
				local.set('Status.update', 0);

			if (typeof t === 'function')
				return t();
		},
		check: function(callback) {
			// Check if another script in work
			if (!bck.promise.inWork) {
				bck.promise.inWork = true;
				return false;
			} else {
				bck.promise.after = callback;
				return true;
			}
		}
	},
	check: function() {
		if (!localStorage.Following)
			localStorage.Following = 0;

		if (['','Guest',undefined].indexOf(local.Config.User_Name) !== -1) {
			if (localStorage.FollowingList !== "{}") {
				localStorage.FollowingList = "{}";
				send('refresh');
			}
			if (localStorage.FirstLaunch !== 'true') {
				local.set('Status.update', 6);
				log('Change user name!');
			}
			return false;
		}
		return true;
	},
	getList: function() {
		// Getting following list of user

		if (bck.promise.check(bck.getList))
			return;

		if (!bck.check())
			return bck.promise.done();
		local.set('Status.update', 1);
		log("Checking following list");
		notify.send({title:'Status', msg:'Checking following list...', type:'update'});
		local.set('Status.update', 2);

		$.getJSON('https://api.twitch.tv/kraken/users/'+local.Config.User_Name+'/follows/channels?limit=100&offset=0')
		.fail(function(j) {
			err({message:"Can't get following list",stack:j});
			local.set('Status.update', 5);
			notify.send({title:"Error happen", msg:"Cannot update following list", type:"update"});
			return bck.promise.done();
		})
		.done(function(j) {
			if (typeof local.FollowingList[0] === 'undefined' && local.Following !== 0)
				local.set('Following', 0);
			else if (local.Following === j._total)
				return bck.promise.done();

			log('Updating list of following channels');

			// If new user
			if (local.Following == 0) {
				$.each(j.follows, function(i,v) {
					local.following.set(i, {
						Name: v.channel.display_name,
						Stream: false,
						Notify: true,
						Followed: v.created_at
					});
				});
				local.set('Following', j._total);
				local.set('Status.online', 0);
				local.following.hash();
			} else {
				local.set('Following', j._total);
				local.following.analyse(j.follows);
			}
			return bck.promise.done();
		});
	},
	getOnline: function() {
		// Get online list

		if (bck.promise.check(bck.getOnline))
			return;

		if (!bck.check())
			return bck.promise.done();
		local.set('Status.update', 1);
		log("Checking status of streamers");
		notify.send({title:'Behold! Update!', msg:'Checking status of streamers...', type:'update'});
		local.set('Status.update', 4);
		local.set('Status.checked', 0);

		if (local.Config.token) {
			// Check token
			$.getJSON('https://api.twitch.tv/kraken/?oauth_token='+local.Config.token)
			.done(function(e) {
				// token is invalid, inform user
				if (!e.token.valid)
					window.toShow = 777;
			})
			.error(function(e) {
				err(e);
				return bck.promise.done();
			});

			if (window.toShow === 777)
				return bck.promise.done();

			$.getJSON('https://api.twitch.tv/kraken/streams/followed?limit=100&offset=0&oauth_token='+local.Config.token)
			.done(function(d) {
				// nobody online...
				if (d._total === 0) {
					log('Every channel checked');

					if (bck.online.get().length !== 0) {
						$.each(bck.online.get(), function(i,v) {
							// streamer gone offline
							bck.online.del(v);
							var str = local.following.get(v);

							if (str.Notify)
								notify.send({
									title: v+" went offline",
									msg: "Been online for "+time(str.Stream.Time),
									type: "offline"
								});

							local.following.set(v, {Stream: false});
							badge(0);
							send({type:'following', data: {Name:v, Stream:false}});
						});
					}
					return bck.promise.done();
				}

				var onl = [];
				$.each(d.streams, function(i,v) {
					onl.push(v.channel.name.toLowerCase());
				});

				return bck.checkStatus(onl, true);
			}).error(function(e) { err(e); return bck.promise.done(); });
		} else {
			var lst = [];
			$.each(local.FollowingList, function(i,v) {
				lst.push(v.Name.toLowerCase());
			});
			return bck.checkStatus(lst, false);
		}
	},
	recheckStatus: {
		to: [],
		checking: [],
		is: function(name) {
			return this.checking.indexOf(name)!=-1;
		},
		del: function(name) {
			this.to = this.checking.filter(function(n){
				return n!=name;
			});
		},
		countDownStarted: false,
		add: function(name) {
			this.to.push(name);
			
			if (this.countDownStarted)
				return;
			 
			setTimeout(function() {
				checkStatus(this.to, local.Config.token);
				this.checking = this.to;
				this.to = [];
			}, 5000);
			this.countDownStarted = true;
		}
	},
	checkStatus: function(list, token) {
		$.each(list, function(i,v) {
			$.getJSON('https://api.twitch.tv/kraken/streams/'+v)
			.fail(function(d) {
				err({message:'checkStatus() ended with error', stack:d});
				return bck.promise.done();
			})
			.done(chk)
			// looks odd, but it works :)
			.always(function() {
				// must be checked everything
				if (token) {
					// 'list' is already is online list
					$.each(bck.online.get(), function(i,v) {
						if (list.indexOf(v.toLowerCase()) === -1) {
							// streamer gone offline
							bck.online.del(v);
							var str = local.following.get(v);

							if (str.Notify)
								notify.send({
									title: v+" went offline",
									msg: "Been online for "+time(str.Stream.Time),
									type: "offline"
								});

							local.following.set(v, {Stream: false});
							send({type:'following', data: {Name:v, Stream:false}});
						}
					});
					local.set('Status.online', list.length);
					badge(list.length);
				} else {
					var onl = bck.online.get().length;

					if (onl <= 0) {
						onl = 0;
						$.each(local.FollowingList, function(i,v) {
							if (v.Stream)
								onl++;
						});
					}

					local.set('Status.online', onl);
					badge(local.Status.online);

					if (local.Config.Notifications.update) {
						switch (local.Status.online) {
							case 0:
								notify.send({title:'Update finished!', msg:'No one online right now :(', type:'update'}); break;
							case 1:
								notify.send({title:'Update finished!', msg:'Now online one channel', type:'update'}); break;
							default:
								notify.send({title:'Update finished!', msg:'Now online '+local.Status.online+' channels', type:'update'}); break;
						}
					}
				}

				if (i == list.length-1) {
					log('Every channel checked');
					return bck.promise.done();
				}
			});
		});

		function chk(d) {
			local.set('Status.checked', '+1');

			if (d.stream) {
				// Channel is online
				var FoLi = local.following.get(d.stream.channel.name.toLowerCase());
				if (typeof FoLi !== 'object')
					return err({message:'Could not find streamer in base, '+d.stream.channel.name});

				var Game = d.stream.channel.game,
					Status = d.stream.channel.status,
						Name = d.stream.channel.display_name,
						Time = d.stream.created_at;
				 
				if (FoLi !== null) {
					// Recheck streamer if status is undefined
					if (!Status && bck.recheckStatus.is(Name))
						return bck.recheckStatus.add(Name);

					if (!Status && FoLi.Stream.Title)
						Status = FoLi.Stream.Title;
					else if (!Status && !FoLi.Stream.Title)
						Status = 'Untitled stream';

					if (!Game && FoLi.Stream.Game)
						Game = FoLi.Stream.Game;
					else if (!Game && !FoLi.Stream.Game)
						Game = 'Not playing';

					if (!FoLi.Stream && !bck.online.is(Name)) {
						if (FoLi.Notify) {
							var dd = (((date()-date(Time))<=((local.Config.Interval_of_Checking+60)*1000)))
								?' just went live!':' is live!';
							notify.send({
								name: Name,
								title: Name+dd,
								msg: Status,
								type: 'online',
								button: true,
								context: Game
							});
						}
						bck.online.add(Name);
					}

					if (FoLi.Stream.Title !== Status && FoLi.Stream.Title)
						notify.send({
							name: Name,
							title: Name+' changed stream title on',
							msg: Status,
							type: 'follow',
							context: Game
						});

					if (FoLi.Stream.Time)
						if ((date(FoLi.Stream.Time)-date(Time)) > 0) {
							Time = FoLi.Stream.Time;
						}
				}

				local.Game.check(Game);

				var s = {
					Name   : Name,
					Stream : {
						Title  : Status,
						Game   : Game,
						Viewers: d.stream.viewers,
						Time   : Time
					}
				};
				local.following.set(Name, s);
				send({type:'following', data:s});
			} else if (!token) {
				var FoLi = local.following.get(d._links.self.split('/').pop(1));
				if (!FoLi)
					return err('Could not find streamer in the base, '+d.stream.channel.name);

				if (!FoLi.Stream)
					return;

				// Channel went offline
				if (FoLi.Notify)
					notify.send({
						title: FoLi.Name+" went offline",
						msg: "Been online for "+time(FoLi.Stream.Time),
						type: "offline"
					});
				bck.online.del(FoLi.Name);
				local.following.set(FoLi.Name, {Stream: false});
				send({type:'following', data: {Name:FoLi.Name, Stream:false}});
			}
		}
	},
	flush: function() {
		// in case of stuck
		bck.promise.inWork = false;
		bck.promise.after = null;
		$.each(local.FollowingList, function(i,v) {
			local.following.set(v.Name, {Stream: false});
		});
		badge(0);
		bck.online.data = [];
	},
	checkInt: function() {
		// Double check user interval
		if (local.Config.token && local.Config.Interval_of_Checking < .5)
			local.set('Config.Interval_of_Checking', .5);
		else if (!local.Config.token && local.Config.Interval_of_Checking < 1)
			local.set('Config.Interval_of_Checking', 1);
	},
	init: function() {
		// Get following list every two mins
		(function(){
			// If user does not have connection to the internet
			// skip checking
			if (navigator.onLine)
				bck.getList();
			bck.checkInt();
			setTimeout(arguments.callee, 120000);
		})();
		// Check online status of followed channels
		(function(){
			if (navigator.onLine)
				bck.getOnline();
			bck.checkInt();
			setTimeout(arguments.callee, 60000*local.Config.Interval_of_Checking);
		})();
	}
};

bck.init();