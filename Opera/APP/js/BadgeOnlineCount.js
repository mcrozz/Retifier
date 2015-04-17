function BadgeOnlineCount(count) {
  chrome.browserAction.setBadgeText({ text: String(count) });
  if (count !== 0)
    chrome.browserAction.setBadgeBackgroundColor({color:"#593a94"});
  else
    chrome.browserAction.setBadgeBackgroundColor({color:"#c9c9c9"});
}
