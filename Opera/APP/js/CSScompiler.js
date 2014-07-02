function CSScompiler() {
	var style = document.createElement('style'),
		format = local.Config.Format,
		AddAnyways, css;
	if (!format) {
		localJSON('Config', 'c', ['Format', 'Grid']);
		CSScompiler()
	} else {
		if (format == 'Full') {
			css = '.StreamDuration {color:black;margin:0 0 0 17;display:inline-block}'+
				'button:focus {outline-color:rgba(255,255,255,0)}'+
				'.streamer {width:170px;height:20px;display:inline-block;padding-left:3;padding-bottom:5}'+
				'.streamer>a {cursor:pointer;font-size:17;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4)}'+
				'.viewers {width:160px;height:20px;display:inline-block;text-align:right}'+
				'.viewers>p {cursor:default;width:75px;display:inline;text-transform:lowercase;padding-left:5px;border:none}'+
				'.content {height:200px;width:685px;padding:2;position:relative;font-size:17}'+
				'.tumblr {background:url("/img/StillDownloading.gif");height:200px;width:320px;display:inline;position:absolute;margin-left:10px}'+
				'.information {width:345px;height:130px;display:inline;position:absolute;right:0;top:15}'+
				'.information>div:first-child {width:337px;height:20px;display:block;border-bottom:1px solid black;margin-bottom:5px;cursor:default;z-index:1;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-top:6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:3}'+
				'.informationTextViewers {cursor:default;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);width:75px;display:inline}'+
				'.informationTextGame {text-align:center;border-top:1px solid black;height:20px;cursor:pointer;font-size:17;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:340px;display:block;padding-top:5px}'+
				'.GameTumb1, .GameTumb2{width:43px;height:60px;position:absolute;margin:139 0 0 -44}'+
				'.TumbStream {width:320px;height:200px}'+
				'.StreamOnChannelPage {width:340px;height:28px;padding-top:2px}'+
				'.StreamDurationDiv {width:170;height:20;position:absolute;right:16;top:90;text-align:right}'+
				'.ChannelPageDiv {width:150;height:40;display:inline}'+
				'.aFoundAbug {z-index:20;text-align:justify;font-size:21px;width:100%;display:block}'+
				'.foundAbug {z-index:19;padding:37 5 13 5;position:absolute;width:98px;height:113px;background:-webkit-gradient(linear, left top, left bottom, from(rgba(1,1,1,0.8)),to(rgba(1,1,1,0.5)))}'+
				'button.button {font-size:22px;width:150px;height:30px}';
		} else if (format == 'Mini') {
			css = '.StreamDuration {color:black;margin:0 0 0 17;font-size:19}'+
				'.streamer {width:180px;height:20px;display:inline-block}'+
				'.streamer>a {cursor:pointer;font-size:16;color:black;display:inline;padding-left:5px;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-left:5}'+
				'button:focus {outline-color:rgba(255,255,255,0)}'+
				'.viewers {width:150px;height:20px;position:absolute;right:12;text-align:right;top:20}'+
				'.viewers>p {cursor:default;width:75px;padding-left:5px;display:inline;border:none}'+
				'.content {height:90px;width:685px;padding:2;position:relative}'+
				'.information {width:535px;height:80px;display:inline;position:absolute;right:0;top:6}'+
				'.information>div:first-child {cursor:default;display:-webkit-inline-flex;z-index:1;padding-left:5px;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:525px;border-bottom:1px black solid}'+
				'.informationTextViewers {cursor:default;display:inline;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-left:5}'+
				'.informationTextGame {cursor:pointer;font-size:16;color:black;display:inline-block;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:195px;left:145px;text-align:center}'+
				'.tumblr {background:url("/img/StillDownloading.gif");height:60px;width:90px;display:inline;position:absolute;margin:5 0 0 10}'+
				'.LaunchStream {display:none!important}'+
				'.GameTumb1, .GameTumb2{width:43px;height:60px;position:absolute;margin:0 0 0 1}'+
				'.TumbStream {width:90px;height:60px}'+
				'.StreamOnChannelPage {width:530px;height:23px}'+
				'.StreamDurationDiv {width:160;height:23;text-align:right;display:inline-block}'+
				'.ChannelPageDiv {width:110;height:23;display:inline-block;margin-right:260px}'+
		        '.aFoundAbug {z-index:20;text-align:justify;font-size:21px;width:100%;display:block}'+
		        '.foundAbug {z-index:19;padding:37 5 13 5;position:absolute;width:98px;height:113px;background:-webkit-gradient(linear, left top, left bottom, from(rgba(1,1,1,0.8)),to(rgba(1,1,1,0.5)))}'+
				'button.button {font-size:18px;width:110px;height:22px}';
		} else if (format == 'Grid') {
			css = '.StreamDuration {color:white;text-shadow: 1px 2px 3px black;margin:0 0 0 17}'+
				'button:focus {outline-color:rgba(0,0,0,0)}'+
				'.streamer {width:165px;height:20px;display:inline-table;padding-top:6px}'+
				'.streamer>a {cursor:pointer;font-size:16;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);margin-left:3}'+
				'.viewers {width:150px;height:20px;display:inline-block;text-align:right}'+
				'.viewers>p {cursor:default;width:75px;display:inline;text-transform:lowercase;padding-left:5px;border:none}'+
				'.content {height:290px;width:330px;padding:2;position:relative;display:inline-block;margin-left:7}'+
				'.tumblr {background:url("/img/StillDownloading.gif");height:200px;width:320px;display:inline;position:absolute;margin-left:10px}'+
				'.information {width:315px;height:90px;display:inline;position:absolute;left:15;top:200}'+
				'.information>div:first-child {height:20px;display:inline-block;cursor:default;z-index:1;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-top:6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:315px;border-bottom:1px black solid}'+
				'.informationTextViewers {cursor:default;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);width:75px;display:inline}'+
				'.informationTextGame {text-align:center;border-top:1px solid black;height:20px;cursor:pointer;font-size:16;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:315px;display:block;padding-top:5px}'+
				'.GameTumb1, .GameTumb2{width:43px;height:60px;position:absolute;margin:139 0 0 -44}'+
				'.GamaTumb1:hover::after {content:attr(data-title);left:-2%;top:0%;width:305px;background:rgba(255,255,255,0.95);font-size:14px;padding:7 10;border:1px solid rgba(51, 51, 51, 0.34);-webkit-animation:fadeInDown 0.2s both;white-space:normal;display:block;position:absolute;font-size:17;z-index:1}'+
				'.TumbStream {width:320px;height:200px}'+
				'.StreamOnChannelPage {width:315px;height:40px;position:absolute;top:-197;left:-2;text-align:center}'+
				'.StreamDurationDiv {width:170;height:40;display:inline}'+
				'.ChannelPageDiv {display:none}'+
				'.aFoundAbug {z-index:20;text-align:justify;font-size:21px;width:100%;display:block}'+
				'.foundAbug {z-index:19;padding:37 5 13 5;position:absolute;width:98px;height:113px;background:-webkit-gradient(linear, left top, left bottom, from(rgba(1,1,1,0.8)),to(rgba(1,1,1,0.5)))}'+
				'button.button {font-size:22px;width:150px;height:30px}';
		}
		style.appendChild(document.createTextNode(css)); document.getElementsByTagName('head')[0].appendChild(style);
	}
}