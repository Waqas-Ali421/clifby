var groups = [];

function indexOfGroup(id) {
    for(var i = 0; i < groups.length; i++) {
        if(groups[i].id === id) {
            return i;
        }
    }

    return -1;
}

function addGroup(id, name, members) {
    if(indexOfGroup(id) === -1) {
        groups.push({
            id: id,
            name: name,
            members: members 
        });
    }
}

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
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'getGroupMembersRequest'
            }, function(response) {
                console.log(response);
                addGroup(response.id, response.name, response.members);

                sendResponse({
                    status: "success",
                    id: response.id,
                    name: response.name,
                    members: response.members
                });
            });
        });

        return true;
    }
);

// Receive get group data request from popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type !== 'getGroupsRequest') {
            return;
        }

        sendResponse({
            groups: groups
        });
    }
);

// Receive names payload from content script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type !== 'groupDataPayload') {
            return;
        }

        addGroup(request.id, request.name, request.members);
        console.log(groups);

        chrome.runtime.sendMessage({
            type: 'sendGroupsData',
            payload: groups  
        });

        sendResponse({status: "success"});
    }
);
