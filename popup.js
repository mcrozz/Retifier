if (localStorage['Following'] != null && localStorage['Status'] != null && localStorage['Config'] != null) {
_gaq.push(['_trackPageview']);
JSONparse = JSON.parse(localStorage['Code']);
eval(JSONparse.Popup.code)
}