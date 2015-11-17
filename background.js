console.log('bg running');

var names = null;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.payload === 'names') {
            console.log(sender);
            console.log(sendResponse);

            names = request.names;
        }
    }
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.payload === 'nameRequest') {
            sendResponse(names);
        }
    }
);
