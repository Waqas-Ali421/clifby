function clearList() {
    var list = document.getElementsByClassName('list')[0];
    
    while(list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

function loadMembers(members) {
    for(var i = 0; i < members.length; i++) {
        var name = members[i];
        var newItem = document.createElement("li");
        newItem.innerHTML = name;
        document.getElementsByClassName('list')[0].appendChild(newItem);
    }
}

function getActiveGroupId(cb) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        var tab = tabs[0];
        var urlParts = tab.url.split("/").filter(Boolean);

        for(var i = 0; i < urlParts.length; i++) {
            if(urlParts[i].toLowerCase() === "groups") {
                cb(urlParts[i+1]);
            }
        }

        cb(null);
    });
}

function isMembersPage(cb) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        var tab = tabs[0];
        var urlParts = tab.url.split("/").filter(Boolean);
        var lastPart = urlParts[urlParts.length - 1];

        if(lastPart.toLowerCase() === "members") {
            cb(true);
        } else {
            cb(false);
        }
    });
}

function getGroupById(groups, id) {
    for(var i = 0; i < groups.length; i++) {
        if(groups[i].id === id) {
            return groups[i];
        }
    }

    return null;
}

function displayMessage(msg) {
    var body = document.body;
    while(body.firstChild) {
        body.removeChild(body.firstChild);
    }

    var msgElement = document.createElement("h1");
    msgElement.innerHTML = msg;

    body.appendChild(msgElement);
}

document.addEventListener("DOMContentLoaded", function(e) {
    document.getElementById("addGroupButton").addEventListener("click", function() {
        chrome.runtime.sendMessage({type: 'addGroupRequest'}, function(data) {
            console.log(data);
        });
    }); 
});

// Process groups data
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type !== 'sendGroupsData') {
            return;
        }

        var groups = request.payload;

        getActiveGroupId(function(id) {
            if(!id) {
                console.log('no id found');
                return;
            }

            var group = getGroupById(groups, id);

            if(!group) {
                // current group has not yet been added
                isMembersPage(function(isMembers) {
                    if(!isMembers) {
                        displayMessage("This group has not been added yet.");
                    } else {
                        chrome.runtime.sendMessage({type: 'addGroupRequest'}, function(data) {
                            console.log(data);
                            displayMessage("X group has been added!");
                        });
                    }
                });
                return;
            }

            var titleElement = document.getElementsByClassName('groupTitle')[0];
            titleElement.innerHTML = group.name;

            clearList();
            loadMembers(group.members);

            console.log("sending modal request");

            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'getModalMembersRequest'
                }, function(response) {
                    var modalMembers = response.payload.members;
                    var members = group.members;
                    var nonModalMembers = members.filter(function(el) {
                        return modalMembers.indexOf(el) < 0;
                    });

                    clearList();
                    loadMembers(nonModalMembers);
                });
            });
        });
    }
);

chrome.runtime.sendMessage({type: 'getGroupsRequest'});
