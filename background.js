var names = null;

// Receive add group request from popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type !== 'addGroupRequest') {
            return;
        }

        // Request names from content script
        console.log('request sent to content script');
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            console.log(tabs);
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'getGroupMembersRequest'
            }, function(response) {
                console.log(response);
            });
        });

        sendResponse({status: "success"});
    }
);

// Receive names payload from content script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type !== 'groupMembersPayload') {
            return;
        }

        names = request.names;
        sendResponse({status: "success"});
    }
);
