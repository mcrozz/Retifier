setInterval(function () { if (localStorage['JustReload'] == "1") {location.reload();localStorage['JustReload'] = null }}, 1000);
if (JSON.parse(localStorage['Code']).Background != undefined) {
        eval(JSON.parse(localStorage['Code']).Background.code)
}