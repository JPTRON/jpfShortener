chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
    var data = { url: tab.url};
      fetch("https://lacy-boulder-clutch.glitch.me/redirect", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(res => {
          if(res.redirectUrl !== false)
          {
            redUrl = res.redirectUrl;
            chrome.tabs.update({url: redUrl});
          }
        })
        .catch(err => console.log(err));
});