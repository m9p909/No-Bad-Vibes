// background.js

// change this event listened to check for the switch
// contextMenu ...






//browser.browserAction.onClicked.addListener(async (info, tab) => {});

/*
chrome.tabs.onUpdated.addListener((tabId,tab) => {
	if(tab.url && tab.url.includes("youtube.com/watch")){
		const queryParamters = tab.url.split("?")[1];
		const urlParamters = new URLSearchParams(queryParamters);
		console.log(urlParamters);

		chrome.tabs.sendMessage(tabId, {
			type: "NEW",
			videoId: urlParamters.get("v"),
		})
	}
})
*/


