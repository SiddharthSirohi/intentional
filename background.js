chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    const url = new URL(details.url).hostname.toLowerCase();

    chrome.storage.sync.get("blockedSites", function(data) {
        const blockedSites = data.blockedSites || {};

        for (const blockedSite in blockedSites) {

            if (url.includes(blockedSite.toLowerCase()) && blockedSites[blockedSite]['status']) {  // Status check added

                const message = blockedSites[blockedSite]['message'];
                sessionStorage.setItem("message", message);  // Set the message in sessionStorage

                chrome.tabs.update(details.tabId, { url: "redirect.html" });
                return; // Important: Stop checking after a match
            }
        }
    });
});


chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    const url = new URL(details.url).hostname.toLowerCase();

    chrome.storage.sync.get("blockedSites", function (data) {
        const blockedSites = data.blockedSites || {};
        for (const blockedSite in blockedSites) {
            if (url.includes(blockedSite.toLowerCase()) && blockedSites[blockedSite]['status']) {
                const message = blockedSites[blockedSite]['message'];


                chrome.storage.local.set({ 'message': message }, function () {
                    chrome.tabs.update(details.tabId, { url: "redirect.html" });
                });
                return;
            }
        }
    });
});

