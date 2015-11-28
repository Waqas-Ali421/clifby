var CLIFBY_APP = {
    names: []
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
