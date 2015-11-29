var CLIFBY_APP = {
    names: []
}

function isModalShowing() {
    var modals = document.getElementsByClassName('_4t2a');

    if(modals.length > 1) {
        return true;
    } else {
        return false;
    }
}

function isDisplayModal(modal) {
    if(modal.firstChild.style.opacity === "1") {
        return true; 
    } else {
        return false;
    }
}

function getDisplayModal() {
    var modals = document.getElementsByClassName('_4t2a');
    var modal = null;

    for(var i = 0; i < modals.length; i++) {
        if(isDisplayModal(modals[i])) {
            modal = modals[i]
        }
    }

    return modal;
}

function getNameFromElement(div) {
    return div.firstChild.innerHTML;
}

function getModalMembers(modal) {
    var memberElements = modal.getElementsByClassName('fsl fwb fcb');
    var members = [];

    for(var i = 0; i < memberElements.length; i++) {
        members.push(getNameFromElement(memberElements[i]));
    }

    return members;
}

function send() {
    var memberElements = document.getElementsByClassName('fsl fwb fcb');
    var names = [];
    for(var i = 0; i < memberElements.length; i++) {
        var element = memberElements[i];
        names.push(element.getElementsByTagName('a')[0].innerText);
    }

    CLIFBY_APP.names = names;

    var titleElement = document.getElementsByClassName('_5r2h')[0];
    var groupName = titleElement.innerHTML;
    var groupId = titleElement.href.split("/").filter(Boolean);
    groupId = groupId[groupId.length-1];

    chrome.runtime.sendMessage({
        type: 'groupDataPayload',
        name: groupName,
        id: groupId,
        members: names
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type !== 'getGroupMembersRequest') {
            return;
        }

        send();
    } 
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type !== 'getModalMembersRequest') {
            return;
        }

        if(isModalShowing()) {
            var modal = getDisplayModal();
            var members = getModalMembers(modal);

            console.log(members);
            sendResponse({
                status: 'success',
                payload: {
                    members: members
                }
            });
        } else {
            sendResponse({
                msg: 'no modal showing' 
            })
        }
    }
);
