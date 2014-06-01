setInterval(function(){
    if (typeof localStorage.ChangedBG !== 'undefined' && window.location.pathname === '/background.html') {
        try { loc(); localStorage.removeItem('ChangedBG') } catch(e) { err(e) }
    } else if (typeof localStorage.ChangedPP !== 'undefined' && window.location.pathname === '/popup.html') {
        try { loc(); localStorage.removeItem('ChangedPP') } catch(e) { err(e) }
    }
}, 100);