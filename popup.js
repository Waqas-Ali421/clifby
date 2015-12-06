function clearList() {
    var list = document.getElementsByClassName('list')[0];
    
    while(list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

function clearHTML() {
    var body = document.body;
    while(body.firstChild) {
        body.removeChild(body.firstChild);
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

function changeGroupTitle(title) {
    var titleElement = document.getElementsByClassName('groupTitle')[0];
    titleElement.innerHTML = title;
}

function changeListTitle(title) {
    var titleElement = document.getElementsByClassName('listTitle')[0];

    titleElement.innerHTML = title;
}

function loadGroup(group) {
    changeGroupTitle(group.name);
    clearList();
    loadMembers(group.members);
}

function checkAndLoadModalMembers(group) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: 'getModalMembersRequest'
        }, function(response) {
            var modalMembers = response.payload.members;
            var title = oppositeTitle(response.payload.title);
            var members = group.members;

            if(title === "People who did not see this") {
                modalMembers.push(response.payload.poster);
            }

            var nonModalMembers = members.filter(function(el) {
                return modalMembers.indexOf(el) < 0;
            });

            clearList();
            loadMembers(nonModalMembers);
            changeListTitle(title);
        });
    });
}

function oppositeTitle(title) {
    title = title.toLowerCase();

    switch(title) {
        case "people who saw this":
            return "People who did not see this"
            break;
        case "people who like this":
            return "People who did not like this"
            break;
        case "people who voted for this option":
            return "People who did not vote for this option"
            break;
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

function isGroupsPage(cb) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        var tab = tabs[0];
        var urlParts = tab.url.split("/").filter(Boolean);

        console.log(urlParts);
        if(urlParts.indexOf('www.facebook.com') !== -1 &&
           urlParts.indexOf('groups') !== -1) {
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
    clearHTML()

    var body = document.body;
    var msgElement = document.createElement("h1");
    msgElement.innerHTML = msg;

    body.appendChild(msgElement);
}

isGroupsPage(function(isGroups) {
    if(isGroups) {
        chrome.runtime.sendMessage({type: 'getGroupsRequest'}, function(response) {
            var groups = response.groups;
            
            getActiveGroupId(function(id) {
                if(!id) {
                    console.log('ERROR: no id found. Not currently in a facebook groups page');
                    return;
                }

                var group = getGroupById(groups, id);
                if(!group) {
                    // current group has not yet been added
                    isMembersPage(function(isMembers) {
                        if(isMembers) {
                            // user is on the /members/ page so we can add the group
                            chrome.runtime.sendMessage({type: 'addGroupRequest'}, function(response) {
                                displayMessage(response.name + " has been added!");
                            });
                        } else {
                            displayMessage("This group has not been added yet.");
                        }
                    });
                } else {
                    // group has already been added and we have its data
                    loadGroup(group);
                    checkAndLoadModalMembers(group);
                }
            });
        });
    } else {
        displayMessage("Not a valid page for clifby!");
    }
});

var form = document.getElementsByTagName('form')[0];
form.addEventListener("submit", function(event) {
    event.preventDefault();
    var BB = get_blob();
    saveAs(
          new BB(
              ['hello eric']
            , {type: "text/plain;charset=" + document.characterSet}
        )
        , "testfile.txt"
    );
}, false);
