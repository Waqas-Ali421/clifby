var groups = [];

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

// Receive get group data request from popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type !== 'getGroupsRequest') {
            return;
        }

        chrome.runtime.sendMessage({
            type: 'sendGroupsData',
            payload: groups
        });
    }
);

// Receive names payload from content script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type !== 'groupDataPayload') {
            return;
        }

        groups.push({
            members: request.names
        });

        chrome.runtime.sendMessage({
            type: 'sendGroupsData',
            payload: groups  
        });

        sendResponse({status: "success"});
    }
);
