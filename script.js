var CLIFBY_APP = {
    names: []
}

function send() {
    var elements = document.getElementsByClassName('fsl fwb fcb');
    var names = [];
    for(var i = 0; i < elements.length; i++) {
        var element = elements[i];
        names.push(element.getElementsByTagName('a')[0].innerText);
    }

    CLIFBY_APP.names = names;

    chrome.runtime.sendMessage({
        type: 'groupMembersPayload',
        names: names,
    });
}

console.log('loading');
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type !== 'getGroupMembersRequest') {
            return;
        }

        send();
    } 
);
